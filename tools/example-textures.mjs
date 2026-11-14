// @ts-nocheck: plain JS; the frontend's downloads route imports it (type checks would fail on it)
/* example-textures.mjs - the drawn textures of the example texture mods.
 *
 * Every pixel here is drawn from scratch with a fixed seed, so a build always
 * makes the same bytes. The NAMES say which game texture to replace; they were
 * matched to the game's own assets by hashing them (XXH64, the loader's key):
 *
 *   tree crowns   obj_s_tree3_leaf_tex a67216e4ad55d908 (spring to autumn),
 *                 obj_f_tree_leaf_tex  ac6a2be34281d4e2 (the cherry trees' model),
 *                 obj_w_tree_leaf_tex  53d6cc5ace654ac7 (winter, snow on top)
 *   ground        mFM_grd_s_grass*_tex (spring to autumn, 9 palettes),
 *                 mFM_grd_w_grass*_tex (winter, 3 palettes)
 *   cliff faces   mFM_grd_s_earth*_tex / mFM_grd_w_earth*_tex
 *   river banks   mFM_grd_s_stone*_tex / mFM_grd_w_stone*_tex
 *
 * The cliff and bank textures are 64x64 strips: the top third continues the
 * ground above the edge, the rest is the face. Our versions keep that layout. */

/* The town grass, every palette it is drawn with (season, time of day). */
export const GRASS_SUMMER = ['626709d910129694', '903adc6355e36f59', 'e96fecd242518c9f'];
export const GRASS_WINTER = ['82f28ec4199a45be', 'cfa57a6e6f966d11', 'e2ab673814e71af6'];
const GROUND_PALS_SUMMER = ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7'];
const GROUND_PALS_WINTER = ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411'];

/* Cliff faces (earth) and river and pond banks (stone), 64x64, three variants
 * each (they differ only in the strip of ground at the top). */
const EARTH_SUMMER = ['99c780e750314916', '16de5cbb85d58cc0', 'f628105fb6e026fd'];
const EARTH_WINTER = ['0dd181f7c8e1d9e1', 'e5488c12d43d6cbc', '64ac9d75399172f0'];
const STONE_SUMMER = ['1218fdfe9c963f24', '78690dcebd874a3b', '2d865e307f1a0fdc'];
const STONE_WINTER = ['2ec0ba79769bedc7', 'b6437b8020145bc6', '9438dc9288174b5a'];
const CLIFF_PALS_SUMMER = ['1a528d9e2d030d75', '3550d666ec29c007', '8726422d1b2f2aad', '9d75eaa7a1ccf1f0', 'a75840f4c678ddf2', 'b3fce705d9254ac9', 'c57fcdc2350ccb60', 'e7caee67e620a23f', 'fa38180193edbd7a'];
const CLIFF_PALS_WINTER = ['d82b9b2966f92af9', 'ef6c44b49bac8f36', 'f3efb34437b6507a'];
const BANK_PALS_SUMMER = ['068f1a8406ceee12', '0789ec32e990d1dd', '13ccf38a85ba5762', '333bfae46b108c6f', '599fab9242643f11', '7f3018ac096bff6a', 'a244114f5c9f6280', 'b779a2078cc78a5d', 'd9fae625590522f8'];
const BANK_PALS_WINTER = ['06c9f4dabbeaa60e', '58860d786e3c5849', 'e8abaf4d954d4db9'];

/* Tree crowns, 64x64 CI4. All three share the tree palette table (one per
 * stretch of the year; 13 distinct); 4aac... and 16e7... are two more the game
 * draws them with. Golden trees use their own palette and are left gold. */
const CROWN_SUMMER = 'a67216e4ad55d908';
const CROWN_CHERRY = 'ac6a2be34281d4e2';
const CROWN_WINTER = '53d6cc5ace654ac7';
const TREE_PALS = ['06bfb4536cc20449', '16e732c70a64a299', '2099c3e106bdc0be', '232e26af01163c8f', '429d5ed9641dd1a5', '4aac9a980f46ecdc', '69518843b58ca316', '9beacb90ce230a25', 'aed09971b51c9f1e', 'b34a113243ba13b0', 'c04f01c308e946af', 'd3011b03de62a9ea', 'e51b99c276a0bd60', 'f998b722b60e2b6c', 'feccf8ea3db01d8f'];

