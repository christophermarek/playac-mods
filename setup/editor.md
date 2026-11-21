# Your editor, schemas and Lua types

Mod files are plain text. `mod.json`, lines, shops, letters and calendar days
are JSON. Scripts are Lua. Any text editor works. A good one tells you about a
mistake as you type, before the game refuses the mod.

This guide sets up **VS Code**, which is free and runs on macOS, Windows and
Linux. After it:

- Every mod JSON file is checked against the game's own schema, with hover
  help and autocomplete for each key.
- Lua scripts get autocomplete, hover docs and warnings for every function and
  event of the game's script API.

Other editors are at the end.

## 1. Install VS Code

- **macOS**: download it from https://code.visualstudio.com/download and
  unzip it. Drag **Visual Studio Code** into Applications.
- **Windows**: download the **User Installer** from
  https://code.visualstudio.com/download and run it. Or run
  `winget install Microsoft.VisualStudioCode`.
- **Linux**: download the `.deb` (Debian, Ubuntu) or `.rpm` (Fedora, openSUSE)
  from https://code.visualstudio.com/download. Then run
  `sudo apt install ./code_*.deb` or `sudo dnf install ./code-*.rpm`. Or run
  `sudo snap install code --classic`.

VSCodium (https://vscodium.com) is the same editor without Microsoft's
telemetry. Everything below works in it too.

**Check it worked:** VS Code opens.

Optional, on macOS only: open the Command Palette with Cmd+Shift+P and run
**Shell Command: Install 'code' command in PATH**. Then `code .` in a terminal
opens the folder you are in. Windows and Linux do this for you.

## 2. Open your mod as a folder

1. Choose **File, Open Folder...**.
2. Pick the folder that has `mod.json` in it. Do not pick a single file or the
   folder above it.
3. If VS Code asks **"Do you trust the authors of the files in this
   folder?"**, choose **Yes, I trust the authors** for your own mod. In
   Restricted Mode the Lua extension does not run.

VS Code reads its settings from the `.vscode/` folder inside the mod folder.
Those settings set up the checks. The `.vscode/` folder comes from one of
these:

- Each starter kit has one. The kits are the `templates/` folders, and
  as ZIPs in the newest "Starter kits and AI pack" release: https://github.com/Play-AC-Online/playac-mods/releases.
  A kit ZIP also has the game's Lua types in `.playac/` (step 4).
- For any other mod, copy one from a kit or make it as in
  [step 5](#5-the-settings-by-hand).

On macOS and Linux, folders starting with a dot are hidden in Finder and file
managers. Cmd+Shift+. shows them in Finder. VS Code's file list always shows
them.

## 3. JSON files, nothing to install

VS Code checks JSON against a schema on its own. With the folder open:

1. Open `mod.json`.
2. Hover over a key such as `"scope"`. A description appears.
3. Change `"scope"` to `"nope"`. It is underlined, and the **Problems** panel
   (View, Problems) lists the allowed values.
4. Change it back.

**Check it worked:** step 3 underlines the value. If nothing is underlined,
check two things:

- The folder you opened must be the one with `.vscode/` in it (see step 2).
- The kits' settings point at the schemas online, so VS Code must be able to
  download them. Check your connection. Check that the setting
  `json.schemaDownload.enable` is on, as it is by default.

The file name decides which schema checks a file. The names are `mod.json`,
`shops.json`, `items.json`, `letters.json`, `calendar.json`, `talk.json`,
and any `.json` in a `messages/` folder. Name your files that way and they
are checked.

A `mod.json` or `shops.json` can also name its own schema. This works in any
editor that reads `$schema`. The game ignores the key.

```json
{ "$schema": "https://playaconline.com/schemas/mod.schema.json" }
```

## 4. Lua scripts, the Lua extension and the game's types

1. In VS Code, open the **Extensions** view. It is the squares icon on the
   left, or Cmd+Shift+X on macOS and Ctrl+Shift+X elsewhere.
2. Search for **Lua** and install the one by **sumneko**. Its id is
   `sumneko.lua`. A mod folder recommends it, so VS Code may offer it in a
   pop-up at the bottom right. **Install** there does the same.
3. The extension reads the game's API from `.playac/playac.lua` in your mod
   folder. A starter kit ZIP from the release already has it. For any other
   mod folder, or a kit copied from `templates/`, make a `.playac` folder
   inside your mod folder. Copy [`api/playac.lua`](../api/playac.lua) from
   this repository there, or download
   https://playaconline.com/schemas/playac.lua, and save it as
   `.playac/playac.lua`.
4. Reload the window with **Developer: Reload Window** from the Command
   Palette.

**Check it worked:**

- Open `main.lua` and type `cmd.` on a new line. A list of the game's commands
  appears.
- Hover over `on` in `on("villager_talked", ...)`. It shows the event's
  description.
- A misspelt event name such as `on("villager_tlaked", ...)` is underlined.

If `on`, `message` and `log` are underlined as undefined globals, the
extension did not find `.playac/playac.lua`. Check that the file is there and
that the folder you opened is the mod folder.

The `.playac/` folder is hidden, so the game and `playac-mod pack` never put
it in your mod's ZIP. When the mod API gains something, copy or download the
file again.

## 5. The settings by hand

If your mod folder has no `.vscode/`, make a folder `.vscode` in it. Make a
file `.vscode/settings.json` with this in it:

```json
{
  "json.schemas": [
    { "fileMatch": ["/mod.json"], "url": "https://playaconline.com/schemas/mod.schema.json" },
    { "fileMatch": ["/shops.json"], "url": "https://playaconline.com/schemas/shops.schema.json" },
    { "fileMatch": ["/messages/*.json"], "url": "https://playaconline.com/schemas/messages.schema.json" },
    { "fileMatch": ["/items.json"], "url": "https://playaconline.com/schemas/mod-items.schema.json" },
    { "fileMatch": ["/letters.json"], "url": "https://playaconline.com/schemas/letters.schema.json" },
    { "fileMatch": ["/calendar.json"], "url": "https://playaconline.com/schemas/calendar.schema.json" },
    { "fileMatch": ["/talk.json"], "url": "https://playaconline.com/schemas/talk.schema.json" }
  ],
  "Lua.runtime.version": "Lua 5.4",
  "Lua.workspace.library": [".playac/playac.lua"],
  "Lua.runtime.builtin": { "io": "disable", "os": "disable", "debug": "disable", "package": "disable" },
  "Lua.diagnostics.disable": ["lowercase-global"]
}
```

What each part does:

- `json.schemas`: which schema checks which file. To work offline, copy the
  schemas from [`api/`](../api/) into your mod folder and point the `url`s at
  those copies.
- `Lua.runtime.version`: the game runs Lua 5.4.
- `Lua.workspace.library`: the game's API, for autocomplete and hover docs.
- `Lua.runtime.builtin`: `io`, `os`, `debug` and `package` do not exist in a
  mod's script, so the editor stops offering them.
- `Lua.diagnostics.disable`: lets you name globals in lower case, as the
  examples do.

Optional settings:

- `"editor.formatOnSave": true` and `"files.insertFinalNewline": true` keep
  files tidy.
- `"editor.wordWrap": "on"` makes long lines readable in a lines mod.

## Other editors

- **JSON schemas**: most editors with a JSON language server read `"$schema"`
  in the file. Examples are Zed, Neovim with `jsonls`, JetBrains IDEs and
  Sublime Text with LSP-json. Messages, items, letters, calendar and talk
  files cannot name their own schema. Map them by file name in the editor's
  JSON schema settings, using the URLs above.
- **Lua**: the same language server, lua-language-server, is available for
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

- **No setup at all**: any plain text editor is fine for lines and shops, such
  as TextEdit in plain text mode, Notepad or gedit. Then let the game or
  `playac-mod check` find the mistakes.

## More

- Every file format: https://playaconline.com/modding/reference/files/
- Every Lua global, event and command: https://playaconline.com/modding/reference/lua/
- The same schemas and types are in this repository, in `api/`.
