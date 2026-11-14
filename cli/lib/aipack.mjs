/* aipack.mjs - the AI assistant skill pack in every new mod.
 *
 * The pack (a Claude Code skill, AGENTS.md, Copilot instructions, and their
 * reference files) is generated in the monorepo at ai/ by
 * the game's build; ai/pack.json says where each file goes
 * in a mod folder. Read from the checkout this package sits in, else from
 * vendor/ai (the game's build copies it at npm pack). The same files are the
 * download at playaconline.com/modding/ai/.
 *
 * Only the hidden ones (.claude/, .github/) are scaffolded: the pack rule
 * leaves them out of the mod's ZIP. AGENTS.md is marked scaffold: false, since
 * a top-level .md would be packed into the mod; it is in the download. */
import fs from 'node:fs';
import path from 'node:path';
import { VENDOR } from './contract.mjs';
import { CHECKOUT } from './checkout.mjs';

export function aiPackDir() {
  for (const d of [...(CHECKOUT ? [CHECKOUT.ai] : []), path.join(VENDOR, 'ai')]) {
    if (fs.existsSync(path.join(d, 'pack.json'))) return d;
  }
  return null;
}

/* { "<path in the mod folder>": Buffer } for every pack file, or {} when the
 * pack is not there (a checkout without it: the mod still works). */
export function aiPackFiles() {
  const dir = aiPackDir();
  if (!dir) return {};
  const pack = JSON.parse(fs.readFileSync(path.join(dir, 'pack.json'), 'utf8'));
  const out = {};
  for (const f of pack.files || []) {
    if (f.scaffold === false) continue;
    if (typeof f.from !== 'string' || typeof f.to !== 'string' || f.to.split('/').includes('..') || path.isAbsolute(f.to)) continue;
    out[f.to] = fs.readFileSync(path.join(dir, ...f.from.split('/')));
  }
  return out;
}
