/* playac-mod: new, check, pack and the pack rule.
 *
 *   node --test cli/test/
 *
 * The point of every test here: the CLI and the game agree. check runs the
 * game's mods.js; these tests prove it lists what readMod refuses, accepts what
 * readMod accepts (every case in the contract's test cases), that pack is
 * byte-for-byte deterministic, and that its content hash is mods.js's. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fflate, mods, EXTS } from '../lib/contract.mjs';
import { CHECKOUT } from '../lib/checkout.mjs';
import { aiPackDir } from '../lib/aipack.mjs';
import { checkEntries, checkFolder, TEXTURE_NAME_RE } from '../lib/check.mjs';
import { leftOutReason, readFolder } from '../lib/files.mjs';
import { pack, zipEntries } from '../lib/pack.mjs';
import { KINDS, scaffoldFiles, writeFiles, GRASS_TEXTURE, dds } from '../lib/scaffold.mjs';
import { writeTypes, TYPE_FILES } from '../lib/types.mjs';
import { main, nodeTooOld, parseArgs, typesFrom } from '../bin/playac-mod.mjs';

/* A test that reads the game's source checkout (the contract cases, the examples,
 * the build scripts) is skipped in a copy that has none. */
const SOURCE_ONLY = { skip: !CHECKOUT && 'needs the game\'s source checkout' };
const BIN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../bin/playac-mod.mjs');
const enc = (s) => (typeof s === 'string' ? new TextEncoder().encode(s) : s);
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'playac-mod-'));
const quiet = async (fn) => {
  const { log, error } = console;
  const out = [];
  console.log = (...a) => out.push(a.join(' '));
  console.error = (...a) => out.push(a.join(' '));
  try { return { code: await fn(), out: out.join('\n') }; } finally { console.log = log; console.error = error; }
};
const base = { schema: 1, api: 2, id: 'test.mod', name: 'Test Mod', version: '1.0.0', authors: ['Tester'], scope: 'client', assets_original: true };

test('every kind scaffolds a mod that passes check and the game\'s own readMod', async () => {
  for (const kind of KINDS) {
    const dir = tmp();
    writeFiles(dir, scaffoldFiles(`bean.${kind}-mod`, kind));
    writeTypes(dir);
    const r = await checkFolder(dir, { lua: false });
    assert.deepEqual(r.problems, [], kind);
    assert.deepEqual(r.warnings, [], `${kind} has no warnings`);
    /* The ZIP through the game's reader directly, not through check. */
    const mod = mods.readMod(r.result.zip, fflate);
    assert.equal(mod.manifest.id, `bean.${kind}-mod`);
    assert.equal(mod.manifest.api, mods.API_MAX, 'a new mod says the newest api level');
    assert.ok(!mod.names.some((n) => n.startsWith('.')), `${kind}: .playac, .vscode and .gitignore stay out of the ZIP`);
    const m = JSON.parse(fs.readFileSync(path.join(dir, 'mod.json'), 'utf8'));
    assert.equal(m.$schema, './.playac/schemas/mod.schema.json');
    for (const f of TYPE_FILES) assert.ok(fs.existsSync(path.join(dir, '.playac', f)), f);
    const vs = JSON.parse(fs.readFileSync(path.join(dir, '.vscode/settings.json'), 'utf8'));
    assert.deepEqual(vs['Lua.workspace.library'], ['.playac/playac.lua']);
  }
});

test('the shop kind is a world mod; the texture kind names a texture the loader matches', () => {
  assert.equal(JSON.parse(scaffoldFiles('a.b', 'shop')['mod.json']).scope, 'world');
  assert.match(GRASS_TEXTURE, TEXTURE_NAME_RE);
  assert.throws(() => scaffoldFiles('Not An Id', 'lines'), /yourname\.mod-name/);
  assert.throws(() => scaffoldFiles('a.b', 'items'), /--kind/);
});

test('check agrees with readMod on every case in the contract\'s cases.json', SOURCE_ONLY, async () => {
  const cases = JSON.parse(fs.readFileSync(path.join(CHECKOUT.contract, 'cases.json'), 'utf8'));
  const failures = [];
  for (const c of cases) {
    const entries = Object.fromEntries(Object.entries(c.files).map(([k, v]) => [k, enc(v)]));
    let gameOk = true;
    try { mods.readMod(fflate.zipSync(entries), fflate); } catch { gameOk = false; }
    const r = await checkEntries(entries, { lua: false });
    if (r.installs !== gameOk) failures.push(`${c.name}: check ${r.installs ? 'passed' : 'refused'}, readMod ${gameOk ? 'passed' : 'refused'}`);
    if (!r.ok && !c.ok && !r.problems.some((p) => p.message.includes(c.error))) {
      failures.push(`${c.name}: no problem says "${c.error}" (${r.problems.map((p) => p.message).join(' | ')})`);
    }
  }
  assert.deepEqual(failures, []);
});

