# Making a mod

A mod adds things to the game without changing its code. It can hold textures,
shop stock, furniture, villager lines, letters, calendar days and a Lua script.
Players install mods in **Settings, Mods**, from a ZIP or from the mod list.

This file is the offline reference for the file formats and the script API.
The step-by-step guide is at https://playaconline.com/modding/.

- Three working example mods each live in a public repository of their own,
  and each puts two kinds of mod together: Springtime Town (textures and
  villager lines, no code), After Hours (Nook's open at night with goods of its own,
  and a new item with its own pictures) and Harvest Post (calendar days and
  letters, and a script with commands, a question, a setting, a timer and a
  function other mods call). The cookbook links every repository, shows each
  mod file by file and has its ZIP:
  https://playaconline.com/modding/cookbook/.
- To find the example or starter kit file that shows one task, such as a
  setting, Nook's stock or a fish caught, use the cookbook's "How do I"
  index: https://playaconline.com/modding/cookbook/#how-do-i.
- The full reference, with every limit, is
  https://playaconline.com/modding/reference/.
- The setup guides are in [`setup/`](setup/). They cover Node.js, the
  playac-mod tool, an editor, texture tools, developer mode, an AI assistant,
  Git and publishing, for macOS, Windows and Linux.

The game checks every rule below when a mod is installed. The site checks the
same rules when a mod is shared.

Sizes in this file are binary: 1 MB is 1,048,576 bytes and 1 KB is 1,024 bytes.

## The ZIP

```
my-mod.zip
├── mod.json            required, at the top (or inside one top folder)
├── textures/           .png or .dds pictures, named for the textures they replace
├── messages/en.json    lines, by key
├── shops.json          the game's shops, each by its id (World mods)
├── letters.json        letter templates a script can mail
├── calendar.json       calendar days: a board notice, a letter, a date for talk pools
├── talk.json           villager line pools, no script needed
└── main.lua            a script
```

- A ZIP holds only `.json .lua .dds .png .txt .md` files.
- A ZIP holds at most 2000 files. It is at most 16 MB zipped and 64 MB
  unpacked.
- `mod.json` is at most 64 KB. Any other `.json` file is at most 256 KB. Any
  `.lua` file is at most 512 KB.
- The files that `content.shops` and `content.messages` name are read as JSON
  whatever they are called. The 256 KB limit applies to them too.
- Paths are plain ASCII, at most 160 bytes, with no `..`, `\` or `:`.
- Two paths that differ only in upper and lower case are refused. So is a file
  whose name, ignoring case, is also a folder (`tex.png` and `TEX.png/a.png`).
- A JSON file with the same key twice is refused. So is one nested more than
  32 levels deep.
- ZIPs made by the Mac Finder or Windows work. The game ignores `__MACOSX/`,
  `Thumbs.db` and every hidden file or folder. A hidden name starts with `.`,
  such as `.DS_Store`, `._*`, `.gitignore`, `.github/`, `.vscode/` and
  `.playac/`. A Finder ZIP of a mod repository folder works as it is.

A player can have at most 32 mods switched on. Together they may be at most
96 MB unpacked, or 24 MB on a phone. Keep texture mods small if you want phone
players to use them.

## mod.json

A mod that only you see (textures, lines, a script):

```jsonc
{
  "schema": 1,
  "api": 1,                         // the mod API level the mod is made for
  "id": "yourname.my-mod",          // author.mod-name: lowercase, digits, dashes
  "name": "My Mod",                 // 1 to 60 characters
  "version": "1.0.0",               // x.y.z
  "authors": ["yourname"],          // 1 to 8 names, each up to 40 characters
  "description": "What it does.",   // optional, up to 500 characters
  "scope": "client",                // "client" or "world", see below
  "content": {
    "textures": "textures/",
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "events": ["villager_talked", "day_started"]  // every event the script listens to
  },
  "assets_original": true           // required: see Rules
}
```

A mod that changes the flower shop is a World mod:

```json
{
  "schema": 1,
  "api": 1,
  "id": "yourname.tea-stall",
  "name": "Tea Stall",
  "version": "1.0.0",
  "authors": ["yourname"],
  "scope": "world",
  "content": { "shops": "shops.json" },
  "assets_original": true
}
```

- `api`: the mod API level your mod is made for, a whole number. Today it is
  `1`. The level goes up when a game update changes what a mod can do. A mod
  made for a level the game does not read is not loaded. Its row on the Mods
  tab says "needs a newer game" or "made for an older game".
- `id`: up to 32 characters before the dot and 48 after. The mod list keeps
  the author names `playaconline`, `official`, `admin` and `example` for
  itself.
- `content` can hold `textures`, `messages`, `shops`, `items`, `letters`,
  `calendar` and `talk`, and nothing else. Each names a file
  that is in the ZIP. `textures` names a folder with at least one file.
- `scripts.events`: one or more of `villager_talked`, `day_started`,
  `item_picked_up`, `scene_entered`, `data_migrated`, `hour_changed`,
  `item_bought`, `item_sold`, `fish_caught`, `bug_caught`, `letter_read`,
  `villager_moved_in`, `visitor_arrived`, `command_finished`,
  `question_answered`, `timer_fired` and `villager_answered`, each once.
- `permissions` (optional): the commands your script may use, each once, from
  `send_letter`, `give_item`, `show_line`, `ask`, `take_item`,
  `take_bells`, `set_shop_goods` and `set_shop_open`. The game refuses any command the list leaves out. The Mods tab shows players what the list lets
  your mod do. A mod with `permissions` needs `scripts`. Without `permissions`
  your script can change nothing.
- `$schema` (optional): add
  `"$schema": "https://playaconline.com/schemas/mod.schema.json"`. An editor
  that knows JSON Schema, such as VS Code, then checks mod.json as you type.
  shops.json can carry
  `"$schema": "https://playaconline.com/schemas/shops.schema.json"`. A messages
  file cannot, because every key there is a line. Point your editor at
  `messages.schema.json` in its settings instead.
- A key the game does not know is refused, in mod.json and in each data file
  (shops, items, letters, calendar and talk). The message names the closest
  key: `mod.json: unknown key "permisions" (did you mean "permissions"?)`. A
  messages file is the exception, because every key there is a line.
- `game` and `save` are not keys. A mod.json with either is refused.

Files for your editor and tools:

| File | What it holds |
|---|---|
| [`/schemas/api.json`](https://playaconline.com/schemas/api.json) | The mod API spec. The reference pages are generated from it. |
| [`/schemas/playac.lua`](https://playaconline.com/schemas/playac.lua) | Lua types for your editor. |
| [`/schemas/items.json`](https://playaconline.com/schemas/items.json) | The items a shop may stock, with prices. |
| [`/schemas/scenes.json`](https://playaconline.com/schemas/scenes.json) | Scene numbers and names. |
| [`/schemas/villagers.json`](https://playaconline.com/schemas/villagers.json) | Every villager's id, name, species and personality. |

### Scope

`scope` is `"client"` or `"world"`. Players see these as **Just you** and
**World**.

- **A Just you mod** (`"scope": "client"`): only you see it. It can hold
  textures, lines, talk pools, letters and scripts.
- **A World mod** (`"scope": "world"`): it changes your town for anyone
  visiting. A shop needs it, and so does a calendar day with a `board` notice.
  A mod with `"scope": "client"` and either of those is refused.

In The City, the shops and board notices of World mods are switched off,
mod items are off, and every command a script sends is refused. Textures,
lines and scripts keep running there for you.

Friend visits compare World mods:

- A World mod counts for visits when it has `textures`, `shops` or `items`.
- A visit starts only when both towns have the same World mods that count, in
  the same order, or none.
- Mods match by their contents. It does not matter where each player installed
  them from.

A visitor can borrow the host's mods for one visit:

- This works when every World mod of the host that counts is a reviewed
  version from the mod list. A mod installed from a file cannot be lent.
- Nothing is installed. The mods run with the host's world settings and an
  empty store that is never kept. A client setting stays the visitor's own (see
  Settings, below).
- The game restarts before and after the trip. In the visitor's own town a
  lent mod's shop, Nook goods, board notices, items, renames and commands do
  nothing.
- The host's settings must be ones the mod allows. A text setting the host
  changed from its default must pass the site's word checks (no rude words,
  contact details or risky phrases). If not, the visit is refused.

### Load order

The Mods tab lists mods in load order. The arrows change it.

- Textures and shops: when two mods change the same one, the later mod wins.
- A shop goes to the later mod whole, with all of its blocks. Nothing of the
  earlier mod's change to that shop is used, and its row in the Mods tab says
  so. Two mods that change different shops both apply.
- A texture file for one exact palette beats any mod's `$` file for the same
  texture, whatever the order.
- Talk lines: each place in a talk takes one line. Every mod's script is
  asked in order, and the first to return a line for a place takes it. The
  places no script took get every mod's fitting talk pools, put together.
- A mod that needs another (`depends`, below) always loads after it, whatever
  the list says. So does a mod that uses another (`optional_depends`), when
  that other mod is installed and on.

### Settings, dependencies and data

```json
"depends":   { "yourname.tea-lib": ">=1.0.0 <2.0.0" },
"optional_depends": { "yourname.weather": ">=1.0.0" },
"conflicts": { "someone.other-shop": "*" },
"data_version": 2,
"settings": [
  { "name": "greet", "type": "bool", "label": "Say hello", "default": true, "scope": "client" },
  { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 },
  { "name": "drink", "type": "choice", "label": "Drink", "default": "tea", "choices": ["tea", "coffee"] },
  { "name": "motto", "type": "text", "label": "Shop motto", "default": "", "max_length": 40 }
]
```

- `depends` and `conflicts`: a mod id and a version range each, at most 16.
  - A range is `*`, or up to 4 comparisons split by one space, such as
    `>=1.0.0 <2.0.0`. The operators are `>=`, `<=`, `>`, `<` and `=`.
  - A mod does not load when a dependency is missing, switched off or the
    wrong version. Its row says why.
  - A mod does not load when it lists a conflict with a mod that is switched
    on.
- `optional_depends`: mods yours can use but does not need. Same shape and
  ranges as `depends`, at most 16. A mod id goes in only one of the three keys.
  - Your mod always loads. An optional dependency that is installed, switched
    on, loading and inside the range is present, and loads before your mod.
  - One that is missing, off, not loading or outside the range is absent.
    Nothing waits for it.
  - `remote.version(id)` returns its version, such as `"1.2.0"`, when it is
    present. When it is absent it returns `nil`, a message and a code:
    `dependency-absent`, `dependency-version` or `dependency-undeclared`.
  - `remote.call` to an absent optional dependency returns the same three. It
    raises no error and calls nothing.
  - Two mods can use each other. A circle through an optional dependency never
    stops a mod. The earlier mod in the player's order loads first, and the
    other loads after it. Both are present in events. Ask in an event, not at
    the top of the script.
  - An optional dependency is a mod like any other for friend visits. When it
    is a World mod that counts, both towns need it.
- `settings`: at most 16. Names are `a-z 0-9 _` and start with a letter.
  - The player changes them on the mod's row in the Mods tab. They take effect
    from the next start.
  - Your script reads them with `settings.get(name)`.
  - A setting may say `"scope"`: `"world"` (the default) or `"client"`.
  - A world setting is part of the town. A friend visit compares it, and a
    visitor who borrows your mods plays with your value.
  - A client setting is the player's own. A visit never compares or sends it.
    On a visit each player keeps their own value.
  - Use `client` for a choice that only changes what its own player sees or
    hears. A client setting may not decide what the town gets. In an event
    that read one, `cmd.send_letter`, `cmd.give_item`, `cmd.take_item` and
    `cmd.take_bells` are refused with the code `command-client-setting`.
  - The game checks that rule one event at a time. Do not keep a client
    setting's value in a variable, in `store` or in a timer's `data` and use
    it later to send, give or take. Nothing stops that, and nothing warns.
    Your town gets what your value says, and a visitor's copy of the mod
    runs their value. `timer.after` itself is not refused.
  - The rule holds on every mod, a Just you mod too. Leave `scope` off a
    setting that decides what is sent, given or taken.
- `data_version`: a whole number for the shape of what your script saves. When
  it changes, `data_migrated` runs (see Scripts).

## Textures

The common path is three steps:

1. In the model viewer, `https://playaconline.com/viewer/`, open the model,
   press **Textures**, then **Save all**. You get `<model>-textures.zip` with
   every texture of the model, each already named.
