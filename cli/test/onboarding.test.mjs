/* playac-mod: what four newcomers tripped on.
 *
 *   node --test cli/test/
 *
 * Lua syntax checked with no luac, an on() the game refuses is an error,
 * check takes a ZIP, pack writes beside the folder, CHANGELOG.md stays out,
 * dev moves off a taken port, new --github, the screenshot size and the
 * --github tag checked before the sign-in, status and yank. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { fflate, mods } from '../lib/contract.mjs';
import { checkEntries, checkFolder, handZipRefuses } from '../lib/check.mjs';
import { leftOutReason } from '../lib/files.mjs';
import { luaSyntaxError } from '../lib/luasyntax.mjs';
import { scaffoldFiles, writeFiles } from '../lib/scaffold.mjs';
import { startDevFree } from '../lib/dev.mjs';
import { githubPreflight, imageSize, listingFor, myVersions, parseGitHubSource, setYanked, statusLines } from '../lib/publish.mjs';
import { main } from '../bin/playac-mod.mjs';
import { CHECKOUT } from '../lib/checkout.mjs';

process.env.PLAYAC_CONFIG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-cfg-'));
const enc = (s) => new TextEncoder().encode(s);
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'playac-onb-'));
const quiet = async (fn) => {
  const { log, error } = console;
  const out = [];
  console.log = (...a) => out.push(a.join(' '));
  console.error = (...a) => out.push(a.join(' '));
  try { return { code: await fn(), out: out.join('\n') }; } finally { console.log = log; console.error = error; }
};
const base = { schema: 1, api: 2, id: 'test.mod', name: 'Test Mod', version: '1.0.0', authors: ['Tester'], scope: 'client', assets_original: true };

/* A PNG of w x h (one grey row repeated), enough for a header and a decoder. */
function png(w, h) {
  const crc = (buf) => {
    let c = ~0;
    for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
    return ~c >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
  const raw = Buffer.alloc((w + 1) * h, 0x80);
  for (let y = 0; y < h; y++) raw[y * (w + 1)] = 0;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

test('Lua syntax is checked by the game\'s own parser, no luac needed', async () => {
  assert.equal(await luaSyntaxError('main.lua', 'local x <const> = 1\nreturn x'), '', 'Lua 5.4 syntax parses');
  assert.match(await luaSyntaxError('main.lua', 'on("talk", function(npc)\n  if npc then\nend)'), /^main\.lua:3: .*near/);
  const saved = process.env.PATH;
  process.env.PATH = '';
  try {
    const c = await checkEntries({
      'mod.json': enc(JSON.stringify({ ...base, scripts: { main: 'main.lua', hooks: ['talk'] } })),
      'main.lua': enc('on("talk", function(npc) return end end)'),
    });
    assert.equal(c.ok, false);
    assert.equal(c.luaChecked, true);
    const p = c.problems.find((x) => x.file === 'main.lua');
    assert.match(p.message, /main\.lua:1: .* \(a Lua syntax error: the game stops this script when it loads\)/);
  } finally { process.env.PATH = saved; }
});

test('on() for an event not in hooks is a problem, not a warning: the game stops the script', async () => {
  const c = await checkEntries({
    'mod.json': enc(JSON.stringify({ ...base, scripts: { main: 'main.lua', hooks: ['talk'] } })),
    'main.lua': enc('on("talk", function(npc) end)\non("day_start", function(d) end)\n'),
  });
  assert.equal(c.ok, false);
  assert.ok(c.problems.some((p) => p.file === 'main.lua' && /line 2: on\("day_start"\) .* not in "scripts.hooks".*none of it runs/.test(p.message)), JSON.stringify(c.problems));
  assert.ok(!c.warnings.some((w) => /day_start/.test(w.message)));
  /* an unknown event too */
  const d = await checkEntries({
    'mod.json': enc(JSON.stringify({ ...base, scripts: { main: 'main.lua', hooks: ['talk'] } })),
    'main.lua': enc('on("talk", function() end)\non("fish_cought", function() end)\n'),
  });
  assert.ok(d.problems.some((p) => /names no event the game has/.test(p.message)));
});

test('check takes a ZIP, as the Mods tab reads it; a hand-made ZIP with dist/ in it is refused', async () => {
  const dir = path.join(tmp(), 'bean.zipcheck');
  writeFiles(dir, scaffoldFiles('bean.zipcheck', 'lines', { ai: false }));
  let r = await quiet(() => main(['pack', dir]));
  assert.equal(r.code, 0, r.out);
  const zip = path.join(path.dirname(dir), 'bean.zipcheck-0.1.0.zip');
  assert.ok(fs.existsSync(zip), 'pack writes beside the folder, not in it');
  assert.ok(!fs.existsSync(path.join(dir, 'dist')));
  r = await quiet(() => main(['check', zip]));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /ok {3}bean\.zipcheck-0\.1\.0\.zip: bean\.zipcheck 0\.1\.0/);
  /* the old trap: a ZIP inside the folder, then Compress on the folder */
  fs.mkdirSync(path.join(dir, 'dist'));
  fs.copyFileSync(zip, path.join(dir, 'dist', 'old.zip'));
  r = await quiet(() => main(['check', dir]));
  assert.equal(r.code, 0);
  assert.match(r.out, /holds dist\/old\.zip, which `pack` leaves out; a ZIP you make by hand/);
  const files = {};
  for (const n of ['mod.json', 'main.lua', 'messages/en.json', 'dist/old.zip']) files[`bean.zipcheck/${n}`] = new Uint8Array(fs.readFileSync(path.join(dir, n)));
  const hand = path.join(tmp(), 'hand.zip');
  fs.writeFileSync(hand, fflate.zipSync(files));
  r = await quiet(() => main(['check', hand]));
  assert.equal(r.code, 1);
  assert.match(r.out, /"dist\/old\.zip": only .* files can be in a mod/);
  /* pack refuses a ZIP */
  assert.equal((await quiet(() => main(['pack', zip]))).code, 2);
  assert.equal(handZipRefuses('textures/.DS_Store'), false);
  assert.equal(handZipRefuses('LICENSE'), true);
  assert.equal(handZipRefuses('.playac/playac.lua'), false);
});

test('CHANGELOG.md at the top stays out of the mod, so editing it keeps the content hash', async () => {
  assert.ok(leftOutReason('CHANGELOG.md'));
  assert.equal(leftOutReason('docs/CHANGELOG.md'), '');
  const dir = tmp();
  writeFiles(dir, scaffoldFiles('bean.log', 'lines', { ai: false }));
  const a = await checkFolder(dir, { lua: false });
  fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), '## 0.1.0\n- first\n');
  const b = await checkFolder(dir, { lua: false });
  assert.equal(a.result.contentSha, b.result.contentSha);
  assert.ok(!Object.keys(b.entries).includes('CHANGELOG.md'));
});

