# Play AC Online mods

Everything you need to make a mod for [Play AC Online](https://playaconline.com): working example
mods, starter kits, the mod API spec with editor types, every error message the
game can give a mod, and instructions for your AI coding assistant.

The documentation lives at **https://playaconline.com/modding/**. This repository holds the files
the docs talk about, so you can clone, fork or copy them. It is generated from
the game's own sources on every release, so it always matches the game (mod api
levels 1 to 2).

## What is a mod?

A mod adds things to the game without changing its code: new textures, lines
villagers say, the flower shop's stock and Nook's goods, town days of your own,
letters, and small scripted moments in Lua. A mod is a folder with a
`mod.json` in it, shared as a ZIP. Players install mods in **Settings, Mods**,
from a ZIP or from the list of mods other players shared.

New to this, on a computer with nothing installed? The [setup guides](setup/)
take you from nothing to a mod running in the game, step by step for macOS,
Windows and Linux: [the game and developer mode](setup/game.md),
[Node.js and playac-mod](setup/node-and-cli.md), [your editor](setup/editor.md),
[texture tools](setup/textures.md), [an AI assistant](setup/ai-assistant.md),
[Git and GitHub](setup/git-github.md), [publishing](setup/publishing.md) and
[troubleshooting](setup/troubleshooting.md).

Start here, by what you want to make:

- New textures for the town: https://playaconline.com/modding/start/artist/
- Lines, letters and town days: https://playaconline.com/modding/start/writer/
- Lua scripts: https://playaconline.com/modding/start/scripter/
- All of it, from the command line: https://playaconline.com/modding/start/power-user/

## What is in here

| Folder | What it is |
|---|---|
| [`examples/`](examples/) | Complete example mods, one idea each. The same ones as the [cookbook](https://playaconline.com/modding/cookbook/). |
| [`examples-media/`](examples-media/) | Pictures and a short film of each example in the game, shown in its README. |
| [`templates/`](templates/) | Starter kits: copy one, rename the id, make it yours. |
| [`api/`](api/) | The mod API spec (`api.json`), JSON schemas for every mod file, Lua types for your editor, and the item list. |
| [`errors/`](errors/) | Every error and refusal a mod can get, by code, with what it means and how to fix it. |
| [`ai/`](ai/) | Instructions for an AI coding assistant working on a mod. |
| [`setup/`](setup/) | Setup guides: from a clean computer to a mod in the game, per need and per system. |
| [`cli/`](cli/) | The source of the `playac-mod` tool, its tests, and the game's mod rules it runs. |
| [`template/`](template/) | A mod repository to start from on GitHub, with a check workflow. |
| [`tools/`](tools/) | Small scripts: check a mod ZIP, make a big texture mod for testing, draw DDS textures. |
| [`MAKING-A-MOD.md`](MAKING-A-MOD.md) | The whole modder guide on one page. |

## Get the playac-mod tool

`playac-mod` makes, checks, packs, live-tests and publishes mods. It needs
Node.js 18.17 or newer ([installing Node.js](setup/node-and-cli.md), for each system).

```bash
npm install -g https://playaconline.com/modding/downloads/playac-mod.tgz
```

Until the package is published to npm, it installs from the site as above.
More: https://playaconline.com/modding/testing/#cli

## The tool's source

[`cli/`](cli/) is the source of `playac-mod`, the same code the install line
gives you, with the game's own mod rules (`cli/vendor/mods.js`, the file the
game page runs) so `check` and the game cannot disagree. It needs nothing
installed beyond Node.js, and runs straight from a clone:

```bash
node cli/bin/playac-mod.mjs check examples/example.tea-house
cd cli && npm test        # its own tests; a few need the game's source and are skipped
```

[`cli/releases/releases.json`](cli/releases/releases.json) lists every frozen
release with its SHA-256: the check workflow downloads one by its address and
refuses it unless the hash matches.

## A mod repository on GitHub

