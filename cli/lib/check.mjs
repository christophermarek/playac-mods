/* check.mjs - the whole contract over a mod folder, problems per file.
 *
 * Every rule comes from the game's mods.js (contract.mjs). readMod stops at the
 * first four reasons joined in one line, and at the first stage that fails
 * (JSON, then the manifest, then the content files), which suits an install
 * dialog, not a modder fixing a folder; so this runs the same exported pieces
 * one by one (normalizeEntries, parseJsonStrict, validateManifest, then
 * contentProblems: the content files' rules exactly as readMod runs them)
 * to list EVERY problem against its file in one run, each
 * content file checked whenever mod.json names it, even when mod.json has
 * problems of its own. Then it packs and runs readMod itself as the final
 * word. If readMod refuses something the pieces did not name, that refusal is
 * reported too: the CLI can never pass a mod the game would refuse, and never
 * refuses one the game takes.
 *
 * Warnings are things the game page accepts but that probably do not do what
 * the author meant, each saying what happens: a texture name the loader will
 * not match, a .png or .dds the game leaves out or the mod list refuses on
 * upload (dds.mjs), a picture smaller or another shape than the original, a
 * script that calls on() or cmd.* against its mod.json (scriptscan.mjs), a
 * shop good the game drops or re-prices (items.mjs). */
import fs from 'node:fs';
import { mods, fflate } from './contract.mjs';
import { readFolder } from './files.mjs';
import { EXTS } from './contract.mjs';
import { pack } from './pack.mjs';
import { readDds } from './dds.mjs';
import { scanScript } from './scriptscan.mjs';
import { luaSyntaxError } from './luasyntax.mjs';
import { loadItems, shopItemWarnings } from './items.mjs';

/* Dolphin's custom texture names, as the game engine parses them; a
 * mod may end one in .png as well, any case. */
export const TEXTURE_NAME_RE = /^tex1_[0-9]+x[0-9]+_[0-9a-fA-F]{16}(_([0-9a-fA-F]{16}|\$))?_[0-9]+\.(dds|png)$/i;

/* The engine's PNG rules (the game engine texpack_png_admit, the game engine): a
 * side at most 2048, and every switched-on mod's PNGs together at most 96 MiB
 * of decoded RGBA, 24 MiB on a phone. */
export const PNG_MAX_SIDE = 2048;
export const PNG_BUDGET = 96 * 1024 * 1024;
export const PNG_BUDGET_PHONE = 24 * 1024 * 1024;

const NOT_UTF8 = 'is not UTF-8 text: the game page reads each bad byte as a replacement character (U+FFFD), so its text may show wrong in the game; save it as UTF-8';
const UPLOAD_REFUSES = 'the mod list refuses it when you upload it';

/* A PNG's size from its header (signature + IHDR), as pc_png_size reads it, or null. */
export function pngSize(bytes) {
  const b = bytes;
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!b || b.length < 33 || sig.some((v, i) => b[i] !== v)) return null;
  const u32 = (o) => ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
  if (u32(8) !== 13 || String.fromCharCode(b[12], b[13], b[14], b[15]) !== 'IHDR') return null;
  const w = u32(16), h = u32(20), depth = b[24], ctype = b[25];
  const ok = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] }[ctype];
  if (!w || !h || !ok || !ok.includes(depth) || b[26] || b[27] || b[28] > 1) return null;
  return { w, h };
}

/* "\"messages/en.json\" is over 256 KB" -> messages/en.json */
function fileOf(problem, names) {
  const m = /^"((?:[^"\\]|\\.)*)"/.exec(problem);
  if (m) {
    try { return JSON.parse(`"${m[1]}"`); } catch { /* fall through */ }
  }
  for (const n of names) if (problem.startsWith(`${n}:`) || problem.startsWith(`${n} `)) return n;
  return '';
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/* Where a JSON text fails, by the grammar mods.js parseJsonStrict follows
 * (RFC 8259, no duplicate keys, no \u0000, at most depth levels): { at, what }
 * with at a character offset, or null when it finds no fault. Used only for
 * the position of a fault parseJsonStrict already found; the verdict is
 * always parseJsonStrict's. */