test('check lists every problem against its file, past readMod\'s four', async () => {
  const entries = {
    'mod.json': enc(JSON.stringify({ ...base, scope: 'client', content: { shops: 'shops.json', messages: 'messages/en.json' }, game: 'GAFE' })),
    'shops.json': enc(JSON.stringify({ shops: [{ target: 'nook', stock: [{ item: 2048 }] }] })),
    'messages/en.json': enc(JSON.stringify({ 'Bad Key': 'x', ok: '' })),
    'notes.json': enc('{"a":1,"a":2}'),
    'tool.exe': enc('MZ'),
  };
  const r = await checkEntries(entries, { lua: false });
  assert.equal(r.ok, false);
  const files = new Set(r.problems.map((p) => p.file));
  for (const f of ['mod.json', 'shops.json', 'messages/en.json', 'tool.exe']) assert.ok(files.has(f), `a problem against ${f}: ${JSON.stringify(r.problems)}`);
  assert.ok(r.problems.length > 4, 'more than readMod\'s first four');
  assert.ok(r.problems.some((p) => /"game" is not built yet/.test(p.message)));
  assert.ok(r.problems.some((p) => /"scope" must be "world"/.test(p.message)));
});

test('check reads an api 2 items file and a shop that stocks its items', async () => {
  const man = { ...base, scope: 'world', content: { items: 'items.json', shops: 'shops.json' }, renames: { 'old.mod:x': 'test.mod:tea-chest' } };
  const items = { items: [{ id: 'tea-chest', name: 'Tea Chest', base: '0x1008', price: 1800 }] };
  const shops = (item) => ({ shops: [{ target: 'flower', stock: [{ item }, { item: '0x2800' }] }] });
  const good = await checkEntries({ 'mod.json': enc(JSON.stringify(man)), 'items.json': enc(JSON.stringify(items)), 'shops.json': enc(JSON.stringify(shops('test.mod:tea-chest'))) }, { lua: false });
  assert.deepEqual(good.problems, []);
  const bad = await checkEntries({
    'mod.json': enc(JSON.stringify({ ...man, renames: { 'old.mod:x': 'test.mod:nope' } })),
    'items.json': enc(JSON.stringify({ items: [{ id: 'tea-chest', name: 'Tea Chest', base: '0x1009' }] })),
    'shops.json': enc(JSON.stringify(shops('test.mod:gone'))),
  }, { lua: false });
  const where = (f, re) => bad.problems.some((p) => p.file === f && re.test(p.message));
  assert.ok(where('items.json', /facing south/), JSON.stringify(bad.problems));
  assert.ok(where('shops.json', /not an item in this mod/), JSON.stringify(bad.problems));
  assert.ok(where('mod.json', /test\.mod:nope, which is not in items\.json/), JSON.stringify(bad.problems));
});

test('check warns on a texture the loader would never match and a .png the game leaves out', async () => {
  const entries = {
    'mod.json': enc(JSON.stringify({ ...base, content: { textures: 'textures' } })),
    [`textures/${GRASS_TEXTURE}`]: new Uint8Array(dds(32, 32, new Uint8Array(32 * 32 * 4))),
    'textures/grass.dds': enc('DDS '),
    'textures/tex1_32x32_626709d910129694_8.png': enc('png'),
  };
  const r = await checkEntries(entries, { lua: false });
  assert.equal(r.ok, true, JSON.stringify(r.problems));
  assert.deepEqual(r.warnings.map((w) => w.file).sort(), ['textures/grass.dds', 'textures/tex1_32x32_626709d910129694_8.png']);
  assert.match(r.warnings.find((w) => w.file.endsWith('.png')).message, /not a PNG the game reads/);
});

/* A PNG header: signature + IHDR (w, h, 8-bit RGBA). The rest of the file does
 * not matter to check, which, like the engine's scan, reads the header only. */
const pngHeader = (w, h) => {
  const b = new Uint8Array(33);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  new DataView(b.buffer).setUint32(16, w);
  new DataView(b.buffer).setUint32(20, h);
  b[24] = 8;
  b[25] = 6;
  return b;
};

