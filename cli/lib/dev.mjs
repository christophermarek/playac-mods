/* dev.mjs - `playac-mod dev`: serve a mod folder to the game's dev mode.
 *
 * THE DEV PROTOCOL (version 1). The game's developer mode (?moddev=1) is the
 * other half; the game's modding notes "playac-mod dev protocol" is the
 * written copy both sides follow.
 *
 * Listens on http://127.0.0.1:<port> (default 2604), loopback only.
 *
 *   GET /__playac/index    JSON: { protocol, seq, ok, id, version, scope,
 *                          contentSha, files: [{path, size, sha256}],
 *                          problems: [{file, message}], warnings: [...] }
 *   GET /__playac/mod.zip  the mod packed exactly as `playac-mod pack` packs
 *                          it (header X-Playac-Content-Sha). 409 + the index
 *                          JSON while the folder fails `check`.
 *   GET /__playac/events   text/event-stream (GET only: a HEAD is 405):
 *                            event: hello     data: {protocol, seq, id, version, ok}
 *                            event: change    data: {kind, files, seq}
 *                            event: problems  data: {seq, problems}
 *                          and a ": ping" comment every 15 s.
 *   GET /<path>            one file of the mod (only files the pack rule puts
 *                          in the ZIP; anything else is 404).
 *
 * change.kind is what the game must reload, one event per kind:
 *   "lines"     the content.messages file, or a file in its folder (hot)
 *   "shop"      the content.shops file         (hot)
 *   "talk"      the content.talk file          (hot, api 2)
 *   "letters"   the content.letters file       (hot, api 2)
 *   "events"    the content.events file        (hot, api 2)
 *   "items"     the content.items file         (hot, api 2; the game says
 *               in its mod log what waits: pieces already placed keep
 *               their base, a new id for them is a mod.json rename)
 *   "lua"       any .lua file                  (hot: restart that mod's script)
 *   "textures"  files under content.textures   (hot if the game can evict)
 *   "manifest"  mod.json, or a file added or removed (needs a restart)
 *   "fixed"     files: []: the folder passes `check` again with nothing the
 *               game reads changed (a broken save undone), so the page drops
 *               its "fails check" note
 * Which tier a file needs is decided again by the game (mods.js devTiers)
 * from the paths; kind tells the page what to fetch. Files the game never
 * reads (README.md) send nothing. While the folder fails `check`, only
 * "problems" events go out; when it passes again, the changes since the last
 * good state go out as change events, or one "fixed" event when there are
 * none.
 *
 * Who may read: every request must carry an Origin header naming an allowed
 * site origin (playaconline.com, its www and dev hosts, localhost:5173 and any
 * --origin), echoed in Access-Control-Allow-Origin; any other Origin is 403,
 * so another website open in the browser cannot read the folder. A request
 * with NO Origin is 403 as well: the game page's fetch and
 * EventSource always send one (they are cross-origin), so a request without
 * one is curl, a script, or a no-cors load (an <img> or <script> on another
 * site), none of which dev mode needs. A tool that wants the folder sends
 * `Origin: http://localhost:5173`, or reads the folder itself.
 *
 * The index's files[].sha256 is the manifest of hashes: the page checks each
 * file it fetches against it (devmods.ts) and reads again when a save landed
 * between the two requests. Each file answer also carries its own hash in
 * X-Playac-Sha256, from the same state as its bytes. A Host
 * header that is not 127.0.0.1 or localhost on this port is 403 (DNS
 * rebinding). Preflights answer Access-Control-Allow-Private-Network: true
 * (Chrome's Private Network Access, public site to loopback). */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { checkEntries } from './check.mjs';
import { readFolder, walk, leftOutReason } from './files.mjs';
import { sha256Hex } from './pack.mjs';

export const PROTOCOL = 1;
export const DEFAULT_PORT = 2604;
export const DEFAULT_ORIGINS = [
  'https://playaconline.com',
  'https://www.playaconline.com',
  'https://dev.playaconline.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const TYPES = {
  '.json': 'application/json; charset=utf-8',
  '.lua': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.dds': 'application/octet-stream',
  '.png': 'image/png',
};

