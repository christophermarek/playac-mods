# Node.js and the playac-mod tool

`playac-mod` is a command line tool for making mods. It runs on Node.js. It
does three things:

- `check` checks a mod with the game's own rules
- `pack` packs the ZIP
- `dev` reloads your mod in the game as you save

You do not need it to make a mod, because installing a ZIP in the game runs
the same checks. It saves time once you write scripts or make more than one
mod.

At the end of this guide `playac-mod --version` answers. You have also
checked and packed a mod with it.

## 1. Open a terminal

- **macOS**: open Applications, Utilities, **Terminal**. Or press Cmd+Space
  and type Terminal.
- **Windows**: open the Start menu and type **Terminal** (Windows 11) or
  **PowerShell** (Windows 10). Command Prompt works too.
- **Linux**: open your desktop's **Terminal** app, often with Ctrl+Alt+T.

Type the lines in the grey boxes below into the terminal, one at a time. Press
Enter after each.

## 2. Do you already have Node.js?

```bash
node --version
```

If it prints a version of 18.17 or higher, such as `v22.12.0`, skip to
[step 4](#4-install-playac-mod). If it says `command not found` or `is not
recognized`, or prints an older version, install Node.js as below.

## 3. Install Node.js

Use the newest **LTS** version. Anything from 18.17 up works.

### macOS, with nvm (no administrator password)

nvm installs Node.js inside your home folder, so later installs never ask for
`sudo`.

1. Make a settings file for your shell, so nvm can add itself to it. A new Mac
   has none.

   ```bash
   touch ~/.zshrc
   ```

2. Install nvm. This is the official install line from
   https://github.com/nvm-sh/nvm.

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
   ```

   If macOS offers to install the "command line developer tools", accept and
   wait for it to finish. Then run the line again.
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

If `nvm` is not found in the new window, see
[Troubleshooting](#troubleshooting) below.

The macOS installer from https://nodejs.org works too. With it,
`npm install -g` needs `sudo`. nvm avoids that.

### Windows, the installer

1. Download the **LTS** Windows Installer (`.msi`) from
   https://nodejs.org/en/download and run it. Keep the defaults. You do not
   need the "Tools for Native Modules" box.

   Or run this in a terminal: `winget install OpenJS.NodeJS.LTS`
2. **Close every terminal window and open a new one**, so it sees the new
   PATH.

**Check it worked:**

```powershell
node --version      # prints a version, 18.17 or higher
npm --version       # prints a version number
```

PowerShell may say **"running scripts is disabled on this system"** when you
run `npm` or `npx`. Use **Command Prompt** instead. Or run this once, which
allows scripts you installed yourself:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Linux, with nvm

Your distribution's own `nodejs` package is often too old. nvm gets the
current one, in your home folder, with no `sudo`.

1. You need `curl`. Most desktops have it. If `curl --version` fails, install
   it with `sudo apt install curl` on Debian and Ubuntu, or
   `sudo dnf install curl` on Fedora.
2. Install nvm:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
   ```

3. **Close the terminal and open a new one.**
4. Run `nvm install --lts`.

**Check it worked:** run the same three lines as for macOS above.

## 4. Install playac-mod

```bash
npm install -g https://github.com/Play-AC-Online/playac-mods/releases/download/cli-v1.0.0/playac-mod-1.0.0.tgz
```

This installs release 1.0.0 of the tool from its GitHub release in this repository. `npm` comes with Node.js.

The SHA-256 of that file is `2bd6d10f0977c771e45399cc193ecd027eaa6bdb26a66a2e8038be867695c2a6`. To check it yourself, download
the file, compare, and install the file you checked:

```bash
curl -fLO https://github.com/Play-AC-Online/playac-mods/releases/download/cli-v1.0.0/playac-mod-1.0.0.tgz
shasum -a 256 playac-mod-1.0.0.tgz                  # macOS, Linux
certutil -hashfile playac-mod-1.0.0.tgz SHA256      # Windows
npm install -g ./playac-mod-1.0.0.tgz
```

**Install it only from that address.** A package named `playac-mod` on the npm
registry is not the game's. Do not install the tool by its name alone.

**Check it worked:**

```bash
playac-mod --version
```

It prints a line like
`playac-mod 1.0.0, build 1a2b3c4d5e6f, API level 1`. That is the
tool's version, its build and the mod API level it checks.

Each release's changes are at
https://playaconline.com/modding/cli/#changelog.

## 5. Check your first mod with the tool

Start from a starter kit in [`templates/`](../templates/) or an example
repository (the [README](../README.md) lists them). Copy its folder and go
into it in the terminal:

```bash
cd lines-kit
```

**Check it and pack it:**

```bash
playac-mod check    # every rule the game checks
playac-mod pack     # the ZIP to install or share
```

`check` ends with `ok   <id> <version>, <n> files`. `pack` prints
`packed ../<id>-<version>.zip`. The ZIP is written **next to** the folder,
never inside it.

**Try it in the game.** There are two ways:

- Install that ZIP with **Settings, Mods, Install from a file, Choose a file**,
  then **Restart now**.
- Faster while you work: run `playac-mod dev` and connect the game to it, as
  [The game](game.md#with-playac-mod-connect-to-playac-mod-dev) shows. Leave
  `dev` running while you edit. Ctrl+C stops it.

  ```bash
  playac-mod dev
  ```

**Editor types.** The game's Lua types are [`api/playac.lua`](../api/playac.lua)
and the JSON schemas are in [`api/`](../api/). [Set up your editor](editor.md)
to use them.

**Share it** on the website: [Publishing](publishing.md).

## What the commands do

| Command | What it does |
|---|---|
| `check` | Runs every rule the game checks. Gives each problem with its file, and the line where there is one. Takes a folder or a ZIP. |
| `pack` | Makes the ZIP, the same bytes every time, next to the folder. |
| `dev` | Serves the folder to the game's developer mode. In the game, press **Connect** to reach it ([The game](game.md#4-load-a-mod-you-are-making)). |
| `help` | Lists the commands. `playac-mod <command> --help` shows one command's options. |

Each command in full: https://playaconline.com/modding/cli/

## Troubleshooting

**`nvm: command not found` after installing it (macOS, Linux).**

1. Open a new terminal window.
2. If it is still missing on macOS, run `touch ~/.zshrc` and run the nvm
   install line again.
3. If it is still missing on Linux, check that `~/.bashrc` ends with the lines
   nvm added (`export NVM_DIR=...`).

The nvm page lists more causes:
https://github.com/nvm-sh/nvm#troubleshooting-on-macos

**`playac-mod: command not found` (or "not recognized") after installing
it.** Open a new terminal. Then run `npm prefix -g`, which shows where global
tools go. On macOS and Linux its `bin` folder must be on your PATH. On Windows
the folder itself must be. With nvm it always is, once nvm is loaded.

**`EACCES: permission denied` on `npm install -g` (macOS, Linux).** Node.js
was installed for the whole computer, so global installs need administrator
rights. The clean fix is to install Node.js with nvm as above, then run the
install line again. Putting `sudo` in front also works, but every later update
needs it too.

**`npm error 404` or `ENOTFOUND` on the install line.** Check your internet
connection. Check that you copied the whole address.

**`npm error 404 Not Found - GET https://registry.npmjs.org/playac-mod`, or a
question `Need to install the following packages`.** Something asked npm for
the tool by its name. The game's tool is not there. Answer **n** if it asks,
then install the tool with the line in step 4.

**Node.js older than 18.17.** The tool says so and stops. Run
`nvm install --lts` or use the installer, then open a new terminal.

More: [Troubleshooting](troubleshooting.md).
