#!/usr/bin/env node
/* check-zip.mjs - check a mod ZIP the way the game does before it installs it.
 *
 *   node tools/check-zip.mjs my-mod.zip [more.zip ...]
 *
 * Loads the page's own rules (the game's mods.js, the file
 * the game iframe runs) and calls its public readMod, which unpacks the ZIP,
 * drops junk entries, strips one top folder and runs validateManifest. So this
 * prints what the Mods tab would refuse, from the same code.
 *
 * readMod also checks shops.json and messages against the mod contract, so a bad
 * shop is refused here, as at install. The item rules (shelf models,
 * money, turnips, tickets, fossils, price floors) need the game's item tables:
 * the game drops or re-prices such a good, it does not refuse the mod.
 *
 * It also prints `playac-mod check`'s warnings for the same files ("warn"
 * lines: textures the upload refuses or the game draws badly, script calls
 * against mod.json, shop goods against items.json). Warnings never change the
 * verdict or the exit code.
 *
 * Exit 0 when every ZIP passes, 1 when any is refused, 2 on bad usage.
 * build-examples.mjs imports checkZip from here. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/* The CLI's checker, for the warnings, and the game's mods.js and fflate as
 * the CLI loads them (contract.mjs: the checkout's own copy here, its
 * vendor/ copy in the public mods repo). */
import { checkEntries } from '../cli/lib/check.mjs';
import { fflate, mods } from '../cli/lib/contract.mjs';
import { isMain } from './is-main.mjs';

export { fflate, mods };

/* readMod joins its reasons with "; ". Split them back into one per line. */
function reasons(e) {
  const text = String((e && e.message) || e || 'unknown error');
  return text.split(/;\s+/).map((s) => s.trim()).filter(Boolean);
}

/* shops.json (CONTRACT.md "shops.json"), shape only: mods.js's own rule, so it
 * lives in one place. doc: the parsed file. Returns the reasons, [] when good. */
export function checkShops(doc) {
  return mods.validateShops(doc);
}

/* The errors catalogue entry for one problem: the code mods.js gives
 * it, and its page. */
export function errorDoc(problem) {
  const code = mods.errorCode(problem);
  return code ? { code, url: mods.ERROR_DOCS + '#' + code } : null;
}

/* The warnings `playac-mod check` gives the same files (cli/lib
 * check.mjs, so the logic lives once): things the game page installs but that
 * the game leaves out, draws badly, refuses at run time or the mod list
 * refuses on upload. entries: the unpacked files ({path: bytes}). Never
 * throws; [] when the files cannot be read. */
export async function zipWarnings(entries) {
  try {
    const r = await checkEntries(entries, { lua: false });
    /* `playac-mod check` fails a script the game stops at load
     * (problems with script: true); readMod installs the mod, so here, where
     * the verdict is readMod's alone, they are warnings. */
    return [...r.warnings, ...r.problems.filter((p) => p.script).map(({ file, message }) => ({ file, message }))];
  } catch {
    return [];
  }
}

/* bytes: the ZIP. Returns { ok, manifest, names, errors, warnings }. ok and
 * errors are readMod's alone; warnings never change them. Never throws. */
export async function checkZip(bytes) {
  let mod;
  try {
    mod = await mods.readMod(new Uint8Array(bytes), fflate);
  } catch (e) {
    let raw = null;
    try { raw = fflate.unzipSync(new Uint8Array(bytes)); } catch { /* not a ZIP */ }
    return { ok: false, manifest: null, names: [], errors: reasons(e), warnings: raw ? await zipWarnings(raw) : [] };
  }
  const names = mod.names || Object.keys(mod.entries || {});
  const errors = [];
  return { ok: errors.length === 0, manifest: mod.manifest, names, errors, warnings: await zipWarnings(mod.entries) };
}

/* "  warn <file>: <message>" lines, with the errors catalogue code when the
 * message has one. */
export function warningLines(warnings) {
  const out = [];
  for (const w of warnings || []) {
    out.push(`  warn ${w.file ? `${w.file}: ` : ''}${w.message}`);
    const doc = errorDoc(w.message);
    if (doc) out.push(`    [${doc.code}] ${doc.url}`);
  }
  return out;
}

async function main(args) {
  if (!args.length || args.includes('-h') || args.includes('--help')) {
    console.error(`usage: node ${path.relative(process.cwd(), fileURLToPath(import.meta.url))} my-mod.zip [more.zip ...]`);
    return 2;
  }
  let bad = 0;
  for (const file of args) {
    let bytes;
    try {
      bytes = fs.readFileSync(file);
    } catch (e) {
      console.error(`FAIL ${file}: cannot read it (${e.code || e.message})`);
      bad++;
      continue;
    }
    const r = await checkZip(bytes);
    if (r.ok) {
      const m = r.manifest;
      console.log(`ok   ${file}: ${m.id} ${m.version}, ${m.scope}, ${r.names.length} files`);
      for (const l of warningLines(r.warnings)) console.log(l);
    } else {
      bad++;
      console.error(`FAIL ${file}:`);
      for (const err of r.errors) {
        const doc = errorDoc(err);
        console.error(`  - ${err}`);
        if (doc) console.error(`    [${doc.code}] ${doc.url}`);
      }
      for (const l of warningLines(r.warnings)) console.error(l);
    }
  }
  return bad ? 1 : 0;
}

if (isMain(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}
