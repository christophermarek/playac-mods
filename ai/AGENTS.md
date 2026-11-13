<!-- Generated from the Play AC Online mod API spec and errors catalogue. Do not edit by hand. -->

# AGENTS.md: making a Play AC Online mod

This project is a mod for Play AC Online (playaconline.com). Any coding assistant working here follows the instructions below. The reference files live in `.claude/skills/playac-mod/reference/`: keep that folder with this file. If that folder is missing, every reference file (api.md, errors.md, examples.md, items.md) is also in https://playaconline.com/llms-full.txt: fetch it, or get the whole pack from https://playaconline.com/modding/ai/.

# Making a Play AC Online mod

You are helping someone make a mod for Play AC Online, a town life game that
runs in the browser at playaconline.com. They do NOT have the game's source
code and neither do you. Everything you need is in this file and in
`.claude/skills/playac-mod/reference/`:

- `.claude/skills/playac-mod/reference/api.md`: every mod.json key, file format, Lua function, event and limit.
- `.claude/skills/playac-mod/reference/errors.md`: every error message a mod can get, with its code, meaning and fix.
- `.claude/skills/playac-mod/reference/examples.md`: the site's complete working example mods, file by file.
- `.claude/skills/playac-mod/reference/items.md`: item ids each shop can stock, with names, prices and price floors.

Never invent API. If something is not in `.claude/skills/playac-mod/reference/api.md`, the game does not
have it: say so plainly and offer what IS possible. Online, the same docs are at
https://playaconline.com/modding/ (errors: https://playaconline.com/modding/errors/).

<!-- BEGIN generated facts: from the mod API spec, do not edit by hand -->
## Facts from the API spec (generated)

- The game runs mod api levels 1 to 2. A new mod says `"api": 2`. Level 1 mods still run by level 1's rules.
- Level 1 (2026-11-12): The first level: textures, lines, the flower shop, and scripts with four events, log, message, game.time and a per-browser store.
- Level 2 (2026-11-12): Mod items: an items file (content.items) of new furniture on a vanilla base, renames, and mod items in a shop's stock. Also: a per-town store (store.client keeps the per-browser one), data_version and the migrate event, settings, translations in a messages folder, depends and conflicts with version ranges, and remote calls between mods. And the typed targets: Nook's stock (shops target nook), letter templates (content.letters), dated events (content.events) and villager line pools (content.talk). Effects: commands (cmd.send_letter, give_item, set_flag, show_line, ask) queued by a hook and applied between frames, declared in permissions; ten more events; read-only queries (game.pockets, bells, town, villagers, player); flag() and a seeded rng().
- `content` keys: `textures`, `messages`, `shops`; from api 2 also `items`, `letters`, `events`, `talk`.
- Refused at every level (reserved): `game`, `save`. Built from a later level (refused below it): `depends` (api 2), `conflicts` (api 2). Other unknown top-level keys are ignored.
- api 2 mod.json keys beyond level 1: `permissions`, `exports`, `renames`, `depends`, `conflicts`, `data_version`, `settings`.

Events (15; list each one a script uses in `scripts.hooks`):

