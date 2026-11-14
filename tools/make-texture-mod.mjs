#!/usr/bin/env node
/* make-texture-mod.mjs - a texture mod of a chosen unpacked size, for memory runs.
 *
 *   node tools/make-texture-mod.mjs --mib 24                  # dist/test.mem-24.zip
 *   node tools/make-texture-mod.mjs --mib 8 --id test.mem-b  # a second, different mod
 *   node tools/make-texture-mod.mjs --mib 24 --names fake --fill noise --out /tmp/x.zip
 *
 * The phone cap in the game's mods.js (PHONE_MAX_ENABLED_UNPACKED) is a guess until
 * a low-memory iPhone is measured with no mods, one large texture mod and
 * several (the ios-memory-profiling skill, "Mods"). This makes those mods.
 *
 * Files are HD pack textures (tex1_{W}x{H}_{hash}[_{tlut}]_{fmt}.dds, the names
 * the game engine parses), uncompressed 32-bit DDS like example.clover-meadow:
 *
 *   --names grass  (default) the 36 town grass names example.clover-meadow uses.
 *                  The town draws them on every frame, so they load whether
 *                  texture preload is on or off: the realistic case. The
 *                  pixels are split evenly over the 36 files.
 *   --names fake   made-up hashes that no game texture has. They cost memory
 *                  only through the boot preload (preload_textures >= 1), never
 *                  by being drawn: the preload's own cost.
 *   --size N       side of each fake texture (default 512, 1 MiB each).
 *   --fill         gradient (default, zips small) or noise (zips to its full
 *                  size, so the ZIP limit of 16 MB is what stops it).
 *
 * The ZIP goes through check-zip.mjs (mods.js readMod), so it is a mod the
 * Mods tab would install. Exit 1 when it would be refused. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checkZip, fflate } from './check-zip.mjs';
import { isMain } from './is-main.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MIB = 1024 * 1024;
const HEADER = 128;

/* The town grass with its palettes, as in build-examples.mjs (example.clover-meadow). */
const GRASS = [
  ['626709d910129694', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['903adc6355e36f59', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['e96fecd242518c9f', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['82f28ec4199a45be', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
  ['cfa57a6e6f966d11', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
  ['e2ab673814e71af6', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
];
export const GRASS_NAMES = GRASS.flatMap(([tex, pals]) => pals.map((pal) => `tex1_32x32_${tex}_${pal}_8.dds`));

/* An uncompressed 32-bit DDS header, pixels R G B A (pc_texderive_dds_format's order). */
function ddsHeader(w, h) {
  const hdr = Buffer.alloc(HEADER);
  hdr.write('DDS ', 0, 'ascii');
  hdr.writeUInt32LE(124, 4);
  hdr.writeUInt32LE(0x100f, 8);
  hdr.writeUInt32LE(h, 12);
  hdr.writeUInt32LE(w, 16);
  hdr.writeUInt32LE(w * 4, 20);
  hdr.writeUInt32LE(32, 76);
  hdr.writeUInt32LE(0x41, 80);
  hdr.writeUInt32LE(32, 88);
  hdr.writeUInt32LE(0x000000ff, 92);
  hdr.writeUInt32LE(0x0000ff00, 96);
  hdr.writeUInt32LE(0x00ff0000, 100);
  hdr.writeUInt32LE(0xff000000, 104);
  hdr.writeUInt32LE(0x1000, 108);
  return hdr;
}

function image(side, k, fill) {
  const out = new Uint8Array(HEADER + side * side * 4);
  out.set(ddsHeader(side, side), 0);
  const px = out.subarray(HEADER);
  if (fill === 'noise') {
    crypto.randomFillSync(px);
    for (let i = 3; i < px.length; i += 4) px[i] = 255;
    return out;
  }
  const tint = (k * 47) & 255;
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      const i = (y * side + x) * 4;
      px[i] = (x * 255 / side) | 0;
      px[i + 1] = (y * 255 / side) | 0;
      px[i + 2] = tint;
      px[i + 3] = 255;
    }
  }
  return out;
}

/* { zip, files, unpacked } for a texture mod of about `mib` MiB unpacked
 * (never over it, except the few hundred bytes of mod.json). */
export function makeTextureMod({ mib, id, names = 'grass', size = 512, fill = 'gradient' }) {
  if (!(mib > 0)) throw new Error('--mib must be a positive number');
  const target = mib * MIB;
  const files = {};
  let side;
  let count;
  if (names === 'grass') {
    count = GRASS_NAMES.length;
    side = Math.floor(Math.sqrt((target / count - HEADER) / 4) / 4) * 4;
    if (side < 4) throw new Error('--mib is too small for 36 grass textures');
  } else if (names === 'fake') {
    side = size;
    count = Math.max(1, Math.floor(target / (HEADER + side * side * 4)));
  } else throw new Error('--names must be grass or fake');
  for (let k = 0; k < count; k++) {
    const name = names === 'grass'
      ? GRASS_NAMES[k]
      : `tex1_${side}x${side}_${crypto.createHash('sha256').update(`${id}/${k}`).digest('hex').slice(0, 16)}_6.dds`;
    files[`textures/${name}`] = image(side, k, fill);
  }
  const manifest = {
    schema: 1, api: 1, id, name: `Memory test ${mib} MB`, version: '1.0.0', authors: ['Play AC Online'],
    description: `${count} textures of ${side}x${side}, ${names} names, for memory runs. Not for players.`,
    scope: 'client', content: { textures: 'textures/' }, assets_original: true,
  };
  files['mod.json'] = new TextEncoder().encode(JSON.stringify(manifest, null, 2));
  const unpacked = Object.values(files).reduce((s, f) => s + f.length, 0);
  const zip = fflate.zipSync(files, { level: 6, mtime: new Date('2026-11-12T00:00:00Z') });
  return { zip, files, unpacked, side, count };
}

function arg(args, name, dflt) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : dflt;
}

async function main(args) {
  if (args.includes('-h') || args.includes('--help') || !args.includes('--mib')) {
    console.error(`usage: node ${path.relative(process.cwd(), fileURLToPath(import.meta.url))} --mib N [--id test.mem-N] [--names grass|fake] [--size 512] [--fill gradient|noise] [--out file.zip]`);
    return 2;
  }
  const mib = Number(arg(args, 'mib'));
  const id = arg(args, 'id', `test.mem-${String(mib).replace(/[^0-9]/g, '-')}`);
  const names = arg(args, 'names', 'grass');
  const m = makeTextureMod({ mib, id, names, size: Number(arg(args, 'size', '512')), fill: arg(args, 'fill', 'gradient') });
  const out = arg(args, 'out', path.resolve(`${id}.zip`));
  const r = await checkZip(m.zip);
  if (!r.ok) {
    console.error(`FAIL ${id}: the Mods tab would refuse it:`);
    for (const e of r.errors) console.error(`  - ${e}`);
    return 1;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, m.zip);
  console.log(`ok   ${out}  ${id}: ${m.count} x ${m.side}x${m.side} (${names}), ` +
    `${(m.unpacked / MIB).toFixed(1)} MB unpacked, ${(m.zip.length / MIB).toFixed(1)} MB zipped`);
  return 0;
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(e.message || e); process.exit(2); });
}