2. Paint over the pictures. Keep each file's name. Delete the ones you did not
   paint.
3. Drop them into the mod's `textures/` folder and watch them change live with
   `playac-mod dev` (see Developer mode).

Start from the texture kit, `templates/texture-kit/` in this repository, also
a ZIP in its newest "Starter kits and AI pack" release. The pixels must be your
own: the saved pictures are the game's, for the layout only. The mod list
refuses an unchanged copy of a texture from the game or the HD pack, and a
moderator sees every texture.

### Reference

Names:

```
<label>_tex1_<w>x<h>_<texture hash>_<palette hash>_<format>.png
```

- The label is optional, and the game matches the part after the last
  `_tex1_`. A label is 1 to 40 lower case letters, digits and dashes, then
  one underscore: `bookshelf-top_tex1_32x32_626709d910129694_$_8.png`. Labels
  work in `content.textures`, its subfolders and an item's `textures` folder.
  Any other label is refused (`texture-label`). Two files that are one texture
  once the labels are taken off are refused (`texture-label-twice`). A `.png`
  and a `.dds` of the same name with no labels install with a warning
  (`texture-twice`).
- `$` in place of the palette hash matches those pixels under any palette.
  **Save all** uses it where there is one. It is loaded once and shared, so it
  costs one texture's memory.
- For one palette only (one season or time of day), use the exact name:
  **Copy name** in the viewer. Any mod's file with the exact palette hash wins
  over a `$` file for that palette.
- A texture without a palette has no palette part:
  `tex1_32x32_8b5a1b4a83d4d7c7_14.png`.
- The `tex1_...` part and the ending are matched ignoring upper and lower
  case. The names are the ones Dolphin HD packs use.
- A mod's texture wins over the HD pack.