- `talk(npc {name, id})` (api 1): The player starts an ordinary talk with a villager. Special and event talks never reach mods (a first meeting, a villager moving out, one with an errand, delivery or contest going with you, a complaint, a pitfall or a bee chase, an islander, Kamakura, summer camp): no handler is called for them, and the villager's next ordinary talk calls it as usual, so a line a script is keeping for "the next talk" waits for that one. Return a line and the villager says it before their usual greeting; return nil to stay quiet. The FIRST mod in load order whose handler returns a line wins that talk; later mods' talk handlers are not called for it. An empty string, a line over 400 bytes or one holding a zero byte is not a line: it is logged and the next mod is asked.
- `day_start(date {year, month, day})` (api 1): A new day begins in the game, once per day, also when the game starts on a new day. It does not fire again when the game restarts later on a day the town already saw: the save holds the day it last began. If the game was not saved since that day began, the save still holds the day before, so the next start fires it again. Count days by storing the last date you saw, not by counting calls.
- `item_picked(item)` (api 1): The player got an item: picked it up, caught it with the net or rod, or dug it up. Fires after it is in their pockets.
- `enter_scene(scene)` (api 1): A scene (the town, a house, a shop) starts. Not in the title demo.
- `migrate(from, to)` (api 2): Once per town, when mod.json "data_version" differs from the version the town's data was written at. It runs when the town is first used, not at the restart: at the first event in that town that any running mod handles, before that event's handlers run. So a mod that handles only talk (and no other mod handles an earlier event) migrates at the first talk; list enter_scene in scripts.hooks and handle it (an empty handler is enough) to migrate as the town loads. from is 0 for data from before data_version (or moved from the per-browser store). If it errors the script stops and the version stays, so the next start tries again. Migrations run in load order, and a remote.call from a migrate handler into a mod whose own migrate has not run in that town yet is refused. Needs data_version.
- `hour_change(e {year, month, day, hour})` (api 2): The game's clock reached a new hour (the game's own hourly event update, midnight included).
- `shop_buy(e {item, price, mod_item})` (api 2): The player bought a good off Nook's floor, as Nook takes the price. item is the piece's item number; mod_item is the full id ("author.mod:thing") when the piece is a mod item (the base furniture it stands on is item), nil for a plain good. A visitor buying in a friend's town gets a plain piece, so nil.
- `item_sold(e {item, count, bells, mod_item})` (api 2): The player sold to Nook, once the wallet is credited. item is the first good; mod_item is its full id when that first good is a mod item, nil otherwise.
- `fish_caught(e {item, pocketed})` (api 2): A fish was landed; pocketed says whether it went into the pockets. There is no size or length: the game keeps none for a caught fish (each kind has one fixed shadow size, and only the fishing tourney makes up a length, when the fish is shown to its host).
- `bug_caught(e {item, pocketed})` (api 2): A bug was netted; pocketed says whether it went into the pockets.
- `letter_read(e {sender, present, first_time})` (api 2): The player chose Read on a letter.
- `villager_moved_in(e {id, name})` (api 2): A villager with no house was given one (the game start after a move-in; a brand-new town fires it for its first villagers).
- `visitor_arrived(e {kind})` (api 2): A friend is riding into this player's own town (a friend visit, host side). kind is "friend".
- `command_result(e {id, command, ok, error, via})` (api 2): A command this mod queued was applied or refused. via: mailbox, post_office, pockets, mail, store or shown. Sent only to that mod.
- `answer(e {id, choice, text})` (api 2): The player picked an answer to this mod's ask. choice counts from 1; 0 with text "" when the window closed without a pick.

Lua globals (anything else does not exist):

- `on` (api 1)
- `log` (api 1)
- `message` (api 1)
- `game` (api 1): `game.time`, `game.pockets` (api 2), `game.bells` (api 2), `game.town` (api 2), `game.villagers` (api 2), `game.player` (api 2), `game.events_today` (api 2)
- `store` (api 1): `store.get`, `store.set`, `store.town` (api 2), `store.client` (api 2)
- `settings` (api 2): `settings.get`
- `remote` (api 2): `remote.add`, `remote.call`, `remote.has`
- `cmd` (api 2): `cmd.send_letter`, `cmd.give_item`, `cmd.set_flag`, `cmd.show_line`, `cmd.ask`
- `flag` (api 2)
- `rng` (api 2)

Commands (api 2; each needs its name in mod.json `permissions`; at most 4 per event):

- `cmd.send_letter`: Queues a letter in the player's own mailbox (the post office keeps it when the mailbox is full). The save holds an ordinary letter, so it loads without the mod.
- `cmd.give_item`: Queues an item into the first empty pocket; with full pockets it comes by letter. Also takes this mod's own new item by its full id (author.mod:thing, given with its identity, as a shop sells it); full pockets refuse that one.
- `cmd.set_flag`: Queues one of this mod's own flags into this TOWN's store (see store) as flag:<key>; the store's 8 KB cap applies. A flag belongs to the town it was set in: visiting a friend it lasts only the visit, and before a town is loaded it is refused. Not in the save.
- `cmd.show_line`: Queues a line in the player's own thought window, shown once the player is free. One line or question at a time.
- `cmd.ask`: Queues a question with 2 to 4 answers in the player's thought window. The pick comes back as an answer event.

