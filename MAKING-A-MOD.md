# Making a mod

A mod adds things to the game without changing its code: new textures, the
flower shop's stock, Nook's goods, lines villagers say, town days of your own,
letter templates, small scripted moments. Players install mods in **Settings,
Mods**, from a ZIP or from the list of mods other players shared.

Working examples live in [`examples/`](examples/).
`example.night-market` puts a shop and a script together; its README explains
how, and what a script cannot do to a shop.
Each one's ZIP is on the cookbook, https://playaconline.com/modding/cookbook/.

Every rule below is one the game, the page and the registry all check. The full
reference is https://playaconline.com/modding/reference/.

## The ZIP

```
my-mod.zip
├── mod.json            required, at the top (or inside one top folder)
├── textures/           Dolphin-format .dds files
├── messages/en.json    lines, by key
├── shops.json          the flower shop's or Nook's goods (world mods)
├── letters.json        letter templates a script can mail
├── events.json         dated town days: a board notice, the day's lines
├── talk.json           villager line pools, no script needed
└── main.lua            a script
```

- Only `.json .lua .dds .png .txt .md` files.
- At most 2000 files, 16 MiB zipped, 64 MiB unpacked.
- `mod.json` at most 64 KiB, any other `.json` at most 256 KiB, any `.lua` at
  most 512 KiB.
