# Errors and refusals

Generated from the Play AC Online mod API spec and errors catalogue. Do not edit by hand. Online: https://playaconline.com/modding/errors/

Every message a mod maker can meet, by code. Search this file for a phrase from the message you got. Each code is also a link: https://playaconline.com/modding/errors/#<code>.

Where messages come from:

- page: the game page's own check, when you install a ZIP in Settings, Mods (also `npx playac-mod check`).
- registry: the shared mod list, when you upload. It runs the same rules plus image checks.
- game: the game itself after a restart, on the mod's row in the Mods tab (shop items, scripts).

## The ZIP and its files

### zip-too-big

**The ZIP is over 16 MB**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    the ZIP is over 16 MB

From the mod list (upload):

    The ZIP is larger than 16 MiB.

What it means: A mod ZIP can be at most 16 MB (16 MiB) compressed.

How to fix it: Make the textures smaller (fewer, smaller, or BC7/DXT compressed DDS files) or split the mod into two mods.

### zip-unreadable

**Not a ZIP the game can read**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    this is not a ZIP the game can open (invalid zip data)
    that is not a file the game can read

From the mod list (upload):

    This is not a ZIP file we can read.
    The upload is empty.
    "main.lua" is not the size its ZIP header says.
    The upload did not arrive whole. Try again.

