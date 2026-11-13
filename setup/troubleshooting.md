# Troubleshooting

The problems people meet most while setting up and testing, and the fix for each.
Every message the game, the site or `playac-mod` gives a mod has a **code**; the
catalogue explains each one with its fix:

- online: https://playaconline.com/modding/errors/ (add `#<code>`, for example
  `#zip-no-manifest`)
- in this repository: `errors/errors.md` (search it for a phrase from your
  message)

`playac-mod check` prints the code's link under each problem, and the Mods tab's
**What this means and how to fix it** opens the same page.

## Setting up

| Problem | Fix |
|---|---|
| `node: command not found`, or "not recognized" | Install Node.js: [Node.js and playac-mod](node-and-cli.md#3-install-nodejs). Then open a **new** terminal. |
| `nvm: command not found` right after installing nvm | Open a new terminal. On macOS: `touch ~/.zshrc`, run the nvm install line again, open a new terminal. |
| `playac-mod: command not found` | Run the install line in [Node.js and playac-mod](node-and-cli.md#4-install-playac-mod), then open a new terminal. |
| `npm error 404 Not Found - GET https://registry.npmjs.org/playac-mod` | `npx` did not find the tool installed and looked on the npm registry. Install it from the site first. |
| `EACCES: permission denied` on `npm install -g` | Node.js was installed for the whole computer. Install it with nvm instead, or put `sudo` in front. |
| "running scripts is disabled on this system" (Windows PowerShell) | Use Command Prompt, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| `playac-mod needs Node.js ... or newer` | Your Node.js is too old: `nvm install --lts`, or the LTS installer from nodejs.org. |
| VS Code underlines nothing in `mod.json` | Open the mod's **folder** (File, Open Folder), the one with `.vscode/` and `mod.json` in it. [Editor](editor.md). |
| `on`, `log`, `message` underlined as undefined in Lua | `.playac/playac.lua` is missing: `npx playac-mod types`. [Editor](editor.md#4-lua-scripts-the-lua-extension-and-the-games-types). |

## Installing a ZIP

| You see | Code | Fix |
|---|---|---|
| There is no mod.json at the top of the ZIP | `zip-no-manifest` | Zip the files inside your mod folder, or the folder itself, not the folder above it. `mod.json` must be at the top or in the one folder. |
| this is not a ZIP the game can open | `zip-unreadable` | Zip it again with the system's own tool (Windows: right-click, Send to, Compressed (zipped) folder; macOS: right-click, Compress), or `npx playac-mod pack`. |
| mod.json is not valid JSON | `json-invalid` | Open it in VS Code, which underlines the mistake. JSON has no comments and no trailing commas, and uses straight double quotes. |
| "id" must look like author.mod-name | `manifest-id` | Lower case letters, digits and dashes, one dot: `yourname.tea-house`. |
| only .json .lua .dds .png .txt .md files can be in a mod | `file-type` | Take the file out (a `.psd`, `.js`, `.zip`...). |
| "content.messages" names messages/en.json, which is not in the mod | `content-missing` | Check the path's spelling and case against your files. |
| "content.shops" changes what visitors see, so "scope" must be "world" | `shops-need-world` | Set `"scope": "world"` in `mod.json`. |
| needs a newer game / made for an older game | `api-newer`, `api-older` | Reload the page for the newest game; set `"api"` in `mod.json` to the current level (the changelog says which). |

## Textures

| You see | Code | Fix |
|---|---|---|
| ... is an uncompressed DDS of 24 bits a pixel | `texture-format` | Save 32-bit RGBA (GIMP: Format RGBA8; ImageMagick: add `-alpha on`), or BC1/BC3. [Texture tools](textures.md#4-save-it-png-or-dds). |
| ... stores 7 mip levels | `texture-mipmaps` | Save with no mipmaps (GIMP: Mipmaps: No mipmaps; Paint.NET: untick Generate Mip Maps; ImageMagick: `-define dds:mipmaps=0`; texconv: `-m 1`). |
| ... is an unchanged copy of a texture from the game | `texture-copied` | Paint over it, or delete the files you did not change. |
| My texture does not show, and no message | | The name must match exactly; seasons and hours change palettes, so use the `$` name. [Texture tools](textures.md#if-your-texture-does-not-show). |

## Scripts

| You see | Code | Fix |
|---|---|---|
| main.lua:4: unfinished string near '"hello' | `script-syntax` | Open the file at that line: a missing `end`, `then` or `do`, or an unclosed string. |
| on(): 'talk' is not in this mod's "hooks" list | `script-on-event` | Add the event to `scripts.hooks` in `mod.json`, or fix its spelling. |
| attempt to index a nil value | `script-error` | The Mod log shows the file and line with a traceback. `log()` values to see what is nil. |
| script took too long | `script-budget` | Do less per event: no long loops; keep results in locals or the store. |

## Developer mode

| You see | Code | Fix |
|---|---|---|
| The dev server could not be reached at http://127.0.0.1:2604 | `dev-server-unreachable` | Is `npx playac-mod dev` still running in your mod folder? Use the address it printed (the port can be 2605 or higher when 2604 is busy). Safari cannot connect: use Chrome, Edge or Firefox, or choose the folder. |
| Not loaded: the folder fails playac-mod check | `dev-check-fails` | Fix what it names; the terminal running `dev` says the same. It reloads by itself once fixed. |
| mod.json changed: restart the game to load it | `dev-restart-needed` | Save your town, then **Restart now** in the Developer section. |
| No **Developer** section in the Mods tab | | Open the game with `?moddev=1` at the end of the address. [The game](game.md#3-developer-mode). |
| The game will not start after loading a mod | | **Start without mods** in the Mods tab, or open `https://playaconline.com/play/?nomods=1`. |

## Sharing

The upload problems and their codes: [Publishing](publishing.md#when-an-upload-is-refused).

## Still stuck

- The FAQ: https://playaconline.com/modding/faq/
- A wrong fact in these guides or the docs, or a message that did not help: open
  an issue on this repository, with the guide, the step, what you expected and
  the exact message.
- A bug in the game: the feedback button on https://playaconline.com
