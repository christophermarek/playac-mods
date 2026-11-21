# The game, your town and developer mode

Every mod is tested in the game itself, so everyone starts with this guide. At
the end your town is running and developer mode is on. You also know where the
game tells you what went wrong.

Nothing here needs a terminal, except connecting `playac-mod dev` in step 4.
That part is for people who installed the tool in
[Node.js and playac-mod](node-and-cli.md).

## 1. A browser that runs the game

The game needs a current browser with WebGL 2. For making mods, use **Chrome
or Edge** on a computer with Windows, macOS or Linux. They can watch your
mod's folder and reload it as you save. Other browsers cannot.

| Browser | Plays the game | Developer mode: choose a folder | Developer mode: connect to `playac-mod dev` |
|---|---|---|---|
| Chrome, Edge (and other Chromium browsers) | yes | yes, and reloads when you save | yes |
| Firefox | yes | yes, reads it once (choose it again to reload) | yes |
| Safari | yes | yes, reads it once | **no**. Safari does not let a site connect to your own computer. |

Install one if you need it:

- **macOS**: https://www.google.com/chrome/ or https://www.microsoft.com/edge
- **Windows**: Edge is already there. Chrome is at https://www.google.com/chrome/
- **Linux**: Chrome from https://www.google.com/chrome/ (`.deb` or `.rpm`), or
  Chromium from your distribution. That is `sudo apt install chromium` on
  Debian, `sudo dnf install chromium` on Fedora and a snap on Ubuntu.

**Check it worked:** open https://get.webgl.org/webgl2/ in that browser. You
should see a spinning cube. If it says your browser does not support WebGL 2,
update the browser or switch on hardware acceleration in its settings.

## 2. Your town

The game runs from your own copy of the Animal Crossing GameCube disc. The
North American, European and Australian discs work. To make that file from a
disc you own, see https://playaconline.com/your-disc/.

1. Open https://playaconline.com/play/ and press **Load Game**.
2. Pick your disc file. It is kept in this browser and never uploaded. Next
   time the game starts straight away.
3. Start a town, or continue yours. You can save once you have talked to one
   villager (https://playaconline.com/wiki/getting-started/).
4. Optional but recommended: make an account with **Sign up**, at the top
   right of the site. Your town then syncs to it. You also need an account to
   share mods later.

**Check it worked:** you are walking around your town.

**Keep a backup before you test scripts.**

1. Open the **Save** panel with the save button at the top of the play page.
2. Choose **Export with mod data**. You get a file of your town and everything
   mods saved for it.
3. To put it back later, choose **Import a save file** in the same panel.

## 3. Developer mode

Developer mode adds tools for making mods to the Mods tab. You can load a mod
from a folder and reload it as you save. It plays a separate test town, so
your real town is not touched.

1. Open the game with `?moddev=1` at the end of the address:

   https://playaconline.com/play/?moddev=1

2. The first time, choose how to start your test town: **A copy of my town**
   or **A fresh town**.
3. Open **Settings** with the gear at the top, then the **Mods** tab.

**Check it worked:** at the bottom of the Mods tab there is a **Developer**
section with **Load a mod you are making**.

Opening the game with `?moddev=1` only shows the section. It loads no mod.
The next step does that.

Developer mode is on only while the address ends in `?moddev=1`. A reload
keeps it. A plain https://playaconline.com/play/ always plays your real town.
To leave developer mode, press **Leave dev mode** on the test town bar, or
open the game without `?moddev=1`.

## 4. Load a mod you are making

You need a mod folder, which is a folder with a `mod.json` in it. If you have
none yet, do one of these:

- Download a starter kit from the newest "Starter kits and AI pack" release
  of this repository (https://github.com/Play-AC-Online/playac-mods/releases) and
  unzip it.
- Copy an example repository. The [README](../README.md) lists them.

### Without any tools: choose the folder

1. In **Developer, Load a mod you are making**, press **Choose folder**.
2. Pick the folder that has `mod.json` directly in it, not the folder above
   it.
3. The browser asks to let the site view the folder. Allow it.
4. Press **Restart now** once.

**Check it worked:** the Developer section says **Running:** with your mod's
name, id and version. The mod does its thing in the game.

In Chrome and Edge, a saved change shows up without another restart:

- A line shows the next time it is said.
- A shop shows the next time you go in.
- A texture shows at once.

Firefox and Safari read the folder once. Choose it again after a change.

### With playac-mod: connect to `playac-mod dev`

1. In a terminal, in your mod folder, run:

   ```bash
   playac-mod dev
   ```

   It prints the address it serves and keeps running. The address is
   `http://127.0.0.1:2604` unless that port was busy. Leave that window open.
   Ctrl+C stops it.
2. In the game's **Developer** section, put that address in **playac-mod dev
   address** and press **Connect**. The box already holds
   `http://127.0.0.1:2604`. The page reaches the tool only after you press
   **Connect**.
3. Press **Restart now** once.

After you reload the page, press **Connect** again. Until you do, the game
runs the last copy it loaded and does not follow your edits.

**Check it worked:** the terminal prints a line when you save a file, and the
change shows in the game. If the folder breaks a rule, the terminal and the
Developer section both say which file and why. The game keeps the last good
copy.

Use Chrome, Edge or Firefox for this. Safari cannot connect, so choose the
folder instead.

### While a mod is loaded this way

- Friend visits and sharing are off, because no one else has that mod. Press
  **Unload**, then **Restart now**, to switch them back on.
- Some changes still need a restart. These are a change to `mod.json`, a new
  items file, and a script or textures folder the mod did not have when the
  game started. The Developer section says so and offers **Restart now**. Save
  your town first.

## 5. Where the game tells you what went wrong

- **Your mod's row** in the Mods tab. Red text means the game refused part of
  the mod, and gives the reason. **What this means and how to fix it** opens
  the explanation.
- **The Mod log** in the Mods tab. It updates while you play. You can filter
  it by mod and copy it. It shows:
  - your script's `log()` lines
  - script errors, with the file and line
  - scripts stopped for running too long
  - anything the game refused
- **The browser console** shows the same lines as `[Mods] your-id: ...`. Open
  it with F12 on Windows and Linux. On macOS use Cmd+Option+J in Chrome or
  Cmd+Option+I in Edge.

**Check it worked:** open the Mod log. With the Script kit loaded it shows the
kit's `log()` lines as you play. With a mod that logs nothing it stays empty,
which is fine.

## If a mod stops the game starting

In the Mods tab, choose **Start without mods**. The game restarts once with
every mod off. If you cannot open the Mods tab, open
https://playaconline.com/play/?nomods=1 instead.

## More

- The test loop and a checklist before you share: https://playaconline.com/modding/testing/
- Installing mods as a player: https://playaconline.com/wiki/mods/
- Problems: [Troubleshooting](troubleshooting.md)
