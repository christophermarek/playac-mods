# Play AC Online mods

Starter kits, the mod API and the `playac-mod` tool for
[Play AC Online](https://playaconline.com). The docs at https://playaconline.com/modding/ are the full guide.

**The docs site goes live with the game's next release. Until then the links to playaconline.com/modding/ do not work yet. Every download is here on GitHub and works now.**

The guides, the starter kits, the mod contract and the AI skill are written
here. The rest is generated from the game's sources on every release. It
matches mod API level 1.

| Folder | What it is |
|---|---|
| [`templates/`](templates/) | Starter kits. Copy one and edit it. |
| [`api/`](api/) | The API spec, JSON schemas and Lua types. |
| [`errors/`](errors/) | Every error a mod can get, with the fix. |
| [`ai/`](ai/) | Instructions for AI coding assistants. |
| [`setup/`](setup/) | Setup guides, from a clean computer. |
| [`cli/`](cli/) | The source of the `playac-mod` tool, with its [changelog](cli/CHANGELOG.md). |
| [`tools/`](tools/) | The program that draws the texture kit's pictures, and a ZIP checker. |
| [`MAKING-A-MOD.md`](MAKING-A-MOD.md) | The file formats and the script API on one page, for reading offline. |
| [`CONTRACT.md`](CONTRACT.md) | The full rule list every part of the game checks a mod against. |

## Examples

Each example is a working mod in its own repository, laid out the way your
own mod repository will be: the mod at the top, a README with pictures and a
film of it in the game, a changelog and a tag per version. Clone one to read
it, or fork it to start from it.

| Example | Kind | Repository | Mod ZIP |
|---|---|---|---|
| [Springtime Town](https://github.com/Play-AC-Online/playac-example-springtime-town) | Textures and villager lines, no code | [`playac-example-springtime-town`](https://github.com/Play-AC-Online/playac-example-springtime-town) | [example.springtime-town-1.0.0.zip](https://github.com/Play-AC-Online/playac-example-springtime-town/releases/download/v1.0.0/example.springtime-town-1.0.0.zip) |
| [After Hours](https://github.com/Play-AC-Online/playac-example-after-hours) | Nook's at night, an item with its own pictures | [`playac-example-after-hours`](https://github.com/Play-AC-Online/playac-example-after-hours) | [example.after-hours-1.0.0.zip](https://github.com/Play-AC-Online/playac-example-after-hours/releases/download/v1.0.0/example.after-hours-1.0.0.zip) |
| [Harvest Post](https://github.com/Play-AC-Online/playac-example-harvest-post) | Calendar days, letters, a script with commands and a timer | [`playac-example-harvest-post`](https://github.com/Play-AC-Online/playac-example-harvest-post) | [example.harvest-post-1.0.0.zip](https://github.com/Play-AC-Online/playac-example-harvest-post/releases/download/v1.0.0/example.harvest-post-1.0.0.zip) |

## Downloads

Every download is a file of a release of a public repository on GitHub. The
site links them and serves none of them.

- Starter kits, one ZIP each, ready to install: [playac-lines-kit.zip](https://github.com/Play-AC-Online/playac-mods/releases/download/downloads-ebd797707e44/playac-lines-kit.zip), [playac-script-kit.zip](https://github.com/Play-AC-Online/playac-mods/releases/download/downloads-ebd797707e44/playac-script-kit.zip), [playac-shop-kit.zip](https://github.com/Play-AC-Online/playac-mods/releases/download/downloads-ebd797707e44/playac-shop-kit.zip), [playac-texture-kit.zip](https://github.com/Play-AC-Online/playac-mods/releases/download/downloads-ebd797707e44/playac-texture-kit.zip). They are
  the folders in [`templates/`](templates/), zipped.
- The AI pack: [playac-mod-ai.zip](https://github.com/Play-AC-Online/playac-mods/releases/download/downloads-ebd797707e44/playac-mod-ai.zip), for
  [an AI assistant](setup/ai-assistant.md).
- Both are in the release [downloads-ebd797707e44](https://github.com/Play-AC-Online/playac-mods/releases/tag/downloads-ebd797707e44).
- The `playac-mod` tool: release 1.0.0 is
  [playac-mod-1.0.0.tgz](https://github.com/Play-AC-Online/playac-mods/releases/download/cli-v1.0.0/playac-mod-1.0.0.tgz), in the release
  [cli-v1.0.0](https://github.com/Play-AC-Online/playac-mods/releases/tag/cli-v1.0.0).
  The list of every published release is [releases.json](https://github.com/Play-AC-Online/playac-mods/releases/download/cli-releases/releases.json).
- Each example mod's ZIP is a file of the release of its tag, in its own
  repository (the table above).

## Quick start

You need Node.js 18.17 or newer, and the game running in your browser. The
game runs from your own disc file: https://playaconline.com/your-disc/

```bash
npm install -g https://github.com/Play-AC-Online/playac-mods/releases/download/cli-v1.0.0/playac-mod-1.0.0.tgz
git clone https://github.com/Play-AC-Online/playac-example-after-hours.git
cd playac-example-after-hours
playac-mod check
playac-mod pack
```

To start your own, copy an example repository or a starter kit in
[`templates/`](templates/).

That line installs release 1.0.0 from its GitHub release here. Its SHA-256 is
`02432c050fad15f1180e16202bb833c331bd3f70b20f5c56164bc837ecd3af9b`, and [the setup guide](setup/node-and-cli.md#4-install-playac-mod)
shows how to check it. Install the tool only from that address. A package
named `playac-mod` on the npm registry is not the game's.

To try a mod, open the game and go to **Settings, Mods, Install from a file**.
To see edits live, run `playac-mod dev` and leave it running. Open the game
with `?moddev=1`. Go to Settings, Mods, Load a mod you are making. Press
**Connect** beside "playac-mod dev address", then **Restart now** once. After
that, edits show as you save. [The game](setup/game.md#4-load-a-mod-you-are-making)
has each step.
`playac-mod help` lists the commands.

## Setup guides

New to this? Start with the [setup guides](setup/):
[the game](setup/game.md), [Node.js and playac-mod](setup/node-and-cli.md),
[your editor](setup/editor.md), [textures](setup/textures.md),
[an AI assistant](setup/ai-assistant.md), [Git and GitHub](setup/git-github.md),
[publishing](setup/publishing.md) and [troubleshooting](setup/troubleshooting.md).

## Links

- Start: [textures](https://playaconline.com/modding/start/artist/), [lines and letters](https://playaconline.com/modding/start/writer/), [scripts](https://playaconline.com/modding/start/scripter/), [power users](https://playaconline.com/modding/start/power-user/)
- [Reference](https://playaconline.com/modding/reference/), [the playac-mod tool](https://playaconline.com/modding/cli/), [errors](https://playaconline.com/modding/errors/), [testing](https://playaconline.com/modding/testing/), [publishing](https://playaconline.com/modding/publishing/)
- [FAQ](https://playaconline.com/modding/faq/), [changelog](https://playaconline.com/modding/changelog/), [mod rules](https://playaconline.com/wiki/mod-rules/), [playing with mods](https://playaconline.com/wiki/mods/)

## Help and problems

- A question about making a mod: ask on the game's Discord, https://discord.gg/7CrPXyX97m.
- A wrong fact, a broken example or a bug in the tool: [open an issue](https://github.com/Play-AC-Online/playac-mods/issues/new/choose) here.
- A bug in the game: the feedback button on https://playaconline.com.
- A way for a mod to do what it must not: report it privately, see [SECURITY.md](SECURITY.md).

A pull request to a guide, a starter kit, the contract or the AI skill can be
merged here. The other folders are generated, so a pull request there is read
as a suggestion. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). It covers everything in this repository that we wrote: the
starter kits, the tool, the API files and the guides. Each
example repository carries the same licence for its own files.

**A mod you make from a kit or an example is yours.** Share it
under any terms you like, with no credit or notice needed for what you
started from.

The tool carries three files from other projects, under their own notices in
[`cli/vendor/LICENSE`](cli/vendor/LICENSE).
