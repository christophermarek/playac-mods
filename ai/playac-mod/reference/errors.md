# Errors and refusals

Generated from the Play AC Online mod API spec and errors catalogue. Do not edit by hand. Online: https://playaconline.com/modding/errors/

Every message a mod maker can meet, by code. Search this file for a phrase from the message you got. Each code is also a link: https://playaconline.com/modding/errors/#<code>.

Where messages come from:

- page: the game page's own check, when you install a ZIP in Settings, Mods (also `playac-mod check`).
- registry: the shared mod list, when you upload. It runs the same rules plus image checks.
- game: the game itself after a restart, on the mod's row in the Mods tab (shop items, scripts).

## The ZIP and its files

### zip-too-big

**The ZIP is over 16 MB**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    the ZIP is over 16 MB

From the mod list (upload):

    The ZIP is larger than 16 MB.

What it means: A mod ZIP can be at most 16 MB.

How to fix it: Use fewer or smaller textures, or save them as BC7 or DXT compressed DDS files. You can also split the mod into two mods.

### zip-unreadable

**Not a ZIP the game can read**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    this is not a ZIP the game can open (invalid zip data)
    that is not a file the game can read
    my-mod.zip is not a ZIP the game can read (invalid zip data).

From the mod list (upload):

    This is not a ZIP file we can read.
    The upload is empty.
    "main.lua" is not the size its ZIP header says.
    The upload did not arrive whole. Try again.

What it means: The file is not a ZIP archive, or the ZIP is damaged. RAR, 7z and tar files are not ZIPs.

How to fix it: Zip the mod folder again with a normal ZIP tool. On Windows, right-click it and choose "Send to", then "Compressed (zipped) folder". On a Mac, right-click it and choose "Compress". If an upload was cut off, upload again.

### browser-no-zip

**ZIP support did not load**

Seen in: Mods tab, when you install a ZIP.

In the game page (install, check tool):

    ZIP support is unavailable (fflate.umd.min.js failed to load). Please reload the page

What it means: The game page could not load the small library it uses to open ZIPs. Your mod is fine.

How to fix it: Reload the page. If it keeps happening, an ad or script blocker may be stopping the file, so allow playaconline.com.

### zip-no-manifest

**No mod.json at the top of the ZIP**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    There is no mod.json at the top of the ZIP

From the mod list (upload):

    There is no mod.json at the top of the ZIP.

What it means: mod.json was not found at the top of the ZIP, or inside one top folder that holds everything. A mod.json two folders down, or a ZIP with two top folders, does not count.

How to fix it: Zip the files inside your mod folder, or the mod folder itself, not its parent folder. Open the ZIP to check that mod.json is at the top or inside the only folder.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    more than 2000 files

From the mod list (upload):

    The ZIP holds 2001 files, more than 2000.
    The ZIP has more than 10000 entries. A mod holds at most 2000 files.

What it means: A mod holds at most 2000 files. Folders, junk files such as __MACOSX and Thumbs.db, and names that start with a dot are not counted.

How to fix it: Take out files the mod does not use, or split it into two mods.

### zip-unpacked-too-big

**Unpacks to more than 64 MB**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    it unpacks to more than 64 MB

From the mod list (upload):

    The files expand to more than 64 MB.

What it means: All the files in a mod together can be at most 64 MB once unzipped.

How to fix it: Use compressed DDS textures (BC7, DXT1 or DXT5), or make the textures smaller. On a phone, all switched-on mods together get 24 MB.

### zip-duplicate-entry

**A file is in the ZIP twice**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "mod.json" is in the ZIP twice

From the mod list (upload):

    The ZIP holds "mod.json" twice.

What it means: The same path appears twice inside the ZIP. Some tools do this when you add files to an existing ZIP.

How to fix it: Make a fresh ZIP from the folder instead of adding to an old one.

### path-unsafe

**A path is not a safe path**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

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

What it means: A path uses only English letters, digits, dashes, dots and underscores, with "/" between folders, and is at most 160 bytes. "..", "\", ":", an empty folder name and control characters are refused.

How to fix it: Rename the file or folder with plain ASCII letters, without accents or emoji, and zip again. On Windows use the built-in "Compressed (zipped) folder", which writes forward slashes.

### path-case-clash

**Two names differ only in letter case**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "data" is both a file and a folder
    "TEX.png" is both a file and a folder
    "a.txt" is both a file and a folder
    "a/b.txt" is both a file and a folder
    "a/notes.TXT" is both a file and a folder
    "x.json" is both a file and a folder

From the mod list (upload):

    "data" is a file, and "data/x.json" uses it as a folder.

What it means: One path is both a file and the folder of another file, for example "data" and "data/x.json".

How to fix it: Rename the file or the folder.

### file-type

**A file type a mod cannot hold**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "evil.js": only .json .lua .dds .png .txt .md files can be in a mod
    "LICENSE": only .json .lua .dds .png .txt .md files can be in a mod
    "inner.zip": only .json .lua .dds .png .txt .md files can be in a mod
    "tools/run.exe": only .json .lua .dds .png .txt .md files can be in a mod
    "x.txt.exe": only .json .lua .dds .png .txt .md files can be in a mod

From the mod list (upload):

    "evil.js" is not an allowed file type. Mods may carry .json .lua .dds .png .txt .md files.

What it means: A mod can only hold .json, .lua, .dds, .png, .txt and .md files. Anything else is refused, for example a ZIP inside the ZIP, a .jpg or a LICENSE file with no extension.

How to fix it: Take the file out. Give a text file a .txt or .md name, such as LICENSE.txt. Save pictures as .png or .dds, which the game draws as textures.

### file-too-big

**A file is too big**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    mod.json is over 64 KB
    "data/big.json" is over 256 KB
    "main.lua" is over 512 KB
    "data.json" is over 256 KB
    "m.txt" is over 256 KB
    "s.txt" is over 256 KB

From the mod list (upload):

    mod.json is larger than 64 KB.
    "main.lua" is larger than 512 KB, the most a .lua file may be.
    "notes.txt" is larger than 512 KB, the most a .txt or .md file may be.

What it means: mod.json can be at most 64 KB, any other .json file 256 KB and any .lua file 512 KB. The mod list also takes a .txt or .md file of at most 512 KB. The game does not read those files, so a bigger one still installs from a file.

How to fix it: Split a big messages file into several mods, or move data out of mod.json. A mod has one script file, so shorten a big script or move part of it into a second mod. Shorten a big README, or link to the long version from it.

### file-lone-cr

**A line ends with a lone carriage return**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "main.lua" has a carriage return with no line feed after it. Save it with LF or CRLF line endings
    "en.json" has a carriage return with no line feed after it. Save it with LF or CRLF line endings

From the mod list (upload):

    "main.lua" has a carriage return with no line feed after it. Save it with LF or CRLF line endings.

What it means: Lua ends a line at a carriage return (CR) on its own, but the review shows a file broken at line feeds (LF) only. Code after a lone CR would look like part of the line before it, a comment for example, while the game runs it. So a mod's .lua and .json files must end lines with LF or CRLF. The Mods tab, playac-mod check and the mod list all refuse it.

How to fix it: Set your editor to LF (or CRLF) line endings and save the file again. Old Mac editors write CR alone.

## JSON files

### json-duplicate-key

**A JSON key appears twice**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    messages/en.json: duplicate key "greet"
    data/x.json: duplicate key "a"
    messages.json: duplicate key "hi"
    messages.json: duplicate key "�"
    messages/en.json: duplicate key "hours"
    mod.json: duplicate key "a"

From the mod list (upload):

    messages/en.json has the key "greet" twice.

What it means: The same key is written twice in one JSON object. Tools disagree on which copy to keep, so it is refused.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    mod.json is not valid JSON
    shops.json: a number is out of range
    data/x.json is not valid JSON
    messages.json: a number is out of range
    notes.json: a number is out of range
    x.json is not valid JSON

From the mod list (upload):

    mod.json is not valid JSON.
    shops.json is not valid JSON: a syntax error at byte 42.
    notes.json is not valid JSON: a number is out of range.
    notes.json is not valid JSON: it is not UTF-8 text.

What it means: The file is not valid JSON. The usual causes are a missing comma or quote, a comma after the last item, a comment, single quotes, or a byte order mark at the start. A file saved in an encoding other than UTF-8 is refused as well. So is a number too large to hold, such as 1e999, in any .json file of the mod.

How to fix it: Open the file in VS Code, which underlines the mistake, or paste it into a JSON checker. JSON has no comments and no trailing commas, and strings use double quotes. Save as UTF-8 without BOM.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    d.json: nested more than 32 levels deep
    messages.json: nested more than 32 levels deep
    mod.json: nested more than 32 levels deep

From the mod list (upload):

    d.json is nested more than 32 levels deep.

What it means: The game reads objects and lists nested at most 32 levels deep. This file goes deeper.

How to fix it: Flatten the data. Keep the file a simple object of keys to values or small lists.

## mod.json

### manifest-unreadable

**mod.json could not be read**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    mod.json could not be read: bad JSON at byte 12

What it means: The game could not read mod.json when it started, although the file passed the install check.

How to fix it: Reinstall the mod from its ZIP. If it keeps happening, report it with the mod attached, because it is a bug in the game.

### manifest-not-object

**mod.json is not a JSON object**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    mod.json is not a JSON object

From the mod list (upload):

    mod.json must be a JSON object.

What it means: mod.json must be one object in curly braces, not a list or a single value.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; the Mod log in Settings, Mods.

In the game page (install, check tool):

    "api" must be a whole number, the mod API level the mod is made for (1 today)

From the mod list (upload):

    mod.json must say "api" as a whole number, the mod API level it is made for (1 today).

From the game (Mods tab row):

    mod.json needs "api": 1

What it means: "api" is the API level your mod is written for, as a whole number like 1 without quotes. A mod.json without it is refused when you install, check or share the mod. The game does not load a mod that has none.

How to fix it: Add "api": 1 to mod.json. 1 is the current API level.

Bad (mod.json):

```
{
  "schema": 1,
  "api": "1",
  ...
}
```

Fixed (mod.json):

```
{
  "schema": 1,
  "api": 1,
  ...
}
```

### api-older

**Made for an older game**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    made for an older game: it is made for mod API 0, this game reads 1
    made for an older game: it is made for mod API -1, this game reads 1

From the mod list (upload):

    This mod is made for an older game: it says mod API 0, and the game reads 1.

What it means: The mod names an API level this game no longer reads, or it has no "api" at all. The game does not load it.

How to fix it: If you installed it, look for an update to the mod. If you made it, read the changelog, update the mod and set "api" to 1.

### api-newer

**Needs a newer game**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    needs a newer game: it is made for mod API 2, this game reads 1
    needs a newer game: it is made for mod API 1000, this game reads 1

From the mod list (upload):

    This mod needs a newer game: it says mod API 2, and the game reads 1.

What it means: The mod is written for a newer API level than this game has.

How to fix it: Reload the page to get the newest game. If it still says this, that level is not released, so set "api" to 1.

### manifest-schema

**"schema" must be 1**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "schema" must be 1

From the mod list (upload):

    mod.json must say "schema": 1.

What it means: "schema" is the format of mod.json itself. It is always the number 1.

How to fix it: Add "schema": 1 to mod.json, as a number without quotes.

### manifest-unbuilt-key

**A key that is not built yet**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "game" is not built yet, so a mod cannot use it: take it out of mod.json
    "save" is not built yet, so a mod cannot use it: take it out of mod.json

From the mod list (upload):

    "game" is not built yet, so a mod cannot use it. Take it out of mod.json.

What it means: "game" and "save" are reserved keys that the game does not use. A mod.json with either of them is refused, even when it is set to null.

How to fix it: Take the key out of mod.json.

### unknown-key

**A key the game does not know**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    mod.json: unknown key "permisions" (did you mean "permissions"?)
    mod.json: unknown key "homepage"
    shops: unknown key "shop" (did you mean "shops"?)
    talk: pool 1: unknown key "chanse" (did you mean "chance"?)
    shops: shop 1: stock 2: unknown key "cost"
    calendar: day 1: date: unknown key "wek" (did you mean "week"?)

From the mod list (upload):

    mod.json: unknown key "permisions" (did you mean "permissions"?)
    shops.json: shop 1: unknown key "note"
    calendar.json: day 2: unknown key "bord" (did you mean "board"?)

From the game (Mods tab row):

    mod.json: unknown key "permisions" (did you mean "permissions"?)
    shops.json: unknown key "shop" (did you mean "shops"?)

What it means: mod.json, each content file and each entry in them take only the keys the reference lists. Any other key is refused, so a typo like "permisions" cannot quietly switch a feature off. "$schema" is always allowed at the top of a file.

How to fix it: Fix the spelling or take the key out. Keys are case-sensitive, and the message offers the key it thinks you meant. Put notes for yourself in a README.md, not in the JSON.

Bad (mod.json):

```
"permisions": ["send_letter"]
```

Fixed (mod.json):

```
"permissions": ["send_letter"]
```

### manifest-id-reserved

**The id uses a reserved author name**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The id "example.tea-stall" starts with "example", which is reserved for the site's own mods. Use your own name before the dot.

What it means: The mod list keeps the author names playaconline, official, admin and example for the site's own mods. You can install such a mod from a file, but you cannot share it.

How to fix it: Change the part before the dot to your own name, like "yourname.tea-stall".

### manifest-id

**"id" is not author.mod-name**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "id" must look like author.mod-name (lowercase letters, digits and dashes, at most 32 + 48)

From the mod list (upload):

    The id "Tea Stall" must look like author.mod-name: lowercase letters, digits and dashes, one dot.

What it means: The id is your name, a dot and the mod's name. It uses lowercase letters, digits and dashes, starts with a letter or digit, and has up to 32 characters before the dot and 48 after.

How to fix it: Use something like "yourname.tea-stall". The id names the mod everywhere and cannot change later.

Bad (mod.json):

```
"id": "YourName/Tea Stall"
```

Fixed (mod.json):

```
"id": "yourname.tea-stall"
```

### manifest-name

**"name" must be 1 to 60 characters**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "name" must be 1 to 60 characters

From the mod list (upload):

    The name must be 1 to 60 characters.
    The name must be 1 to 60 characters on one line, with no control or text-direction characters.

What it means: The name players read on the Mods tab is required and at most 60 characters. The mod list also refuses a name with a line break, a tab, another control character or a hidden text-direction character.

How to fix it: Give the mod a short name on one line. If you pasted it, type it again, because a hidden character came with it.

### manifest-version

**"version" is not like 1.0.0**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "version" must be like 1.0.0 (each part 1 to 9 digits, no leading zeros)

From the mod list (upload):

    The version "v1.0" must be three numbers like 1.0.0, each 1 to 9 digits with no leading zero.

What it means: The version is three whole numbers with dots, in quotes, like "1.0.0". A "v", a fourth part and leading zeros like "01" are refused.

How to fix it: Use "1.0.0" for a first release and raise it for every update you share. Use "1.0.1" for a fix and "1.1.0" for something new.

### manifest-authors

**"authors" must list 1 to 8 names**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "authors" must list 1 to 8 names of 1 to 40 characters

From the mod list (upload):

    List 1 to 8 authors.
    Each author must be 1 to 40 characters.
    Each author must be 1 to 40 characters on one line, with no control or text-direction characters.

What it means: "authors" is a list of 1 to 8 names in square brackets, each 1 to 40 characters. The mod list also refuses a name with a line break, another control character or a hidden text-direction character.

How to fix it: Write the names as a list, even for one author, like "authors": ["yourname"].

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "description" must be text of at most 500 characters

From the mod list (upload):

    The description must be text of at most 500 characters.

What it means: "description" is optional. When present it must be text of at most 500 characters, and null is refused.

How to fix it: Shorten it, or take the key out.

### manifest-tags

**"tags" must come from the list**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "tags" must list at most 5 different tags from: textures, clothing, furniture, scenery, villagers, dialogue, shops, seasonal, holidays, quality-of-life, humor, accessibility, scripts

From the mod list (upload):

    tags must list at most 5 different tags from: textures, clothing, furniture, scenery, villagers, dialogue, shops, seasonal, holidays, quality-of-life, humor, accessibility, scripts.

What it means: "tags" is an optional list of at most 5 different tags from the fixed list, in lower case. Players filter the mod list by them, and the game never reads them.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scope" must be "client" or "world"

From the mod list (upload):

    The scope must be "client" or "world".

What it means: "scope": "client" makes a Just you mod, which only you see. "scope": "world" makes a World mod, which changes your town for visitors too. Only a World mod may hold a shop, a bulletin board notice (a calendar file with "board"), the permission set_shop_goods or the permission set_shop_open.

How to fix it: Use "world" if the mod has a shop, a bulletin board notice (a calendar file with "board"), the permission set_shop_goods or the permission set_shop_open. Otherwise use "client".

### manifest-assets-original

**"assets_original" must be true**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "assets_original" must be true: a mod may only contain work its authors made, never files taken from the game

