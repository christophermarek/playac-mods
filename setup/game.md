# The game: a browser, your town, developer mode

Every mod is tested in the game itself, so this guide comes first for everyone.
By the end you have your town running, developer mode on, and you know where the
game tells you what went wrong.

Nothing here needs a terminal. The last part (connecting `playac-mod dev`) is for
people who installed the tool in [Node.js and playac-mod](node-and-cli.md).

## 1. A browser that runs the game

The game needs a current browser with WebGL 2. For making mods, use **Chrome or
Edge** on a computer (Windows, macOS or Linux): they can watch your mod's folder
and reload it as you save, which the others cannot.

| Browser | Plays the game | Developer mode: choose a folder | Developer mode: connect to `playac-mod dev` |
|---|---|---|---|
| Chrome, Edge (and other Chromium browsers) | yes | yes, and reloads when you save | yes |
| Firefox | yes | yes, reads it once (choose it again to reload) | yes |
| Safari | yes | yes, reads it once | **no**: Safari will not let a site reach your own computer |

Install one if you need it:

- **macOS**: https://www.google.com/chrome/ or https://www.microsoft.com/edge
- **Windows**: Edge is already there. Or Chrome from https://www.google.com/chrome/
- **Linux**: Chrome from https://www.google.com/chrome/ (`.deb` or `.rpm`), or
  Chromium from your distribution (`sudo apt install chromium` on Debian,
  `sudo dnf install chromium` on Fedora, a snap on Ubuntu).

**Check it worked:** open https://get.webgl.org/webgl2/ in that browser. You
should see a spinning cube. If it says your browser does not support WebGL 2,
update the browser or turn on hardware acceleration in its settings.

## 2. Your town

The game runs from your own copy of the Animal Crossing GameCube disc (North
American, European or Australian). How to make that file from a disc you own:
https://playaconline.com/your-disc/

1. Open https://playaconline.com/play/ and press **Load Game**. Pick your disc
   file. It is kept in this browser, never uploaded, and the game starts straight
   away next time.
2. Start a town, or continue yours. You can save once you have talked to one
   villager (https://playaconline.com/wiki/getting-started/).
3. Optional, recommended: make an account (**Sign up**, top right of the
   site). Your town then syncs to it, and you need one to share mods
   later.

**Check it worked:** you are walking around your town.

**Keep a backup before you test scripts.** Open the **Save** panel (the save
button at the top of the play page) and choose **Export with mod data**: you get
a file of your town and everything mods saved for it. **Import a save file** in
the same panel puts it back.

## 3. Developer mode

Developer mode adds tools for mod makers to the Mods tab: loading a mod straight
from a folder, the texture inspector, and reloading as you save. It changes
nothing for your town.

1. Open the game with `?moddev=1` at the end of the address:

   https://playaconline.com/play/?moddev=1

2. Load your town, then open **Settings** (the gear at the top) and the **Mods**
   tab.

**Check it worked:** at the bottom of the Mods tab there is a **Developer**
section with **Load a mod you are making** and **Record textures**.

The browser remembers it, so the section stays on later visits. To hide it
again, press **Hide developer tools** (or open the game with `?moddev=0`).

## 4. Load a mod you are making

You need a mod folder: a folder with a `mod.json` in it. If you have none yet,
download a starter kit from https://playaconline.com/modding/downloads/ and
unzip it, or make one with `playac-mod new` ([Node.js and playac-mod](node-and-cli.md)).

### Without any tools: choose the folder

1. In **Developer, Load a mod you are making**, press **Choose folder**.
2. Pick the folder that has `mod.json` directly in it (not the folder above it).
   The browser asks to let the site view the folder: allow it.
3. Press **Restart now** once.

**Check it worked:** the Developer section says **Running:** with your mod's
name, id and version, and the mod does its thing in the game. In Chrome and Edge, save a change
to a file and it shows up without another restart (lines the next time they are
said, a shop the next time you go in, a texture at once). Firefox and Safari read
the folder once: choose it again after a change.

### With playac-mod: connect to `playac-mod dev`

1. In a terminal, in your mod folder, run:

   ```bash
   npx playac-mod dev
   ```

   It prints the address it serves, `http://127.0.0.1:2604` unless that port was
   busy, and keeps running. Leave that window open; Ctrl+C stops it.
2. In the game's **Developer** section, put that address in **playac-mod dev
   address** and press **Connect**.
3. Press **Restart now** once.

**Check it worked:** the terminal prints a line when you save a file, and the
change shows in the game. If the folder breaks a rule, both the terminal and the
Developer section say which file and why, and the game keeps the last good copy.

Use Chrome, Edge or Firefox for this. Safari cannot connect: choose the folder
instead.

While a mod is loaded this way, friend visits and sharing are off (no one else
has that mod). **Unload** (then **Restart now**) turns them back on.

Some changes still need a restart: `mod.json` itself, a new items file, or a
script or textures folder the mod did not have when the game started. The
Developer section says so and offers **Restart now**. Save your town first.

## 5. Where the game tells you what went wrong

- **Your mod's row** in the Mods tab: red text means the game refused part of it,
  with the reason. **What this means and how to fix it** opens the explanation.
- **Mod log**, in the Mods tab: your script's `log()` lines, script errors with
  the file and line, scripts stopped for running too long, and anything the game
  refused, live while you play. You can filter it by mod and copy it.
- **The browser console** shows the same lines as `[Mods] your-id: ...`. Open it
  with F12 (Windows, Linux) or Cmd+Option+J (macOS, Chrome) or Cmd+Option+I
  (macOS, Edge).

**Check it worked:** open the Mod log. With the Script kit loaded it shows the
kit's `log()` lines as you play; with a mod that logs nothing it stays empty,
which is fine.

## If a mod stops the game starting

In the Mods tab, choose **Start without mods**: the game restarts once with every
mod off. If you cannot reach the Mods tab, open
https://playaconline.com/play/?nomods=1 instead.

## More

- The test loop and a checklist before you share: https://playaconline.com/modding/testing/
- Installing mods as a player: https://playaconline.com/wiki/mods/
- Problems: [Troubleshooting](troubleshooting.md)