const name = (w, h, tex, pal) => `textures/tex1_${w}x${h}_${tex}_${pal}_8.dds`;

/* An uncompressed 32-bit DDS, pixels R G B A (the order pc_texderive_dds_format reads). */
export function dds(w, h, rgba) {
  const out = new Uint8Array(128 + w * h * 4);
  const v = new DataView(out.buffer);
  out.set([0x44, 0x44, 0x53, 0x20], 0); // 'DDS '
  v.setUint32(4, 124, true);
  v.setUint32(8, 0x100f, true); // CAPS | HEIGHT | WIDTH | PITCH | PIXELFORMAT
  v.setUint32(12, h, true);
  v.setUint32(16, w, true);
  v.setUint32(20, w * 4, true);
  v.setUint32(76, 32, true); // pixel format size
  v.setUint32(80, 0x41, true); // RGB | ALPHAPIXELS
  v.setUint32(88, 32, true);
  v.setUint32(92, 0x000000ff, true);
  v.setUint32(96, 0x0000ff00, true);
  v.setUint32(100, 0x00ff0000, true);
  v.setUint32(104, 0xff000000, true);
  v.setUint32(108, 0x1000, true); // TEXTURE
  out.set(rgba, 128);
  return out;
}

/* ── drawing helpers ─────────────────────────────────────────────────────── */

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff) / 0x7fffffff);
}
const clamp = (v, lo = 0, hi = 255) => (v < lo ? lo : v > hi ? hi : v);
const mix = (a, b, t) => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t);

class Canvas {
  constructor(w, h) { this.w = w; this.h = h; this.px = new Uint8Array(w * h * 4); }
  i(x, y) {
    x = ((x % this.w) + this.w) % this.w; y = ((y % this.h) + this.h) % this.h;
    return (y * this.w + x) * 4;
  }
  set(x, y, c, a = 255) { const i = this.i(x, y); this.px[i] = clamp(Math.round(c[0])); this.px[i + 1] = clamp(Math.round(c[1])); this.px[i + 2] = clamp(Math.round(c[2])); this.px[i + 3] = a; }
  get(x, y) { const i = this.i(x, y); return [this.px[i], this.px[i + 1], this.px[i + 2], this.px[i + 3]]; }
  blend(x, y, c, t) { const o = this.get(x, y); this.set(x, y, mix(o, c, t), o[3]); }
}

