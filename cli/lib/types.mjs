/* types.mjs - `playac-mod types`: editor types and schemas.
 *
 * Writes into <mod>/.playac/:
 *   playac.lua                  LuaLS annotations of the script API
 *   schemas/mod.schema.json     mod.json
 *   schemas/shops.schema.json   shops.json
 *   schemas/messages.schema.json  messages files
 *
 * Source, first that has playac.lua:
 *   1. $PLAYAC_API_DIR
 *   2. the monorepo's generated outputs of api/api.json (the Phase 1 API
 *      spine): api/, then api/
 *   3. vendor/api (copied there by the game's build for the npm package)
 *   4. fallback/ in this package (hand-written for mod API level 1)
 * Each file falls back on its own, so a spine that generates only the
 * schemas still gets the fallback playac.lua.
 *
 * then, for a mod with "depends", each dependency's mod.json "exports"
 * (a library's remote functions, one line each) is appended to the copied
 * .playac/playac.lua as remote.call hints: the editor offers the library's
 * function names with their descriptions. A dependency is found in a folder
 * beside this one (any sibling whose mod.json has that id), or in a folder
 * or mod.json listed in $PLAYAC_LIBS (separated like PATH). */
import fs from 'node:fs';
import path from 'node:path';
import { PKG, VENDOR } from './contract.mjs';
import { CHECKOUT } from './checkout.mjs';
import { TYPES_DIR } from './scaffold.mjs';

export const TYPE_FILES = [
  'playac.lua',
  'schemas/mod.schema.json',
  'schemas/shops.schema.json',
  'schemas/messages.schema.json',
  /* api 2 content files (fresh-eyes: new did not write the mod items schema) */
  'schemas/mod-items.schema.json',
  'schemas/letters.schema.json',
  'schemas/events.schema.json',
  'schemas/talk.schema.json',
];

export function typeSources() {
  const list = [];
  if (process.env.PLAYAC_API_DIR) list.push(path.resolve(process.env.PLAYAC_API_DIR));
  list.push(...(CHECKOUT ? CHECKOUT.api : []), path.join(VENDOR, 'api'));
  list.push(path.join(PKG, 'fallback'));
  return list;
}

/* The source of one file: generated outputs may sit flat or under schemas/. */
export function findTypeFile(rel) {
  for (const dir of typeSources()) {
    for (const cand of [rel, path.basename(rel)]) {
      const abs = path.join(dir, cand);
      if (fs.existsSync(abs)) return abs;
    }
  }
  return null;
}

const EXPORT_NAME = /^[a-z0-9_]{1,32}$/;

function readManifest(file) {
  try {
    const m = JSON.parse(fs.readFileSync(file, 'utf8'));
    return m && typeof m === 'object' && !Array.isArray(m) ? m : null;
  } catch (_) { return null; }
}

/* The exports a library declares, when they follow the rules (the game's own,
 * mods.js rulesV2Exports): { name: description } or null. */
export function exportsOf(manifest) {
  const x = manifest && manifest.exports;
  if (!x || typeof x !== 'object' || Array.isArray(x) || Object.keys(x).length > 32) return null;
  for (const [k, d] of Object.entries(x)) {
    if (!EXPORT_NAME.test(k) || typeof d !== 'string' || ![...d].length || [...d].length > 120 || /[\u0000-\u001f\u007f]/.test(d)) return null;
  }
  return x;
}

/* The mod.json of each mod `manifest` depends on that can be found: { id: { manifest, from } }. */
export function findLibraries(dir, manifest, env = process.env) {
  const want = manifest && manifest.depends && typeof manifest.depends === 'object' ? Object.keys(manifest.depends) : [];
  const found = {};
  if (!want.length) return found;
  const cands = [];
  for (const p of String(env.PLAYAC_LIBS || '').split(path.delimiter).filter(Boolean)) {
    const abs = path.resolve(p);
    cands.push(abs.endsWith('.json') ? abs : path.join(abs, 'mod.json'));
  }
  const parent = path.dirname(path.resolve(dir));
  let sibs = [];
  try { sibs = fs.readdirSync(parent, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort(); } catch (_) { sibs = []; }
  for (const name of sibs) {
    const abs = path.join(parent, name);
    if (abs !== path.resolve(dir)) cands.push(path.join(abs, 'mod.json'));
  }
  for (const file of cands) {
    const m = readManifest(file);
    if (m && typeof m.id === 'string' && want.includes(m.id) && !found[m.id]) found[m.id] = { manifest: m, from: path.dirname(file) };
  }
  return found;
}

/* LuaLS hints for remote.call, one overload per library with exports: its
 * names (and descriptions) offered for "name". '' when there are none. */
export function exportHints(libs) {
  const out = [];
  for (const id of Object.keys(libs).sort()) {
    const x = exportsOf(libs[id].manifest);
    if (!x || !Object.keys(x).length) continue;
    const alias = 'PlayacExports_' + id.replace(/[^A-Za-z0-9_]/g, '_');
    out.push('', `---@alias ${alias}`);
    for (const k of Object.keys(x).sort()) out.push(`---| "${k}" # ${x[k].trim()}`);
    out.push('', `---Calls a function ${id} offers (its mod.json "exports"). Its errors come back as yours.`);
    for (const k of Object.keys(x).sort()) out.push(`--- - \`${k}\`: ${x[k].trim()}`);
    out.push(`---@param mod "${id}"`, `---@param name ${alias}`, '---@param ... any Copied arguments.', '---@return any', 'function remote.call(mod, name, ...) end');
  }
  if (!out.length) return '';
  return ['', '-- Remote functions of the mods this one depends on, from their mod.json "exports".',
    '-- Written by playac-mod types: run it again after a library changes.', ...out, ''].join('\n');
}

/* Write the types into dir/.playac. Returns [{file, from}]. */
export function writeTypes(dir) {
  const out = [];
  for (const rel of TYPE_FILES) {
    const from = findTypeFile(rel);
    /* The api 2 schemas are not in the hand-written api 1 fallback. */
    if (!from && TYPE_FILES.indexOf(rel) >= 4) continue;
    if (!from) throw new Error(`no source for ${rel}`);
    const to = path.join(dir, TYPES_DIR, ...rel.split('/'));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    out.push({ file: path.posix.join(TYPES_DIR, rel), from });
  }
  /* the dependencies' exports, after the API's own types */
  const manifest = readManifest(path.join(dir, 'mod.json'));
  const libs = findLibraries(dir, manifest);
  const hints = exportHints(libs);
  if (hints) {
    fs.appendFileSync(path.join(dir, TYPES_DIR, 'playac.lua'), hints);
    for (const id of Object.keys(libs).sort()) {
      if (exportsOf(libs[id].manifest)) out.push({ file: path.posix.join(TYPES_DIR, 'playac.lua') + ` (remote.call hints for ${id})`, from: libs[id].from });
    }
  }
  return out;
}