Key limits: ZIP 16 MiB; 256 lines per messages file, 400 bytes each; script 200,000 instructions and 33 ms per event (the main chunk at start gets 100 ms; 3 runs over 8 ms also stop a script), 4 MB memory; store 8 KB per mod per town. All limits: `.claude/skills/playac-mod/reference/api.md`.

### Common texture names

Any-palette (`$`) names: each covers every time of day and stretch of the year it is drawn in. A tree crown name covers golden trees too (same crown, gold palette).

- Tree crown (grown broadleaf, fruit and golden trees) (February 25 to December 9, except April 1 to 8): `tex1_64x64_a67216e4ad55d908_$_8.dds`
- Tree crown, cherry blossom days (April 1 to 8): `tex1_64x64_ac6a2be34281d4e2_$_8.dds`
- Tree crown, winter (snow on top) (December 10 to February 24): `tex1_64x64_53d6cc5ace654ac7_$_8.dds`
- Cedar crown (February 25 to December 9): `tex1_64x64_2913073a15235562_$_8.dds`
- Cedar crown, winter (December 10 to February 24): `tex1_64x64_136aa80a0926d0a3_$_8.dds`
- Palm fronds (February 25 to December 9): `tex1_128x32_9dff2c84fba803e5_$_8.dds`
- Palm fronds, winter (December 10 to February 24): `tex1_128x32_53b283fa3171bbdd_$_8.dds`
- Grass (3 variants) (February 25 to December 9): `tex1_32x32_626709d910129694_$_8.dds`, `tex1_32x32_903adc6355e36f59_$_8.dds`, `tex1_32x32_e96fecd242518c9f_$_8.dds`
- Grass, winter (3 variants) (December 10 to February 24): `tex1_32x32_e2ab673814e71af6_$_8.dds`, `tex1_32x32_cfa57a6e6f966d11_$_8.dds`, `tex1_32x32_82f28ec4199a45be_$_8.dds`
- Cliff faces (3 variants) (February 25 to December 9): `tex1_64x64_99c780e750314916_$_8.dds`, `tex1_64x64_16de5cbb85d58cc0_$_8.dds`, `tex1_64x64_f628105fb6e026fd_$_8.dds`
- Cliff faces, winter (3 variants) (December 10 to February 24): `tex1_64x64_0dd181f7c8e1d9e1_$_8.dds`, `tex1_64x64_e5488c12d43d6cbc_$_8.dds`, `tex1_64x64_64ac9d75399172f0_$_8.dds`
- River and pond banks (3 variants) (February 25 to December 9): `tex1_64x64_1218fdfe9c963f24_$_8.dds`, `tex1_64x64_78690dcebd874a3b_$_8.dds`, `tex1_64x64_2d865e307f1a0fdc_$_8.dds`
- River and pond banks, winter (3 variants) (December 10 to February 24): `tex1_64x64_2ec0ba79769bedc7_$_8.dds`, `tex1_64x64_b6437b8020145bc6_$_8.dds`, `tex1_64x64_9438dc9288174b5a_$_8.dds`

### The playac-mod tool