/* Value noise that tiles over the canvas: n cells across, smoothstep between. */
function tilingNoise(size, n, rand) {
  const lat = Array.from({ length: n * n }, rand);
  const at = (i, j) => lat[(((j % n) + n) % n) * n + (((i % n) + n) % n)];
  return (x, y) => {
    const fx = (x / size) * n, fy = (y / size) * n;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
}

/* ── Blossom Lane ────────────────────────────────────────────────────────── */

/* A round cherry blossom crown on a transparent ground, 128x128 (the game's is
 * 64x64; the crown cards map the whole square). Alpha is 0 or 255 like the
 * game's, so the crown cuts out the same way. snow: white caps on top. */
export function blossomCrown({ snow = false, seed = 2651 } = {}) {
  const S = 128, c = new Canvas(S, S), rand = rng(seed);
  const C = S / 2;
  /* The crown: one core disc and a ring of puffs, each a sphere lit from the upper left. */
  const puffs = [{ x: C, y: C + 2, r: 30 }];
  for (let k = 0; k < 26; k++) {
    const a = (k / 26) * Math.PI * 2 + rand() * 0.2;
    const d = 40 + rand() * 9;
    puffs.push({ x: C + Math.cos(a) * d, y: C + Math.sin(a) * d * 0.95, r: 9 + rand() * 6 });
  }
  for (let k = 0; k < 22; k++) {
    const a = (k / 22) * Math.PI * 2 + rand() * 0.4;
    const d = 26 + rand() * 8;
    puffs.push({ x: C + Math.cos(a) * d, y: C + Math.sin(a) * d, r: 10 + rand() * 6 });
  }
  for (let k = 0; k < 18; k++) {
    const a = rand() * Math.PI * 2, d = rand() * 20;
    puffs.push({ x: C + Math.cos(a) * d, y: C + Math.sin(a) * d, r: 10 + rand() * 5 });
  }
  const deep = [150, 66, 108], shadow = [206, 112, 150], base = [244, 170, 196], light = [255, 226, 236];
  const L = [-0.55, -0.65, 0.52];
  const noise = tilingNoise(S, 16, rand);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      /* The puff drawn on top here: the one whose surface is highest (largest z). */
      let best = null, bz = -1, z2 = -1;
      for (const p of puffs) {
        const dx = (x + 0.5 - p.x) / p.r, dy = (y + 0.5 - p.y) / p.r;
        const q = 1 - dx * dx - dy * dy;
        if (q <= 0) continue;
        /* Puffs nearer the middle sit higher (the crown is a dome). */
        const z = Math.sqrt(q) * p.r + (1 - Math.hypot(p.x - C, p.y - C) / C) * 14 + (p === puffs[0] ? -8 : 0);
        if (z > bz) { z2 = bz; bz = z; best = { dx, dy, nz: Math.sqrt(q), p }; } else if (z > z2) z2 = z;
      }
      if (!best) { c.set(x, y, deep, 0); continue; }
      /* Light = the whole crown as one dome, plus each puff's own roundness. */
      const gx = (x + 0.5 - C) / 60, gy = (y + 0.5 - C) / 60, gz = Math.sqrt(Math.max(0, 1 - gx * gx - gy * gy));
      const local = best.dx * L[0] + best.dy * L[1] + best.nz * L[2];
      const global = gx * L[0] + gy * L[1] + gz * L[2];
      const lit = clamp(0.55 * global + 0.45 * local + (noise(x * 2, y * 2) - 0.5) * 0.25, -1, 1);
      /* Toward the middle of the whole crown is deeper in shade. */
      const far = Math.hypot(x - C, y - C) / C;
      let col = lit < 0.05 ? mix(deep, shadow, (lit + 1) / 1.05) : lit < 0.55 ? mix(shadow, base, (lit - 0.05) / 0.5) : mix(base, light, (lit - 0.55) / 0.45);
      col = mix(col, deep, clamp((0.35 - far) * 0.6, 0, 0.2));
      col = col.map((v) => v + (noise(x, y) - 0.5) * 18);
      /* A crease where one puff tucks under another. */
      if (z2 >= 0 && bz - z2 < 0.9 && best.dy > -0.2) col = mix(col, deep, 0.3);
      if (snow && best.dy < -0.25 && best.nz > 0.2 && best.dy + noise(x * 3, y) * 0.25 < -0.32) col = mix([238, 244, 255], [255, 255, 255], clamp(lit, 0, 1));
      c.set(x, y, col);
    }
  }
  /* Blossoms: five petals and a deep pink eye, only where the crown is. */
  const inside = (x, y) => x >= 0 && y >= 0 && x < S && y < S && c.get(x, y)[3] === 255;
  const flower = (fx, fy, r, petal) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + fx;
      const px = Math.round(fx + Math.cos(a) * r), py = Math.round(fy + Math.sin(a) * r);
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) if (inside(px + dx, py + dy)) c.set(px + dx, py + dy, petal);
    }
    if (inside(fx, fy)) c.set(fx, fy, [214, 72, 128]);
  };
  for (let k = 0; k < 230; k++) {
    const x = Math.floor(rand() * S), y = Math.floor(rand() * S);
    if (!inside(x, y)) continue;
    const g = c.get(x, y);
    if (snow && g[0] > 230 && g[1] > 235 && g[2] > 245) continue;
    const bright = (g[0] + g[1] + g[2]) / 3;
    const petal = bright > 190 ? (rand() < 0.5 ? [255, 250, 252] : [255, 236, 243]) : [250, 196, 216];
    flower(x, y, 2, petal);
  }
  return c.px;
}

