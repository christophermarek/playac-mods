#!/usr/bin/env node
/* playac-mod - make, check, pack, try and publish Play AC Online mods.
 * Run `playac-mod help` for the commands. */
import fs from 'node:fs';
/* Node 18 warns that buffer.File is experimental the first time publish builds
 * its upload form (FormData with a file name). It is stable from Node 20 and
 * works on 18; the warning only alarms people, so it is dropped. */
{
  const emit = process.emitWarning;
  process.emitWarning = function (w, ...rest) {
    if (/buffer\.File/.test(String(w && w.message ? w.message : w))) return;
    return emit.call(process, w, ...rest);
  };
}
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkFolder, formatReport } from '../lib/check.mjs';
import { KINDS, scaffoldFiles, writeFiles } from '../lib/scaffold.mjs';
import { writeTypes } from '../lib/types.mjs';
import { DEFAULT_PORT, startDevFree } from '../lib/dev.mjs';
import { DEFAULT_API, forgetToken, githubPreflight, importGitHub, listingFor, myVersions, parseGitHubSource, revoke, savedToken,
  setYanked, statusLines, upload, withToken } from '../lib/publish.mjs';
import { githubFiles } from '../lib/scaffold.mjs';
import { findRelease } from '../lib/pin.mjs';
import { spawnSync } from 'node:child_process';
import { mods, SOURCE_DIR } from '../lib/contract.mjs';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).version;

const HELP = `playac-mod ${VERSION}: make Play AC Online mods

  playac-mod new <id> [--kind texture|lines|shop|script] [--dir <folder>] [--name "<name>"]
                 [--author "<name>"] [--github] [--force] [--no-ai]
        a new mod folder (default kind: lines), with editor types and settings,
        and instructions for AI assistants (.claude/skills/playac-mod, .github/), unless --no-ai;
        --github adds what a GitHub repo needs (a check workflow, CHANGELOG.md);
        --force writes over files that are already there
  playac-mod check [folder | file.zip] [--verbose] [--json] [--no-lua]
        every rule the game applies, problems listed per file, Lua syntax by the
        game's own parser (--no-lua: skip it); a .zip is checked as the game reads it
  playac-mod pack [folder] [--out <file.zip>] [--json] [--no-lua]
        the mod's ZIP, the same bytes every time, and its content hash; written
        NEXT TO the folder (<id>-<version>.zip), never inside it
  playac-mod dev [folder] [--port ${DEFAULT_PORT}] [--origin <url>]...
        serve the folder; open the game with ?moddev=1 and edits reload; when
        port ${DEFAULT_PORT} is taken it uses the next free one and says which
  playac-mod types [folder]
        refresh .playac/ (LuaLS types and JSON schemas)
  playac-mod publish [folder] [--shot <file.png>]... [--changelog "<line>"] [--github <owner>/<repo>@<tag>] [--api <url>] [--no-save]
        sign in with a code (once an hour) and upload for review, with 1 to 4
        screenshots (default .playac/screenshots/) and a changelog line (default:
        this version's section of CHANGELOG.md, else .playac/changelog.txt);
        --no-save keeps the sign-in for this run only; --github first checks the
        tag against mod.json, the listing and git (exists, pushed)
  playac-mod status [folder] [--all]
        every version of this mod you uploaded and its state (pending, listed,
        superseded, yanked, rejected, removed); --all: every mod of yours
  playac-mod yank <version> [folder] [--reason "<why>"]
        take one approved version of this mod out of the list (players who
        have it are told); playac-mod unyank <version> lists it again
  playac-mod logout [--api <url>]
        revoke and forget the saved sign-in
  playac-mod help | -h | --help      this text
  playac-mod version | -v | --version

The folder defaults to the current one. Docs: https://playaconline.com/modding/  Errors: https://playaconline.com/modding/errors/
`;

