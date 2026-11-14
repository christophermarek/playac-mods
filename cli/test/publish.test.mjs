/* playac-mod publish: the device-code sign-in and the upload, against a fake
 * API that answers as backend the game's server does. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { accountOf, changelogSection, forgetToken, importGitHub, listingFor, SHOT_DIR, savedToken, saveToken, signIn, token, upload, uploadRefusal, withToken } from '../lib/publish.mjs';

const API = 'https://api.example.test';
process.env.PLAYAC_CONFIG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-cfg-'));

function fakeApi(script) {
  const calls = [];
  const f = async (url, init = {}) => {
    calls.push({ url, init });
    const answer = script(url, init, calls);
    return { ok: answer.status < 300, status: answer.status, json: async () => answer.body };
  };
  return { f, calls };
}

test('sign-in: start, wait through pending and slow_down, get the token', async () => {
  let polls = 0;
  const { f, calls } = fakeApi((url, init) => {
    if (url.endsWith('/api/mods/cli/device')) {
      assert.equal(JSON.parse(init.body).client, 'playac-mod/9.9.9');
      return { status: 200, body: { device_code: 'dc', user_code: 'BCDF-GHJK', verification_uri: 'https://site/cli/', verification_uri_complete: 'https://site/cli/?code=BCDF-GHJK', expires_in: 600, interval: 5 } };
    }
    assert.ok(url.endsWith('/api/mods/cli/token'));
    assert.equal(JSON.parse(init.body).device_code, 'dc');
    polls++;
    if (polls === 1) return { status: 400, body: { error: 'authorization_pending' } };
    if (polls === 2) return { status: 400, body: { error: 'slow_down' } };
    return { status: 200, body: { access_token: 'pacm_x', token_type: 'Bearer', expires_in: 3600, scope: 'mods:publish' } };
  });
  const slept = [];
  const printed = [];
  let clock = 0;
  const t = await signIn(API, '9.9.9', { fetch: f, sleep: async (ms) => { slept.push(ms); clock += ms; }, print: (s) => printed.push(s), now: () => clock });
  assert.deepEqual(t, { token: 'pacm_x', expiresIn: 3600 });
  assert.deepEqual(slept, [5000, 5000, 10000], 'slow_down adds 5 s, as RFC 8628 says');
  assert.ok(printed.join('\n').includes('BCDF-GHJK'));
  assert.equal(calls.length, 4);
});

test('sign-in: denied and expired end with plain words', async () => {
  const start = { status: 200, body: { device_code: 'dc', user_code: 'X', verification_uri: 'u', verification_uri_complete: 'u', expires_in: 10, interval: 5 } };
  let clock = 0;
  const io = (answer) => ({ fetch: fakeApi((url) => (url.endsWith('/device') ? start : answer)).f, sleep: async (ms) => { clock += ms; }, print: () => {}, now: () => clock });
  await assert.rejects(signIn(API, '1', io({ status: 400, body: { error: 'access_denied' } })), /denied/);
  clock = 0;
  await assert.rejects(signIn(API, '1', io({ status: 400, body: { error: 'authorization_pending' } })), /expired/);
  await assert.rejects(signIn(API, '1', { fetch: fakeApi(() => ({ status: 429, body: { code: 'rate_limited', message: 'Too many' } })).f, print: () => {} }), /did not start: Too many/);
});

test('the token is saved per API until a minute before it expires', async () => {
  forgetToken(API);
  saveToken(API, 'pacm_saved', 3600, 1_000_000);
  assert.equal(savedToken(API, 1_000_000), 'pacm_saved');
  assert.equal(savedToken(API, 1_000_000 + 3600_000 - 30_000), null, 'inside the last minute');
  assert.equal(savedToken('https://other.test', 1_000_000), null);
  const mode = fs.statSync(path.join(process.env.PLAYAC_CONFIG_DIR, 'credentials.json')).mode & 0o777;
  if (process.platform !== 'win32') assert.equal(mode, 0o600);
  saveToken(API, 'pacm_live', 3600);
  assert.equal(await token(API, '1', { fetch: () => { throw new Error('no sign-in needed'); } }), 'pacm_live');
  forgetToken(API);
  assert.equal(savedToken(API), null);
});

test('upload sends the form (ZIP, screenshots, changelog) with the bearer token; refusals are said plainly', async () => {
  const { f, calls } = fakeApi((url, init) => {
    assert.equal(url, `${API}/api/mods`);
    assert.equal(init.headers.Authorization, 'Bearer pacm_t');
    assert.equal(init.headers['Content-Type'], undefined, 'fetch sets the multipart boundary');
    return { status: 201, body: { id: 'v1', mod_id: 'a.b', version: '1.0.0', status: 'pending' } };
  });
  const zip = new Uint8Array([1, 2, 3]);
  const listing = { shots: [{ name: 's.png', type: 'image/png', bytes: new Uint8Array([9]) }], changelog: 'Green tea.' };
  assert.deepEqual(await upload(API, 'pacm_t', zip, listing, { fetch: f }), { id: 'v1', mod_id: 'a.b', version: '1.0.0', status: 'pending' });
  const form = calls[0].init.body;
  assert.ok(form instanceof FormData);
  assert.deepEqual(new Uint8Array(await form.get('zip').arrayBuffer()), zip);
  assert.equal(form.getAll('screenshot').length, 1);
  assert.equal(form.get('screenshot').type, 'image/png');
  assert.equal(form.get('changelog'), 'Green tea.');
  const refused = fakeApi(() => ({ status: 409, body: { error: 'version_exists', detail: 'x' } }));
  await assert.rejects(upload(API, 't', zip, listing, { fetch: refused.f }), /raise "version"/);
  assert.match(uploadRefusal(400, { error: 'screenshot_required' }), /--shot/);
  assert.match(uploadRefusal(403, { error: 'publisher_terms' }), /accept the mod rules/);
  assert.equal(uploadRefusal(400, { error: 'invalid_mod', detail: 'mod.json: bad' }), 'mod.json: bad');
});

test('publish --github asks the registry to import a tag', async () => {
  const { f, calls } = fakeApi(() => ({ status: 201, body: { id: 'v', mod_id: 'a.b', version: '1.2.0', status: 'pending' } }));
  await importGitHub(API, 'pacm_t', 'github.com/you/tea@v1.2.0', { fetch: f });
  assert.equal(calls[0].url, `${API}/api/mods/import`);
  assert.deepEqual(JSON.parse(calls[0].init.body), { source: 'github.com/you/tea@v1.2.0' });
  assert.equal(calls[0].init.headers.Authorization, 'Bearer pacm_t');
});

/* the storefront listing, from flags or the folder's own files. */
/* 320x240 by its header (a screenshot is 200 to 4096 px a side); the rest is a 1x1 picture, never decoded here */
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000001400000' + '00f00806000000' + '1f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082', 'hex');
const JPG = Buffer.from('ffd8ffe000104a46494600010100000100010000ffd9', 'hex');