/* Spring grass with fallen petals, 128x128, tiles seamlessly. */
export function petalGrass(seed = 2652) {
  const S = 128, c = new Canvas(S, S), rand = rng(seed);
  const o1 = tilingNoise(S, 4, rand), o2 = tilingNoise(S, 16, rand), o3 = tilingNoise(S, 64, rand);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = o1(x, y) * 0.5 + o2(x, y) * 0.32 + o3(x, y) * 0.18;
      c.set(x, y, [88 + n * 40, 158 + n * 50, 72 + n * 26]);
    }
  }
  /* Blades: short darker and lighter strokes. */
  for (let k = 0; k < 260; k++) {
    const x = Math.floor(rand() * S), y = Math.floor(rand() * S), up = rand() < 0.5;
    const col = up ? [140, 205, 104] : [62, 120, 56];
    c.blend(x, y, col, 0.7); c.blend(x, y - 1, col, 0.45);
  }
  /* Petals: small rotated ovals, pink to white, a few in drifts. */
  const petal = (px, py, a, col) => {
    const ca = Math.cos(a), sa = Math.sin(a);
    for (let y = -4; y <= 4; y++) {
      for (let x = -4; x <= 4; x++) {
        const u = x * ca + y * sa, v = -x * sa + y * ca;
        const d = (u * u) / 13 + (v * v) / 4.5;
        if (d <= 1) c.set(Math.round(px + x), Math.round(py + y), mix(col, [255, 255, 255], (1 - d) * 0.35));
      }
    }
    c.blend(Math.round(px + ca * 3), Math.round(py + sa * 3), [220, 110, 150], 0.6);
  };
  const tints = [[248, 178, 202], [252, 206, 222], [255, 232, 240], [242, 160, 190]];
  for (let k = 0; k < 8; k++) {
    const dx = rand() * S, dy = rand() * S;
    for (let j = 0; j < 9; j++) petal(dx + (rand() - 0.5) * 22, dy + (rand() - 0.5) * 16, rand() * Math.PI, tints[Math.floor(rand() * 4)]);
  }
  for (let k = 0; k < 34; k++) petal(rand() * S, rand() * S, rand() * Math.PI, tints[Math.floor(rand() * 4)]);
  return c.px;
}

export function blossomLaneFiles() {
  const files = {};
  const crown = dds(128, 128, blossomCrown());
  const snowy = dds(128, 128, blossomCrown({ snow: true }));
  for (const pal of TREE_PALS) {
    files[name(64, 64, CROWN_SUMMER, pal)] = crown;
    files[name(64, 64, CROWN_CHERRY, pal)] = crown;
    files[name(64, 64, CROWN_WINTER, pal)] = snowy;
  }
  const grass = dds(128, 128, petalGrass());
  for (const tex of GRASS_SUMMER) for (const pal of GROUND_PALS_SUMMER) files[name(32, 32, tex, pal)] = grass;
  return files;
}

/* ── Cobble Town ─────────────────────────────────────────────────────────── */

/* Cobbles: a periodic Voronoi pattern, n stones across, each a low dome lit
 * from the upper left, in grey-brown mortar. Drawn into rows y0..y1 of c. */