From the mod list (upload):

    mod.json must say "assets_original": true, your promise that the mod holds no Nintendo assets. Mods with game assets can't be uploaded.

What it means: "assets_original": true is your promise that every file in the mod is your own work, with nothing taken from the game, Nintendo or anyone else. Without it the mod is refused.

How to fix it: Make sure the promise is true, then add "assets_original": true.

## "content" in mod.json

### shops-need-world

**A shop needs "scope": "world"**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    "content.shops" changes what visitors see, so "scope" must be "world"
    "permissions" lists "set_shop_goods", which changes what visitors see, so "scope" must be "world"

From the mod list (upload):

    content.shops changes what visitors see, so mod.json needs "scope": "world".
    permissions lists set_shop_open, which changes what visitors see, so mod.json needs "scope": "world".

From the game (Mods tab row):

    shops change what visitors see, so the mod needs "scope": "world"

What it means: A shop changes your town for visitors, so a mod with "shops", or a script with the permission set_shop_goods or set_shop_open, must be a World mod. Friends may need the same mods to visit.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content" must be an object

From the mod list (upload):

    content must be an object.

What it means: "content" is an object that maps each kind of content to a path, like { "textures": "textures/", "messages": "messages/en.json", "shops": "shops.json" }.

How to fix it: Write it in curly braces with one key per kind of content.

### content-unknown

**Something a mod cannot add yet**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "content.buildings" is not something a mod can add yet
    "content.Messages" is not something a mod can add yet
    "content.Shops" is not something a mod can add yet
    "content.acres" is not something a mod can add yet
    "content.furniture" is not something a mod can add yet
    "content.quests" is not something a mod can add yet

From the mod list (upload):

    content.buildings is not something a mod can add yet. Use textures, messages, shops, items, letters, calendar, talk.

What it means: "content" can hold "textures", "messages", "shops", "items", "letters", "calendar" and "talk", spelled exactly like that in lowercase. A mod cannot add buildings, acres or anything else. "translations" was dropped before release: every text shows as written.

How to fix it: Take the key out, or fix its spelling and case. "Messages" is not "messages".

### content-path

**A content path is not inside the mod**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    "content.messages" must be a path inside the mod
    "content.talk" must be a path inside the mod

From the mod list (upload):

    content.messages must be a path inside the mod.

From the game (Mods tab row):

    messages path is not inside the mod: ../x.json

What it means: Each "content" value is a path inside the mod, like "messages/en.json". It is text, not empty, with forward slashes, and has no ".." and no leading "/".

How to fix it: Write the path as it is inside the ZIP, relative to mod.json.

### content-missing

**A content path names a file that is not there**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

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

What it means: mod.json names a file that is not in the ZIP. For textures it names a folder, which must hold at least one file. Every other key names one file: "messages" names one .json file, never a folder of languages.

How to fix it: Check the path against the ZIP, with the exact letter case. "EN.json" is not "en.json". Check that the file was zipped.

## scripts in mod.json

### scripts-not-object

**"scripts" must be an object**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts" must be an object

From the mod list (upload):

    scripts must be an object with main and events.

What it means: "scripts" is an object with "main" (your .lua file) and "events" (the events it listens to).

How to fix it: Write "scripts": { "main": "main.lua", "events": ["villager_talked"] }.

### scripts-unknown-key

**An unknown key in "scripts"**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts.entry" is not a scripts setting (only main and events)
    "scripts.Main" is not a scripts setting (only main and events)
    "scripts.hooks" is not a scripts setting (only main and events)

From the mod list (upload):

    scripts.entry is not a scripts setting. Use main and events.

What it means: "scripts" takes only "main" and "events" (lowercase).

How to fix it: Rename or remove the other key.

### scripts-main-missing

**The script file is not in the mod**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, "Script stopped" on the mod's row.

In the game page (install, check tool):

    "scripts.main" names main.lua, which is not in the mod
    "scripts.main" names other.lua, which is not in the mod

From the mod list (upload):

    scripts.main names "main.lua", which is not in the ZIP.

From the game (Mods tab row):

    scripts.main could not be read (missing, or over 512 KB)

What it means: "scripts.main" names a .lua file that is not in the ZIP, or the game could not read it.

How to fix it: Put the script in the ZIP at exactly the path "main" names, with the same letter case.

### scripts-main

**"scripts.main" must be a .lua file**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, "Script stopped" on the mod's row.

In the game page (install, check tool):

    "scripts.main" must be a .lua file inside the mod (lowercase .lua)

From the mod list (upload):

    scripts.main must name a .lua file (a lowercase .lua) inside the mod.

From the game (Mods tab row):

    scripts.main must end in lowercase .lua
    the mod's folder path is too long

What it means: When "scripts" is there, "scripts.main" is required. It is a path inside the mod that ends in lowercase ".lua", so "main.LUA" is refused.

How to fix it: Rename the file to end in .lua and write "main": "main.lua".

### scripts-events

**"scripts.events" is not a list of events**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "scripts.events" must list one or more events, each once, from: villager_talked, day_started, item_picked_up, scene_entered, data_migrated, hour_changed, item_bought, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_finished, question_answered, timer_fired, villager_answered

From the mod list (upload):

    scripts.events must list at least one of villager_talked, day_started, item_picked_up, scene_entered, data_migrated, hour_changed, item_bought, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_finished, question_answered, timer_fired, villager_answered.
    scripts.events lists "every_frame", which is not an event. Use villager_talked, day_started, item_picked_up, scene_entered, data_migrated, hour_changed, item_bought, item_sold, fish_caught, bug_caught, letter_read, villager_moved_in, visitor_arrived, command_finished, question_answered, timer_fired, villager_answered.
    scripts.events lists "day_started" twice.

What it means: "events" lists every event your script listens to with on(), each once, in lowercase. A library mod that only offers functions to other mods still lists one event, and need not register a handler for it.

How to fix it: List each event your script uses, once. The events are on the Events reference.

Bad (mod.json):

```
"scripts": { "main": "main.lua", "events": ["Villager_Talked", "every_frame"] }
```

Fixed (mod.json):

```
"scripts": { "main": "main.lua", "events": ["villager_talked"] }
```

### scripts-permissions

**"permissions" is not a list of commands**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "permissions" must list one or more commands, each once, from: send_letter, give_item, show_line, ask, take_item, take_bells, set_shop_goods, set_shop_open

From the mod list (upload):

    permissions must list at least one of send_letter, give_item, show_line, ask, take_item, take_bells, set_shop_goods, set_shop_open.
    permissions lists "teleport", which is not a command. Use send_letter, give_item, show_line, ask, take_item, take_bells, set_shop_goods, set_shop_open.
    permissions lists "ask" twice.

What it means: "permissions" lists the commands your script may use, each once, from send_letter, give_item, show_line, ask, take_item, take_bells, set_shop_goods and set_shop_open. Players see the list on the Mods tab.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "permissions" is for a mod with "scripts": only a script can use a command

From the mod list (upload):

    permissions is for a mod with scripts: only a script can use a command.

What it means: Only a script can use a command, so "permissions" needs "scripts".

How to fix it: Add "scripts", or remove "permissions".

### manifest-exports

**"exports" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; the Mod log in Settings, Mods.

In the game page (install, check tool):

    "exports" must be an object of at most 32 function names (1 to 32 of a-z 0-9 _), each with a description of 1 to 120 characters on one line

From the mod list (upload):

    exports must be an object of at most 32 function names (1 to 32 of a-z, 0-9 and _), each with a description of 1 to 120 characters on one line.

From the game (Mods tab row):

    mod.json "exports" must be an object of at most 32 function names, each with a one-line description of 1 to 120 characters: it is ignored

What it means: "exports" lists the functions a library offers other mods, as { "name": "what it does" }. It holds at most 32 names. A name is 1 to 32 characters from a-z, 0-9 and _. A description is 1 to 120 characters on one line.

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

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "exports" is for a mod with "scripts": only a script offers functions

From the mod list (upload):

    exports is for a mod with scripts: only a script offers functions.

What it means: Only a script offers functions (remote.add), so "exports" needs "scripts".

How to fix it: Add "scripts", or remove "exports".

## shops.json

### shops-file

**shops.json needs a "shops" object of shop ids**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: "shops" must be an object of shop ids, like { "nook": { ... } }

From the mod list (upload):

    shops.json: "shops" must be an object of shop ids, like { "nook": { ... } }.

From the game (Mods tab row):

    shops file needs a "shops" object of shop ids

What it means: shops.json is an object with a "shops" object. Each key is a shop id ("nook", "flower", "redd", "saharah", "fireworks", "able", "barber", "dream" and "katrina"), and each value is the shop's block, or a list of blocks.

How to fix it: Write the file as { "shops": { "nook": { ... } } }.

Bad (shops.json):

```
{ "shops": [{ "goods": [{ "item": "0x2800" }] }] }
```

Fixed (shops.json):

```
{ "shops": { "flower": { "goods": [{ "item": "0x2800" }] } } }
```

### shop-id