export function jsonFault(text, depthMax = 32) {
  let i = 0;
  const n = text.length;
  const NUM_RE = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
  class Fault { constructor(at, what) { this.at = at; this.what = what; } }
  const near = () => (i >= n ? 'the file ends' : `found ${JSON.stringify(text[i])}`);
  const fail = (what, at = i) => { throw new Fault(at, what); };
  const ws = () => { while (i < n && ' \t\n\r'.includes(text[i])) i++; };
  const str = () => {
    const open = i++;
    for (;;) {
      if (i >= n) fail('a string is not closed', open);
      const c = text.charCodeAt(i);
      if (c === 34) { i++; return text.slice(open + 1, i - 1); }
      if (c === 0) fail('a string holds a NUL character (\\u0000)');
      if (c < 0x20) fail(c === 10 ? 'a string runs past the end of the line (write \\n for a line break)' : 'a string holds a control character');
      if (c === 92) {
        const e = text[i + 1];
        if (e === 'u') {
          const h = text.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(h)) fail('\\u must be followed by 4 hex digits');
          if (parseInt(h, 16) === 0) fail('a string holds a NUL character (\\u0000)');
          i += 6;
        } else if ('"\\/bfnrt'.includes(e || 'x')) i += 2;
        else fail(`${JSON.stringify(`\\${e || ''}`)} is not a JSON escape`);
        continue;
      }
      i++;
    }
  };
  const value = (depth) => {
    if (depth > depthMax) fail(`nested more than ${depthMax} levels deep`);
    ws();
    if (i >= n) fail('a value is missing: the file ends');
    const c = text[i];
    if (c === '﻿') fail('the file starts with a byte order mark (BOM): save it as UTF-8 without BOM');
    if (c === '{') {
      i++;
      const keys = new Set();
      ws();
      if (text[i] === '}') { i++; return; }
      for (;;) {
        ws();
        if (text[i] !== '"') fail(`expected a key in double quotes, ${near()}${text[i] === '}' ? ' (a comma before "}" is not allowed)' : ''}`);
        const at = i;
        const k = str();
        if (keys.has(k)) fail(`duplicate key ${JSON.stringify(k)}`, at);
        keys.add(k);
        ws();
        if (text[i] !== ':') fail(`expected ":" after the key, ${near()}`);
        i++;
        value(depth + 1);
        ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === '}') { i++; return; }
        fail(`expected "," or "}", ${near()}`);
      }
    }
    if (c === '[') {
      i++;
      ws();
      if (text[i] === ']') { i++; return; }
      for (;;) {
        ws();
        if (text[i] === ']') fail('a comma before "]" is not allowed');
        value(depth + 1);
        ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === ']') { i++; return; }
        fail(`expected "," or "]", ${near()}`);
      }
    }
    if (c === '"') { str(); return; }
    for (const w of ['true', 'false', 'null']) if (text.startsWith(w, i)) { i += w.length; return; }
    NUM_RE.lastIndex = i;
    const m = NUM_RE.exec(text);
    if (!m || !m[0].length || m[0] === '-') fail(c === "'" ? 'strings take double quotes, not single' : `expected a value, ${near()}`);
    if (!Number.isFinite(Number(m[0]))) fail('a number is out of range');
    i += m[0].length;
  };
  try {
    value(0);
    ws();
    if (i !== n) fail(`more after the end of the JSON value, ${near()}`);
  } catch (e) {
    if (e instanceof Fault) return e;
    return null;
  }
  return null;
}

/* Line and column (1-based, in characters) of offset in text. */
export function lineCol(text, at) {
  const before = text.slice(0, at);
  const line = before.split('\n').length;
  const col = Array.from(before.slice(before.lastIndexOf('\n') + 1)).length + 1;
  return { line, col };
}

/* { value } or { error, said }: error is check's line (with a position when
 * the fault is found), said is the line readMod prints for the same fault, so
 * it is not listed twice. */
function parseJson(name, bytes) {
  /* As mods.js decodeUtf8: not fatal, so bad bytes do not refuse the file
   * there; here they are a warning (notUtf8). */
  let notUtf8 = false;
  try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { notUtf8 = true; }
  const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes);
  try {
    return { value: mods.parseJsonStrict(text), notUtf8 };
  } catch (e) {
    /* The words mods.js parseFile uses. */
    const said = e && e.jsonRule ? `${name}: ${e.message}` : `${name} is not valid JSON`;
    const f = jsonFault(text, (mods.LIMITS && mods.LIMITS.MAX_JSON_DEPTH) || 32);
    if (!f) return { error: said, said };
    const { line, col } = lineCol(text, f.at);
    const why = e && e.jsonRule ? e.message : `this is not valid JSON (${f.what})`;
    return { error: `${name}: line ${line}, column ${col}: ${why}`, said };
  }
}