function cobbles(c, { n, y0 = 0, y1 = c.h, snow = false, seed }) {
  const rand = rng(seed), W = c.w;
  const cell = W / n, rows = Math.ceil((y1 - y0) / cell);
  const pts = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < n; i++) {
      const t = rand();
      pts.push({
        x: (i + 0.2 + rand() * 0.6) * cell,
        y: y0 + (j + 0.2 + rand() * 0.6) * cell,
        tone: [150 + t * 40 + rand() * 10, 144 + t * 36 + rand() * 8, 134 + t * 30 + rand() * 12],
      });
    }
  }
  const grain = tilingNoise(W, 32, rand);
  const moss = tilingNoise(W, 8, rand);
  /* Always tiles across; tiles top to bottom too when it fills the canvas. */
  const H = y1 - y0, full = y0 === 0 && y1 === c.h && Math.abs(H / cell - rows) < 1e-9;
  const offsets = [];
  for (const ox of [-W, 0, W]) for (const oy of full ? [-H, 0, H] : [0]) offsets.push([ox, oy]);
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < W; x++) {
      let d1 = 1e9, d2 = 1e9, p1 = null;
      for (const p of pts) {
        for (const [ox, oy] of offsets) {
          const dx = x + 0.5 - (p.x + ox), dy = y + 0.5 - (p.y + oy);
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < d1) { d2 = d1; d1 = d; p1 = { p, dx, dy }; } else if (d < d2) d2 = d;
        }
      }
      const edge = (d2 - d1) / 2;
      const g = (grain(x, y) - 0.5) * 22;
      if (edge < 1.1) {
        let col = [88 + g, 82 + g, 74 + g];
        if (!snow && moss(x, y) > 0.55) col = mix(col, [84, 118, 60], 0.6);
        if (snow) col = [226 + g * 0.3, 232 + g * 0.3, 242];
        c.set(x, y, col);
        continue;
      }
      const r = cell * 0.55;
      const ux = p1.dx / r, uy = p1.dy / r;
      const lit = -0.6 * ux - 0.7 * uy;
      let col = p1.p.tone.map((v) => v + lit * 26 + g);
      if (edge < 2.4) col = col.map((v) => v * 0.82);
      if (snow && uy + (grain(x * 3, y * 3) - 0.5) * 0.35 < -0.5) col = mix(col, [246, 249, 255], 0.85);
      c.set(x, y, col);
    }
  }
}

export function cobbleGround({ snow = false } = {}) {
  const c = new Canvas(128, 128);
  cobbles(c, { n: 6, snow, seed: snow ? 2661 : 2660 });
  return c.px;
}

/* A course of blocks, widths random but summing to the full width so the wall
 * tiles across. Calls draw(x0, x1, k) for each block. */
function course(W, minW, maxW, rand, offset) {
  const ws = [];
  let left = W;
  while (left > 0) {
    let w = Math.round(minW + rand() * (maxW - minW));
    if (left - w < minW) w = left;
    ws.push(w); left -= w;
  }
  const out = [];
  let x = offset;
  for (const w of ws) { out.push([x, x + w]); x += w; }
  return out;
}

/* Walls: the top `band` rows continue the cobbled ground, a capstone ledge, then
 * the face. kind 'cliff' = dressed sandstone blocks with ivy, 'bank' = brick
 * quay that darkens and greens toward the water. 128x128 (the game's 64x64). */