/* argv -> { _: [positionals], flags: {name: value|true|[values]} } */
export function parseArgs(argv) {
  const out = { _: [], flags: {} };
  const multi = new Set(['origin', 'shot']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h') { out.flags.help = true; continue; }
    if (a === '-v') { out.flags.version = true; continue; }
    if (!a.startsWith('--')) { out._.push(a); continue; }
    let [k, v] = a.slice(2).split(/=(.*)/s);
    /* --github is a value for publish (owner/repo@tag), a switch for new */
    if (v === undefined && k === 'github' && (argv[i + 1] === undefined || argv[i + 1].startsWith('-') || !argv[i + 1].includes('@'))) v = true;
    if (v === undefined) {
      const bool = ['verbose', 'json', 'force', 'no-save', 'no-lua', 'no-ai', 'help', 'version', 'all'].includes(k);
      v = bool ? true : argv[++i];
      if (v === undefined) throw new Error(`--${k} needs a value`);
    }
    if (multi.has(k)) (out.flags[k] = out.flags[k] || []).push(v);
    else out.flags[k] = v;
  }
  return out;
}

const dirOf = (a) => path.resolve(a._[0] || '.');

/* A usage mistake: exit 2, like an unknown command or a bad flag. */
function usage(msg) {
  const e = new Error(msg);
  e.usage = true;
  return e;
}
const apiOf = (a) => String(a.flags.api || process.env.PLAYAC_API || DEFAULT_API).replace(/\/$/, '');

async function cmdNew(a) {
  const id = a._[0];
  if (!id) throw usage('usage: playac-mod new <yourname.mod-name> [--kind lines] [--github]');
  const kind = a.flags.kind || 'lines';
  const dir = path.resolve(a.flags.dir || id);
  const files = scaffoldFiles(id, kind, { name: a.flags.name, author: a.flags.author, ai: !a.flags['no-ai'] });
  if (a.flags.github) {
    /* the workflow runs one release, pinned by its SHA-256 */
    const release = await findRelease(VERSION);
    if (!release) throw new Error('--github needs the list of playac-mod releases to pin the check workflow to one, and could not read it (are you online?). Run the same line again online, or leave out --github.');
    Object.assign(files, githubFiles(release));
  }
  writeFiles(dir, files, { force: !!a.flags.force });
  writeTypes(dir);
  const r = await checkFolder(dir);
  if (!r.ok) throw new Error(`the new mod does not pass check (a bug in playac-mod):\n${formatReport(r)}`);
  const rel = path.relative(process.cwd(), dir) || '.';
  console.log(`made ${rel}: a ${kind} mod, ${id}`);
  console.log(`next: cd ${rel} && npx playac-mod dev`);
  if (a.flags.github) {
    console.log('for GitHub: git init, commit, push; put 1 to 4 screenshots in .playac/screenshots/ and commit them;');
    console.log('then git tag v0.1.0 && git push origin v0.1.0, and npx playac-mod publish --github <you>/<repo>@v0.1.0');
  }
  return 0;
}

