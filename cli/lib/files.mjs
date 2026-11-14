/* files.mjs - which files of a folder make the mod.
 *
 * THE PACK RULE. `playac-mod pack`, `check`, `dev` and the registry's
 * "Import from GitHub" (backend the game's server) all pick a mod's files
 * from a folder by this one rule, so a GitHub repo, a working folder and the
 * ZIP built from either hold the same files. the contract's test cases
 * holds the shared cases; the node test and the Go test both run them.
 *
 * A file is LEFT OUT when:
 *   - any part of its path starts with "." (.git, .github, .vscode, .playac,
 *     .gitignore, .DS_Store, ._foo)
 *   - any part is "node_modules" or "__MACOSX"
 *   - its extension (any case) is not one a mod may hold: .json .lua .dds
 *     .png .txt .md (so LICENSE, a .yml workflow or the packed .zip stay out)
 *   - it is CHANGELOG.md at the top (any case): publish and the GitHub import
 *     send its section beside the ZIP as the listing's changelog, so editing
 *     it must not change the mod's content hash
 * Every other file goes in, and the contract (mods.js readMod) then checks it. */
import fs from 'node:fs';
import path from 'node:path';
import { EXTS } from './contract.mjs';

const SKIP_PARTS = new Set(['node_modules', '__MACOSX']);

/* Why rel (a "/" path inside the mod folder) is left out, or '' when it goes in. */
export function leftOutReason(rel) {
  if (rel.toLowerCase() === 'changelog.md') return 'the changelog (sent with the listing, not in the mod)';
  const parts = rel.split('/');
  if (parts.some((p) => p.startsWith('.'))) return 'hidden (a name starting with ".")';
  if (parts.some((p) => SKIP_PARTS.has(p))) return 'a tool folder';
  const base = parts[parts.length - 1];
  const dot = base.lastIndexOf('.');
  const ext = dot < 0 ? '' : base.slice(dot).toLowerCase();
  if (!EXTS.includes(ext)) return `not a mod file type (only ${EXTS.join(' ')})`;
  return '';
}

/* Every file under dir as "/" paths, sorted by byte order. Symlinks are not
 * followed (a link out of the folder must never pack someone's home). */
export function walk(dir) {
  const out = [];
  const visit = (abs, rel) => {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      if (ent.isDirectory()) {
        /* Never descend into a folder whose files would all be left out. */
        if (ent.name.startsWith('.') || SKIP_PARTS.has(ent.name)) continue;
        visit(path.join(abs, ent.name), r);
      } else if (ent.isFile()) out.push(r);
    }
  };
  visit(dir, '');
  return out.sort(byteOrder);
}

export function byteOrder(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return Buffer.compare(x, y);
}

/* The mod in dir: { entries: {path: Uint8Array}, names, leftOut: [{path, why}] }. */
export function readFolder(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) throw new Error(`${dir} is not a folder`);
  const entries = {};
  const leftOut = [];
  for (const rel of walk(dir)) {
    const why = leftOutReason(rel);
    if (why) { leftOut.push({ path: rel, why }); continue; }
    entries[rel] = new Uint8Array(fs.readFileSync(path.join(dir, ...rel.split('/'))));
  }
  return { entries, names: Object.keys(entries).sort(byteOrder), leftOut };
}