What it means: The file is not a ZIP archive, or the ZIP is damaged (cut short, or an entry's size is wrong). RAR, 7z and tar files are not ZIPs.

How to fix it: Zip the mod folder again with a normal ZIP tool: on Windows right-click, "Send to", "Compressed (zipped) folder"; on a Mac right-click, "Compress". Upload again if the upload was cut off.

### browser-no-zip

**ZIP support did not load**

Seen in: Mods tab, when you install a ZIP.

In the game page (install, check tool):

    ZIP support is unavailable (fflate.umd.min.js failed to load). Please reload the page

What it means: The game page could not load the small library it uses to open ZIPs. Your mod is fine.

How to fix it: Reload the page. If it keeps happening, an ad or script blocker may be stopping the file: allow playaconline.com.

### zip-no-manifest

**No mod.json at the top of the ZIP**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    There is no mod.json at the top of the ZIP

From the mod list (upload):

    There is no mod.json at the top of the ZIP.

What it means: mod.json must be at the top of the ZIP, or inside ONE top folder that holds everything. It was not found there. Two folders down, or a ZIP with two top folders, does not count.

How to fix it: Open the ZIP and check that mod.json is the first thing you see (or the only folder holds it). Zip the files inside your mod folder, or the mod folder itself, not its parent folder.

Bad (my-mod.zip):

```
mods/
  my-mod/
    mod.json
    shops.json
```

Fixed (my-mod.zip):

```
my-mod/
  mod.json
  shops.json
```

### zip-too-many-files

**More than 2000 files**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    more than 2000 files

From the mod list (upload):

    The ZIP holds 2001 files, more than 2000.
    The ZIP has more than 10000 entries. A mod holds at most 2000 files.

What it means: A mod holds at most 2000 files. Folders, Mac/Windows junk files (__MACOSX, Thumbs.db) and hidden files and folders (any name starting with a dot) are not counted.

How to fix it: Take out files the mod does not use, or split it into two mods.

### zip-unpacked-too-big

**Unpacks to more than 64 MB**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    it unpacks to more than 64 MB

From the mod list (upload):

    The files expand to more than 64 MiB.

What it means: All the files in a mod together can be at most 64 MB once unzipped.

How to fix it: Use compressed textures (BC7, DXT1 or DXT5 DDS) instead of uncompressed ones, or make them smaller. Keep phone players in mind: all switched-on mods together get 24 MB on a phone.

### zip-duplicate-entry

**A file is in the ZIP twice**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "mod.json" is in the ZIP twice

From the mod list (upload):

    The ZIP holds "mod.json" twice.

What it means: The same path appears twice inside the ZIP, which some tools do when you add files to an existing ZIP.

How to fix it: Make a fresh ZIP from the folder instead of adding to an old one.

### path-unsafe

**A path is not a safe path**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "textures\\a.dds" is not a safe path (a backslash)
    "../x.txt" is not a safe path (an empty, "." or ".." part)
    "./a.txt" is not a safe path (an empty, "." or ".." part)
    "/x.txt" is not a safe path (an empty, "." or ".." part)
    "C:/x.txt" is not a safe path (a colon)
    "a/../b.txt" is not a safe path (an empty, "." or ".." part)

From the mod list (upload):

    The path "textures\\a.dds" uses a backslash. Zip it again with forward slashes.
    The path "café.txt" is not plain ASCII. Use English letters, digits, dashes and dots.

What it means: Every path in a mod must be plain: English letters, digits, dashes, dots and underscores, folders split by "/", at most 160 bytes, with no "..", no "\", no ":", no empty folder name and no control characters.

How to fix it: Rename the file or folder to plain ASCII (no accents or emoji), keep names short, and zip again. On Windows use the built-in "Compressed (zipped) folder", which writes forward slashes.

### path-case-clash

**Two names differ only in letter case**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "Readme.txt" and "readme.txt" are the same name ignoring letter case
    "A.txt" and "a.txt" are the same name ignoring letter case
    "MOD.JSON" and "mod.json" are the same name ignoring letter case
    "Notes/a.txt" and "notes/A.TXT" are the same name ignoring letter case
    "README.md" and "readme.md" are the same name ignoring letter case

From the mod list (upload):

    The ZIP holds "Readme.txt" and "readme.txt", the same path when case is ignored.

What it means: Two files have names that differ only in upper and lower case. Windows and Macs treat them as the same file, so a mod cannot hold both.

How to fix it: Delete or rename one of the two.

### path-file-and-folder

**A name is both a file and a folder**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "data" is both a file and a folder
    "TEX.png" is both a file and a folder
    "a.txt" is both a file and a folder
    "a/b.txt" is both a file and a folder
    "a/notes.TXT" is both a file and a folder
    "x.json" is both a file and a folder

From the mod list (upload):

    "data" is a file, and "data/x.json" uses it as a folder.

What it means: One path is a file and also the folder of another file (for example "data" and "data/x.json").

How to fix it: Rename the file or the folder.

### file-type

**A file type a mod cannot hold**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "evil.js": only .json .lua .dds .png .txt .md files can be in a mod
    "LICENSE": only .json .lua .dds .png .txt .md files can be in a mod
    "inner.zip": only .json .lua .dds .png .txt .md files can be in a mod
    "tools/run.exe": only .json .lua .dds .png .txt .md files can be in a mod
    "x.txt.exe": only .json .lua .dds .png .txt .md files can be in a mod

From the mod list (upload):

    "evil.js" is not an allowed file type. Mods may carry .json .lua .dds .png .txt .md files.

What it means: A mod can only hold .json, .lua, .dds, .png, .txt and .md files. Anything else (a .zip inside the ZIP, .exe, .js, .jpg, a LICENSE file with no extension) is refused.

How to fix it: Take the file out, or for text give it a .txt or .md name (LICENSE.txt). Save pictures as .png or .dds: the game draws both as textures.

### file-too-big

**A file is too big**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    mod.json is over 64 KB
    "data/big.json" is over 256 KB
    "main.lua" is over 512 KB
    "data.json" is over 256 KB
    "m.txt" is over 256 KB
    "s.txt" is over 256 KB

From the mod list (upload):

    mod.json is larger than 64 KiB.
    "main.lua" is larger than 512 KiB, the most a .lua file may be.

What it means: mod.json can be at most 64 KB, any other .json file 256 KB, any .lua file 512 KB.

How to fix it: Split a big messages file into several mods, or move data out of mod.json. Split a big script into smaller functions; it is one file per mod today.

## JSON files

### json-duplicate-key

**A JSON key appears twice**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    messages/en.json: duplicate key "greet"
    data/x.json: duplicate key "a"
    messages/en.json: duplicate key "hours"
    mod.json: duplicate key "a"
    mod.json: duplicate key "content"
    mod.json: duplicate key "scope"

From the mod list (upload):

    messages/en.json has the key "greet" twice.

What it means: The same key is written twice in one JSON object. Different tools would keep different copies, so it is refused everywhere.

How to fix it: Delete or rename one of the two keys.

Bad (messages/en.json):

```
{
  "greet": "Hello!",
  "greet": "Hi!"
}
```

Fixed (messages/en.json):

```
{
  "greet": "Hello!",
  "greet2": "Hi!"
}
```

### json-nul

**A string holds a NUL character**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    mod.json: a string holds a NUL character (\u0000)
    data/x.json: a string holds a NUL character (\u0000)
    messages/en.json: a string holds a NUL character (\u0000)
    other.json: a string holds a NUL character (\u0000)

From the mod list (upload):

    mod.json holds a NUL character (\u0000), which mods may not use.

What it means: A JSON string contains \u0000 (a zero byte). The game cannot store it.

How to fix it: Remove the \u0000 from the text.

### json-invalid

**Not valid JSON**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    mod.json is not valid JSON
    shops.json: a number is out of range
    data/x.json is not valid JSON
    x.json is not valid JSON

From the mod list (upload):

    mod.json is not valid JSON.
    shops.json is not valid JSON: a syntax error at byte 42.

What it means: The file is not valid JSON: a missing comma or quote, a comma after the last item, a comment, single quotes, or a byte order mark at the start.

How to fix it: Paste the file into a JSON checker (or open it in VS Code, which underlines the mistake). JSON has no comments and no trailing commas, and strings use double quotes. Save as UTF-8 without BOM.

Bad (mod.json):

```
{
  "schema": 1,
  "id": 'yourname.my-mod',   // a comment
}
```

Fixed (mod.json):

```
{
  "schema": 1,
  "api": 1,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": [
    "yourname"
  ],
  "scope": "client",
  "assets_original": true
}
```

### json-too-deep

**JSON nested more than 32 levels**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    d.json: nested more than 32 levels deep
    mod.json: nested more than 32 levels deep

From the mod list (upload):

    d.json is nested more than 32 levels deep.

What it means: Objects and lists inside each other may go 32 levels deep, the most the game reads. No real mod file needs more.

How to fix it: Flatten the data: keep the file a simple object of keys to values or to small lists.

## mod.json

### manifest-unreadable

**mod.json could not be read**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    mod.json could not be read: bad JSON at byte 12

What it means: The game itself could not read mod.json when it started. This only happens if the file passed the install check but is broken in a way only the game sees.

How to fix it: Reinstall the mod from its ZIP. If it keeps happening, report it with the mod attached: it is a bug in the game.

### manifest-not-object

**mod.json is not a JSON object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    mod.json is not a JSON object

From the mod list (upload):

    mod.json must be a JSON object.

What it means: mod.json must be one object in curly braces { }, not a list or a single value.

How to fix it: Start from the template below.

Fixed (mod.json):

```
{
  "schema": 1,
  "api": 1,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": [
    "yourname"
  ],
  "scope": "client",
  "assets_original": true
}
```

### api-missing

**"api" is missing or not a whole number**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "api" must be a whole number, the mod API level the mod is made for (1 to 2 today)

From the mod list (upload):

    mod.json must say "api" as a whole number, the mod API level it is made for (1 to 2 today).

What it means: "api" says which version of the mod rules your mod is written for. It is required, and must be a whole number like 2 (not "2" in quotes, not 1.5).

How to fix it: Add "api": 2 to mod.json (2 is the current level).

Bad (mod.json):

```
{
  "schema": 1,
  "api": "2",
  ...
}
```

Fixed (mod.json):

```
{
  "schema": 1,
  "api": 2,
  ...
}
```

### api-older

**Made for an older game**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    made for an older game: it is made for mod API 0, this game reads 1 to 2
    made for an older game: it is made for mod API -1, this game reads 1 to 2

From the mod list (upload):

    This mod is made for an older game: it says mod API 0, and the game reads 1 to 2.

What it means: The mod says an "api" level this game no longer reads, or it has no "api" at all (a mod made before the field existed). The game does not load it rather than guess.

How to fix it: Players: look for an update to the mod. Makers: read the changelog for the levels in between, update the mod, and set "api" to the current level (2).

### api-newer

**Needs a newer game**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    needs a newer game: it is made for mod API 3, this game reads 1 to 2
    needs a newer game: it is made for mod API 1000, this game reads 1 to 2

From the mod list (upload):

    This mod needs a newer game: it says mod API 3, and the game reads 1 to 2.

What it means: The mod is written for a newer set of mod rules than this game has.

How to fix it: Reload the page to get the newest game. If it still says this, the mod was made for a level that is not released yet: set "api" to the current level (2).

### manifest-schema

**"schema" must be 1**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "schema" must be 1

From the mod list (upload):

    mod.json must say "schema": 1.

What it means: "schema" is the format of mod.json itself, and it is always the number 1.

How to fix it: Add "schema": 1.

### manifest-unbuilt-key

**A key that is not built yet**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "depends" is not built yet, so a mod cannot use it: take it out of mod.json
    "conflicts" is not built yet, so a mod cannot use it: take it out of mod.json
    "game" is not built yet, so a mod cannot use it: take it out of mod.json
    "save" is not built yet, so a mod cannot use it: take it out of mod.json

From the mod list (upload):

    "depends" is not built yet, so a mod cannot use it. Take it out of mod.json.

What it means: "game" and "save" are reserved for planned features, so a mod.json with either of them (even set to null) is refused at every api level. "depends" and "conflicts" are built from api 2, and refused only in a mod that says "api": 1. Otherwise a mod could carry a rule that a later game starts obeying by surprise.

How to fix it: For depends or conflicts: say "api": 2 (see the Dependencies guide). For game or save: take the key out of mod.json.

### manifest-id-reserved

**The id uses a reserved author name**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The id "example.tea-house" starts with "example", which is reserved for the site's own mods. Use your own name before the dot.

What it means: The shared mod list keeps the author names playaconline, official, admin and example for the site's own mods. You can install such a mod from a file, but not share it.

How to fix it: Change the part before the dot to your own name: "yourname.tea-house".

### manifest-id

**"id" is not author.mod-name**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "id" must look like author.mod-name (lowercase letters, digits and dashes, at most 32 + 48)

From the mod list (upload):

    The id "Tea House" must look like author.mod-name: lowercase letters, digits and dashes, one dot.

What it means: The id is your name, a dot, and the mod's name: lowercase letters, digits and dashes only, up to 32 characters before the dot and 48 after, starting with a letter or digit. It names the mod everywhere and cannot change later.

How to fix it: Use something like "yourname.tea-house".

Bad (mod.json):

```
"id": "YourName/Tea House"
```

Fixed (mod.json):

```
"id": "yourname.tea-house"
```

### manifest-name

**"name" must be 1 to 60 characters**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "name" must be 1 to 60 characters

From the mod list (upload):

    The name must be 1 to 60 characters.

What it means: The name players read on the Mods tab is required and at most 60 characters (spaces at the ends do not count).

How to fix it: Give the mod a short name.

### manifest-version

**"version" is not like 1.0.0**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "version" must be like 1.0.0 (each part 1 to 9 digits, no leading zeros)

From the mod list (upload):

    The version "v1.0" must be three numbers like 1.0.0, each 1 to 9 digits with no leading zero.

What it means: The version is three whole numbers with dots, in quotes: "1.0.0". No "v", no fourth part, no leading zeros like "01".

How to fix it: Use "1.0.0" for a first release and raise it for every update you share: "1.0.1" for a fix, "1.1.0" for something new.

### manifest-authors

**"authors" must list 1 to 8 names**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "authors" must list 1 to 8 names of 1 to 40 characters

From the mod list (upload):

    List 1 to 8 authors.
    Each author must be 1 to 40 characters.

What it means: "authors" is a list (square brackets) of 1 to 8 names, each 1 to 40 characters.

How to fix it: Write "authors": ["yourname"].

Bad (mod.json):

```
"authors": "yourname"
```

Fixed (mod.json):

```
"authors": ["yourname"]
```

### manifest-description

**"description" is too long or not text**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "description" must be text of at most 500 characters

From the mod list (upload):

    The description must be text of at most 500 characters.

What it means: "description" is optional, but when present it must be text of at most 500 characters (null is refused).

How to fix it: Shorten it, or take the key out.

### manifest-tags

**"tags" must come from the list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "tags" must list at most 5 different tags from: textures, clothing, furniture, scenery, villagers, dialogue, shops, seasonal, holidays, quality-of-life, translation, humor, accessibility, scripts

From the mod list (upload):

    tags must list at most 5 different tags from: textures, clothing, furniture, scenery, villagers, dialogue, shops, seasonal, holidays, quality-of-life, translation, humor, accessibility, scripts.

What it means: "tags" is optional. When present it is a list of at most 5 different tags, each from the fixed list, in lower case. Players filter the mod list by them; the game never reads them.

How to fix it: Pick up to 5 tags from the list, or take the key out.

Bad (mod.json):

```
"tags": ["Textures", "weapons"]
```

Fixed (mod.json):

```
"tags": ["textures", "seasonal"]
```

### manifest-scope

**"scope" must be "client" or "world"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scope" must be "client" or "world"

From the mod list (upload):

    The scope must be "client" or "world".

What it means: "client" means only you see the mod (textures, lines, scripts). "world" means it changes your town for visitors too, and only a world mod may hold a shop or a bulletin board notice (an events file with "board").

How to fix it: Use "client" unless the mod has a shop or a bulletin board notice (an events file with "board"); then use "world".

### manifest-assets-original

**"assets_original" must be true**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "assets_original" must be true: a mod may only contain work its authors made, never files taken from the game

From the mod list (upload):

    mod.json must say "assets_original": true, your promise that the mod holds no Nintendo assets. Mods with game assets can't be uploaded.

What it means: "assets_original": true is your promise that every file in the mod is your own work, with nothing taken from the game, Nintendo or anyone else. Without it the mod is refused.

How to fix it: Make sure the promise is true, then add "assets_original": true.

## content: textures, messages, shops

### shops-need-world

**A shop needs "scope": "world"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    "content.shops" changes what visitors see, so "scope" must be "world"

From the mod list (upload):

    content.shops changes what visitors see, so mod.json needs "scope": "world".

From the game (Mods tab row):

    shops change what visitors see, so the mod needs "scope": "world"

What it means: A shop changes your town for visitors, so a mod with "shops" must say "scope": "world". World mods must match for a friend visit.

How to fix it: Set "scope": "world" in mod.json.

Bad (mod.json):

```
{
  "schema": 1,
  "api": 1,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": [
    "yourname"
  ],
  "scope": "client",
  "assets_original": true,
  "content": {
    "shops": "shops.json"
  }
}
```

Fixed (mod.json):

```
{
  "schema": 1,
  "api": 1,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": [
    "yourname"
  ],
  "scope": "world",
  "assets_original": true,
  "content": {
    "shops": "shops.json"
  }
}
```

### content-not-object

**"content" must be an object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content" must be an object

From the mod list (upload):

    content must be an object.

What it means: "content" is an object of kind to path: { "textures": "textures/", "messages": "messages/en.json", "shops": "shops.json" }.

How to fix it: Write it in curly braces with one key per kind of content.

### content-unknown

**Something a mod cannot add yet**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content.items" is not something a mod can add yet
    "content.Messages" is not something a mod can add yet
    "content.Shops" is not something a mod can add yet
    "content.acres" is not something a mod can add yet
    "content.buildings" is not something a mod can add yet
    "content.events" is not something a mod can add yet

From the mod list (upload):

    content.items is not something a mod can add yet. Use textures, messages, shops.

What it means: "content" can hold "textures", "messages" and "shops" (exactly these, lowercase), and at api 2 also "items", "letters", "events" and "talk". Buildings, acres and the rest are not supported yet. At api 1 the api 2 keys are refused too: set "api": 2.

How to fix it: Take the key out. Check the spelling and case: "Messages" is not "messages".

### content-path

**A content path is not inside the mod**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    "content.messages" must be a path inside the mod
    "content.talk" must be a path inside the mod

From the mod list (upload):

    content.messages must be a path inside the mod.

From the game (Mods tab row):

    messages path is not inside the mod: ../x.json

What it means: Each "content" value is a path inside the mod, like "messages/en.json": text, not empty, with forward slashes, no "..", no leading "/".

How to fix it: Write the path as it is inside the ZIP, relative to mod.json.

### content-missing

**A content path names a file that is not there**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content.messages" names messages/en.json, which is not in the mod
    "content.textures" names textures/, which is not a folder with files in the mod
    "content.items" names items.json, which is not in the mod
    "content.letters" names letters.json, which is not in the mod
    "content.messages" names .msgs/en.json, which is not in the mod
    "content.messages" names EN.json, which is not in the mod

From the mod list (upload):

    content.messages names "messages/en.json", which is not in the ZIP.
    content.textures names "textures/", which is not a folder with files in the ZIP.

What it means: mod.json names a file (or, for textures, a folder holding at least one file) that is not in the ZIP. Names are matched with exact letter case.

How to fix it: Check the spelling and case of the path against the ZIP ("EN.json" is not "en.json"), and that the file was zipped.

## scripts in mod.json

### scripts-not-object

**"scripts" must be an object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts" must be an object

From the mod list (upload):

    scripts must be an object with main and hooks.

What it means: "scripts" is an object with "main" (your .lua file) and "hooks" (the events it listens to).

How to fix it: Write "scripts": { "main": "main.lua", "hooks": ["talk"] }.

### scripts-unknown-key

**An unknown key in "scripts"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts.entry" is not a scripts setting (only main and hooks)
    "scripts.Main" is not a scripts setting (only main and hooks)

From the mod list (upload):

    scripts.entry is not a scripts setting. Use main and hooks.

What it means: "scripts" takes only "main" and "hooks" (lowercase).

How to fix it: Rename or remove the other key.

### scripts-main-missing

**The script file is not in the mod**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, "Script stopped" on the mod's row.

In the game page (install, check tool):

    "scripts.main" names main.lua, which is not in the mod
    "scripts.main" names other.lua, which is not in the mod

From the mod list (upload):

    scripts.main names "main.lua", which is not in the ZIP.

From the game (Mods tab row):

    scripts.main could not be read (missing, or over 512 KB)

What it means: "scripts.main" names a .lua file that is not in the ZIP (check the case), or the game could not read it.

How to fix it: Put the script in the ZIP at exactly the path "main" names.

### scripts-main

**"scripts.main" must be a .lua file**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, "Script stopped" on the mod's row.

In the game page (install, check tool):

    "scripts.main" must be a .lua file inside the mod (lowercase .lua)

From the mod list (upload):

    scripts.main must name a .lua file (a lowercase .lua) inside the mod.

From the game (Mods tab row):

    scripts.main must end in lowercase .lua
    the mod's folder path is too long

What it means: "scripts.main" is required when "scripts" is there: a path inside the mod ending in lowercase ".lua". "main.LUA" is refused.

How to fix it: Rename the file to end in .lua and write "main": "main.lua".

### scripts-hooks

**"scripts.hooks" is not a list of events**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts.hooks" must list one or more events, each once, from: talk, day_start, item_picked, enter_scene

From the mod list (upload):

    scripts.hooks must list at least one of talk, day_start, item_picked, enter_scene.
    scripts.hooks lists "every_frame", which is not a hook. Use talk, day_start, item_picked, enter_scene.

What it means: "hooks" lists every event your script listens to with on(), each once, lowercase, at api 1: talk, day_start, item_picked, enter_scene; from api 2 also migrate, hour_change, shop_buy, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_result, answer. There is no per-frame event, on purpose. A library mod that only offers functions to other mods (remote.add) still lists one event: list one and register no handler for it, which costs nothing.

How to fix it: List the events your script uses (talk, day_start, item_picked, enter_scene, migrate, hour_change, shop_buy, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_result, answer), each once. Events added at api 2 need "api": 2.

Bad (mod.json):

```
"scripts": { "main": "main.lua", "hooks": ["Talk", "every_frame"] }
```

Fixed (mod.json):

```
"scripts": { "main": "main.lua", "hooks": ["talk"] }
```

### scripts-permissions

**"permissions" is not a list of commands**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "permissions" must list one or more commands, each once, from: send_letter, give_item, set_flag, show_line, ask

From the mod list (upload):

    permissions must list at least one of send_letter, give_item, set_flag, show_line, ask.
    permissions lists "teleport", which is not a command. Use send_letter, give_item, set_flag, show_line, ask.
    permissions lists "ask" twice.

What it means: "permissions" (api 2) lists the commands your script may use, each once, from send_letter, give_item, set_flag, show_line and ask. Players see the list on the Mods tab.

How to fix it: List only the commands your script calls, for example "permissions": ["send_letter"].

Bad (mod.json):

```
"permissions": ["send_letter", "send_letter", "teleport"]
```

Fixed (mod.json):

```
"permissions": ["send_letter"]
```

### scripts-permissions-no-scripts

**"permissions" without "scripts"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "permissions" is for a mod with "scripts": only a script can use a command

From the mod list (upload):

    permissions is for a mod with scripts: only a script can use a command.

What it means: Only a script can use a command, so "permissions" needs "scripts".

How to fix it: Add "scripts", or remove "permissions".

### manifest-exports

**"exports" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; the Mod log in Settings, Mods.

In the game page (install, check tool):

    "exports" must be an object of at most 32 function names (1 to 32 of a-z 0-9 _), each with a description of 1 to 120 characters on one line

From the mod list (upload):

    exports must be an object of at most 32 function names (1 to 32 of a-z, 0-9 and _), each with a description of 1 to 120 characters on one line.

From the game (Mods tab row):

    mod.json "exports" must be an object of at most 32 function names, each with a one-line description of 1 to 120 characters: it is ignored

What it means: "exports" (api 2) lists a library's remote functions for the mods that use it: { "name": "what it does" }. Names are remote.add's (1 to 32 of a-z 0-9 _), at most 32, each with a description of 1 to 120 characters on one line.

How to fix it: Write an object of names to one-line descriptions.

Bad (mod.json):

```
"exports": ["count_pieces"]
```

Fixed (mod.json):

```
"exports": { "count_pieces": "How many workshop pieces the player bought." }
```

### manifest-exports-no-scripts

**"exports" without "scripts"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "exports" is for a mod with "scripts": only a script offers functions

From the mod list (upload):

    exports is for a mod with scripts: only a script offers functions.

What it means: Only a script offers functions (remote.add), so "exports" needs "scripts".

How to fix it: Add "scripts", or remove "exports".

## shops.json

### shops-file

**shops.json needs a "shops" list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: "shops" must be a list of 1 to 4 shops

From the mod list (upload):

    shops.json must be a JSON object with a "shops" list.
    shops.json needs a "shops" list of 1 to 4 shops.

From the game (Mods tab row):

    shops file needs a "shops" list
    shops: the "shops" list must hold 1 to 4 shops

What it means: shops.json is an object with a "shops" list of 1 to 4 shops, even when there is only one.

How to fix it: Wrap the shop in { "shops": [ ... ] }.

Bad (shops.json):

```
{ "target": "flower", "stock": [{ "item": "0x2800" }] }
```

Fixed (shops.json):

```
{ "shops": [{ "target": "flower", "stock": [{ "item": "0x2800" }] }] }
```

### shop-not-object

**A shop is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: shop 1 is not an object

From the mod list (upload):

    shops.json: shop 1 must be an object.

What it means: Each entry of "shops" is an object in curly braces.

How to fix it: Write each shop as { "target": "flower", ... }.

### shop-target

**Only the flower shop and Nook's can be changed**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "target" must be "flower" or "nook"

From the mod list (upload):

    shops.json: shop 1 has target "barber". A mod can change "flower" and "nook".

From the game (Mods tab row):

    shops: the shops a mod can change are "flower" and "nook": barber

What it means: A mod can change two shops: the flower shop, "target": "flower", and Nook's, "target": "nook" (api 2). Lowercase.

How to fix it: Set "target": "flower" or "target": "nook".

### shop-target-twice

**Two shops for the same target**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 2 is a second shop for "flower": one shop per target
    shops: shop 2 is a second shop for "nook": one shop per target

From the mod list (upload):

    shops.json: two shops change the "flower" target.

From the game (Mods tab row):

    shops: the flower shop is listed twice, the second is left out

What it means: One mod can describe each shop once.

How to fix it: Merge the two entries into one.

### shop-name

**Shop "name" must be 1 to 40 characters on one line**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "name" must be 1 to 40 characters on one line

From the mod list (upload):

    shops.json: shop 1's name must be 1 to 40 characters on one line.

From the game (Mods tab row):

    shops: "name" must be 1 to 40 characters on one line

What it means: The shop name (shown on the closed sign) is optional, 1 to 40 characters on one line: a line break ("\n") in it is refused.

How to fix it: Shorten it and take out any line break, or leave it out.

### shop-hours-same

**Shop opens and closes at the same time**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "hours" open and close must differ

From the mod list (upload):

    shops.json: shop 1's hours open and close at the same time.

From the game (Mods tab row):

    shops: "open" and "close" are the same time

What it means: A shop open around the clock is written by leaving "hours" out, not by giving the same time twice.

How to fix it: Leave "hours" out, or give two different times.

### shop-hours

**Shop "hours" are not "HH:MM"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "hours" must be { "open": "HH:MM", "close": "HH:MM" }

From the mod list (upload):

    shops.json: shop 1's hours need "open" and "close" as HH:MM, like 09:00.

From the game (Mods tab row):

    shops: hours need "open" and "close" as "HH:MM", 00:00 to 23:59

What it means: "hours" is { "open": "HH:MM", "close": "HH:MM" } in 24-hour time with two digits each: "09:00", not "9:00" or "9am". Close can be after midnight ("01:00"). The shop still shuts from 2 AM to 7 AM.

How to fix it: Write both times with two-digit hours and minutes.

Bad (shops.json):

```
"hours": { "open": "9am", "close": "6pm" }
```

Fixed (shops.json):

```
"hours": { "open": "09:00", "close": "18:00" }
```

### shop-text

**Greeting or stock line too long**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "greeting" must be 1 to 160 characters with at most 3 line breaks
    shops: shop 1 "stock_line" must be 1 to 160 characters with at most 3 line breaks

From the mod list (upload):

    shops.json: shop 1's greeting must be 1 to 160 characters on at most 4 lines.

From the game (Mods tab row):

    shops: "greeting" and "stock_line" must be 1 to 160 characters, at most 3 newlines

What it means: "greeting" and "stock_line" are optional, each 1 to 160 characters with at most 3 line breaks (\n). They have to fit one message box with the keeper's own words after them.

How to fix it: Shorten the line.

### nook-api

**Nook's shop needs "api": 2**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: target "nook" needs "api": 2 in mod.json

From the mod list (upload):

    shops.json: target "nook" needs "api": 2 in mod.json.

What it means: Changing Nook's stock came with mod API level 2. A mod that says "api": 1 cannot use it.

How to fix it: Set "api": 2 in mod.json.

### nook-flower-key

**A flower shop setting on Nook's shop**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "hours" is the flower shop's: Nook's shop takes only "mode" and "stock"
    shops: shop 1 "greeting" is the flower shop's: Nook's shop takes only "mode" and "stock"
    shops: shop 1 "name" is the flower shop's: Nook's shop takes only "mode" and "stock"
    shops: shop 1 "stock_line" is the flower shop's: Nook's shop takes only "mode" and "stock"

From the mod list (upload):

    shops.json: shop 1's hours is the flower shop's. Nook's shop takes only mode and stock.

From the game (Mods tab row):

    shops: Nook's shop takes only "mode" and "stock", not: hours

What it means: Nook keeps his own name, hours and lines. A "nook" entry takes only "mode" and "stock"; "name", "hours", "greeting" and "stock_line" are the flower shop's.

How to fix it: Take those keys out of the "nook" entry.

### nook-mode

**Nook's "mode" is not "add" or "replace"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "mode" must be "add" or "replace"

From the mod list (upload):

    shops.json: shop 1's mode must be "add" or "replace".

From the game (Mods tab row):

    shops: Nook's "mode" must be "add" or "replace"

What it means: "add" (the default) puts your goods in up to half the spots of their kind each morning; "replace" puts them in all of them.

How to fix it: Write "mode": "add" or "mode": "replace", or leave it out.

### nook-stock

**Nook's "stock" must list 1 to 16 goods**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "stock" must list 1 to 16 items

From the mod list (upload):

    shops.json: shop 1's stock must list 1 to 16 items.

From the game (Mods tab row):

    shops: Nook's "stock" must list 1 to 16 goods

What it means: A "nook" entry lists 1 to 16 goods. How many show on a day depends on the store and the spots of each kind.

How to fix it: Keep 1 to 16 goods in the list.

### nook-item-refused

**A good Nook's cannot sell**

Seen in: Mods tab, on the mod's row after a restart; the check tool (npx playac-mod check).

In the game page (install, check tool):

    shops: shop 1 stock 2 "item" 0x2800 (apple) has no spot on Nook's shelves, so the game leaves it out of Nook's shop

From the game (Mods tab row):

    shops: a Nook's stock item cannot be sold, left out: 0x2800 has no spot on Nook's shelves
    shops: a Nook's stock item cannot be sold, left out: 0x2100 is money

What it means: Only the game knows its item tables, so this shows after a restart. A Nook's good must have a spot of its kind on his shelves (furniture, stationery, clothing, carpets, wallpaper, tools, umbrellas, paint, saplings, flower bags); fruit and the signboard have none. Money, tickets, grab bags, turnips and fossils are refused as at the flower shop. The good is left out; the rest work.

How to fix it: Pick a good of a kind Nook's sells.

### shop-stock

**"stock" must list 1 to 6 items**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 "stock" must list 1 to 6 items

From the mod list (upload):

    shops.json: shop 1's stock must list 1 to 6 items.

From the game (Mods tab row):

    shops: "stock" must list 1 to 6 goods

What it means: The flower shop has 6 table spots, so "stock" lists 1 to 6 goods.

How to fix it: Keep at most 6 items in the list.

### shop-item-twice

**An item is stocked twice**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 stock 2 is a duplicate item 0x2800
    shops: shop 1 stock 2 is a duplicate item 0x1000
    shops: shop 1 stock 2 is a duplicate item 0x10AA
    shops: shop 1 stock 2 is a duplicate item 0x28AA
    shops: shop 1 stock 2 is a duplicate item 0x28AB
    shops: shop 1 stock 2 is a duplicate item test.mod:tea-chest

From the mod list (upload):

    shops.json: shop 1's stock lists item 0x2800 twice.

From the game (Mods tab row):

    shops: a stock item is listed twice: 0x2800

What it means: Each item can be on the tables once. "0x28aa" and "0x28AA" are the same item.

How to fix it: Remove the second one.

### shop-item-refused

**An item that cannot be sold**

Seen in: Mods tab, on the mod's row after a restart; the check tool (npx playac-mod check).

In the game page (install, check tool):

    shops: shop 1 stock 6 "item" 0x1000 (spooky wardrobe) has no shop shelf model, so the game leaves it out of the flower shop

From the game (Mods tab row):

    shops: a stock item cannot be sold, left out: 0x2B00 is money
    shops: a stock item cannot be sold, left out: 0x1234 has no shop shelf model

What it means: The game checks each good against its item tables when it starts, and shows this on the mod's row; `npx playac-mod check` warns about the same goods before you install. The item was left out and the rest of the shop works. Refused: things that are not items, money, tickets, grab bags, turnips, fossils, and goods with no model for a shop table, which includes every piece of the game's own furniture. A mod's OWN new items (api 2) are always fine at the flower shop.

How to fix it: Pick another item from the item list in the reference: it has a Flower shop column. To sell furniture at the flower shop, make it a mod item of your own; Nook's shop (target nook) sells the game's furniture.

### shop-item

**A stock "item" is not "0x" and 4 hex digits**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 stock 1 "item" must be "0x" and 4 hex digits, like "0x2800"

From the mod list (upload):

    shops.json: shop 1's stock item 10240 must be a string like "0x2800".

From the game (Mods tab row):

    shops: a stock item must be {"item": "0x" and four hex digits}: 2800

What it means: An item number is a STRING: "0x" and exactly 4 hex digits, like "0x2800". A plain number (10240 or 0x2800 without quotes) is refused.

How to fix it: Put the item number in quotes with 0x in front.

Bad (shops.json):

```
"stock": [{ "item": 0x2800, "price": 600 }]
```

Fixed (shops.json):

```
"stock": [{ "item": "0x2800", "price": 600 }]
```

### shop-price

**A price is not 1 to 99999 Bells**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: shop 1 stock 1 "price" must be a whole number from 1 to 99999

From the mod list (upload):

    shops.json: shop 1's price for 0x2800 must be a whole number from 1 to 99999.

From the game (Mods tab row):

    shops: a price must be a whole number of Bells, 1 to 99999: 0x2800

What it means: "price" is optional: a whole number of Bells from 1 to 99999, not in quotes. Leave it out for the game's usual price. A price under what Nook pays for the item is raised to that, so a shop cannot be used to make Bells.

How to fix it: Write a whole number like 600, or leave "price" out.

### shop-price-floor

**A price the game raises**

Seen in: the check tool (npx playac-mod check).

In the game page (install, check tool):

    shops: shop 1 stock 1 "price" 50 is under the floor for 0x2800 (apple) at the flower shop: the game sells it for 500

What it means: Not an error: the game installs the mod. A shop never sells a good for less than what any Nook pays for it, so a lower price is raised. The floor is the good's buy-back price (a quarter of its usual price), and 500 Bells for a town fruit (apple, cherry, pear, peach, orange) at the flower shop: what Nook pays for a fruit from another town. The item list in the reference shows each good's floor.

How to fix it: Ask at least the floor, or leave "price" out for the game's usual price.

## New items (api 2)

### items-list

**items.json needs an "items" list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: "items" must be a list of 1 to 64 items

From the mod list (upload):

    items.json needs an "items" list of 1 to 64 items.

What it means: The file named by "content.items" holds {"items": [...]} with 1 to 64 items.

How to fix it: Put your items in an "items" list, at most 64 of them.

Fixed (items.json):

```
{"items": [{"id": "tea-chest", "name": "Tea Chest", "base": "0x1000", "price": 1800}]}
```

### item-not-object

**An item is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 is not an object

From the mod list (upload):

    items.json: item 1 must be an object.

What it means: Each entry of "items" is an object with id, name, base and an optional price.

How to fix it: Write each item as {"id": ..., "name": ..., "base": ...}.

### item-setting

**An unknown item setting**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "model" is not an item setting (only id, name, base, price)

From the mod list (upload):

    items.json: item 1's "model" is not an item setting. Use id, name, base, price.

What it means: An item may only have id, name, base and price.

How to fix it: Remove the other keys. The look comes from "base"; a texture mod can recolor it.

### item-id

**An item id is not allowed**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "id" must be 1 to 32 of a-z, 0-9 and -, starting with a letter or digit

From the mod list (upload):

    items.json: item 1's id must be 1 to 32 of a-z, 0-9 and -, starting with a letter or digit.

What it means: An item id is short and lowercase. Its full id is your mod id, a colon and this id, like bean.tea-house:tea-chest.

How to fix it: Use lowercase letters, digits and dashes, at most 32.

### item-id-twice

**Two items share an id**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 2 repeats the id "tea-chest"

From the mod list (upload):

    items.json: two items have the id "tea-chest".

From the game (Mods tab row):

    items: an id is listed twice, the second is left out: tea-chest

What it means: Each item id names one item.

How to fix it: Give the second item its own id.

### item-name

**An item name the game cannot show**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "name" must be 1 to 16 letters, digits, spaces or ' . , ! & -, starting with a letter or digit and not ending with a space

What it means: The game's name box holds 16 characters, and its font draws letters, digits, spaces and ' . , ! & - only.

How to fix it: Shorten the name to 16 characters and use only those characters.

### item-base

**An item "base" is not south-facing furniture**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "base" must be a furniture id facing south: 0x1000 to 0x1FFC or 0x3000 to 0x33C4, a multiple of 4
    items: item 1 "base" must be "0x" and 4 hex digits, a furniture id like "0x1234"

What it means: A mod item borrows the model of a vanilla piece of furniture: "base" is that furniture's id, as a string, facing south.

How to fix it: Pick a furniture id from the item list in the reference, written like "0x1000". Its number is a multiple of 4.

### item-price

**An item price is out of range**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "price" must be a whole number from 1 to 99999

From the game (Mods tab row):

    items: a price must be a whole number of Bells, 1 to 99999, left out: tea-chest

What it means: A price is a whole number of Bells from 1 to 99999. Leave it out to use the base furniture's price.

How to fix it: Use a whole number from 1 to 99999, or remove "price".

### item-malformed

**The game left out a malformed item**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: a malformed item is left out: tea-chest

What it means: The game read an item whose id, name or base breaks the rules above, or which holds a key other than id, name, base and price, and left that one item out. The install check refuses all of these first, so you only meet this when the mod reaches the game another way (developer mode, a mod edited after it was installed).

How to fix it: Check the item against the rules: id 1 to 32 of a-z 0-9 -, name 1 to 16 characters the game can draw, base a south-facing furniture id written "0x1234", and no other keys. Run the check tool.

### item-base-refused

**The game cannot use this base for a mod item**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: this base cannot be a mod item, left out: tea-chest: base 0x1004 has no model

What it means: Only the game knows its furniture tables, so this is checked when the game starts, not at install. A base with no model, a fossil, a gyroid, a mannequin or umbrella design piece, clothing, or a piece that turns into a pocket item (a balloon, diary, fan or pinwheel) cannot carry a mod item. That item is left out; the rest of the mod loads.

How to fix it: Pick another south-facing furniture id from the item list in the reference (the reason after the id says what was wrong with this one).

### items-too-many-total

**More than 512 mod items across all mods**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: the game holds 512 mod items at most, the rest are left out: tea-chest

What it means: The game holds 512 mod items from all switched-on mods together. Items past that, in load order, are left out.

How to fix it: Switch off a mod with many items, or move the mod whose items you want first in the list.

### shop-mod-item-unknown

**A shop stocks an item this mod does not have**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: shop 1 stock 1 "item" other.mod:tea-chest is not an item in this mod's items file
    shops: shop 1 stock 1 "item" test.mod:nope is not an item in this mod's items file

What it means: A shop can stock this mod's own items by full id. Another mod's items cannot be stocked.

How to fix it: Use an id from your items file, like your.mod:tea-chest, or a vanilla item like "0x2800".

### shop-furniture-shared

**Two goods share one furniture**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: shop 1 stock 2 shares its furniture 0x1000 with another good of this shop
    shops: shop 1 stock 2 shares its furniture 0x1008 with another good of this shop

What it means: A mod item is that furniture in the save, so one shop cannot sell the base and the mod item, or two mod items on one base.

How to fix it: Give one of them another base, or drop one from the stock.

### item-renames

**"renames" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "renames" needs "content.items": a rename names an item of this mod
    "renames": "chest" must be a full item id like author.mod:thing
    "renames": "test.mod:tea-chest" renames an item to itself
    "renames" must be an object of old item id to new item id
    "renames": "old.mod:chest" must point at an item of this mod, like test.mod:thing
    "renames": "old.mod:chest" points at test.mod:nope, which is not in items.json

What it means: "renames" moves items placed under an old full id to one of this mod's items, once per save. Each key is an old full id, each value a full id of an item in your items file.

How to fix it: Write it as {"old.mod:chest": "your.mod:tea-chest"}, with content.items set, and never rename an item to itself.

## letters.json (api 2)

### target-not-object

**A letter, event or pool is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 is not an object
    talk: pool 2 is not an object

From the mod list (upload):

    letters.json: letter 1 must be an object.
    talk.json: pool 2 must be an object.

From the game (Mods tab row):

    letters: a letter must be an object
    events: an event must be an object
    talk: a pool must be an object: pool 2

What it means: Each entry of the list is a JSON object in { }.

How to fix it: Write each entry as an object, like { "id": "thanks", ... }.

### target-id

**A letter or event "id" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "id" must be 1 to 48 of a-z 0-9 _ . -
    events: event 2 "id" "fair" is used twice
    events: event 2 "id" "harvest" is used twice
    letters: letter 2 "id" "thanks" is used twice

From the mod list (upload):

    letters.json: letter 1's id must be 1 to 48 of a-z, 0-9, _ . and -.
    events.json: the id "fair" is used twice.

From the game (Mods tab row):

    letters: an "id" must be 1 to 48 of a-z 0-9 _ . -: Thanks
    events: an "id" is used twice, the second is left out: fair

What it means: Each letter and event has its own "id": 1 to 48 lowercase letters, digits, _ . or -, not used twice in the file. A command names a letter "your.mod:<id>".

How to fix it: Give each entry a distinct lowercase id.

### letters-file

**letters.json needs a "letters" list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: "letters" must be a list of 1 to 32 letters

From the mod list (upload):

    letters.json needs a "letters" list of 1 to 32 letters.

From the game (Mods tab row):

    letters file needs a "letters" list of 1 to 32

What it means: letters.json is { "letters": [ ... ] } with 1 to 32 letters. Needs "api": 2.

How to fix it: Wrap the letters in a "letters" list.

Fixed (letters.json):

```
{ "letters": [{ "id": "thanks", "header": "Dear {player},", "body": "Thank you!", "footer": "A friend" }] }
```

### letter-header

**A letter "header" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "header" must be 1 to 24 plain characters besides one {player}

From the mod list (upload):

    letters.json: letter 1's header must be 1 to 24 plain characters besides one {player}.

From the game (Mods tab row):

    letters: "header" must be 1 to 24 plain characters besides {player}: thanks
    letters: "header" is too long: thanks

What it means: The header is the letter's first line: 1 to 24 plain characters (letters, digits and signs on a US keyboard), no line break, with {player} at most once where the name goes. No other { or }.

How to fix it: Shorten it, keep to plain characters, write {player} once.

### letter-body

**A letter "body" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines
    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines: "é" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })
    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines: "{" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })

From the mod list (upload):

    letters.json: letter 1's body must be 1 to 192 plain characters on at most 6 lines.
    letters.json: letter 1's body must be 1 to 192 plain characters on at most 6 lines: "’" at character 12 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or }).

From the game (Mods tab row):

    letters: "body" must be 1 to 192 plain characters on at most 6 lines: thanks

What it means: The body is 1 to 192 plain characters on at most 6 lines (\n breaks a line). No accents, no curly quotes, no { or }. When a character is the problem, the message names the first one and its place (counting from 1): a curly quote or apostrophe pasted from a word processor is the usual one.

How to fix it: Shorten it, or replace the character the message names with a plain one (a straight ' for a curly one).

### paper-fit

**Text does not fit the letter paper or a board page**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    letters: "body" does not fit on the letter paper (6 lines): thanks
    events: "board" does not fit on a board page (6 lines): fair

What it means: The game wraps a letter body and a board notice at the paper's width (192 pixels in its own font, words kept whole). This text needs more than 6 lines that way, so it is left out. Only the game measures this, so it shows after a restart.

How to fix it: Shorten the text, or break it into shorter lines yourself with \n.

### letter-footer

**A letter "footer" is not 1 to 32 plain characters**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "footer" must be 1 to 32 plain characters

From the mod list (upload):

    letters.json: letter 1's footer must be 1 to 32 plain characters.

From the game (Mods tab row):

    letters: "footer" must be 1 to 32 plain characters: thanks

What it means: The footer is the sign-off, like "Tom Nook": 1 to 32 plain characters on one line.

How to fix it: Shorten it and keep it on one line.

### letter-sender

**A letter "sender" is not 1 to 8 plain characters**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "sender" must be 1 to 8 plain characters

From the mod list (upload):

    letters.json: letter 1's sender must be 1 to 8 plain characters.

From the game (Mods tab row):

    letters: "sender" must be 1 to 8 plain characters: thanks

What it means: The sender is the name the mailbox list shows for the letter, and the list has room for 8 characters. It is optional: without it the list shows the footer's first 8 characters, and the letter itself always signs with the whole footer.

How to fix it: Use a short name of 1 to 8 plain characters on one line, like "Lanterns", or leave "sender" out.

### letter-item

**A letter "item" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "item" must be "0x" and 4 hex digits, like "0x2800"

From the mod list (upload):

    letters.json: letter 1's item 10240 must be a string like "0x2800".

From the game (Mods tab row):

    letters: "item" must be "0x" and four hex digits: thanks
    letters: the item cannot be sent, the letter is left out: thanks: 0x2100 is money

What it means: A present is a STRING, "0x" and 4 hex digits. Money, turnips, tickets, grab bags, fossils and things that are not items or furniture cannot be sent (the game checks that).

How to fix it: Write the item like "0x2800", or pick another present.

### letter-paper

**A letter "paper" is not 0 to 63**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "paper" must be a whole number from 0 to 63

From the mod list (upload):

    letters.json: letter 1's paper must be a whole number from 0 to 63.

From the game (Mods tab row):

    letters: "paper" must be a whole number 0 to 63: thanks

What it means: "paper" picks the stationery: a whole number from 0 to 63. Leave it out for the first one.

How to fix it: Write a whole number from 0 to 63.

### targets-out-of-memory

**The game ran out of memory reading a file**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    letters: out of memory: thanks

What it means: The browser could not give the game memory for this entry. It is left out.

How to fix it: Restart the game; switch off large mods if it happens again.

## events.json (api 2)

### events-file

**events.json needs an "events" list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: "events" must be a list of 1 to 16 events

From the mod list (upload):

    events.json needs an "events" list of 1 to 16 events.

From the game (Mods tab row):

    events file needs a "events" list of 1 to 16

What it means: events.json is { "events": [ ... ] } with 1 to 16 events. Needs "api": 2.

How to fix it: Wrap the events in an "events" list.

### event-date

**An event "date" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 "date" must be { "month", "day" } or { "month", "week" (1 to 4 or "last"), "weekday" (0 Sunday to 6) }

From the mod list (upload):

    events.json: event 1's date must be {month, day} or {month, week 1 to 4 or "last", weekday 0 (Sunday) to 6}.

From the game (Mods tab row):

    events: "date" must be {month, day} or {month, week 1-4 or "last", weekday 0-6}: fair

What it means: A date is a month (1 to 12) with either a day of that month (February 29 works) or a week (1 to 4, or "last") and a weekday (0 is Sunday). Not both forms.

How to fix it: Write { "month": 11, "day": 20 } or { "month": 11, "week": 4, "weekday": 4 }.

### event-empty

**An event with nothing in it**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 needs a "board" notice, "talk" lines or a "letter"

From the mod list (upload):

    events.json: event 1 needs a board notice, talk lines or a letter.

From the game (Mods tab row):

    events: an event needs a "board" notice, "talk" lines or a "letter": fair

What it means: An event does something on its day: a "board" notice, "talk" lines, a "letter" in the mailbox, or any of them together.

How to fix it: Add a "board" notice, "talk" lines or a "letter".

### event-letter

**An event "letter" is not one of the mod's letters**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 "letter" "lantern" names no letter in this mod's letters file
    events: event 1 "letter" must be the id of a letter in this mod's letters file
    events: event 1 "letter" "lanterns" names no letter in this mod's letters file

From the mod list (upload):

    events.json: event 1's letter "lantern" names no letter in this mod's letters file.
    events.json: event 1's letter must be the id of a letter in this mod's letters file.

From the game (Mods tab row):

    events: "letter" names no letter in this mod's letters file: lantern-night
    events: "letter" must be the id of a letter in this mod's letters file: lantern-night

What it means: An event's "letter" is the "id" of a letter in the SAME mod's letters file (content.letters). The game mails it on the event's day, once, to the player's mailbox in their own town, and it counts against the mod's daily letter cap. A letter the game left out (one that does not fit the paper, say) cannot be sent either.

How to fix it: Add the letter to your letters file, or fix the id to match one there exactly.

Bad (events.json):

```
{ "events": [{ "id": "lantern-night", "date": { "month": 11, "day": 13 }, "letter": "lantern" }] }
```

Fixed (events.json):

```
{ "events": [{ "id": "lantern-night", "date": { "month": 11, "day": 13 }, "letter": "lanterns" }] }
```

### event-board-world

**A board notice needs "scope": "world"**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 "board" changes the town, so "scope" must be "world"

From the mod list (upload):

    events.json: event 1's board notice changes the town, so mod.json needs "scope": "world".

From the game (Mods tab row):

    events: a "board" notice changes the town, so the mod needs "scope": "world": fair

What it means: A notice goes up on your town's bulletin board, which a visitor reads too, so a mod with one is a world mod. Talk lines alone can be client.

How to fix it: Set "scope": "world", or keep only "talk" lines.

### event-board

**An event "board" notice is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 "board" must be 1 to 192 plain characters on at most 6 lines
    events: event 1 "board" must be 1 to 192 plain characters on at most 6 lines: a control character (U+0009) at character 3 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })
    events: event 1 "board" must be 1 to 192 plain characters on at most 6 lines: "é" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })

From the mod list (upload):

    events.json: event 1's board must be 1 to 192 plain characters on at most 6 lines.

From the game (Mods tab row):

    events: "board" must be 1 to 192 plain characters on at most 6 lines: fair

What it means: A notice is plain text like a letter body: 1 to 192 characters on at most 6 lines. When a character is the problem, the message names the first one and its place.

How to fix it: Shorten it and keep to plain characters.

### event-talk

**An event's "talk" lines are not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    events: event 1 "talk" must list 1 to 16 lines of 1 to 160 characters with at most 3 line breaks

From the mod list (upload):

    events.json: event 1's talk must list 1 to 16 lines of 1 to 160 characters on at most 4 lines each.

From the game (Mods tab row):

    events: "talk" must list 1 to 16 lines: fair
    events: a talk line must be 1 to 160 characters, at most 3 newlines: fair

What it means: "talk" lists 1 to 16 lines villagers say that day, each 1 to 160 characters with at most 3 line breaks.

How to fix it: Shorten the lines or the list.

## talk.json (api 2)

### talk-file

**talk.json needs a "pools" list**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: "pools" must be a list of 1 to 32 pools

From the mod list (upload):

    talk.json needs a "pools" list of 1 to 32 pools.

From the game (Mods tab row):

    talk file needs a "pools" list of 1 to 32

What it means: talk.json is { "pools": [ ... ] } with 1 to 32 pools. Needs "api": 2.

How to fix it: Wrap the pools in a "pools" list.

### talk-who

**A pool names a personality and a villager**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 names a "personality" or a "villager", not both

From the mod list (upload):

    talk.json: pool 1 names a personality or a villager, not both.

From the game (Mods tab row):

    talk: a pool names a "personality" or a "villager", not both: pool 1

What it means: A pool is for one villager, one personality, or (with neither) everyone.

How to fix it: Keep one of the two, or split the pool in two.

### talk-personality

**A pool's "personality" is not one the game has**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "personality" must be one of normal, peppy, lazy, jock, cranky, snooty

From the mod list (upload):

    talk.json: pool 1's personality must be one of normal, peppy, lazy, jock, cranky, snooty.

From the game (Mods tab row):

    talk: "personality" must be normal, peppy, lazy, jock, cranky or snooty: pool 1

What it means: The game has six villager personalities: normal, peppy, lazy, jock, cranky and snooty (lowercase).

How to fix it: Use one of the six.

### talk-villager

**A pool's "villager" is not a name**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "villager" must be a name of 1 to 8 plain characters

From the mod list (upload):

    talk.json: pool 1's villager must be a name of 1 to 8 plain characters.

From the game (Mods tab row):

    talk: "villager" must be a name of 1 to 8 plain characters: pool 1

What it means: A villager is named as the game spells it, 1 to 8 plain characters, any case ("Bob").

How to fix it: Write the villager's name.

### talk-chance

**A pool's "chance" is not 1 to 100**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "chance" must be a whole number from 1 to 100

From the mod list (upload):

    talk.json: pool 1's chance must be a whole number from 1 to 100.

From the game (Mods tab row):

    talk: "chance" must be a whole number 1 to 100: pool 1

What it means: "chance" is how many days in 100 the pool speaks to a villager: a whole number from 1 to 100. Leave it out for every day.