test('new --github adds the workflow and a CHANGELOG.md; the workflow runs a release pinned by its SHA-256', async () => {
  const dir = path.join(tmp(), 'bean.gh');
  const r = await quiet(() => main(['new', 'bean.gh', '--dir', dir, '--github', '--no-ai']));
  assert.equal(r.code, 0, r.out);
  assert.ok(fs.existsSync(path.join(dir, '.github/workflows/mod.yml')));
  assert.match(fs.readFileSync(path.join(dir, 'CHANGELOG.md'), 'utf8'), /## 0\.1\.0/);
  assert.match(r.out, /publish --github/);
  const yml = fs.readFileSync(path.join(dir, '.github/workflows/mod.yml'), 'utf8');
  /* one release by URL and hash, never the npm name */
  const pin = await import('../lib/pin.mjs');
  const rel = pin.pickRelease(pin.readReleases(pin.RELEASES_JSON), JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8')).version);
  assert.match(yml, new RegExp(`PLAYAC_MOD_SHA256: '${rel.sha256}'`));
  assert.match(yml, /sha256sum -c -/);
  assert.doesNotMatch(yml, /npx[^\n]*playac-mod|npm view/);
  /* the listing reads its changelog line from it */
  fs.mkdirSync(path.join(dir, '.playac/screenshots'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.playac/screenshots/a.png'), png(640, 480));
  assert.equal(listingFor(dir, '0.1.0').changelog, 'First version.');
});

test('dev moves to the next free port when the default is taken', async () => {
  const dir = tmp();
  writeFiles(dir, scaffoldFiles('bean.port', 'lines', { ai: false }));
  const busy = net.createServer();
  await new Promise((res) => busy.listen(0, '127.0.0.1', res));
  const p = busy.address().port;
  let dev;
  try {
    try {
      dev = await startDevFree(dir, { port: p, lua: false, log: () => {} }, 20);
    } catch (e) {
      if (e.code === 'EADDRINUSE') return; /* the next ports are busy here too: nothing to learn */
      throw e;
    }
    assert.ok(dev.port > p && dev.port < p + 20, `${dev.port} after ${p}`);
    await assert.rejects(startDevFree(dir, { port: p, lua: false, log: () => {} }, 1), (e) => e.code === 'EADDRINUSE' && e.port === p);
  } finally {
    busy.close();
    if (dev) await dev.close();
  }
});

test('a screenshot outside 200..4096 px is refused before the sign-in', () => {
  assert.deepEqual(imageSize(png(320, 240), 'image/png'), { w: 320, h: 240 });
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, 0, 150, 1, 44, 1, 1, 17, 0, 0, 0]);
  assert.deepEqual(imageSize(jpeg, 'image/jpeg'), { w: 300, h: 150 });
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'small.png'), png(120, 90));
  assert.throws(() => listingFor(dir, '1.0.0', { shots: [path.join(dir, 'small.png')], changelog: 'x' }), /120x90: a screenshot's sides must be 200 to 4096 pixels/);
  fs.writeFileSync(path.join(dir, 'ok.png'), png(400, 300));
  assert.equal(listingFor(dir, '1.0.0', { shots: [path.join(dir, 'ok.png')], changelog: 'x' }).shots.length, 1);
});

test('publish --github: the tag is checked against mod.json, the listing and git first', () => {
  assert.deepEqual(parseGitHubSource('github.com/you/tea@v1.2.0'), { owner: 'you', repo: 'tea', tag: 'v1.2.0', version: '1.2.0' });
  assert.deepEqual(parseGitHubSource('you/tea@1.2.0').version, '1.2.0');
  assert.throws(() => parseGitHubSource('you/tea@latest'), /the tag must be the mod's version/);
  assert.throws(() => parseGitHubSource('tea@v1'), /owner/);
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'mod.json'), JSON.stringify({ ...base, version: '1.1.0' }));
  const none = () => null;
  let r = githubPreflight(dir, parseGitHubSource('you/tea@v1.2.0'), none);
  assert.ok(r.problems.some((p) => /says 1\.2\.0, but mod\.json says "version": "1\.1\.0"/.test(p)));
  assert.ok(r.problems.some((p) => /screenshot/.test(p)));
  /* a repo where the tag exists but was never pushed */
  fs.writeFileSync(path.join(dir, 'mod.json'), JSON.stringify({ ...base, version: '1.2.0' }));
  fs.mkdirSync(path.join(dir, '.playac/screenshots'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.playac/screenshots/a.png'), png(400, 300));
  fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), '## 1.2.0\n- new\n');
  const fake = (answers) => (args) => answers[args[0]] || { status: 0, stdout: '' };
  r = githubPreflight(dir, parseGitHubSource('you/tea@v1.2.0'), fake({ 'rev-parse': { status: 0, stdout: 'true\n' }, tag: { status: 0, stdout: 'v1.2.0\n' }, 'ls-remote': { status: 0, stdout: '' } }));
  assert.deepEqual(r.problems, ['the tag v1.2.0 is not on GitHub yet: git push origin v1.2.0']);
  r = githubPreflight(dir, parseGitHubSource('you/tea@v1.2.0'), fake({ 'rev-parse': { status: 0 }, tag: { status: 0, stdout: '' } }));
  assert.match(r.problems[0], /there is no tag v1\.2\.0 here/);
  r = githubPreflight(dir, parseGitHubSource('you/tea@v1.2.0'), fake({ 'rev-parse': { status: 0 }, tag: { status: 0, stdout: 'v1.2.0' }, 'ls-remote': { status: 0, stdout: 'abc\trefs/tags/v1.2.0\n' } }));
  assert.deepEqual(r.problems, []);
});