- Paths are plain ASCII, at most 160 bytes, with no `..`, `\` or `:`. Two paths
  that differ only in upper and lower case are refused, and so is a file whose
  name, ignoring case, is also a folder (`tex.png` and `TEX.png/a.png`).
- ZIPs made by the Mac Finder or Windows work: `__MACOSX/`, `Thumbs.db` and
  every hidden file or folder (a name starting `.`: `.DS_Store`, `._*`,
  `.gitignore`, `.github/`, `.vscode/`, `.playac/`) are ignored, so a Finder ZIP
  of a `playac-mod new` folder works as it is.
- A JSON file with the same key twice is refused, and so is one nested more
  than 32 levels deep.
- The files `content.shops` and `content.messages` name are read as JSON
  whatever they are called, so they are held to 256 KiB too.

Across all the mods a player has switched on: at most 32 mods, and 96 MiB
unpacked, or 24 MiB on a phone (provisional until measured on phones).
Keep texture mods small if you want phone players to use them.

## mod.json

A mod that only you see (textures, lines, a script):

```jsonc
{
  "schema": 1,
  "api": 2,                         // the mod API level the mod is made for, 2 today (1 still reads)
  "id": "yourname.my-mod",          // author.mod-name: lowercase, digits, dashes
  "name": "My Mod",                 // 1 to 60 characters
  "version": "1.0.0",               // x.y.z
  "authors": ["yourname"],          // 1 to 8 names, each up to 40 characters
  "description": "What it does.",   // optional, up to 500 characters
  "scope": "client",                // "client" or "world", see below
  "content": {
    "textures": "textures/",
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["talk", "day_start"]  // every event the script listens to
  },
  "assets_original": true           // required: see Rules
}
```

A mod that changes the flower shop is a world mod:

```json
{
  "schema": 1,
  "api": 2,
  "id": "yourname.tea-house",
  "name": "Tea House",
  "version": "1.0.0",
  "authors": ["yourname"],
  "scope": "world",
  "content": { "shops": "shops.json" },
  "assets_original": true
}
```

- `api`: the mod API level your mod is made for, a whole number. Today it is
  `2` (level 1 mods still load). Items, `letters`, `events`, `talk`, Nook's shop,
  mod commands, `permissions` and the newer script events need `2`. When a game update changes what a mod can do, the level goes up; the game
  says on the Mods tab when a mod "needs a newer game" or was "made for an older
  game", instead of loading it by rules it was not written for.
- `game` and `save` are planned but not built, so a mod.json with either is
  refused. `depends` and `conflicts` are built from api 2 (a mod that says
  `"api": 1` is refused for them). Other keys the game does not know are
  ignored.
- `id`: up to 32 characters before the dot and 48 after. The shared list keeps
  the author names `playaconline`, `official`, `admin` and `example` for itself.
- `content` can hold `textures`, `messages`, `shops`, and at api 2 also
  `items`, `letters`, `events` and `talk`, and nothing else yet. Each names a file (or, for `textures`, a folder
  with at least one file) that is in the ZIP.
- `scripts.hooks`: one or more of `talk`, `day_start`, `item_picked`,
  `enter_scene`, `hour_change`, `shop_buy`, `item_sold`, `fish_caught`,
  `bug_caught`, `letter_read`, `villager_moved_in`, `visitor_arrived`,
  `command_result`, `answer`, each once (every event after `enter_scene` needs
  `"api": 2`).
- `permissions` (optional, `"api": 2`): the commands your script may use, each once, from
  `send_letter`, `give_item`, `set_flag`, `show_line`, `ask`. The game refuses
  any command the list leaves out, and the Mods tab shows players what the list
  lets your mod do. A mod with `permissions` needs `scripts`. Leave it out and
  your script can change nothing, as before.
- `$schema` (optional): add
  `"$schema": "https://playaconline.com/schemas/mod.schema.json"` and an editor
  that knows JSON Schema (VS Code does) checks mod.json as you type. shops.json
  can carry `"$schema": "https://playaconline.com/schemas/shops.schema.json"`. A
  messages file cannot (every key there is a line): point your editor at
  `messages.schema.json` in its settings instead.

Everything a mod may use is listed, with every limit, at
[playaconline.com/modding/reference/](https://playaconline.com/modding/reference/),
generated from the mod API spec, [`api.json`](https://playaconline.com/schemas/api.json). Lua types for your editor:
[`/schemas/playac.lua`](https://playaconline.com/schemas/playac.lua). Which items a
shop may stock, with prices: [`/schemas/items.json`](https://playaconline.com/schemas/items.json).

### Scope

- **client**: only you see it. Textures, lines, talk pools, letters, event lines
  and scripts.
- **world**: it changes your town for anyone visiting. A shop is world content:
  `shops` needs `"scope": "world"`, and a client mod with `shops` is refused. So
  is an event with a `board` notice.
  - In The City only world mods' shops and board notices switch off. Textures,
    lines and scripts keep running there for you.
  - A friend visit only starts when both towns have the same world mods that
    count for visits, in the same order, or none. A world mod counts when it
    has `textures`, `shops` or `items`, or a command other than `send_letter`,
    `give_item`, `set_flag`, `show_line` and `ask` (api.json `visit_scope`).
    Mods match by their contents, so it does not matter where each player
    installed them from.
  - When every world mod of the host that counts is a reviewed version from
    the mod list, a visitor can load them for that visit only (api.json
    `visit_lend`): nothing is installed, they run with the host's settings and
    an empty store that is never kept, and at the visitor's home (the restarts
    before and after the trip) their shop, Nook goods, board notices, items,
    renames and commands do nothing. A mod installed from a file cannot be lent.

### Load order

The Mods tab lists mods in load order, and the arrows change it.

- Textures and shops: when two mods change the same one, the later mod wins.
- Talk lines: the first mod whose script returns a line wins. When no script
  says a line, the data lines (events, then talk pools) get their turn.
- A mod that needs another (`depends`, below) always loads after it, whatever
  the list says.

### Settings, dependencies and data (mod API 2)

These need `"api": 2`. At `"api": 1` they are unknown keys and do nothing.

```json
"depends":   { "yourname.tea-lib": ">=1.0.0 <2.0.0" },
"conflicts": { "someone.other-shop": "*" },
"data_version": 2,
"settings": [
  { "name": "greet", "type": "bool", "label": "Say hello", "default": true },
  { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 },
  { "name": "drink", "type": "choice", "label": "Drink", "default": "tea", "choices": ["tea", "coffee"] },
  { "name": "motto", "type": "text", "label": "Shop motto", "default": "", "max_length": 40 }
]
```

- `depends` and `conflicts`: a mod id and a version range each, at most 16. A
  range is `*`, or up to 4 of `>=`, `<=`, `>`, `<`, `=` and a version split by
  one space (`>=1.0.0 <2.0.0`). A mod whose dependency is missing, off or the
  wrong version does not load, and its row says why. A mod that lists a
  conflict with a mod that is on does not load either.
- `settings`: at most 16. Names are `a-z 0-9 _` starting with a letter. The
  player changes them on the mod's row in the Mods tab; your script reads them
  with `settings.get(name)`. They take effect from the next start. A world
  mod's settings are part of what a friend visit compares: two players with
  different settings run different towns.
- `data_version`: a whole number for the shape of what your script saves. When
  it changes, `migrate` runs (see Scripts).

## Textures

Name each file the way the game looks textures up, the same as a Dolphin HD
pack:

```
tex1_<w>x<h>_<texture hash>_<palette hash>_<format>.dds
```

or the same name ending `.png`.

- The name says which texture to replace. The pixels must be your own.
- Names are matched ignoring upper and lower case.
- A mod's texture wins over the HD pack.
- DDS can be BC7, DXT1, DXT5 or uncompressed 32-bit RGBA (either channel
  order: RGBA, or BGRA, which some tools call A8R8G8B8). BC7 needs a browser
  with BPTC texture support.
- Save each texture with one level (no mipmaps). The game reads only the
  first, and the registry refuses a file with anything after it.
- The registry refuses a texture that is an unchanged copy of one from the
  game or the HD pack, and names the file. A moderator sees every texture.
- PNG works too: any kind (grey, colour, palette, with or without alpha,
  interlaced), at most 2048x2048. The game turns it into uncompressed pixels
  when it loads, so a small PNG file can still be a big texture: all mods'
  PNGs together may be at most 96 MiB of pixels (24 MiB on a phone), where a
  2048x2048 PNG is 16 MiB. A PNG over that, too big or broken is left out and
  the Mods tab names it.
- A texture without a palette has no palette part:
  `tex1_32x32_8b5a1b4a83d4d7c7_14.dds`.
- `$` in place of the palette hash matches those pixels under any palette. It
  is loaded once and shared by every palette, so it costs one texture's memory;
  any mod's file with the exact palette hash wins for that palette.

### Find a texture

The texture inspector shows each texture the game draws, under the exact file
name your mod needs. No Dolphin, no texture dump.

1. Open the game with `?moddev=1` at the end of the address:
   `https://playaconline.com/play/?moddev=1`.