/* Tool files a mod folder often holds that the pack rule takes (a .json) but
 * the game never reads. */
const TOOL_FILES = new Set(['package.json', 'package-lock.json', 'npm-shrinkwrap.json', 'tsconfig.json', 'jsconfig.json',
  'composer.json', 'deno.json', 'renovate.json', 'biome.json']);

/* files that go in the ZIP (the pack rule takes every .json .dds .png)
 * but that nothing in mod.json points at, so the game never reads them: a
 * package.json, a stray export. A warning, not a problem: the pack rule is
 * shared with the registry's GitHub import (pack-cases.json), and an extra
 * file is harmless, only wasted bytes that players download. Docs (.md .txt)
 * and scripts (warned about on their own) are left alone. */
export function unusedFileWarnings(manifest, names) {
  if (!isObj(manifest)) return [];
  const c = isObj(manifest.content) ? manifest.content : {};
  const used = new Set(['mod.json']);
  const dirs = [];
  for (const k of ['messages', 'shops', 'items', 'letters', 'events', 'talk']) {
    if (typeof c[k] !== 'string' || !c[k]) continue;
    used.add(c[k]);
    if (k === 'messages') dirs.push(c[k].replace(/\/$/, '') + '/');
  }
  if (typeof c.textures === 'string' && c.textures) dirs.push(c.textures.replace(/\/$/, '') + '/');
  const out = [];
  for (const name of names) {
    const lower = name.toLowerCase();
    if (!/\.(json|dds|png)$/.test(lower)) continue;
    if (used.has(name) || dirs.some((d) => name.startsWith(d))) continue;
    const base = lower.slice(lower.lastIndexOf('/') + 1);
    out.push({
      file: name,
      message: TOOL_FILES.has(base)
        ? `is a tool's file (${base}), not part of the mod: the game never reads it, but it is packed and every player downloads it. Move it out of the mod folder, or keep the mod in a subfolder of your project`
        : 'is packed, but nothing in mod.json points at it, so the game never reads it: name it in "content", or move it out of the mod folder',
    });
  }
  return out;
}

/* the mailbox list has an 8-character sender slot. A letter with no
 * "sender" shows its footer's first 8 characters there, so a longer footer is
 * cut mid-word ("The Lantern Keepers" reads "The Lant"). A warning: the letter
 * itself signs with the whole footer, and the game takes it as it is. */
export function letterSenderWarnings(doc) {
  if (!isObj(doc) || !Array.isArray(doc.letters)) return [];
  const out = [];
  const max = mods.LETTER_SENDER_MAX; /* the game's sender slot (not a copy) */
  doc.letters.forEach((L, k) => {
    if (!isObj(L) || Object.prototype.hasOwnProperty.call(L, 'sender') || typeof L.footer !== 'string') return;
    if (L.footer.length <= max) return;
    const name = typeof L.id === 'string' ? `"${L.id}"` : String(k + 1);
    out.push(`letters: letter ${name}: the mailbox list shows only ${max} characters of who it is from, so it reads ${JSON.stringify(L.footer.slice(0, max).trimEnd())} there (the letter itself signs ${JSON.stringify(L.footer)}). Add "sender" with a name of up to ${max} characters for the list`);
  });
  return out;
}