export function wallFace({ kind, snow = false }) {
  const S = 128, c = new Canvas(S, S), rand = rng(kind === 'cliff' ? 2670 : 2680);
  const band = 36, capH = 12;
  cobbles(c, { n: 12, y0: 0, y1: band, snow, seed: snow ? 2663 : 2662 });
  const grain = tilingNoise(S, 32, rand);
  const blotch = tilingNoise(S, 8, rand);
  /* Capstone: long slabs, a lit top edge and a dark lip underneath. */
  const capTone = kind === 'cliff' ? [206, 192, 164] : [168, 170, 172];
  for (const [x0, x1] of course(S, 26, 40, rand, Math.floor(rand() * 16))) {
    const t = (rand() - 0.5) * 18;
    for (let y = band; y < band + capH; y++) {
      for (let x = x0; x < x1; x++) {
        const g = (grain(x, y) - 0.5) * 16;
        let col = capTone.map((v) => v + t + g);
        const ry = y - band;
        if (x === x0 || x === x1 - 1) col = col.map((v) => v * 0.6);
        else if (ry < 2) col = snow ? [246, 249, 255] : col.map((v) => v + 24);
        else if (ry >= capH - 3) col = col.map((v) => v * (ry === capH - 1 ? 0.45 : 0.7));
        c.set(x, y, col);
      }
    }
  }
  const top = band + capH;
  if (kind === 'cliff') {
    /* Dressed blocks, courses 14 high, staggered. */
    let y = top;
    while (y < S) {
      const h = Math.min(14, S - y);
      for (const [x0, x1] of course(S, 18, 34, rand, Math.floor(rand() * 20))) {
        const tone = mix([196, 166, 124], [176, 140, 104], rand()).map((v) => v + (rand() - 0.5) * 14);
        for (let yy = y; yy < y + h; yy++) {
          for (let x = x0; x < x1; x++) {
            const g = (grain(x, yy) - 0.5) * 18 + (blotch(x, yy) - 0.5) * 16;
            const ry = yy - y, rx = x - x0;
            let col = tone.map((v) => v + g);
            if (ry === 0 || rx === 0) col = [96, 82, 64];
            else if (ry === 1 || rx === 1) col = col.map((v) => v + 22);
            else if (ry === h - 1 || x === x1 - 1) col = col.map((v) => v * 0.72);
            if (snow && ry === 1) col = [240, 245, 255];
            c.set(x, yy, col);
          }
        }
      }
      y += h;
    }
    /* Ivy hanging from the capstone (summer only). */
    if (!snow) {
      for (let k = 0; k < 7; k++) {
        let x = rand() * S;
        const len = 10 + rand() * 30;
        for (let s = 0; s < len; s++) {
          x += (rand() - 0.5) * 1.4;
          const yy = top - 2 + s;
          for (const dx of [-1, 0, 1]) if (rand() < 0.7) c.set(Math.round(x) + dx, yy, rand() < 0.5 ? [70, 128, 58] : [96, 160, 72]);
          if (rand() < 0.3) c.set(Math.round(x) + (rand() < 0.5 ? -2 : 2), yy, [120, 182, 86]);
        }
      }
    }
  } else {
    /* Running-bond bricks 8 high, 20 wide, darker and greener toward the water. */
    for (let y = top, row = 0; y < S; y += 8, row++) {
      const off = row % 2 ? 10 : 0;
      for (let bx = 0; bx < S; bx += 20) {
        const tone = mix([178, 96, 72], [150, 78, 62], rand()).map((v) => v + (rand() - 0.5) * 18);
        for (let yy = y; yy < Math.min(y + 8, S); yy++) {
          for (let x = bx + off; x < bx + off + 20; x++) {
            const ry = yy - y, rx = x - bx - off;
            const g = (grain(x, yy) - 0.5) * 16;
            let col = tone.map((v) => v + g);
            if (ry === 7 || rx === 19) col = [112, 104, 96];
            else if (ry === 0) col = col.map((v) => v + 18);
            const wet = clamp((yy - 84) / 44, 0, 1);
            col = mix(col, [58, 74, 62], wet * 0.65);
            if (snow && ry === 0) col = mix(col, [240, 245, 255], 0.7);
            c.set(x, yy, col);
          }
        }
      }
    }
  }
  return c.px;
}

export function cobbleTownFiles() {
  const files = {};
  const ground = dds(128, 128, cobbleGround());
  const groundSnow = dds(128, 128, cobbleGround({ snow: true }));
  for (const tex of GRASS_SUMMER) for (const pal of GROUND_PALS_SUMMER) files[name(32, 32, tex, pal)] = ground;
  for (const tex of GRASS_WINTER) for (const pal of GROUND_PALS_WINTER) files[name(32, 32, tex, pal)] = groundSnow;
  const sets = [
    [EARTH_SUMMER, CLIFF_PALS_SUMMER, wallFace({ kind: 'cliff' })],
    [EARTH_WINTER, CLIFF_PALS_WINTER, wallFace({ kind: 'cliff', snow: true })],
    [STONE_SUMMER, BANK_PALS_SUMMER, wallFace({ kind: 'bank' })],
    [STONE_WINTER, BANK_PALS_WINTER, wallFace({ kind: 'bank', snow: true })],
  ];
  for (const [texs, pals, px] of sets) {
    const img = dds(128, 128, px);
    for (const tex of texs) for (const pal of pals) files[name(64, 64, tex, pal)] = img;
  }
  return files;
}


/* ── Clover Meadow ──────────────────────────────────────────────────────── */

/* The town grass, every palette it is drawn with (season, time of day). The
 * names say WHICH texture to replace; the pixels below are drawn from scratch. */
/* Clover Meadow moved here from build-examples.mjs so the cookbook can
 * offer its ZIP too (its README said to install a ZIP the site did not have). */