How to fix it: Write a whole number from 1 to 100.

### talk-lines

**A pool's "lines" are not right**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "lines" must list 1 to 32 lines of 1 to 160 characters with at most 3 line breaks

From the mod list (upload):

    talk.json: pool 1's lines must list 1 to 32 lines of 1 to 160 characters on at most 4 lines each.

From the game (Mods tab row):

    talk: "lines" must list 1 to 32 lines: pool 1
    talk: a line must be 1 to 160 characters, at most 3 newlines: pool 1

What it means: A pool has 1 to 32 lines, each 1 to 160 characters with at most 3 line breaks.

How to fix it: Shorten the lines or the list.

## Settings, translations, dependencies (api 2)

### manifest-depends

**depends or conflicts is not a list of mods**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "depends" must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}
    "depends" names the mod itself
    "bean.lib" is in both "depends" and "conflicts"
    "conflicts" must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}
    "depends" may name at most 16 mods
    "depends": "Bean.Lib" is not a mod id

From the mod list (upload):

    depends must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}.
    "bean.lib" is in both depends and conflicts.

What it means: "depends" and "conflicts" (api 2) are objects: each key a mod id (not your own), each value a version range. At most 16 each, and one mod cannot be in both.

How to fix it: Write them as { "author.mod": ">=1.0.0" }, with "api": 2.

Fixed (mod.json):

```
"depends": { "yourname.tea-lib": ">=1.0.0 <2.0.0" },
"conflicts": { "someone.other-shop": "*" }
```

### manifest-depends-range

**A version range the game cannot read**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "depends": the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"
    "conflicts": the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"

From the mod list (upload):

    depends: the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0".

What it means: A range is "*" (any version) or up to 4 comparisons split by ONE space, each >=, <=, >, <, = (or none, which means =) and an x.y.z version. "^" and "~" are not ranges here.

How to fix it: Write ">=1.0.0 <2.0.0" instead of "^1.0.0", and "1.2.3" for one exact version.

### manifest-data-version

**data_version is not a whole number**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "data_version" must be a whole number from 1 to 1000000
    "scripts.hooks" lists "migrate", which needs a "data_version"

From the mod list (upload):

    data_version must be a whole number from 1 to 1000000.
    The migrate hook needs a data_version.

What it means: "data_version" (api 2) is a whole number from 1 to 1000000 for the shape of what your script saves. The "migrate" hook runs when it changes, so it needs one.

How to fix it: Add "data_version": 1 and raise it when you change what your script saves.

### manifest-setting-value

**A setting's default or bounds are wrong**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    settings: "price" "default" must be a whole number from min to max
    settings: "drink" "choices" must list 2 to 16 different texts of 1 to 40 characters
    settings: "x" "choices" must list 2 to 16 different texts of 1 to 40 characters
    settings: "x" "default" must be a whole number from min to max
    settings: "x" "default" must be one of its choices
    settings: "x" "default" must be text of at most max_length characters, on one line

From the mod list (upload):

    settings: "price" default must be a whole number from min to max.
    settings: "motto" max_length must be a whole number from 1 to 200.

What it means: bool: default true or false. number: whole min, max and default, min below max, default between them, within a billion. choice: 2 to 16 different choices, default one of them. text: max_length 1 to 200, default one line no longer than that.

How to fix it: Fix the default or bounds the message names.

Fixed (mod.json):

```
"settings": [
  { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 }
]
```

### manifest-settings

**A setting is not one the game can show**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "settings" must be a list of at most 16 settings
    settings: setting 1 "name" must be 1 to 32 of a-z 0-9 _, starting with a letter
    settings: "greet" is declared twice
    settings: "x" has "min", which a bool setting does not take
    settings: "x" "description" must be text of at most 200 characters
    settings: "x" "label" must be 1 to 60 characters

From the mod list (upload):

    settings must be a list of at most 16 settings.
    settings: "x" type must be one of bool, number, choice, text.
    settings: "x" label must be 1 to 60 characters.

What it means: "settings" (api 2) lists at most 16 settings. Each has a name (a-z 0-9 _, starting with a letter, used once), a type (bool, number, choice, text), a label of 1 to 60 characters, an optional description of at most 200, and only the keys its type takes.

How to fix it: Fix the setting the message names. A bool takes only default; a number default, min and max; a choice default and choices; a text default and max_length.

### messages-translations

**A translations folder the game cannot read**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content.messages": messages/ja.json is not one of en.json de.json es.json fr.json it.json
    "content.messages" names a folder without en.json: English is the fallback for every language
    messages/fr: "helo" is not in en.json (a translation holds only keys en.json has)
    "content.messages": messages/notes.txt is not one of en.json de.json es.json fr.json it.json
    "content.messages": messages/old/en.json is not one of en.json de.json es.json fr.json it.json

From the mod list (upload):

    content.messages: messages/ja.json is not one of en.json de.json es.json fr.json it.json.
    content.messages names a folder without en.json: English is the fallback for every language.

What it means: At api 2 "content.messages" can name a folder of translations: en.json (required, the fallback) and any of de.json, es.json, fr.json, it.json, nothing else. A translation may only hold keys en.json has.

How to fix it: Add en.json, rename or remove the other files, and fix the key spelling in the translation.

### setting-refused

**A setting value was refused**

Seen in: the Mods tab.

In the game page (install, check tool):

    Say hello must be on or off
    Fruit price must be a whole number from 100 to 5000
    Drink must be one of: tea, coffee
    Motto must be at most 20 characters, on one line

What it means: The Mods tab refused a value for a mod's setting: it is outside what the mod allows.

How to fix it: Pick a value inside the range or list the message gives.

### boot-dependency

**A mod it needs did not load**

Seen in: Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    needs x.gone *, which is not installed
    needs b.off, which is switched off
    needs b.lib >=2.0.0, and 1.0.0 is installed
    needs a.miss, which did not load
    is in a dependency cycle (c.one, c.two): none of them can load
    cannot run with b.lib 1.0.0: switch one of them off

What it means: A mod that lists "depends" loads only when every mod it needs is installed, on, in the version range and loaded. A mod that lists "conflicts" stays off while that mod is on. Mods that need each other in a circle cannot load.

How to fix it: Install or switch on the mod it names (or the right version of it), or switch off one of two mods that cannot run together.

### engine-settings

**The game could not hand a setting to the script**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    settings: a value is not a boolean, a whole number or a line of text: frac
    settings: a text value cannot be used: motto

What it means: A stored setting value is not one the game can hand a script. The Mods tab never stores one like it; this means the browser's copy was changed by hand.

How to fix it: Open the mod's Settings and set the value again, then restart.

## Messages files

### messages-not-object

**A messages file is not key to text**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: the file is not a JSON object of key to text

From the mod list (upload):

    messages/en.json must be a JSON object of line ids to text.

From the game (Mods tab row):

    messages file is not a JSON object

What it means: A messages file is one flat object: each key is a line id, each value the line's text. No lists, no nested objects.

How to fix it: Write it as { "greet": "Hello!", "bye": "See you!" }.

### messages-too-many

**More than 256 lines**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: at most 256 lines per mod

From the mod list (upload):

    messages/en.json has 300 lines, more than 256.

From the game (Mods tab row):

    messages: a mod has at most 256 lines

What it means: A mod can hold at most 256 lines.

How to fix it: Split the lines into two mods, or reuse lines.

### messages-key

**A line id is not 1 to 48 of a-z 0-9 _ . -**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: key "Hours" must be 1 to 48 of a-z 0-9 _ . -
    messages: key "" must be 1 to 48 of a-z 0-9 _ . -
    messages: key "$schema" must be 1 to 48 of a-z 0-9 _ . -
    messages: key "Hello" must be 1 to 48 of a-z 0-9 _ . -
    messages: key "a b" must be 1 to 48 of a-z 0-9 _ . -
    messages: key "a:b" must be 1 to 48 of a-z 0-9 _ . -

From the mod list (upload):

    messages/en.json: the line id "Hours" must be 1 to 48 of a-z, 0-9, _ . and -.

From the game (Mods tab row):

    messages: a key must be 1 to 48 of a-z 0-9 _ . -: Hours

What it means: Line ids are 1 to 48 characters of lowercase a-z, digits, "_", "." and "-". No spaces, capitals or ":". Your mod's id is added in front for you ("yourname.my-mod:greet").

How to fix it: Rename the key: "hours" or "shop.hours".

### messages-text

**A line is empty or over 400 bytes**

Seen in: Mods tab, when you install a ZIP; the check tool (npx playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: "greet" must be text of 1 to 400 bytes
    messages/fr: "hello" must be text of 1 to 400 bytes
    messages: "a" must be text of 1 to 400 bytes
    messages: "k" must be text of 1 to 400 bytes

From the mod list (upload):

    messages/en.json: the line "greet" must be text of 1 to 400 bytes.

From the game (Mods tab row):

    messages: a line must be text of 1 to 400 bytes: greet

What it means: Each line is text (in quotes) of 1 to 400 bytes. Letters with accents and emoji take more than one byte. Lines wrap at 24 characters, 4 lines to a page.

How to fix it: Shorten the line, or split it into two lines your script shows one after the other.

### messages-out-of-memory

**Out of memory reading lines**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    messages: out of memory

What it means: The game ran out of memory while reading lines. This is very unlikely with normal mods.

How to fix it: Switch some mods off and restart. If it keeps happening, report it.

## Textures and images

### texture-copied

**An unchanged copy of a game texture**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "textures/tex1_64x64_626709d910129694_14.dds" is an unchanged copy of a texture from the game (tex1_64x64_626709d910129694_14). Upload only art you made yourself.

What it means: Every pixel of this texture equals a texture from the game or the HD pack. Mods may only hold art you made. Exported textures from the texture inspector are the game's own art until you paint over them.

How to fix it: Paint your own picture into the file (keep the file name), or delete files you did not change.

### texture-mipmaps

**A DDS with mipmaps or extra bytes**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "textures/a.dds" stores 7 mip levels. Save it with one level (no mipmaps): the game reads only the first.
    "textures/a.dds" has 64 bytes after its image. Save it with one level (no mipmaps) and nothing else.

What it means: The game reads only the first level of a DDS, so anything after it would go unreviewed. The registry refuses it.

How to fix it: Save the DDS again with mipmaps switched off (in GIMP: "Mipmaps: No mipmaps"; in Paint.NET untick "Generate mip maps").

### texture-size

**A texture is too big**

Seen in: Share a mod, when you upload; Mods tab, on the mod's row after a restart.

From the mod list (upload):

    "textures/a.dds" is 32768x32768. A texture is 1 to 16384 pixels a side.
    "art.png" is 4096x4096. A PNG in a mod is at most 4194304 pixels (2048x2048).
    "notes.txt" is a 9000x9000 JPEG.

From the game (Mods tab row):

    PNG texture is over 2048x2048, left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: A DDS is 1 to 16384 pixels a side; a PNG at most 2048x2048 (the game draws a PNG texture too, and leaves out a bigger one). Bigger textures also cost phone players memory.

How to fix it: Scale it down. 2x or 4x the original size already looks sharp.

### texture-small

**A picture smaller than, or not the shape of, the texture it replaces**

Seen in: the check tool (npx playac-mod check).

In the game page (install, check tool):

    textures/tex1_64x64_0123456789abcdef_14.dds is 32x32, smaller than the original 64x64: the game stretches it over the original's place, so it looks blurrier than the game's own texture
    textures/tex1_64x64_0123456789abcdef_14.dds is 128x64, not the shape of the original 64x64: the game stretches it to the original's shape, so it looks squashed

What it means: Not an error: the game installs the mod and draws the picture. The name says the original's size (tex1_64x64_...); the game always draws your picture in the original's place, so a smaller one looks blurry and one of another shape looks squashed.

How to fix it: Paint at the original size, or 2 or 4 times it in both directions (128x128 for a 64x64).

### texture-png-unreadable

**The game could not read a PNG texture**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    texture is not a PNG the game reads, left out: textures/tex1_64x64_0123456789abcdef_14.png
    PNG texture could not be read (image data is damaged), left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: The game draws a .png texture by decoding it itself. This file is not a PNG, or is damaged, or uses a kind of PNG the game does not decode, so it is left out (the reason in brackets says why). The rest of the mod loads.

How to fix it: Export the picture again as a plain 8-bit RGBA or RGB PNG from your paint program, or save it as a .dds.

### texture-png-budget

**Too many PNG pixels across your mods**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    PNG textures are over 96 MiB of pixels, this one left out: textures/tex1_64x64_0123456789abcdef_14.png
    PNG textures are over 24 MiB of pixels on a phone, this one left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: Every switched-on mod's PNG textures together may decode to at most 96 MiB of pixels (4 bytes a pixel), 24 MiB on a phone or low-memory device. PNGs past that, in load order, are left out; DDS textures do not count.

How to fix it: Make your PNGs smaller (2x the original size is already sharp), switch off another texture mod, or save the big textures as compressed .dds (BC7 or DXT5).

### texture-twice

**The same texture as a PNG and a DDS**

Seen in: the check tool (npx playac-mod check).

In the game page (install, check tool):

    textures/tex1_64x64_0123456789abcdef_14.dds and textures/tex1_64x64_0123456789abcdef_14.png are the same texture: the game uses only one of them (the first it finds when it scans the folder, which you cannot choose), so the other is never drawn

What it means: Not an error: the game installs the mod. A .png and a .dds with the same name are the same texture, and the game keeps whichever it finds first. You cannot choose which.

How to fix it: Keep one of the two files and delete the other.

### picture-misnamed

**A picture in the wrong kind of file**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "notes.txt" holds a PNG picture. Pictures go in .png or .dds files.
    "a.png" is named as .png but holds a DDS texture. Save it in the format its name says.
    "photo.png" is a picture in a format mods can't carry. Save it as PNG or DDS.

What it means: Every file is checked for what it really holds. A picture renamed to .txt, .json or .md would reach players as text, where no moderator looks, so it is refused; so is a .png that is really a DDS (or the other way round), and JPEG, GIF, WebP and other formats.

How to fix it: Save each picture as a real .dds (textures) or .png, with the extension that matches what it is.

### png-extra-data

**A PNG with animation or app data**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "art.png" holds a acTL chunk, which a picture in a mod may not carry (an animation frame or app data). Export it again as a plain PNG.
    "art.png" holds more than 64 KiB of metadata. Export it again without metadata.

What it means: A PNG in a mod is a plain picture: no animation frames (APNG), no data hidden in extra chunks, and only a little metadata. Hidden data would go unreviewed.

How to fix it: Export the picture again as a plain PNG, with "save metadata" (EXIF, XMP, comments, color profile) switched off.

### texture-format

**A texture format the game cannot load**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "textures/a.dds" is not a DDS file.
    "textures/a.dds" is a DDS format the game can't load (DXT3). Save it as BC7, DXT1, DXT5 or uncompressed 32-bit RGBA.
    "textures/a.dds" is cut short.
    "art.png" is not a PNG we can read.

What it means: A .dds must be BC7, DXT1 (BC1), DXT5 (BC3) or uncompressed 32-bit RGBA; a .png must be a normal PNG. Other formats (DXT3, 16-bit, 24-bit) and damaged files are refused. The game skips a texture it cannot read, so it would never show.

How to fix it: Export again as BC7 or DXT5 (or uncompressed RGBA 8888) with no mipmaps.

### log-texture-not-read

**A texture file was left out**

Seen in: the Mod log in Settings, Mods; Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    texture textures/grass.jpg not read: only .dds and .png files in the textures folder are textures
    texture textures/grass.dds not read: the name is not a texture name (tex1_WxH_hash[_palette]_fmt.dds or .png)
    texture textures/tex1_32x32_626709d910129694_193ca5974976e36e_8.dds could not be read: not a DDS this browser can draw (BC7, BC1, BC3 or RGBA)

What it means: The game reads only files named the way the HD pack names them (tex1_WxH_hash..._fmt), as DDS or PNG, from the textures folder. Anything else there is skipped.

How to fix it: Name the file after the texture it replaces (the texture inspector copies the name for you), save it as .dds (BC7, BC1, BC3 or uncompressed RGBA) or .png, and reload.

## The texture inspector (dev mode)

### inspector-no-scene

**The game is not in a scene yet**

Seen in: Settings, Mods, Developer (open the game with ?moddev=1).

On the site:

    The game is not in a scene yet. Start or load your town, then try again.

What it means: The inspector records what the game draws, and nothing is drawn on the title screen.

How to fix it: Load your town first, then press Record textures.

### inspector-texture-gone

**That texture is no longer kept**

Seen in: Settings, Mods, Developer (open the game with ?moddev=1).

On the site:

    That texture is no longer kept. It shows again once the game draws it.

What it means: The inspector keeps up to 512 textures and 16 MB, dropping the one drawn longest ago, and Stop recording frees them all.

How to fix it: Walk back to where the texture is drawn (it is recorded again), then Copy name, PNG, Flash or Export it.

### inspector-export

**The starter mod could not be exported**

Seen in: Settings, Mods, Developer (open the game with ?moddev=1).

On the site:

    Select at least one texture
    The mod id must look like yourname.mod-name (lower case letters, digits and -)
    ZIP support is not loaded in the game page. Reload and try again

What it means: Export needs at least one ticked texture and an id like yourname.mod-name (lowercase letters, digits and dashes, one dot).

How to fix it: Tick the textures you want, type an id like "yourname.my-textures", and press Export again. If ZIP support is missing, reload the page.

## Developer mode and the mod log

### dev-start-game

**Developer mode needs the game page**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

In the game page (install, check tool):

    no developer-mode mod is running in this session

On the site:

    Start the game first: developer mode loads a mod into the running game page.

What it means: A folder or a dev server is read into the game page, which is not up yet.

How to fix it: Press Play and wait for the title screen (or your town), then choose the folder or Connect again.

### dev-check-fails

**The folder fails playac-mod check**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    Not loaded: the folder fails playac-mod check: mod.json: "id" is missing
    Not reloaded: the folder fails playac-mod check: shops.json: a price must be a whole number of Bells, 1 to 99999

What it means: playac-mod dev checks the folder on every save and sends nothing while it fails. The game keeps the last good copy.

How to fix it: Fix what the message (and the terminal running playac-mod dev) names. The reload happens by itself once it passes.

### dev-restart-needed

**Restart the game to load this change**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1); the Mod log in Settings, Mods.

