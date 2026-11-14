/* playac-mod dev: the protocol the game's ?moddev=1 mode reads.
 * Real HTTP on 127.0.0.1, a real folder, real edits. */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fflate, mods } from '../lib/contract.mjs';
import { changeEvents, kindOf, snapshot, startDev, PROTOCOL } from '../lib/dev.mjs';
import { scaffoldFiles, writeFiles } from '../lib/scaffold.mjs';

const SITE = 'https://playaconline.com';

/* The site's Origin unless the test names one; Origin: null sends none
 * (curl, a script), which the server refuses. */
function get(url, headers = {}) {
  const h = { Origin: SITE, ...headers };
  if (h.Origin === null) delete h.Origin;
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers: h }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
  });
}

function request(url, method, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method, headers }, (res) => { res.resume(); res.on('end', () => resolve({ status: res.statusCode, headers: res.headers })); });
    req.on('error', reject);
    req.end();
  });
}

/* An SSE reader: next(event) waits for the next event of that name. */
function events(url, headers) {
  const queue = [];
  const waiters = [];
  let buf = '';
  let req;
  const ready = new Promise((resolve) => {
    req = http.get(url, { headers }, (res) => {
      resolve(res);
      res.setEncoding('utf8');
      res.on('data', (d) => {
        buf += d;
        let at;
        while ((at = buf.indexOf('\n\n')) >= 0) {
          const block = buf.slice(0, at);
          buf = buf.slice(at + 2);
          const ev = /^event: (.*)$/m.exec(block);
          const data = /^data: (.*)$/m.exec(block);
          if (!ev) continue;
          queue.push({ event: ev[1], data: JSON.parse(data[1]) });
          for (const w of waiters.splice(0)) w();
        }
      });
    });
  });
  return {
    ready,
    async next(name, ms = 5000) {
      const until = Date.now() + ms;
      for (;;) {
        const i = queue.findIndex((q) => q.event === name);
        if (i >= 0) return queue.splice(i, 1)[0].data;
        if (Date.now() > until) throw new Error(`no ${name} event (have ${JSON.stringify(queue)})`);
        await new Promise((r) => { waiters.push(r); setTimeout(r, 100); });
      }
    },
    pending() { return queue.slice(); },
    close() { req.destroy(); },
  };
}

async function served(kind) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-dev-'));
  writeFiles(dir, scaffoldFiles('bean.dev', kind));
  const dev = await startDev(dir, { port: 0, poll: 50, lua: false });
  return { dir, dev, origin: SITE };
}

test('index, mod.zip and single files, as the protocol says', async () => {
  const { dir, dev } = await served('shop');
  try {
    const idx = await get(`${dev.url}/__playac/index`, { Origin: SITE });
    assert.equal(idx.status, 200);
    assert.equal(idx.headers['access-control-allow-origin'], SITE);
    const j = JSON.parse(idx.body);
    assert.equal(j.protocol, PROTOCOL);
    assert.equal(j.ok, true);
    assert.equal(j.id, 'bean.dev');
    assert.equal(j.scope, 'world');
    assert.deepEqual(j.files.map((f) => f.path), ['README.md', 'mod.json', 'shops.json']);
    const zip = await get(`${dev.url}/__playac/mod.zip`, { Origin: SITE });
    assert.equal(zip.status, 200);
    const mod = mods.readMod(new Uint8Array(zip.body), fflate);
    assert.equal(await mods.contentSha(mod.entries), j.contentSha);
    assert.equal(zip.headers['x-playac-content-sha'], j.contentSha);
    const shops = await get(`${dev.url}/shops.json`, { Origin: SITE });
    assert.equal(shops.status, 200);
    /* the index is the manifest of hashes the page checks each file against */
    const want = j.files.find((f) => f.path === 'shops.json').sha256;
    assert.equal(crypto.createHash('sha256').update(shops.body).digest('hex'), want, 'the bytes match the index');
    assert.equal(shops.headers['x-playac-sha256'], want, 'and the answer names its own hash');
    assert.equal(String(shops.body), fs.readFileSync(path.join(dir, 'shops.json'), 'utf8'));
    for (const p of ['/.vscode/settings.json', '/.gitignore', '/../etc/passwd', '/%2e%2e/x', '/nope.json']) {
      assert.equal((await get(`${dev.url}${p}`)).status, 404, p);
    }
  } finally {
    await dev.close();
  }
});