export const CLOVER_GRASS = [
  ['626709d910129694', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['903adc6355e36f59', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['e96fecd242518c9f', ['193ca5974976e36e', '20430b0042498b04', '4f54e78515f0a185', '8910d24f6fbd5f83', '8b8a1c2cacd60254', '963dc45f18e13cf7', 'b2e512f9c0fe88ad', 'e7f9e59c09c5f9d0', 'f83e63a8b6cb47b7']],
  ['82f28ec4199a45be', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
  ['cfa57a6e6f966d11', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
  ['e2ab673814e71af6', ['6d5ff5628ae85b42', 'ce63d23d746a058a', 'd9eb32f9a8b17411']],
];

/* Seamless clover meadow, 128x128: periodic value noise for the ground, then
 * three-leaf clovers and a few tiny white flowers on a fixed seed. */
export function cloverMeadow(size = 128) {
  let seed = 2604;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const px = new Uint8Array(size * size * 4);
  const lattice = (n) => Array.from({ length: n * n }, rand);
  const octave = (n, lat) => (x, y) => {
    const fx = (x / size) * n, fy = (y / size) * n;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0;
    const at = (i, j) => lat[((j % n) + n) % n * n + (((i % n) + n) % n)];
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
  const o1 = octave(4, lattice(4)), o2 = octave(16, lattice(16)), o3 = octave(64, lattice(64));
  const put = (x, y, r, g, b) => {
    x = ((x % size) + size) % size; y = ((y % size) + size) % size;
    const i = (y * size + x) * 4;
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = o1(x, y) * 0.5 + o2(x, y) * 0.35 + o3(x, y) * 0.15;
      put(x, y, Math.round(70 + n * 40), Math.round(140 + n * 55), Math.round(60 + n * 30));
    }
  }
  const disc = (cx, cy, r, col) => {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) put(cx + x, cy + y, ...col);
  };
  for (let k = 0; k < 26; k++) {
    const cx = Math.floor(rand() * size), cy = Math.floor(rand() * size);
    const shade = rand() * 20;
    const leaf = [Math.round(40 + shade), Math.round(120 + shade * 2), Math.round(45 + shade)];
    const turn = rand() * Math.PI * 2;
    for (let l = 0; l < 3; l++) {
      const a = turn + (l * Math.PI * 2) / 3;
      disc(Math.round(cx + Math.cos(a) * 3), Math.round(cy + Math.sin(a) * 3), 2, leaf);
    }
    put(cx, cy, 30, 95, 35);
  }
  for (let k = 0; k < 9; k++) {
    const cx = Math.floor(rand() * size), cy = Math.floor(rand() * size);
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) put(cx + dx, cy + dy, 250, 250, 240);
    put(cx, cy, 245, 210, 80);
  }
  return px;
}

export function cloverMeadowFiles() {
  const files = {};
  const img = dds(128, 128, cloverMeadow());
  for (const [tex, pals] of CLOVER_GRASS) for (const pal of pals) files[name(32, 32, tex, pal)] = img;
  return files;
}

/* ── The texture starter kit ─────────────────────────────────────────────────
 * One picture so the kit is not empty: it installs, the town ground turns into
 * a bold two-green check (spring to autumn), and the modder can see a texture
 * mod work before painting anything. 64x64 (twice the original 32x32).
 * one `$` (any palette) file per summer grass name, 3 files, where it
 * was once 27 (one per name and palette). A `$` file is loaded once and drawn
 * under every palette, so the kit is three pictures to paint, not 27. */
export function kitCheck() {
  const S = 64, px = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dark = ((x >> 3) + (y >> 3)) & 1;
      px.set(dark ? [62, 128, 58, 255] : [128, 190, 96, 255], (y * S + x) * 4);
    }
  }
  return px;
}

export function textureKitFiles() {
  const files = {};
  const img = dds(64, 64, kitCheck());
  for (const tex of GRASS_SUMMER) files[name(32, 32, tex, '$')] = img;
  return files;
}

/* The starter kits' drawn files, by kit folder (templates/<kit>). The
 * frontend's downloads route and build-examples.mjs add them. */
export const GENERATED_KITS = {
  'texture-kit': textureKitFiles,
};

/* What each example draws, by folder name. build-examples.mjs adds these files. */
export const GENERATED = {
  'example.blossom-lane': blossomLaneFiles,
  'example.clover-meadow': cloverMeadowFiles,
  'example.cobble-town': cobbleTownFiles,
};
