/* scaffold.mjs - `playac-mod new <id> --kind ...`.
 *
 * Every kind writes a mod that installs and does something visible as it is,
 * so a modder starts from a working mod and changes it. test/cli.test.mjs runs
 * `check` over each kind, so a scaffold the game would refuse fails CI.
 *
 * Kinds:
 *   texture  replaces the town grass with a pattern drawn here (textures/)
 *   lines    villagers say a line of yours before their hello (messages + talk)
 *   shop     the flower shop restocked and reworded (shops.json, scope world)
 *   script   a script that counts days and picked-up items (store, log) */
import { renderWorkflow, WORKFLOW_TEMPLATE } from './pin.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mods } from './contract.mjs';
import { aiPackFiles } from './aipack.mjs';

export const KINDS = ['texture', 'lines', 'shop', 'script'];

/* Where `types` writes, and what the editor settings point at. A "." folder,
 * so the pack rule leaves it out of the ZIP. */
export const TYPES_DIR = '.playac';

const json = (v) => `${JSON.stringify(v, null, 2)}\n`;

/* An uncompressed 32-bit DDS, pixels R G B A (what pc_texderive_dds_format reads). */
export function dds(w, h, rgba) {
  const hdr = Buffer.alloc(128);
  hdr.write('DDS ', 0, 'ascii');
  hdr.writeUInt32LE(124, 4);
  hdr.writeUInt32LE(0x100f, 8);
  hdr.writeUInt32LE(h, 12);
  hdr.writeUInt32LE(w, 16);
  hdr.writeUInt32LE(w * 4, 20);
  hdr.writeUInt32LE(32, 76);
  hdr.writeUInt32LE(0x41, 80);
  hdr.writeUInt32LE(32, 88);
  hdr.writeUInt32LE(0x000000ff, 92);
  hdr.writeUInt32LE(0x0000ff00, 96);
  hdr.writeUInt32LE(0x00ff0000, 100);
  hdr.writeUInt32LE(0xff000000, 104);
  hdr.writeUInt32LE(0x1000, 108);
  return Buffer.concat([hdr, Buffer.from(rgba)]);
}

/* A 32x32 checked lawn, drawn from scratch (no game pixels). */
function lawn() {
  const size = 32;
  const px = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const light = ((x >> 3) + (y >> 3)) % 2 === 0;
      px[i] = light ? 96 : 70;
      px[i + 1] = light ? 176 : 148;
      px[i + 2] = light ? 80 : 60;
      px[i + 3] = 255;
    }
  }
  return dds(size, size, px);
}

/* The town grass, under any palette ("$"): one of the names
 * the game's build draws for example.clover-meadow. */
export const GRASS_TEXTURE = 'tex1_32x32_626709d910129694_$_8.dds';

function readme(id, name, kind) {
  const what = {
    texture: `Replaces the town grass with a checked lawn. Each file in textures/ is named after the texture it replaces: find names with the texture inspector (Settings, Mods, developer mode).`,
    lines: 'Villagers say a line from messages/en.json before their usual hello, once a day each.',
    shop: 'The flower shop sells your stock, at your prices and hours, with its own greeting (shops.json). A shop changes what visitors see, so this mod is "scope": "world".',
    script: `A script that counts the days you played and the items you picked up, and logs them. log() lines show in Settings, Mods, Mod log, and in the browser's developer console as "[Mods] ${id}: ..." (type [Mods] in its filter box). The store is kept per town: read it inside events, never at the top of main.lua, which runs before a town is loaded.`,
  }[kind];
  return `# ${name}

${what}

\`${id}\` is a mod for [Play AC Online](https://playaconline.com).

## Work on it

\`\`\`bash
npx playac-mod check      # every rule the game applies, problems per file
npx playac-mod dev        # serve this folder; open the game with ?moddev=1
npx playac-mod pack       # ../${id}-<version>.zip (beside this folder) and its content hash
npx playac-mod publish    # sign in once, then upload for review
npx playac-mod status     # what the registry did with each version
\`\`\`

Raise "version" in mod.json for every release. Every file in a shared mod
must be your own work: never the game's pictures or text.

This README goes into the mod's ZIP (every .md does, except a top-level
CHANGELOG.md), so players and the reviewer read it: keep it about the mod.

Guide: https://playaconline.com/modding/  Errors: https://playaconline.com/modding/errors/
`;
}