2. Load your town. In Settings, Mods, Developer, press **Record textures**.
3. Close Settings, walk to what you want to change, open Settings again. The
   newest textures are first.
4. Not sure which one it is? **Flash** draws it magenta in the game for 3 seconds.
5. Tick the textures you want and press **Export**. You get a mod ZIP with each
   one as an uncompressed DDS under its name. It installs and works as it is.
6. Paint over the pictures in an editor that reads DDS (GIMP, Paint.NET). Keep
   each file name. Bigger is fine: 2x or 4x the size draws in the same place.
7. Delete the ones you did not change, ZIP the folder, install it from the file
   and restart the game.

- **Copy name** and **PNG** give you one texture's name and picture.
- **Any palette** copies the `$` name of a texture with a palette.
- The inspector keeps up to 512 textures and 16 MB, dropping the one drawn
  longest ago. **Stop recording** frees them.
- The exported pictures are the game's own art. Change them before you share
  the mod: the mod list refuses a copy.
- The names are the ones the game's texture loader looks up, so a copied name
  always matches.

## Messages

`messages/en.json` maps keys to lines:

```json
{ "greet": "Hello there!" }
```

With `"api": 2`, `content.messages` can name a folder instead
(`"messages": "messages/"`) holding `en.json` and any of `de.json`, `es.json`,
`fr.json`, `it.json`. `message(key)` answers in the game's language (the
European disc's choice; the US and Australian discs are English), and falls
back to `en.json` for a key a translation does not have. A translation may
only hold keys `en.json` has.

- Keys: 1 to 48 of `a-z 0-9 _ . -`. At most 256 keys in a mod.
- Each line is 1 to 400 bytes.
- A key is yours as `yourname.my-mod:greet`. A script can read another mod's
  line by its full key, and gets `nil` when that mod is not installed.
- Lines wrap at 24 characters, 4 lines to a page. Characters the game's font
  does not have show as `?`.

## Shops

A world mod can change the flower shop:

```json
{
  "shops": [{
    "target": "flower",
    "name": "Tea House",
    "hours": { "open": "15:00", "close": "01:00" },
    "greeting": "Welcome in!",
    "stock_line": "Fresh fruit on every table.",
    "stock": [{ "item": "0x2800", "price": 600 }]
  }]
}
```

- `target`: `"flower"` or `"nook"` (below). One entry per target.
- `name`: optional, 1 to 40 characters.
- `hours`: optional, `"HH:MM"` 24-hour times. `open` and `close` must differ;
  `close` can be past midnight. Hours only shorten the shop's own: it still
  shuts from 2 AM to 7 AM. Outside the hours the door shows a sign with the
  shop's name and hours.
- `greeting` replaces the keeper's hello before her "what can I do for you?"
  menu; `stock_line` replaces her answer to "What's in stock?". Each is 1 to 160
  characters with at most 3 line breaks.
- `stock`: 1 to 6 goods, one per table spot, no item twice.
  - `item` is a string, `"0x"` and 4 hex digits.
  - It must be an item a shop table can show. Money, turnips, tickets, fossils
    and special items can't be stocked. The Mods tab says which item was refused.
  - `price` is optional, a whole number of Bells from 1 to 99999. Leave it out
    for the usual price. A price below what Nook pays for the item is raised to
    that.
  - At mod API 2 a good can be one of your own items: `"item": "you.my-mod:tea-chest"`
    (see Items). Two goods of a shop may not share a furniture.

## Items

Mod API 2 lets a mod add furniture of its own, for the house. Each item reuses
the model of a real piece of furniture, its `base`. `mod.json` names the file:
`"content": { "items": "items.json" }`.

```json
{
  "items": [
    { "id": "tea-chest", "name": "Tea Chest", "base": "0x1008", "price": 1800 }
  ]
}
```

- `id`: 1 to 32 of a-z, 0-9 and `-`. The item's full id is your mod id, a
  colon, then this: `you.my-mod:tea-chest`. Never change it once players have
  the item; rename with `renames` instead.