/* The texture warnings for the files under dir. */
function textureWarnings(dir, names, ents, warn) {
  let pngBytes = 0;
  const same = new Map(); /* texture name without extension, lower case -> files */
  for (const name of names.filter((x) => x.startsWith(dir))) {
    const base = name.slice(name.lastIndexOf('/') + 1);
    const lower = base.toLowerCase();
    const png = lower.endsWith('.png');
    if (!lower.endsWith('.dds') && !png) continue;
    if (!TEXTURE_NAME_RE.test(base)) {
      warn(name, 'not a texture name the game matches (tex1_<w>x<h>_<hash>[_<palette>]_<format>.dds or .png); find names with the texture inspector');
      continue;
    }
    const key = lower.slice(0, -4);
    if (!same.has(key)) same.set(key, []);
    same.get(key).push(name);
    let size = null;
    if (png) {
      size = pngSize(ents[name]);
      if (!size) {
        warn(name, 'not a PNG the game reads: the game leaves it out, and the mod list refuses it');
        continue;
      }
      if (size.w > PNG_MAX_SIDE || size.h > PNG_MAX_SIDE) {
        warn(name, `is ${size.w}x${size.h}: a PNG texture is at most ${PNG_MAX_SIDE}x${PNG_MAX_SIDE}, so the game leaves it out and the mod list refuses it`);
        continue;
      }
      pngBytes += size.w * size.h * 4;
    } else {
      const d = readDds(ents[name]);
      if (d.error) {
        /* The engine (texpack_dds_read) reads the header and level 0 only: it
         * draws a file with bytes after level 0, never a bad or short one. */
        const drawn = /^(stores \d+ mip levels|has \d+ bytes after)/.test(d.error);
        warn(name, `${d.error} ${drawn ? 'The game still draws it, but ' : 'The game cannot draw it, and '}${UPLOAD_REFUSES}.`);
      }
      if (d.w && d.h) size = { w: d.w, h: d.h };
    }
    if (size) {
      const [, ow, oh] = /^tex1_([0-9]+)x([0-9]+)_/i.exec(base).map(Number);
      if (size.w < ow || size.h < oh) {
        warn(name, `is ${size.w}x${size.h}, smaller than the original ${ow}x${oh}: the game stretches it over the original's place, so it looks blurrier than the game's own texture`);
      }
      if (size.w * oh !== size.h * ow) {
        warn(name, `is ${size.w}x${size.h}, not the shape of the original ${ow}x${oh}: the game stretches it to the original's shape, so it looks squashed`);
      }
    }
  }
  for (const files of same.values()) {
    if (files.length < 2) continue;
    warn(files[0], `${files.join(' and ')} are the same texture: the game uses only one of them (the first it finds when it scans the folder, which you cannot choose), so the other is never drawn`);
  }
  const mib = (n) => `${Math.round(n / (1024 * 1024))} MiB`;
  if (pngBytes > PNG_BUDGET) {
    warn(dir, `the PNG textures are ${mib(pngBytes)} of pixels once loaded; the game loads at most ${mib(PNG_BUDGET)} of PNG pixels across all mods and leaves the rest out`);
  } else if (pngBytes > PNG_BUDGET_PHONE) {
    warn(dir, `the PNG textures are ${mib(pngBytes)} of pixels once loaded; on a phone the game loads at most ${mib(PNG_BUDGET_PHONE)} of PNG pixels and leaves the rest out`);
  }
}

/* entries: {path: Uint8Array}. Returns { ok, problems: [{file, message}],
 * warnings: [{file, message}], manifest, result } where result is pack()'s
 * answer when ok. opts.lua: check Lua syntax with the game's parser (default true).
 * opts.items: the item table (items.mjs itemTable), null for none; default:
 * the generated items.json when there is one. */
