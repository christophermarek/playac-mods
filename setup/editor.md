# Your editor: schemas and Lua types

Mod files are plain text: JSON for `mod.json`, lines, shops, letters and events,
and Lua for scripts. Any text editor works. A good one tells you about a mistake
as you type, instead of when the game refuses the mod.

This guide sets up **VS Code** (free, on macOS, Windows and Linux) so that:

- every mod JSON file is checked against the game's own schema, with hover help
  and autocomplete for each key;
- Lua scripts get autocomplete, hover docs and warnings for every function and
  event of the game's script API.

Other editors are at the end.

## 1. Install VS Code

- **macOS**: download from https://code.visualstudio.com/download, unzip, and
  drag **Visual Studio Code** into Applications.
- **Windows**: download the **User Installer** from
  https://code.visualstudio.com/download and run it. Or:
  `winget install Microsoft.VisualStudioCode`
- **Linux**: the `.deb` (Debian, Ubuntu) or `.rpm` (Fedora, openSUSE) from
  https://code.visualstudio.com/download, then
  `sudo apt install ./code_*.deb` or `sudo dnf install ./code-*.rpm`. Or
  `sudo snap install code --classic`.

VSCodium (https://vscodium.com) is the same editor without Microsoft's
telemetry; everything below works in it too.

**Check it worked:** VS Code opens. Optional: in VS Code, open the Command
Palette (Cmd+Shift+P on macOS, Ctrl+Shift+P elsewhere) and run **Shell Command:
Install 'code' command in PATH** (macOS only; Windows and Linux do it for you), so
`code .` in a terminal opens the folder you are in.

## 2. Open your mod as a folder

Use **File, Open Folder...** and pick the folder that has `mod.json` in it, not a
single file and not the folder above it. VS Code reads its settings from the
`.vscode/` folder inside it, and those settings are what wire up the checks.

If VS Code asks **"Do you trust the authors of the files in this folder?"**,
choose **Yes, I trust the authors** for your own mod. In Restricted Mode the Lua
extension does not run.

Where does the `.vscode/` folder come from?

- A mod made with `npx playac-mod new` has one already
  ([Node.js and playac-mod](node-and-cli.md)).
- Each starter kit from https://playaconline.com/modding/downloads/ has one too.
- Starting from anything else, copy one from a kit, or make it as in
  [step 5](#5-the-settings-by-hand).

On macOS and Linux, folders starting with a dot are hidden in Finder and file
managers (Cmd+Shift+. shows them in Finder). VS Code's file list shows them.

## 3. JSON files: nothing to install

VS Code checks JSON against a schema on its own. With the folder open:

1. Open `mod.json`.
2. Hover over a key such as `"scope"`: a description appears.
3. Change `"scope"` to `"nope"`: it is underlined, and the **Problems** panel
   (View, Problems) says what the allowed values are. Change it back.

**Check it worked:** step 3 underlines the value. If nothing is underlined:

- the folder you opened is not the one with `.vscode/` in it (see step 2); or
- the settings point at the schemas online (the kits do) and VS Code could not
  download them: check your connection, and that the setting
  `json.schemaDownload.enable` is on (it is by default).

Which schema checks which file is decided by file name: `mod.json`,
`shops.json`, `items.json`, `letters.json`, `events.json`, `talk.json`, and any
`.json` in a `messages/` folder. Name your files that way and they are checked.

A `mod.json` or `shops.json` can also name its own schema, which works in any
editor that reads `$schema` (the game ignores the key):

```json
{ "$schema": "https://playaconline.com/schemas/mod.schema.json" }
```

## 4. Lua scripts: the Lua extension and the game's types

1. In VS Code, open the **Extensions** view (the squares icon on the left, or
   Cmd+Shift+X / Ctrl+Shift+X).
2. Search for **Lua** and install the one by **sumneko** (its id is
   `sumneko.lua`). A mod folder recommends it, so VS Code may offer it in a pop-up
   at the bottom right: **Install** there does the same.
3. The extension reads the game's API from `.playac/playac.lua` in your mod
   folder. Put it there:
   - with the tool: run `npx playac-mod types` in the mod folder (a mod made with
     `playac-mod new` has it already); or
   - by hand: download https://playaconline.com/schemas/playac.lua and save it as
     `.playac/playac.lua` inside your mod folder (make the `.playac` folder
     first).
4. Reload the window (Command Palette, **Developer: Reload Window**).

**Check it worked:** open `main.lua` and type `cmd.` on a new line: a list of
the game's commands appears. Hover over `on` in `on("talk", ...)`: it shows the
event's description. A misspelt event name such as `on("tlak", ...)` is
underlined.

If `on`, `message` and `log` are underlined as undefined globals, the extension
did not find `.playac/playac.lua`: check the file is there and the folder you
opened is the mod folder.

The `.playac/` folder is hidden, so the game and `playac-mod pack` never put it
in your mod's ZIP. After a game update, refresh it the same way (`npx playac-mod
types`, or download it again).

## 5. The settings by hand

If your mod folder has no `.vscode/`, make a folder `.vscode` in it and a file
`.vscode/settings.json` with this in it:

```json
{
  "json.schemas": [
    { "fileMatch": ["/mod.json"], "url": "https://playaconline.com/schemas/mod.schema.json" },
    { "fileMatch": ["/shops.json"], "url": "https://playaconline.com/schemas/shops.schema.json" },
    { "fileMatch": ["/messages/*.json"], "url": "https://playaconline.com/schemas/messages.schema.json" },
    { "fileMatch": ["/items.json"], "url": "https://playaconline.com/schemas/mod-items.schema.json" },
    { "fileMatch": ["/letters.json"], "url": "https://playaconline.com/schemas/letters.schema.json" },
    { "fileMatch": ["/events.json"], "url": "https://playaconline.com/schemas/events.schema.json" },
    { "fileMatch": ["/talk.json"], "url": "https://playaconline.com/schemas/talk.schema.json" }
  ],
  "Lua.runtime.version": "Lua 5.4",
  "Lua.workspace.library": [".playac/playac.lua"],
  "Lua.runtime.builtin": { "io": "disable", "os": "disable", "debug": "disable", "package": "disable" },
  "Lua.diagnostics.disable": ["lowercase-global"]
}
```

What each part does:

- `json.schemas`: which schema checks which file. A mod made with `playac-mod new`
  points at copies in `.playac/schemas/` instead, so it also works offline.
- `Lua.runtime.version`: the game runs Lua 5.4.
- `Lua.workspace.library`: the game's API, for autocomplete and hover docs.
- `Lua.runtime.builtin`: `io`, `os`, `debug` and `package` do not exist in a mod's
  script, so the editor stops offering them.
- `Lua.diagnostics.disable`: lets you name globals in lower case, as the examples
  do.

Optional, and nice to have: `"editor.formatOnSave": true` and
`"files.insertFinalNewline": true`. For a lines mod, `"editor.wordWrap": "on"`
makes long lines readable.

## Other editors

- **JSON schemas**: most editors with a JSON language server read `"$schema"` in
  the file (Zed, Neovim with `jsonls`, JetBrains IDEs, Sublime Text with LSP-json).
  For the files that cannot name their own (messages, items, letters, events,
  talk), map them by file name in that editor's JSON schema settings, using the
  URLs above.
- **Lua**: the same language server (lua-language-server) is available for
  Neovim, Zed, Sublime Text and JetBrains IDEs (EmmyLua). Point its
  `workspace.library` at `.playac/playac.lua`, the same as above. A
  `.luarc.json` file in the mod folder does this for any editor that uses it:

  ```json
  {
    "runtime.version": "Lua 5.4",
    "workspace.library": [".playac/playac.lua"],
    "runtime.builtin": { "io": "disable", "os": "disable", "debug": "disable", "package": "disable" },
    "diagnostics.disable": ["lowercase-global"]
  }
  ```

- **No setup at all**: any plain text editor (TextEdit in plain text mode,
  Notepad, gedit) is fine for lines and shops. Then let the game or
  `npx playac-mod check` find the mistakes.

## More

- Every file format: https://playaconline.com/modding/reference/files/
- Every Lua global, event and command: https://playaconline.com/modding/reference/lua/
- The same schemas and types are in this repository, in `api/`.