/* The files of a new mod of kind, as {path: string|Buffer}. */
export function scaffoldFiles(id, kind, opts = {}) {
  if (!mods.validateManifest || !/^[a-z0-9][a-z0-9-]{0,31}\.[a-z0-9][a-z0-9-]{0,47}$/.test(id)) {
    throw new Error('the id must look like yourname.mod-name: lowercase letters, digits and dashes, one dot');
  }
  if (!KINDS.includes(kind)) throw new Error(`--kind must be one of ${KINDS.join(', ')}`);
  const author = (opts.author || id.split('.')[0]).slice(0, 40);
  const name = (opts.name || id.split('.')[1].split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')).slice(0, 60);
  const manifest = {
    $schema: `./${TYPES_DIR}/schemas/mod.schema.json`,
    schema: 1,
    api: mods.API_MAX,
    id,
    name,
    version: '0.1.0',
    authors: [author],
    description: '',
    scope: kind === 'shop' ? 'world' : 'client',
    content: {},
    assets_original: true,
  };
  const files = {};
  if (kind === 'texture') {
    manifest.description = 'Town grass, redrawn.';
    manifest.content.textures = 'textures';
    files[`textures/${GRASS_TEXTURE}`] = lawn();
  }
  if (kind === 'lines') {
    manifest.description = 'Villagers share a line before their hello, once a day each.';
    manifest.content.messages = 'messages/en.json';
    manifest.scripts = { main: 'main.lua', hooks: ['talk', 'day_start'] };
    files['messages/en.json'] = json({
      line1: 'Did you hear? Someone planted a tree by the river last night.',
      line2: 'I have a feeling today is going to be a good one.',
      line3: 'The shop smelled like oranges this morning. Lovely!',
    });
    files['main.lua'] = `-- ${name}: one line per villager per day, before their usual hello.
-- Hooks only RETURN data: the game shows the line, nothing changes mid-frame.

local said = {}   -- villager ids that already spoke today
local LINES = 3   -- line1..line3 in messages/en.json

on("day_start", function(date)
  said = {}
end)

---@param npc PlayacNpc
on("talk", function(npc)
  if said[npc.id] then return nil end
  said[npc.id] = true
  local t = game.time()
  return message("line" .. ((npc.id + t.day) % LINES + 1))
end)

log("ready")
`;
  }
  if (kind === 'shop') {
    manifest.description = 'The flower shop, restocked.';
    manifest.content.shops = 'shops.json';
    files['shops.json'] = json({
      shops: [{
        target: 'flower',
        name: name.slice(0, 40),
        hours: { open: '09:00', close: '21:00' },
        greeting: 'Welcome in! Everything on the tables is fresh today.',
        stock_line: 'Fruit from all over. Point at one and I will tell you the price.',
        stock: [
          { item: '0x2800', price: 600 },
          { item: '0x2801', price: 600 },
          { item: '0x2802', price: 600 },
        ],
      }],
    });
  }
  if (kind === 'script') {
    manifest.description = 'Counts days played and items picked up.';
    manifest.scripts = { main: 'main.lua', hooks: ['day_start', 'item_picked', 'enter_scene'] };
    files['main.lua'] = `-- ${name}: counts things in this mod's store (8 KB per town).
-- log() lines show in Settings, Mods, Mod log and in the browser console as "[Mods] ${id}: ...".
-- This top level runs once, before any town is loaded: register handlers
-- here, and read or save the store only inside events.

on("day_start", function(date)
  -- A restart later on a day the town already saw does not fire day_start
  -- again; count by date anyway, so a day is never counted twice.
  local today = ("%04d-%02d-%02d"):format(date.year, date.month, date.day)
  if store.get("last_day") ~= today then
    store.set("last_day", today)
    store.set("days", (store.get("days") or 0) + 1)
  end
  log(("day %d: %s"):format(store.get("days"), today))
end)

on("item_picked", function(item)
  local n = (store.get("picked") or 0) + 1
  store.set("picked", n)
  log(("picked up item 0x%04x (%d so far)"):format(item, n))
end)

on("enter_scene", function(scene)
  log("entered scene " .. scene)
end)

log("ready")
`;
  }
  if (!Object.keys(manifest.content).length) delete manifest.content;
  files['mod.json'] = json(manifest);
  files['README.md'] = readme(id, name, kind);
  Object.assign(files, editorFiles());
  /* the AI skill pack (ai/pack.json), unless --no-ai. */
  if (opts.ai !== false) Object.assign(files, aiPackFiles());
  return files;
}

/* .vscode settings: LuaLS reads the game's API from .playac/playac.lua, and
 * the JSON files get their schemas. .gitignore keeps generated files out: only
 * the ones `types` writes. .playac/screenshots/ and
 * .playac/changelog.txt are the listing "Import from GitHub" reads from the
 * repo, so they must be committed. */
export function editorFiles() {
  return {
    '.vscode/settings.json': json({
      'Lua.runtime.version': 'Lua 5.4',
      'Lua.workspace.library': [`${TYPES_DIR}/playac.lua`],
      'Lua.runtime.builtin': { io: 'disable', os: 'disable', debug: 'disable', package: 'disable' },
      'Lua.diagnostics.disable': ['lowercase-global'],
      'json.schemas': [
        { fileMatch: ['/mod.json'], url: `./${TYPES_DIR}/schemas/mod.schema.json` },
        { fileMatch: ['/shops.json'], url: `./${TYPES_DIR}/schemas/shops.schema.json` },
        { fileMatch: ['/messages/*.json'], url: `./${TYPES_DIR}/schemas/messages.schema.json` },
        /* api 2 content files, under the names the guides and examples use */
        { fileMatch: ['/items.json'], url: `./${TYPES_DIR}/schemas/mod-items.schema.json` },
        { fileMatch: ['/letters.json'], url: `./${TYPES_DIR}/schemas/letters.schema.json` },
        { fileMatch: ['/events.json'], url: `./${TYPES_DIR}/schemas/events.schema.json` },
        { fileMatch: ['/talk.json'], url: `./${TYPES_DIR}/schemas/talk.schema.json` },
      ],
    }),
    '.vscode/extensions.json': json({ recommendations: ['sumneko.lua'] }),
    '.gitignore': `${TYPES_DIR}/playac.lua\n${TYPES_DIR}/schemas/\ndist/\nnode_modules/\n`,
  };
}

/* `new --github`: what a GitHub repo of the mod needs, from the
 * template the package carries: the check workflow, and a CHANGELOG.md whose
 * "## <version>" section publish and the GitHub import send as the listing's
 * changelog line (it is never packed, so editing it keeps the content hash).
 * release: the playac-mod release the workflow runs, pinned by its SHA-256
 * (pin.mjs findRelease); the workflow never asks npm by name. */
export function githubFiles(release, version = '0.1.0') {
  return {
    '.github/workflows/mod.yml': renderWorkflow(fs.readFileSync(WORKFLOW_TEMPLATE, 'utf8'), release),
    'CHANGELOG.md': `# Changelog\n\n## ${version}\n\n- First version.\n`,
  };
}

/* Write files under dir. Refuses to overwrite anything unless force. */
export function writeFiles(dir, files, { force = false } = {}) {
  for (const rel of Object.keys(files)) {
    const abs = path.join(dir, ...rel.split('/'));
    if (!force && fs.existsSync(abs)) throw new Error(`${path.relative(process.cwd(), abs) || abs} already exists (use --force to overwrite)`);
  }
  for (const [rel, body] of Object.entries(files)) {
    const abs = path.join(dir, ...rel.split('/'));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, body);
  }
}
