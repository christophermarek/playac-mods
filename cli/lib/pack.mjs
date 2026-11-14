/* pack.mjs - a mod folder to its ZIP, the same bytes every time.
 *
 * Deterministic: entries in a fixed order (mod.json first, then byte order of
 * the path, the order the registry's rebuilt ZIP uses, backend validate.go
 * rebuild), every timestamp 1980-01-01 00:00 (the earliest a ZIP can say, and
 * the registry's rebuiltModTime), one compression level, no comment. So the
 * same folder packs to the same ZIP on any machine and in any time zone with
 * the same fflate build.
 *
 * What NAMES the mod is not the ZIP's sha256 but its content hash (contract
 * "Modset hash", mods.js contentSha): sha256 over "<file sha256> <path>\n"
 * lines. The registry rebuilds every ZIP, so only the content hash matches
 * between the author's ZIP, the registry's copy and a GitHub import. */
import { createHash } from 'node:crypto';
import { fflate, mods } from './contract.mjs';
import { byteOrder } from './files.mjs';

/* Local midnight, 1 Jan 1980: fflate writes the DOS time from LOCAL getters,
 * so a UTC date would shift (and before 1980 throw) in some time zones. */
export const ZIP_TIME = new Date(1980, 0, 1, 0, 0, 0);

/* entries: {path: Uint8Array}. Returns the ZIP bytes. */
export function zipEntries(entries) {
  const names = Object.keys(entries).sort(byteOrder);
  const ordered = names.includes('mod.json') ? ['mod.json', ...names.filter((n) => n !== 'mod.json')] : names;
  const files = {};
  for (const n of ordered) {
    /* PNG is already compressed: store it. Everything else at level 9. */
    const level = n.toLowerCase().endsWith('.png') ? 0 : 9;
    files[n] = [entries[n], { level, mtime: ZIP_TIME, os: 3, attrs: 0o100644 << 16 }];
  }
  return fflate.zipSync(files, { level: 9, mtime: ZIP_TIME });
}

export function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

/* Pack entries and read the result back through the game's own reader.
 * Returns { zip, sha256, contentSha, manifest, modsetLine } or throws the
 * reader's refusal. */
export async function pack(entries) {
  const zip = zipEntries(entries);
  const mod = mods.readMod(zip, fflate);
  const contentSha = await mods.contentSha(mod.entries);
  const m = mod.manifest;
  return {
    zip, sha256: sha256Hex(zip), contentSha, manifest: m,
    /* The line a friend visit's modset hash is made of (world mods only). */
    modsetLine: `${m.id}@${m.version}#${contentSha}`,
    files: mod.names.length, unpacked: mod.unpacked,
  };
}