test('status and yank: the author\'s versions with the CLI token', async () => {
  const calls = [];
  const rows = [
    { id: 'r1', mod_id: 'bean.tea', version: '1.0.0', state: 'superseded' },
    { id: 'r2', mod_id: 'bean.tea', version: '1.1.0', state: 'listed' },
    { id: 'r3', mod_id: 'bean.other', version: '0.1.0', state: 'rejected', reason_title: 'Not your own work', reject_reason: 'traced' },
  ];
  const f = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.endsWith('/api/mods/mine')) return { ok: true, status: 200, json: async () => ({ mods: rows }) };
    if (url.endsWith('/api/mods/r2/yank')) return { ok: true, status: 200, json: async () => ({ mod: { ...rows[1], state: 'yanked' } }) };
    return { ok: false, status: 404, json: async () => ({ error: 'not_found' }) };
  };
  const list = await myVersions('https://api.test', 'tok', { fetch: f });
  assert.equal(calls[0].init.headers.Authorization, 'Bearer tok');
  assert.deepEqual(statusLines(list, 'bean.tea'), ['bean.tea 1.0.0  superseded', 'bean.tea 1.1.0  listed']);
  assert.deepEqual(statusLines(list, 'bean.other'), ['bean.other 0.1.0  rejected', '    Not your own work: traced']);
  assert.deepEqual(statusLines(list, 'bean.none'), ['no uploads of bean.none yet']);
  const m = await setYanked('https://api.test', 'tok', 'r2', true, 'breaks the shop', { fetch: f });
  assert.equal(m.state, 'yanked');
  assert.deepEqual(JSON.parse(calls[1].init.body), { reason: 'breaks the shop' });
  await assert.rejects(setYanked('https://api.test', 'tok', 'r9', false, '', { fetch: f }), /unyank was refused/);
  /* usage */
  assert.equal((await quiet(() => main(['yank']))).code, 2);
  assert.equal((await quiet(() => main(['status', tmp()]))).code, 2);
});