test('the listing: .playac/screenshots and CHANGELOG.md by default, flags win, plain errors when missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-listing-'));
  assert.throws(() => listingFor(dir, '1.2.0'), /add a screenshot/);
  fs.mkdirSync(path.join(dir, SHOT_DIR), { recursive: true });
  fs.writeFileSync(path.join(dir, SHOT_DIR, 'b.png'), PNG);
  fs.writeFileSync(path.join(dir, SHOT_DIR, 'a.jpg'), JPG);
  fs.writeFileSync(path.join(dir, SHOT_DIR, 'notes.txt'), 'no');
  assert.throws(() => listingFor(dir, '1.2.0'), /changelog/);
  fs.writeFileSync(path.join(dir, 'CHANGELOG.md'), '# Log\n## [1.2.0]\n- Green tea.\n- New hours.\n## 1.1.0\n- Old.\n');
  const l = listingFor(dir, '1.2.0');
  assert.deepEqual(l.shots.map((s) => [s.name, s.type]), [['a.jpg', 'image/jpeg'], ['b.png', 'image/png']]);
  assert.equal(l.changelog, 'Green tea.\nNew hours.');
  const own = path.join(dir, 'own.png');
  fs.writeFileSync(own, PNG);
  const f = listingFor(dir, '1.2.0', { shots: [own], changelog: ' Mine. ' });
  assert.deepEqual(f.shots.map((s) => s.name), ['own.png']);
  assert.equal(f.changelog, 'Mine.');
  assert.throws(() => listingFor(dir, '1.2.0', { shots: [path.join(dir, 'CHANGELOG.md')] }), /not a PNG or a JPEG/);
  /* the bytes are checked, not the name: an empty .png, a text file
   * named .jpg, a PNG cut short */
  for (const [name, bytes] of [['empty.png', Buffer.alloc(0)], ['text.jpg', Buffer.from('not a picture')], ['cut.png', PNG.subarray(0, 12)]]) {
    const bad = path.join(dir, name);
    fs.writeFileSync(bad, bytes);
    assert.throws(() => listingFor(dir, '1.2.0', { shots: [bad] }), /is not a (PNG|JPEG) picture/, name);
  }
  /* No section for this version: .playac/changelog.txt. */
  fs.writeFileSync(path.join(dir, '.playac', 'changelog.txt'), 'Fallback line.\n');
  assert.equal(listingFor(dir, '9.9.9').changelog, 'Fallback line.');
});