[`template/`](template/) is a whole mod repository: a working mod at the top,
editor settings, a `.gitignore`, and `.github/workflows/mod.yml`, which runs
`playac-mod check` on every push and packs the mod on a version tag. Copy the
folder's contents into a new repository (or run `playac-mod new yourname.my-mod
--github`, which writes the same workflow), change the id in `mod.json`, and
push. The workflow installs one release of the tool, pinned by its SHA-256.

## Tools

| Script | What it does |
|---|---|
| [`tools/check-zip.mjs`](tools/check-zip.mjs) | `node tools/check-zip.mjs my-mod.zip`: what the game's Mods tab would say about a ZIP, from the same code. |
| [`tools/make-texture-mod.mjs`](tools/make-texture-mod.mjs) | `node tools/make-texture-mod.mjs --mib 24`: a texture mod of a chosen size, to test how a phone copes with big mods. Not for sharing. |
| [`tools/example-textures.mjs`](tools/example-textures.mjs) | The program that draws the examples' textures: an uncompressed DDS writer (`dds()`) and seeded drawings, to borrow from. |

They use the tool's code in `cli/`, so run them from a clone with both folders.

## Try an example

```bash
git clone https://github.com/christophermarek/playac-mods.git
cd playac-mods/examples/example.tea-house
playac-mod check        # every rule the game checks, before you install
playac-mod pack         # writes example.tea-house-<version>.zip next to the folder
```

Then in the game: **Settings, Mods, Install from a file, Choose ZIP**, and
**Restart now**. To see edits without zipping, run `playac-mod dev` in the
folder and open the game with `?moddev=1` (https://playaconline.com/modding/testing/).

## Start your own

```bash
playac-mod new yourname.my-mod --kind lines   # or texture, shop, script
```

or copy a folder from [`templates/`](templates/). The part of the id before the
dot is your author name.

## Examples and starter kits

| Example | What it shows |
|---|---|
| [`example.blossom-lane`](examples/example.blossom-lane/) | Every grown tree in town becomes a cherry blossom tree, snow-capped in winter, and fallen petals dot the grass. A texture-only mod, drawn from scratch. |
| [`example.chatty-villagers`](examples/example.chatty-villagers/) | Villagers say one new line a day before their usual hello, each in their own personality's voice. Data only, no script. |
| [`example.clover-meadow`](examples/example.clover-meadow/) | Town grass with clover and tiny white flowers. A texture-only mod, drawn from scratch. |
| [`example.cobble-town`](examples/example.cobble-town/) | Your town paved in cobblestone, with block walls for cliffs and brick quays along the river. Snowy in winter. A texture-only mod, drawn from scratch. |
| [`example.cosy-corner`](examples/example.cosy-corner/) | Two pieces of furniture of its own, a Tea Chest and a Reading Chair, sold at the flower shop. Remove the mod and they stay in your house as the plain pieces they are built on; put it back and they are yours again. |
| [`example.daily-gift`](examples/example.daily-gift/) | Once a game day, a letter with a little present arrives in your mailbox. A worked example of mod commands. |
| [`example.field-notes`](examples/example.field-notes/) | Your own naturalist's journal. Every bug, fish, fossil, shell and piece of fruit you collect goes in your notes, and villagers have plenty to say about your haul, your records and yesterday's finds. |
| [`example.harvest-festival`](examples/example.harvest-festival/) | Two town days of our own: the Harvest Fair on the third Wednesday of September and Apple Day on October 21. A notice goes up on the bulletin board and villagers talk about it all day. Also carries a thank-you letter template for mod commands. |
| [`example.night-market`](examples/example.night-market/) | After dark the flower shop becomes a lantern-lit night market with its own stock, and villagers drop hints about tonight's special. |
| [`example.nook-extras`](examples/example.nook-extras/) | Nook's shop puts a few extra goods out every day: furniture, umbrellas, a shirt and a rug, beside his usual stock. |
| [`example.tea-house`](examples/example.tea-house/) | The flower shop becomes a tea house in the evening: its own greeting, its own hours, and fruit for tea on every table. |
| [`example.village-gossip`](examples/example.village-gossip/) | Once a day, each villager you talk to shares a bit of town gossip before their usual hello. |
| [`example.wish-list`](examples/example.wish-list/) | Tiny daily quests: a few villagers make a wish each day. Pick up what they wished for and they thank you and keep a friendship streak. |

| Starter kit | For |
|---|---|
| [`lines-kit`](templates/lines-kit/) | writing villager lines |
| [`script-kit`](templates/script-kit/) | a Lua mod script |
| [`shop-kit`](templates/shop-kit/) | changing the flower shop |
| [`texture-kit`](templates/texture-kit/) | a texture mod |

## Editor support

Point your editor at the schemas so it checks your files as you type. A
`mod.json` or `shops.json` can say so itself:

```json
{ "$schema": "https://playaconline.com/schemas/mod.schema.json" }
```

For Lua, add [`api/playac.lua`](api/playac.lua) to your Lua language server's
library (`playac-mod new` and `playac-mod types` set that up in `.playac/`).
Each starter kit carries VS Code settings that do both. Step by step, for VS
Code and other editors: [setup/editor.md](setup/editor.md).

## Docs

- Concepts: https://playaconline.com/modding/concepts/
- Guides: textures https://playaconline.com/modding/guides/textures/, lines https://playaconline.com/modding/guides/lines/, shops https://playaconline.com/modding/guides/flower-shop/,
  scripts https://playaconline.com/modding/guides/scripts/, and more in the sidebar
- Downloads (every example and kit as a ready ZIP): https://playaconline.com/modding/downloads/
- API reference: https://playaconline.com/modding/reference/
- Errors: https://playaconline.com/modding/errors/
- Testing: https://playaconline.com/modding/testing/
- Publishing to the shared mod list: https://playaconline.com/modding/publishing/
- AI assistants: https://playaconline.com/modding/ai/
- FAQ: https://playaconline.com/modding/faq/
- What changed in each api level: https://playaconline.com/modding/changelog/
- Rules for shared mods, for makers: https://playaconline.com/modding/rules/
- Mod rules (what may be shared, takedowns, appeals): https://playaconline.com/wiki/mod-rules/

## Report a problem

- A wrong or missing fact in these files or the docs, an example that does not
  work, or an error message that does not help: open an issue on this
  repository. Say which file or page, what you expected and what happened, and
  paste the exact message (its code links to https://playaconline.com/modding/errors/).
- A bug in the game itself: use the feedback button on https://playaconline.com.
- A mod that breaks the rules, or a copyright notice: https://playaconline.com/wiki/mod-rules/.

Pull requests are welcome as suggestions, but this repository is a copy: a
change is made in the game's sources and arrives here with the next sync.

## License

To be decided. Until a license file is added, ask before reusing these files
outside your own mods.