export async function checkEntries(entries, opts = {}) {
  const problems = [];
  const warnings = [];
  const said = new Set(); /* readMod's words for a problem already listed in check's own */
  const add = (list, file, message) => list.push({ file, message });
  const warn = (file, message) => add(warnings, file, message);
  const n = mods.normalizeEntries(entries);
  for (const p of n.problems) add(problems, fileOf(p, n.names), p);
  const ents = n.entries;
  const names = n.names;
  const json = {};
  const parsed = new Map();
  for (const name of names) {
    if (!name.toLowerCase().endsWith('.json')) continue;
    const r = parseJson(name, ents[name]);
    parsed.set(name, r);
    if (r.error) { add(problems, name, r.error); said.add(r.said); } else json[name] = r.value;
    if (r.notUtf8) warn(name, NOT_UTF8);
  }
  /* A content file by its path, as readMod's doc() reads it: parsed whatever
   * its name, with the .json size cap. undefined when it is missing or bad. */
  const MAX_JSON = (mods.LIMITS && mods.LIMITS.MAX_JSON) || 256 * 1024;
  const docOf = (p) => {
    if (typeof p !== 'string' || !Object.prototype.hasOwnProperty.call(ents, p)) return undefined;
    if (!parsed.has(p)) {
      if (ents[p].length > MAX_JSON) {
        const r = { error: `${JSON.stringify(p)} is over 256 KB` };
        r.said = r.error;
        parsed.set(p, r);
      } else parsed.set(p, parseJson(p, ents[p]));
      const r = parsed.get(p);
      if (r.error) { add(problems, p, r.error); said.add(r.said); }
      if (r.notUtf8) warn(p, NOT_UTF8);
    }
    return parsed.get(p).value;
  };
  const manifest = json['mod.json'];
  if (manifest !== undefined) {
    for (const e of mods.validateManifest(manifest, names)) add(problems, 'mod.json', e);
    const c = isObj(manifest) && isObj(manifest.content) ? manifest.content : {};
    const api = isObj(manifest) ? manifest.api : undefined;
    /* every rule of the content files (the items file and renames, the
     * shops file and its level, letters, events, talk, messages and their
     * translations) is the game's own: mods.js contentProblems, the function
     * readMod runs. docOf has already reported a file that is too big or not
     * JSON, so such a file is skipped here (null). */
    const read = (p) => {
      const v = docOf(p);
      return v === undefined ? null : { value: v };
    };
    for (const x of mods.contentProblems(manifest, names, read)) add(problems, x.file, x.message);
    /* warnings: what the game takes but probably not as meant */
    const shopsDoc = c.shops ? docOf(c.shops) : undefined;
    if (shopsDoc !== undefined) {
      const table = opts.items !== undefined ? opts.items : loadItems();
      for (const w of shopItemWarnings(shopsDoc, table)) warn(c.shops, w);
    }
    const lettersDoc = c.letters ? docOf(c.letters) : undefined;
    if (lettersDoc !== undefined) for (const w of letterSenderWarnings(lettersDoc)) warn(c.letters, w);
    if (typeof api === 'number' && api < mods.API_MAX) {
      warn('mod.json', `"api" is ${api}; the game's newest mod API level is ${mods.API_MAX}`);
    }
    if (typeof c.textures === 'string') textureWarnings(c.textures.replace(/\/$/, '') + '/', names, ents, warn);
    for (const w of unusedFileWarnings(manifest, names)) warn(w.file, w.message);
    const scripts = isObj(manifest) && isObj(manifest.scripts) ? manifest.scripts : null;
    const main = scripts && scripts.main;
    for (const name of names.filter((x) => x.endsWith('.lua'))) {
      if (name !== main) warn(name, 'is not scripts.main: the game runs only the main script (there is no require)');
    }
    if (typeof main === 'string' && ents[main]) {
      const src = new TextDecoder('utf-8').decode(ents[main]);
      const ctxs = {
        api: typeof api === 'number' ? api : 1,
        hooks: Array.isArray(scripts.hooks) ? scripts.hooks : [],
        permissions: Array.isArray(manifest.permissions) ? manifest.permissions : [],
        events: mods.HOOKS_V2 || mods.HOOKS,
        commands: mods.PERMISSIONS || [],
      };
      /* An on() the game refuses stops the whole script at load (the game engine
       * api_on raises): the mod installs, but its script is dead, so that is a
       * problem, not a warning. */
      for (const w of scanScript(src, ctxs)) {
        if (w.error) problems.push({ file: main, message: w.message, script: true });
        else warn(main, w.message);
      }
    }
  }
  /* the game's own Lua 5.4.7 parser, compiled to WebAssembly, so the
   * syntax is checked on every machine (it used to need a luac on PATH and
   * said nothing without one). A syntax error stops the script at load. */
  let luaChecked = false;
  if (opts.lua !== false) {
    for (const name of names.filter((x) => x.toLowerCase().endsWith('.lua'))) {
      const why = await luaSyntaxError(name, ents[name]);
      if (why) problems.push({ file: name, message: `${why} (a Lua syntax error: the game stops this script when it loads)`, script: true });
    }
    luaChecked = true;
  }
  /* The final word: the ZIP through readMod, exactly as the Mods tab installs it. */
  let result = null;
  try {
    result = await pack(ents);
  } catch (e) {
    const words = String((e && e.message) || e).split(/;\s+/).filter(Boolean);
    for (const s of words) {
      if (!said.has(s) && !problems.some((p) => p.message === s)) add(problems, fileOf(s, names), s);
    }
  }
  if (result && problems.length) result = null;
  /* installs: what readMod says (the Mods tab takes the mod); ok also needs a
   * script the game would run. A problem with `script: true` is one the game
   * installs but whose script it stops at load. */
  const installs = problems.every((p) => p.script);
  return { ok: problems.length === 0, installs, problems, warnings, manifest, result, luaChecked };
}

