# Troubleshooting

These are the most common problems in setting up and testing, with the fix for
each.

Every message the game, the site or `playac-mod` gives a mod has a **code**.
The errors catalogue explains each code and gives its fix:

- Online: https://playaconline.com/modding/errors/. Add `#<code>` to go to one
  code, for example `#zip-no-manifest`.
- In this repository: `errors/errors.md`. Search it for a phrase from your
  message.

`playac-mod check` prints the code's link under each problem. In the Mods tab,
**What this means and how to fix it** opens the same page.

## Setting up

| Problem | Fix |
|---|---|
| `node: command not found`, or "not recognized" | Install Node.js with [Node.js and playac-mod](node-and-cli.md#3-install-nodejs). Then open a **new** terminal. |
| `nvm: command not found` right after installing nvm | Open a new terminal. On macOS, run `touch ~/.zshrc`, run the nvm install line again and open a new terminal. |
| `playac-mod: command not found` | Run the install line in [Node.js and playac-mod](node-and-cli.md#4-install-playac-mod). Then open a new terminal. |
| `npm error 404 Not Found - GET https://registry.npmjs.org/playac-mod` | Something asked npm for the tool by its name. The game's tool is not there. Install it with the line in [Node.js and playac-mod](node-and-cli.md#4-install-playac-mod). |
| `EACCES: permission denied` on `npm install -g` | Node.js was installed for the whole computer. Install it with nvm instead, or put `sudo` in front. |
| "running scripts is disabled on this system" (Windows PowerShell) | Use Command Prompt, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| `playac-mod needs Node.js ... or newer` | Your Node.js is too old. Run `nvm install --lts`, or use the LTS installer from nodejs.org. |
| VS Code underlines nothing in `mod.json` | Open the mod's **folder** with File, Open Folder. It is the one with `.vscode/` and `mod.json` in it. See [Editor](editor.md). |
| `on`, `log`, `message` underlined as undefined in Lua | `.playac/playac.lua` is missing. Copy `api/playac.lua` there. See [Editor](editor.md#4-lua-scripts-the-lua-extension-and-the-games-types). |

## Installing a ZIP

| You see | Code | Fix |
|---|---|---|
| There is no mod.json at the top of the ZIP | `zip-no-manifest` | Zip the files inside your mod folder, or the folder itself, not the folder above it. `mod.json` must be at the top or in the one folder. |
| this is not a ZIP the game can open | `zip-unreadable` | Zip it again with the system's own tool, or with `playac-mod pack`. On Windows, right-click, Send to, Compressed (zipped) folder. On macOS, right-click, Compress. |
| mod.json is not valid JSON | `json-invalid` | Open it in VS Code, which underlines the mistake. JSON has no comments and no trailing commas, and uses straight double quotes. |
| "id" must look like author.mod-name | `manifest-id` | Use lower case letters, digits and dashes, with one dot: `yourname.tea-stall`. |
| only .json .lua .dds .png .txt .md files can be in a mod | `file-type` | Take the file out. It may be a `.psd`, `.js` or `.zip`. |
| "content.messages" names messages/en.json, which is not in the mod | `content-missing` | Check the path's spelling and case against your files. |
| "content.shops" changes what visitors see, so "scope" must be "world" | `shops-need-world` | Set `"scope": "world"` in `mod.json`. |
| needs a newer game / made for an older game | `api-newer`, `api-older` | Reload the page for the newest game. Set `"api"` in `mod.json` to the level the game reads. The changelog says which. |

## Textures

| You see | Code | Fix |
|---|---|---|
| ... is an uncompressed DDS of 24 bits a pixel | `texture-format` | Save 32-bit RGBA, or BC1 or BC3. In GIMP choose Format RGBA8. In ImageMagick add `-alpha on`. See [Texture tools](textures.md#png-or-dds). |
| ... stores 7 mip levels | `texture-mipmaps` | Save with no mipmaps. GIMP: Mipmaps, No mipmaps. Paint.NET: untick Generate Mip Maps. ImageMagick: `-define dds:mipmaps=0`. texconv: `-m 1`. |
| ... is an unchanged copy of a texture from the game | `texture-copied` | Paint over it, or delete the files you did not change. |
| My texture does not show, and there is no message | | The `tex1_...` part must match exactly, so use Save all or Copy name. Seasons and hours change palettes, so use the `$` name. See [Texture tools](textures.md#if-your-texture-does-not-show). |

## Scripts

| You see | Code | Fix |
|---|---|---|
| main.lua:4: unfinished string near '"hello' | `script-syntax` | Open the file at that line. Look for a missing `end`, `then` or `do`, or an unclosed string. |
| on(): 'villager_talked' is not in this mod's "scripts.events" list in mod.json | `script-on-event` | Add the event to `scripts.events` in `mod.json`, or fix its spelling. |
| attempt to index a nil value | `script-error` | The Mod log shows the file and line with a traceback. Use `log()` on your values to see which is nil. |
| script took too long | `script-budget` | Do less in each event. Avoid long loops. Keep results in locals or the store. |

## Developer mode

| You see | Code | Fix |
|---|---|---|
| The dev server could not be reached at http://127.0.0.1:2604 | `dev-server-unreachable` | Check that `playac-mod dev` is still running in your mod folder. Use the address it printed. The port can be 2605 or higher when 2604 is busy. Safari cannot connect, so use Chrome, Edge or Firefox, or choose the folder. |
| the dev server refused this site: start it with --origin | `dev-server-origin` | The game page is not at playaconline.com, its dev site or `http://localhost:5173`. Stop `playac-mod dev` and start it with `--origin` and the page's address. The terminal prints that line. |
| Not loaded: the folder fails playac-mod check | `dev-check-fails` | Fix what it names. The terminal running `dev` says the same. The mod reloads by itself once it is fixed. |
| mod.json changed: restart the game to load it | `dev-restart-needed` | Save your town, then press **Restart now** in the Developer section. |
| No **Developer** section in the Mods tab | | Open the game with `?moddev=1` at the end of the address. See [The game](game.md#3-developer-mode). |
| The game will not start after loading a mod | | Choose **Start without mods** in the Mods tab, or open `https://playaconline.com/play/?nomods=1`. |

## Sharing

The upload problems and their codes are in
[Publishing](publishing.md#when-an-upload-is-refused).

## Still stuck

- Read the FAQ: https://playaconline.com/modding/faq/
- For a wrong fact in these guides or the docs, or a message that did not
  help, open an issue on this repository. Give the guide, the step, what you
  expected and the exact message.
- For a bug in the game, use the feedback button on https://playaconline.com.