A command line tool (Node.js 18.17 or newer): `npx playac-mod new <id> --kind texture|lines|shop|script [--github]`, `check` (a folder or a .zip; Lua syntax by the game's own parser), `pack` (writes `<id>-<version>.zip` beside the folder), `dev`, `types`, `publish` (`--github <owner>/<repo>@<tag>` checks the tag first), `status`, `yank <version>`, `unyank <version>`, `logout`.
Its package is NOT on npm yet, so a bare `npx playac-mod` cannot download it. Install it from the site once: `npm install -g https://playaconline.com/modding/downloads/playac-mod.tgz` (then every `npx playac-mod ...` uses that copy). Without Node, use the no-Node route: write the files, ZIP them, install with Choose ZIP (the same checks run).
<!-- END generated facts -->

## What a mod can and cannot do

Can (all at `"api": 2` unless marked api 1):
- Replace any texture the game draws with your own art, as `.dds` or `.png` (api 1).
- Add lines a villager says before their usual hello: from a script's `talk` handler (api 1), or with no code from talk pools (`content.talk`) and dated events (`content.events`).
- Change the flower shop (name, hours, greeting, up to 6 goods and prices; api 1) and add goods to Nook's shelves (`"target": "nook"`).
- Add new furniture on a game piece's model (`content.items`), sold in your shops or given by a script.
- Letter templates (`content.letters`), dated town events with a bulletin board notice.
- Scripts on every event listed above, reading the date, pockets, Bells, town, villagers; a per-town store; settings the player sets; translations; calls between mods (`remote`).
- Commands, declared in `permissions`, applied between frames: see the list above.

Cannot (do not promise these):
- Add villagers, buildings, acres, music, or new kinds of item other than house furniture on a game model.
- Change shops other than the flower shop and Nook's, or set Bells.
- Run code every frame, change the game's code or memory, read files, reach the internet, or run JavaScript. There is no `io`, `os`, `require`, `load` or `debug`.
- Change anything in The City (every command is refused there) or a friend's town while visiting (letters and items are refused).

## Rules (a mod breaking these is refused or removed)

- Only the author's own work. No textures, models, music or text taken or traced from any Nintendo game or any other game, film, show or brand. Exported textures from the inspector are the game's art: use them only to see the size and layout, and draw a new picture. A recolour, hue shift, filter, touch-up or trace of a game texture is NOT original and cannot be shared (fine in the player's own game); say so plainly when asked to recolour one for sharing. Unchanged copies are refused automatically.
- No Nintendo or franchise names or logos in a mod's name, id, description or pictures.
- `"assets_original": true` in mod.json is the author's promise of the above.
- Nothing sexual, hateful, or holding personal information. Scripts must not try to slow or break the game.
- Sharing needs an account, age 13 or older, two-factor sign-in, and accepting the mod rules. Full rules: https://playaconline.com/wiki/mod-rules/

## Pick the path

Ask what they want to make, then follow ONE of these. Each ends with a mod that installs.

### 1. Artist (textures, no tools needed)

1. Open `https://playaconline.com/play/?moddev=1` and load the town.
2. Settings, Mods, Developer: press **Record textures**. Close Settings, walk to what should change, open Settings again. The newest textures are first; **Flash** paints one magenta in the game for 3 seconds to find it.
3. Tick the textures and press **Export**: a working mod ZIP with each texture as an uncompressed `.dds`, already named right. A texture with a palette (grass, trees, cliffs) is exported under its `$` (any palette) name, `tex1_32x32_626709d910129694_$_8.dds`, so the art shows at night and in every season: keep the `$`. The common names (trees by season, cedars, palms, grass, cliffs, banks) are listed under "Common texture names" above, so a mod for those needs no recording at all.
4. Unzip, and in an editor that reads DDS (GIMP, Paint.NET) draw a NEW picture on a layer over each one, then delete the game's layer; or save it as `.png` under the same name. Keep each file name exactly. 2x or 4x the size is fine; smaller looks blurry.
5. Delete the textures you did not change (unchanged ones are refused when shared). Edit mod.json: your own id, name, authors.
6. ZIP the folder (Finder Compress or Windows Send to; the folder or the files inside it both work). Keep other ZIPs out of the folder: a `.zip` inside a mod is refused. Settings, Mods, "Install from a file", **Choose ZIP**, then **Restart now**.

Texture facts: names are `tex1_<w>x<h>_<texture hash>_<palette hash>_<format>.dds` (or `.png`; no palette part for a texture without a palette; `$` in place of the palette hash matches any palette; a `$` file is loaded once and shared by every palette, and any mod's exact-palette file wins over it for that palette). A `.dds` must be BC7, DXT1, DXT5 or uncompressed 32-bit RGBA (either channel order: RGBA or BGRA/A8R8G8B8), ONE level, no mipmaps (the game draws a DDS with mipmaps, but the mod list refuses it). A `.png` is drawn too: at most 2048 x 2048, and all mods' PNGs together at most 96 MiB of pixels (24 MiB on a phone). Do not keep a `.png` and a `.dds` of the same texture: the game uses only one. A mod's texture wins over the HD pack. On a phone all switched-on mods share 24 MiB unpacked.

### 2. Writer (lines, shops, letters, events; a text editor)

1. Make a folder with `mod.json` (template below) and the content file.
2. Villager lines, no script: a talk pools file (`content.talk`): lines by personality or by villager, with a daily `chance`. See `.claude/skills/playac-mod/reference/api.md` and the Chatty Villagers example. Use this first for per-personality lines.
3. Lines in the player's language: `messages/en.json` (+ `fr.json` ... in a messages folder) and a tiny script (the talk example below). ONLY `content.messages` translates: talk pools, event lines, notices, letters, shop text, item names and setting labels are one language for everyone, and letters and notices take plain US keyboard characters only (no accents).
4. A shop: `shops.json` (template below), `"scope": "world"`. Themed goods that are furniture (lanterns, a tea set) need the mod's own items (`content.items`), which the flower shop and Nook's both sell; the flower shop cannot show the game's own furniture.
5. A letter: `content.letters` with `id`, `header` (`{player}` for the name), `body` (6 lines), `footer` (the sign-off, up to 32 characters) and an optional `sender` (up to 8, the name in the mailbox list, which otherwise shows the footer cut to 8: "The Lantern Keepers" reads "The Lant"; `check` warns), `item`, `paper`. A script mails it with `cmd.send_letter`, an event with `letter`.
6. A dated town day: `content.events` with `board` (world scope), `talk` lines and `letter` (the id of one of the mod's `content.letters` letters, mailed on the day with NO script, once per town). `"week": 2, "weekday": 5` means the second Friday of the month (week n = the nth such weekday; `"last"` = the last). To test: set the date to today while testing; or move the device clock (the game reads it at start; back up the save first). Installed mid-day, the notice posts the next time the player walks outside that day; `day_start` does not fire again after a restart the same day, so a script uses `game.events_today()`.
7. ZIP the folder (the folder or its files, either works), Settings, Mods, "Install from a file", **Choose ZIP**, **Restart now**.

### 3. Scripter (Lua, ideally VS Code and Node)

1. With the playac-mod tool (see "The playac-mod tool" above): `npx playac-mod new yourname.my-mod --kind script` makes the folder with mod.json, main.lua, editor types (LuaLS) and JSON schemas in `.playac/`, and this skill. Kinds: `texture`, `lines`, `shop`, `script` (default `lines`). `npx playac-mod types` refreshes `.playac/` after a game update.
2. `npx playac-mod check` runs every rule the game runs at install, lists every problem at once (JSON errors with line and column), and FAILS on a script the game would stop at load: a Lua syntax error (checked with the game's own Lua 5.4 parser, built into the tool) and an `on()` for an event not in `scripts.hooks`. It warns about what the game accepts but probably not as meant (cmd.* not in permissions, a shop good the game leaves out, a texture the mod list refuses). `check some.zip` checks a ZIP exactly as the Mods tab reads it. `npx playac-mod pack` writes `<id>-<version>.zip` NEXT TO the mod folder (the same bytes every time) and prints its content hash. Hidden files and folders (`.playac/`, `.claude/`, `.vscode/`) and a top-level `CHANGELOG.md` never go in the ZIP; README.md does, so it is for players.
3. Test without zipping: open the game with `?moddev=1`, then Settings, Mods, Developer: **Choose folder** (the folder with mod.json), or run `npx playac-mod dev` and **Connect** to the address it prints (`http://127.0.0.1:2604`, or the next free port when 2604 is taken: use the printed one). Restart once; after that, saving reloads it in the running game: lines, shops, `talk`, `letters` and `events` files at once (shop goods on the next visit, a talk pool on a villager's first talk of the day), `main.lua` restarts the script with its store kept, textures are drawn again; a mod.json or `items` file change needs a restart. Errors (with a Lua traceback), stops and refused files are in the Mods tab's **Mod log**. While a mod is loaded this way, friend visits and sharing are off.
4. Without Node: write the files by hand from the templates here, ZIP them and install with **Choose ZIP**: the install runs the same checks.

### 4. Power user (sharing, versions, dependencies, multiplayer)

- Raise `version` for every shared update; a version can never be replaced.
- `npx playac-mod publish` signs in with a code: it prints an address on the site and an 8-letter code; the user opens it signed in (two-factor on), checks the code and presses Approve. Two clocks: a code from the authenticator app opens a 15-minute window in that browser to upload on the site or approve a sign-in; the approved CLI sign-in then lasts one hour on its own. The sign-in only uploads mods and lists or yanks the user's own versions; `npx playac-mod logout` ends it. `--github owner/repo@tag` imports a tagged GitHub release instead, after checking the tag against mod.json, the listing (screenshots 200 to 4096 px a side in `.playac/screenshots/`, a `## <version>` section in `CHANGELOG.md`) and git (tag exists, pushed).
- `npx playac-mod status` lists every uploaded version and its state (pending, listed, superseded, yanked, rejected with the reason, removed). `npx playac-mod yank 1.2.0 --reason "..."` takes a listed version out of the list; `unyank 1.2.0` lists it again.
- A GitHub repo: `npx playac-mod new yourname.my-mod --github` adds `.github/workflows/mod.yml` (check on push, pack on a `v*` tag; it needs the package on npm, and until then warns and checks nothing) and `CHANGELOG.md` (never packed, so editing it keeps the content hash).
- A library and a mod that needs it: developer mode loads ONE folder, and that copy counts as installed for `depends`; install the other from its ZIP (`npx playac-mod pack`), either way round. A library declares `exports` (name -> one-line description) in mod.json; `npx playac-mod types` in a dependent beside it (or with `PLAYAC_LIBS`) adds them as `remote.call` hints.
- Translations on any disc: open the game with `?moddev=1&modlang=fr` (de, es, it, en) and `message()` answers in that language for the session.
- `migrate(from, to)` runs when the town is first used, NOT at the restart: at the first event in that town that any running mod handles, before that event's handlers. A mod that handles only `talk` migrates at the first talk (a test must talk to a villager after updating); list `enter_scene` in `scripts.hooks` and handle it (an empty handler is enough) to migrate as the town loads.
- `migrate` runs only for data that exists: on a fresh install there is none, so it is not called, and the first `store.set` writes at the current `data_version`. `from` is 0 for data saved before the mod set a `data_version`.
- World mods (`"scope": "world"`) that count must match for friend visits: same mods, same versions, same order. Client mods never block a visit. When every world mod of the host that counts is a reviewed version from the mod list, the visitor can load them for that visit only: nothing is installed, they run with the host's settings (a text setting changed from its default must pass the site's word checks, or the visit is refused) and an empty store that is never kept, and at the visitor's home (the restarts before and after the trip) their shop, Nook goods, board notices, items, renames and commands do nothing. A mod installed from a file cannot be lent, so publish world mods. A world mod that depends on a client mod cannot load for a friend without that client mod, so the visit is refused: world mods should depend only on world mods.
- In The City, world mods' shops and board notices switch off and every command is refused; textures, lines and scripts keep running for the player.

## mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": ["yourname"],
  "description": "What it does, in a sentence or two.",
  "scope": "client",
  "content": {
    "textures": "textures/",
    "messages": "messages/en.json"
  },
  "scripts": { "main": "main.lua", "hooks": ["talk", "day_start"] },
  "assets_original": true
}
```

- Required: `schema` (1), `api` (2 for a new mod), `id`, `name`, `version`, `authors`, `scope`, `assets_original: true`.
- `id`: `author.mod-name`, lowercase letters, digits and dashes, one dot. Never change it after sharing. `playaconline`, `official`, `admin` and `example` are reserved author names.
- `version`: `"1.0.0"` style, three numbers, no leading zeros.
- `scope`: `"client"` (only the player sees it) or `"world"` (changes the town for visitors; REQUIRED for shops and board notices).
- `content`: the keys listed above. Paths are exact, case-sensitive, relative to mod.json.
- `scripts.hooks`: every event the script uses with `on()`, each once. An `on()` for an event NOT in `hooks` raises an error at load and the whole script stops (the mod still installs): always add the event to `hooks`. A library mod that only offers `remote.add` functions still lists one event and registers no handler for it.
- `settings` (api 2), one of each type: `[{ "name": "greet", "type": "bool", "label": "Say hello", "default": true }, { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 }, { "name": "drink", "type": "choice", "label": "Drink", "default": "tea", "choices": ["tea", "coffee"] }, { "name": "motto", "type": "text", "label": "Shop motto", "default": "", "max_length": 40 }]`. name 1 to 32 of `a-z 0-9 _` starting with a letter; label 1 to 60 characters; optional description up to 200; at most 16. Read with `settings.get("price")`.
- `permissions`: every command the script uses (`cmd.<name>`).
- JSON is strict: double quotes, no comments, no trailing commas, no key twice.

## shops.json (world mods only)

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

- `target` is `"flower"` or (api 2) `"nook"`. Flower: `name` 1 to 40 characters, `hours` two-digit 24-hour times, open and close different, close may pass midnight (the shop still shuts 2 AM to 7 AM), `greeting` and `stock_line` 1 to 160 characters, at most 3 line breaks, 1 to 6 goods. Nook: only `mode` (`add` or `replace`) and `stock`, 1 to 16 goods.
- `item` is a STRING `"0x"` + 4 hex digits, or one of the mod's own items by full id (`"yourname.my-mod:tea-chest"`). `price` optional, whole Bells 1 to 99999; below the good's floor it is raised to it (the floor is what Nook pays; a town fruit at the flower shop is 500).
- What each shop may stock is in `.claude/skills/playac-mod/reference/items.md` (flower and Nook's columns). The flower shop needs a good with a shop table model: none of the game's own furniture has one, but the mod's OWN items always work there. Nook's sells the game's furniture, clothing, stationery, carpets, wallpaper, tools, umbrellas, paint, saplings, flower bags; not fruit. Money, tickets, grab bags, turnips and fossils never. A refused good is left out, with the reason on the Mods tab row after a restart; `npx playac-mod check` warns first.

## messages/en.json

```json
{ "greet": "Hello there!", "shop.hours": "We open at three." }
```

Ids 1 to 48 of `a-z 0-9 _ . -`; at most 256 lines; each 1 to 400 bytes. Lines wrap at 24 characters, 4 lines to a page; characters the font lacks show as `?`. A script reads its own line with `message("greet")` and another mod's with `message("author.mod:greet")` (nil when that mod is not installed). At api 2, `content.messages` may be a folder of `en.json` plus `de es fr it` translations.

## Scripts (Lua 5.4)

```lua
-- main.lua: the top level runs once at start, BEFORE any town is loaded.
-- Register handlers here. Read and save the store only inside events.
on("talk", function(npc)            -- npc = { name, id }
  if store.get("met_" .. npc.id) then return nil end
  store.set("met_" .. npc.id, true)
  return message("greet")           -- the villager says this, then their usual hello
end)

on("day_start", function(date)      -- date = { year, month, day }
  local today = ("%04d-%02d-%02d"):format(date.year, date.month, date.day)
  if store.get("last_day") ~= today then  -- a restart the same day does not fire it again; count by date
    store.set("last_day", today)
    store.set("days", (store.get("days") or 0) + 1)
  end
  log("day", store.get("days"))
end)
```

- `store` is per mod per TOWN at api 2 (8 KB): `store.get` answers nil and `store.set` is refused at the top level, before a town loads. `store.client` is per browser. Strings, numbers, booleans only; `set(key, nil)` deletes. A mod that says `"api": 1` keeps level 1's per-browser `store` (usable at the top level) and Lua's own `math.random`; new mods should say the current level.
- `log(...)` writes a line in the Mods tab's **Mod log** and the browser console as `[Mods] <id>: ...` (20 per event, 500 per session).
- `talk`: the FIRST mod in load order whose handler returns a line wins. Textures and shops: the LAST mod wins (so a mod loaded in developer mode, which loads last, wins textures and shops but not a talk). Talk pools from every mod are pooled, not ranked. `command_result` and `answer` go only to the mod that asked, `migrate` only to the mod whose data version moved; every other event runs every mod's handlers.
- Commands (`cmd.send_letter{...}`, `cmd.give_item(item)` ...) return the command's id, or nil and the reason; the outcome arrives as a `command_result` event. At most 4 per event; daily caps and every command's arguments in `.claude/skills/playac-mod/reference/api.md`. A question with answers:

```lua
-- mod.json: "permissions": ["ask", "show_line"], "scripts": { "main": "main.lua", "hooks": ["enter_scene", "answer"] }
local asked = false
on("enter_scene", function(scene)
  if asked then return end
  asked = true
  cmd.ask{ text = "Join the fishing derby?", choices = { "Sign me up!", "No thanks" } }
end)

on("answer", function(a)            -- a = { id, choice, text }: choice counts from 1, 0 if closed
  if a.choice == 1 then cmd.show_line("You're in the derby!") end
end)
```

- A letter body is 192 pixels a line in the game's font: about 30 characters of ordinary English a line, 6 lines (capitals, m and w are wider: 19 W's fill a line; words never split). Keep text a script builds under about 150 characters with at most 5 line breaks; `cmd.send_letter` refuses one that does not fit at once: it returns nil and the reason. Plain US keyboard characters only.
- `fish_caught(e)` gives `e.item` (the fish) and `e.pocketed`; there is no size or length.
- Over a limit, or on any Lua error (syntax errors included), the script stops for the session and the Mods tab row says why with the line; the rest of the mod keeps working. `pcall` does not get around the budget. Payloads are copies. No `__gc`, no `__len` passed to table functions.

## Testing checklist

1. `npx playac-mod check` (or install the ZIP: the Mods tab refuses with the reasons). Read every warning.
2. Restart the game and read the mod's row in Settings, Mods: anything the game itself refused (shop items, a script that stopped) is listed there.
3. Script output: the Mods tab's **Mod log** (log() lines, errors with a traceback, stops, refused files, live), and the browser console (F12, Console), lines starting `[Mods] yourname.my-mod:`.
4. Something broke the game? Settings, Mods, **Start without mods**, or add `?nomods=1` to the play address.
5. Before sharing: no file you did not make, unchanged textures deleted, version raised, description says what it does, a screenshot ready.

## Sharing and review

1. Sign in at playaconline.com with two-factor sign-in on. Settings, Mods, Share a mod. The first time, confirm age 13+ and accept the mod rules.
2. Upload the ZIP (or Import from GitHub). The automatic checks answer at once (the same rules, plus image checks: unchanged game textures, DDS formats, mipmaps).
3. A moderator reviews it, usually within 7 days. Refusals and removals come with a reason code (`review-*` in `.claude/skills/playac-mod/reference/errors.md`) and a note. Every upload sends the author an email.
4. Updates: raise `version` and upload again. Players who have it see "Update available". A version taken down is switched off on every player's game.

## Troubleshooting: always use the errors catalogue

When the user pastes an error, find it in `.claude/skills/playac-mod/reference/errors.md` (search a distinctive phrase; the page's, the registry's and the game's wordings are all listed) and answer with: the code, what it means in one sentence, and the exact fix applied to THEIR file. Link `https://playaconline.com/modding/errors/#<code>`. A Lua syntax error (`main.lua:7: 'end' expected near <eof>`) is `script-syntax`; any other Lua error with a file and line is `script-error`: open that line.

Common ones: no mod.json at the top of the ZIP (`zip-no-manifest`: zip the folder's contents, not a parent folder); a client mod with shops (`shops-need-world`); `"item": 0x2800` without quotes (`shop-item`); an event used with `on()` but missing from hooks (`script-on-event`); a texture that does not show (the name must be exact, check it with the inspector's Copy name; a DDS saved with one level; a later mod in load order may replace it).

## How to answer

- Give COMPLETE files, ready to save, never fragments with "...".
- Check every file against the rules above before you give it: required keys, `"api": 2`, string item ids, hooks matching `on()` calls, permissions matching `cmd.` calls, scope world for shops, limits.
- Prefer the smallest mod that does what they asked. Say what it cannot do instead of faking it.
- Remind them to raise `version` when they change a shared mod.
- No Nintendo names in ids, names or descriptions you write.