**There is no shop with that id**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: there is no shop "nok" (did you mean "nook"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina
    shops: there is no shop "": the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina
    shops: there is no shop "Flower" (did you mean "flower"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina
    shops: there is no shop "Nook" (did you mean "nook"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina
    shops: there is no shop "baker" (did you mean "barber"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina
    shops: there is no shop "barbers" (did you mean "barber"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina

From the mod list (upload):

    shops.json: there is no shop "nok" (did you mean "nook"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina.

From the game (Mods tab row):

    shops: there is no shop "nok" (did you mean "nook"?): the shops are nook, flower, redd, saharah, fireworks, able, barber, dream, katrina

What it means: A key of "shops" names the shop it changes. The shops are "nook", "flower", "redd", "saharah", "fireworks", "able", "barber", "dream" and "katrina", in lowercase. The message offers the id it thinks you meant.

How to fix it: Use one of the shop ids. The table in the Shops guide lists them.

### shop-blocks

**A shop takes one block or 1 to 8**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store takes one block or a list of 1 to 8 blocks
    shops: the flower shop takes one block or a list of 1 to 8 blocks

From the mod list (upload):

    shops.json: Nook's store takes one block or a list of 1 to 8 blocks.

From the game (Mods tab row):

    shops: Nook's store takes one block or a list of 1 to 8 blocks

What it means: A shop takes one block (an object), or a list of 1 to 8 blocks. An empty list changes nothing, so it is refused.

How to fix it: Give the shop one block, or a list with at least one.

### shop-not-object

**A block is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store block 2: a block must be an object
    shops: Nook's store block 1: a block must be an object
    shops: the flower shop block 1: a block must be an object

From the mod list (upload):

    shops.json: Nook's store block 2: a block must be an object.

From the game (Mods tab row):

    shops: Nook's store block 2: a block must be an object

What it means: Each block of a shop is an object in curly braces.

How to fix it: Write each block as { "goods": [ ... ] }, or { "when": { ... }, "open": true }.

### shop-block-empty

**A block changes nothing**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: a block needs a field besides "when"

From the mod list (upload):

    shops.json: the flower shop: a block needs a field besides "when".

From the game (Mods tab row):

    shops: the flower shop: a block needs a field besides "when"

What it means: A block says what changes: goods, open, own_goods, a percent, services, a name or lines. "when" alone only says when, so the block would change nothing.

How to fix it: Add what the block changes, or take the block out.

### shop-name

**Shop "name" must be 1 to 40 characters on one line**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: "name" must be 1 to 40 characters on one line

From the mod list (upload):

    shops.json: the flower shop: "name" must be 1 to 40 characters on one line.

From the game (Mods tab row):

    shops: the flower shop: "name" must be 1 to 40 characters on one line

What it means: The flower shop's name is shown on its door sign while the shop is shut. It is 1 to 40 characters on one line, and a line break in it is refused.

How to fix it: Shorten it and take out any line break, or leave it out.

### shop-hours-same

**Hours that start and end at the same time**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: "hours" from and to must differ
    shops: Nook's store: "hours" from and to must differ

From the mod list (upload):

    shops.json: the flower shop: "hours" from and to must differ.

From the game (Mods tab row):

    shops: the flower shop: "hours" from and to must differ

What it means: "when.hours" gives the same time twice. A block that applies around the clock leaves "hours" out.

How to fix it: Leave "hours" out, or give two different times.

### shop-hours

**"hours" are not "HH:MM"**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store: "hours" must be { "from": "HH:MM", "to": "HH:MM" }, 00:00 to 23:59
    shops: the flower shop: "hours" must be { "from": "HH:MM", "to": "HH:MM" }, 00:00 to 23:59

From the mod list (upload):

    shops.json: Nook's store: "hours" must be { "from": "HH:MM", "to": "HH:MM" }, 00:00 to 23:59.

From the game (Mods tab row):

    shops: Nook's store: "hours" must be { "from": "HH:MM", "to": "HH:MM" }, 00:00 to 23:59

What it means: "when.hours" is { "from": "HH:MM", "to": "HH:MM" } in 24-hour time with two digits each, so "09:00", not "9:00" or "9am". "to" can be past midnight.

How to fix it: Write both times with two-digit hours and minutes.

Bad (shops.json):

```
"when": { "hours": { "from": "9am", "to": "6pm" } }
```

Fixed (shops.json):

```
"when": { "hours": { "from": "09:00", "to": "18:00" } }
```

### shop-when

**A "when" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store: "when": "season" must be spring, summer, fall or winter
    shops: Nook's store block 2: goods 1 "when": "weekday" must list 1 to 7 different days, monday to sunday
    shops: the flower shop: "when" must be an object with at least one of hours, time, season, weather, weekday, month, setting
    shops: the flower shop: "when": "month" must list 1 to 12 different months, 1 to 12
    shops: the flower shop: "when": "season" must be spring, summer, fall or winter
    shops: the flower shop: "when": "time" must be morning, day, evening or night

From the mod list (upload):

    shops.json: Nook's store: "when": "season" must be spring, summer, fall or winter.

From the game (Mods tab row):

    shops: Nook's store: "when": "season" must be spring, summer, fall or winter
    shops: Nook's store: "when": "month" must list 1 to 12 different months, 1 to 12: goods 1

What it means: "when" holds at least one of hours, time (morning, day, evening, night), season (spring, summer, fall, winter), weather (clear, rain, snow), weekday (a list of monday to sunday), month (a list of 1 to 12) and setting. The block or good applies while every key holds.

How to fix it: Spell the value in lowercase as listed, and write weekday and month as lists, like ["saturday", "sunday"] or [10, 11].

### shop-when-setting

**"when.setting" names no bool world setting**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store: "when": "setting" must name a bool setting of this mod with scope world: night_shop
    shops: the flower shop: "when": "setting" must name a bool setting of this mod with scope world: market
    shops: the flower shop: "when": "setting" must name a bool setting of this mod with scope world: stalls

From the mod list (upload):

    shops.json: Nook's store: "when": "setting" must name a bool setting of this mod with scope world: night_shop.

From the game (Mods tab row):

    shops: Nook's store: "when": "setting" must name a bool setting of this mod with scope world: night_shop

What it means: "when.setting" names one of this mod's own settings in mod.json. It must be of type bool, so it is on or off, and of scope world, so a visitor sees the same shop as the host.

How to fix it: Declare the setting in mod.json "settings" with "type": "bool", and leave its scope out or make it "world".

### shop-flag

**"open" or "own_goods" is not true or false**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store: "open" must be true or false
    shops: Nook's store: "own_goods" must be true or false

From the mod list (upload):

    shops.json: Nook's store: "open" must be true or false.

From the game (Mods tab row):

    shops: Nook's store: "own_goods" must be true or false

What it means: "open" and "own_goods" are true or false, without quotes.

How to fix it: Write true or false, not "yes" or "true".

### shop-percent

**A percent is not 1 to 1000**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Crazy Redd's tent: "price_percent" must be a whole number from 1 to 1000
    shops: Nook's store: "buy_back_percent" must be a whole number from 1 to 1000

From the mod list (upload):

    shops.json: Crazy Redd's tent: "price_percent" must be a whole number from 1 to 1000.

From the game (Mods tab row):

    shops: Crazy Redd's tent: "price_percent" must be a whole number from 1 to 1000

What it means: "price_percent" and "buy_back_percent" are whole numbers from 1 to 1000. 100 is the game's own price, 50 is half and 200 is double. A price is never under what Nook pays for the item.

How to fix it: Write a whole number like 80 or 150, without a % sign.

### shop-service

**A service the shop does not have, or a bad price**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the barber shop: "services" has no "shave": the barber shop has haircut
    shops: Able Sisters: "services" "design" must be a whole number of Bells from 1 to 99999
    shops: Able Sisters: "services" must be an object of service to Bells

From the mod list (upload):

    shops.json: the barber shop: "services" has no "shave": the barber shop has haircut.

From the game (Mods tab row):

    shops: the barber shop: "services" has no "shave": the barber shop has haircut

What it means: "services" sets the price of what a shop sells that is not a good, by the service's name: Able Sisters has "design", the barber shop has "haircut", the Dream Suite has "dream" and Katrina's tent has "fortune". Each price is a whole number of Bells from 1 to 99999.

How to fix it: Use the service name the shop table lists, and a whole number of Bells.

### shop-line-slot

**A line slot the shop does not have**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: "lines" has no slot "hello": the slots are greeting stock
    shops: the flower shop: "lines" must be an object of slot to a line or a list of lines

From the mod list (upload):

    shops.json: the flower shop: "lines" has no slot "hello": the slots are greeting stock.

From the game (Mods tab row):

    shops: the flower shop: "lines" has no slot "hello": the slots are greeting stock

What it means: "lines" sets what the keeper says, by slot. The flower shop has "greeting" (her hello) and "stock" (her answer about the stock).

How to fix it: Use a slot the shop table lists.

### shop-text

**A shop line is too long**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: "lines" "greeting" must be a line or a list of 1 to 8 lines, each 1 to 160 characters with at most 3 line breaks
    shops: the flower shop: "lines" "stock" must be a line or a list of 1 to 8 lines, each 1 to 160 characters with at most 3 line breaks

From the mod list (upload):

    shops.json: the flower shop: "lines" "greeting" must be a line or a list of 1 to 8 lines, each 1 to 160 characters with at most 3 line breaks.

From the game (Mods tab row):

    shops: the flower shop: "lines" "greeting" must be a line or a list of 1 to 8 lines, each 1 to 160 characters with at most 3 line breaks

What it means: A slot of "lines" is one line, or a list of 1 to 8 lines the keeper picks from each time. Each line is 1 to 160 characters with at most 3 line breaks, and shares one message box with the keeper's own words.

How to fix it: Keep each line to 160 characters and at most 3 line breaks.

### shop-field-ignored

**A field this shop does not have**

Seen in: Mods tab, on the mod's row after a restart; the check tool (playac-mod check).

From the game (Mods tab row):

    shops: Nook's store has no "lines", so it is left out
    shops: Able Sisters has no "goods", so it is left out

What it means: This is a note, and the rest of the block applies. Every field means the same on every shop, but a shop has only the fields the game can honour for it: Nook's store has no "services", "name", "lines"; the flower shop has no "buy_back_percent", "services"; Crazy Redd's tent has no "open", "buy_back_percent", "services", "name", "lines"; Saharah has no "open", "buy_back_percent", "services", "name", "lines"; the fireworks stall has no "open", "buy_back_percent", "services", "name", "lines"; Able Sisters has no "open", "own_goods", "goods", "price_percent", "buy_back_percent", "name", "lines"; the barber shop has no "own_goods", "goods", "price_percent", "buy_back_percent", "name", "lines"; the Dream Suite has no "open", "own_goods", "goods", "price_percent", "buy_back_percent", "name", "lines"; Katrina's tent has no "open", "own_goods", "goods", "price_percent", "buy_back_percent", "name", "lines". The game leaves such a field out and says so once per shop.

How to fix it: Take the field out of that shop's blocks, or keep it if you do not mind. The table in the Shops guide shows the fields each shop has.

### shop-replaced

**Another mod has this shop**

Seen in: Mods tab, on the mod's row after a restart; the Mod log in Settings, Mods.

From the game (Mods tab row):

    shops: a later mod changes the flower shop too, so this mod's change to it is not used: bean.tea-stall
    shops: a later mod changes Nook's store too, so this mod's change to it is not used: bean.night-shop

What it means: This is not an error in the mod. Two switched-on mods change the same shop, and the mod lower in the list has that shop whole. The message names the shop and that mod. This mod's changes to other shops, and the rest of the mod, load as usual.

How to fix it: Move this mod below the other one in the Mods tab, or switch the other one off, then restart. If you made the mod, say in its description which shop it changes, because a mod cannot change the order itself.

### shop-stock

**"goods" must list 1 to the goods the shop takes**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: "goods" must list 1 to 6 goods
    shops: Nook's store block 1: "goods" must list 1 to 16 goods
    shops: Crazy Redd's tent: "goods" must list 1 to 6 goods
    shops: Nook's store: "goods" must list 1 to 16 goods

From the mod list (upload):

    shops.json: the flower shop: "goods" must list 1 to 6 goods.

From the game (Mods tab row):

    shops: the flower shop: "goods" must list 1 to 6 goods

What it means: A block's "goods" lists at least one good. Nook's store takes 1 to 16, the flower shop takes 1 to 6, Crazy Redd's tent takes 1 to 6, Saharah takes 1 to 6, the fireworks stall takes 1 to 6. How many show at a time depends on the shop's spots of each kind.

How to fix it: Keep the list to what the shop takes.

### shop-item-no-model

**A good the game has no model for**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: Nook's store: goods 2 "item" 0x1220 has no model in the game: it would stand as a placeholder sign
    shops: Crazy Redd's tent: goods 1 "item" 0x107C has no model in the game: it would stand as a placeholder sign

From the mod list (upload):

    shops.json: Nook's store: goods 2 "item" 0x1220 has no model in the game: it would stand as a placeholder sign.

From the game (Mods tab row):

    shops: Nook's store: goods 2 "item" 0x1220 has no model in the game: it would stand as a placeholder sign

What it means: The game has a placeholder in place of a model for some furniture, such as the kadomatsu (0x1220): in a shop it would stand as a sign that says "dummy". A shop cannot sell one. The items list in the reference has no Model link for these pieces.

How to fix it: Pick a piece of furniture the game draws. The items list in the reference shows which ones have a model.

### shop-item-twice

**An item is stocked twice**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: goods 2 is a duplicate item: 0x2800
    shops: Nook's store: goods 2 is a duplicate item: 0x1000
    shops: Nook's store: goods 2 is a duplicate item: 0x10AA
    shops: the flower shop: goods 2 is a duplicate item: 0x28AA
    shops: the flower shop: goods 2 is a duplicate item: 0x28AB
    shops: the flower shop: goods 2 is a duplicate item: test.mod:lamp

From the mod list (upload):

    shops.json: the flower shop: goods 2 is a duplicate item: 0x2800.

From the game (Mods tab row):

    shops: the flower shop: goods 2 is a duplicate item: 0x2800

What it means: Each item can be in a block's goods once. "0x28aa" and "0x28AA" are the same item.

How to fix it: Remove the second one.

### shop-item-refused

**An item that cannot be sold**

Seen in: Mods tab, on the mod's row after a restart; the check tool (playac-mod check).

In the game page (install, check tool):

    shops: shop 1 stock 6 "item" 0x1000 (spooky wardrobe) has no shop shelf model, so the game leaves it out of the flower shop
    shops: shop 1 stock 2 "item" 0x2800 (apple) cannot be sold at Nook's store, so the game leaves it out of Nook's store

From the game (Mods tab row):

    shops: a good cannot be sold at the flower shop, left out: 0x2B00 is money
    shops: a good cannot be sold at the flower shop, left out: 0x1234 has no shop shelf model
    shops: a good cannot be sold at Nook's store, left out: 0x2800 has no spot of its kind on the shelves
    shops: a good cannot be sold at Crazy Redd's tent, left out: 0x2800 is not furniture, which his tent sells

What it means: A shop cannot sell this good, so the game left it out. The rest of the shop works. No shop sells money, tickets, grab bags, turnips or fossils. The flower shop needs a good with a shelf model, which leaves out the game's own furniture. At Nook's a good needs a spot of its kind: furniture, stationery, clothing, carpets, wallpaper, tools, umbrellas, paint, saplings or flower bags, so fruit and the signboard are refused there. Crazy Redd sells furniture, Saharah carpets, and the fireworks stall fans, pinwheels and balloons. Only Nook's and the flower shop sell a mod item.

How to fix it: Pick another item from the item list in the reference. Its Flower shop and Nook's columns show what those shops can sell. To sell furniture at the flower shop, make it a mod item of your own, or sell the game's furniture at Nook's ("nook"). `playac-mod check` warns about these goods before you install.

### shop-item

**A stock "item" is not "0x" and 4 hex digits**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod
    shops: Nook's store: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod
    shops: Nook's store: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod: test.mod:lamp
    shops: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod:  0x2800
    shops: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod: 0X2800
    shops: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod: 0x280

From the mod list (upload):

    shops.json: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod.

From the game (Mods tab row):

    shops: the flower shop: goods 1 "item" must be "0x" and 4 hex digits, or an item of this mod: 2800

What it means: An item number is a string of "0x" and exactly 4 hex digits, like "0x2800". A plain number such as 10240 is refused.

How to fix it: Put the item number in quotes with 0x in front.

Bad (shops.json):

```
"goods": [{ "item": 0x2800, "price": 600 }]
```

Fixed (shops.json):

```
"goods": [{ "item": "0x2800", "price": 600 }]
```

### shop-price

**A price is not 1 to 99999 Bells**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    shops: the flower shop: goods 1 "price" must be a whole number from 1 to 99999
    shops: Nook's store: goods 1 "price" must be a whole number from 1 to 99999

From the mod list (upload):

    shops.json: the flower shop: goods 1 "price" must be a whole number from 1 to 99999.

From the game (Mods tab row):

    shops: the flower shop: goods 1 "price" must be a whole number from 1 to 99999: 0x2800

What it means: "price" is an optional whole number of Bells from 1 to 99999, not in quotes. The game raises a price below what Nook pays for the item, so a shop cannot be used to make Bells.

How to fix it: Write a whole number like 600, or leave "price" out.

### shop-price-floor

**A price the game raises**

Seen in: the check tool (playac-mod check).

In the game page (install, check tool):

    shops: the flower shop: goods 1 "price" 50 is under the floor for 0x2800 (apple) at the flower shop: the game sells it for 500

What it means: This is a warning, and the mod still installs. A shop never sells a good for less than Nook pays for it, so the game raises a lower price to that floor.

How to fix it: Ask at least the floor, or leave "price" out for the game's usual price. The item list in the reference shows each good's floor. A town fruit at the flower shop has a floor of 500 Bells.

## New items

### items-list

**items.json needs an "items" list**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: "items" must be a list of 1 to 64 items

From the mod list (upload):

    items.json needs an "items" list of 1 to 64 items.

What it means: The file "content.items" names holds { "items": [ ... ] } with 1 to 64 items.

How to fix it: Put your items in an "items" list, at most 64 of them.

Fixed (items.json):

```
{"items": [{"id": "ghost-lantern", "name": "Ghost Lantern", "base": "0x1000", "price": 1800}]}
```

### item-not-object

**An item is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 is not an object

From the mod list (upload):

    items.json: item 1 must be an object.

What it means: Each entry of "items" is an object with id, name, base and an optional price.

How to fix it: Write each item as {"id": ..., "name": ..., "base": ...}.

### item-setting

**An unknown item setting**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "model" is not an item setting (only id, name, base, price, textures)

From the mod list (upload):

    items.json: item 1's "model" is not an item setting. Use id, name, base, price, textures.

What it means: An item may only have id, name, base, price and textures.

How to fix it: Remove the other keys. The shape comes from "base". Its pictures come from "textures", a folder of the item's own pictures.

### item-id

**An item id is not allowed**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "id" must be 1 to 32 of a-z, 0-9 and -, starting with a letter or digit

From the mod list (upload):

    items.json: item 1's id must be 1 to 32 of a-z, 0-9 and -, starting with a letter or digit.

What it means: An item id is short and lowercase. Its full id is your mod id, a colon and this id, like bean.tea-stall:ghost-lantern.

How to fix it: Use 1 to 32 lowercase letters, digits and dashes. Start with a letter or digit.

### item-id-twice

**Two items share an id**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 2 repeats the id "ghost-lantern"
    items: item 2 repeats the id "lamp"

From the mod list (upload):

    items.json: two items have the id "ghost-lantern".

From the game (Mods tab row):

    items: an id is listed twice, the second is left out: ghost-lantern

What it means: Each item id names one item.

How to fix it: Give the second item its own id.

### item-name

**An item name the game cannot show**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "name" must be 1 to 16 letters, digits, spaces or ' . , ! & -, starting with a letter or digit and not ending with a space

What it means: The game's name box holds 16 characters. Its font draws only letters, digits, spaces and ' . , ! & -.

How to fix it: Shorten the name to 16 characters and use only those characters.

### item-base

**An item "base" is not south-facing furniture**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "base" must be a furniture id facing south: 0x1000 to 0x1FFC or 0x3000 to 0x33C4, a multiple of 4
    items: item 1 "base" must be "0x" and 4 hex digits, a furniture id like "0x1234"

What it means: A mod item borrows the model of a piece of the game's furniture. "base" is that furniture's id, written as a string, facing south.

How to fix it: Pick a furniture id from the item list in the reference, written like "0x1000". Its number is a multiple of 4.

### item-price

**An item price is out of range**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "price" must be a whole number from 1 to 99999

From the game (Mods tab row):

    items: a price must be a whole number of Bells, 1 to 99999, left out: ghost-lantern

What it means: A price is a whole number of Bells from 1 to 99999. Leave it out to use the base furniture's price.

How to fix it: Use a whole number from 1 to 99999, or remove "price".

### item-textures

**An item "textures" is not a folder in the mod**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    items: item 1 "textures" must be a folder inside the mod with files in it

From the mod list (upload):

    items.json: item "ghost-lantern"'s textures must be a folder inside the mod with files in it.

From the game (Mods tab row):

    items: an item's "textures" must be a folder inside the mod, its pictures are left out: ghost-lantern

What it means: An item's "textures" names a folder inside the mod that holds the item's own pictures. The path is not one, or nothing is in it.

How to fix it: Put the item's pictures in a folder, like items/ghost-lantern/, and name that folder in "textures". Or remove "textures" to draw the base piece's pictures.

### item-textures-count

**An item has more than 16 pictures**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    items: item 1 "textures" folder items/ghost-lantern/ holds 17 files, at most 16
    items: item 1 "textures" folder items/lamp/ holds 17 files, at most 16

From the mod list (upload):

    items.json: item "ghost-lantern"'s textures folder "items/ghost-lantern/" holds 17 files, at most 16.

From the game (Mods tab row):

    items: an item's textures folder holds more than 16 files, the rest are left out: ghost-lantern

What it means: One item's textures folder holds at most 16 files, counting its subfolders. A piece of furniture draws only a few pictures.

How to fix it: Keep only the pictures the base piece draws. The model viewer lists the base piece's textures.

### item-textures-name

**A file in an item's textures folder is not a texture**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    items: item 1 "textures" file items/ghost-lantern/notes.txt is not a .png or .dds texture name (tex1_WxH_hash[_palette]_fmt)
    items: item 1 "textures" file items/lamp/notes.txt is not a .png or .dds texture name (tex1_WxH_hash[_palette]_fmt)

From the mod list (upload):

    items.json: item "ghost-lantern"'s textures file "items/ghost-lantern/notes.txt" is not a .png or .dds texture name (tex1_WxH_hash[_palette]_fmt).

What it means: Every file in an item's textures folder is a picture named after the base piece's texture, the way a texture mod names its files.

How to fix it: Rename the picture to the name the model viewer shows for the base piece's texture, ending in .png or .dds. Move any other file out of the folder.

### item-textures-overlap

**An item's textures folder is part of content.textures**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    items: item 1 "textures" folder textures/ghost-lantern/ is inside content.textures or holds it: there its pictures would change every copy of the base
    items: item 1 "textures" folder art/ is inside content.textures or holds it: there its pictures would change every copy of the base
    items: item 1 "textures" folder textures/lamp/ is inside content.textures or holds it: there its pictures would change every copy of the base

From the mod list (upload):

    items.json: item "ghost-lantern"'s textures folder "textures/ghost-lantern/" is inside content.textures or holds it. There its pictures would change every copy of the base.

From the game (Mods tab row):

    items: an item's textures folder is inside content.textures or holds it, its pictures are left out: ghost-lantern

What it means: The pictures in content.textures change every copy of a texture in the game. An item's own pictures must be outside that folder, or they would change every copy of the base piece too.

How to fix it: Move the item's pictures to a folder of their own beside the textures folder, like items/ghost-lantern/.

### item-malformed

**The game left out a malformed item**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: a malformed item is left out: ghost-lantern

What it means: The game left out one item. Its id, name or base breaks the rules, or it holds a key other than id, name, base, price and textures. Installing checks this first, so it shows only in developer mode or after an installed mod was edited.

How to fix it: Run `playac-mod check` and fix the item it names. An item has an id, a name, a base, an optional price and optional textures, and no other keys.

### item-base-refused

**The game cannot use this base for a mod item**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: this base cannot be a mod item, left out: ghost-lantern: base 0x1768 is a gyroid

What it means: The game left this item out because its base cannot carry a mod item. The reason after the id says why, and the rest of the mod loads.

How to fix it: Pick another south-facing furniture id: the item list in the reference has a filter for the pieces that can be a base. A base with no model cannot be used. Neither can a fossil, a gyroid, clothing, a mannequin or umbrella for a design, or a piece a player carries as an item: an umbrella, a fish, a bug, a tool, a balloon, a fan, a pinwheel or a diary.

### items-too-many-total

**More than 512 mod items across all mods**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    items: the game holds 512 mod items at most, the rest are left out: ghost-lantern

What it means: The game holds 512 mod items from all switched-on mods together. Items past that, in load order, are left out.

How to fix it: Switch off a mod with many items, or move the mod whose items you want first in the list.

### shop-mod-item-unknown

**A shop stocks an item this mod does not have**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: Nook's store: goods 1 "item" is not an item in this mod's items file: other.mod:ghost-lantern
    shops: Nook's store: goods 1 "item" is not an item in this mod's items file: other.mod:lamp
    shops: Nook's store: goods 1 "item" is not an item in this mod's items file: test.mod:nope
    shops: the flower shop: goods 1 "item" is not an item in this mod's items file: other.mod:lamp
    shops: the flower shop: goods 1 "item" is not an item in this mod's items file: test.mod:nope

What it means: A shop can stock this mod's own items by full id. Another mod's items cannot be stocked.

How to fix it: Use an id from your items file, like your.mod:ghost-lantern, or a vanilla item like "0x2800".

### shop-furniture-shared

**Two goods share one furniture**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    shops: Nook's store: goods 2 shares its furniture with another good: test.mod:chest
    shops: Nook's store: goods 2 shares its furniture with another good: 0x1008
    shops: the flower shop: goods 2 shares its furniture with another good: 0x1000

What it means: In a save, a mod item is its base furniture. So one shop cannot sell both the base and the mod item, or two mod items on one base.

How to fix it: Give one of them another base, or remove one from the goods.

### item-renames

**"renames" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "renames" needs "content.items": a rename names an item of this mod
    "renames": "chest" must be a full item id like author.mod:thing
    "renames": "test.mod:ghost-lantern" renames an item to itself
    "renames" must be an object of old item id to new item id
    "renames": "other.mod:chest" must be an old id of this mod, like test.mod:old-thing
    "renames": "test.mod:chest" must point at an item of this mod, like test.mod:thing

What it means: "renames" moves items placed under an old full id to one of this mod's items, once per save. Each key is an old full id of this mod, and each value is the full id of an item in your items file.

How to fix it: Write it as {"your.mod:chest": "your.mod:ghost-lantern"} and set content.items. Do not rename an item to itself.

## letters.json

### target-not-object

**A letter, calendar day or pool is not an object**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 is not an object
    talk: pool 2 is not an object

From the mod list (upload):

    letters.json: letter 1 must be an object.
    talk.json: pool 2 must be an object.

From the game (Mods tab row):

    letters: a letter must be an object
    calendar: a day must be an object
    talk: a pool must be an object: pool 2

What it means: Each entry of the list is a JSON object in curly braces.

How to fix it: Write each entry as an object, like { "id": "thanks", ... }.

### target-id

**A letter or calendar day "id" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "id" must be 1 to 48 of a-z 0-9 _ . -
    calendar: day 2 "id" "fair" is used twice
    calendar: day 2 "id" "harvest" is used twice
    letters: letter 2 "id" "thanks" is used twice

From the mod list (upload):

    letters.json: letter 1's id must be 1 to 48 of a-z, 0-9, _ . and -.
    calendar.json: the id "fair" is used twice.

From the game (Mods tab row):

    letters: an "id" must be 1 to 48 of a-z 0-9 _ . -: Thanks
    calendar: an "id" is used twice, the second is left out: fair

What it means: Each letter and calendar day has its own "id" of 1 to 48 lowercase letters, digits, "_", "." or "-". An id is used once in the file, and a command names a letter as "your.mod:<id>".

How to fix it: Give each entry a distinct lowercase id.

### letters-file

**letters.json needs a "letters" list**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: "letters" must be a list of 1 to 32 letters

From the mod list (upload):

    letters.json needs a "letters" list of 1 to 32 letters.

From the game (Mods tab row):

    letters file needs a "letters" list of 1 to 32

What it means: letters.json is { "letters": [ ... ] } with 1 to 32 letters.

How to fix it: Wrap the letters in a "letters" list.

Fixed (letters.json):

```
{ "letters": [{ "id": "thanks", "header": "Dear {player},", "body": "Thank you!", "footer": "A friend" }] }
```

### letter-header

**A letter "header" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "header" must be 1 to 24 plain characters besides one {player}

From the mod list (upload):

    letters.json: letter 1's header must be 1 to 24 plain characters besides one {player}.

From the game (Mods tab row):

    letters: "header" must be 1 to 24 plain characters besides {player}: thanks
    letters: "header" is too long: thanks

What it means: The header is the letter's first line. It is 1 to 24 plain characters from a US keyboard on one line, with {player} at most once where the name goes and no other { or }.

How to fix it: Shorten it, keep to plain characters and write {player} at most once.

### letter-body

**A letter "body" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines
    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines: "é" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })
    letters: letter 1 "body" must be 1 to 192 plain characters on at most 6 lines: "{" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })

From the mod list (upload):

    letters.json: letter 1's body must be 1 to 192 plain characters on at most 6 lines.
    letters.json: letter 1's body must be 1 to 192 plain characters on at most 6 lines: "’" at character 12 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or }).

From the game (Mods tab row):

    letters: "body" must be 1 to 192 plain characters on at most 6 lines: thanks

What it means: The body is 1 to 192 plain characters on at most 6 lines, with no accents, curly quotes, { or }. When a character is the problem, the message names the first one and its place, counting from 1.

How to fix it: Shorten it, or replace the character the message names with a plain one. A curly quote pasted from a word processor is the usual cause, so type a straight ' instead.

### paper-fit

**Text does not fit the letter paper or a board page**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    letters: "body" does not fit on the letter paper (6 lines): thanks
    calendar: "board" does not fit on a board page (6 lines): fair

What it means: The game wraps a letter body or a board notice at the paper's width, 192 pixels in the game's font, and keeps words whole. This text needs more than 6 lines that way, so it is left out.

How to fix it: Shorten the text, or break it into shorter lines yourself with \n. Only the game measures this, so the message shows after a restart.

### letter-footer

**A letter "footer" is not 1 to 32 plain characters**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "footer" must be 1 to 32 plain characters

From the mod list (upload):

    letters.json: letter 1's footer must be 1 to 32 plain characters.

From the game (Mods tab row):

    letters: "footer" must be 1 to 32 plain characters: thanks

What it means: The footer is the sign-off, like "Tom Nook". It is 1 to 32 plain characters on one line.

How to fix it: Shorten it and keep it on one line.

### letter-sender

**A letter "sender" is not 1 to 8 plain characters**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "sender" must be 1 to 8 plain characters

From the mod list (upload):

    letters.json: letter 1's sender must be 1 to 8 plain characters.

From the game (Mods tab row):

    letters: "sender" must be 1 to 8 plain characters: thanks

What it means: The sender is the name the mailbox list shows for the letter, and the list has room for 8 characters. Without a sender the list shows the first 8 characters of the footer.

How to fix it: Use a short name of 1 to 8 plain characters on one line, like "Lanterns", or leave "sender" out.

### letter-item

**A letter "item" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "item" must be "0x" and 4 hex digits, like "0x2800"

From the mod list (upload):

    letters.json: letter 1's item 10240 must be a string like "0x2800".

From the game (Mods tab row):

    letters: "item" must be "0x" and four hex digits: thanks
    letters: the item cannot be sent, the letter is left out: thanks: 0x2100 is money

What it means: A present is a string of "0x" and 4 hex digits. The game refuses money, turnips, tickets, grab bags, fossils and anything that is not an item or furniture.

How to fix it: Write the item like "0x2800", or pick another present.

### letter-paper

**A letter "paper" is not 0 to 63**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    letters: letter 1 "paper" must be a whole number from 0 to 63

From the mod list (upload):

    letters.json: letter 1's paper must be a whole number from 0 to 63.

From the game (Mods tab row):

    letters: "paper" must be a whole number 0 to 63: thanks

What it means: "paper" picks the stationery, as a whole number from 0 to 63. Leave it out for the first one.

How to fix it: Write a whole number from 0 to 63.

### targets-out-of-memory

**The game ran out of memory reading a file**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    letters: out of memory: thanks

What it means: The browser could not give the game memory for this entry. It is left out.

How to fix it: Restart the game. If it happens again, switch off large mods.

## calendar.json

### calendar-file

**calendar.json needs a "days" list**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    calendar: "days" must be a list of 1 to 16 days

From the mod list (upload):

    calendar.json needs a "days" list of 1 to 16 days.

From the game (Mods tab row):

    calendar file needs a "days" list of 1 to 16

What it means: calendar.json is { "days": [ ... ] } with 1 to 16 days. It is the file "content.calendar" names.

How to fix it: Wrap the days in a "days" list.

Fixed (calendar.json):

```
{ "days": [{ "id": "fair", "date": { "month": 11, "day": 20 }, "talk": ["The fair is today!"] }] }
```

### calendar-date

**A calendar day's "date" is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    calendar: day 1 "date" must be { "month", "day" } or { "month", "week" (1 to 4 or "last"), "weekday" (0 Sunday to 6) }

From the mod list (upload):

    calendar.json: day "fair"'s date must be {month, day} or {month, week 1 to 4 or "last", weekday 0 (Sunday) to 6}.

From the game (Mods tab row):

    calendar: "date" must be {month, day} or {month, week 1-4 or "last", weekday 0-6}: fair

What it means: A date is a month from 1 to 12 with either a day of that month, or a week and a weekday. The week is 1 to 4 or "last", the weekday counts from 0 for Sunday, and February 29 works.

How to fix it: Write { "month": 11, "day": 20 } or { "month": 11, "week": 4, "weekday": 4 }, not both forms.

### calendar-letter

**A calendar day's "letter" is not one of the mod's letters**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    calendar: day 1 "letter" "lantern" names no letter in this mod's letters file
    calendar: day 1 "letter" must be the id of a letter in this mod's letters file
    calendar: day 1 "letter" "lanterns" names no letter in this mod's letters file

From the mod list (upload):

    calendar.json: day "lantern-night"'s letter "lantern" names no letter in this mod's letters file.
    calendar.json: day "lantern-night"'s letter must be the id of a letter in this mod's letters file.

From the game (Mods tab row):

    calendar: "letter" names no letter in this mod's letters file: lantern-night
    calendar: "letter" must be the id of a letter in this mod's letters file: lantern-night

What it means: A calendar day's "letter" must be the "id" of a letter in the same mod's letters file. A letter the game left out, such as one that does not fit the paper, cannot be sent either.

How to fix it: Add the letter to your letters file, or fix the id to match one there exactly.

Bad (calendar.json):

```
{ "days": [{ "id": "lantern-night", "date": { "month": 11, "day": 13 }, "letter": "lantern" }] }
```

Fixed (calendar.json):

```
{ "days": [{ "id": "lantern-night", "date": { "month": 11, "day": 13 }, "letter": "lanterns" }] }
```

### calendar-board-world

**A board notice needs "scope": "world"**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    calendar: day 1 "board" changes the town, so "scope" must be "world"

From the mod list (upload):

    calendar.json: day "fair"'s board notice changes the town, so mod.json needs "scope": "world".

From the game (Mods tab row):

    calendar: a "board" notice changes the town, so the mod needs "scope": "world": fair

What it means: A notice goes up on your town's bulletin board, which a visitor reads too. A mod with one must be a World mod.

How to fix it: Set "scope": "world", or keep only a "letter", which a Just you mod may have.

### calendar-board

**A calendar day's "board" notice is not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    calendar: day 1 "board" must be 1 to 192 plain characters on at most 6 lines
    calendar: day 1 "board" must be 1 to 192 plain characters on at most 6 lines: a control character (U+0009) at character 3 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })
    calendar: day 1 "board" must be 1 to 192 plain characters on at most 6 lines: "é" at character 4 is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })

From the mod list (upload):

    calendar.json: day "fair"'s board must be 1 to 192 plain characters on at most 6 lines.

From the game (Mods tab row):

    calendar: "board" must be 1 to 192 plain characters on at most 6 lines: fair

What it means: A notice is plain text like a letter body, 1 to 192 characters on at most 6 lines. When a character is the problem, the message names the first one and its place.

How to fix it: Shorten it and keep to plain characters.

## talk.json

### talk-file

**talk.json needs a "pools" list**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: "pools" must be a list of 1 to 32 pools

From the mod list (upload):

    talk.json needs a "pools" list of 1 to 32 pools.

From the game (Mods tab row):

    talk file needs a "pools" list of 1 to 32

What it means: talk.json is { "pools": [ ... ] } with 1 to 32 pools.

How to fix it: Wrap the pools in a "pools" list.

### talk-no-place

**A pool does not say its "place"**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "place" is required: before, hello, topic, after or conversation

From the mod list (upload):

    talk.json: pool 1's place is required: before, hello, topic, after or conversation.

From the game (Mods tab row):

    talk: "place" is required: before, hello, topic, after or conversation: pool 1

What it means: Every pool says where its lines go in a villager's talk: "before" the hello, as the "hello", as the "topic" after a chat answer, "after" the topic, or the whole "conversation". There is no default.

How to fix it: Add "place" to the pool. For small talk, the most common, write "place": "topic".

Bad (talk.json):

```
{ "pools": [{ "lines": ["Nice day!"] }] }
```

Fixed (talk.json):

```
{ "pools": [{ "place": "topic", "lines": ["Nice day!"] }] }
```

### talk-place

**A pool's "place" is not a place in a talk**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "place" must be before, hello, topic, after or conversation

From the mod list (upload):

    talk.json: pool 1's place must be before, hello, topic, after or conversation.

From the game (Mods tab row):

    talk: "place" must be before, hello, topic, after or conversation: pool 1

What it means: A pool's "place" is where its line goes in a villager's talk: "before" the hello, as the "hello", as the "topic" after a chat answer, "after" the topic, or the whole "conversation". It is one of those five words, in lowercase.

How to fix it: Write one of the five places.

Bad (talk.json):

```
{ "pools": [{ "place": "greeting", "lines": ["Hi!"] }] }
```

Fixed (talk.json):

```
{ "pools": [{ "place": "hello", "lines": ["Hi!"] }] }
```

### talk-topics

**A pool's "topics" are not topics the game picks**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "topics" must be "any" or a list of small_talk, trade, letter, memory, hint and news
    talk: pool 2 "topics" goes only with "place": "topic"
    talk: pool 1 "topics" goes only with "place": "topic"

From the mod list (upload):

    talk.json: pool 1's topics must be "any" or a list of small_talk, trade, letter, memory, hint and news.
    talk.json: pool 2's topics go only with "place": "topic".

From the game (Mods tab row):

    talk: "topics" must be "any" or a list of small_talk, trade, letter, memory, hint and news: pool 1
    talk: "topics" goes only with "place": "topic": pool 2

What it means: A "topic" line stands in for the topic the game picks after a chat answer. "topics" names which kinds it may replace: small_talk (the default), trade, letter, memory, hint and news, each once, or "any" for all six. It belongs only on a pool whose place is "topic".

How to fix it: List kinds from the six, write "any", or take "topics" off a pool of another place.

Bad (talk.json):

```
{ "pools": [{ "place": "topic", "topics": ["gossip"], "lines": ["Did you hear?"] }] }
```

Fixed (talk.json):

```
{ "pools": [{ "place": "topic", "topics": ["news", "small_talk"], "lines": ["Did you hear?"] }] }
```

### talk-day

**A pool's "day" is not one of the mod's calendar days**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "day" "fair" names no day in this mod's calendar file
    talk: pool 1 "day" must be the id of a day in this mod's calendar file
    talk: pool 1 "day" "harvest" names no day in this mod's calendar file

From the mod list (upload):

    talk.json: pool 1's day "fair" names no day in this mod's calendar file.
    talk.json: pool 1's day must be the id of a day in this mod's calendar file.

From the game (Mods tab row):

    talk: "day" names no day in this mod's calendar file: pool 1

What it means: A pool's "day" keeps it to one day of the year: the "id" of a day in the same mod's calendar file. On other days the pool does not fit.

How to fix it: Add the day to your calendar file, or fix the id to match one there exactly.

Bad (talk.json):

```
{ "pools": [{ "place": "hello", "day": "fair", "lines": ["Fair day!"] }] }
```

Fixed (talk.json):

```
{ "pools": [{ "place": "hello", "day": "harvest-fair", "lines": ["Fair day!"] }] }
```

### talk-who

**A pool names a personality and a villager**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 names a "personality" or a "villager", not both

From the mod list (upload):

    talk.json: pool 1 names a personality or a villager, not both.

From the game (Mods tab row):

    talk: a pool names a "personality" or a "villager", not both: pool 1

What it means: A pool is for one villager, for one personality, or for everyone when it names neither. This pool names both.

How to fix it: Keep one of the two, or split the pool in two.

### talk-personality