test('only the site may read it: other origins and other Host names are refused', async () => {
  const { dev } = await served('lines');
  try {
    assert.equal((await get(`${dev.url}/__playac/index`, { Origin: 'https://evil.example' })).status, 403);
    assert.equal((await get(`${dev.url}/__playac/index`, { Host: `evil.example:${dev.port}` })).status, 403, 'DNS rebinding');
    const bare = await get(`${dev.url}/__playac/index`, { Origin: null });
    assert.equal(bare.status, 403, 'no Origin: curl, a script, an <img> on another site');
    assert.match(String(bare.body), /no Origin/);
    assert.equal((await get(`${dev.url}/shops.json`, { Origin: null })).status, 403, 'a file with no Origin');
    assert.equal((await get(`${dev.url}/__playac/events`, { Origin: null })).status, 403, 'the stream with no Origin');
    assert.equal((await get(`${dev.url}/__playac/index`, { Origin: 'http://localhost:5173' })).status, 200);
    const pre = await request(`${dev.url}/__playac/mod.zip`, 'OPTIONS', {
      Origin: SITE, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Private-Network': 'true',
    });
    assert.equal(pre.status, 204);
    assert.equal(pre.headers['access-control-allow-private-network'], 'true');
    assert.equal(pre.headers['access-control-allow-origin'], SITE);
    assert.equal((await request(`${dev.url}/mod.json`, 'POST', { Origin: SITE })).status, 405);
  } finally {
    await dev.close();
  }
});

test('--origin adds a site', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-dev-'));
  writeFiles(dir, scaffoldFiles('bean.dev', 'lines'));
  const dev = await startDev(dir, { port: 0, poll: 50, lua: false, origins: ['http://localhost:5190/'] });
  try {
    assert.equal((await get(`${dev.url}/__playac/index`, { Origin: 'http://localhost:5190' })).status, 200);
  } finally {
    await dev.close();
  }
});

test('edits stream as change events by kind; a broken file streams problems, the fix streams the change', async () => {
  const { dir, dev } = await served('lines');
  const es = events(`${dev.url}/__playac/events`, { Origin: SITE });
  try {
    const res = await es.ready;
    assert.equal(res.headers['content-type'], 'text/event-stream');
    const hello = await es.next('hello');
    assert.equal(hello.protocol, PROTOCOL);
    assert.equal(hello.id, 'bean.dev');

    fs.writeFileSync(path.join(dir, 'messages/en.json'), JSON.stringify({ line1: 'Hello!', line2: 'b', line3: 'c' }));
    let c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['lines', ['messages/en.json']]);

    fs.appendFileSync(path.join(dir, 'main.lua'), '\n-- more\n');
    c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['lua', ['main.lua']]);

    const m = JSON.parse(fs.readFileSync(path.join(dir, 'mod.json'), 'utf8'));
    fs.writeFileSync(path.join(dir, 'mod.json'), JSON.stringify({ ...m, version: '0.2.0' }));
    c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['manifest', ['mod.json']]);

    /* README is not read by the game: no event. */
    fs.appendFileSync(path.join(dir, 'README.md'), 'more\n');
    fs.writeFileSync(path.join(dir, 'messages/en.json'), '{"line1": ');
    const p = await es.next('problems');
    assert.ok(p.problems.some((x) => x.file === 'messages/en.json'), JSON.stringify(p));
    assert.equal((await get(`${dev.url}/__playac/mod.zip`)).status, 409, 'no ZIP while it fails check');
    fs.writeFileSync(path.join(dir, 'messages/en.json'), JSON.stringify({ line1: 'Fixed', line2: 'b', line3: 'c' }));
    c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['lines', ['messages/en.json']]);
    await new Promise((r) => setTimeout(r, 300));
    assert.ok(!es.pending().some((q) => JSON.stringify(q).includes('README')), 'README.md sends nothing');
    assert.equal(JSON.parse((await get(`${dev.url}/__playac/index`)).body).version, '0.2.0');
  } finally {
    es.close();
    await dev.close();
  }
});

test('kindOf and changeEvents: adds and removes are manifest changes too', () => {
  const man = { content: { textures: 'textures/', messages: 'messages/en.json', shops: 'shops.json' } };
  assert.equal(kindOf('mod.json', man), 'manifest');
  assert.equal(kindOf('messages/en.json', man), 'lines');
  assert.equal(kindOf('shops.json', man), 'shop');
  assert.equal(kindOf('lib/x.lua', man), 'lua');
  assert.equal(kindOf('textures/tex1_a.dds', man), 'textures');
  assert.equal(kindOf('README.md', man), '');
  const prev = new Map([['mod.json', '1'], ['textures/a.dds', '2'], ['README.md', '3']]);
  const next = new Map([['mod.json', '1'], ['textures/b.dds', '4'], ['README.md', '5']]);
  assert.deepEqual(changeEvents(prev, next, man), [
    { kind: 'manifest', files: ['textures/a.dds', 'textures/b.dds'] },
    { kind: 'textures', files: ['textures/a.dds', 'textures/b.dds'] },
  ]);
});