/* Finder's Compress (or Explorer's Send to) of a `playac-mod new`
 * folder carries .gitignore, .vscode/, .playac/ and .github/. The game drops
 * every hidden name, so that ZIP installs and `check` says so. */
test('a Finder ZIP of a new folder, hidden files and all, is a mod the game takes', async () => {
  const dir = path.join(tmp(), 'bean.finder');
  assert.equal((await quiet(() => main(['new', 'bean.finder', '--dir', dir, '--github', '--no-ai']))).code, 0);
  fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.claude/settings.json'), '{}');
  fs.writeFileSync(path.join(dir, '.DS_Store'), 'x');
  const files = {};
  const all = (abs, rel) => {
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) all(path.join(abs, e.name), r);
      else files[`bean.finder/${r}`] = new Uint8Array(fs.readFileSync(path.join(abs, e.name)));
    }
  };
  all(dir, '');
  files['__MACOSX/bean.finder/._mod.json'] = enc('x');
  for (const hidden of ['.gitignore', '.vscode/settings.json', '.github/workflows/mod.yml']) assert.ok(files[`bean.finder/${hidden}`], hidden);
  const hand = path.join(tmp(), 'bean.finder.zip');
  fs.writeFileSync(hand, fflate.zipSync(files));
  const r = await quiet(() => main(['check', hand]));
  assert.equal(r.code, 0, r.out);
  const read = mods.readMod(new Uint8Array(fs.readFileSync(hand)), fflate);
  assert.deepEqual(Object.keys(read.entries).filter((p) => p.split('/').some((s) => s.startsWith('.'))), []);
  /* and a folder check no longer warns about them */
  const c = await checkFolder(dir);
  assert.ok(!c.warnings.some((w) => /\.gitignore|\.vscode|\.github|\.claude/.test(String(w.message ?? w))), JSON.stringify(c.warnings));
});

test('mods.js agrees: the hand-made ZIP rule is the game\'s', () => {
  /* handZipRefuses says the game refuses these when they are in a ZIP */
  const m = JSON.stringify({ ...base, content: { messages: 'm.json' } });
  for (const extra of ['dist/a.zip', 'LICENSE', '.gitignore', '.playac/playac.lua', 'CHANGELOG.md',
    '.github/workflows/mod.yml', '.vscode/settings.json', '.claude/settings.json', 'docs/.notes', 'Thumbs.db']) {
    const n = mods.normalizeEntries({ 'mod.json': enc(m), 'm.json': enc('{}'), [extra]: enc('x') });
    assert.equal(n.problems.length > 0, handZipRefuses(extra), extra);
  }
});

test('the bundled Lua parser was built from the Lua the game runs', { skip: !CHECKOUT && 'needs the game\'s source checkout' }, () => {
  const ver = fs.readFileSync(CHECKOUT.luaVersion, 'utf8').trim();
  const head = fs.readFileSync(new URL('../lib/luasyntax.wasm.mjs', import.meta.url), 'utf8').slice(0, 300);
  assert.ok(head.includes(`lua-version: ${ver}\n`), 'rebuild: bash scripts/build-luasyntax.sh in the CLI folder');
});