The viewer lists models, and also **Ground and water** (the town's acres),
**Rooms and sky** (room floors and walls, and the train window), **Menus and
UI**, **Effects** and **More textures**.

PNG files:

- Any kind of PNG works: grey, colour or palette, with or without alpha,
  interlaced or not. The largest is 2048x2048.
- The game turns a PNG into uncompressed pixels when it loads. A 2048x2048 PNG
  is 16 MB of pixels, however small its file.
- All mods' PNGs together may be at most 96 MB of pixels, or 24 MB on a phone.
- A PNG that is over the limit, too big or broken is left out. The Mods tab
  names it.

DDS files:

- The format is BC7, DXT1, DXT5 or uncompressed 32-bit RGBA. Either channel
  order works: RGBA, or BGRA, which some tools call A8R8G8B8.
- BC7 needs a browser with BPTC texture support.
- Save each texture with one level (no mipmaps). The mod list refuses a file
  with anything after the first level.

A mod item can carry pictures of its own, drawn only on that item: a folder
named by its `textures` key in `items.json`, with files named the same way
after the base's textures. `CONTRACT.md` has the rules.

## Messages

`messages/en.json` maps keys to lines:

```json
{ "greet": "Hello there!" }
```

- Keys: 1 to 48 of `a-z 0-9 _ . -`. A mod has at most 256 keys.
- Each line is 1 to 400 bytes.
- A key is yours as `yourname.my-mod:greet`. A script can read another mod's
  line by its full key. It gets `nil` when that mod is not installed.
- Lines wrap by width, not by a count of characters. A line holds 180 pixels
  of the game's font, which is about 24 letters. A page holds 4 lines.
- A character the game's font does not have shows as `?`.

- `content.messages` names one `.json` file. Every player sees the lines as
  written, whatever the game's language. There are no translations.

## Shops

A World mod can change the game's shops. `shops.json` names each shop it
changes by its id, and each shop takes a block. This one makes the flower shop
a tea stall in the afternoon and evening:

```json
{
  "shops": {
    "flower": {
      "when": { "hours": { "from": "15:00", "to": "01:00" } },
      "open": true,
      "own_goods": false,
      "goods": [{ "item": "0x2800", "price": 600 }],
      "name": "Tea Stall",
      "lines": { "greeting": "Welcome to the tea stall!" }
    }
  }
}
```

The shop ids:

| id | shop | fields |
|---|---|---|
| `nook` | Nook's store | `when`, `open`, `own_goods`, `goods` (1 to 16), `price_percent`, `buy_back_percent` |
| `flower` | the flower shop | `when`, `open`, `own_goods`, `goods` (1 to 6), `price_percent`, `name`, `lines` |
| `redd` | Crazy Redd's tent | `when`, `own_goods`, `goods` (1 to 6), `price_percent` |
| `saharah` | Saharah | `when`, `own_goods`, `goods` (1 to 6), `price_percent` |
| `fireworks` | the fireworks stall | `when`, `own_goods`, `goods` (1 to 6), `price_percent` |
| `able` | Able Sisters | `when`, `services` (`design`) |
| `barber` | the barber shop | `when`, `open`, `services` (`haircut`) |
| `dream` | the Dream Suite | `when`, `services` (`dream`) |
| `katrina` | Katrina's tent | `when`, `services` (`fortune`) |

The guide says where each shop puts its goods and when `open` works:
https://playaconline.com/modding/guides/shops/#table.

- A key that is not a shop id is refused. The message names the closest id.
- A shop takes one block, or a list of 1 to 8 blocks.
- A block's keys go in this order: `when`, `open`, `own_goods`, `goods`,
  `price_percent`, `buy_back_percent`, `services`, `name`, `lines`. Each one
  means the same on every shop.
- A block needs at least one key besides `when`.
- A field a shop does not have is left out, not refused. The rest of the
  block applies, and the mod's row in the Mods tab names the shop and the
  field.
- Delete the key of a shop you do not change.

### The fields

- `when`: the block applies only while every key in it holds. Leave it out
  and the block applies always.
  - `hours`: `{ "from": "HH:MM", "to": "HH:MM" }`, 24-hour times. `from` and
    `to` must differ. `to` can be past midnight.
  - `time`: `"morning"` (5 to 12), `"day"` (12 to 17), `"evening"` (17 to
    midnight) or `"night"` (midnight to 5).
  - `season`: `"spring"`, `"summer"`, `"fall"` or `"winter"`.
  - `weather`: `"clear"`, `"rain"` or `"snow"`.
  - `weekday`: a list of days, `"monday"` to `"sunday"`.
  - `month`: a list of months, 1 (January) to 12.
  - `setting`: the name of one of your own settings of type `bool` with scope
    world. The block applies while it is on.
- `open`: `true` opens the shop while the block applies, also when its own
  hours have it shut. `false` shuts it. Leave it out for the shop's own hours.
- `own_goods`: `true` is the default. Your goods go in at most half of the
  spots of their kind, rounded up, and the shop's own goods keep the rest.
  `false` makes your goods the shop's whole stock while the block applies:
  each spot of a kind you list takes one of them, and every other spot is
  bare.
- `goods`: the goods, each `{ "item", "price", "when" }`. Only `item` is
  required. No item twice in a block.
  - `item` is a string: `"0x"` and 4 hex digits.
  - It must be an item the shop can show. Money, turnips, tickets, fossils
    and special items cannot be stocked. The Mods tab says which item was
    refused.
  - `price` is optional, a whole number of Bells from 1 to 99999. Without it
    the good has the shop's price. A price below what Nook pays for the item
    is raised to that.
  - At Nook's and the flower shop a good can be one of your own items:
    `"item": "you.my-mod:ghost-lantern"` (see Items). A mod item stands as its
    base piece. Two goods of a block may not be the same piece of furniture.
  - A good's own `when` keeps that good to its own times, inside its block's.
  - With more goods of a kind than spots, the date picks which show.
- `price_percent`: 1 to 1000. The shop asks this percent of its own price for
  every good with no price of its own. 100 is the game's price.
- `buy_back_percent`: 1 to 1000. Nook pays this percent of what he would pay,
  never more than he asks for the item. Not for turnips.
- `services`: a service's price in Bells, 1 to 99999, by its name in the table:
  `{ "haircut": 2000 }`.
- `name`: 1 to 40 characters on one line. The flower shop's name, on its door
  sign while it is shut.
- `lines`: what the keeper says, by slot. The flower shop's slots are
  `greeting`, her hello before her "what can I do for you?" menu, and
  `stock`, her answer to "What's in stock?". A slot is one line, or a list of
  1 to 8 lines the keeper picks from each time. Each line is 1 to 160
  characters with at most 3 line breaks.

### Blocks together

A list of blocks changes a shop at different times. This flower shop sells
your goods among its own all day, and on rainy days says something else:

```json
{
  "shops": {
    "flower": [
      { "goods": [{ "item": "0x2900", "price": 500 }] },
      {
        "when": { "weather": "rain" },
        "lines": { "greeting": ["Come in out of the rain!", "Wet day for flowers, isn't it?"] }
      }
    ]
  }
}
```

- Every block whose `when` holds applies. Their goods are sold together. A
  good in two of them takes the later block's price.
- For a single value (`open`, `own_goods`, a percent, a service, a line
  slot) the last applying block that sets it counts.
- `name` is the last applying block's, or else the last block's with a name.
- A script can add one more block after yours, for the rest of the game day:
  `cmd.set_shop_goods(shop, goods)` and `cmd.set_shop_open(shop, on)`. Each
  needs its name in `permissions`.

### The flower shop

- It has six table spots, all of one kind. With `"own_goods": false` your
  goods take them in order. Otherwise you get up to three, and the day's own
  goods keep the rest.
- `"open": true` opens it through its 2 AM to 7 AM shut. On a Sunday morning
  the keeper is out selling turnips, and it stays shut.
- `"open": false` shuts it while the block applies. Its door sign says until
  when ("Shut until 1:00 PM."), the end of the block's `when.hours`.

### Nook's store

This block adds goods to Nook's store every day, in every store size:

```json
{
  "shops": {
    "nook": {
      "goods": [
        { "item": "0x1110", "price": 1800 },
        { "item": "0x2205", "price": 900 },
        { "item": "0x2605" }
      ]
    }
  }
}
```

- Each good stands where Nook's own goods of its kind stand. The kinds are
  furniture, stationery, clothing, carpets, wallpaper, tools, umbrellas,
  paint, saplings and flower bags.
- Fruit, the signboard and anything without a spot are refused. So are money,
  turnips, tickets and fossils. The Mods tab says which.
- `"own_goods": false` leaves the kinds you do not list bare, and the rare
  piece and the plants too.
- `price` is what Nook asks for the good off the floor. Catalogue orders stay
  at the usual price.
- A block with no `when`, on it or on any of its goods, shows from the next
  morning's restock, the first time the town is played on a day at or after
  6:00 AM.

A block with a `when` applies at once, from the moment it holds, with no
restock, and only while it holds. It never touches the day's stock. This one
opens the shop at night with only your goods:

```json
{
  "shops": {
    "nook": {
      "when": { "hours": { "from": "01:00", "to": "03:00" } },
      "open": true,
      "own_goods": false,
      "goods": [
        { "item": "0x1768" },
        { "item": "0x1738" },
        { "item": "0x16E4" }
      ]
    }
  }
}
```

- `"open": true` opens the shop when it is shut for the night. It does not
  open it in the hour before its morning opening, on a renovation day or in
  a sale's hours.
- The day's own stock is never changed: it is back when the block stops
  applying.
- Your goods bought while the block applies stay sold out until the game
  restarts.
- The After Hours example does this: from 1 AM to 3 AM, only gyroids, a
  different few each night, and now and then its own Ghost Lantern. The
  cookbook shows it:
  https://playaconline.com/modding/cookbook/#example.after-hours.

### Every shop

- In The City, every shop is the game's own.
- When two mods change the same shop, the later one in load order has it
  whole. The earlier mod's row in the Mods tab says its change to that shop
  is not used. Two mods that change different shops both apply.

## Items

A mod can add furniture of its own, for the house. Each item reuses the model
of a real piece of furniture, its `base`. `mod.json` names the file:
`"content": { "items": "items.json" }`.

```json
{
  "items": [
    { "id": "ghost-lantern", "name": "Ghost Lantern", "base": "0x122C", "price": 2600 }
  ]
}
```

- `id`: 1 to 32 of a-z, 0-9 and `-`. The item's full id is your mod id, a
  colon, then this: `you.my-mod:ghost-lantern`. Never change it once players have
  the item. Use `renames` instead.
- `name`: 1 to 16 characters, the size of the game's item name box. It may
  hold letters, digits, spaces and `' . , ! & -`. It starts with a letter or
  digit.
- `base`: the furniture whose model the item uses. It is a string: `"0x"` and
  4 hex digits.
  - It is the piece facing south: 0x1000 to 0x1FFC or 0x3000 to 0x33C4, a
    multiple of 4.
  - These cannot be a base: fossils, gyroids, clothing, a mannequin or
    umbrella for a design, pieces with no model, and every piece a player
    carries as an item (umbrellas, fish, bugs, tools, balloons, fans,
    pinwheels and diaries). The item list on the site has a filter for the
    pieces that can be a base. The Mods tab names a refused one.
- `price`: optional, 1 to 99999 Bells. A shop asks it when the good sets no
  price.

Players get an item in two ways. Your block for the flower shop or Nook's
store sells it by its full id (see Shops). Or your script gives it with `cmd.give_item`.

In the save, a mod item is its base piece. Which pieces are your items is kept
beside the save. So:

- With your mod, the item has its own name in the pockets and in the shop.
- Without your mod, it is the plain base piece. Nothing is deleted. Putting
  the mod back gives the item its name again.
- A visitor without your mod sees the plain base piece. The City has no mod
  items.
- An item keeps its name in a house room and in the pockets, moved from slot
  to slot too. It keeps its name as a letter's present: attached, kept, mailed
  and taken out again.
- An item becomes the plain base piece when it is put in a drawer, dropped
  outside or mailed to a villager.

`renames` in `mod.json` moves pieces players already have to a new id, once
per save:

```json
"renames": { "you.my-mod:old-name": "you.my-mod:ghost-lantern" }
```

Both ids must start with this mod's id. The new id must be one of this mod's
items. A mod cannot rename another mod's items.

## Letters

A mod can carry letter templates. A template is only data. A script's
`send_letter` command mails one through the mailbox.

```json
{
  "letters": [{
    "id": "fair-thanks",
    "header": "Dear {player},",
    "body": "Thank you for coming to the\nHarvest Fair! Here is an apple.",
    "footer": "The Fair Committee",
    "sender": "The Fair",
    "item": "0x2800",
    "paper": 12
  }]
}
```

- A file holds 1 to 32 letters, each with its own `id`. An `id` is 1 to 48 of
  `a-z 0-9 _ . -`. A command names a letter as `"your.mod:fair-thanks"`.
- Letter text is plain: the letters, digits and signs on a US keyboard, with
  no accents. `$ * ^ | \` show as `?`.
- `header`: 1 to 24 characters, plus `{player}` once where the name goes.
- `body`: 1 to 192 characters on at most 6 lines. The game wraps it at the
  paper's width. A body that then needs more than 6 lines is refused.
- `footer`: 1 to 32 characters, the sign-off at the foot of the letter.
- `sender`: optional, 1 to 8 characters, the name in the mailbox list. The
  list has room for 8 characters only. Without a `sender` it shows the
  footer's first 8, so "The Lantern Keepers" reads "The Lant". The letter
  itself always signs with the whole footer.
- `item`: optional, a present. Money, turnips, tickets and fossils are
  refused.
- `paper`: optional, the stationery, 0 to 63.

## Calendar

A mod can add calendar days to the town. `mod.json` names the file:
`"content": { "calendar": "calendar.json" }`.

```json
{
  "days": [{
    "id": "harvest-fair",
    "date": { "month": 9, "week": 3, "weekday": 3 },
    "board": "HARVEST FAIR TODAY!\nBring your best fruit.",
    "letter": "fair-thanks"
  }]
}
```

- A file holds 1 to 16 days, each with its own `id`.
- `date` for a fixed date: `{ "month", "day" }`. February 29 works.
- `date` for the Nth weekday: `{ "month", "week", "weekday" }`. `week` is 1 to
  4 or `"last"`. `weekday` is 0 (Sunday) to 6.
- `board`: a notice for the town bulletin board. It is plain text like a
  letter body. It goes up once on the day, in your own town only. It does not
  go up on a visit or in The City. It changes your town, so the mod needs
  `"scope": "world"`.
- `letter`: the id of a letter in this mod's letters file. It is mailed once
  on the day, in your own town only. It needs no script and no permission. It
  counts against the mod's daily letter cap.
- Villager lines for the day are talk pools with this day's `id` as their
  `day` (see Talk pools), in any place of the talk. A day with no `board` and
  no `letter` is fine: it is a date for those pools.
- A mod cannot add decorations. The game's festival decorations belong to its
  own festivals.

## Talk pools

A villager's talk is their hello, then a menu of three answers: one about an
errand, one to chat (such as "I'm bored!") and never mind. Choose to chat and
they pick a topic, fresh every time: small talk (the weather, the time of day,
the month, plain chat), a trade, a letter they got, a memory, a hint, or news
of an event. A pool's `place` puts its lines in one of five places:

| `place` | where the line goes | what of the game's still plays |
|---|---|---|
| `before` | in front of the hello | all of it |
| `hello` | instead of an everyday hello (one with news, such as a bee sting, is kept) | the menu and the topic |
| `topic` | instead of the topic the game picked, when it is one of `topics` | the hello and the menu; the talk ends after the line |
| `after` | after the topic, as a chat's last message | everything, then the line |
| `conversation` | the whole talk | nothing: no hello, no menu, no topic |

No script is needed:

```json
{
  "pools": [
    { "place": "topic", "personality": "cranky", "lines": ["Hmph. Another day of\nyou walking around.", "What now? I was just\ngetting comfortable."] },
    { "place": "hello", "weather": "rain", "lines": [["Oh, hi! Isn't the rain\nlovely?", "The flowers think so."]] },
    { "place": "topic", "topics": ["trade", "small_talk"], "chance": 30, "lines": ["No deals today. Let's\njust talk."] },
    { "place": "after", "time": "evening", "lines": ["Getting late. Get home\nsafe!"] }
  ]
}
```

- A file holds 1 to 32 pools.
- `place`: required, with no default: `before`, `hello`, `topic`, `after`
  or `conversation`. A pool without one is refused (`talk-no-place`).
- `topics`: only with `topic`. The topics the line may stand in for:
  `small_talk` (the default), `trade`, `letter`, `memory`, `hint` and `news`,
  each once, or `"any"`. A trade your line replaces does not happen. A
  first-job tip, the birthday question and "should I move?" are never
  replaced.
- A pool names a `personality`, a `villager` by name, or neither. With neither
  it is for everyone. The personalities are `normal`, `peppy`, `lazy`, `jock`,
  `cranky` and `snooty`.
- `lines`: 1 to 32. A line is one page of 1 to 160 characters with at most 3
  line breaks, which the game wraps over more windows when it needs to, or a
  list of 1 to 8 such pages, each starting on a clean window.
- A pool can be kept to a moment, with any of these:
  - `season`: `spring` (March to May), `summer` (June to August), `fall`
    (September to November) or `winter` (December to February).
  - `time`: the game's own four, `morning` (5 to 12), `day` (12 to 17),
    `evening` (17 to midnight) or `night` (midnight to 5).
  - `weather`: `clear`, `rain` or `snow`. Cherry blossom and falling leaves
    count as clear.
  - `day`: the `id` of a day in this mod's calendar file.
- `chance`: optional, 1 to 100, default 100. When the pool fits, it is in how
  many talks in 100 its line is said.
- A topic line for small talk comes whenever you choose to chat and the game
  picks small talk, roughly one chat in four or five (more often with a happy
  villager). Name more `topics` to be heard more often. Topic and after lines
  come only when you choose to chat.
- A villager can say several of your lines in a day, and never the same one
  twice running when the pools hold another.
- Which line: each place is picked on its own. The most specific pools of that
  place that fit decide, the villager's own, else their personality's, else
  everyone's. A pool fits when its `season`, `time`, `weather` and `day` are
  the ones now. Each rolls its `chance`, and one line is picked from those that
  pass, from every mod. When none pass, that part of the talk stays the
  game's.
- A script's `villager_talked` line for a place comes before any pool's. A
  `conversation` pool is used only when no script took any place.
- A pool with a `day` speaks only on that calendar day, and on the day it
  comes ahead of every pool kept to no day. Give it a `chance` to leave room
  for the rest.
- Pools never speak on a first meeting, while a villager has an errand, a
  delivery or a contest going with you, when they are moving out, or on an
  island. A new player's first ten chats are tips, so a topic line waits for
  those.
- To say something only when something in the game is true (an item in your
  pockets, a day your script counts), or to ask the player a question, use a
  script's `villager_talked` handler.

## Scripts

Scripts are Lua 5.4 with a small API:

| | |
|---|---|
| `on(event, fn)` | listen to an event listed in `scripts.events` |
| `log(...)` | a line in the Mods tab's Mod log and the browser console, as `[Mods] <your id>: ...` |
| `message(key)` | a line from a messages file, or `nil` |
| `game.time()` | a table: `{ year, month, day, hour, minute, weekday }` |
| `game.day_number()` | the game clock's day as one whole number (days since 2000-01-01) |
| `store.get(key)` / `store.set(key, value)` | save strings, numbers and booleans (8 KB) for THIS TOWN |
| `store.player.get` / `store.player.set` | the same, for the player who is playing: per mod, per town, per player, inside the same 8 KB |
| `store.client.get` / `store.client.set` | the same, one per browser, whatever town is loaded |
| `settings.get(name)` | a setting's value |
| `remote.add(name, fn)` | offer a function to other mods, while the script loads |
| `remote.call(mod, name, ...)` | call another mod's function |
| `remote.has(mod, name)` | whether that mod offers it |
| `remote.version(mod)` | the version of a mod in `depends` or `optional_depends`, or `nil`, a message and a code |
| `store.town()` | which town the store is now (opaque text, `nil` before a town loads): read your locals again when it changes |

Every handler gets exactly one table, `e`, of plain values. They are copies,
never the game's own. A field that has nothing to say is `nil`, never `""` or
`0`.

Ids are always numbers in Lua. JSON data files write them as `"0x2800"`
strings. A `cmd.*` call takes a number, `"0x2800"` or your mod's own
`"author.mod:thing"`.

| event | `e` | return |
|---|---|---|
| `villager_talked` | `{ villager }` | a talk table, or a list of them (see below) |
| `day_started` | `{ year, month, day, weekday }` | nothing |
| `item_picked_up` | `{ item, mod_item }` | nothing |
| `scene_entered` | `{ scene, name }` | nothing |
| `data_migrated` | `{ from, to }`: data versions (needs `data_version`) | nothing |
| `hour_changed` | `{ year, month, day, hour }`, when the clock reaches a new hour | nothing |
| `item_bought` | `{ item, mod_item, price, shop, ordered }`, when you buy a good for Bells anywhere | nothing |
| `item_sold` | `{ item, mod_item, count, bells, shop }`, when you sell for Bells | nothing |
| `fish_caught` | `{ item, pocketed }` | nothing |
| `bug_caught` | `{ item, pocketed }` | nothing |
| `letter_read` | `{ sender, item, mod_item, first_time, letter }`, when you read a letter | nothing |
| `villager_moved_in` | `{ villager }`, when a new villager's house goes up | nothing |
| `visitor_arrived` | `{ kind = "friend" }`, a friend riding into your own town | nothing |
| `command_finished` | `{ id, command, ok, via, code, message }` (see Commands) | nothing |
| `question_answered` | `{ id, choice, text }` (see Commands) | nothing |
| `timer_fired` | `{ id, name, data }`, when a timer you set is due (see Timers) | nothing |

No event runs in the title screen demo.

### Event fields

- `villager` is the same table wherever a villager appears:
  `{ id, name, species, personality }`. `species` and `personality` are `nil`
  when the game cannot tell. Each entry of `game.villagers()` has the same
  shape. Every villager is listed at
  https://playaconline.com/schemas/villagers.json.
- `item` is the item number.
- `mod_item` is the full id of a mod item, such as `"your.mod:ghost-lantern"`,
  when the piece is one. `item` is then its base. Otherwise `mod_item` is
  `nil`.
- For `item_sold`, `item` and `mod_item` are about the first piece sold.
- For `letter_read`, `item` is the present. It is `nil` when there is none.
  `mod_item` is set when the present is a mod item. `letter` is the full id
  of the letters file letter that was read, such as `"your.mod:welcome"`. It
  is `nil` for any other letter. The game finds it by the letter's words.
- `item_picked_up` also fires for a piece picked up off a room's floor. That
  is how a mod item is picked up, and `mod_item` is set for it.
- `fish_caught` and `bug_caught` have no `mod_item`. A fish or a bug is never
  a mod item.
- `scene` is the scene number. `name` is its name from
  https://playaconline.com/schemas/scenes.json, such as `"player_house"` or
  `"museum"`. It is `nil` for a scene with no published name.
- `weekday` is 0 (Sunday) to 6, as in `game.time()`.
- `shop` says where the sale happened:

  | `shop` | Where |
  |---|---|
  | `"nook"` | Nook's in every size, and Nookington's in The City |
  | `"flower"` | the flower shop |
  | `"redd"` | Redd |
  | `"saharah"` | Saharah |
  | `"joan"` | Joan (turnips) |
  | `"fireworks"` | the fireworks show's stall |
  | `"shrine"` | the New Year fortune |
  | `"gyroid"` | another player's gyroid |
  | `"villager"` | a villager |

  Only Nook's and villagers buy from you. To keep to Nook's, test
  `e.shop == "nook"`.
- `ordered` is `true` for a Nook's catalogue order, which arrives by mail the
  next day.
- Item numbers: bugs `0x2D00`-`0x2D27`, fish `0x2300`-`0x2327`, an
  unidentified fossil `0x2511`, shells `0x2514`-`0x251B`, fruit
  `0x2800`-`0x2804` and the coconut `0x2807`. A script can sort finds by these
  ranges.

### When events run

- `villager_talked` runs on ordinary talks only. Every mod's handler runs, in
  load order. The first line returned for a place takes it; a later one for
  that place is written to the Mod log. A conversation takes the whole talk,
  and the mods after it are not asked.
- A handler returns a talk table `{ place, line, topics, ask }`, or a list
  of talk tables, one a place. Every line names its place: a plain string
  is refused and written to the Mod log, with nothing said. `place` is
  `before`, `hello`, `topic`, `after` or
  `conversation`, as in Talk pools. `line` is a string or a list of 1 to 8
  pages, each 1 to 400 bytes. `topics` goes only with `topic`.
- `ask = { text, choices }` goes only with `conversation`: its last page asks
  the question, with 2 to 4 answers of up to 16 characters. The player's pick
  goes to `villager_answered` (`e = { villager, choice, text }`), only in that
  mod. Return a line, or `{ line, ask }` to ask again; `nil` ends the talk.

```lua
on("villager_talked", function(e)
  return { place = "conversation", line = "I baked today.",
           ask = { text = "Tea or cake?", choices = { "Tea", "Cake" } } }
end)

on("villager_answered", function(e)
  if e.text == "Cake" then return "Cake it is!" end
  return "Tea, then."
end)
```
- Special talks never reach mods, and no handler is called. The villager's
  next ordinary talk calls the handler as usual, so keep your line for that
  one. The special talks are:
  - a first meeting
  - a villager moving out
  - a villager with an errand, delivery or contest going with you
  - a complaint
  - a pitfall or a bee chase
  - an islander
  - Kamakura and summer camp
- `day_started` runs once on each new day. It also runs when the game starts
  on a new day. A game loaded on the same day it was last played gets none. A
  script that needs today reads `game.time()`.
- `item_picked_up` runs once an item is really in the pockets or the wallet.
  That covers an item picked up from the ground, caught with the net or the
  rod, or dug up. Buying does not fire it.
- A fish or a bug that goes into the pockets fires `item_picked_up` and then
  `fish_caught` or `bug_caught`. A script that counts in both counts that
  catch twice.
- `item_bought` and `item_sold` are for goods. A haircut, a fortune from
  Katrina, a dream or an Able Sisters design is a service, so it fires
  nothing.
- `data_migrated` runs once per town when the town's data was saved at another
  `data_version`. It runs as the town loads, before any other event in that
  town. `from` is 0 for data from before you set one. If the handler errors,
  the script stops for the session. The next start tries again.

### Saved data

- `store` is one per mod per TOWN, and it travels with the town. It is in the
  town's cloud save, its backups, and **Export with mod data** under the save
  button's **More options**.
- A town has up to 4 residents. All of them share `store`.
- `store.player` is one per mod, per town, per player. Use it for anything a
  resident earns alone, such as a quest or today's gift. It takes the same
  keys and values as `store` and shares the same 8 KB. `game.player().id` is
  the number that tells residents apart.
- When a resident is deleted, the game deletes what your mod saved for them in
  `store.player` and gives the room back. A new resident in that save slot
  starts with nothing, even when the game gives them the same id.
- `store.client` is one per mod per browser.
- Whole numbers come back as whole numbers.
- A key cannot start with a control character.
- The main part of your script runs before the town loads. There `store.get`
  answers `nil` and `store.set` is refused. Save from an event.
- On a visit to a friend's town and in The City, the store starts empty and is
  not kept.
- A `store.set` that would take the store over 8 KB is refused and changes
  nothing. It raises an error, which stops the script unless you call it with
  `pcall`.
- Every `store.set`, `store.player.set` and `store.client.set` writes the
  mod's file in the save folder before it returns. Daily command counts and
  the `rng()` counter are written the same way.
- The browser keeps the save folder at the game's next save sync. That happens
  on a game save. For the cloud, mod data uploads at most every 2 minutes. A
  tab closed before that sync loses the last sets.

### Calling other mods

- `remote.call` copies its arguments and results. They may be `nil`, booleans,
  numbers, strings and tables of those, at most 64 KB and 16 levels deep.
- The function you call runs on YOUR time budget. If it runs too long, your
  script is the one stopped.
- Its commands count toward your event's cap.
- Its `rng()` draws from that mod's own numbers.
- Calling back into a mod that is already running is refused.

### Reading the game

| | |
|---|---|
| `game.pockets()` | the held items only, in slot order: `{ { slot, item, mod_item }, ... }`, `slot` 1 to 15, `{}` when the pockets are empty |
| `game.bells()` | the wallet |
| `game.town()` | `{ name, id, year, month, day, hour, minute, weekday, season }` |
| `game.villagers()` | `{ { id, name, species, personality }, ... }` |
| `game.player()` | `{ name, id }`: `id` stays the same for that resident in that town |
| `game.calendar_today()` | the ids of your own calendar file's days on the town's date today, `{}` when none |
| `rng()`, `rng(n)`, `rng(m, n)` | random numbers: a fraction from 0 up to 1, a whole number 1 to `n`, or `m` to `n` |

`game.bells()`, `game.town()` and `game.player()` answer `nil` when no town is
loaded.

`rng()` counts how many numbers your mod has drawn in this town on this game
day. Each call gives the next one, so calls in a day differ. A reload carries
on from where it was, so it cannot reroll. A new game day starts new numbers.

`math.random` and `math.randomseed` are not available. Calling one stops the
script with an error that says to use `rng()`.

### Timers

A script cannot wait. It asks to be called later.

| | |
|---|---|
| `timer.after(minutes, name, data)` | sets a timer that fires once, at least that many game minutes from now. It returns the timer's id, or `nil`, a message and a code |
| `timer.cancel(id)` | cancels a waiting timer. `true` when there was one |

```lua
-- mod.json: "events": ["day_started", "timer_fired"], "permissions": ["show_line"]
on("day_started", function(e)
  timer.after(30, "tea", "ready")
end)
on("timer_fired", function(e)
  -- e = { id, name, data }
  if e.name == "tea" then cmd.show_line("Your tea is " .. e.data .. ".") end
end)
```

- List `timer_fired` in `scripts.events` and add its handler. Without one,
  `timer.after` is refused.
- `minutes` is a whole number of game minutes, 1 to 10080 (7 game days).
  `name` is 1 to 40 bytes of letters, digits, `_`, `-` and `.`. `data` is
  optional: text of up to 240 bytes, a number, `true` or `false`. Empty
  text comes back as `nil`.
- Time is counted on the game's clock, the one `game.time()` reads. A timer
  keeps counting while the game is closed. One that came due in the meantime
  fires soon after the town loads.
- A waiting timer is kept in your mod's town store. It survives a save and a
  reload and counts toward the store's 8 KB. A mod may have 16 waiting in one
  town.
- The main part of a script runs before a town loads, so set timers from
  events.
- On a visit and in The City timers live in memory only. They are gone when
  the player leaves.
- `timer_fired` is an event like any other: the same budget, and its commands
  count against the same caps. At most one timer per mod fires in a frame.
- The timer is gone before the handler runs. To repeat, set the next one in
  the handler.

- A timer never fires at the title screen or at player select. Nothing of a
  mod runs there. A timer that came due fires once play has started.

`timer.after` refusal codes: `timer-args` (never), `timer-limit` (later),
`timer-no-town` (later), `timer-no-clock` (later), `timer-store-full` (later).

### Commands: changing the game

An event handler never changes the game while it runs. It QUEUES a command.
The game carries the queue out at the end of a frame's update, before the
frame is drawn. It waits until the player is free: not talking, in a menu, in
a cutscene or walking through a door. Each command needs its name in
`permissions`.

| command | does |
|---|---|
| `cmd.send_letter{ text, item?, from?, paper? }` or `cmd.send_letter{ template = "id" }` | Puts a letter in your mailbox, with a present if you give one. The post office keeps it when the mailbox is full. `template` sends one of your own letters.json letters, with its greeting, body, sign-off, present and paper. |
| `cmd.give_item(item)` | Puts an item into your pockets. With full pockets it comes by letter instead. |
| `cmd.show_line(text)` | Shows a line in your own thought window. |
| `cmd.ask{ text, choices }` | Asks a question with 2 to 4 answers. The pick comes back as a `question_answered` event. |
| `cmd.take_item{ item, count? }` | Asks the player to hand over items from their pockets. The game writes the question and takes only on yes. |
| `cmd.take_bells{ amount }` | Asks the player to pay Bells from their wallet. The game writes the question and takes only on yes. |
| `cmd.set_shop_goods(shop, goods)` | Sets a shop's goods for the rest of the game day, as one more block after your shops.json blocks for it. `goods` is a list of `{ item, price? }`, or `{ goods = <list>, own_goods = false }`. `nil` clears. Needs scope world. |
| `cmd.set_shop_open(shop, open)` | Opens (`true`) or shuts (`false`) a shop for the rest of the game day, as one more block after your shops.json blocks for it. `nil` clears. Needs scope world. |

Each call returns the command's number. When the command is refused it returns
`nil`, a message and a code.

What happened later comes back as a `command_finished` event, to your mod
only:

- When it worked: `{ id, command, ok = true, via }`. `via` is `"mailbox"`,
  `"post_office"`, `"pockets"`, `"mail"`, `"shown"` or `"taken"`.
- When it did not: `{ id, command, ok = false, code, message }`.

A `question_answered` event is `{ id, choice, text }`, with `choice` counted
from 1. It is `{ id }` alone when the window closed with no pick.

The code says whether to try again:

| code | try again | when |
|---|---|---|
| `command-permission` | never | the command is not in `permissions` |
| `command-args` | never | wrong arguments |
| `command-item` | never | an item the command cannot hand out, or an unknown item or letter id of your own |
| `command-event-cap` | in the next event | too many commands in one event |
| `command-queue-full` | later | the mod's or the game's queue is full |
| `command-day-cap` | tomorrow | the day's cap for this command in this town |
| `command-city` | later | commands are off in The City |
| `command-visiting` | later | visiting: only the town owner's game changes the town |
| `command-lent-home` | never | a lent mod acting outside the host's town |
| `command-no-room` | later | no room now (mailbox and post office full, or pockets full for a mod item) |
| `command-not-shown` | never | the line or question cannot be drawn |
| `command-not-held` | later | a take the player cannot meet: too few of the item in plain pocket slots, or too few Bells in the wallet |
| `command-declined` | later | the player said no to a take's question, or closed it. Nothing was taken |

Mark a reward as given only when the game says it arrived:

```lua
on("day_started", function(e)
  if store.player.get("gift") then return end
  local id, why, code = cmd.send_letter{ text = message("letter"), item = 0x2800 }
  if not id then log("no letter: " .. why .. " (" .. code .. ")") end
end)
on("command_finished", function(e)
  if e.command ~= "send_letter" then return end
  if e.ok then
    store.player.set("gift", "given")
  elseif e.code == "command-day-cap" then
    log("try again tomorrow")
  elseif e.code == "command-no-room" or e.code == "command-queue-full" then
    log("try again later")
  else
    store.player.set("gift", "skipped")   -- never: do not ask again
  end
end)
```

- Items follow the shop's rules: no money, turnips, tickets, grab bags,
  fossils or the game's reserved numbers. Write an item as a number or
  `"0x2800"`.
- A letter's text is 1 to 192 characters and must fit the letter's 6 lines.
  `from` is up to 8 characters on one line, and `"A friend"` when left out.
  `paper` is 0 to 63.
- A letter is an ordinary letter once it arrives. A save keeps working without
  your mod.
- A mod may queue at most 4 commands in one event.
- A mod may have at most 8 commands waiting.
- Each game day, per mod and per town, the caps are 3 letters, 5 items, 20
  lines and 10 questions.
  - A command counts when the game applies it. Commands still waiting count
    too.
  - The counts are kept across a reload.
  - The caps are per town, for every resident together. They are a safety
    limit, not a game rule.
- In The City every command is refused.
- On a visit to a friend, a letter, an item or a take is refused, because only
  the town's owner changes a town or a save. Lines and questions still work.
- The script of `example.harvest-post` is a whole working example that sends
  each resident a letter with a fruit once a game day. A letter that found no
  room is tried again by a timer. On its fair day it asks a question
  (`cmd.ask`), takes an entry fee (`cmd.take_bells`) and mails a letters file
  template.

#### Taking items or Bells

`cmd.take_item` and `cmd.take_bells` never take on a script's word. The player
agrees each time.

- The game shows its own question, such as `Give 3 x apple to the mod
  "My Mod"?` or `Pay 300 Bells to the mod "My Mod"?`. The
  item's name, the count and the amount come from the game, and the mod's name
  from its `mod.json`. The name stands between quotes.
  A script passes no text and cannot change the question.
- The answers are "No, keep it" and "Yes, give" or "Yes, pay". The cursor
  starts on No.
- On yes the items or Bells are taken and `command_finished` says
  `via = "taken"`. On no, or a window closed with no pick, nothing is taken
  and the code is `command-declined`.
- `item` is a number, `"0x2800"` or your own `"author.mod:thing"`. `count` is
  1 to 15, and 1 when left out. `amount` is 1 to 99999.
- Only plain pocket slots count. A wrapped present, an item held for a
  villager's errand and a villager's errand goods are never taken. Neither is
  anything `give_item` refuses.
- Bells come from the wallet only, never the bank or a money bag. The wallet
  never goes below zero.
- When the player holds too little, the take is refused with
  `command-not-held` and no question is shown.
- Each game day, per mod and per town, the game shows 6 `take_item` questions
  and 6 `take_bells` questions. A take counts when its question is shown,
  whatever the answer.
- Both are refused on a visit and in The City. A mod lent for a visit can
  never take anything.
- Every take that happened is written to the Mod log.

### What a script cannot do

Scripts cannot read files, use the internet or load other code.

Each player's game runs its own copy of a script, and two copies can give
different answers. Do not count on a script giving a visitor the same answer
as the town's owner. The reasons:

- The order `pairs` walks a table in can differ.
- `game.time()` is that player's clock.
- The time limit is measured on that player's machine. A slow phone can stop a
  script that a fast computer finishes.

### Script limits

- Memory: 4 MB per mod, 16 MB across all mods.
- Each event has a short time budget. A string pattern that takes too long
  counts against it.
- All mods together get about 4 ms a frame. When a frame's time is used up,
  `day_started`, `item_picked_up` and `scene_entered` run on the next frame,
  in order. A `villager_talked` is skipped, and the villager says their own
  hello.
- The instruction budget (200,000 per event) is what stops a script, the same
  on every device. Wall-clock time is only a backstop: one event run over
  125 ms, or three runs in a row over 8 ms, also stop it. A slow or busy
  device stretches both, by how slow the game itself runs there (up to 8x).
- The built-in libraries and functions are read-only. `string.rep = ...`,
  `pcall = ...` or `rawset(string, ...)` stop the script with "read-only" or
  "is a built-in". Your own globals work as usual, and a `local` may use any
  name.
- A mod has at most 16 handlers per event. Call `on()` only while the script
  first runs, not from inside a handler.
- `__gc` metamethods are refused, because they would run outside the time
  budget.
- `log()` prints at most 20 lines per event and 500 per session. A refused
  `cmd.*` or `timer.*` call writes a line too, and those lines count toward
  the same limits.

A script that errors or runs too long is stopped for that session. The Mods
tab says why. The **Mod log** in the Mods tab shows the error with a Lua
traceback: the file and line of each call it came through. It also shows your
`log()` lines and anything the game refused.

The Mod log is at the bottom of the Mods tab, under **For mod authors**. The
section shows when a mod you installed from a file has a script, when the
game was opened with `?moddev=1`, or once a script logged an error, a stop or
a refusal.

## Developer mode

Developer mode loads a mod from its folder. You do not zip and restart for
every change.

1. Open the game with `?moddev=1`, then Settings, Mods. The **Developer**
   section is at the bottom. The address alone loads nothing.
2. Press **Choose folder** and pick the folder with mod.json in it. Or run
   `playac-mod dev` there, leave it running and press **Connect** beside
   **playac-mod dev address**. The box holds `http://127.0.0.1:2604`. Put in
   the address the tool printed if it is another one.
3. Press **Restart now** once.
4. Edit and save:

| You change | What happens |
|---|---|
| lines | the next time the line is said |
| the shop | name, sign, opening and lines at once, goods the next time you go in |
| the script | it starts again with the new code, and its `store` is kept |
| textures | drawn again from the new files |
| talk, letters, calendar | read again at once: the next talk, the next letter, the board |
| items | read again at once (see below) |
| mod.json (renames too) | restart the game |

A changed items file is read again at once:

- A new name or price shows the next time the item is shown or offered.
- A new base is what new pieces are made of. Pieces already in a town keep
  theirs, because a save holds the base.
- A removed item's pieces show as their base until the item is back.
- The Mod log says which of these applies.

What to know about a mod loaded this way:

- It is not installed. Only this browser has it.
- Its code comes from your own computer. That is the folder you chose, or the
  files `playac-mod dev` serves there. The game takes a dev address only at
  `localhost` or `127.0.0.1`.
- Nobody has reviewed that code and nothing has scanned its pictures. It runs
  in the same sandbox and under the same limits as any mod. Load only a folder
  you made or one you trust.
- It loads last, so its textures and shops win.
- A script's `villager_talked` line for a place goes to the first mod in
  load order, so an installed mod's line for the same place can still come
  first.
- A file that breaks a rule is not loaded. The Mod log says why.
- Hidden files and files a mod cannot hold, such as a `.psd` beside the
  `.dds`, are left out.
- Chrome and Edge watch the folder. Other browsers read it once, so pick it
  again to reload.
- Friend visits and sharing are off while it is loaded.

## If a mod breaks the game

- **Settings, Mods, Start without mods** restarts the game without loading any
  mod. Adding `?nomods=1` to the play page's address does the same.
- A mod that was skipped when the game started says why on its row.
- If the game stopped responding with mods on, a later start runs once
  without them. Settings, Mods then names the mods that were on, with a button
  to switch them off. A notice as the game starts names them too. Nothing is
  switched off for you. The start after that tries the mods again.

How the game tells that it stopped responding:

- The game watches the whole session, not only the start.
- A start counts as finished once the player has been in the game world for
  about 5 seconds, or after 5 minutes of the game running in a visible tab.
- A page that is still alive clears its mark when it closes, reloads or goes
  to the background. A frozen page cannot. Neither can a tab the browser killed.
- A start that never finished: the next start with the SAME mods runs without
  them when the page stopped responding 8 seconds or more before. Two
  unfinished starts in a row do the same.
- A session that ended later, during play: one alone changes nothing. The
  second in a row with the SAME mods makes the next start run without them.
  One alone may be a phone dropping the tab for memory.
- A reload, a closed tab or a switch to another app does not trigger it.
- The model viewer (`/viewer/`) loads your mods too, and the same rules watch
  it. Its start counts as finished after 300 drawn frames. A viewer that
  freezes before that makes the next start of the game or the viewer run
  without mods.
- When you test a mod that hangs at start on purpose, expect exactly one start
  without mods after the hang. A mod that hangs during play needs two hangs in
  a row. To clear the count, change which mods are on or start without mods
  yourself.

## Updates and removed mods

The game checks its installed mods with the site when it starts and when the
Mods tab opens. It sends the content hash of every installed mod. For a mod
installed from Browse mods it also sends the id and version. Nothing is sent
when no mod is installed.

- A newer listed version of your mod shows **Update available** on players'
  rows. A fix reaches them without them opening Browse mods.
- A version the moderators removed is switched off in every player's game at
  its next start, with the reason on its row. The site remembers the removed
  version's content hash, so the same files installed from a ZIP are switched
  off too.
- To bring a removed mod back, fix the problem and upload a new version. It is
  switched back on for players who update.
- The check never holds a start up for more than a few seconds.

When the check gets no answer, the game goes by the last answer that browser
got. That happens offline, when the request is blocked or when it is too slow.

- A version the game was told is removed stays off, installed again from a ZIP
  too.
- If the game was told that mods are switched off for everyone, they stay off.
- A mod the game was never told about runs as before, so offline play keeps
  working.
- The next answer replaces what the game remembered.

The content hash is worked out from the mod's files, not from the ZIP's bytes.
It is the same for your ZIP and for the copy the site rebuilds, so it is what
names a version. The SHA-256 of the ZIP file is not.

## Rules

- Share only your own work. A mod may not contain files taken from the game or
  from other packs. `assets_original` is your promise of that.
- Use no Nintendo or other franchise art, music or text. Use no Nintendo names
  or logos in a mod's name, id or pictures.
- A moderator checks every shared mod before it is listed.
- Every picture in an upload is scanned for known child abuse imagery. A mod
  installed from a file is never uploaded, so nothing scans it.
- Sharing is for players 13 or older. The first upload asks your age and asks
  you to accept the mod rules.
- Sharing needs two-factor sign-in, which you switch on from your Profile
  page. A code from your authenticator app lets you upload for 15 minutes.
- The part of the id before the dot is your author name. It belongs to the
  first account that shares under it.
- The site's word filter checks every piece of text. A moderator sees each
  match.
- An update is reviewed as what changed since your last listed version.
- The full rules are at https://playaconline.com/wiki/mod-rules/. They also
  say how refusals, removals and appeals work, and how to send a copyright
  notice.

## Checking a mod

Check your mod folder or ZIP before you install or share it, with the
playac-mod tool (https://playaconline.com/modding/testing/#cli):

```bash
playac-mod check            # the mod folder you are in
playac-mod check my-mod.zip # a ZIP, exactly as the Mods tab reads it
```

It runs the same checks the game runs when you install a mod, and prints every
problem at once. It also warns about a shop good the game would leave out. The
game names those on the mod's row in the Mods tab.