- `name`: 1 to 16 characters (the game's item name box): letters, digits,
  spaces and `' . , ! & -`, starting with a letter or digit.
- `base`: the furniture whose model it uses, a string `"0x"` and 4 hex digits,
  facing south (0x1000 to 0x1FFC or 0x3000 to 0x33C4, a multiple of 4).
  Fossils, gyroids, clothing, mannequins and umbrellas with a design, and
  pieces that become a pocket item (balloons, diaries, fans, pinwheels) can't
  be a base; the Mods tab names a refused one.
- `price`: optional, 1 to 99999 Bells, what a shop asks when its stock sets no price.

How players get one: your flower shop or Nook's stock entry sells it by its
full id (see Shops), or your script gives it with `cmd.give_item`. A mod item
is its base piece in the save. Which pieces are your items is kept beside the
save, so:

- With your mod, the item has its own name in the pockets and in the shop.
- Without your mod, it is the plain base piece. Nothing is deleted, and
  putting the mod back gives the item its name again.
- A visitor without your mod sees the plain base piece. The City has no mod items.
- So far an item keeps its name in a house room, in the pocket it was bought
  or picked up into, and on the way between the two. Sent in a letter, put in
  a drawer, dropped outside or moved to another pocket, it becomes the plain
  base piece.

`renames` in `mod.json` moves pieces players already have to a new id, once
per save:

```json
"renames": { "you.my-mod:old-name": "you.my-mod:tea-chest" }
```

The new id must be one of this mod's items.

### Nook's shop

A world mod can also add goods to Nook's shop, in every store size:

```json
{
  "shops": [{
    "target": "nook",
    "mode": "add",
    "stock": [
      { "item": "0x1110", "price": 1800 },
      { "item": "0x2205", "price": 900 },
      { "item": "0x2605" }
    ]
  }]
}
```

- It takes only `mode` and `stock`. Name, hours and lines are the flower shop's.
- Each good stands where Nook's own goods of its kind stand: furniture,
  stationery, clothing, carpets, wallpaper, tools, umbrellas, paint, saplings or
  flower bags. Fruit, the signboard and anything without a spot are refused, as
  are money, turnips, tickets and fossils. The Mods tab says which.
- `mode: "add"` (the default): every morning the mod's goods take up to half of
  the spots of their kind, Nook's own roll keeps the rest. `"replace"`: they take
  every spot of their kind; spots left over stay bare. Kinds the mod does not
  list are Nook's as always.
- `stock`: 1 to 16 goods, no item twice. When a mod lists more goods of a kind
  than there are spots, the date picks which ones show.
- `price` as for the flower shop. It is what Nook asks for the good off the
  floor; catalog orders stay at the usual price.
- The goods show from the next morning's restock. In The City Nook's is the
  game's own.

## Letters

A mod can carry letter templates. A script's `send_letter` command mails one
through the mailbox; the letter itself is only data:

```json
{
  "letters": [{
    "id": "fair-thanks",
    "header": "Dear {player},",
    "body": "Thank you for coming to the\nHarvest Fair! Here is an apple.",
    "footer": "The Fair Committee",
    "sender": "The Fair",
    "item": "0x2800",
    "paper": 12
  }]
}
```

- 1 to 32 letters, each with its own `id` (1 to 48 of `a-z 0-9 _ . -`). A
  command names one `"your.mod:fair-thanks"`.
- Letter text is plain: the letters, digits and signs on a US keyboard, no
  accents. `$ * ^ | \` show as `?`.
- `header`: 1 to 24 characters, plus `{player}` once where the name goes.
- `body`: 1 to 192 characters on at most 6 lines. The game wraps it at the
  paper's width and refuses a body that then needs more than 6 lines.
- `footer`: 1 to 32 characters, the sign-off at the foot of the letter.
- `sender`: optional, 1 to 8 characters, the name in the mailbox list. The
  list has room for 8 characters only, so without a `sender` it shows the
  footer's first 8: "The Lantern Keepers" reads "The Lant". The letter itself
  always signs with the whole footer.
- `item`: optional, a present (no money, turnips, tickets or fossils).
- `paper`: optional, the stationery, 0 to 63.

## Events

A mod can give the town days of its own:

```json
{
  "events": [{
    "id": "harvest-fair",
    "date": { "month": 9, "week": 3, "weekday": 3 },
    "board": "HARVEST FAIR TODAY!\nBring your best fruit.",
    "talk": ["It's the Harvest Fair!", "Did you bring any fruit?"]
  }]
}
```

- 1 to 16 events, each with its own `id`.
- `date`: `{ "month", "day" }` for a fixed date (February 29 works), or
  `{ "month", "week", "weekday" }` for the Nth weekday: `week` 1 to 4 or
  `"last"`, `weekday` 0 (Sunday) to 6.
- `board`: a notice for the town bulletin board, plain text like a letter body.
  It goes up once on the day, in your own town only (not when you visit, not in
  The City). It changes your town, so the mod needs `"scope": "world"`.
- `talk`: 1 to 16 lines villagers say that day, each 1 to 160 characters with
  at most 3 line breaks. They come before any talk pool.
- An event needs a `board` notice, `talk` lines, or both.
- Decorations are not offered: the game's own event decorations belong to its
  own events, with nothing a mod can safely add to.

## Talk pools

Lines villagers say, with no script:

```json
{
  "pools": [
    { "personality": "cranky", "lines": ["Hmph.", "What now?"] },
    { "villager": "Bob", "lines": ["Bob here!"] },
    { "chance": 40, "lines": ["Nice day, isn't it?"] }
  ]
}
```

- 1 to 32 pools. A pool names a `personality` (`normal`, `peppy`, `lazy`,
  `jock`, `cranky`, `snooty`), a `villager` by name, or neither (everyone).
- `lines`: 1 to 32, each 1 to 160 characters with at most 3 line breaks.
- `chance`: optional, 1 to 100 (default 100): how many days in 100 the pool
  speaks.
- On the first ordinary talk of the day, a villager says one line from the most
  specific pools that match them (their own, else their personality's, else
  everyone's), then their usual hello, errands and all. One data line a villager
  a day; after a restart that day they say it again.

## Scripts

Scripts are Lua 5.4 with a small API:

| | |
|---|---|
| `on(event, fn)` | listen to an event listed in `scripts.hooks` |
| `log(...)` | a line in the Mods tab's Mod log and the browser console, as `[Mods] <your id>: ...` |
| `message(key)` | a line from a messages file, or `nil` |
| `game.time()` | a table: `{ year, month, day, hour, minute, weekday }` |
| `store.get(key)` / `store.set(key, value)` | save strings, numbers and booleans (8 KB) for THIS TOWN |
| `store.client.get` / `store.client.set` | the same, one per browser, whatever town is loaded |
| `settings.get(name)` | a setting's value (api 2) |
| `remote.add(name, fn)` | offer a function to other mods, while the script loads (api 2) |
| `remote.call(mod, name, ...)` | call another mod's function (api 2) |
| `remote.has(mod, name)` | whether that mod offers it |
| `store.town()` | which town the store is now (opaque text, `nil` before a town loads): read your locals again when it changes (api 2) |

| event | gets | return |
|---|---|---|
| `talk` | `npc`, a table: `{ name, id }` | a string: the villager says it, then their usual hello |
| `day_start` | `date`, a table: `{ year, month, day }` | nothing |
| `item_picked` | the item number | nothing |
| `enter_scene` | the scene number | nothing |
| `migrate` | `from`, `to`: data versions | nothing (api 2, needs `data_version`) |

- `talk` runs on ordinary talks only. Special and event talks (a first meeting, a villager moving out, one with an errand, delivery or contest going with you, a complaint, a pitfall or a bee chase, an islander, Kamakura, summer camp)
  never reach mods: no handler is called, and the villager's next ordinary talk
  calls it as usual, so keep what you want to say for that one. The first mod
  in load order that returns a line wins, and later mods don't see that talk.
- `day_start` runs once on each new day, also when the game starts on a new day.
  A game loaded on the same day it was last played gets none, so a script that
  needs today reads `game.time()` (see `examples/example.wish-list`).
- `item_picked` runs once an item is really in the pockets (or wallet): picked
  up from the ground, caught with the net or the rod, or dug up. Buying does
  not fire it.
- Item numbers: bugs `0x2D00`-`0x2D27`, fish `0x2300`-`0x2327`, an
  unidentified fossil `0x2511`, shells `0x2514`-`0x251B`, fruit
  `0x2800`-`0x2804` and the coconut `0x2807`. `examples/example.field-notes`
  sorts finds this way.
- No hook runs in the title screen demo.
- `store` is one per mod per TOWN, and travels with the town: in its cloud
  save, its backups, and "Export with mod data" in the Save panel. Whole numbers
  come back as whole numbers. The main part of your script runs before the town
  loads: there `store.get` answers `nil` and `store.set` is refused, so save from
  an event. On a visit to a friend's town and in The City the store starts empty
  and is not kept.
- `store.client` is one per mod per browser. (Before mod API 2 that was the only
  store; a mod's old data moves into the first town it runs in, once.) A mod
  that says `"api": 1` keeps level 1's rules: its `store` is the per-browser
  one, usable from the main part of the script, and `math.random` is Lua's own.
- `migrate(from, to)` runs once per town when the town's data was saved at
  another `data_version`. Not at the restart: at the first event in that town
  that any running mod handles, before that event's handlers. A mod that
  handles only `talk` migrates at the first talk; handle `enter_scene` (an
  empty handler is enough) to migrate as the town loads. `from` is 0 for data from
  before you set one. If it errors, the script stops for the session and the
  next start tries again.
- `remote.call` copies its arguments and results: `nil`, booleans, numbers,
  strings and tables of those, at most 64 KB and 16 levels deep. The function
  you call runs on YOUR time budget: if it runs too long, your script is the one
  stopped. Calling back into a mod that is already running is refused.

More events, each with a table of plain values (copies, never the game's own):

| event | gets |
|---|---|
| `hour_change` | `{ year, month, day, hour }`, when the clock reaches a new hour |
| `shop_buy` | `{ item, price, mod_item }`, when you buy a good off Nook's floor |
| `item_sold` | `{ item, count, bells, mod_item }`, when you sell to Nook |
| `fish_caught` | `{ item, pocketed }` |
| `bug_caught` | `{ item, pocketed }` |
| `letter_read` | `{ sender, present, first_time }`, when you read a letter |
| `villager_moved_in` | `{ id, name }`, when a new villager's house goes up |
| `visitor_arrived` | `{ kind = "friend" }`, a friend riding into your own town |

`mod_item` is the full id of a mod item (`"your.mod:tea-chest"`) when the piece
bought, or the first piece sold, is one (`item` is then its base), else `nil`.
`command_result` and `answer` are under Commands below.

And what a script can look at:

| | |
|---|---|
| `game.pockets()` | the 15 pocket slots, item numbers, `0` for empty |
| `game.bells()` | the wallet |
| `game.town()` | `{ name, id, year, month, day, hour, minute, weekday, season }` |
| `game.villagers()` | `{ { id, name, species, personality }, ... }` |
| `game.player()` | `{ name }` |
| `game.events_today()` | the ids of your own events file's events on the town's date today, `{}` when none |
| `flag(key)` | your flag set with `cmd.set_flag`, or `nil` |
| `rng()`, `rng(n)`, `rng(m, n)` | random numbers that repeat for the same town, day and event, so reloading cannot reroll; in an api 2 mod `math.random` is the same |

### Commands: changing the game

A hook never changes the game while it runs. It QUEUES a command, and the game
carries the queue out between frames, once the player is free (not talking, in
a menu, in a cutscene or walking through a door). Each command needs its name in
`permissions`.

| command | does |
|---|---|
| `cmd.send_letter{ text, item?, from?, paper? }` or `cmd.send_letter{ template = "id" }` | a letter in your mailbox, with a present if you give one; the post office keeps it when the mailbox is full. `template` sends one of your own letters.json letters (its greeting, body, sign-off, present and paper) |
| `cmd.give_item(item)` | an item into your pockets; with full pockets it comes by letter instead |
| `cmd.set_flag(key, value)` | one of your mod's own flags in THIS town (kept in `store`, which is per town), read back with `flag(key)`; visiting a friend it lasts only the visit |
| `cmd.show_line(text)` | a line in your own thought window |
| `cmd.ask{ text, choices }` | a question with 2 to 4 answers; the pick comes back as an `answer` event |

Each returns the command's number, or `nil` and the reason it was refused. What
happened later comes back as a `command_result` event, `{ id, command, ok, error,
via }`, to your mod only. An `answer` is `{ id, choice, text }`, `choice` from 1.

```lua
on("day_start", function()
  local id, why = cmd.send_letter{ text = message("letter"), item = 0x2800 }
  if not id then log("no letter: " .. why) end
end)
on("command_result", function(r) log(r.command, r.ok, r.via, r.error) end)
```

- Items follow the shop's rules: no money, turnips, tickets, grab bags, fossils
  or the game's reserved numbers. Write an item as a number or `"0x2800"`.
- A letter's text is 1 to 192 characters and must fit the letter's 6 lines;
  `from` is up to 8 characters (`"A friend"` when left out); `paper` 0 to 63.
- A letter is an ordinary letter once it arrives: a save keeps working without
  your mod.
- Limits: 4 commands in one event; each game day, per mod, 3 letters, 5 items,
  100 flags, 20 lines and 10 questions (counted when queued, kept across a
  reload); 8 commands waiting per mod.
- In The City every command is refused. Visiting a friend, a letter or an item
  is refused (only the town's owner changes a town); flags, lines and questions
  still work.
- `example.daily-gift` is a whole working mod that sends a letter with a fruit
  once a game day.

Scripts cannot read files, reach the internet or load other code.

Each player's game runs its own copy of a script, and two copies can give
different answers: an api 1 mod's `math.random` starts from a new seed each session, the order
`pairs` walks a table in can differ, `game.time()` is that player's clock, and
the time limit is measured on that player's machine, so a slow phone can stop a
script a fast computer finishes. Don't count on a script giving the same answer
for a visitor as for the town's owner.

- Memory: 4 MB per mod, 16 MB across all mods.
- Each event has a short time budget, and a string pattern that takes too long
  counts against it.
- All mods together get about 4 ms a frame. When a frame's time is used up,
  `day_start`, `item_picked` and `enter_scene` run on the next frame (in
  order), and a `talk` is skipped (the villager says their own hello). A script
  that holds the game up (one event over 33 ms, or three over 8 ms) is stopped.
- The built-in libraries and functions are read-only: `string.rep = ...`,
  `pcall = ...` or `rawset(string, ...)` stop the script with "read-only" or
  "is a built-in". Your own globals work as usual, and a `local` may use any
  name.
- At most 16 handlers per event in a mod, and `on()` only while the script
  first runs, not from inside a handler.
- `__gc` metamethods are refused (they would run outside the time budget).
- `log()` prints at most 20 lines per event and 500 per session.
- A `store.set` that would take the store over 8 KB is refused and changes nothing.
  It raises an error, which stops the script unless you call it with `pcall`.

A script that errors or runs too long is stopped for that session, and the Mods
tab says why. The Mods tab's **Mod log** shows the error with a Lua traceback
(the file and line of each call it came through), beside your `log()` lines and
anything the game refused.

## Developer mode

Work on a mod without zipping and restarting for every change.

1. Open the game with `?moddev=1`, then Settings, Mods. The **Developer** section
   is at the bottom.
2. **Choose folder** and pick the folder with mod.json in it, or run
   `npx playac-mod dev` there and **Connect** to the address it prints.
3. **Restart now**. The mod loads last (its textures and shops win; a script's
   `talk` goes to the first mod in load order), and is not installed: only
   this browser has it.
4. Edit and save:

| You change | What happens |
|---|---|
| lines | the next time the line is said |
| the shop | name, sign, hours and greeting at once; goods the next time you go in |
| the script | it starts again with the new code; its `store` is kept |
| textures | drawn again from the new files |
| talk, letters, events (api 2) | read again at once: a villager's first talk of the day, the next letter, the board |
| items (api 2), mod.json | restart the game |

A file that breaks a rule is not loaded and the Mod log says why. Hidden files
and files a mod cannot hold (a `.psd` beside the `.dds`) are left out. Chrome and
Edge watch the folder; other browsers read it once (pick it again to reload).
While a mod is loaded this way, friend visits and sharing are off.

## If a mod breaks the game

- **Settings, Mods, Start without mods** restarts the game without loading any
  mod. Adding `?nomods=1` to the play page's address does the same.
- A mod that was skipped when the game started says why on its row.

## Updates and takedowns

When the game starts (and when the Mods tab opens) it sends the content hash of
every installed mod, plus the id and version of the ones installed from Browse
mods, to `POST /api/mods/status`. Nothing is sent when no mod is installed.

- A newer approved version of your mod shows **Update available** on players'
  rows, so a fix reaches them without them opening Browse mods.
- A version the moderators take down is switched off on every machine at its
  next start, with the reason on its row. The takedown puts the version's
  content hash on a denylist, so the same files installed from a ZIP are caught
  too. Fix the problem and upload a new version: players who update get it
  switched back on.
- The content hash is worked out from the mod's files, not the ZIP's bytes: it is
  the same for your ZIP and the registry's rebuilt copy, so it is what names a
  mod. The ZIP's own sha256 is not.

## Rules

- Only your own work. A mod may not contain files taken from the game or from
  other packs. `assets_original` is your promise of that.
- No Nintendo or other franchise art, music or text, and no Nintendo names or
  logos in a mod's name, id or pictures.
- Shared mods are checked by a moderator before they are listed.
- Sharing is for players 13 or older. The first upload asks your age and asks
  you to accept the mod rules.
- Sharing needs two-factor sign-in (Profile page): each time, a code from your
  authenticator app lets you upload for 15 minutes.
- The part of the id before the dot is your author name: it belongs to the
  first account that shares under it.
- Every piece of text is checked by the site's word filter; a match is shown to
  the moderator. Updates are reviewed as what changed since your last approved
  version.
- The full rules, how refusals, removals and appeals work, and how to send a
  copyright notice: https://playaconline.com/wiki/mod-rules/

## Checking a mod

Check your mod folder or ZIP before you install or share it, with the
playac-mod tool (https://playaconline.com/modding/testing/#cli):

```bash
npx playac-mod check            # the mod folder you are in
npx playac-mod check my-mod.zip # a ZIP, exactly as the Mods tab reads it
```

It runs the same checks the game runs when you install a mod, and prints every
problem at once. It also warns about a shop good the game would leave out; the
game names those on the mod's row in the Mods tab.