/* Which reload a changed file asks for (see the header). '' = none. */
export function kindOf(file, manifest) {
  if (file === 'mod.json') return 'manifest';
  const c = (manifest && typeof manifest.content === 'object' && manifest.content) || {};
  if (file === c.messages) return 'lines';
  if (typeof c.messages === 'string' && c.messages && file.startsWith(c.messages.replace(/\/$/, '') + '/')) return 'lines';
  if (file === c.shops) return 'shop';
  /* api 2 data files */
  for (const k of ['talk', 'letters', 'events', 'items']) if (file === c[k]) return k;
  if (file.endsWith('.lua')) return 'lua';
  if (typeof c.textures === 'string' && file.startsWith(c.textures.replace(/\/$/, '') + '/')) return 'textures';
  return '';
}

/* path -> sha256 of every file the pack rule takes. A file whose size and
 * modified time match the last look keeps its hash: only files that moved are
 * read (rehashing a 57 MB folder 4 times a second cost 18% of a core).
 * cache: path -> { size, mtimeMs, sha }, updated in place. */
export function snapshot(dir, cache = new Map()) {
  const out = new Map();
  const seen = new Set();
  for (const rel of walk(dir)) {
    if (leftOutReason(rel)) continue;
    const abs = path.join(dir, ...rel.split('/'));
    try {
      const st = fs.statSync(abs);
      const c = cache.get(rel);
      let sha;
      if (c && c.size === st.size && c.mtimeMs === st.mtimeMs) sha = c.sha;
      else {
        sha = sha256Hex(fs.readFileSync(abs));
        cache.set(rel, { size: st.size, mtimeMs: st.mtimeMs, sha });
      }
      out.set(rel, sha);
      seen.add(rel);
    } catch { /* deleted between walk and read */ }
  }
  for (const k of [...cache.keys()]) if (!seen.has(k)) cache.delete(k);
  return out;
}

/* Group changed files into change events. added/removed files are a manifest
 * change too: the file set is what mod.json's paths are checked against. */
export function changeEvents(prev, next, manifest) {
  const byKind = new Map();
  const put = (kind, file) => {
    if (!kind) return;
    if (!byKind.has(kind)) byKind.set(kind, new Set());
    byKind.get(kind).add(file);
  };
  for (const [file, sum] of next) {
    if (!prev.has(file)) { put('manifest', file); put(kindOf(file, manifest), file); }
    else if (prev.get(file) !== sum) put(kindOf(file, manifest), file);
  }
  for (const file of prev.keys()) if (!next.has(file)) { put('manifest', file); put(kindOf(file, manifest), file); }
  const order = ['manifest', 'items', 'lines', 'shop', 'talk', 'letters', 'events', 'lua', 'textures'];
  return order.filter((k) => byKind.has(k)).map((k) => ({ kind: k, files: [...byKind.get(k)].sort() }));
}

/* Start serving dir. opts: { port, origins: [], poll (ms), log }.
 * Returns { url, port, close(), state() }. */