test('changelogSection matches the backend rule', () => {
  const md = '# Log\n## v2.0.0\nBig.\n## 1.0.0 (first)\n* One\n* Two\n';
  assert.equal(changelogSection(md, '1.0.0'), 'One\nTwo');
  assert.equal(changelogSection(md, '2.0.0'), 'Big.');
  assert.equal(changelogSection(md, '3.0.0'), '');
  assert.equal(changelogSection('## 1.0.10\nx\n', '1.0.1'), '');
});

/* a saved token the server refuses (revoked on the site) is forgotten
 * and the sign-in runs once more; a fresh token refused is not retried. */
function signInScript(newToken, extra = {}) {
  return (url) => {
    if (url.endsWith('/api/mods/cli/device')) return { status: 200, body: { device_code: 'dc', user_code: 'BCDF-GHJK', verification_uri: 'u', verification_uri_complete: 'u', expires_in: 600, interval: 1 } };
    if (url.endsWith('/api/mods/cli/token')) return { status: 200, body: { access_token: newToken, token_type: 'Bearer', expires_in: 3600, ...extra } };
    return null;
  };
}

test('a revoked saved token is forgotten and the sign-in runs once more', async () => {
  forgetToken(API);
  saveToken(API, 'pacm_revoked', 3600);
  const sign = signInScript('pacm_new');
  const { f, calls } = fakeApi((url, init) => sign(url) || (init.headers.Authorization === 'Bearer pacm_new'
    ? { status: 201, body: { mod_id: 'bean.x', version: '1.0.0' } }
    : { status: 401, body: { code: 'bad_token', message: 'That sign-in has ended. Run the command again to sign in.' } }));
  const printed = [];
  const io = { fetch: f, sleep: async () => {}, print: (s) => printed.push(s) };
  const r = await withToken(API, '1', (tok) => upload(API, tok, new Uint8Array([1]), { shots: [], changelog: 'x' }, { fetch: f }), io);
  assert.equal(r.mod_id, 'bean.x');
  assert.deepEqual(calls.filter((c) => c.url.endsWith('/api/mods')).map((c) => c.init.headers.Authorization), ['Bearer pacm_revoked', 'Bearer pacm_new']);
  assert.equal(savedToken(API), 'pacm_new', 'the new sign-in is the saved one');
  assert.ok(printed.some((s) => /sign in again/.test(s)));

  /* the new token refused too: no loop, the refusal is said, nothing saved */
  forgetToken(API);
  saveToken(API, 'pacm_revoked', 3600);
  const always = fakeApi((url) => sign(url) || { status: 401, body: { code: 'bad_token', message: 'That sign-in has ended.' } });
  await assert.rejects(withToken(API, '1', (tok) => upload(API, tok, new Uint8Array([1]), { shots: [], changelog: 'x' }, { fetch: always.f }), { ...io, fetch: always.f }), /sign-in has ended/);
  assert.equal(always.calls.filter((c) => c.url.endsWith('/api/mods')).length, 2, 'one retry, never a loop');
  assert.equal(savedToken(API), null, 'a refused token is not kept');
  forgetToken(API);
});

test('sign-in names the approving account when the server does; an empty name is refused; an older server still works', async () => {
  const run = (extra) => {
    const { f } = fakeApi(signInScript('pacm_a', extra));
    const printed = [];
    return { p: signIn(API, '1', { fetch: f, sleep: async () => {}, print: (s) => printed.push(s) }), printed };
  };
  let r = run({ account_name: 'Bean' });
  assert.equal((await r.p).account, 'Bean');
  assert.ok(r.printed.some((s) => s.includes('Signed in as Bean')));
  r = run({ approved_by: { display_name: 'Sprout' } });
  assert.equal((await r.p).account, 'Sprout');
  r = run({});
  assert.deepEqual(await r.p, { token: 'pacm_a', expiresIn: 3600 }, 'an older server sends no name');
  assert.ok(!r.printed.some((s) => /Signed in as/.test(s)));
  await assert.rejects(run({ account_name: '' }).p, /did not say which account/);
  await assert.rejects(run({ approved_by: null }).p, /did not say which account/);
  assert.equal(accountOf({ account: '  Bean  ' }), 'Bean');

  /* the saved sign-in says the name again */
  forgetToken(API);
  const { f } = fakeApi(signInScript('pacm_b', { account_name: 'Bean' }));
  const printed = [];
  await token(API, '1', { fetch: f, sleep: async () => {}, print: (s) => printed.push(s) });
  await token(API, '1', { fetch: () => { throw new Error('no sign-in needed'); }, print: (s) => printed.push(s) });
  assert.ok(printed.some((s) => /Signed in as Bean \(saved sign-in/.test(s)), printed.join('\n'));
  forgetToken(API);
});