/* every content key sends its own kind, so the game hears about it. */
test('kindOf: each api 2 content file and a messages folder name a kind', () => {
  const man = { content: { messages: 'messages', talk: 'talk.json', letters: 'mail/letters.json', events: 'events.json', items: 'items.json', shops: 'shops.json' } };
  assert.equal(kindOf('messages/en.json', man), 'lines');
  assert.equal(kindOf('messages/de.json', man), 'lines');
  assert.equal(kindOf('talk.json', man), 'talk');
  assert.equal(kindOf('mail/letters.json', man), 'letters');
  assert.equal(kindOf('events.json', man), 'events');
  assert.equal(kindOf('items.json', man), 'items');
  assert.equal(kindOf('messagesx.json', man), '', 'a name that only starts like the folder is not in it');
  assert.equal(kindOf('messages/en.json', { content: { messages: 'messages/' } }), 'lines');
});

async function servedApi2() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-dev2-'));
  writeFiles(dir, scaffoldFiles('bean.two', 'lines'));
  const m = JSON.parse(fs.readFileSync(path.join(dir, 'mod.json'), 'utf8'));
  m.api = 2;
  m.content = { ...m.content, talk: 'talk.json' };
  fs.writeFileSync(path.join(dir, 'mod.json'), JSON.stringify(m, null, 2));
  fs.writeFileSync(path.join(dir, 'talk.json'), JSON.stringify({ pools: [{ lines: ['One.'] }] }));
  const dev = await startDev(dir, { port: 0, poll: 50, lua: false });
  assert.ok(dev.state().ok, JSON.stringify(dev.state().problems));
  return { dir, dev };
}

test('an api 2 file edit streams its kind; undoing a broken save streams "fixed"', async () => {
  const { dir, dev } = await servedApi2();
  const es = events(`${dev.url}/__playac/events`, { Origin: SITE });
  try {
    await es.ready;
    await es.next('hello');
    const talk = path.join(dir, 'talk.json');
    fs.writeFileSync(talk, JSON.stringify({ pools: [{ lines: ['Two.'] }] }));
    let c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['talk', ['talk.json']]);
    /* broken, then the very bytes that were there: no file changed since the
     * last good state, but the page must hear it passes again */
    const good = fs.readFileSync(talk);
    fs.writeFileSync(talk, '{"pools": ');
    await es.next('problems');
    fs.writeFileSync(talk, good);
    c = await es.next('change');
    assert.deepEqual([c.kind, c.files], ['fixed', []]);
  } finally {
    es.close();
    await dev.close();
  }
});

test('HEAD /__playac/events is refused, never held open', async () => {
  const { dev } = await served('lines');
  try {
    const r = await request(`${dev.url}/__playac/events`, 'HEAD', { Origin: SITE });
    assert.equal(r.status, 405);
    assert.equal(r.headers.allow, 'GET');
    assert.equal((await request(`${dev.url}/__playac/index`, 'HEAD', { Origin: SITE })).status, 200, 'HEAD of a file still works');
  } finally { await dev.close(); }
});

test('snapshot reads only files whose size or time moved', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playac-snap-'));
  const f = path.join(dir, 'a.json');
  fs.writeFileSync(f, '{"a":1}');
  const t = new Date(1700000000000);
  fs.utimesSync(f, t, t);
  const cache = new Map();
  const one = snapshot(dir, cache).get('a.json');
  /* same size, same time, new bytes: a stat says nothing moved, so no read */
  fs.writeFileSync(f, '{"a":2}');
  fs.utimesSync(f, t, t);
  assert.equal(snapshot(dir, cache).get('a.json'), one, 'not read again');
  fs.utimesSync(f, t, new Date(1700000005000));
  assert.notEqual(snapshot(dir, cache).get('a.json'), one, 'a new time reads it');
  fs.rmSync(f);
  assert.equal(snapshot(dir, cache).size, 0);
  assert.equal(cache.size, 0, 'a deleted file leaves the cache');
});