export async function startDev(dir, opts = {}) {
  const origins = new Set([...DEFAULT_ORIGINS, ...(opts.origins || [])].map((o) => o.replace(/\/$/, '').toLowerCase()));
  const log = opts.log || (() => {});
  const pollMs = opts.poll ?? 250;
  let seq = 0;
  let state = await build();
  let good = state.ok ? state.snap : new Map(); // the last snapshot that passed check
  const clients = new Set();

  async function build() {
    const f = readFolder(dir);
    const r = await checkEntries(f.entries, { lua: opts.lua });
    const snap = new Map(Object.entries(f.entries).map(([p, b]) => [p, sha256Hex(b)]));
    const m = r.manifest && typeof r.manifest === 'object' ? r.manifest : {};
    return {
      ok: r.ok, problems: r.problems, warnings: r.warnings, entries: f.entries, snap,
      manifest: r.manifest, id: m.id || '', version: m.version || '', scope: m.scope || '',
      contentSha: r.result ? r.result.contentSha : '', zip: r.result ? r.result.zip : null,
    };
  }

  function index() {
    return {
      protocol: PROTOCOL, seq, ok: state.ok, id: state.id, version: state.version, scope: state.scope,
      contentSha: state.contentSha,
      files: [...state.snap].map(([p, sha]) => ({ path: p, size: state.entries[p].length, sha256: sha })),
      problems: state.problems, warnings: state.warnings,
    };
  }

  function send(event, data) {
    const chunk = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) res.write(chunk);
  }

  let busy = false;
  const statCache = new Map();
  let lastSeen = snapshot(dir, statCache);
  async function tick() {
    if (busy) return;
    busy = true;
    try {
      const now = snapshot(dir, statCache);
      let same = now.size === lastSeen.size;
      if (same) for (const [k, v] of now) if (lastSeen.get(k) !== v) { same = false; break; }
      lastSeen = now;
      if (same) return;
      /* Let a save that writes several files settle. */
      await new Promise((r) => setTimeout(r, Math.min(150, pollMs)));
      lastSeen = snapshot(dir, statCache);
      const wasOk = state.ok;
      state = await build();
      seq++;
      if (!state.ok) {
        log(`problems (${state.problems.length}): ${state.problems.map((p) => p.message).join('; ')}`);
        send('problems', { seq, problems: state.problems });
        return;
      }
      const events = changeEvents(good, state.snap, state.manifest);
      good = state.snap;
      for (const e of events) {
        log(`${e.kind}: ${e.files.join(', ')}`);
        send('change', { ...e, seq });
      }
      /* A broken save undone: nothing to reload, but the page still shows
       * "fails check" until it hears the folder is good again. */
      if (!events.length && !wasOk) {
        log('passes check again');
        send('change', { kind: 'fixed', files: [], seq });
      }
    } catch (e) {
      log(`watch error: ${e.message}`);
    } finally {
      busy = false;
    }
  }

  /* '' when the request may read, else why not (no Origin is refused). */
  function cors(req, res) {
    const origin = req.headers.origin;
    if (!origin) return 'playac-mod dev: a request with no Origin is refused; the game page sends one (a tool may send Origin: http://localhost:5173)';
    if (!origins.has(origin.toLowerCase())) return 'playac-mod dev: this site may not read the mod (add it with --origin)';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Expose-Headers', 'X-Playac-Content-Sha, X-Playac-Sha256');
    return '';
  }

  const server = http.createServer((req, res) => {
    const host = String(req.headers.host || '').toLowerCase();
    const port = server.address().port;
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
      res.writeHead(403, { 'Content-Type': 'text/plain' }).end('playac-mod dev: wrong Host');
      return;
    }
    const refused = cors(req, res);
    if (refused) {
      res.writeHead(403, { 'Content-Type': 'text/plain' }).end(refused);
      return;
    }
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      if (req.headers['access-control-request-headers']) res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      if (req.headers['access-control-request-private-network']) res.setHeader('Access-Control-Allow-Private-Network', 'true');
      res.writeHead(204).end();
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, OPTIONS' }).end();
      return;
    }
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, `http://${host}`);
    const p = url.pathname;
    if (p === '/__playac/index') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(index()));
      return;
    }
    if (p === '/__playac/mod.zip') {
      if (!state.ok || !state.zip) {
        res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(index()));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/zip', 'X-Playac-Content-Sha': state.contentSha }).end(Buffer.from(state.zip));
      return;
    }
    if (p === '/__playac/events') {
      /* A HEAD would hold the stream open with nothing to read it. */
      if (req.method !== 'GET') {
        res.writeHead(405, { Allow: 'GET' }).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
      res.write(`retry: 1000\nevent: hello\ndata: ${JSON.stringify({ protocol: PROTOCOL, seq, id: state.id, version: state.version, ok: state.ok })}\n\n`);
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    let rel;
    try { rel = decodeURIComponent(p.slice(1)); } catch { rel = ''; }
    const body = Object.prototype.hasOwnProperty.call(state.entries, rel) ? state.entries[rel] : null;
    if (!body) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not in the mod');
      return;
    }
    const ext = rel.slice(rel.lastIndexOf('.')).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'X-Playac-Sha256': state.snap.get(rel) || '' }).end(Buffer.from(body));
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(opts.port ?? DEFAULT_PORT, '127.0.0.1', resolve);
  });
  const timer = setInterval(tick, pollMs);
  const ping = setInterval(() => { for (const r of clients) r.write(': ping\n\n'); }, 15000);
  const port = server.address().port;
  return {
    url: `http://127.0.0.1:${port}`,
    port,
    state: () => state,
    tick,
    close: () => new Promise((resolve) => {
      clearInterval(timer);
      clearInterval(ping);
      for (const r of clients) r.end();
      clients.clear();
      server.close(() => resolve());
      server.closeAllConnections?.();
    }),
  };
}

/* startDev on opts.port, or when it is taken the next port up, at most tries
 * ports in all. The error of the last try names its port (e.port). */
export async function startDevFree(dir, opts = {}, tries = 20) {
  const first = opts.port ?? DEFAULT_PORT;
  for (let p = first; ; p++) {
    try {
      return await startDev(dir, { ...opts, port: p });
    } catch (e) {
      e.port = p;
      if (e.code !== 'EADDRINUSE' || p >= first + tries - 1 || p >= 65535 || first === 0) throw e;
    }
  }
}