/* Would a hand-made ZIP of the folder be refused for this left-out file? The
 * game drops junk (mods.js isJunk: __MACOSX, Thumbs.db and any hidden name,
 * so .gitignore and the hidden tool folders are fine) and takes any
 * mod file type; anything else (a .zip in dist/, LICENSE) refuses the whole
 * mod. */
export function handZipRefuses(rel) {
  if (mods.isJunk(rel)) return false;
  const parts = rel.split('/');
  const base = parts[parts.length - 1];
  const dot = base.lastIndexOf('.');
  return !EXTS.includes(dot < 0 ? '' : base.slice(dot).toLowerCase());
}

/* A folder: checkEntries plus the files the pack rule left out. A path to a
 * .zip is checked as the ZIP itself, exactly as the Mods tab reads it:
 * a ZIP made by hand (Finder's Compress, Windows' Send to) holds whatever the
 * folder held, so a stray file the pack rule would leave out is a problem
 * there. */
export async function checkFolder(dir, opts = {}) {
  if (/\.zip$/i.test(dir) && fs.existsSync(dir) && fs.statSync(dir).isFile()) return checkZip(dir, opts);
  const f = readFolder(dir);
  const r = await checkEntries(f.entries, opts);
  /* Only files you can see in a file manager: a hidden one (.gitignore, which
   * every `new` folder has) would be refused too, but warning on every
   * scaffold teaches nothing; the docs say to use pack. */
  const handZip = f.leftOut.filter((l) => handZipRefuses(l.path));
  if (handZip.length && r.ok) {
    const list = handZip.slice(0, 3).map((l) => l.path).join(', ') + (handZip.length > 3 ? ` and ${handZip.length - 3} more` : '');
    r.warnings.push({ file: '', message: `holds ${list}, which \`pack\` leaves out; a ZIP you make by hand (Compress, Send to) would include ${handZip.length === 1 ? 'it' : 'them'}, and the game refuses a mod with ${handZip.length === 1 ? 'that file' : 'those files'}. Use \`playac-mod pack\`, or move ${handZip.length === 1 ? 'it' : 'them'} out of the folder first` });
  }
  return { ...r, leftOut: f.leftOut, entries: f.entries };
}

/* A mod ZIP: unzipped as the game unzips it, every rule over its files, then
 * the game's own reader over the ZIP's bytes as the last word (size, CRCs). */
export async function checkZip(file, opts = {}) {
  const bytes = new Uint8Array(fs.readFileSync(file));
  let raw;
  try {
    raw = fflate.unzipSync(bytes);
  } catch (e) {
    return { ok: false, problems: [{ file: '', message: `${file} is not a ZIP the game can read (${e.message})` }], warnings: [], manifest: undefined, result: null, leftOut: [], entries: {}, luaChecked: false };
  }
  const r = await checkEntries(raw, opts);
  try {
    mods.readMod(bytes, fflate);
  } catch (e) {
    for (const s of String((e && e.message) || e).split(/;\s+/).filter(Boolean)) {
      if (!r.problems.some((p) => p.message === s)) r.problems.push({ file: '', message: s });
    }
  }
  r.ok = r.problems.length === 0;
  r.installs = r.problems.every((p) => p.script);
  if (!r.ok) r.result = null;
  return { ...r, leftOut: [], entries: raw, zip: true };
}

/* The errors catalogue entry for one problem, or '': mods.js names it
 * with the same code the Mods tab and the registry use. */
export function errorDocUrl(message) {
  const code = typeof mods.errorCode === 'function' ? mods.errorCode(message) : '';
  return code ? `${mods.ERROR_DOCS || 'https://playaconline.com/modding/errors/'}#${code}` : '';
}

/* Group problems by file for printing. */
export function formatReport(r, { verbose = false } = {}) {
  const lines = [];
  const group = (list, label) => {
    const by = new Map();
    for (const p of list) {
      const k = p.file || '(the mod)';
      if (!by.has(k)) by.set(k, []);
      by.get(k).push(p.message);
    }
    for (const [file, msgs] of by) {
      lines.push(`${label} ${file}`);
      for (const m of msgs) {
        lines.push(`    ${m}`);
        const doc = errorDocUrl(m);
        if (doc) lines.push(`      see ${doc}`);
      }
    }
  };
  group(r.problems, 'error');
  group(r.warnings || [], 'warn ');
  if (verbose && r.leftOut && r.leftOut.length) {
    for (const l of r.leftOut) lines.push(`skip  ${l.path}: ${l.why}`);
  }
  return lines.join('\n');
}

export { fflate };