async function cmdCheck(a) {
  const dir = dirOf(a);
  const isZip = /\.zip$/i.test(dir);
  let r;
  try {
    r = await checkFolder(dir, { lua: !a.flags['no-lua'] });
  } catch (e) {
    /* --json promises JSON on stdout, even for a folder that is not there */
    if (!a.flags.json) throw e;
    console.log(JSON.stringify({ ok: false, problems: [{ file: '', message: e.message }], warnings: [], left_out: [], content_sha: null }, null, 2));
    return 1;
  }
  if (a.flags.json) {
    console.log(JSON.stringify({ ok: r.ok, problems: r.problems, warnings: r.warnings, left_out: r.leftOut,
      content_sha: r.result ? r.result.contentSha : null }, null, 2));
    return r.ok ? 0 : 1;
  }
  const report = formatReport(r, { verbose: !!a.flags.verbose });
  if (report) console.log(report);
  const hasLua = Object.keys(r.entries || {}).some((n) => n.toLowerCase().endsWith('.lua'));
  if (hasLua && !r.luaChecked) console.log('NOTE: Lua syntax not checked (--no-lua): a syntax error stops the script when the game loads it');
  if (!r.ok) {
    console.error(`FAIL: ${r.problems.length} problem(s); the game would refuse this mod${r.problems.some((p) => /stops (your|this) script/.test(p.message)) ? ' or stop its script' : ''}`);
    return 1;
  }
  const m = r.manifest;
  const nw = r.warnings.length;
  console.log(`ok   ${isZip ? `${path.basename(dir)}: ` : ''}${m.id} ${m.version}, ${m.scope}, ${r.result.files} files, ${(r.result.unpacked / 1024).toFixed(1)} KB` +
    (nw ? `; ${nw} warning${nw === 1 ? '' : 's'}: the game installs it, but read ${nw === 1 ? 'it' : 'them'} above` : ''));
  return 0;
}

async function packed(dir, a) {
  if (/\.zip$/i.test(dir) && fs.existsSync(dir) && fs.statSync(dir).isFile()) throw usage(`${path.basename(dir)} is already a ZIP: pack and publish take the mod's folder (check takes either)`);
  const r = await checkFolder(dir, { lua: !a.flags['no-lua'] });
  if (!r.ok) {
    console.error(formatReport(r));
    throw new Error('the mod does not pass check, so it was not packed');
  }
  return r.result;
}