In the game page (install, check tool):

    mod.json changed: restart the game to load it

On the site:

    mod.json changed: restart the game to load it.
    The script cannot reload: it was not in mod.json at boot. Restart the game.
    Textures cannot reload: the mod had no textures folder at boot. Restart the game.

What it means: Lines, the shop, the script and textures reload while you play. mod.json is read once, when the game starts, so a change to it (or a script or textures folder it did not have at the start) waits for a restart.

How to fix it: Choose Restart now in the Developer section. Save your town first.

### dev-folder-unreadable

**The folder could not be read**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

In the game page (install, check tool):

    no files
    "main.lua" is not file bytes

On the site:

    The folder could not be read: the folder has more than 2000 files
    Stopped watching the folder: The requested file could not be read

What it means: The browser would not read the folder (permission lost, the folder moved or was renamed), or it holds more than a mod may.

How to fix it: Choose the folder again. Pick the folder with mod.json in it, not a parent of it. Hidden files and node_modules are skipped; anything else in it counts.

### dev-server-address

**That is not a playac-mod dev address**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    Use the address playac-mod dev prints: http://localhost and a port.

What it means: The page only talks to a dev server on your own computer: http on localhost or 127.0.0.1.

How to fix it: Paste the address `npx playac-mod dev` prints, for example http://127.0.0.1:2604.

### dev-server-origin

**The dev server refused this site**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: the dev server refused this site: start it with --origin http://localhost:5174

What it means: playac-mod dev only answers playaconline.com and a few local addresses, so another website cannot read your folder. This copy of the game is on another address.

How to fix it: Start it with --origin and the address of the game page, for example `npx playac-mod dev --origin http://localhost:5174`.

### dev-server-protocol

**The dev server speaks another version**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: the dev server speaks protocol 2; this game reads 1. Update one of them

What it means: The CLI and the game changed how they talk, and these two are different versions.

How to fix it: Update the CLI (`npx playac-mod@latest dev`), or reload the game page to get the newest one.

### dev-server-unreachable

**The dev server could not be reached**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: Failed to fetch
    The dev server could not be reached at http://127.0.0.1:2604: the dev server answered 404 for /__playac/index (is it playac-mod dev?)

What it means: Nothing answered at that address, or what answered is not playac-mod dev. Safari blocks a secure page from reaching http on your computer.

How to fix it: Run `npx playac-mod dev` in your mod folder and use the address it prints. Use Chrome, Edge or Firefox, or choose the folder instead.

### dev-not-reloaded

**A change was not reloaded**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1); the Mod log in Settings, Mods.

On the site:

    Not reloaded: the game refused it
    Not loaded: the stored copy does not match its id

What it means: Developer mode checks every save by the same rules as installing a ZIP. A file that breaks one is not loaded, and the game keeps running the last good copy.

How to fix it: Fix the file the message names and save again. When the message names a rule, that rule has its own entry on this page.

## Installing and switching mods on

### mods-cleared

**Your browser cleared your mods**

Seen in: the Mods tab.

On the site:

    Your browser cleared your mods. Browsers can delete a site's stored data, for example when the device is low on space or the site has not been visited for a while. Install them again below.

What it means: Installed mods live in the browser's site storage, and the browser deleted it (low space, or Safari after 7 days without a visit). The game asks the browser to keep mods, but a browser can still clear them.

How to fix it: Install the mods again (Browse mods, or your ZIPs). Keep your own mod ZIPs somewhere safe.

### mods-unreadable

**Your mods could not be read**

Seen in: the Mods tab.

On the site:

    Your mods could not be read: The operation is insecure.

What it means: The browser would not open its site storage, where mods are kept. Private windows and blocked site data do this.

How to fix it: Use a normal (not private) window and allow site data for playaconline.com, then reload.

### mods-db

**The mods database could not be used**

Seen in: the Mods tab; Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

In the game page (install, check tool):

    the mods database is held open by another tab
    the developer mods database is held open by another tab
    the mods database refused the change

What it means: The browser's mod storage turned the change down: another tab of the game is updating it (a newer version of the page is moving your mods to a new layout), or the browser stopped the write (storage full, or site data blocked).

How to fix it: Close the game's other tabs, reload, and try again. If it keeps happening, free some space on the device or allow site data for playaconline.com.

### mod-not-installed

**That mod is not installed**

Seen in: the Mods tab.

In the game page (install, check tool):

    that mod is not installed

What it means: The Mods tab changed a mod that is no longer installed: another tab removed it meanwhile.

How to fix it: Reload the Mods tab to see your mods as they are now.

### mods-export-too-big

**Too many mods for one export**

Seen in: the Mods tab.

In the game page (install, check tool):

    Your mods are 600 MB together, more than the 512 MB one export can hold. Remove the mods you do not use, then export again

What it means: "Export my mods" makes one ZIP in the browser's memory, and your installed mods together are more than it can safely hold.

How to fix it: Remove the mods you do not use and export again. Each mod is also its own ZIP you can keep from Browse mods or its author.

### storage-full

**Not enough room in the browser**

Seen in: Mods tab, when you install a ZIP.

In the game page (install, check tool):

    There is not enough room in this browser's storage for this mod: it needs about 40 MB and about 12 MB is free. Remove a mod you do not use or free some space on this device, then try again

What it means: Mods are kept in the browser's site storage, and it is full or blocked (a private window, or site data switched off).

How to fix it: Remove a mod you do not use, free space on the device, or allow site data for playaconline.com. Private windows have very little room.

### mods-too-many

**More than 32 mods on**

Seen in: Mods tab, when you install a ZIP; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    only the first 32 mods load
    You already have 32 mods on, the most the game loads. Turn one off first

What it means: The game loads at most 32 switched-on mods.

How to fix it: Switch off a mod you can do without, then restart.

### mods-size-cap

**Over the room the game keeps for mods**

Seen in: Mods tab, when you install a ZIP; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    This mod unpacks to 30 MB, more than the 24 MB the game keeps for mods on a phone, so it cannot be switched on here
    the mods before it already fill the 96 MB the game keeps for mods

What it means: All switched-on mods together can unpack to at most 96 MB, or 24 MB on a phone or a low-memory device. A new mod that does not fit is installed switched off.

How to fix it: Switch off a big mod, or as a maker, keep texture mods small (compressed DDS, only the textures you changed) so phone players can use them.

## When the game starts

### mods-watchdog

**The game stopped responding with mods on**

Seen in: the Mods tab.

On the site:

    The game stopped responding the last time it started with this mod on: Tea House. It started without mods this time. Your mods are still installed.

What it means: The game did not finish starting, or froze early, the last time it ran with these mods switched on, so it started once without any mods. Nothing was removed.

How to fix it: Players: turn the named mod off (or one of them at a time), then restart. Makers: test the mod alone; the usual causes are textures too big for the device (phones have 24 MB for all mods) or a script doing heavy work at start.

### boot-failed

**The mod could not be unpacked at start**

Seen in: Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    could not be unpacked (ENOSPC)
    the stored mod does not match its id
    the mod list could not be written

What it means: The game could not unpack this mod from browser storage when it started, usually because the browser is out of memory or storage, or the stored copy was damaged.

How to fix it: Restart the game. If it stays, remove the mod and install it again.

## Script stopped

### script-budget

**Script took too long**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    script took too long (over 200000 instructions)
    script took too long (over 33 ms)
    script took too long (over 100 ms)

What it means: One event gets a budget of 200,000 Lua instructions per mod, and one event run is stopped past 33 ms of wall time. The main chunk, when the game starts, gets 100 ms. String patterns, table.sort/concat and memory use count too. Over it, the script is stopped for the rest of the session, so it can never freeze the game.

How to fix it: Do less per event: no long loops, cache results in local variables or the store, avoid patterns like ".-.-.-" on long text. pcall does not get around the budget.

Bad (main.lua):

```
on("day_start", function()
  local n = 0
  for i = 1, 1e9 do n = n + i end
end)
```

Fixed (main.lua):

```
on("day_start", function(date)
  store.set("days", (store.get("days") or 0) + 1)
end)
```

### script-slow

**Script kept the game waiting**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    script kept the game waiting (3 runs over 8 ms)

What it means: All mods together get 4 ms of Lua time a frame. An event run over 8 ms is a strike, and three strikes stop the script for the session, even if each run stayed inside its instruction budget, so a slow script cannot make the game stutter.

How to fix it: Do less per event: keep work small and spread it over events, cache results in locals or the store, and avoid long loops or patterns on long text.

### script-memory

**Script ran out of memory**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    out of memory (4 MB per mod, 16 MB for all mods together)

What it means: A mod's script can use 4 MB, and all mods together 16 MB.

How to fix it: Keep fewer and smaller tables; do not build big strings in a loop (collect parts and table.concat them once).

### script-on-event

**on() with an event not in "hooks"**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:1: on(): 'talk' is not in this mod's "hooks" list in mod.json
    @yourname.my-mod/main.lua:1: on(): unknown event 'tick'

What it means: A script can only listen to the events mod.json lists in "scripts.hooks", and only to real events (at api 1: talk, day_start, item_picked, enter_scene; from api 2 also migrate, hour_change, shop_buy, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_result, answer).

How to fix it: Add the event to "hooks" in mod.json, or fix its spelling in on().

Bad (mod.json):

```
"scripts": { "main": "main.lua", "hooks": ["day_start"] }
-- main.lua: on("talk", ...)
```

Fixed (mod.json):

```
"scripts": { "main": "main.lua", "hooks": ["day_start", "talk"] }
```

### script-on-late

**on() called from inside a handler**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:4: on(): handlers can only be added while the script loads, not from inside a handler

What it means: Handlers are added once, while main.lua first runs. A handler cannot add more handlers, and neither can a function another mod calls with remote.call.

How to fix it: Call on() at the top level of main.lua, and keep a flag in a variable to switch behaviour later.

### script-on-too-many

**More than 16 handlers for one event**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:20: on(): at most 16 handlers for 'talk'

What it means: A mod can add at most 16 handlers per event.