test('check takes PNG textures by the engine\'s rules', async () => {
  const tex = (n) => `textures/tex1_32x32_${n.toString(16).padStart(16, '0')}_$_8.png`;
  const fine = await checkEntries({
    'mod.json': enc(JSON.stringify({ ...base, content: { textures: 'textures' } })),
    [tex(1)]: pngHeader(128, 128),
    [tex(2).replace('.png', '.PNG')]: pngHeader(2048, 2048),
  }, { lua: false });
  assert.equal(fine.ok, true, JSON.stringify(fine.problems));
  assert.deepEqual(fine.warnings, [], 'a good PNG texture, either case, is a texture like a DDS');

  const big = await checkEntries({
    'mod.json': enc(JSON.stringify({ ...base, content: { textures: 'textures' } })),
    [tex(3)]: pngHeader(2049, 16),
  }, { lua: false });
  assert.match(big.warnings[0].message, /2049x16: a PNG texture is at most 2048x2048/);

  const many = { 'mod.json': enc(JSON.stringify({ ...base, content: { textures: 'textures' } })) };
  for (let i = 0; i < 2; i++) many[tex(10 + i)] = pngHeader(2048, 2048); /* 32 MiB */
  const phone = await checkEntries(many, { lua: false });
  assert.match(phone.warnings[0].message, /on a phone the game loads at most 24 MiB/);
  for (let i = 2; i < 7; i++) many[tex(10 + i)] = pngHeader(2048, 2048); /* 112 MiB */
  const over = await checkEntries(many, { lua: false });
  assert.match(over.warnings[0].message, /at most 96 MiB of PNG pixels across all mods/);
  assert.equal(over.ok, true, 'the game still installs it: warnings, not problems');
});