async function cmdPack(a) {
  const dir = dirOf(a);
  const p = await packed(dir, a);
  /* beside the folder, not in it. A ZIP inside the folder is left out
   * by pack, but a ZIP made by hand (Compress, Send to) would hold it, and the
   * game refuses a mod with a .zip in it. */
  const out = path.resolve(a.flags.out || path.join(path.dirname(dir), `${p.manifest.id}-${p.manifest.version}.zip`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, p.zip);
  if (a.flags.json) {
    console.log(JSON.stringify({ file: out, id: p.manifest.id, version: p.manifest.version, scope: p.manifest.scope,
      sha256: p.sha256, content_sha: p.contentSha, modset_line: p.modsetLine, files: p.files, bytes: p.zip.length }, null, 2));
    return 0;
  }
  console.log(`packed ${path.relative(process.cwd(), out)}  ${(p.zip.length / 1024).toFixed(1)} KB, ${p.files} files`);
  console.log(`content hash  ${p.contentSha}`);
  console.log(`zip sha256    ${p.sha256}`);
  if (p.manifest.scope === 'world') console.log(`modset line   ${p.modsetLine}`);
  return 0;
}

async function cmdDev(a) {
  const dir = dirOf(a);
  const chosen = a.flags.port !== undefined;
  const port = chosen ? Number(a.flags.port) : DEFAULT_PORT;
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw usage(`--port must be a number from 0 to 65535, not ${JSON.stringify(String(a.flags.port))}`);
  let dev;
  /* with no --port, a taken 2604 (often a playac-mod dev left running
   * in another window) moves to the next free port, up to 20 tries. */
  try {
    dev = await startDevFree(dir, { port, origins: a.flags.origin || [], lua: !a.flags['no-lua'], log: (s) => console.log(`[dev] ${s}`) }, chosen ? 1 : 20);
  } catch (e) {
    if (e.code === 'EADDRINUSE') throw new Error(`port ${e.port ?? port} is already in use (another playac-mod dev?): stop it, or pick another with --port <n> and give the game that address`);
    if (e.code === 'EACCES') throw new Error(`port ${e.port ?? port} is not allowed here: pick another with --port <n>`);
    throw e;
  }
  const s = dev.state();
  console.log(`serving ${path.relative(process.cwd(), dir) || '.'} (${s.id || 'no id'} ${s.version}) at ${dev.url}`);
  if (dev.port !== DEFAULT_PORT) {
    console.log(`NOTE: port ${DEFAULT_PORT} was taken (another playac-mod dev still running?), so this one is on ${dev.port}.`);
    console.log(`      In the game: Settings, Mods, Load a mod you are making: put ${dev.url} in "playac-mod dev address" and press Connect.`);
  }
  console.log(`open the game with ?moddev=1 (for example https://playaconline.com/play/?moddev=1); Ctrl+C stops`);
  if (!s.ok) console.log(formatReport({ problems: s.problems, warnings: [] }));
  await new Promise((resolve) => {
    const stop = () => { dev.close().then(resolve); };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  });
  return 0;
}

/* Where a types file came from, in words: the installed package's own copy
 * ("playac-mod 0.1.0"), else a path (setup dry run: a global install printed
 * "from ../../../../../../../../../../private/var/...", ten levels up). */
export function typesFrom(from, cwd = process.cwd()) {
  const inPkg = path.relative(PKG, from);
  if (!inPkg.startsWith('..') && !path.isAbsolute(inPkg)) return `playac-mod ${VERSION}`;
  const rel = path.relative(cwd, from);
  return rel.startsWith('..') ? from : rel;
}

async function cmdTypes(a) {
  const dir = dirOf(a);
  for (const w of writeTypes(dir)) console.log(`wrote ${w.file}  (from ${typesFrom(w.from)})`);
  return 0;
}

async function cmdPublish(a) {
  const api = apiOf(a);
  if (a.flags.github) {
    if (a.flags.github === true) throw usage('--github needs <owner>/<repo>@<tag>, for example --github you/tea-house@v1.2.0');
    /* what the folder can show is wrong with the tag, before the sign-in. */
    const src = parseGitHubSource(String(a.flags.github));
    const dir = dirOf(a);
    const vcs = (args) => {
      const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', timeout: 20000 });
      return r.error ? null : r;
    };
    const pre = githubPreflight(dir, src, vcs);
    for (const n of pre.notes) console.log(`note: ${n}`);
    if (fs.existsSync(path.join(dir, 'mod.json'))) {
      const r = await checkFolder(dir, { lua: !a.flags['no-lua'] });
      if (!r.ok) {
        console.error(formatReport(r));
        pre.problems.push('this folder does not pass check, so the tag (if it holds the same files) would be refused');
      }
    }
    if (pre.problems.length) throw new Error(`nothing was sent:\n  ${pre.problems.join('\n  ')}`);
    const b = await withToken(api, VERSION, (tok) => importGitHub(api, tok, String(a.flags.github)), {}, { noSave: !!a.flags['no-save'] });
    console.log(`imported ${b.mod_id} ${b.version} from ${b.source || a.flags.github}: waiting for review`);
    return 0;
  }
  const dir = dirOf(a);
  const p = await packed(dir, a);
  /* the screenshots and the changelog line, checked before signing in. */
  const listing = listingFor(dir, p.manifest.version, { shots: a.flags.shot || [], changelog: a.flags.changelog || '' });
  const b = await withToken(api, VERSION, (tok) => upload(api, tok, p.zip, listing), {}, { noSave: !!a.flags['no-save'] });
  console.log(`uploaded ${b.mod_id} ${b.version} (content hash ${p.contentSha}): waiting for review`);
  return 0;
}

/* The folder's mod id, or '' (status --all, or no mod.json). */
function folderModId(dir) {
  try { return String(JSON.parse(fs.readFileSync(path.join(dir, 'mod.json'), 'utf8')).id || ''); } catch { return ''; }
}

async function cmdStatus(a) {
  const api = apiOf(a);
  const dir = dirOf(a);
  const id = a.flags.all ? '' : folderModId(dir);
  if (!id && !a.flags.all) throw usage('run status in a mod folder (one with mod.json), or use --all');
  const list = await withToken(api, VERSION, (tok) => myVersions(api, tok), {}, { noSave: !!a.flags['no-save'] });
  for (const l of statusLines(list, id)) console.log(l);
  return 0;
}

async function yankOrList(a, yank) {
  const version = a._[0];
  if (!version) throw usage(`usage: playac-mod ${yank ? 'yank' : 'unyank'} <version> [folder]${yank ? ' [--reason "<why>"]' : ''}`);
  const api = apiOf(a);
  const dir = path.resolve(a._[1] || '.');
  const id = folderModId(dir);
  if (!id) throw usage(`run ${yank ? 'yank' : 'unyank'} in the mod's folder (one with mod.json), or name the folder after the version`);
  const m = await withToken(api, VERSION, async (tok) => {
    const row = (await myVersions(api, tok)).find((v) => v.mod_id === id && v.version === version);
    if (!row) throw new Error(`you have no upload of ${id} ${version} (playac-mod status lists yours)`);
    return setYanked(api, tok, row.id, yank, a.flags.reason ? String(a.flags.reason) : '');
  }, {}, { noSave: !!a.flags['no-save'] });
  console.log(`${id} ${version}: ${m.state || (yank ? 'yanked' : 'listed')}`);
  return 0;
}

const cmdYank = (a) => yankOrList(a, true);
const cmdUnyank = (a) => yankOrList(a, false);

async function cmdLogout(a) {
  const api = apiOf(a);
  const tok = savedToken(api, 0);
  if (tok) await revoke(api, tok).catch(() => false);
  forgetToken(api);
  console.log('signed out');
  return 0;
}

const COMMANDS = { new: cmdNew, check: cmdCheck, pack: cmdPack, dev: cmdDev, types: cmdTypes, publish: cmdPublish,
  status: cmdStatus, yank: cmdYank, unyank: cmdUnyank, logout: cmdLogout };

/* The package's Node floor (package.json engines, ">=18.17"). npm only warns
 * about engines, and on Node 16 new and check seem to work while publish dies
 * on a missing fetch, so the tool says so up front (setup dry run). */
const NODE_MIN = String((JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).engines || {}).node || '').replace(/^>=\s*/, '');
export function nodeTooOld(version = process.versions.node, min = NODE_MIN) {
  if (!min) return false;
  const [M, m = 0] = String(version).replace(/^v/, '').split('.').map(Number);
  const [wantM, wantm = 0] = min.split('.').map(Number);
  return M < wantM || (M === wantM && m < wantm);
}

