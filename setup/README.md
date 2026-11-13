# Setting up to make mods

These guides take you from a computer with nothing installed to a mod running in
the game. Each one stands on its own: read the ones your kind of mod needs and
skip the rest. Every step says how to check it worked, for macOS, Windows and
Linux.

The full modding docs are at https://playaconline.com/modding/. These guides
only cover getting your computer ready.

## What you need, by the kind of mod you want to make

| You want to make | You need | Guides |
|---|---|---|
| **Textures**: your own pictures for grass, paths, trees, clothes | A browser, a paint program. No command line at all. | [The game](game.md), [Texture tools](textures.md) |
| **Words**: villager lines, letters, town days, a shop's name and stock | A browser and a text editor. No command line needed. | [The game](game.md), [Editor](editor.md) |
| **Scripts**: small Lua programs that react to the game | The above, plus the `playac-mod` tool is a big help. | [The game](game.md), [Node.js and playac-mod](node-and-cli.md), [Editor](editor.md) |
| **All of it, from a terminal**: libraries, versions, GitHub releases | Everything. | All of them |

Optional for anyone: [an AI assistant](ai-assistant.md), [Git and GitHub](git-github.md).
When your mod is ready to share: [Publishing](publishing.md). When something goes
wrong: [Troubleshooting](troubleshooting.md).

## The guides

1. [The game](game.md): a browser that runs it, your town, developer mode, the
   mod log. **Everyone starts here.**
2. [Node.js and the playac-mod tool](node-and-cli.md): install Node.js, install
   `playac-mod`, make, check and pack your first mod.
3. [Editor](editor.md): VS Code (or any editor) checking your JSON files as you
   type, and the Lua extension that knows the game's script API.
4. [Texture tools](textures.md): find a texture's name, paint over it, save it as
   PNG or DDS.
5. [AI assistant](ai-assistant.md): give any assistant the mod rules so it writes
   mods that install the first time.
6. [Git and GitHub](git-github.md) (optional): keep your mod in a repository and
   share releases straight from a tag.
7. [Publishing](publishing.md): an account, two-factor sign-in, and sending your
   mod for review.
8. [Troubleshooting](troubleshooting.md): the problems people meet most, and the
   error codes.

## The shortest path to a working mod (no installs)

If you only want to see a mod work before you set anything up:

1. Open https://playaconline.com/modding/downloads/ and download the **Villager
   lines kit**.
2. Load your town on https://playaconline.com/play/ (see [The game](game.md)).
3. Open **Settings, Mods, Install from a file, Choose ZIP**, pick the kit's ZIP,
   then **Restart now**.
4. Talk to a villager: they say one of the kit's lines first.

That is a mod. Everything else in these guides makes changing it faster.

## A word on what you may share

Mods you share must be your own work: no pictures, text, names or sounds from
Nintendo or any other game, film, show or brand. You can make anything you like
for yourself. The rules: https://playaconline.com/modding/rules/
