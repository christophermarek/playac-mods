# Node.js and the playac-mod tool

`playac-mod` is a command line tool that makes a new mod folder, checks it with
the game's own rules, packs the ZIP, reloads your mod in the game as you save,
and publishes it. It runs on Node.js.

You do not need it to make a mod: installing a ZIP in the game runs the same
checks. It saves a lot of time once you write scripts or make more than one mod.

By the end of this guide `playac-mod --version` answers, and you have made,
checked and packed a mod with it.

## 1. Open a terminal

- **macOS**: Applications, Utilities, **Terminal** (or press Cmd+Space and type
  Terminal).
- **Windows**: Start menu, type **Terminal** (Windows 11) or **PowerShell**
  (Windows 10). Command Prompt works too.
- **Linux**: your desktop's **Terminal** app (often Ctrl+Alt+T).

Lines in grey boxes below are typed into it, one at a time, each followed by
Enter.

## 2. Do you already have Node.js?

```bash
node --version
```

If it prints a version of 18.17 or higher (for example `v22.12.0`), skip to
[step 4](#4-install-playac-mod). If it says `command not found`, `is not
recognized`, or prints an older version, install it as below.

## 3. Install Node.js

Use the newest **LTS** version. Anything from 18.17 up works.

### macOS: with nvm (no administrator password)

nvm installs Node.js inside your home folder, so later installs never ask for
`sudo`.

1. Make sure your shell has a settings file for nvm to add itself to (a new Mac
   has none):

   ```bash
   touch ~/.zshrc
   ```

2. Install nvm (the official install line from https://github.com/nvm-sh/nvm):

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
   ```

   If macOS offers to install the "command line developer tools", accept, wait
   for it to finish, and run the line again.
3. **Close the terminal window and open a new one.**
4. Install Node.js:

   ```bash
   nvm install --lts
   ```

**Check it worked:**

```bash
command -v nvm      # prints: nvm
node --version      # prints a version, 18.17 or higher
npm --version       # prints a version number
```

If `nvm` is not found in the new window, see [Troubleshooting](#troubleshooting)
below.

Prefer an installer? The macOS installer from https://nodejs.org works too, but
then `npm install -g` needs `sudo`; nvm avoids that.

### Windows: the installer

1. Download the **LTS** Windows Installer (`.msi`) from
   https://nodejs.org/en/download and run it. Keep the defaults; you do not need
   the "Tools for Native Modules" box.

   Or, in a terminal: `winget install OpenJS.NodeJS.LTS`
2. **Close every terminal window and open a new one**, so it sees the new PATH.

**Check it worked:**

```powershell
node --version      # prints a version, 18.17 or higher
npm --version       # prints a version number
```

If PowerShell says **"running scripts is disabled on this system"** when you run
`npm` or `npx`, either use **Command Prompt** instead, or allow scripts you
installed yourself, once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Linux: with nvm

Your distribution's own `nodejs` package is often too old (check with
`node --version` after installing it). nvm gets the current one, in your home
folder, with no `sudo`:

1. You need `curl`. Most desktops have it; if `curl --version` fails, install it
   (`sudo apt install curl` on Debian and Ubuntu, `sudo dnf install curl` on
   Fedora).
2. Install nvm:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
   ```

3. **Close the terminal and open a new one.**
4. `nvm install --lts`

**Check it worked:** the same three lines as macOS above.

## 4. Install playac-mod

```bash
npm install -g https://playaconline.com/modding/downloads/playac-mod.tgz
```

The package is not on the npm registry yet, so it installs from the site with this
line. `npm` comes with Node.js.

**Check it worked:**

```bash
playac-mod --version
npx playac-mod --version
```

Both print the same thing, like `0.1.0 (mod API 1..2, rules from ...)`: the
tool's version and the mod api levels it checks. The docs write commands as
`npx playac-mod ...`; plain `playac-mod ...` is the same tool.

To update later, run the install line again.

## 5. Your first mod with the tool

A new terminal starts in your home folder. Make a folder for your mods there and
go into it (the same two lines on every system):

```bash
mkdir my-mods
cd my-mods
```

Make a mod. The part before the dot is your author name: lower case letters,
digits and dashes.

```bash
npx playac-mod new yourname.first-lines --kind lines
cd yourname.first-lines
```

It prints `made yourname.first-lines: a lines mod, yourname.first-lines`. The
kinds are `texture`, `lines`, `shop` and `script`.

**Check it, pack it:**

```bash
npx playac-mod check    # every rule the game checks
npx playac-mod pack     # the ZIP to install or share
```

`check` ends with `ok   yourname.first-lines 0.1.0, client, ...`. `pack` prints
`packed ../yourname.first-lines-0.1.0.zip`: the ZIP is written **next to** the
folder, never inside it.

**Try it in the game:** either install that ZIP (**Settings, Mods, Install from a
file, Choose ZIP**, then **Restart now**), or, faster while you work:

```bash
npx playac-mod dev
```

and connect the game to it as [The game](game.md#with-playac-mod-connect-to-playac-mod-dev)
shows. Leave `dev` running while you edit; Ctrl+C stops it.

**Editor types:** `new` already wrote `.playac/` (the game's Lua types and a JSON
schema for every mod file) and VS Code settings. After a game update, refresh
them with:

```bash
npx playac-mod types
```

Next: [set up your editor](editor.md) to use them.

## What the commands do

| Command | What it does |
|---|---|
| `new <id> --kind <kind>` | A new mod folder that already passes `check` |
| `check` | Every rule the game checks, each problem with its file and line |
| `pack` | The ZIP, the same bytes every time, written next to the folder |
| `dev` | Serves the folder to the game's developer mode |
| `types` | Refreshes `.playac/` (Lua types, JSON schemas) |
| `publish` | Signs in with a code and sends the mod for review ([Publishing](publishing.md)) |
| `status`, `yank` | Your uploaded versions; take one out of the list |
| `help` | All of the above, with every option |

Each in full: https://playaconline.com/modding/testing/#cli

## Troubleshooting

**`nvm: command not found` after installing it (macOS, Linux).** Open a new
terminal window first. Still missing? On macOS, run `touch ~/.zshrc` and run the
nvm install line again. On Linux, check `~/.bashrc` ends with the lines nvm added
(`export NVM_DIR=...`). The nvm page lists more causes:
https://github.com/nvm-sh/nvm#troubleshooting-on-macos

**`playac-mod: command not found` (or "not recognized") after installing it.**
Open a new terminal. Then `npm prefix -g` shows where global tools go: its `bin`
folder (macOS, Linux) or the folder itself (Windows) must be on your PATH. With
nvm it always is, once nvm is loaded.

**`EACCES: permission denied` on `npm install -g` (macOS, Linux).** Node.js was
installed for the whole computer, so global installs need administrator rights.
The clean fix is to install Node.js with nvm as above (then run the install line
again). Putting `sudo` in front also works, but every later update needs it too.

**`npm error 404` or `ENOTFOUND` on the install line.** Check your internet
connection and that you copied the whole address.

**`npx playac-mod` says `npm error 404 Not Found - GET https://registry.npmjs.org/playac-mod`.**
The tool is not installed (step 4), so npx looked for it on the npm registry,
where it is not published yet. Run the install line, then try again.

**Node.js older than 18.17.** The tool says so and stops. `nvm install --lts`
(or the installer) and open a new terminal.

More: [Troubleshooting](troubleshooting.md).
