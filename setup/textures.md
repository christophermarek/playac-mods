# Texture tools: find, paint, save

A texture mod is a folder of pictures, each saved under the exact name of the
game texture it replaces. This guide gets you the three things that takes: the
name, a paint program, and a file the game reads.

No command line is needed. The only optional terminal step is converting to DDS
with ImageMagick or texconv.

Depth on everything here: https://playaconline.com/modding/guides/textures/

## 1. A mod folder to put pictures in

Either:

- **From the game (recommended):** step 2 below ends with **Export starter mod**,
  a ZIP with the textures you picked, a `mod.json` and a README. Unzip it.
- **The texture kit:** download it from
  https://playaconline.com/modding/downloads/ and unzip it. It works as it is (the
  town grass becomes a green check), with its pictures in `textures/`.
- **With the tool:** `npx playac-mod new yourname.my-textures --kind texture`
  ([Node.js and playac-mod](node-and-cli.md)).

Open its `mod.json` in any text editor and change `yourname` in `"id"` and
`"authors"` to your own name (lower case letters, digits and dashes).

## 2. Find a texture's name: the texture inspector

The game shows you every texture it draws, under the file name your mod needs.

1. Open https://playaconline.com/play/?moddev=1 and load your town
   ([The game](game.md) explains developer mode).
2. Open **Settings, Mods**. In the **Developer** section at the bottom, press
   **Record textures**.
3. Close Settings and walk to where the texture is drawn.
4. Open **Settings, Mods** again. The newest textures are listed first; the
   filter box narrows them by name or size (`64x64`).
5. For each one: **Flash** draws it bright magenta in the game for 3 seconds, so
   you can see which it is. **Copy name** copies its file name. **PNG** saves the
   picture to look at or trace.
6. Tick the ones you want and press **Export starter mod**.

**Check it worked:** the ZIP's `textures/` folder has one `.dds` per texture you
ticked, named like `tex1_32x32_626709d910129694_193ca5974976e36e_8.dds`.

**Seasons and times of day.** Many textures (grass, trees, cliffs) are drawn with
a colour palette that changes through the day and the year, and each palette
gives the texture another name. A name with `$` in the place of the palette part,
like `tex1_32x32_626709d910129694_$_8.dds`, matches all of them: press **Any
palette** to copy it. Use the exact name for one season only.

The exported pictures are the game's own art: a guide to paint over, never
something to share as it is. The mod list refuses an unchanged copy.

## 3. A paint program

Any program that saves PNG works. Free ones:

| Program | macOS | Windows | Linux | Saves DDS itself |
|---|---|---|---|---|
| Krita, https://krita.org | yes | yes | yes | no, save PNG |
| GIMP, https://www.gimp.org | yes | yes | yes | **yes** |
| Paint.NET, https://www.getpaint.net | | yes | | **yes** |
| Pinta, https://www.pinta-project.com | yes | yes | yes | no, save PNG |
| LibreSprite (pixel art), https://libresprite.github.io | yes | yes | yes | no, save PNG |
| Photopea, https://www.photopea.com (in the browser) | yes | yes | yes | no, save PNG |

Install with your system's usual way, or:

- macOS (with Homebrew): `brew install --cask krita` or `brew install --cask gimp`
- Windows: `winget install KDE.Krita`, `winget install GIMP.GIMP.3` or
  `winget install dotPDN.PaintDotNet`
- Linux: your software centre, or Flathub: `flatpak install flathub org.kde.krita`
  or `flatpak install flathub org.gimp.GIMP`

**Check it worked:** open the PNG the inspector saved (or a `.dds` from the
export, in GIMP or Paint.NET) and you see the texture.

Tips: keep the picture the same shape as the original (a 32x64 texture stays
twice as tall as it is wide). The same size works; 2x or 4x is sharper. Many game
textures are tiny and tile, so paint at 4x and check the edges meet.

## 4. Save it: PNG or DDS

| | PNG | DDS |
|---|---|---|
| Easiest | **yes**, every program saves it | needs GIMP, Paint.NET or a converter |
| File name | the texture's name ending `.png` | the texture's name ending `.dds` |
| Memory in the game | uncompressed, 4 bytes a pixel | uncompressed, or much less as BC1/BC3/BC7 |
| Transparency | yes | yes (BC1 only on or off) |