test('pack is deterministic: same bytes twice, in any time zone, in any file order', async () => {
  const dir = tmp();
  writeFiles(dir, scaffoldFiles('bean.det', 'shop'));
  const a = await pack(readFolder(dir).entries);
  const shuffled = Object.fromEntries(Object.entries(readFolder(dir).entries).reverse());
  const b = await pack(shuffled);
  assert.equal(Buffer.compare(Buffer.from(a.zip), Buffer.from(b.zip)), 0);
  const shas = new Set();
  for (const tz of ['UTC', 'America/Los_Angeles', 'Asia/Tokyo', 'Pacific/Kiritimati']) {
    const r = spawnSync(process.execPath, [BIN, 'pack', dir, '--json', '--out', path.join(dir, `out-${tz.replace('/', '-')}.zip`), '--no-lua'],
      { env: { ...process.env, TZ: tz }, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    shas.add(JSON.parse(r.stdout).sha256);
  }
  assert.deepEqual([...shas], [a.sha256], 'one ZIP in every time zone');
  /* mod.json first, then byte order; every entry dated 1980-01-01. */
  const names = [];
  const dv = Buffer.from(a.zip);
  for (let at = 0; dv.readUInt32LE(at) === 0x04034b50;) {
    const nl = dv.readUInt16LE(at + 26), el = dv.readUInt16LE(at + 28), cs = dv.readUInt32LE(at + 18);
    assert.equal(dv.readUInt16LE(at + 12), (0 << 9) | (1 << 5) | 1, 'DOS date 1980-01-01');
    assert.equal(dv.readUInt16LE(at + 10), 0, 'DOS time 00:00');
    names.push(dv.toString('latin1', at + 30, at + 30 + nl));
    at += 30 + nl + el + cs;
  }
  assert.deepEqual(names, ['mod.json', 'README.md', 'shops.json']);
});

test('the content hash is mods.js contentSha of the same files, however they were zipped', SOURCE_ONLY, async () => {
  for (const ex of ['example.tea-house', 'example.village-gossip']) {
    const dir = path.join(CHECKOUT.examples, ex);
    const r = await checkFolder(dir, { lua: false });
    assert.equal(r.ok, true, `${ex}: ${JSON.stringify(r.problems)}`);
    /* Another ZIP of the same files: under a top folder, other order, other
     * level, other dates, with junk the loader drops. */
    const other = {};
    for (const [k, v] of Object.entries(readFolder(dir).entries).reverse()) other[`${ex}/${k}`] = [v, { level: 1, mtime: new Date(2020, 5, 5) }];
    other['__MACOSX/._mod.json'] = enc('junk');
    const mod = mods.readMod(fflate.zipSync(other), fflate);
    assert.equal(r.result.contentSha, await mods.contentSha(mod.entries), ex);
    assert.equal(r.result.modsetLine, `${mod.manifest.id}@${mod.manifest.version}#${r.result.contentSha}`);
  }
});

test('pinned: the content hash the Go import\'s BuildZip gives the same files (packrule_test.go)', async () => {
  const m = '{"schema":1,"api":1,"id":"pin.mod","name":"Pin","version":"1.2.0","authors":["a"],"scope":"client","content":{"messages":"messages/en.json"},"assets_original":true}';
  const r = await pack({ 'mod.json': enc(m), 'messages/en.json': enc('{"hi":"Hello"}'), 'README.md': enc('# Pin\n') });
  assert.equal(r.contentSha, 'ae9cc890f3af2f3f4e33804382edb0171c09fe64eb4ccb93e1411c103f0b64e2');
});

test('pack rule: the contract\'s pack-cases.json (the Go import runs the same file)', SOURCE_ONLY, () => {
  const cases = JSON.parse(fs.readFileSync(path.join(CHECKOUT.contract, 'pack-cases.json'), 'utf8'));
  assert.ok(cases.length >= 10);
  for (const c of cases) assert.equal(leftOutReason(c.path) === '', c.packed, `${c.path}: ${c.why || ''}`);
});

test('the pack rule\'s file types are exactly the ones mods.js accepts', () => {
  const refusal = (() => {
    try { mods.readMod(zipEntries({ 'mod.json': enc(JSON.stringify(base)), 'x.exe': enc('') }), fflate); } catch (e) { return e.message; }
    return '';
  })();
  const listed = /only (.*?) files can be in a mod/.exec(refusal);
  assert.ok(listed, refusal);
  assert.deepEqual(listed[1].split(' '), EXTS);
});

test('the CLI: check exits 1 with per-file errors, pack writes <id>-<version>.zip beside the folder', async () => {
  const dir = path.join(tmp(), 'bean.cli');
  writeFiles(dir, scaffoldFiles('bean.cli', 'lines'));
  let r = await quiet(() => main(['check', dir, '--no-lua']));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /ok {3}bean\.cli 0\.1\.0/);
  assert.match(r.out, /NOTE: Lua syntax not checked \(--no-lua\)/);
  fs.writeFileSync(path.join(dir, 'messages/en.json'), '{"line1": ""}');
  r = await quiet(() => main(['check', dir, '--no-lua']));
  assert.equal(r.code, 1);
  assert.match(r.out, /error messages\/en\.json\n {4}messages: "line1" must be text of 1 to 400 bytes/);
  fs.writeFileSync(path.join(dir, 'messages/en.json'), '{"line1": "hi", "line2": "a", "line3": "b"}');
  r = await quiet(() => main(['pack', dir]));
  assert.equal(r.code, 0, r.out);
  const zip = path.join(path.dirname(dir), 'bean.cli-0.1.0.zip');
  assert.ok(fs.existsSync(zip), r.out);
  /* The packed ZIP passes the repo's own check-zip, the tool docs point at. */
  if (CHECKOUT) {
    const cz = spawnSync(process.execPath, [CHECKOUT.checkZip, zip], { encoding: 'utf8' });
    assert.equal(cz.status, 0, cz.stderr);
  }
  /* --out still puts it anywhere; a ZIP inside the folder stays out of the next pack */
  r = await quiet(() => main(['pack', dir, '--out', path.join(dir, 'dist', 'x.zip')]));
  assert.equal(r.code, 0, r.out);
  r = await quiet(() => main(['check', dir, '--verbose']));
  assert.match(r.out, /skip {2}dist\/x\.zip: not a mod file type/);
});

test('the CLI: new refuses to overwrite, help and bad usage', async () => {
  const dir = tmp();
  let r = await quiet(() => main(['new', 'bean.x', '--dir', dir, '--kind', 'script']));
  assert.equal(r.code, 0, r.out);
  r = await quiet(() => main(['new', 'bean.x', '--dir', dir]));
  assert.equal(r.code, 1);
  assert.match(r.out, /already exists/);
  assert.equal((await quiet(() => main(['new', 'bean.y', '--kind', 'items']))).code, 2);
  assert.equal((await quiet(() => main(['frobnicate']))).code, 2);
  assert.equal((await quiet(() => main(['help']))).code, 0);
  assert.deepEqual(parseArgs(['dev', '--origin', 'a', '--origin=b', '--port', '0']).flags, { origin: ['a', 'b'], port: '0' });
});

test('a Lua syntax error is a problem, with or without a luac installed', async () => {
  const entries = {
    'mod.json': enc(JSON.stringify({ ...base, scripts: { main: 'main.lua', hooks: ['talk'] } })),
    'main.lua': enc('on("talk", function(npc) return end end)'),
  };
  const c = await checkEntries(entries);
  assert.equal(c.ok, false);
  assert.equal(c.installs, true, 'the game installs it; the script is what stops');
  assert.ok(c.problems.some((p) => p.file === 'main.lua' && p.script));
});

test('the template repo exports with a working mod, its workflow and no generated files', SOURCE_ONLY, async () => {
  const { exportTemplate, TEMPLATE_ID } = await import('../scripts/export-template.mjs');
  for (const opts of [{}, { example: 'example.tea-house' }, { kind: 'texture' }]) {
    const out = tmp();
    const list = await exportTemplate(out, { ...opts, force: true });
    for (const f of ['mod.json', 'README.md', '.github/workflows/mod.yml', '.vscode/settings.json', '.gitignore']) {
      assert.ok(list.includes(f), `${JSON.stringify(opts)}: ${f}`);
    }
    assert.ok(!list.some((f) => f.startsWith('.playac/')));
    const r = await checkFolder(out, { lua: false });
    assert.equal(r.ok, true, JSON.stringify(r.problems));
    assert.equal(r.manifest.id, TEMPLATE_ID);
    assert.equal(r.manifest.version, '0.1.0');
    assert.ok(!mods.readMod(r.result.zip, fflate).names.some((n) => n.startsWith('.')), 'the workflow and settings never ship');
  }
  await assert.rejects(exportTemplate(tmp(), { example: 'example.nope' }), /no example/);
});

/* every new mod carries the AI skill pack (ai/pack.json), and a
 * problem check prints a link to its errors catalogue entry. */
test('new adds the AI skill pack per its pack.json; --no-ai leaves it out', async () => {
  const packList = JSON.parse(fs.readFileSync(path.join(aiPackDir(), 'pack.json'), 'utf8'));
  const files = scaffoldFiles('bean.ai-mod', 'lines');
  for (const f of packList.files.filter((x) => x.scaffold !== false)) {
    assert.ok(files[f.to], f.to);
    assert.deepEqual(Buffer.from(files[f.to]), fs.readFileSync(path.join(aiPackDir(), f.from)), f.to);
  }
  assert.ok(files['.claude/skills/playac-mod/SKILL.md'] && files['.github/copilot-instructions.md']);
  assert.equal(files['AGENTS.md'], undefined, 'a top-level .md would ship in the mod ZIP');
  assert.equal(scaffoldFiles('bean.ai-mod', 'lines', { ai: false })['.claude/skills/playac-mod/SKILL.md'], undefined);
  for (const k of Object.keys(files)) if (/^\.(claude|github)\//.test(k)) assert.ok(leftOutReason(k), k);
  /* The hidden parts stay out of the mod's ZIP, and the mod still passes check. */
  assert.ok(leftOutReason('.claude/skills/playac-mod/SKILL.md'));
  assert.ok(leftOutReason('.github/copilot-instructions.md'));
  const dir = tmp();
  writeFiles(dir, files);
  writeTypes(dir);
  assert.equal((await checkFolder(dir)).ok, true);
});

test('check links each problem to its errors catalogue entry', async () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'mod.json'), JSON.stringify({ ...base, scope: 'client', content: { shops: 'shops.json' } }));
  fs.writeFileSync(path.join(dir, 'shops.json'), JSON.stringify({ shops: [{ target: 'flower', stock: [{ item: '0x2800' }] }] }));
  const { code, out } = await quiet(() => main(['check', dir]));
  assert.equal(code, 1);
  assert.match(out, /see https:\/\/playaconline\.com\/modding\/errors\/#shops-need-world/);
});