**A pool's "personality" is not one the game has**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "personality" must be one of normal, peppy, lazy, jock, cranky, snooty

From the mod list (upload):

    talk.json: pool 1's personality must be one of normal, peppy, lazy, jock, cranky, snooty.

From the game (Mods tab row):

    talk: "personality" must be normal, peppy, lazy, jock, cranky or snooty: pool 1

What it means: The game has six villager personalities, written in lowercase: normal, peppy, lazy, jock, cranky and snooty.

How to fix it: Use one of the six.

### talk-villager

**A pool's "villager" is not a name**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "villager" must be a name of 1 to 8 plain characters

From the mod list (upload):

    talk.json: pool 1's villager must be a name of 1 to 8 plain characters.

From the game (Mods tab row):

    talk: "villager" must be a name of 1 to 8 plain characters: pool 1

What it means: A villager is named as the game spells it, in 1 to 8 plain characters, like "Bob". Upper and lower case do not matter.

How to fix it: Write the villager's name.

### talk-when

**A pool's "season", "time" or "weather" is not one the game has**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "season" must be spring, summer, fall or winter
    talk: pool 2 "time" must be morning, day, evening or night
    talk: pool 3 "weather" must be clear, rain or snow
    talk: pool 1 "time" must be morning, day, evening or night
    talk: pool 1 "weather" must be clear, rain or snow

From the mod list (upload):

    talk.json: pool 1's season must be spring, summer, fall or winter.
    talk.json: pool 2's time must be morning, day, evening or night.
    talk.json: pool 3's weather must be clear, rain or snow.

From the game (Mods tab row):

    talk: "season" must be spring, summer, fall or winter: pool 1
    talk: "time" must be morning, day, evening or night: pool 2
    talk: "weather" must be clear, rain or snow: pool 3

What it means: A pool can be kept to a "season" (spring, summer, fall or winter), a "time" of day (morning, day, evening or night) and the "weather" (clear, rain or snow), the game's own. Each is one of those words, in lowercase.

How to fix it: Write one of the listed words, or leave the key out for any.

### talk-chance

**A pool's "chance" is not 1 to 100**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "chance" must be a whole number from 1 to 100

From the mod list (upload):

    talk.json: pool 1's chance must be a whole number from 1 to 100.

From the game (Mods tab row):

    talk: "chance" must be a whole number 1 to 100: pool 1

What it means: "chance" is how often, in 100 talks the pool fits, its line is said, as a whole number from 1 to 100. Leave it out for every one.

How to fix it: Write a whole number from 1 to 100.

### talk-lines

**A pool's "lines" are not right**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    talk: pool 1 "lines" must list 1 to 32 lines of 1 to 160 characters with at most 3 line breaks, or lists of 1 to 8 such pages

From the mod list (upload):

    talk.json: pool 1's lines must list 1 to 32 lines of 1 to 160 characters on at most 4 lines each, or lists of 1 to 8 such pages.

From the game (Mods tab row):

    talk: "lines" must list 1 to 32 lines: pool 1
    talk: a line must be 1 to 160 characters, at most 3 newlines, or a list of 1 to 8 such pages: pool 1

What it means: A pool has 1 to 32 lines. A line is one page of 1 to 160 characters with at most 3 line breaks, or a list of 1 to 8 such pages, each starting on a clean window.

How to fix it: Shorten the lines or the list.

## Settings, dependencies, data version

### manifest-depends

**depends or conflicts is not a list of mods**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "depends" must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}
    "depends" names the mod itself
    "bean.lib" is in both "depends" and "conflicts"
    "optional_depends" must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}
    "bean.lib" is in both "depends" and "optional_depends"
    "bean.lib" is in both "optional_depends" and "conflicts"

From the mod list (upload):

    depends must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}.
    "bean.lib" is in both depends and conflicts.
    "bean.lib" is in both optional_depends and conflicts.

What it means: "depends", "optional_depends" and "conflicts" are objects of mod id to version range. Each holds at most 16 mods, never your own. One mod can be in only one of the three: needed, used when it is there, or never run with.

How to fix it: Write them as { "author.mod": ">=1.0.0" }. Keep each mod id in one of the three.

Fixed (mod.json):

```
"depends": { "yourname.tea-lib": ">=1.0.0 <2.0.0" },
"optional_depends": { "yourname.weather": "*" },
"conflicts": { "someone.other-shop": "*" }
```

### manifest-depends-range

**A version range the game cannot read**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "depends": the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"
    "optional_depends": the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"
    "conflicts": the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"

From the mod list (upload):

    depends: the range for bean.lib must be "*" or up to 4 of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0".

What it means: A range is "*" for any version, or up to 4 comparisons with one space between them. Each comparison is >=, <=, >, < or = and an x.y.z version, and "^" and "~" are not supported.

How to fix it: Write ">=1.0.0 <2.0.0" instead of "^1.0.0". Write "1.2.3" for one exact version.

### manifest-data-version

**data_version is not a whole number**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "data_version" must be a whole number from 1 to 1000000
    "scripts.events" lists "data_migrated", which needs a "data_version"

From the mod list (upload):

    data_version must be a whole number from 1 to 1000000.
    The scripts.events list has "data_migrated", which needs a data_version.

What it means: "data_version" is a whole number from 1 to 1000000 that numbers the shape of what your script saves. The "data_migrated" event runs when it changes, so that event needs one.

How to fix it: Add "data_version": 1 and raise it when you change what your script saves.

### manifest-setting-value

**A setting's default or bounds are wrong**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

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

What it means: A setting's default or bounds do not fit its type.

How to fix it: Fix what the message names. A bool default is true or false. A number has a whole min, max and default within a billion, with min below max and the default between them. A choice has 2 to 16 different choices and a default that is one of them. A text has a max_length from 1 to 200 and a one-line default no longer than that.

Fixed (mod.json):

```
"settings": [
  { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 }
]
```

### manifest-settings

**A setting is not one the game can show**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    "settings" must be a list of at most 16 settings
    settings: setting 1 "name" must be 1 to 32 of a-z 0-9 _, starting with a letter
    settings: "greet" is declared twice
    settings: "x" has "min", which a bool setting does not take
    settings: "greet" "scope" must be "world" or "client"
    settings: "greet" "description" must be text of at most 200 characters, with no invisible, text-direction or control character but a line break

From the mod list (upload):

    settings must be a list of at most 16 settings.
    settings: "x" type must be one of bool, number, choice, text.
    settings: "x" label must be 1 to 60 characters.
    settings: "greet" scope must be "world" or "client".

From the game (Mods tab row):

    settings: a "scope" must be "world" or "client": greet

What it means: "settings" is a list of at most 16 settings. Each has a name, a type, a label and only the keys its type takes.

How to fix it: Fix the setting the message names. A name is a-z, 0-9 and _, starts with a letter and is used once. A type is bool, number, choice or text. A label is 1 to 60 characters, and an optional description is at most 200. An optional scope is "world" or "client". A bool takes default. A number takes default, min and max. A choice takes default and choices. A text takes default and max_length.

### setting-refused

**A setting value was refused**

Seen in: the Mods tab.

In the game page (install, check tool):

    Say hello must be on or off
    Fruit price must be a whole number from 100 to 5000
    Drink must be one of: tea, coffee
    Motto must be at most 20 characters, on one line

What it means: The value is outside what the mod allows for that setting.

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

What it means: A mod with "depends" loads only when every mod it needs is installed, switched on, in the version range and loaded. A mod with "conflicts" stays off while the other mod is on, and mods that need each other in a circle cannot load.

How to fix it: Install or switch on the mod the message names, in the right version. For two mods that cannot run together, switch one off.

### engine-dependency

**The game did not load a mod it needs first**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    not loaded: needs yourname.tea-lib >=1.0.0 <2.0.0, which the game did not load before it
    not loaded: needs yourname.tea-lib >=2.0.0, and the game loaded 1.2.0

What it means: The game checks "depends" again when it starts. A mod this one needs did not load before it in the version range, so this mod is not loaded at all.

How to fix it: Install and switch on the mod it names, in a version inside the range, then restart. If the Mods tab shows no other message, reinstall both mods.

### engine-settings

**The game could not hand a setting to the script**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    settings: a value is not a boolean, a whole number or a line of text: frac
    settings: a text value cannot be used: motto

What it means: A stored setting value is not one the game can give a script. This happens only when the browser's copy was changed by hand.

How to fix it: Open the mod's Settings and set the value again, then restart.

## Messages files

### messages-not-object

**A messages file is not key to text**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: the file is not a JSON object of key to text

From the mod list (upload):

    messages/en.json must be a JSON object of line ids to text.

From the game (Mods tab row):

    messages file is not a JSON object

What it means: A messages file is one flat object. Each key is a line id and each value is the line's text.

How to fix it: Write it as { "greet": "Hello!", "bye": "See you!" }.

### messages-too-many

**More than 256 lines**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: a messages file has at most 256 lines

From the mod list (upload):

    messages/en.json has 300 lines, more than 256.

From the game (Mods tab row):

    messages: a messages file has at most 256 lines

What it means: A messages file can hold at most 256 lines.

How to fix it: Split the lines into two mods, or reuse lines.

### messages-key

**A line id is not 1 to 48 of a-z 0-9 _ . -**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

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

What it means: A line id is 1 to 48 characters of lowercase a-z, digits, "_", "." and "-". The game adds your mod's id in front, like "yourname.my-mod:greet".

How to fix it: Rename the key, for example "hours" or "shop.hours".

### messages-text

**A line is empty or over 400 bytes**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    messages: "greet" must be text of 1 to 400 bytes
    messages: "a" must be text of 1 to 400 bytes
    messages: "k" must be text of 1 to 400 bytes

From the mod list (upload):

    messages/en.json: the line "greet" must be text of 1 to 400 bytes.

From the game (Mods tab row):

    messages: a line must be text of 1 to 400 bytes: greet

What it means: Each line is text in quotes, 1 to 400 bytes long. Letters with accents and emoji take more than one byte.

How to fix it: Shorten the line, or split it into two lines that your script shows one after the other.

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

What it means: Every pixel of this texture equals a texture from the game or the HD pack. A mod may only hold art you made, and a PNG saved from the model viewer is the game's art.

How to fix it: Paint your own picture into the file and keep the file name. Delete files you did not change.

### texture-mipmaps

**A DDS with mipmaps or extra bytes**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "textures/a.dds" stores 7 mip levels. Save it with one level (no mipmaps): the game reads only the first.
    "textures/a.dds" has 64 bytes after its image. Save it with one level (no mipmaps) and nothing else.

What it means: The game reads only the first level of a DDS. Anything after it would go unreviewed, so the upload is refused.

How to fix it: Save the DDS again with mipmaps switched off. In GIMP choose "Mipmaps: No mipmaps". In Paint.NET untick "Generate mip maps".

### texture-size

**A texture is too big**

Seen in: Share a mod, when you upload; Mods tab, on the mod's row after a restart.

From the mod list (upload):

    "textures/a.dds" is 32768x32768. A texture is 1 to 16384 pixels a side.
    "art.png" is 4096x4096. A PNG in a mod is at most 4194304 pixels (2048x2048).
    "notes.txt" is a 9000x9000 JPEG.

From the game (Mods tab row):

    PNG texture is over 2048x2048, left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: A DDS is 1 to 16384 pixels a side. A PNG is at most 2048x2048, and the game leaves out a bigger one.

How to fix it: Scale it down. 2 or 4 times the original size already looks sharp, and bigger textures cost phone players memory.

### texture-small

**A picture smaller than, or not the shape of, the texture it replaces**

Seen in: the check tool (playac-mod check).

In the game page (install, check tool):

    textures/tex1_64x64_0123456789abcdef_14.dds is 32x32, smaller than the original 64x64: the game stretches it over the original's place, so it looks blurrier than the game's own texture
    textures/tex1_64x64_0123456789abcdef_14.dds is 128x64, not the shape of the original 64x64: the game stretches it to the original's shape, so it looks squashed

What it means: This is a warning, and the mod still installs. The game draws your picture in the original's place, so a smaller one looks blurry and one of another shape looks squashed.

How to fix it: Paint at the original size, or at 2 or 4 times it in both directions. The file name gives the original size, like tex1_64x64.

### texture-png-unreadable

**The game could not read a PNG texture**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    texture is not a PNG the game reads, left out: textures/tex1_64x64_0123456789abcdef_14.png
    PNG texture could not be read (image data is damaged), left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: The game left this file out because it is not a PNG, is damaged, or is a kind of PNG the game does not decode. The reason in brackets says which, and the rest of the mod loads.

How to fix it: Export the picture again as a plain 8-bit RGBA or RGB PNG from your paint program, or save it as a .dds.

### texture-png-budget

**Too many PNG pixels across your mods**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    PNG textures are over 96 MB of pixels, this one left out: textures/tex1_64x64_0123456789abcdef_14.png
    PNG textures are over 24 MB of pixels on a phone, this one left out: textures/tex1_64x64_0123456789abcdef_14.png

What it means: The PNG textures of all switched-on mods may decode to at most 96 MB of pixels, or 24 MB on a phone or low-memory device. PNGs past that, in load order, are left out.

How to fix it: Make your PNGs smaller, switch off another texture mod, or save big textures as compressed .dds (BC7 or DXT5). A PNG costs 4 bytes a pixel, and 2 times the original size is already sharp. DDS textures have a budget of their own.

### texture-dds-budget

**Too many DDS texture bytes across your mods**

Seen in: Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    DDS textures are over 96 MB, this one left out: textures/tex1_64x64_0123456789abcdef_14.dds
    DDS textures are over 24 MB on a phone, this one left out: textures/tex1_64x64_0123456789abcdef_14.dds

What it means: The DDS textures of all switched-on mods get 96 MB on the graphics card. A phone or low-memory device has 24 MB. DDS files past that are left out, starting with the mods highest in the list. The game's own texture is drawn instead.

How to fix it: Save big textures compressed as BC7 or DXT5, make them smaller, or switch off another texture mod. BC7 and DXT5 cost 1 byte a pixel, DXT1 half a byte and uncompressed DDS 4 bytes. PNG textures have a budget of their own, and the HD pack does not count.

### texture-twice

**The same texture as a PNG and a DDS**

Seen in: the check tool (playac-mod check).

In the game page (install, check tool):

    textures/tex1_64x64_0123456789abcdef_14.dds and textures/tex1_64x64_0123456789abcdef_14.png are the same texture: the game uses only one of them (the first it finds when it scans the folder, which you cannot choose), so the other is never drawn

What it means: This is a warning, and the mod still installs. A .png and a .dds with the same name are the same texture, and the game uses whichever it finds first.

How to fix it: Keep one of the two files and delete the other.

### texture-label

**A label before a texture name breaks the label rule**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload; the Mod log in Settings, Mods.

In the game page (install, check tool):

    textures/Bookshelf_tex1_32x32_626709d910129694_$_8.png: the label before tex1_ ("Bookshelf") must be 1 to 40 lowercase letters, digits and dashes, then one underscore
    items: item 1 "textures" folder: items/lamp/Lid_tex1_64x64_0123456789abcdef_fedcba9876543210_8.png: the label before tex1_ ("Lid") must be 1 to 40 lowercase letters, digits and dashes, then one underscore
    textures/_tex1_32x32_626709d910129694_$_8.png: the label before tex1_ ("") must be 1 to 40 lowercase letters, digits and dashes, then one underscore
    textures/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa_tex1_32x32_626709d910129694_$_8.png: the label before tex1_ ("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") must be 1 to 40 lowercase letters, digits and dashes, then one underscore
    textures/book_shelf_tex1_32x32_626709d910129694_$_8.png: the label before tex1_ ("book_shelf") must be 1 to 40 lowercase letters, digits and dashes, then one underscore
    textures/top__tex1_32x32_626709d910129694_$_8.png: the label before tex1_ ("top_") must be 1 to 40 lowercase letters, digits and dashes, then one underscore

From the mod list (upload):

    "textures/Bookshelf_tex1_32x32_626709d910129694_$_8.png": the label before tex1_ ("Bookshelf") must be 1 to 40 lowercase letters, digits and dashes, then one underscore.

From the game (Mods tab row):

    texture textures/Bookshelf_tex1_32x32_626709d910129694_$_8.png not read: the label before tex1_ must be 1 to 40 lowercase letters, digits and dashes, then one underscore

What it means: A texture file may carry a label before its name, so you can tell your files apart: bookshelf-top_tex1_32x32_626709d910129694_$_8.png is the same texture as tex1_32x32_626709d910129694_$_8.png. The label is 1 to 40 lowercase letters, digits and dashes, then one underscore. This one has a capital letter, a space, another underscore, nothing, or too many characters before tex1_.

How to fix it: Rename the file, for example Book_Shelf_tex1_... to book-shelf_tex1_.... Use lowercase letters, digits and dashes for the label, one underscore after it, and keep the tex1_ part exactly as the model viewer gave it.

### texture-label-twice