How to fix it: Use one handler that does several things.

### script-store-no-town

**store.set before a town is loaded**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:3: store.set: no town is loaded yet (the script's main part runs before the save loads): save from an event, or use store.client

What it means: "store" is kept per town, and the main part of a script runs before the town loads, so store.set is refused there (store.get answers nil). This is an api 2 rule: a mod whose mod.json says api 1 keeps the per-browser store of level 1, usable in the main part.

How to fix it: Save from an event (day_start, talk, ...), or use store.client for data that belongs to the browser rather than the town.

Bad (main.lua):

```
store.set("loaded", true)
```

Fixed (main.lua):

```
on("day_start", function() store.set("days", (store.get("days") or 0) + 1) end)
```

### remote-not-exported

**remote.add of a name "exports" does not list**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-lib/main.lua:3: remote.add: count is not in mod.json "exports" (a library offers what it lists)

What it means: Your mod.json has "exports", so remote.add offers only the names it lists: the mods that use your library were promised exactly those.

How to fix it: Add the name to "exports" with a one-line description, or offer one that is listed.

### script-remote

**remote.add or remote.call refused**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:4: remote.call: tea.lib offers no function brew
    @yourname.my-mod/main.lua:4: remote.call: tea.lib is already running (a call back into it would be a cycle), refused
    @yourname.my-mod/main.lua:1: remote.add: functions can only be offered while the script loads
    @yourname.my-mod/main.lua:6: remote.call: tea.lib has not updated this town's data yet (its migrate runs after this one), refused

What it means: remote.add offers a function while the script loads (names a-z 0-9 _, at most 32). remote.call copies nil, booleans, numbers, strings and tables of them (64 KB, 16 levels) to a running mod that offers the function; a call back into a mod already running is refused. Inside a migrate handler, a call into a mod whose own migrate has not run in that town yet is refused too: its data is still at the old version.

How to fix it: Check the mod is installed, on and offers that name (remote.has), pass plain data, and do not call back into the caller. In migrate, only change your own data; ask other mods in a later event, when every migration is done.

### script-store

**store.set refused a value**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:3: store.set: only strings, numbers and booleans can be saved
    @yourname.my-mod/main.lua:3: store.set: the store would be over 8192 bytes, nothing was saved
    @yourname.my-mod/main.lua:3: store.set: key longer than 64 bytes

What it means: The store keeps strings, numbers and booleans (not tables or functions), keys up to 64 bytes, values up to 1024 bytes, 8 KB per mod per town (and 8 KB in store.client, per browser), no zero bytes, no NaN. A refused set changes nothing, and the error stops the script unless you pcall it.

How to fix it: Save plain values, keep keys short, and turn a table into a string yourself if you must (for example "3,7,12").

### script-sandbox

**Something scripts may not do**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:2: setmetatable: __gc is not allowed in mod scripts (finalizers cannot be stopped)
    @yourname.my-mod/main.lua:5: tables with a __len metamethod are not supported here in mod scripts

What it means: Some Lua features are switched off because they could run outside the time budget: __gc finalizers, and __len metamethods passed to table functions. io, os, load, require, dofile and debug do not exist at all.

How to fix it: Remove the metamethod. Use plain tables.

### script-state-failed

**The script's Lua state failed**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    the script's Lua state failed and was dropped
    the script raised an error that is not a string

What it means: The Lua engine for this mod failed in a way it cannot recover from, or the script raised an error with error({...}) instead of a string.

How to fix it: Raise errors with error("text"). If it says the state failed, report it with the mod: it is a bug in the game.

### script-syntax

**A Lua syntax error**

Seen in: Mods tab, "Script stopped" on the mod's row; the check tool (npx playac-mod check).

In the game page (install, check tool):

    main.lua:4: unfinished string near '"hello'
    main.lua:7: ')' expected near 'log'

From the game (Mods tab row):

    @yourname.my-mod/main.lua:5: 'end' expected (to close 'function' at line 2) near <eof>
    @yourname.my-mod/main.lua:3: unexpected symbol near '='

What it means: The script is not valid Lua 5.4, so it never starts: none of its handlers run, and the Mods tab says "Script stopped" with the file, the line and what Lua expected there. The rest of the mod (textures, lines, shop) still works. `npx playac-mod check` finds the same error before you install, when a Lua 5.4 `luac` is on your PATH (it says so when there is none).

How to fix it: Open the file at the line shown. Usual causes: a missing `end` (every function, if, for and while needs one), a missing `then` or `do`, a string with no closing quote, `!=` where Lua writes `~=`, or a `+` where Lua joins strings with `..`. The line Lua names is where it noticed, often just after the real mistake.

Bad (main.lua):

```
on("talk", function(npc)
  if npc.name == "Bob" return "Hi" end
end)
```

Fixed (main.lua):

```
on("talk", function(npc)
  if npc.name == "Bob" then return "Hi" end
end)
```

### script-error

**The script raised an error**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:7: attempt to index a nil value (global 'io')
    @yourname.my-mod/main.lua:3: attempt to call a nil value (global 'give_item')

What it means: A Lua error in your script: the text says which file and line. The script is stopped for the rest of the session; the rest of the mod (textures, lines, shop) keeps working. Common causes: a typo in a name, calling something that does not exist in the API (io, os, require, a function from a newer game), or indexing nil.

How to fix it: Open the file at the line number shown, fix it, reinstall and restart. Use log() to print values while you work, and pcall around code that may fail.

## Mod commands (api 2)

### command-permission

**A command not in "permissions"**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    give_item is not in this mod's "permissions" in mod.json

What it means: A script may only use the commands its mod.json "permissions" lists, and only at "api": 2. Players see that list on the Mods tab.

How to fix it: Add the command to "permissions" (and say "api": 2), or stop calling it.

Bad (mod.json):

```
"api": 2,
"scripts": { "main": "main.lua", "hooks": ["day_start"] }
```

Fixed (mod.json):

```
"api": 2,
"scripts": { "main": "main.lua", "hooks": ["day_start"] },
"permissions": ["send_letter"]
```

### command-cap

**Too many commands**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    set_flag: at most 4 commands in one event
    send_letter: at most 3 a day for each mod
    show_line: this mod already has 8 commands waiting
    ask: the game's command queue is full (32), try later

What it means: A mod may queue at most 4 commands in one event and, each game day, 3 letters, 5 items, 100 flags, 20 lines and 10 questions (counted when queued, kept across a reload). At most 8 of its commands wait at once, 32 for all mods.

How to fix it: Queue fewer commands: remember in the store what you already sent today.

### command-item

**An item a command cannot hand out**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    give_item: item 0x2100 is money
    send_letter: item 0xF000 is not an item or furniture the game has
    give_item: a mod can only give its own new items, by "<this mod's id>:<item id>"
    give_item: no item by that id in this mod's items file

What it means: Items follow the shop's rules: no money, turnips, tickets, grab bags, fossils or reserved numbers. An item is a number, "0x" and four hex digits, or one of this mod's own new items by its full id.

How to fix it: Pick another item, or write it as "0x2800" or "yourname.my-mod:thing".

### command-args

**A command's arguments are wrong**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    send_letter: text must be 1 to 192 characters
    send_letter: the text does not fit a letter (6 lines)
    ask: choices must be a list of 2 to 4 answers
    set_flag: the key must be 1 to 32 of a-z 0-9 _ . -
    show_line: text must be 1 to 400 bytes

What it means: The command was called with something it cannot use. The limits: a letter 1 to 192 characters in 6 lines, from up to 8, paper 0 to 63; a line up to 400 bytes; a question up to 120 characters with 2 to 4 answers of up to 16; a flag key of a-z 0-9 _ . - up to 32, its text up to 64 bytes.

How to fix it: Check the call against the reference (/modding/reference/) and shorten the text.

### command-city

**Commands are off in The City**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    commands are switched off in The City
    send_letter: commands are switched off in The City

What it means: In The City every command is refused: other players there do not have your mod, and nothing a mod gives may enter the shared town. Called in The City, a command returns nil and this reason; queued at home and applied after the player went there, it comes back as a refused command_result. Either way it does not count against the daily caps.

How to fix it: Nothing to fix. Try again at home (for example from enter_scene).

### command-visiting

**Only the town's owner changes a town**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    only the town owner's game can change the town (you are visiting)
    give_item: only the town owner's game can change the town (you are visiting)

What it means: Visiting a friend, send_letter and give_item are refused (nil and this reason when called, or a refused command_result if the player left home after queueing) and do not count against the daily caps: only the town owner's game changes a town. set_flag, show_line and ask still work.

How to fix it: Nothing to fix. Send it once the player is home.

### command-lent-home

**A lent mod acts only in its town**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    a friend's mod lent for a visit acts only in their town

What it means: A visitor whose game borrowed the host's mods for a visit restarts on them at home before the trip and again after it. There every command of a lent mod comes back refused, and its shop, Nook goods, board notices, items and renames do nothing: a lent mod never changes the visitor's own town or save. In the host's town it runs as a visitor's mod does.

How to fix it: Nothing to fix. Your mod runs normally for players who installed it.

### command-no-room

**No room for a letter or an item**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    the mailbox and the post office are both full
    the pockets, the mailbox and the post office are all full
    the pockets are full (a new item cannot come by mail)

What it means: The mailbox and the post office had no room, or the pockets were full for one of the mod's own new items (a letter cannot carry its identity).

How to fix it: Try again later; watch command_result and resend when it failed.

### command-not-shown

**A line or a gift could not be done**

Seen in: the command_result event (its error) and the mod log, when a command is refused.

From the game (Mods tab row):

    the text cannot be drawn in the window (too many pages?)
    the item is not this town's to give (its mod is off, or this is not your town)
    the flag could not be saved

What it means: The game could not carry the command out: a line too long to page, a new item whose mod is off, or a flag the store refused (it would take the store over 8 KB).

How to fix it: Shorten the line, keep the mod on, or keep the store small.

## Sharing a mod

### dev-upload-off

**Sharing is off in developer mode**

Seen in: Share a mod, when you upload.

On the site:

    Sharing is off while a mod is loaded in developer mode. Pack the folder into a ZIP (playac-mod pack) and upload that, so what is reviewed is exactly what players get.

What it means: What you share must be the exact ZIP players will get, not a folder still changing.

How to fix it: Run `npx playac-mod pack`, unload the developer copy, restart, and upload the ZIP.

### upload-name-word

**The name has a word the site does not allow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The mod's name has a word the site does not allow. Pick another name.

What it means: The list of shared mods is public, so a mod's name goes through the same word filter as everything else players can read on the site.

How to fix it: Change "name" in mod.json, raise the version, and upload again.

### upload-author-word

**An author name has a word the site does not allow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    An author name has a word the site does not allow. Use another name.

What it means: Author names are shown on the public list of shared mods, so they go through the site's word filter.

How to fix it: Change the name in "authors" in mod.json, raise the version, and upload again.

### upload-sign-in

**Sign in to share**

Seen in: Share a mod, when you upload.

On the site:

    Sign in to share a mod.

Registry codes: `unauthorized`

What it means: Sharing a mod needs an account.

How to fix it: Sign in, then upload again.

### upload-publisher-terms

**Accept the mod rules first**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Confirm your age and accept the mod rules before you share a mod.

Registry codes: `publisher_terms`

What it means: The first time you share, you answer your age and accept the mod rules.

How to fix it: Answer the questions above the upload button, then upload again.

### upload-under-13

**Sharing is for players 13 or older**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Sharing mods is for players 13 or older.

Registry codes: `under_13`

What it means: Players under 13 can make and install mods but cannot share them.

How to fix it: Keep the mod for yourself, or ask a parent or guardian to share it from their own account.

### upload-rights-removed

**This account cannot share mods**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Mod uploads are switched off for your account.

Registry codes: `upload_rights_removed`, `uploads_locked`

What it means: Mods from this account were removed for copyright several times (the repeat-infringer policy), or a moderator switched uploads off for it.

How to fix it: See the mod rules page for how to appeal.

### upload-version-exists

**This version is already uploaded**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    This version of the mod is already uploaded. Raise the version in mod.json.

Registry codes: `version_exists`

What it means: Every upload is a new version and a version can never be replaced, so players who have it always have the same files.

How to fix it: Raise "version" in mod.json (1.0.0 to 1.0.1) and upload again.

### upload-screenshot

**A screenshot is needed, or one could not be read**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Add at least one screenshot of the mod in the game (PNG or JPEG). It is shown on the mod's page.
    Screenshot 1 must be a PNG or a JPEG.
    Screenshot 1 must be 200 to 4096 pixels a side.
    Screenshot 1 could not be read: is it a whole PNG or JPEG?
    Each screenshot must be at most 2 MiB.
    Send at most 4 screenshots.

Registry codes: `screenshot_required`

What it means: Every shared version needs 1 to 4 screenshots of the mod in the game, shown on its page: PNG or JPEG, 200 to 4096 pixels a side, at most 2 MB each. The server re-saves them, so no hidden photo data survives.

How to fix it: Add a screenshot in Share a mod, with playac-mod publish --shot, or in .playac/screenshots/ (also for a GitHub import).

### upload-changelog

**A changelog line is needed**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Say in one line what this version changes.
    The changelog line must be 1 to 300 characters of text, with at most 4 line breaks.
    The changelog line has a word the site does not allow. Say it another way.
    Send one changelog line.

Registry codes: `changelog_required`

What it means: Every shared version needs one line about what it changes, shown in its page's version list: up to 300 characters and 4 line breaks, and the same words filter as a mod's name.

How to fix it: Write the line in Share a mod, with playac-mod publish --changelog, or as this version's section of CHANGELOG.md.

### upload-form

**The upload form could not be read**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The upload form has no zip.
    The upload form could not be read.
    The upload form has a part this site does not read.
    The upload form has no boundary.
    Send one zip at a time.

What it means: An upload is a form with the zip, the screenshots and the changelog line. This one was not sent the way the site sends it.

How to fix it: Share from Settings, Mods, or with playac-mod publish. A script of your own must send multipart/form-data with the parts zip, screenshot and changelog.

### upload-not-owner

**Another player owns this id**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Another player already uploaded a mod with this id. Pick a different id.

Registry codes: `not_owner`

What it means: A mod id belongs to the account that first shared it.

How to fix it: Change "id" in mod.json, with your own name before the dot.

### upload-too-many

**Too many uploads**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    You can upload 5 mods an hour. Try again later.
    You have 10 uploads waiting for review. Upload more once some are reviewed.

Registry codes: `too_many_uploads`, `too_many_pending`, `rate_limited`

What it means: There is a limit on uploads per hour and on uploads waiting for review at once.

How to fix it: Wait for a review, or try again in an hour. Test locally first so each upload counts.

### upload-storage-full

**Your shared mods use all your space**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Your mods would take more than 64 MiB. Ask for an old version to be taken down, or make this one smaller.

Registry codes: `storage_full`

What it means: Each account has a total size for all its shared versions.

How to fix it: Ask for an old version to be removed, or make the mod smaller.

### upload-busy

**Upload busy or too slow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Another upload from your account or your network is still going, or the server is busy. Try again in a minute.
    Your connection was too slow to upload the zip. Try again on a better connection.

Registry codes: `uploads_busy`, `upload_slow`

What it means: One upload at a time per account and network, and the file has to keep arriving.

How to fix it: Wait a minute and try again, on a steadier connection if it was too slow.

### upload-image-check

**The images could not be checked**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    We couldn't check the images in your mod just now. Nothing was uploaded. Try again in a few minutes.

Registry codes: `image_check_unavailable`

What it means: Every image is checked before an upload is accepted, and the checking service did not answer. Nothing was uploaded.

How to fix it: Try again in a few minutes.

### upload-refused

**The upload was refused**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    This upload can't be accepted.

Registry codes: `upload_refused`, `banned`, `forbidden_origin`

What it means: The upload was refused without a reason being given, or the account cannot share right now.

How to fix it: Read the mod rules. If you think it is a mistake, contact the moderators.

### upload-closed

**Sharing mods is not open**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Sharing mods is not open yet. Mods you install from a ZIP file still work.

Registry codes: `uploads_closed`

What it means: The site has not opened mod sharing (or has closed it for now). Uploads and GitHub imports are both refused. Installing a mod from a ZIP file is not affected.

How to fix it: Keep making and testing the mod locally, and share it once sharing opens.

### upload-paused

**Uploads are paused while reviews catch up**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    New mod uploads are paused while the review queue catches up. Nothing was uploaded. Try again in a few days.

Registry codes: `uploads_paused`

What it means: When the oldest upload has waited more than a week for review, new uploads and imports stop until the queue is shorter. Nothing was uploaded.

How to fix it: Try again in a few days.

### upload-two-factor

**Two-factor sign-in is needed**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Turn on two-factor sign-in on your Profile page before you share a mod.
    Enter the code from your authenticator app to share a mod.
    Enter the code from your authenticator app to approve playac-mod.
    Sharing mods is switched off on this server for now.

Registry codes: `two_factor_required`, `two_factor_code`, `two_factor_unavailable`

What it means: Sharing a mod, importing one from GitHub and approving a playac-mod sign-in all need two-factor sign-in on the account, and a code entered in the last few minutes on this browser. If the server cannot check codes at all, sharing is switched off.

How to fix it: Turn on two-factor sign-in on your Profile page, then enter a code from your authenticator app when asked.

### upload-prefix-taken

**The name before the dot is another player's**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The part of the id before the dot belongs to another player's account. Use your own name before the dot.

Registry codes: `prefix_taken`

What it means: The part of a mod id before the dot (kim in kim.tea-house) belongs to the account that first had a mod approved under it, so nobody else can publish under that name.

How to fix it: Change "id" in mod.json to start with your own name.

### upload-content-taken-down

**These files were taken down**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    These files were taken down from the registry, so they can't be shared again.

Registry codes: `content_taken_down`

What it means: The same files as a version a moderator removed. Copies of it are switched off, and the files cannot be shared again under any id or version.

How to fix it: Read the review decision on the removed version and change what it named. If you think the removal was wrong, see the mod rules page.

### upload-too-many-attempts

**Too many upload attempts**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    You can try 12 uploads an hour. Try again later.

Registry codes: `too_many_attempts`

What it means: Every upload attempt counts, refused ones too: each one costs a check of every image.

How to fix it: Check the mod locally first (npx playac-mod check), then try again in an hour.

### upload-too-many-images

**Too many or too large pictures**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Your mod has more than 500 different pictures. Split it into smaller mods.
    Your mod's pictures add up to more than 67 million pixels, or are too slow to check. Split it into smaller mods.

Registry codes: `too_many_images`

What it means: Every picture in an upload is checked before it is accepted, so one upload may hold at most 500 different pictures, about 67 million pixels in all (16 textures of 2048 by 2048). The same file used many times counts once.

How to fix it: Split the mod into smaller mods, or make the large textures smaller.

### import-bad-source

**Not a GitHub repository and tag**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Write it as github.com/<owner>/<repo>@<tag>, for example github.com/you/tea-house@v1.2.0.
    That is not a GitHub owner and repository name.

Registry codes: `bad_source`

What it means: Import from GitHub takes a public repository and one of its tags.

How to fix it: Write github.com/you/your-repo@v1.2.0, with a tag that exists on GitHub.

### mod-conflict

**That change to the version is not allowed now**

Seen in: the Mods tab.

From the mod list (upload):

    A moderator took this version out of the list. Upload a fixed version, or ask the moderators to look again.
    Another decision on this version came first. Reload and look again.

Registry codes: `mod_conflict`

What it means: A yank or unyank (or a moderator's decision) that the version's state does not allow: a version a moderator yanked is the moderator's to list again, and a decision someone else made first wins.

How to fix it: Reload the Mods tab. For a moderator's yank, read the reason, fix the mod and upload a new version.

## Review decisions

### review-nintendo-content

**Nintendo or other franchise content**

Seen in: the review decision on your upload.

What it means: The mod holds art, textures, models, music, sound or text taken from a Nintendo game or another game, film, show or brand, or redrawn copies of them. Mods here may only hold work you made yourself.

How to fix it: Replace every taken file with art you made yourself, then upload a new version. Redrawn copies of Nintendo art count as taken.

### review-nintendo-marks

**Nintendo or franchise names or logos**

Seen in: the review decision on your upload.

What it means: The mod's name, id, description or pictures use Nintendo's names or logos, or another brand's, in a way that could make it look official. Give your mod its own name.

How to fix it: Rename the mod and its id, and remove logos from pictures. "AC" or "Animal Crossing" in a name can make it look official.

### review-not-original

**Someone else's work**

Seen in: the review decision on your upload.

What it means: The mod holds work made by someone else, such as another modder's files, without their permission. Share only what you made, or what you have written permission to share.

How to fix it: Remove the other person's files, or get their written permission and say so in the description.

### review-copyright-notice

**Removed after a copyright notice**

Seen in: the review decision on your upload.

What it means: The owner of a copyright sent us a notice saying this mod copies their work, so it was removed. If you believe the notice is a mistake, the mod rules page says how to respond.

How to fix it: If you believe the notice is wrong, the mod rules page explains the counter-notice.

### review-sexual-content

**Sexual content**

Seen in: the review decision on your upload.

What it means: The mod holds sexual or sexually suggestive pictures or text. Players of every age use this site.

How to fix it: Remove it. Mods here are for players of every age.

### review-hate-harassment

**Hate or harassment**

Seen in: the review decision on your upload.

What it means: The mod attacks or demeans people for who they are, or targets a real person to harass them.

How to fix it: Remove it.

### review-personal-data

**Personal information**

Seen in: the review decision on your upload.

What it means: The mod holds someone's personal information, such as a real name with an address, a phone number, an email address or a photo of a real person.

How to fix it: Remove any real names with addresses, phone numbers, emails or photos of real people.

### review-harmful-script

**Harmful script**

Seen in: the review decision on your upload.

What it means: The mod's script is made to break the game, slow it down on purpose, flood players with messages, or get around the limits mods run under.

How to fix it: Make the script do only what the description says, inside the limits. Do not try to get around the budget.

### review-misleading

**Misleading**

Seen in: the review decision on your upload.

What it means: The mod's name, description or pictures do not match what it does, or it pretends to come from someone else.

How to fix it: Make the name, description and pictures match what the mod does.

### review-broken

**Does not work**

Seen in: the review decision on your upload.

What it means: The mod does not load or does not do what it says. Fix it and upload it again as a new version.

How to fix it: Test it with the check tool and in the game (dev mode, the log panel), fix it, and upload a higher version.

### review-spam

**Spam or duplicate**

Seen in: the review decision on your upload.

What it means: The mod repeats another upload, or is an advert or a placeholder rather than a mod.

How to fix it: Share each mod once, and only finished mods.

### review-repeat-infringer

**Upload rights removed**

Seen in: the review decision on your upload.

What it means: Mods from this account were removed for copyright several times, so under the repeat-infringer policy on the mod rules page its mods are no longer shared.

How to fix it: See the mod rules page for how to appeal.

### review-uploader-request

**Removed at your request**

Seen in: the review decision on your upload.

What it means: You asked for this version to be removed.

How to fix it: Nothing to do.

### review-other

**Another rule**

Seen in: the review decision on your upload.

What it means: The mod breaks another of the mod rules. The moderator's note says which.

How to fix it: Read the moderator's note: it says which rule.

## Updates and removals

### mod-removed

**Removed by the moderators**

Seen in: Mods tab, on the mod's row after a restart; Mods tab, when you install a ZIP.

In the game page (install, check tool):

    Removed by the moderators: holds art from another game. It cannot be switched on

What it means: The moderators took this version down (the reason follows). Every copy, even one installed from a ZIP, is switched off at the next start and cannot be switched on.

How to fix it: Players: remove it, or install a newer version once the maker fixes it. Makers: read the review reason, fix the problem and upload a new version; players who update get it switched back on.

### status-update-available

**Update available**

Seen in: Mods tab, on the mod's row after a restart.

On the site:

    Update available

What it means: A newer approved version of the mod is in the mod list.

How to fix it: Open Browse mods and install the update, then restart.

### status-yanked

**No longer offered in the mod list**

Seen in: Mods tab, on the mod's row after a restart.

On the site:

    No longer offered in the mod list. It still works.

What it means: The maker took this version out of the list (a yank). It still works and friend visits still match it, but new players cannot install it.

How to fix it: Nothing to do. If the maker shares a newer version, update to it.

### status-mods-switched-off

**Mods are switched off for everyone**

Seen in: the Mods tab.

From the mod list (upload):

    Mods are switched off for everyone for now while we fix a problem. Your mods are still installed and come back on their own.

Registry codes: `mods_switched_off`

What it means: The site switched every mod off for a while (the kill switch). Games start without mods, and no mod can be downloaded until it is back on. Nothing is uninstalled.

How to fix it: Nothing to do: your mods come back on their own.

## Friend visits

### visit-lend-wont-load

**A friend's mods would not all load here**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    the friend's mods would not all load here: they unpack to 30 MB, and the game keeps 24 MB for mods on a phone
    the friend's mods would not all load here: bean.tea-house needs kim.lib, which is not installed
    the friend's mods did not all load
    a lent mod is missing from this tab

What it means: You agreed to visit with your friend's mods, and this game could not run every one of them: together with your own mods they are over the room the game keeps for mods on this device, one needs a mod that is not in the set, or the set kept for this tab is gone. A visit needs the whole set, so it was not started.

How to fix it: Switch off some of your own client mods (they count toward the room too) and ask again, or play on a computer, which keeps more room for mods. If the set is gone, ask again: the game fetches it once more.

### dev-visits-off

**Visits are off in developer mode**

Seen in: the Multiplayer panel, when a visit is refused; Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    A mod is loaded in developer mode, so friend visits are off: no other town has that mod. Unload it in Settings, Mods, then restart the game.

What it means: A mod loaded from a folder is not installed and no one else has it, so your town would not match any other. Visits refuse it either way.

How to fix it: Unload it in Settings, Mods, Developer, then restart the game.

### visit-modset-mismatch

**A visit refused: world mods differ**

Seen in: the Multiplayer panel, when a visit is refused.

On the site:

    Your world mods don't match. Visits need the same world mods (the ones visitors can see) in both towns (or none). Change them in Settings, Mods.
    Kim's town runs Tea House 1.2.0, you don't. Visits need the same world mods (the ones visitors can see) in both towns. Change them in Settings, Mods.

Registry codes: `modset_mismatch`

What it means: A friend visit starts only when both towns run the same world mods that count for visits, the same versions, in the same order, or both none. The message names what differs. Client mods never count. A world mod counts when it has "textures", "shops" or "items" content, or a command other than send_letter, give_item, set_flag, show_line and ask; one with only lines, letters, events or talk pools and those commands does not. When every one of your friend's world mods that counts is from Browse mods, you are offered their mods for that visit instead.

How to fix it: Both players open Settings, Mods, and make the world mods match: same mods, same versions (install from the same place or the same ZIP), same order. Or switch world mods off and restart. Makers: publish your world mod on Browse mods, so visitors can load it for a visit.

### visit-lend-failed

**A friend's mods could not be loaded for the visit**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    the download for bean.tea-house 1.2.0 does not match the friend's copy
    the download for bean.tea-house 1.2.0 is a different mod
    the friend's mods do not add up to their town's mod set

From the mod list (upload):

    Invalid mod list: the mod list does not match the mod set hash.

On the site:

    Couldn't load Kim's mods for this visit. Couldn't download Tea House: the registry answered 404.

What it means: You agreed to visit with your friend's mods, and one of them could not be downloaded, or the download was not exactly the version your friend runs (checked by content hash). Nothing was kept or installed, and the visit was left.

How to fix it: Ask again later. If it keeps happening, the mod may have been taken down or updated: both players can install the same version from Browse mods.

### city-mod-refused

**A City mod was refused**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    bean.lamps: a City mod may only hold textures and lines, not shops
    bean.lamps: a City mod may not run scripts

What it means: The City's own mod set (chosen by the site) may only change textures and lines. A mod with a shop, a script or commands is never loaded there.

How to fix it: Nothing for players to do: the site fixes its City set. Makers: a mod meant for The City holds only textures and messages.
