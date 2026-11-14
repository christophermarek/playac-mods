/* items.mjs - shops.json goods against the game's item list (items.json).
 *
 * The game page cannot judge a good (only C has the item tables), so the
 * engine drops a good it cannot sell when the shop loads and raises a price
 * under the shop's floor (the game engine item_refusal, pc_mod_shop_price). items.json
 * is generated from those same rules; `playac-mod check` reads it to say so
 * before the game does, as warnings. Without items.json this check is skipped.
 *
 * Two shapes are read: the current one, per shop target,
 *   { id, kind, name, price, buyback, floor: {flower, nook},
 *     stockable: {flower, nook}, refusal?: {flower?, nook?} }
 * and the first one (stockable: bool, refusal: string, the floor = buyback).
 * Furniture is listed once, by its south-facing id (id & 3 == 0); ids +1..+3
 * are the same piece. */
import fs from 'node:fs';
import path from 'node:path';
import { CHECKOUT } from './checkout.mjs';
import { typeSources } from './types.mjs';

const TARGETS = ['flower', 'nook'];
const WHERE = { flower: 'the flower shop', nook: 'Nook\'s shop' };
const ITEM_RE = /^0x[0-9a-fA-F]{4}$/;

/* The path of items.json, or null: $PLAYAC_ITEMS_JSON, then the types'
 * sources (api/, vendor/api, ...), then the site's copy. */
export function findItemsFile() {
  const list = [];
  if (process.env.PLAYAC_ITEMS_JSON) list.push(path.resolve(process.env.PLAYAC_ITEMS_JSON));
  for (const dir of typeSources()) list.push(path.join(dir, 'items.json'), path.join(dir, 'schemas', 'items.json'));
  if (CHECKOUT) list.push(CHECKOUT.siteItems);
  return list.find((f) => fs.existsSync(f)) || null;
}

const perTarget = (v, fallback) => {
  if (v && typeof v === 'object' && !Array.isArray(v)) return { flower: v.flower, nook: v.nook };
  return { flower: v === undefined ? fallback : v, nook: v === undefined ? fallback : v };
};

/* doc: the parsed items.json. Returns Map(number -> item), every shape made
 * the current one. */
export function itemTable(doc) {
  const map = new Map();
  for (const it of (doc && Array.isArray(doc.items) ? doc.items : [])) {
    if (!it || typeof it.id !== 'string' || !ITEM_RE.test(it.id)) continue;
    const buyback = Number(it.buyback) || 0;
    map.set(parseInt(it.id.slice(2), 16), {
      id: it.id,
      kind: it.kind,
      name: it.name || null,
      floor: it.floor !== undefined ? perTarget(it.floor, buyback) : { flower: buyback, nook: buyback },
      stockable: perTarget(it.stockable, false),
      refusal: perTarget(it.refusal, undefined),
    });
  }
  return map;
}

let cached;
/* The table from findItemsFile(), read once; null when there is none. */
export function loadItems() {
  if (cached !== undefined) return cached;
  cached = null;
  const file = findItemsFile();
  if (file) {
    try { cached = itemTable(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch { cached = null; }
  }
  return cached;
}

export function lookup(table, id) {
  const it = table.get(id);
  if (it) return it;
  const south = table.get(id & ~3);
  return south && south.kind === 'furniture' ? south : null;
}

/* doc: a parsed shops.json. Returns warnings in mods.js's "shops: shop N
 * stock K" form. A mod's own items (author.mod:thing) are not looked up. */
export function shopItemWarnings(doc, table) {
  const out = [];
  if (!table || !doc || !Array.isArray(doc.shops)) return out;
  doc.shops.forEach((s, i) => {
    if (!s || typeof s !== 'object' || !TARGETS.includes(s.target) || !Array.isArray(s.stock)) return;
    const where = WHERE[s.target];
    s.stock.forEach((g, k) => {
      if (!g || typeof g.item !== 'string' || !ITEM_RE.test(g.item)) return;
      const at = `shops: shop ${i + 1} stock ${k + 1}`;
      const id = parseInt(g.item.slice(2), 16);
      const it = lookup(table, id);
      if (!it) {
        out.push(`${at} "item" ${g.item} is not an item or furniture the game has, so the game leaves it out of ${where}`);
        return;
      }
      const named = `${g.item}${it.name ? ` (${it.name})` : ''}`;
      if (!it.stockable[s.target]) {
        const why = it.refusal[s.target] || `cannot be sold at ${where}`;
        out.push(`${at} "item" ${named} ${why}, so the game leaves it out of ${where}`);
        return;
      }
      const floor = it.floor[s.target];
      if (typeof g.price === 'number' && typeof floor === 'number' && g.price < floor) {
        out.push(`${at} "price" ${g.price} is under the floor for ${named} at ${where}: the game sells it for ${floor}`);
      }
    });
  });
  return out;
}
