/* pin.mjs - which playac-mod a mod repo's CI runs, pinned by its SHA-256.
 *
 * The name "playac-mod" is not ours on the npm registry yet, so anything that
 * resolves it there (`npx playac-mod@0`, `npm view playac-mod`) would run
 * whatever package someone else publishes under it. The CI workflow
 * (template/.github/workflows/mod.yml) never asks npm by name: it downloads
 * one frozen release tarball by URL, refuses it unless its SHA-256 is the one
 * written in the workflow, and installs that file with --ignore-scripts (the
 * package has no dependencies, so nothing else is fetched).
 *
 * Releases are frozen files in cli/releases/ (the game's build
 * writes them; releases.json lists them), served by the site at
 * /modding/downloads/playac-mod-<version>.tgz forever, so a pinned workflow
 * keeps working after the next release.
 *
 * THE SWITCH TO NPM is one line: CLI_ON_NPM in the frontend's facts.ts (the
 * package carries it as vendor/source.json). It changes only the URL the
 * workflow downloads from, to the registry's tarball of the same version, and
 * the hash stays the same because the owner publishes that exact file
 * (`npm publish releases/playac-mod-<version>.tgz`). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHECKOUT } from './checkout.mjs';

export const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE = 'https://playaconline.com';
export const RELEASES_DIR = path.join(PKG, 'releases');
export const RELEASES_JSON = path.join(RELEASES_DIR, 'releases.json');
export const SITE_RELEASES_URL = `${SITE}/modding/downloads/playac-mod-releases.json`;
const VENDOR = path.join(PKG, 'vendor');

export const releaseFile = (version) => `playac-mod-${version}.tgz`;
export const siteUrl = (version) => `${SITE}/modding/downloads/${releaseFile(version)}`;
export const npmUrl = (version) => `https://registry.npmjs.org/playac-mod/-/${releaseFile(version)}`;

/* Is the package on npm (and ours there)? The checkout's facts.ts decides;
 * the package carries the same answer in vendor/source.json. */
export function onNpm() {
  if (CHECKOUT && fs.existsSync(CHECKOUT.facts)) return /export const CLI_ON_NPM = true\b/.test(fs.readFileSync(CHECKOUT.facts, 'utf8'));
  try { return JSON.parse(fs.readFileSync(path.join(VENDOR, 'source.json'), 'utf8')).on_npm === true; } catch { return false; }
}

/* { releases: [{ version, file, sha256, integrity }] } from a file, or null. */
export function readReleases(file) {
  try {
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(j.releases) ? j : null;
  } catch { return null; }
}

const newer = (a, b) => {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] > pb[i];
  return false;
};

/* The release a new workflow pins: this version when it is released, else the
 * newest. A record must carry a 64-hex sha256. */
export function pickRelease(list, version) {
  const ok = (list?.releases || []).filter((r) => r && typeof r.version === 'string' && /^[0-9a-f]{64}$/.test(r.sha256 || ''));
  if (!ok.length) return null;
  return ok.find((r) => r.version === version) || ok.reduce((a, b) => (newer(b.version, a.version) ? b : a));
}

/* Where the release list comes from, in order: $PLAYAC_MOD_RELEASES (a file),
 * the checkout's releases.json, the site's list (fetched), the list the
 * package carries (vendor/releases.json: the releases before this one, as a
 * release cannot list its own hash). */
export async function findRelease(version, { fetchFn = globalThis.fetch, env = process.env } = {}) {
  if (env.PLAYAC_MOD_RELEASES) return pickRelease(readReleases(env.PLAYAC_MOD_RELEASES), version);
  const local = readReleases(RELEASES_JSON);
  if (local) return pickRelease(local, version);
  if (fetchFn) {
    try {
      const r = await fetchFn(SITE_RELEASES_URL, { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const got = pickRelease(await r.json(), version);
        if (got) return got;
      }
    } catch { /* offline: the bundled list */ }
  }
  return pickRelease(readReleases(path.join(VENDOR, 'releases.json')), version);
}

/* The workflow text with the pin filled in. */
export function renderWorkflow(template, release, npm = onNpm()) {
  if (!release) throw new Error('no playac-mod release to pin the workflow to');
  const out = String(template)
    .replaceAll('__PLAYAC_MOD_VERSION__', release.version)
    .replaceAll('__PLAYAC_MOD_SHA256__', release.sha256)
    .replaceAll('__PLAYAC_MOD_URL__', npm ? npmUrl(release.version) : siteUrl(release.version));
  const left = out.match(/__PLAYAC_MOD_[A-Z0-9_]+__/);
  if (left) throw new Error(`workflow template: unknown placeholder ${left[0]}`);
  return out;
}

export const WORKFLOW_TEMPLATE = path.join(PKG, 'template', '.github', 'workflows', 'mod.yml');