/* the scaffold's .gitignore leaves out only what `types` writes, so the
 * listing a GitHub import reads (.playac/screenshots, .playac/changelog.txt)
 * is committed. Asked of git itself. */
test('.gitignore keeps the generated types out and the listing in (git check-ignore)', async (t) => {
  if (spawnSync('git', ['--version']).status !== 0) { t.skip('no git'); return; }
  const dir = tmp();
  writeFiles(dir, scaffoldFiles('bean.git-mod', 'lines'));
  writeTypes(dir);
  fs.mkdirSync(path.join(dir, '.playac/screenshots'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.playac/screenshots/town.png'), 'x');
  fs.writeFileSync(path.join(dir, '.playac/changelog.txt'), 'First.');
  assert.equal(spawnSync('git', ['init', '-q'], { cwd: dir }).status, 0);
  const ignored = (p) => spawnSync('git', ['check-ignore', '-q', p], { cwd: dir }).status === 0;
  for (const p of ['.playac/playac.lua', '.playac/schemas/mod.schema.json', 'dist/bean.git-mod-0.1.0.zip', 'node_modules/x/y.js']) assert.ok(ignored(p), `${p} is ignored`);
  for (const p of ['.playac/screenshots/town.png', '.playac/changelog.txt', 'mod.json', 'CHANGELOG.md']) assert.ok(!ignored(p), `${p} is committed`);
});

/* a packed file nothing in mod.json reads is a warning, a tool's file
 * by its name; the pack rule (shared with the GitHub import) is unchanged. */
test('check warns on packed files the game never reads, naming tool files', async () => {
  const entries = {
    'mod.json': enc(JSON.stringify({ ...base, content: { messages: 'lang', textures: 'textures/' } })),
    'lang/en.json': enc('{"hi":"Hello"}'),
    'lang/de.json': enc('{"hi":"Hallo"}'),
    'textures/tex1_32x32_0123456789abcdef_14.dds': dds(32, 32, new Uint8Array(32 * 32 * 4)),
    'package.json': enc('{"name":"x"}'),
    'package-lock.json': enc('{}'),
    'old/backup.json': enc('{}'),
    'art/cover.png': enc('x'),
    'README.md': enc('# hi'),
  };
  const r = await checkEntries(entries, { lua: false, items: null });
  assert.equal(r.ok, true, JSON.stringify(r.problems));
  const by = (f) => r.warnings.filter((w) => w.file === f).map((w) => w.message).join(' ');
  assert.match(by('package.json'), /a tool's file \(package\.json\)/);
  assert.match(by('package-lock.json'), /a tool's file/);
  assert.match(by('old/backup.json'), /nothing in mod\.json points at it/);
  assert.match(by('art/cover.png'), /nothing in mod\.json points at it/);
  for (const f of ['mod.json', 'lang/en.json', 'lang/de.json', 'README.md', 'textures/tex1_32x32_0123456789abcdef_14.dds']) {
    assert.ok(!r.warnings.some((w) => w.file === f && /points at it|tool's file/.test(w.message)), f);
  }
  assert.ok(r.result.files >= 9, 'still packed: the pack rule is unchanged');
});

/* the CLI's edges. */
test('the CLI: usage mistakes exit 2, -h and -v, --json always JSON, --port checked', async () => {
  assert.equal((await quiet(() => main(['new']))).code, 2, 'new with no id is a usage mistake');
  let r = await quiet(() => main(['-h']));
  assert.equal(r.code, 0);
  for (const flag of ['--name', '--author', '--force', '--no-save', '--no-lua']) assert.ok(r.out.includes(flag), `help names ${flag}`);
  r = await quiet(() => main(['-v']));
  assert.equal(r.code, 0);
  assert.match(r.out, /^\d+\.\d+\.\d+ \(mod API/);
  r = await quiet(() => main(['check', path.join(tmp(), 'nope'), '--json']));
  assert.equal(r.code, 1);
  const j = JSON.parse(r.out);
  assert.equal(j.ok, false);
  assert.match(j.problems[0].message, /is not a folder/);
  const dir = tmp();
  writeFiles(dir, scaffoldFiles('bean.port-mod', 'lines'));
  r = await quiet(() => main(['dev', dir, '--port', 'abc']));
  assert.equal(r.code, 2);
  assert.match(r.out, /--port must be a number from 0 to 65535/);
  /* a port already taken says so, with what to do */
  const net = await import('node:net');
  const busy = net.createServer();
  await new Promise((res) => busy.listen(0, '127.0.0.1', res));
  try {
    r = await quiet(() => main(['dev', dir, '--port', String(busy.address().port)]));
    assert.equal(r.code, 1);
    assert.match(r.out, /already in use .*--port/);
  } finally { busy.close(); }
});

/* nobody owns "playac-mod" on npm yet, so whoever registers it would
 * run code in every mod repo's CI that resolves the name there. The workflow
 * downloads one frozen release by URL and refuses it unless its SHA-256 is
 * the pinned one; it never names the package to npm or npx. */
test('the template workflow runs one release, pinned by SHA-256, and never asks npm by name', async () => {
  const pin = await import('../lib/pin.mjs');
  const tpl = fs.readFileSync(pin.WORKFLOW_TEMPLATE, 'utf8');
  const list = pin.readReleases(pin.RELEASES_JSON);
  assert.ok(list && list.releases.length, 'releases/releases.json lists a release');
  const rel = pin.pickRelease(list, '0.0.0');
  for (const yml of [pin.renderWorkflow(tpl, rel, false), pin.renderWorkflow(tpl, rel, true)]) {
    assert.doesNotMatch(yml, /npx[^\n]*playac-mod|npm (view|exec|install|i|info|show)\s[^\n]*\bplayac-mod(@|\s|$)/m, 'no npm or npx lookup of the name');
    assert.doesNotMatch(yml, /__PLAYAC_MOD_/);
    assert.match(yml, new RegExp(`PLAYAC_MOD_SHA256: '${rel.sha256}'`));
    assert.match(yml, /sha256sum -c -/);
    assert.match(yml, /npm install -g --ignore-scripts [^\n]*"\$RUNNER_TEMP\/playac-mod\.tgz"/);
    /* the check step runs only after the hash step: no step may skip it */
    assert.ok(yml.indexOf('sha256sum -c') < yml.indexOf('run: playac-mod check'));
  }
  /* the one switch to npm changes only where the same file comes from */
  assert.match(pin.renderWorkflow(tpl, rel, false), new RegExp(`PLAYAC_MOD_URL: 'https://playaconline\\.com/modding/downloads/playac-mod-${rel.version}\\.tgz'`));
  assert.match(pin.renderWorkflow(tpl, rel, true), new RegExp(`PLAYAC_MOD_URL: 'https://registry\\.npmjs\\.org/playac-mod/-/playac-mod-${rel.version}\\.tgz'`));
  assert.throws(() => pin.renderWorkflow(tpl, null), /no playac-mod release/);
});

test('releases are frozen: every listed file is there with its hash; a changed byte is refused', SOURCE_ONLY, async () => {
  const { checkReleases, record } = await import('../scripts/release.mjs');
  const pin = await import('../lib/pin.mjs');
  assert.deepEqual(checkReleases(), []);
  const dir = tmp();
  const list = pin.readReleases(pin.RELEASES_JSON);
  const r = list.releases[0];
  const bytes = fs.readFileSync(path.join(pin.RELEASES_DIR, r.file));
  assert.deepEqual(record(r.version, bytes), r, 'the record is the file\'s own hashes');
  fs.writeFileSync(path.join(dir, 'releases.json'), JSON.stringify({ releases: [r] }));
  const bad = Buffer.from(bytes);
  bad[bad.length - 1] ^= 1;
  fs.writeFileSync(path.join(dir, r.file), bad);
  assert.match(checkReleases(dir).join('\n'), /does not match its hash/);
  /* what the release is: npm installs it (package/ prefix, the bin, no dependencies) */
  const tar = zlib.gunzipSync(bytes);
  const names = [];
  for (let at = 0; at + 512 <= tar.length;) {
    const name = tar.subarray(at, at + 100).toString('utf8').replace(/\0.*$/s, '');
    if (!name) break;
    const prefix = tar.subarray(at + 345, at + 500).toString('utf8').replace(/\0.*$/s, '');
    const size = parseInt(tar.subarray(at + 124, at + 136).toString('ascii'), 8);
    names.push(prefix ? `${prefix}/${name}` : name);
    if (name === 'package/package.json' && !prefix) assert.ok(!JSON.parse(tar.subarray(at + 512, at + 512 + size).toString('utf8')).dependencies, 'no dependencies: nothing else is fetched');
    at += 512 + Math.ceil(size / 512) * 512;
  }
  for (const f of ['package/package.json', 'package/bin/playac-mod.mjs', 'package/vendor/mods.js', 'package/vendor/source.json', 'package/template/.github/workflows/mod.yml']) assert.ok(names.includes(f), f);
});

test('new --github pins the workflow to a release from the list; with no list it refuses', async () => {
  const pin = await import('../lib/pin.mjs');
  const r = pin.pickRelease({ releases: [{ version: '0.1.0', sha256: 'a'.repeat(64) }, { version: '0.10.0', sha256: 'b'.repeat(64) }, { version: '0.2.0', sha256: 'c'.repeat(64) }] }, '9.9.9');
  assert.equal(r.version, '0.10.0', 'the newest, by number');
  assert.equal(pin.pickRelease({ releases: [{ version: '0.1.0', sha256: 'a'.repeat(64) }, { version: '0.2.0', sha256: 'c'.repeat(64) }] }, '0.1.0').version, '0.1.0', 'its own version when released');
  assert.equal(pin.pickRelease({ releases: [{ version: '0.1.0', sha256: 'nope' }] }, '0.1.0'), null, 'a record with no real hash is no pin');
  const none = path.join(tmp(), 'none.json');
  fs.writeFileSync(none, '{"releases":[]}');
  const was = process.env.PLAYAC_MOD_RELEASES;
  process.env.PLAYAC_MOD_RELEASES = none;
  try {
    const dir = path.join(tmp(), 'bean.nopin');
    const out = await quiet(() => main(['new', 'bean.nopin', '--dir', dir, '--github', '--no-ai']));
    assert.equal(out.code, 1);
    assert.match(out.out, /releases to pin the check workflow/);
    assert.ok(!fs.existsSync(path.join(dir, '.github/workflows/mod.yml')), 'no unpinned workflow is written');
  } finally {
    if (was === undefined) delete process.env.PLAYAC_MOD_RELEASES; else process.env.PLAYAC_MOD_RELEASES = was;
  }
});

/* a dependency's mod.json "exports" become remote.call hints in the
 * dependent's .playac/playac.lua (a sibling folder, or $PLAYAC_LIBS); a
 * library with broken exports, or none, adds nothing. */
test('types turns a dependency\'s exports into remote.call hints', () => {
  const root = tmp();
  const libDir = path.join(root, 'craftlib');
  const userDir = path.join(root, 'workshop');
  fs.mkdirSync(libDir);
  fs.mkdirSync(userDir);
  fs.writeFileSync(path.join(libDir, 'mod.json'), JSON.stringify({ ...base, id: 'power.craftlib', scripts: { main: 'main.lua', hooks: ['talk'] },
    exports: { count_pieces: 'How many workshop pieces the player bought.', is_bench: 'Whether an item is the Maker\'s Bench.' } }));
  fs.writeFileSync(path.join(userDir, 'mod.json'), JSON.stringify({ ...base, id: 'power.workshop', depends: { 'power.craftlib': '>=1.0.0', 'power.gone': '*' } }));
  const out = writeTypes(userDir);
  const lua = fs.readFileSync(path.join(userDir, '.playac/playac.lua'), 'utf8');
  assert.match(lua, /---@alias PlayacExports_power_craftlib\n---\| "count_pieces" # How many workshop pieces the player bought\.\n---\| "is_bench" # /);
  assert.match(lua, /---@param mod "power\.craftlib"\n---@param name PlayacExports_power_craftlib\n/);
  assert.match(lua, /function remote\.call\(mod, name, \.\.\.\) end\n$/);
  assert.ok(out.some((w) => /remote\.call hints for power\.craftlib/.test(w.file) && w.from === libDir));
  /* run again: the file is copied fresh, so the hints are there once */
  writeTypes(userDir);
  assert.equal(fs.readFileSync(path.join(userDir, '.playac/playac.lua'), 'utf8').split('@alias PlayacExports_power_craftlib').length, 2);
  /* broken exports: nothing added */
  fs.writeFileSync(path.join(libDir, 'mod.json'), JSON.stringify({ ...base, id: 'power.craftlib', exports: ['count_pieces'] }));
  writeTypes(userDir);
  assert.doesNotMatch(fs.readFileSync(path.join(userDir, '.playac/playac.lua'), 'utf8'), /PlayacExports_/);
  /* a library elsewhere, named in PLAYAC_LIBS */
  const far = tmp();
  fs.writeFileSync(path.join(far, 'mod.json'), JSON.stringify({ ...base, id: 'power.gone', scripts: { main: 'main.lua', hooks: ['talk'] }, exports: { ping: 'Says pong.' } }));
  const was = process.env.PLAYAC_LIBS;
  process.env.PLAYAC_LIBS = far;
  try { writeTypes(userDir); } finally { if (was === undefined) delete process.env.PLAYAC_LIBS; else process.env.PLAYAC_LIBS = was; }
  assert.match(fs.readFileSync(path.join(userDir, '.playac/playac.lua'), 'utf8'), /---\| "ping" # Says pong\./);
});

/* Setup dry run: npm only warns about engines, so the tool names the Node
 * floor itself; and `types` from a global install printed a path ten ".."s deep. */
test('a Node.js older than package.json engines is refused with the fix', () => {
  const floor = JSON.parse(fs.readFileSync(path.join(path.dirname(BIN), '..', 'package.json'), 'utf8')).engines.node;
  assert.equal(floor, '>=18.17');
  for (const v of ['16.20.1', 'v18.16.9', '17.9.0', '0.12.0']) assert.equal(nodeTooOld(v, '18.17'), true, v);
  for (const v of ['18.17.0', 'v18.20.5', '20.4.0', '26.13.1']) assert.equal(nodeTooOld(v, '18.17'), false, v);
  assert.equal(nodeTooOld(process.versions.node), false, 'the Node running the tests is supported');
});

test('types says where its files came from without a long relative path', () => {
  const pkg = path.resolve(path.dirname(BIN), '..');
  const version = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8')).version;
  assert.equal(typesFrom(path.join(pkg, 'vendor', 'api', 'playac.lua'), '/somewhere/else'), `playac-mod ${version}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pm-from-'));
  assert.equal(typesFrom(path.join(tmp, 'api', 'playac.lua'), tmp), path.join('api', 'playac.lua'));
  assert.equal(typesFrom('/opt/api/playac.lua', tmp), '/opt/api/playac.lua');
  fs.rmSync(tmp, { recursive: true, force: true });
});