**Two files are one texture once their labels are taken off**

Seen in: Mods tab, when you install a ZIP; the check tool (playac-mod check); Share a mod, when you upload.

In the game page (install, check tool):

    textures/tex1_32x32_626709d910129694_$_8.dds and textures/top_tex1_32x32_626709d910129694_$_8.png are the same texture once labels are taken off: keep one file for a texture
    items: item 1 "textures" folder: items/lamp/lid_tex1_64x64_0123456789abcdef_fedcba9876543210_8.png and items/lamp/tex1_64x64_0123456789abcdef_fedcba9876543210_8.dds are the same texture once labels are taken off: keep one file for a texture
    textures/a/top_tex1_32x32_626709d910129694_$_8.png and textures/b/side_tex1_32x32_626709D910129694_$_08.png are the same texture once labels are taken off: keep one file for a texture

From the mod list (upload):

    "textures/tex1_32x32_626709d910129694_$_8.dds" and "textures/top_tex1_32x32_626709d910129694_$_8.png" are the same texture once labels are taken off. Keep one file for a texture.

What it means: The game matches a texture file on its tex1_ part alone, so a labelled file and another file with the same tex1_ part (labelled or not, .png or .dds, in any subfolder of the same textures folder) replace the same texture. The game could draw only one of them, so the mod is refused rather than left to pick.

How to fix it: Keep one file for each texture and delete or rename the others. Different labels do not make different textures.

### picture-misnamed

**A picture in the wrong kind of file**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "notes.txt" holds a PNG picture. Pictures go in .png or .dds files.
    "a.png" is named as .png but holds a DDS texture. Save it in the format its name says.
    "photo.png" is a picture in a format mods can't carry. Save it as PNG or DDS.

What it means: Every file is checked for what it really holds. A picture in a .txt, .json or .md file is refused, and so is a .png that holds a DDS, a .dds that holds a PNG, and any JPEG, GIF or WebP.

How to fix it: Save each picture as a real .dds or .png, with the extension that matches its format.

### png-extra-data

**A PNG with animation or app data**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "art.png" holds a acTL chunk, which a picture in a mod may not carry (an animation frame or app data). Export it again as a plain PNG.
    "art.png" holds more than 64 KB of metadata. Export it again without metadata.

What it means: A PNG in a mod is a plain picture. Animation frames, data in extra chunks and more than a little metadata are refused, because hidden data would go unreviewed.

How to fix it: Export the picture again as a plain PNG with "save metadata" switched off. That covers EXIF, XMP, comments and the colour profile.

### texture-format

**A texture format the game cannot load**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "textures/a.dds" is not a DDS file.
    "textures/a.dds" is a DDS format the game can't load (DXT3). Save it as BC7, DXT1, DXT5 or uncompressed 32-bit RGBA.
    "textures/a.dds" is cut short.
    "art.png" is not a PNG we can read.

What it means: A .dds must be BC7, DXT1 (BC1), DXT5 (BC3) or uncompressed 32-bit RGBA, and a .png must be a normal PNG. Other formats and damaged files are refused, because the game would skip them.

How to fix it: Export again as BC7, DXT5 or uncompressed RGBA 8888, with no mipmaps.

### log-texture-not-read

**A texture file was left out**

Seen in: the Mod log in Settings, Mods; Mods tab, on the mod's row after a restart.

From the game (Mods tab row):

    texture textures/grass.jpg not read: only .dds and .png files in the textures folder are textures
    texture textures/grass.dds not read: the name is not a texture name (tex1_WxH_hash[_palette]_fmt.dds or .png)
    texture textures/tex1_32x32_626709d910129694_193ca5974976e36e_8.dds could not be read: not a DDS this browser can draw (BC7, BC1, BC3 or RGBA)

What it means: The game reads only .dds and .png files in the textures folder that carry a texture name, like tex1_64x64_hash_14. It skips anything else there.

How to fix it: Name the file after the texture it replaces. The model viewer copies the name for you. Save it as .dds (BC7, BC1, BC3 or uncompressed RGBA) or .png, then reload.

## Developer mode and the Mod log

### dev-start-game

**Developer mode needs the game page**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

In the game page (install, check tool):

    no developer-mode mod is running in this session

On the site:

    Start the game first: developer mode loads a mod into the running game page.

What it means: Developer mode loads a mod into the running game, and the game has not started yet.

How to fix it: Press Play and wait for the title screen or your town. Then choose the folder or press Connect again.

### dev-check-fails

**The folder fails playac-mod check**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    Not loaded: the folder fails playac-mod check: mod.json: "id" is missing
    Not reloaded: the folder fails playac-mod check: shops.json: a price must be a whole number of Bells, 1 to 99999

What it means: `playac-mod dev` checks the folder on every save and sends nothing while the check fails. The game keeps the last good copy.

How to fix it: Fix what the message names. The terminal running `playac-mod dev` shows it too. The reload happens by itself once the check passes.

### dev-restart-needed

**Restart the game to load this change**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1); the Mod log in Settings, Mods.

In the game page (install, check tool):

    mod.json changed: restart the game to load it

On the site:

    mod.json changed: restart the game to load it.
    The script cannot reload: it was not in mod.json at boot. Restart the game.
    Textures cannot reload: the mod had no textures folder at boot. Restart the game.

What it means: Lines, the shop, talk, letters, the calendar, the items file, the script and textures reload while you play. A change to mod.json waits for a restart, because the game reads mod.json once, when it starts.

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

What it means: The browser could not read the folder, or the folder holds more than a mod may. The browser loses a folder when its permission ends, or when the folder is moved or renamed.

How to fix it: Choose the folder again. Pick the folder that holds mod.json, not a parent of it. Hidden files and node_modules are skipped, and everything else in it counts.

### dev-server-address

**That is not a playac-mod dev address**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    Use the address playac-mod dev prints: http://localhost and a port.

What it means: The game only talks to `playac-mod dev` on your own computer, over http on localhost or 127.0.0.1.

How to fix it: Paste the address `playac-mod dev` prints, for example http://127.0.0.1:2604.

### dev-server-origin

**playac-mod dev refused this site**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: the dev server refused this site: start it with --origin https://my-copy.example

What it means: `playac-mod dev` answers only playaconline.com, the dev site dev.animalcrossingonline.com and localhost:5173, so another website cannot read your folder. This copy of the game is on another address. The terminal also prints the --origin to add.

How to fix it: Start it with --origin and the address of the game page, for example `playac-mod dev --origin https://my-copy.example`.

### dev-server-protocol

**playac-mod dev and the game are different versions**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: the dev server speaks protocol 2; this game reads 1. Update one of them

What it means: The tool and the game changed how they talk, and these two are different versions.