**Start with PNG.** Use DDS when your pictures are big or many: compressed DDS
(BC1, BC3) takes a quarter or less of the memory, and every switched-on mod
together may use 96 MiB on a computer and 24 MiB on a phone.

Never put a `.png` and a `.dds` of the same name in one mod. Delete every picture
you did not repaint.

### PNG

Save (or Export) as PNG under the texture's name, ending `.png`, in your mod's
`textures/` folder. Delete the `.dds` of the same name. Any PNG kind works, up to
2048 x 2048.

### DDS from GIMP (all systems)

**File, Export As**, name ending `.dds`, then in the DDS dialog:

- **Compression**: **None** (then **Format: RGBA8**), or **BC3 / DXT5** (smooth
  transparency), or **BC1 / DXT1** (smallest, no smooth transparency).
- **Mipmaps**: **No mipmaps**.

With Compression None, do not leave Format on **Default**: for a picture without
an alpha channel it can save 24-bit RGB, which the game cannot draw.
**BC7** also works, but many phones cannot draw it.

### DDS from Paint.NET (Windows)

**File, Save As**, type **DirectDraw Surface (DDS)**, then pick **BC3 (Linear,
DXT5)**, **BC1 (Linear, DXT1)** or an uncompressed 32-bit format (B8G8R8A8 or
R8G8B8A8), and **untick Generate Mip Maps**.

### DDS from the command line

From a PNG you painted. Put the name in single quotes: the `$` in a palette name
means something to every shell.

**ImageMagick** (all systems): macOS `brew install imagemagick`, Windows
`winget install ImageMagick.ImageMagick`, Linux `sudo apt install imagemagick` or
`sudo dnf install ImageMagick`. Check with `magick -version` (on Debian and
Ubuntu the older version 6 has no `magick`: use `convert` in its place below).

```bash
magick 'tex1_32x32_626709d910129694_$_8.png' -alpha on -define dds:compression=none -define dds:mipmaps=0 'tex1_32x32_626709d910129694_$_8.dds'
```

`-alpha on` matters: without it a picture with no transparency is saved as
24-bit, which the game cannot draw. `dds:mipmaps=0` matters too: ImageMagick adds
mipmaps by default. For a smaller file use `dds:compression=dxt5` (or `dxt1`).

**texconv** (Windows, from https://github.com/microsoft/DirectXTex/releases, or
`winget install Microsoft.DirectXTex.Texconv`):

```powershell
texconv -f BC3_UNORM -m 1 -y 'tex1_32x32_626709d910129694_$_8.png'
```

`-m 1` means one level, no mipmaps. `-f R8G8B8A8_UNORM` (or `BGRA`) is
uncompressed; `BC1_UNORM` is the smallest.

### The channel order

Uncompressed DDS files store their colours as RGBA or as BGRA, depending on the
program (ImageMagick and some others write BGRA, which some tools call
A8R8G8B8). The game reads both and draws the right colours, so pick whichever
your program offers.

**Check it worked:** install the mod (zip the folder: **Settings, Mods, Install
from a file, Choose ZIP**, then **Restart now**) and go to the spot. With the
tool, `npx playac-mod check` names any file the game cannot read, with mipmaps,
or in a format the game cannot draw, before you install.

Faster while you paint: load the folder in developer mode
([The game](game.md#4-load-a-mod-you-are-making)). After one restart, every
picture you save is drawn again at once.

## If your texture does not show

- The name must match exactly (upper and lower case do not matter). Copy it from
  the inspector rather than typing it.
- Grass, trees and the like change palette with the season and the hour: use the
  `$` name, or record the texture again at that time to get its other names.
- The mod lower in the Mods tab list wins a texture two mods both replace.
- The Mod log names a file the game could not read.

More: https://playaconline.com/modding/faq/ and [Troubleshooting](troubleshooting.md).

## Before you share

Every picture must be your own work: no art from Nintendo or any other game,
film, show or brand, traced or redrawn copies included. A moderator looks at
every texture. Rules: https://playaconline.com/modding/rules/