export async function main(argv) {
  if (nodeTooOld()) {
    console.error(`playac-mod needs Node.js ${NODE_MIN} or newer, and this is ${process.version}. ` +
      'Install the current LTS (nvm install --lts, or https://nodejs.org), open a new terminal, and try again.');
    return 1;
  }
  let a;
  try { a = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  const cmd = a._.shift();
  if (a.flags.version || cmd === 'version') { console.log(`${VERSION} (mod API ${mods.API_MIN}..${mods.API_MAX}, rules from ${SOURCE_DIR})`); return 0; }
  if (!cmd || cmd === 'help' || a.flags.help) { console.log(HELP); return cmd || a.flags.help ? 0 : 2; }
  const run = COMMANDS[cmd];
  if (!run) { console.error(`unknown command ${cmd}\n\n${HELP}`); return 2; }
  if (cmd === 'new' && a.flags.kind && !KINDS.includes(a.flags.kind)) { console.error(`--kind must be one of ${KINDS.join(', ')}`); return 2; }
  try {
    return await run(a);
  } catch (e) {
    /* Node's fetch says only "fetch failed" when the server cannot be reached. */
    const msg = e.message === 'fetch failed' ? `could not reach ${apiOf(a)} (check your connection, or --api)` : e.message;
    console.error(`playac-mod ${cmd}: ${msg}`);
    return e.usage ? 2 : 1;
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
}