How to fix it: Update the tool by running its install line again (https://playaconline.com/modding/testing/#cli). Or reload the game to get the newest one.

### dev-server-hash

**A file did not match its hash**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    Not reloaded: "main.lua" from the dev server does not match its hash in the index twice in a row, so nothing was loaded: restart playac-mod dev, or choose the folder instead
    The dev server could not be reached at http://127.0.0.1:2604: the dev server's index gives no sha256 for "mod.json", so its bytes cannot be checked (is it playac-mod dev?)

What it means: The game checks every file from `playac-mod dev` against the hash the tool lists for it. The file did not match twice in a row, so nothing was loaded.

How to fix it: Stop and start `playac-mod dev`, then Connect again. If it keeps happening, choose the folder instead.

### dev-server-unreachable

**playac-mod dev could not be reached**

Seen in: Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    The dev server could not be reached at http://127.0.0.1:2604: Failed to fetch
    The dev server could not be reached at http://127.0.0.1:2604: the dev server answered 404 for /__playac/index (is it playac-mod dev?)

What it means: Nothing answered at that address, or what answered is not `playac-mod dev`. Safari stops a secure page from reaching http on your computer.

How to fix it: Run `playac-mod dev` in your mod folder and use the address it prints. Use Chrome, Edge or Firefox, or choose the folder instead.

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

What it means: Installed mods live in the browser's site storage, and the browser deleted it. This happens when the device is low on space, or in Safari after 7 days without a visit.

How to fix it: Install the mods again from Browse mods or from your ZIPs. Keep your own mod ZIPs somewhere safe.

### mods-unreadable

**Your mods could not be read**

Seen in: the Mods tab.

On the site:

    Your mods could not be read: The operation is insecure.

What it means: The browser would not open its site storage, where mods are kept. Private windows and blocked site data do this.

How to fix it: Use a normal window, not a private one. Allow site data for playaconline.com, then reload.

### mods-db

**The mods database could not be used**

Seen in: the Mods tab; Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

In the game page (install, check tool):

    the mods database is held open by another tab
    the developer mods database is held open by another tab
    the mods database refused the change

What it means: The browser's mod storage refused the change. Another tab of the game is updating it, or the browser stopped the write because storage is full or site data is blocked.

How to fix it: Close the game's other tabs, reload and try again. If it keeps happening, free some space on the device or allow site data for playaconline.com.

### mod-not-installed

**That mod is not installed**

Seen in: the Mods tab.

In the game page (install, check tool):

    that mod is not installed

What it means: That mod is no longer installed. Another tab removed it.

How to fix it: Reload the Mods tab to see your mods as they are now.

### mods-export-too-big

**Too many mods for one export**

Seen in: the Mods tab.

In the game page (install, check tool):

    Your mods are 600 MB together, more than the 512 MB one export can hold. Remove the mods you do not use, then export again

What it means: "Export my mods" makes one ZIP in the browser's memory, and your installed mods together are more than it can hold.

How to fix it: Remove the mods you do not use and export again. Each mod is also its own ZIP, which you can get from the mod list or from its author.

### storage-full

**Not enough room in the browser**

Seen in: Mods tab, when you install a ZIP.

In the game page (install, check tool):

    There is not enough room in this browser's storage for this mod: it needs about 40 MB and about 12 MB is free. Remove a mod you do not use or free some space on this device, then try again

What it means: Mods are kept in the browser's site storage, and it is full or blocked. A private window and switched-off site data both block it.

How to fix it: Remove a mod you do not use, free space on the device, or allow site data for playaconline.com. Private windows have very little room.

### mods-too-many

**More than 32 mods on**

Seen in: Mods tab, when you install a ZIP; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    only the first 32 mods load
    You already have 32 mods on, the most the game loads. Turn one off first

From the game (Mods tab row):

    only the first 32 mods load; not loaded

What it means: The game loads at most 32 switched-on mods. The message shows on each mod that was left out, never on one that loaded.

How to fix it: Switch off a mod you can do without, then restart.

### mods-size-cap

**Over the room the game keeps for mods**

Seen in: Mods tab, when you install a ZIP; Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    This mod unpacks to 30 MB, more than the 24 MB the game keeps for mods on a phone, so it cannot be switched on here
    the mods before it already fill the 96 MB the game keeps for mods

What it means: All switched-on mods together can unpack to at most 96 MB, or 24 MB on a phone or low-memory device. A new mod that does not fit is installed switched off.

How to fix it: Switch off a big mod. If you made the mod, save its textures as compressed DDS and include only the ones you changed, so phone players can use it.

## When the game starts

### mods-watchdog

**The game stopped responding with mods on**

Seen in: the Mods tab.

On the site:

    The game stopped responding the last time it started with this mod on: Tea Stall. It started without mods this time. Your mods are still installed.

What it means: The game stopped responding with these mods on, so this start ran once without them. One start that froze is enough. A freeze or crash later, during play, counts the second time in a row. The model viewer loads mods too, and the same rules watch it, so a viewer that froze as it started counts as well. Nothing was switched off or removed.

How to fix it: If you installed it, switch the named mod off, or one of them at a time, then restart. If you made it, test the mod alone. The usual causes are a script that does heavy work at start and textures too big for the device. A phone has 24 MB for all mods.

### boot-failed

**The mod could not be unpacked at start**

Seen in: Mods tab, on the mod's row after a restart.

In the game page (install, check tool):

    could not be unpacked (ENOSPC)
    the stored mod does not match its id
    the mod list could not be written

What it means: The game could not unpack this mod from browser storage when it started. The browser is usually out of memory or storage, or the stored copy is damaged.

How to fix it: Restart the game. If the message stays, remove the mod and install it again.

## Script stopped

### script-budget

**Script took too long**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    script took too long (over 200000 instructions)
    script took too long (over 125 ms)
    script took too long (over 250 ms)

What it means: One event gets 200,000 Lua instructions per mod, and the main chunk gets the same when the game starts. Library work and memory use count towards it. That count is the same on every device, and a script that goes over it is stopped for the rest of the session, so it cannot freeze the game. "over ... ms" is the wall-clock backstop instead: 125 ms for an event run, 250 ms for the main chunk, stretched up to 8 times on a slow or busy device. Only time the count cannot see reaches it, such as one call that does a lot of work at once.

How to fix it: Do less per event. Avoid long loops and patterns like ".-.-.-" on long text, and cache results in local variables or the store. String patterns, table.sort, table.concat and memory use count towards the budget, and pcall does not get around it.

Bad (main.lua):

```
on("day_started", function(e)
  local n = 0
  for i = 1, 1e9 do n = n + i end
end)
```

Fixed (main.lua):

```
on("day_started", function(e)
  store.set("days", (store.get("days") or 0) + 1)
end)
```

### script-slow

**Script kept the game waiting**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    script kept the game waiting (3 runs in a row over 8 ms)

What it means: An event run over 8 ms is a strike, and 3 strikes in a row stop the script for the session, even when each run stayed inside its instruction budget. A run under the limit clears the strikes. On a slow or busy device the limit is stretched by how slow the game itself runs there, so the number in the message can be larger than 8.

How to fix it: Do less per event. Spread work over several events, cache results in local variables or the store, and avoid long loops and patterns on long text.

### script-memory

**Script ran out of memory**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    out of memory (4 MB per mod, 16 MB for all mods together)

What it means: A mod's script can use 4 MB, and all mods together 16 MB.

How to fix it: Keep fewer and smaller tables. Do not build big strings in a loop. Collect the parts and call table.concat once.

### script-on-event

**on() with an event not in "scripts.events"**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:1: on(): 'villager_talked' is not in this mod's "scripts.events" list in mod.json
    @yourname.my-mod/main.lua:1: on(): unknown event 'tick'

What it means: A script can only listen to an event that mod.json lists in "scripts.events", and the event must exist. The Events reference lists every event.

How to fix it: Add the event to "scripts.events" in mod.json, or fix its spelling in on().

Bad (mod.json):

```
"scripts": { "main": "main.lua", "events": ["day_started"] }
-- main.lua: on("villager_talked", ...)
```

Fixed (mod.json):

```
"scripts": { "main": "main.lua", "events": ["day_started", "villager_talked"] }
```

### script-on-late

**on() called from inside a handler**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:4: on(): handlers can only be added while the script loads, not from inside a handler

What it means: Handlers are added once, while main.lua first runs. A handler cannot add more handlers, and neither can a function that another mod calls with remote.call.

How to fix it: Call on() at the top level of main.lua. To change behaviour later, keep a flag in a variable.

### script-on-too-many

**More than 16 handlers for one event**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:20: on(): at most 16 handlers for 'villager_talked'

What it means: A mod can add at most 16 handlers per event.

How to fix it: Use one handler that does several things.

### script-store-no-town

**store.set before a town is loaded**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:3: store.set: no town is loaded yet (the script's main part runs before the save loads): save from an event, or use store.client

What it means: "store" is kept per town, and the main part of a script runs before the town loads. So store.set is refused there and store.get returns nil.

How to fix it: Save from an event such as day_started or villager_talked. For data that belongs to the browser and not the town, use store.client.

Bad (main.lua):

```
store.set("loaded", true)
```

Fixed (main.lua):

```
on("day_started", function(e) store.set("days", (store.get("days") or 0) + 1) end)
```

### script-store-no-player

**store.player.set with no player in the game**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:8: store.player.set: no player is in the game yet (game.player() is nil): save once a player is in the town, or use store for the town's own data

What it means: "store.player" is kept per resident. It needs a resident in the game: game.player() names them. Every event of a town has one, day_started at boot included. When game.player() is nil, store.player.set has no one to save for and store.player.get returns nil.

How to fix it: Check game.player() first. For data that belongs to the whole town, use store.

### remote-not-exported

**remote.add of a name "exports" does not list**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-lib/main.lua:3: remote.add: count is not in mod.json "exports" (a library offers what it lists)

What it means: Your mod.json has "exports", so remote.add offers only the names it lists.

How to fix it: Add the name to "exports" with a one-line description, or offer one that is listed.

### script-remote

**remote.add or remote.call refused**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:4: remote.call: tea.lib offers no function brew
    @yourname.my-mod/main.lua:4: remote.call: tea.lib is already running (a call back into it would be a cycle), refused
    @yourname.my-mod/main.lua:1: remote.add: functions can only be offered while the script loads
    @yourname.my-mod/main.lua:6: remote.call: tea.lib has not updated this town's data yet (its data_migrated runs after this one), refused

What it means: A remote.add or remote.call was refused. The text after the function name says why.

How to fix it: For remote.add, offer the function while the script loads, under a name of a-z, 0-9 and _ up to 32 characters. For remote.call, check with remote.has that the mod is on and offers the name. Pass only nil, booleans, numbers, strings and tables of them, up to 64 KB and 16 levels deep. Do not call back into a mod that is already running. In data_migrated, change only your own data and call other mods from a later event.

### script-store

**store.set refused a value**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:3: store.set: only strings, numbers and booleans can be saved
    @yourname.my-mod/main.lua:3: store.set: the store would be over 8192 bytes, nothing was saved
    @yourname.my-mod/main.lua:3: store.set: key longer than 64 bytes
    @yourname.my-mod/main.lua:3: store.set: a key cannot start with a control character
    @yourname.my-mod/main.lua:3: store.player.set: only strings, numbers and booleans can be saved

What it means: store.set refused the value, so nothing was saved. The error stops the script unless you wrap the call in pcall.

How to fix it: Save only strings, numbers and booleans. Keep a key to 64 bytes and a value to 1024 bytes, with no zero bytes, no NaN and no control character at the start of a key. A mod has 8 KB per town, shared by store and store.player, and 8 KB per browser in store.client. To save a table, turn it into a string such as "3,7,12".

### script-sandbox

**Something scripts may not do**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:2: setmetatable: __gc is not allowed in mod scripts (finalizers cannot be stopped)
    @yourname.my-mod/main.lua:5: tables with a __len metamethod are not supported here in mod scripts
    @yourname.my-mod/main.lua:4: math.random is not available: use rng() (seeded, so a reload cannot reroll)
    @yourname.my-mod/main.lua:1: math.randomseed is not available: use rng() (seeded, so a reload cannot reroll)

What it means: The script used a Lua feature that mod scripts do not have. __gc finalizers, and __len metamethods on a table passed to table.insert, remove, sort or concat, are switched off, and math.random and math.randomseed raise an error.

How to fix it: Remove the metamethod and use plain tables. Write rng() for math.random(), rng(n) for math.random(n) and rng(m, n) for math.random(m, n). rng() is seeded by the mod, the town and the game day, so a reload cannot reroll a result. io, os, load, require, dofile and debug do not exist.

Bad (main.lua):

```
local n = math.random(6)
```

Fixed (main.lua):

```
local n = rng(6)
```

### script-state-failed

**The script could not keep running**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    the script's Lua state failed and was dropped
    the script raised an error that is not a string

What it means: The script failed in a way the game cannot recover from, or it raised an error with error({...}) instead of a string.

How to fix it: Raise errors with error("text"). If the message says the state failed, report it with the mod, because that is a bug in the game.

### script-syntax

**A Lua syntax error**

Seen in: Mods tab, "Script stopped" on the mod's row; the check tool (playac-mod check).

In the game page (install, check tool):

    main.lua:4: unfinished string near '"hello'
    main.lua:7: ')' expected near 'log'
    main.lua:2: <name> expected near '='
    main.lua:9: break outside a loop at line 9
    main.lua:3: no visible label 'done' for goto at line 3
    main.lua:6: attempt to assign to const variable 'limit'

From the game (Mods tab row):

    @yourname.my-mod/main.lua:5: 'end' expected (to close 'function' at line 2) near <eof>
    @yourname.my-mod/main.lua:3: unexpected symbol near '='

What it means: The script is not valid Lua 5.4, so it never starts and none of its handlers run. The Mods tab shows the file, the line and what Lua expected there, and the rest of the mod still works.

How to fix it: Open the file at the line shown, which is often just after the real mistake. The usual causes are a missing `end`, `then` or `do`, a string with no closing quote, `!=` where Lua writes `~=`, and `+` where Lua joins strings with `..`. `playac-mod check` finds the same error before you install.

Bad (main.lua):

```
on("villager_talked", function(e)
  if e.villager.name == "Bob" return "Hi" end
end)
```

Fixed (main.lua):

```
on("villager_talked", function(e)
  if e.villager.name == "Bob" then return "Hi" end
end)
```

### script-error

**The script raised an error**

Seen in: Mods tab, "Script stopped" on the mod's row.

From the game (Mods tab row):

    @yourname.my-mod/main.lua:7: attempt to index a nil value (global 'io')
    @yourname.my-mod/main.lua:3: attempt to call a nil value (global 'give_item')

What it means: Your script raised a Lua error, and the text gives the file and line. The script is stopped for the rest of the session, and the rest of the mod keeps working.

How to fix it: Open the file at the line shown and fix it, then reinstall and restart. The usual causes are a typo in a name, a call to something the API does not have, and indexing nil. Use log() to print values, and pcall around code that may fail.

### dependency-absent

**A mod this one can use is not there**

Seen in: what remote.version returns, and remote.call for an optional dependency.

From the game (Mods tab row):

    yourname.weather is not loaded
    yourname.weather is loaded, but it has no running script

What it means: The mod is named in "depends" or "optional_depends", and it is not installed, is switched off, did not load, or has no running script. This is not an error. remote.version returns nil, this message and this code, and remote.call to an optional dependency returns the same three without calling anything.

How to fix it: Nothing to fix. Do what the mod does on its own when the code comes back.

### dependency-version

**A mod this one can use is another version**

Seen in: what remote.version returns, and remote.call for an optional dependency.

From the game (Mods tab row):

    yourname.weather is loaded, but its version is outside the range this mod names

What it means: The mod loaded, but its version is not inside the range "optional_depends" gives for it, so it counts as absent. A needed dependency outside its range stops the mod from loading instead.

How to fix it: Widen the range in mod.json if your mod works with that version. Otherwise do what the mod does on its own.

### dependency-undeclared

**remote.version asked about a mod mod.json does not name**

Seen in: what remote.version returns, and remote.call for an optional dependency.

From the game (Mods tab row):

    yourname.weather is not in this mod's "depends" or "optional_depends"

What it means: remote.version answers only for the mods this mod names in "depends" or "optional_depends".

How to fix it: Add the mod to "optional_depends" in mod.json, with the range of versions your script works with.

Fixed (mod.json):

```
"optional_depends": { "yourname.weather": ">=1.0.0" }
```

## Mod commands

### command-permission

**A command not in "permissions"**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    give_item is not in this mod's "permissions" in mod.json

What it means: A script may only use the commands that "permissions" in mod.json lists. Players see that list on the Mods tab.

How to fix it: Add the command to "permissions", or stop calling it. Trying again does not help, because the list is read when the game starts.

Bad (mod.json):

```
"scripts": { "main": "main.lua", "events": ["day_started"] }
```

Fixed (mod.json):

```
"scripts": { "main": "main.lua", "events": ["day_started"] },
"permissions": ["send_letter"]
```

### command-event-cap

**Too many commands in one event**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    send_letter: at most 4 commands in one event

What it means: A mod may queue at most 4 commands while one event runs.

How to fix it: Queue fewer commands per event. The count starts again at the next event, so the rest can go then.

### command-queue-full

**The command queue is full**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    show_line: this mod already has 8 commands waiting
    ask: the game's command queue is full (32), try later

What it means: Commands wait in a queue until the game applies them at the end of a frame. At most 8 of one mod's commands wait at once, and 32 for all mods together.

How to fix it: Try again from a later event. The queue empties as the game applies it.

### command-day-cap

**The day's cap for this command is used up**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    send_letter: at most 3 a day for each mod
    take_bells: at most 6 a day for each mod

What it means: Each game day in each town, a mod may send 3 letters, give 5 items, show 20 lines and ask 10 questions. It may also ask for items 6 times and for Bells 6 times. A take counts when its question is shown, whatever the player answers. The caps are per town, not per player, and a reload does not reset them.

How to fix it: Try again on the next game day. Remember in the store what you already sent today, so the script does not ask again.

### command-item

**An item a command cannot hand out**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    give_item: item 0x2100 is money
    send_letter: item 0xF000 is not an item or furniture the game has
    give_item: a mod can only give its own new items, by "<this mod's id>:<item id>"
    give_item: no item by that id in this mod's items file
    take_item: item 0x2503 is a villager's errand item
    take_item: a mod can only take its own new items, by "<this mod's id>:<item id>"
    the item is not this town's to give (its mod is off, or this is not your town)
    the letter is gone (its mod's letters file did not load)

What it means: Items follow the shop's rules, so a command cannot hand out money, turnips, tickets, grab bags, fossils or reserved numbers. take_item follows the same rules, and never takes the goods of a villager's errand. An item is "0x" and four hex digits, or one of this mod's own new items by its full id. A letter id must be one in this mod's own letters file. The last two messages come in command_finished, when the game applies the command. They mean the mod's item or letter was there at the call and gone when the game applied the command, because its mod was switched off, its file did not load or the town is not yours.

How to fix it: Pick another item. Write it as "0x2800" or "yourname.my-mod:thing". An item that is not a number or one of those forms is command-args instead.

### command-args

**A command's arguments are wrong**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    send_letter: text must be 1 to 192 characters
    send_letter: the text does not fit a letter (6 lines)
    ask: choices must be a list of 2 to 4 answers
    show_line: text must be 1 to 400 bytes
    take_item: count must be a whole number 1 to 15
    take_bells: amount must be a whole number 1 to 99999
    take_bells: takes a table: { amount = ... }
    give_item: item must be an item number, "0x" and four hex digits, or this mod's "author.mod:thing"
    send_letter: item must be an item number or "0x" and four hex digits
    set_shop_goods: goods must list 1 to the goods the shop takes
    set_shop_open: open must be true, false or nil

What it means: The command was called with a value it cannot use.

How to fix it: Check the call against the reference (/modding/reference/) and shorten the text. A letter is 1 to 192 characters in 6 lines, with "from" up to 8 characters and paper 0 to 63. A line is up to 400 bytes. A question is up to 120 characters, with 2 to 4 answers of up to 16 characters.

### command-city

**Commands are off in The City**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    commands are switched off in The City
    send_letter: commands are switched off in The City
    set_shop_open: shops are off in The City

What it means: In The City every command is refused, because other players there do not have your mod. A refused command does not count against the daily caps.

How to fix it: Nothing to fix. Handle the nil return or the failed command_finished, and try again at home, for example from scene_entered.

### command-client-setting

**A client setting cannot decide what the town gets**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    give_item: this event read the client setting "gift", and a client setting cannot decide what the town gets (make it a world setting)

What it means: A setting whose "scope" is "client" is the player's own. It may decide only what that player sees or hears. In an event that read one with settings.get, cmd.send_letter, cmd.give_item, cmd.take_item and cmd.take_bells are refused, because they change what the town or the player has.

How to fix it: If the setting decides what a letter says, what is given or taken, or when, take "scope": "client" off it: it is then a world setting, and a friend who visits runs the host's value. If it only decides what the player sees, read it in the event that shows the line, not in the one that sends, gives or takes. Trying again does not help.

Bad (mod.json):

```
"settings": [{ "name": "gift", "type": "choice", "label": "Gift", "choices": ["apple", "pear"], "default": "apple", "scope": "client" }]
```

Fixed (mod.json):

```
"settings": [{ "name": "gift", "type": "choice", "label": "Gift", "choices": ["apple", "pear"], "default": "apple" }]
```

### command-shop

**A shop command the shop cannot take**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    set_shop_goods: there is no such shop
    set_shop_open: Crazy Redd's tent has no open
    set_shop_goods: Able Sisters has no goods
    set_shop_goods: a later mod changes Nook's store: bean.night-shop
    set_shop_open: a shop changes what visitors see, so the mod needs "scope": "world"

What it means: cmd.set_shop_goods and cmd.set_shop_open change one shop, by its id in the shop table, for the rest of the game day. They are refused when the id is not in the table, when the shop has no goods (set_shop_goods) or no open (set_shop_open) in the table, when a mod later in the load order changes that shop (it has the shop whole), and in a mod without "scope": "world". The refusal comes at the call: the command returns nil, this message and this code.

How to fix it: Use a shop id from the shop table (/modding/guides/shops/#table) that has the field. If a later mod has the shop, the player decides the order in the Mods tab. Trying again does not help.

Fixed (main.lua):

```
cmd.set_shop_open("flower", true)
```

### command-visiting

**Only the town's owner changes a town**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    only the town owner's game can change the town (you are visiting)
    give_item: only the town owner's game can change the town (you are visiting)

What it means: On a visit, send_letter, give_item, take_item and take_bells are refused, because only the town owner's game changes a town or a save. They do not count against the daily caps, and show_line and ask still work.

How to fix it: Nothing to fix. Handle the nil return or the failed command_finished, and send it once the player is home.

### command-lent-home

**A lent mod acts only in its town**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    a friend's mod lent for a visit acts only in their town

What it means: This mod was lent to a visitor for one visit. At the visitor's home its commands are refused and its shop, Nook goods, board notices, items and renames do nothing, so it never changes the visitor's own town or save. The game refuses the command when it applies it, not at the call. So cmd.<name> returns an id, and this code arrives in command_finished.

How to fix it: Nothing to fix. Your mod runs normally for players who installed it.

### command-no-room

**No room for a letter or an item**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    the mailbox and the post office are both full
    the pockets, the mailbox and the post office are all full
    the pockets are full (a new item cannot come by mail)

What it means: There was no room for the letter or the item. One of the game's items can go to the pockets or come by mail, and one of the mod's own new items can only go to the pockets.

How to fix it: Try again later, from a later event and not in a loop. A command refused for no room still counts against the day's cap, because it reached the game. Three letters refused for a full mailbox use up the day's letters, and the next one is command-day-cap.

### command-not-shown

**A line or a question could not be drawn**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    the text cannot be drawn in the window (too many pages?)

What it means: The game could not draw the line or the question in the window, because the text has too many pages. It arrives in command_finished. The command still counts against the day's cap, because it reached the game.

How to fix it: Shorten the text. Trying the same command again does not help.

### command-not-held

**The player does not hold what a take asks for**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    take_item: the pockets do not hold 3 of that item in plain slots
    take_bells: the wallet holds fewer than 500 Bells
    the wallet no longer holds that many Bells

What it means: take_item counts only plain pocket slots. A wrapped present, an item held for a villager's errand and a mod item standing on the same piece do not count. take_bells reads the wallet only, never the bank or a money bag. When the player holds less than the take asks for, nothing is asked and nothing is taken. It does not count against the daily cap.

How to fix it: Check game.pockets() or game.bells() first, and tell the player what to bring with cmd.show_line. Try again from a later event.

Bad (main.lua):

```
cmd.take_bells{ amount = 500 }
```

Fixed (main.lua):

```
if (game.bells() or 0) >= 500 then cmd.take_bells{ amount = 500 } end
```

### command-declined

**The player said no to a take**

Seen in: what cmd.<name> returns when a command is refused, the command_finished event and the Mod log.

From the game (Mods tab row):

    the player said no, nothing was taken

What it means: Before take_item or take_bells takes anything, the game asks the player in its own words, with the true item, count or amount. The player answered no, or closed the window with no pick. Nothing was taken. The question still counts against the daily cap, so a mod cannot ask again and again.

How to fix it: Nothing to fix. Carry on without the item or the Bells, and do not ask again in the same event.

## Timers

### timer-no-town

**timer.after before a town is loaded**

Seen in: what timer.after returns when it is refused, and the Mod log.

From the game (Mods tab row):

    load: timer.after refused: no town is loaded yet (the script's main part runs before the save loads): set it from an event

What it means: A timer is kept in the mod's town store, and the main part of a script runs before the town loads. So there is nowhere to keep a timer yet.

How to fix it: Set the timer from an event, such as scene_entered or day_started.

Bad (main.lua):

```
timer.after(30, "tea")
```

Fixed (main.lua):

```
on("day_started", function(e) timer.after(30, "tea") end)
```

### timer-no-clock

**timer.after while the game clock is not set**

Seen in: what timer.after returns when it is refused, and the Mod log.

From the game (Mods tab row):

    day_started: timer.after refused: the game clock is not set (it reads a date before the year 2000): try again later

What it means: A timer is counted in game minutes from the start of the year 2000. The game clock read a date before that, which happens only when the clock was never set. A timer set then could never come due, so it is refused and nothing is stored.

How to fix it: Nothing in the mod is wrong. Set the timer again from a later event, once the game has its date.

### timer-limit

**Too many timers waiting**

Seen in: what timer.after returns when it is refused, and the Mod log.

From the game (Mods tab row):

    day_started: timer.after refused: this mod already has 16 timers waiting in this town

What it means: A mod may have 16 timers waiting in one town.

How to fix it: Cancel one with timer.cancel, or wait for one to fire. One timer that sets the next one when it fires needs only one slot.

### timer-store-full

**The timer does not fit in the town store**

Seen in: what timer.after returns when it is refused, and the Mod log.

From the game (Mods tab row):

    day_started: timer.after refused: the timer does not fit in this mod's town store, or the store could not be written

What it means: A waiting timer is kept in the mod's town store, with its name and data, and counts toward the store's 8 KB. This one would take the store over that, or the store could not be written. Nothing changed.

How to fix it: Free some room with store.set(key, nil), or give the timer shorter data.

### timer-args

**timer.after was called with a value it cannot use**

Seen in: what timer.after returns when it is refused, and the Mod log.

From the game (Mods tab row):

    day_started: timer.after refused: minutes must be a whole number 1 to 10080 (game minutes)
    day_started: timer.after refused: name must be 1 to 40 bytes of letters, digits, _, - and .
    day_started: timer.after refused: this script has no timer_fired handler (list timer_fired in scripts.events and add on("timer_fired", ...))

What it means: minutes is a whole number of game minutes, 1 to 10080. name is 1 to 40 bytes of letters, digits, _, - and . only. data is text of up to 240 bytes, a number, true, false or nil. The script must also handle timer_fired, or the timer would fire to nobody.

How to fix it: Fix the call. List "timer_fired" in scripts.events and add on("timer_fired", ...) in the main part of the script.

Bad (main.lua):

```
timer.after(0.5, "tea time")
```

Fixed (main.lua):

```
timer.after(30, "tea-time")
```

## Sharing a mod

### dev-upload-off

**Sharing is off in developer mode**

Seen in: Share a mod, when you upload.

On the site:

    Sharing is off while a mod is loaded in developer mode. Pack the folder into a ZIP (playac-mod pack) and upload that, so what is reviewed is exactly what players get.

What it means: What you share must be the exact ZIP players will get, not a folder still changing.

How to fix it: Run `playac-mod pack`, unload the developer copy, restart, and upload the ZIP.

### upload-name-word

**The name has a word the site does not allow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The mod's name has a word the site does not allow. Pick another name.

What it means: The mod list is public, so a mod's name goes through the site's word filter.

How to fix it: Change "name" in mod.json, raise the version and upload again.

### upload-author-word

**An author name has a word the site does not allow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    An author name has a word the site does not allow. Use another name.

What it means: Author names show on the mod list, so they go through the site's word filter.

How to fix it: Change the name in "authors" in mod.json, raise the version and upload again.

### upload-not-text

**A text file is not text**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    "notes.txt" is not text. A .txt, .md or .lua file must be plain UTF-8 text.

What it means: A reviewer reads every .txt, .md and .lua file of a shared mod, and the site's word filter reads them too. So each one must be plain text: UTF-8, with no zero byte. A picture, an archive or any other data under a text name is refused. A file saved as UTF-16 is refused as well.

How to fix it: Save the file as UTF-8 in your editor. Take out a file that is not text, or give a picture its real .png or .dds name.

### upload-text-too-much

**The mod carries too much text**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The text files of the mod add up to more than 4 MB. A mod may carry at most that much text.

What it means: The .json, .lua, .txt and .md files of a shared mod can be at most 4 MB together. The site's word filter reads all of it at upload and a reviewer may have to read it. An upload whose text takes the filter too long to read is refused with the same words.

How to fix it: Take out text the mod does not need, such as generated lists or logs. Split the mod in two when all of it is needed.

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

What it means: The first time you share, you give your age and accept the mod rules.

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

What it means: This account cannot share mods. Its mods were removed for copyright several times, or a moderator switched uploads off for it.

How to fix it: Read the mod rules page for how to appeal.

### upload-version-exists

**This version is already uploaded**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    This version of the mod is already uploaded: a version is never replaced, and its number is not used again, even after it is removed (only a rejected version's number is free again). Raise the version in mod.json.

Registry codes: `version_exists`

What it means: Every upload is a new version, and a version is never replaced, so everyone who has it has the same files. A version number is used once, even after the version is removed, unless a moderator refused it.

How to fix it: Raise "version" in mod.json (1.0.0 to 1.0.1) and upload again.

### upload-screenshot

**A screenshot is needed, or one could not be read**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Add at least one screenshot of the mod in the game (PNG or JPEG). It is shown on the mod's page.
    Screenshot 1 must be a PNG or a JPEG.
    Screenshot 1 must be 200 to 4096 pixels a side.
    Screenshot 1 is larger than a 4K screen (3840 by 2160 pixels). Make it smaller.
    Screenshot 1 is a 16 bit PNG. Save it as an ordinary (8 bit) PNG or a JPEG.
    Screenshot 1 is a progressive JPEG larger than 1920 by 1080 pixels. Save it as a standard (baseline) JPEG or a PNG, or make it smaller.
    Screenshot 1 could not be read: is it a whole PNG or JPEG?
    Each screenshot must be at most 2 MB.
    Send at most 4 screenshots.

Registry codes: `screenshot_required`

What it means: Every shared version needs 1 to 4 screenshots of the mod in the game, and one was missing or could not be used. The site saves them again, so no hidden photo data survives.

How to fix it: Add a screenshot in Share a mod, or in .playac/screenshots/, which a GitHub import reads. Use a PNG or JPEG of 200 to 4096 pixels a side, at most 3840 by 2160 pixels in all and 2 MB. Save it as an ordinary 8-bit PNG or a standard JPEG, not a 16-bit PNG or a progressive JPEG over 1920 by 1080.

### upload-changelog

**The changelog line could not be used**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The changelog line must be at most 300 characters of text, with at most 4 line breaks.
    The changelog line has a word the site does not allow. Say it another way.
    Send one changelog line.

What it means: A shared version may carry one optional line on what it changes. The line that came with this one could not be used.

How to fix it: Shorten the line in Share a mod, or in this version's section of CHANGELOG.md, or leave it out. Keep it to 300 characters and 4 line breaks. It goes through the site's word filter.

### upload-form

**The upload form could not be read**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The upload form has no zip.
    The upload form could not be read.
    The upload form has a part this site does not read.
    The upload form has no boundary.
    Send one zip at a time.

What it means: An upload is a form with the ZIP, the screenshots and an optional changelog line. This one was not sent the way the site sends it.

How to fix it: Share from Settings, Mods. A script of your own must send multipart/form-data with the parts zip, screenshot and changelog.

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

What it means: There is a limit on uploads per hour and on uploads waiting for review.

How to fix it: Wait for a review, or try again in an hour. Test on your own computer first, so each upload counts.

### upload-storage-full

**Your shared mods use all your space**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Your mods would take more than 64 MB. Ask for an old version to be taken down, or make this one smaller.

Registry codes: `storage_full`

What it means: Each account has a total size for all its shared versions, and this upload would go over it.

How to fix it: Ask for an old version to be removed, or make the mod smaller.

### upload-busy

**Upload busy or too slow**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Another upload from your account or your network is still going, or the server is busy. Try again in a minute.
    Your connection was too slow to upload the zip. Try again on a better connection.

Registry codes: `uploads_busy`, `upload_slow`

What it means: Only one upload runs at a time per account and network, and the file has to keep arriving.

How to fix it: Wait a minute and try again, on a steadier connection if it was too slow.

### upload-image-check

**The images could not be checked**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    We couldn't check the images in your mod just now. Nothing was uploaded. Try again in a few minutes.

Registry codes: `image_check_unavailable`

What it means: Every image is checked before an upload is accepted, and the check did not answer. Nothing was uploaded.

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

What it means: Sharing mods is not open, so uploads and GitHub imports are refused. Installing a mod from a ZIP still works.

How to fix it: Keep making and testing the mod on your own computer, and share it once sharing opens.

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
    Too many wrong codes in a row, so code checks are paused for a while. Wait, then try again with a fresh code. If the account logs in with an email address, we emailed it.
    That code is not right, or it was used already. Wait for the next one and try again.

Registry codes: `two_factor_required`, `two_factor_code`, `two_factor_unavailable`, `two_factor_locked`, `bad_code`

What it means: Sharing a mod and importing one from GitHub both need two-factor sign-in and a recent code from your authenticator app. A code works once. After 5 wrong codes in a row, code checks pause for a minute or longer, and we email the account if it logs in with an email address.

How to fix it: Switch on two-factor sign-in on your Profile page, then enter a code from your authenticator app when asked. If codes are paused, wait, check that the phone's clock is right and use a fresh code.

### upload-prefix-taken

**The name before the dot is another player's**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    The part of the id before the dot belongs to another player's account. Use your own name before the dot.

Registry codes: `prefix_taken`

What it means: The part of a mod id before the dot belongs to the account that first uploaded under it, even while that upload waits for review. In kim.tea-stall that part is kim. It is free again only if every upload under it was refused.

How to fix it: Change "id" in mod.json to start with your own name.

### upload-content-taken-down

**These files were removed from the mod list**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    These files were removed from the mod list, so they can't be shared again.

On the site:

    These files were removed from the mod list, so they can't be shared again.

Registry codes: `content_taken_down`

What it means: These are the same files as a version the moderators removed. They cannot be shared again under any id or version.

How to fix it: Read the review decision on the removed version and change what it named. If you think the removal was wrong, see the mod rules page.

### upload-too-many-attempts

**Too many upload attempts**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    You can try 12 uploads an hour. Try again later.

Registry codes: `too_many_attempts`

What it means: Every upload attempt counts towards the hourly limit, refused ones too, because each one costs a check of every image.

How to fix it: Run `playac-mod check` first, then try again in an hour.

### upload-too-many-images

**Too many or too large pictures**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Your mod has more than 500 different pictures. Split it into smaller mods.
    Your mod's pictures add up to more than 67 million pixels, or are too slow to check. Split it into smaller mods.

Registry codes: `too_many_images`

What it means: One upload may hold at most 500 different pictures and about 67 million pixels in all, which is 16 textures of 2048 by 2048. The same file used many times counts once.

How to fix it: Split the mod into smaller mods, or make the large textures smaller.

### import-bad-source

**Not a GitHub repository and tag**

Seen in: Share a mod, when you upload.

From the mod list (upload):

    Write it as github.com/<owner>/<repo>@<tag>, for example github.com/you/tea-stall@v1.2.0.
    That is not a GitHub owner and repository name.

Registry codes: `bad_source`

What it means: Import from GitHub takes a public repository and one of its tags.

How to fix it: Write github.com/you/your-repo@v1.2.0, with a tag that exists on GitHub.

### mod-conflict

**That change to the version is not allowed now**

Seen in: the Mods tab.

From the mod list (upload):

    A moderator took this version out of the list. Upload a fixed version, or ask the moderators to look again.
    The moderators are looking at this version, so it can't be listed again for now.
    Another decision on this version came first. Reload and look again.

Registry codes: `mod_conflict`

What it means: The version's state does not allow that change. Only a moderator can list again a version that a moderator withdrew, and a decision made first wins. A version the moderators are looking at cannot be listed again until they decide.

How to fix it: Reload the Mods tab. If a moderator withdrew the version, read the reason, fix the mod and upload a new version. If the moderators are looking at it, wait for their decision.

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

How to fix it: If you believe the notice is wrong, send a counter-notice. The mod rules page explains how.

### review-sexual-content

**Sexual content**

Seen in: the review decision on your upload.

What it means: The mod holds sexual or sexually suggestive pictures or text. Players of every age use this site.

How to fix it: Remove it. Mods here are for players of every age.

### review-violent-content

**Gore or graphic violence**

Seen in: the review decision on your upload.

What it means: The mod holds gore, graphic violence or disturbing pictures or text. Players of every age use this site.

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

What it means: The mod does not load or does not do what it says. Fix it and upload it again.

How to fix it: Test it with `playac-mod check`, then in the game with developer mode and the Mod log. Fix it and upload a higher version.

### review-spam

**Spam or duplicate**

Seen in: the review decision on your upload.

What it means: The mod repeats another upload, or is an advert or a placeholder rather than a mod.

How to fix it: Share each mod once, and only finished mods.

### review-repeat-infringer

**Upload rights removed**

Seen in: the review decision on your upload.

What it means: Mods from this account were removed for copyright several times, so under the repeat-infringer policy on the mod rules page its mods are no longer shared.

How to fix it: Read the mod rules page for how to appeal.

### review-uploader-request

**Removed at your request**

Seen in: the review decision on your upload.

What it means: You asked for this version to be removed.

How to fix it: Nothing to do.

### review-other

**Another rule**

Seen in: the review decision on your upload.

What it means: The mod breaks another of the mod rules. The moderator's note says which.

How to fix it: Read the moderator's note. It says which rule.

## Updates and removals

### mod-removed

**Removed by the moderators**

Seen in: Mods tab, on the mod's row after a restart; Mods tab, when you install a ZIP.

In the game page (install, check tool):

    Removed by the moderators: holds art from another game. It cannot be switched on

What it means: The moderators removed this version, and the reason follows the message. Every copy is switched off at the next start and cannot be switched on, even one installed from a ZIP.

How to fix it: If you installed it, remove it, or install a newer version once the author fixes it. If you made it, read the review reason, fix the problem and upload a new version. Players who update get the mod switched on again.

### status-update-available

**Update available**

Seen in: Mods tab, on the mod's row after a restart.

On the site:

    Update available

What it means: A newer listed version of the mod is in the mod list.

How to fix it: Open Browse mods, install the update and restart.

### status-yanked

**Withdrawn from the mod list**

Seen in: Mods tab, on the mod's row after a restart.

On the site:

    This version was withdrawn from the mod list. It still works.

What it means: The author or a moderator withdrew this version. It still works and friends who both have it can still visit, but new players cannot install it.

How to fix it: Nothing to do. If the author shares a newer version, update to it.

### status-mods-switched-off

**Mods are switched off for everyone**

Seen in: the Mods tab.

From the mod list (upload):

    Mods are switched off for everyone for now while we fix a problem. Your mods are still installed and come back on their own.

Registry codes: `mods_switched_off`

What it means: We switched mods off for everyone for a while. Games start without mods and no mod can be downloaded, but nothing is uninstalled.

How to fix it: Nothing to do. Your mods come back on their own.

## Friend visits

### visit-lend-wont-load

**A friend's mods would not all load here**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    the friend's mods would not all load here: they unpack to 30 MB, and the game keeps 24 MB for mods on a phone
    the friend's mods would not all load here: bean.tea-stall needs kim.lib, which is not installed
    the friend's mods did not all load
    a lent mod is missing from this tab

What it means: You agreed to visit with your friend's mods, but this game could not run all of them, so the visit did not start. The set is too big for this device, needs a mod it does not hold, or is gone from this tab.

How to fix it: Switch off some of your own Just you mods, which use the same room, and ask again. A computer keeps more room for mods than a phone. If the set is gone, ask again and the game fetches it once more.

### dev-visits-off

**Visits are off in developer mode**

Seen in: the Multiplayer panel, when a visit is refused; Settings, Mods, Developer, "Load a mod you are making" (?moddev=1).

On the site:

    A mod is loaded in developer mode, so friend visits are off: no other town has that mod. Unload it in Settings, Mods, then restart the game.

What it means: A mod loaded in developer mode is not installed and no other town has it, so friend visits are off.

How to fix it: Unload it in Settings, Mods, Developer, then restart the game.

### visit-modset-mismatch

**The two towns run different World mods**

Seen in: the Multiplayer panel, when a visit is refused.

On the site:

    Your World mods don't match. Visits need the same World mods (the ones visitors can see) in both towns (or none). Change them in Settings, Mods.
    Kim's town runs Tea Stall 1.2.0, you don't. Visits need the same World mods (the ones visitors can see) in both towns. Change them in Settings, Mods.

Registry codes: `modset_mismatch`

What it means: A friend visit starts only when both towns run the same World mods that count for visits, in the same versions and order. The message names what differs.

How to fix it: Make the World mods match in Settings, Mods, or switch them off and restart. A World mod counts when it has "textures", "shops" or "items" content, and a Just you mod never counts. See the multiplayer guide for the full rule (https://playaconline.com/modding/guides/multiplayer/).

### visit-lend-failed

**A friend's mods could not be loaded for the visit**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    the download for bean.tea-stall 1.2.0 does not match the friend's copy
    the download for bean.tea-stall 1.2.0 is a different mod
    the friend's mods do not add up to their town's mod set
    the friend's settings for bean.tea-stall are not ones that mod takes

From the mod list (upload):

    Invalid mod list: the mod list does not match the mod set hash.

On the site:

    Couldn't load Kim's mods for this visit. Couldn't download Tea Stall: the mod list answered 404.

What it means: You agreed to visit with your friend's mods, and one could not be downloaded, did not match your friend's version or had settings the mod does not take. Nothing was kept or installed, and the visit was left.

How to fix it: Ask again later. If it keeps happening, the mod may have been removed or updated. Both players can then install the same version from Browse mods.

### city-mod-refused

**A City mod was refused**

Seen in: the Multiplayer panel, when a visit is refused.

In the game page (install, check tool):

    bean.lamps: a City mod may only hold textures and lines, not shops
    bean.lamps: a City mod may not run scripts

What it means: The City's own mods may only change textures and lines. A mod with a shop, a script or commands is never loaded there.

How to fix it: Nothing to do. If you make a mod for The City, give it only textures and messages.
