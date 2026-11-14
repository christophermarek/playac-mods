/* contract.mjs - the game's own mod rules, loaded once.
 *
 * The CLI never re-implements the contract (the mod contract). It loads the
 * file the game iframe runs, the game's mods.js, and its
 * fflate build, so `playac-mod check` and the game's Mods tab cannot disagree.
 *
 * Where they come from, in order:
 *   1. the monorepo checkout this package sits in (checkout.mjs)
 *   2. vendor/, filled by the game's build at `npm pack` / `npm publish`
 *      (the npm package has no monorepo next to it)
 * PLAYAC_MODS_JS=/path/to/mods.js overrides both (fflate is read beside it). */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import { CHECKOUT } from './checkout.mjs';

const require = createRequire(import.meta.url);
export const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const VENDOR = path.join(PKG, 'vendor');

/* mods.js hashes with root.crypto.subtle; Node 18 has no global crypto. */
if (!globalThis.crypto) globalThis.crypto = webcrypto;

function pickDir() {
  if (process.env.PLAYAC_MODS_JS) return path.dirname(path.resolve(process.env.PLAYAC_MODS_JS));
  if (CHECKOUT && fs.existsSync(path.join(CHECKOUT.web, 'mods.js'))) return CHECKOUT.web;
  if (fs.existsSync(path.join(VENDOR, 'mods.js'))) return VENDOR;
  throw new Error('playac-mod cannot find the game\'s mod rules (mods.js). Reinstall the package.');
}

export const SOURCE_DIR = pickDir();
export const fflate = require(path.join(SOURCE_DIR, 'fflate.umd.min.js'));
globalThis.fflate = fflate;
export const mods = require(process.env.PLAYAC_MODS_JS ? path.resolve(process.env.PLAYAC_MODS_JS) : path.join(SOURCE_DIR, 'mods.js'));

/* The file extensions a mod may hold (contract "ZIP"), the game's own list
 * (mods.js exports it; it used to be a copy here). */
export const EXTS = mods.EXTS;
