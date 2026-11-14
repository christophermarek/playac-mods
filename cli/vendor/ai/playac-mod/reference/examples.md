# Example mods

Generated from the Play AC Online mod API spec and errors catalogue. Do not edit by hand. These are the site's own working example mods, file by file. Each installs as it is (ZIP the folder).

## example.blossom-lane

### example.blossom-lane/README.md

```
# Blossom Lane

> Download this mod's ZIP from the cookbook: it has the pictures, ready to
> install. They are drawn by a small program when the site is built, so the
> files listed here have no `textures/` folder, and `playac-mod check` on a
> copy of only these files says the textures folder is missing.

A texture-only example mod: every grown tree in town wears a cherry blossom
crown all year (with snow on top in winter), and fallen petals dot the grass
from spring to autumn. Golden trees stay gold, and saplings keep their look.

Every pixel is drawn by a small program (a crown of lit puffs covered in
five-petal flowers, and seamless grass with petal drifts), never copied from
the game. Each texture is one 128x128 RGBA DDS, named the way the game looks
textures up:

    tex1_<width>x<height>_<texture hash>_<palette hash>_<format>.dds

| What | Texture hash | Palettes |
|---|---|---|
| Tree crown, the rest of the year (February 25 to December 9) | `a67216e4ad55d908` (64x64) | 15 |
| Tree crown, cherry blossom days (April 1 to 8) | `ac6a2be34281d4e2` (64x64) | 15 |
| Tree crown, winter (December 10 to February 24, snow-capped) | `53d6cc5ace654ac7` (64x64) | 15 |
| Grass, spring to autumn | `626709d910129694`, `903adc6355e36f59`, `e96fecd242518c9f` (32x32) | 9 |

The trees change palette through the year, which is why each crown is listed
once per palette. Golden trees are the same crowns under a gold palette: this
mod names every palette but the gold one, so they stay gold (a `$` name, which
matches any palette, would turn them too). Cedars, palms and saplings have
crowns of their own, left as they are here: their names are in the textures
guide's common textures table. The crown keeps the game's cut-out shape: its corners are
fully transparent, so it draws as a round crown, never a square.

Winter grass is left as it is. The names identify which in-game texture to
replace; the pixels are our own. Clover Meadow and Cobble Town also replace the
grass: when two mods change the same texture, the lower one in your list wins.
```

### example.blossom-lane/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.blossom-lane",
  "name": "Blossom Lane",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Every grown tree in town becomes a cherry blossom tree, snow-capped in winter, and fallen petals dot the grass. A texture-only mod, drawn from scratch.",
  "scope": "client",
  "content": {
    "textures": "textures/"
  },
  "assets_original": true
}
```


## example.chatty-villagers

### example.chatty-villagers/README.md

```
# Chatty Villagers

A villager line pool example (`talk.json`). Client scope: only you hear it.
No script: the game picks the line.

Each personality has its own pool. On the first ordinary talk of the day a
villager says one line from their personality's pool, then their usual hello,
errands and all. A pool can instead name one villager (`"villager": "Bob"`) or
nobody (every villager), and can say a line only some days (`"chance": 40`).
The most specific pools that match a villager decide.
```

### example.chatty-villagers/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.chatty-villagers",
  "name": "Chatty Villagers",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Villagers say one new line a day before their usual hello, each in their own personality's voice. Data only, no script.",
  "scope": "client",
  "content": {
    "talk": "talk.json"
  },
  "assets_original": true
}
```

### example.chatty-villagers/talk.json

```json
{
  "pools": [
    {
      "personality": "normal",
      "lines": [
        "I baked something this morning. The whole house smells like cinnamon now.",
        "Have you seen the flowers by the river? I could look at them all day.",
        "I wrote you a letter in my head. Maybe one day I'll put it on paper!"
      ]
    },
    {
      "personality": "peppy",
      "lines": [
        "Guess what? Nothing happened today, and I'm SO excited about it!",
        "I practiced my dance moves all night. Want to see? Okay, maybe later!",
        "Today feels like a sparkly day. Do you feel sparkly too?"
      ]
    },
    {
      "personality": "lazy",
      "lines": [
        "I was going to nap, but then I thought about snacks. Now I'm too busy.",
        "Do you ever just lie in the grass and count clouds? I got to three.",
        "Bugs are my friends. Well, the slow ones are."
      ]
    },
    {
      "personality": "jock",
      "lines": [
        "I ran around the whole town twice before breakfast. Feel the burn!",
        "You look strong today. Have you been lifting rocks? Keep it up!",
        "Every step is a workout if you stomp hard enough!"
      ]
    },
    {
      "personality": "cranky",
      "lines": [
        "Hmph. Kids these days don't even know how to sit on a bench properly.",
        "Back in my day the river was wetter. Don't ask me how.",
        "I'm not grumpy. I'm just thinking very loudly."
      ]
    },
    {
      "personality": "snooty",
      "lines": [
        "Darling, your outfit is almost fashionable. Almost.",
        "I only drink tea from the finest cups. The chipped ones are for guests.",
        "One must always look one's best. Even for the fish."
      ]
    }
  ]
}
```


## example.clover-meadow

### example.clover-meadow/README.md

```
# Clover Meadow

> Download this mod's ZIP from the cookbook: it has the pictures, ready to
> install. They are drawn by a small program when the site is built, so the
> files listed here have no `textures/` folder, and `playac-mod check` on a
> copy of only these files says the textures folder is missing.

A texture-only example mod. It replaces the town grass with our own drawing:
seamless green ground with clover leaves and small white flowers, one 128x128
uncompressed RGBA DDS picture, saved under every name the game draws the
grass with.

The names say which in-game texture to replace; the pixels are our own. The
grass is six textures, and the game draws each under several palettes through
the seasons and the time of day, so the mod has one file per pairing:

    tex1_32x32_<texture>_<palette>_8.dds

These three grass textures are drawn under nine palettes:

    textures: 626709d910129694 903adc6355e36f59 e96fecd242518c9f
    palettes: 193ca5974976e36e 20430b0042498b04 4f54e78515f0a185
              8910d24f6fbd5f83 8b8a1c2cacd60254 963dc45f18e13cf7
              b2e512f9c0fe88ad e7f9e59c09c5f9d0 f83e63a8b6cb47b7

And these three under three palettes:

    textures: 82f28ec4199a45be cfa57a6e6f966d11 e2ab673814e71af6
    palettes: 6d5ff5628ae85b42 ce63d23d746a058a d9eb32f9a8b17411

That is 36 files, all the same picture. One file per texture named with `$` in
place of the palette (`tex1_32x32_626709d910129694_$_8.dds`) would cover every
palette too.

The pictures are drawn by a small program when the examples are built, so the
example's source folder holds only this README and mod.json.
```

### example.clover-meadow/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.clover-meadow",
  "name": "Clover Meadow",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Town grass with clover and tiny white flowers. A texture-only mod, drawn from scratch.",
  "scope": "client",
  "content": {
    "textures": "textures/"
  },
  "assets_original": true
}
```


## example.cobble-town

### example.cobble-town/README.md

```
# Cobble Town

> Download this mod's ZIP from the cookbook: it has the pictures, ready to
> install. They are drawn by a small program when the site is built, so the
> files listed here have no `textures/` folder, and `playac-mod check` on a
> copy of only these files says the textures folder is missing.

A texture-only example mod that turns the whole town to stone: the ground is
cobblestone with moss in the cracks, cliffs are dressed sandstone walls with
ivy under a capstone, and river and pond banks are brick quays that darken
toward the water. In winter the cracks fill with snow and the stones wear a
dusting.

Every pixel is drawn by a small program (a seamless Voronoi cobble pattern,
block and brick courses that tile across), never copied from the game. Each
texture is one 128x128 RGBA DDS, named the way the game looks textures up:

    tex1_<width>x<height>_<texture hash>_<palette hash>_<format>.dds

| What | Texture hashes | Palettes |
|---|---|---|
| Ground, spring to autumn | `626709d910129694`, `903adc6355e36f59`, `e96fecd242518c9f` (32x32) | 9 |
| Ground, winter | `82f28ec4199a45be`, `cfa57a6e6f966d11`, `e2ab673814e71af6` (32x32) | 3 |
| Cliff faces, spring to autumn | `99c780e750314916`, `16de5cbb85d58cc0`, `f628105fb6e026fd` (64x64) | 9 |
| Cliff faces, winter | `0dd181f7c8e1d9e1`, `e5488c12d43d6cbc`, `64ac9d75399172f0` (64x64) | 3 |
| River and pond banks, spring to autumn | `1218fdfe9c963f24`, `78690dcebd874a3b`, `2d865e307f1a0fdc` (64x64) | 9 |
| River and pond banks, winter | `2ec0ba79769bedc7`, `b6437b8020145bc6`, `9438dc9288174b5a` (64x64) | 3 |

The cliff and bank textures are strips: their top third is the ground at the
edge, the rest is the face. So the top of our walls is cobbles too, and the
ground meets the wall at a capstone instead of a seam.

The names identify which in-game texture to replace; the pixels are our own.
Clover Meadow and Blossom Lane also replace the grass: when two mods change
the same texture, the lower one in your list wins.
```

### example.cobble-town/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.cobble-town",
  "name": "Cobble Town",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Your town paved in cobblestone, with block walls for cliffs and brick quays along the river. Snowy in winter. A texture-only mod, drawn from scratch.",
  "scope": "client",
  "content": {
    "textures": "textures/"
  },
  "assets_original": true
}
```


## example.cosy-corner

### example.cosy-corner/items.json

```json
{
  "items": [
    { "id": "tea-chest", "name": "Tea Chest", "base": "0x1008", "price": 1800 },
    { "id": "reading-chair", "name": "Reading Chair", "base": "0x10f8", "price": 1200 }
  ]
}
```

### example.cosy-corner/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.cosy-corner",
  "name": "Cosy Corner",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Two pieces of furniture of its own, a Tea Chest and a Reading Chair, sold at the flower shop. Remove the mod and they stay in your house as the plain pieces they are built on; put it back and they are yours again.",
  "scope": "world",
  "content": {
    "items": "items.json",
    "shops": "shops.json"
  },
  "renames": {
    "example.cosy-corner:tea-box": "example.cosy-corner:tea-chest"
  },
  "assets_original": true
}
```

### example.cosy-corner/shops.json

```json
{
  "shops": [
    {
      "target": "flower",
      "name": "Cosy Corner",
      "greeting": "Welcome! Today the tables hold something for the house, made here and nowhere else.",
      "stock_line": "A Tea Chest and a Reading Chair, and fruit for the table. Point at one and I'll tell you the price.",
      "stock": [
        { "item": "example.cosy-corner:tea-chest" },
        { "item": "example.cosy-corner:reading-chair" },
        { "item": "0x2800", "price": 600 }
      ]
    }
  ]
}
```


## example.daily-gift

### example.daily-gift/main.lua

```lua
-- Daily Gift: once a game day, a letter with a little present arrives in the
-- mailbox. A worked example of mod commands: a hook never changes the
-- game itself, it QUEUES a command, and the game applies it at the end of a frame's
-- update, once the player is free. mod.json must name the command in "permissions".

-- Fruit: always a fine present (the shop's item rules refuse money, turnips,
-- tickets, grab bags, fossils and reserve ids).
local GIFTS = { 0x2800, 0x2801, 0x2802, 0x2803, 0x2804 }

-- The game day as one number, 20261112, or nil before a town is loaded.
local function today()
  local t = game.town()
  if not t then return nil end
  return t.year * 10000 + t.month * 100 + t.day
end

local function send_today()
  local day = today()
  if not day or store.get("sent") == day then return end
  -- rng() is seeded by the town, the day and the event, so reloading the game
  -- picks the same present that day: a reload cannot reroll it (a changed game
  -- clock is another day, and another pick).
  local gift = GIFTS[rng(#GIFTS)]
  local id, why = cmd.send_letter{ text = message("letter"), item = gift, from = message("from") }
  if id then
    store.set("sent", day)
    log("letter #" .. id .. " queued with item " .. string.format("0x%04X", gift))
  else
    log("no letter today: " .. why)
  end
end

-- A new day, and the first scene of each session (a game loaded on a day it
-- already saw does not run day_start again).
on("day_start", send_today)
on("enter_scene", send_today)

-- What happened to it: "mailbox", or "post_office" when the mailbox was full.
on("command_result", function(r)
  if r.ok then
    log("letter #" .. r.id .. " delivered via " .. r.via)
  else
    -- Refused (in The City, visiting a friend, both boxes full): try again in
    -- the next scene. The game's own cap stops this at 3 letters a day.
    log("letter #" .. r.id .. " not delivered: " .. r.error)
    store.set("sent", nil)
  end
end)
```

### example.daily-gift/messages/en.json

```json
{
  "letter": "Good morning! Here is a little something to start your day. Have a lovely time in town, and come back tomorrow for another!",
  "from": "A friend"
}
```

### example.daily-gift/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.daily-gift",
  "name": "Daily Gift",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Once a game day, a letter with a little present arrives in your mailbox. A worked example of mod commands.",
  "scope": "client",
  "content": {
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["day_start", "enter_scene", "command_result"]
  },
  "permissions": ["send_letter"],
  "assets_original": true
}
```


## example.field-notes

### example.field-notes/README.md

```
# Field Notes

Your own naturalist's journal. Every bug, fish, fossil, shell and piece of fruit
you collect goes in your notes, and villagers have something to say about it:

- today's haul ("2 bugs, a fish and a piece of fruit so far today!")
- a kind you have never noted before, and your very first fossil
- a new best day for one kind ("3 bugs today, a new best!")
- milestones: 25, 50, 100, 250 finds and on
- the first villager you talk to on a new day sums up yesterday, or your last
  day out if you were away

Each villager speaks for Field Notes at most once a day, and only when there is
something to say, so other talk mods (Village Gossip) still get their turn.
A villager busy with something of the game's own (an errand, a complaint,
moving out) does not speak for any mod on that talk; their note is kept for
the next one.

## Install

1. Download `example.field-notes-1.0.0.zip` from the modding downloads page.
2. In the game: Settings, Mods, Choose ZIP, then Restart now.

## What it shows off

- `item_picked` with item numbers: the API passes only the number, so
  `classify()` in `main.lua` sorts it by the game's item number ranges:

  | kind | item numbers |
  |---|---|
  | bugs | `0x2D00` to `0x2D27` |
  | fish | `0x2300` to `0x2327` |
  | fossil (not yet identified) | `0x2511` |
  | shells | `0x2514` to `0x251B` |
  | fruit | `0x2800` to `0x2804`, coconut `0x2807` |

- `store` kept small: counts are one string each (`"3,1,0,2,5"`), species seen
  are a string of `0`/`1`, a few hundred bytes in all. A `store.set` that would go
  over 8 KB raises, so `save()` wraps it in `pcall`.
- `day_start` rolls today over to yesterday; `talk` reads it once.
- `message()` templates with `{haul}`, `{n}`, `{old}` and friends filled in,
  so the words stay in `messages/en.json`.
- Returning `nil` from `talk` when there is nothing to say, so the next mod in
  the list gets the villager.

## Notes

- `store` is per town (the mod says `"api": 2`), so each town keeps its own
  journal, and it travels with that town's cloud save. On a visit to a friend's
  town the journal starts empty and is not kept.
- The day comes from `day_start`; a clock change backwards counts as a new day.
- Items you pick up off the ground always count. Bugs caught with the net,
  fish caught with the rod and items dug up count too: the game fires
  `item_picked` for every item that lands in your pockets.
- It is tested in the real script sandbox with fake finds, so every line it
  can say has been heard.
```

### example.field-notes/main.lua

```lua
-- Field Notes: the player's naturalist journal. A worked example of
-- item_picked + store + day_start + talk working together.
--
-- What it keeps (store is 8 KB per mod, so everything is a short string):
--   d   today, as the number yyyymmdd
--   t   today's counts, "bug,fish,fossil,shell,fruit"
--   a   all-time counts, same order
--   r   best-day records, same order
--   b   the records as they stood when today began (so a record is news once)
--   s1..s5  species ever noted: one "0"/"1" per species in that kind
--   y   the last day out with a haul, "yyyymmdd|b,f,o,s,r", until a villager
--       sums it up on the first talk of a new day
--   n   news for the next villager: "r<kind>:<old best>", "f<kind>:<index>"
--       or "m<total>"
--   v   villagers who already spoke today, "yyyymmdd:id.id.id"
--
-- The API gives an item NUMBER only, so the kind comes from the game's item
-- number ranges: bugs 0x2D00..0x2D27, fish 0x2300..0x2327,
-- the unidentified fossil 0x2511, shells 0x2514..0x251B, fruit 0x2800..0x2804
-- and the coconut 0x2807. Anything else is not a find.

local KINDS = { "bug", "fish", "fossil", "shell", "fruit" }
local SPECIES = { 40, 40, 1, 8, 8 } -- per kind; fruit is indexed from 0x2800
local MILESTONES = { 25, 50, 100, 250, 500, 1000, 2500, 5000 }

local function classify(id)
  if id >= 0x2D00 and id < 0x2D28 then return 1, id - 0x2D00 end
  if id >= 0x2300 and id < 0x2328 then return 2, id - 0x2300 end
  if id == 0x2511 then return 3, 0 end
  if id >= 0x2514 and id < 0x251C then return 4, id - 0x2514 end
  if (id >= 0x2800 and id <= 0x2804) or id == 0x2807 then return 5, id - 0x2800 end
  return nil
end

-- store helpers ------------------------------------------------------------

local function save(key, value)
  -- A set that would take the store over 8 KB raises; never let that stop the
  -- script (this mod keeps well under 1 KB, but be a good example).
  local ok, err = pcall(store.set, key, value)
  if not ok then log("could not save " .. key .. ": " .. tostring(err)) end
end

local function counts(s)
  local c = { 0, 0, 0, 0, 0 }
  if type(s) == "string" then
    local i = 1
    for v in s:gmatch("%d+") do
      if i > 5 then break end
      c[i] = tonumber(v)
      i = i + 1
    end
  end
  return c
end

local function joined(c)
  return table.concat(c, ",")
end

local function sum(c)
  return c[1] + c[2] + c[3] + c[4] + c[5]
end

local function ymd(y, m, d)
  return y * 10000 + m * 100 + d
end

-- Days since 1970-01-01 for a yyyymmdd number (Howard Hinnant's civil days).
local function days(n)
  local y, m, d = n // 10000, n // 100 % 100, n % 100
  if m <= 2 then y = y - 1 end
  local era = y // 400
  local yoe = y - era * 400
  local mp = (m + 9) % 12
  local doy = (153 * mp + 2) // 5 + d - 1
  local doe = yoe * 365 + yoe // 4 - yoe // 100 + doy
  return era * 146097 + doe - 719468
end

-- state, read at the first event in a town and written back as it changes ----
-- `store` is kept per town and no town is loaded while this file first runs,
-- so the notes are read in fresh(), at each event, when store.town() changed.

local today, day, life, best, base
local town = false

local function fresh()
  local t = store.town()
  if t == town then return end
  town = t
  today = store.get("d")
  if type(today) ~= "number" then
    local g = game.time()
    today = ymd(g.year, g.month, g.day)
    save("d", today)
  end
  day = counts(store.get("t"))
  life = counts(store.get("a"))
  best = counts(store.get("r"))
  base = counts(store.get("b"))
  if store.get("b") == nil then
    base = { table.unpack(best) }
    save("b", joined(base))
  end
end

local function seen_of(k)
  local s = store.get("s" .. k)
  if type(s) ~= "string" or #s ~= SPECIES[k] then s = string.rep("0", SPECIES[k]) end
  return s
end

-- text ---------------------------------------------------------------------

local function line(key)
  return message(key) or ""
end

local function fill(text, vars)
  return (text:gsub("{(%a+)}", function(name)
    local v = vars[name]
    if v == nil then return nil end
    return tostring(v)
  end))
end

local function cap(s)
  return s:sub(1, 1):upper() .. s:sub(2)
end

local function noun(k, n)
  if n == 1 then return line("noun." .. KINDS[k] .. ".a") end
  return n .. " " .. line("noun." .. KINDS[k] .. ".many")
end

-- "3 bugs, 2 fish and a shell"
local function haul(c)
  local parts = {}
  for k = 1, 5 do
    if c[k] > 0 then parts[#parts + 1] = noun(k, c[k]) end
  end
  if #parts == 0 then return nil end
  if #parts == 1 then return parts[1] end
  local last = table.remove(parts)
  return table.concat(parts, ", ") .. " " .. line("and") .. " " .. last
end

-- A variant that changes with the villager and the day but not on every talk.
local function pick(prefix, n, salt)
  return line(prefix .. "." .. ((salt % n) + 1))
end

-- villagers who already spoke today ----------------------------------------

local function told_list()
  local v = store.get("v")
  if type(v) ~= "string" then return "" end
  local d, ids = v:match("^(%d+):(.*)$")
  if tonumber(d) ~= today then return "" end
  return ids
end

local function told(id)
  for x in told_list():gmatch("%d+") do
    if tonumber(x) == id then return true end
  end
  return false
end

local function mark_told(id)
  local ids = told_list()
  save("v", today .. ":" .. (ids == "" and "" or ids .. ".") .. id)
end

-- events -------------------------------------------------------------------

on("day_start", function(date)
  fresh()
  local d = ymd(date.year, date.month, date.day)
  if d == today then return end
  if sum(day) > 0 then
    save("y", today .. "|" .. joined(day))
  end
  today = d
  day = { 0, 0, 0, 0, 0 }
  base = { table.unpack(best) }
  save("d", today)
  save("b", joined(base))
  save("t", joined(day))
  save("v", nil)
end)

on("item_picked", function(item)
  fresh()
  local k, idx = classify(item)
  if not k then return end

  local news
  local before = sum(life)
  day[k] = day[k] + 1
  life[k] = life[k] + 1

  -- A first-ever species is the best news; a new best day comes next, but
  -- only at the find that first passes the record as it stood this morning
  -- (and never on a first day out, which a first-ever find already covers).
  if k == 3 then
    if life[3] == 1 then news = "f3:0" end
  else
    local s = seen_of(k)
    local slot = idx + 1
    if s:sub(slot, slot) == "0" then
      s = s:sub(1, slot - 1) .. "1" .. s:sub(slot + 1)
      save("s" .. k, s)
      news = "f" .. k .. ":" .. idx
    end
  end
  if not news and base[k] >= 1 and day[k] == base[k] + 1 then
    news = "r" .. k .. ":" .. base[k]
  end
  if day[k] > best[k] then
    best[k] = day[k]
    save("r", joined(best))
  end
  if not news then
    for _, m in ipairs(MILESTONES) do
      if before < m and sum(life) >= m then news = "m" .. m end
    end
  end

  save("t", joined(day))
  save("a", joined(life))
  if news then save("n", news) end
end)

local function summary(salt)
  local y = store.get("y")
  if type(y) ~= "string" then return nil end
  save("y", nil)
  local d, rest = y:match("^(%d+)|(.*)$")
  local h = rest and haul(counts(rest))
  if not h then return nil end
  local ago = days(today) - days(tonumber(d))
  if ago > 1 then
    return fill(line("sum.gap"), { ago = ago, haul = h })
  end
  return fill(pick("sum", 4, salt), { haul = h, life = sum(life) })
end

local function reaction(salt)
  local n = store.get("n")
  if type(n) ~= "string" then return nil end
  save("n", nil)
  local what, k, extra = n:match("^(%a)(%d)[:]?(%d*)$")
  k = tonumber(k)
  if what == "f" and k then
    if k == 3 then return line("first.fossil") end
    local seen = 0
    for _ in seen_of(k):gmatch("1") do seen = seen + 1 end
    return fill(pick("first", 3, salt), { kind = line("noun." .. KINDS[k] .. ".one"), seen = seen })
  elseif what == "r" and k then
    if day[k] <= tonumber(extra) then return nil end -- a new day since
    return fill(pick("rec", 3, salt), { n = day[k], kinds = line("noun." .. KINDS[k] .. ".many"), old = extra })
  end
  local m = n:match("^m(%d+)$")
  if m then return fill(pick("mile", 2, salt), { life = m }) end
  return nil
end

local function comment(salt)
  local total = sum(day)
  if total == 0 then return nil end
  if total >= 10 then
    return fill(pick("big", 3, salt), { total = total })
  end
  for k = 1, 5 do
    if day[k] == total and total >= 2 then
      return fill(pick("only." .. KINDS[k], 2, salt), { n = total })
    end
  end
  return cap(fill(pick("haul", 6, salt), { haul = haul(day) }))
end

on("talk", function(npc)
  fresh()
  if told(npc.id) then return nil end
  local salt = npc.id + today + sum(life)
  local say = summary(salt) or reaction(salt) or comment(salt)
  if not say or say == "" then return nil end -- nothing to say: let other mods talk
  mark_told(npc.id)
  return cap(say)
end)

log("field notes open")
```

### example.field-notes/messages/en.json

```json
{
  "noun.bug.a": "a bug",
  "noun.bug.one": "bug",
  "noun.bug.many": "bugs",
  "noun.fish.a": "a fish",
  "noun.fish.one": "fish",
  "noun.fish.many": "fish",
  "noun.fossil.a": "a fossil",
  "noun.fossil.one": "fossil",
  "noun.fossil.many": "fossils",
  "noun.shell.a": "a shell",
  "noun.shell.one": "shell",
  "noun.shell.many": "shells",
  "noun.fruit.a": "a piece of fruit",
  "noun.fruit.one": "fruit",
  "noun.fruit.many": "pieces of fruit",
  "and": "and",

  "haul.1": "Let me guess: {haul} today? I can smell the great outdoors on you.",
  "haul.2": "{haul} so far today! You keep busier notes than the museum does.",
  "haul.3": "Word around town is you've found {haul} today. Not bad at all!",
  "haul.4": "Is that a field journal? You've noted {haul} already, and the day's still young!",
  "haul.5": "{haul}? Leave a little nature for the rest of us, would you?",
  "haul.6": "I peeked at your notes: {haul} today! Your handwriting is terrible, though.",

  "big.1": "{total} finds in one day? Your pockets must be groaning!",
  "big.2": "That's {total} entries in your notes today. Do you ever sit down?",
  "big.3": "{total} finds today! At this rate the town will run out of nature.",

  "only.bug.1": "{n} bugs today? You must dream in buzzing and fluttering.",
  "only.bug.2": "Bug hunting again? {n} so far. Keep that net away from my hat.",
  "only.fish.1": "{n} fish today? You smell like a pier. A nice pier, though.",
  "only.fish.2": "Fishing all day? {n} catches! The river must be getting nervous.",
  "only.fossil.1": "{n} fossils today? The whole town sounds like a construction site.",
  "only.fossil.2": "Digging again? {n} fossils! Mind you don't tunnel through to my house.",
  "only.shell.1": "{n} shells today! Did the tide bring you a present?",
  "only.shell.2": "Beachcombing again? {n} shells and a little sand in your shoes, I bet.",
  "only.fruit.1": "{n} pieces of fruit today? Save me one, I'm feeling peckish.",
  "only.fruit.2": "Shaking trees all day? {n} pieces of fruit! The trees need a nap now.",

  "first.1": "Wait, a {kind} you've never noted before? Your field notes just grew a new page!",
  "first.2": "A brand new {kind} for the journal! Your {kind} list keeps growing.",
  "first.3": "Ooh, I heard you found a {kind} nobody's seen in your notes before! How exciting!",
  "first.fossil": "Your very first fossil! Take it to the museum before it gets any ideas.",

  "rec.1": "{n} {kinds} in one day? That beats your old best of {old}! Write that down. Oh, you did.",
  "rec.2": "A new personal record: {n} {kinds} today! I'm telling everyone. Everyone who'll listen.",
  "rec.3": "{n} {kinds} today, a new best! Your old record of {old} is crying in a corner.",

  "mile.1": "{life} finds in your notes, all told! The museum owl would hoot with joy.",
  "mile.2": "Did you know your notes hold {life} finds now? You're practically a professor!",

  "sum.1": "Yesterday you found {haul}. Today's a fresh page!",
  "sum.2": "I heard about yesterday: {haul}! Think you can top it today?",
  "sum.3": "Yesterday's notes say {haul}. That's {life} finds all told!",
  "sum.4": "Morning! Yesterday was {haul}. What's on today's page?",
  "sum.gap": "Your last day out, {ago} days ago, you found {haul}. We missed you!"
}
```

### example.field-notes/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.field-notes",
  "name": "Field Notes",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Your own naturalist's journal. Every bug, fish, fossil, shell and piece of fruit you collect goes in your notes, and villagers have plenty to say about your haul, your records and yesterday's finds.",
  "scope": "client",
  "content": {
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["item_picked", "talk", "day_start"]
  },
  "assets_original": true
}
```


## example.harvest-festival

### example.harvest-festival/README.md

```
# Harvest Fair

A dated events example (`events.json`) with a letter template
(`letters.json`).

- The Harvest Fair is the third Wednesday of September (`week` 3, `weekday` 3),
  Apple Day is October 21 (`day`). On each, a notice goes up on the town bulletin
  board, once, in the player's own town only, and villagers say one of the day's
  lines before their hello.
- A board notice changes the town, so the mod is world scope.
- `fair-thanks` is a letter a mod command can mail (`send_letter`, name it
  `example.harvest-festival:fair-thanks`): the player's name goes where
  `{player}` is, and an apple comes with it. It signs "The Fair Committee";
  the mailbox list has room for 8 characters, so `sender` names it "The Fair"
  there.

Letter and notice text is plain ASCII and must fit six lines of the paper; the
game measures it in its own font and refuses one that does not.
```

### example.harvest-festival/events.json

```json
{
  "events": [
    {
      "id": "harvest-fair",
      "date": { "month": 9, "week": 3, "weekday": 3 },
      "board": "HARVEST FAIR TODAY!\nBring your best fruit and\nshow it to your neighbors.\nThe biggest apple wins\nbragging rights for a year.",
      "talk": [
        "It's the Harvest Fair! I've been polishing my pears since sunrise.",
        "Harvest Fair day! Did you bring any fruit? Mine is the shiniest, I checked.",
        "The fair smells like apples and wood smoke. Best day of the season!"
      ]
    },
    {
      "id": "apple-day",
      "date": { "month": 10, "day": 21 },
      "board": "APPLE DAY\nShare an apple with a friend\ntoday. Any apple will do,\nbut a red one says it best.",
      "talk": [
        "Happy Apple Day! Have you shared an apple with anyone yet?",
        "An apple a day, they say. Today it's an apple for everyone!"
      ]
    }
  ]
}
```

### example.harvest-festival/letters.json

```json
{
  "letters": [
    {
      "id": "fair-thanks",
      "header": "Dear {player},",
      "body": "Thank you for coming to the\nHarvest Fair! Here is an apple\nfrom the prize table. Plant it\nand see what grows.",
      "footer": "The Fair Committee",
      "sender": "The Fair",
      "item": "0x2800",
      "paper": 12
    }
  ]
}
```

### example.harvest-festival/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.harvest-festival",
  "name": "Harvest Fair",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Two town days of our own: the Harvest Fair on the third Wednesday of September and Apple Day on October 21. A notice goes up on the bulletin board and villagers talk about it all day. Also carries a thank-you letter template for mod commands.",
  "scope": "world",
  "content": {
    "events": "events.json",
    "letters": "letters.json"
  },
  "assets_original": true
}
```


## example.night-market

### example.night-market/README.md

```
# Night Market

A world mod that puts a shop and a script together.

**The shop** (`shops.json`). After dark the flower shop becomes the Night
Market:

- Open 7 PM to 1 AM. The rest of the day the door stays shut and its sign reads
  "Night Market / Open 7:00 PM to 1:00 AM."
- Its own greeting and its own answer to "What's in stock?".
- Six goods, one per table:

  | item | | price |
  |---|---|---|
  | `0x2803` | peach | 800 |
  | `0x2807` | coconut | 700 |
  | `0x2806` | candy | 500 |
  | `0x2805` | mushroom | 6000 |
  | `0x2257` | fan | 900 |
  | `0x2253` | pinwheel | 1200 |

  Every price sits above the game's floor for the item, so the game never raises
  it. A town fruit like the peach sells to Nook for 500 Bells when it comes from
  another town, so the flower shop sells one for at least 500; a coconut's
  floor is only its own buy-back (150), and candy's 25. The mushroom sells to
  Nook for 5000, hence its price.

**The script** (`main.lua`). From 5 PM, a few villagers mention the market:
before 7 that it opens soon, after 7 that it is open, plus "tonight's special".

- `day_start` picks tonight's special from the date, so it changes every day
  and walks through all six goods in six days. Just past midnight, before the
  market shuts at 1, villagers still mean last night's special.
- `game.time().hour` decides what they say, and keeps them quiet in the day.
- It speaks rarely, so it shares villagers with other mods: about one villager
  in three, and at most three before 7 and three after. A villager says each
  once a night. Everyone else is left for other mods' lines (the first mod
  that returns a line wins a talk).

**What it can't do.** The special is talk only. The stock and its prices are
the same every night, because `shops.json` is data the game reads once at boot
and a script has no way to change a shop. A villager calling the peach
"tonight's special" does not make it cheaper.

Other mods can read the market's hours as `example.night-market:hours`.
```

### example.night-market/main.lua

```lua
-- Night Market: in the evening a few villagers mention the market at the
-- flower shop, and once it is open they pass on tonight's special.
--
-- The shop itself (hours, stock, prices, greeting) is shops.json: plain data
-- the game reads at boot. This script only TALKS. "Tonight's special" is
-- picked here from the date and named in villagers' lines; the stock and its
-- prices stay the same every night, because a script cannot change a shop.

local OPEN, CLOSE = 19, 1  -- the market's hours in shops.json: 7 PM to 1 AM
local EVENING = 17         -- villagers start talking about it at 5 PM
local SPECIALS = 6         -- special1..special6, one per stock table
local PER_NIGHT = 3        -- at most this many villagers a night say "soon", and 3 "open"

-- Days since 1970-01-01 for a calendar date, so "tonight" is one number that
-- moves by one each day, across months and years.
local function daynum(y, m, d)
  if m <= 2 then y = y - 1 end
  local era = y // 400
  local yoe = y - era * 400
  local doy = (153 * ((m + 9) % 12) + 2) // 5 + d - 1
  return era * 146097 + yoe * 365 + yoe // 4 - yoe // 100 + doy - 719468
end

local function pick(day) return day % SPECIALS + 1 end

local tonight, last_night  -- specials picked by day_start (nil until it runs)
local stretch              -- the evening and phase that `told` and `spoken` count
local told, spoken = {}, 0

on("day_start", function(date)
  last_night = tonight
  tonight = pick(daynum(date.year, date.month, date.day))
  log("tonight's special is special" .. tonight)
end)

on("talk", function(npc)
  local t = game.time()
  local late = t.hour < CLOSE  -- just past midnight: still last night's market
  if t.hour < EVENING and not late then return nil end

  local day = daynum(t.year, t.month, t.day)
  if late then day = day - 1 end
  local soon = not late and t.hour < OPEN
  -- "Opens soon" and "open now" each get their own few villagers a night.
  local now = day .. (soon and "soon" or "open")
  if stretch ~= now then stretch, told, spoken = now, {}, 0 end

  -- Speak rarely: about one villager in three has heard, each says it once,
  -- and only a few say it at all. Everyone else is left to other mods.
  if told[npc.id] or spoken >= PER_NIGHT or (npc.id + day) % 3 ~= 0 then
    return nil
  end
  told[npc.id] = true
  spoken = spoken + 1
  local which = (npc.id // 3) % 3 + 1

  if soon then return message("soon" .. which) end
  local special = late and (last_night or pick(day)) or (tonight or pick(day))
  return message("open" .. which) .. " " .. message("special" .. special)
end)
```

### example.night-market/messages/en.json

```json
{
  "hours": "The Night Market at the flower shop is open from 7 PM until 1 AM.",

  "soon1": "They're hanging lanterns over at the flower shop. The Night Market opens at 7!",
  "soon2": "Save a few Bells for later. The Night Market opens as soon as it's properly dark, at 7.",
  "soon3": "Is it 7 yet? I keep checking the sky. The Night Market is the best part of the evening.",

  "open1": "The Night Market is open! The flower shop looks so pretty with all the lanterns.",
  "open2": "Off to the Night Market? Don't stay out too late. It shuts at 1, and so do my eyes.",
  "open3": "I just got back from the Night Market. My pockets are lighter, but my heart is full.",

  "special1": "Word is, tonight's special is the peach. Juicier after dark, somehow.",
  "special2": "Word is, tonight's special is the coconut. Very tropical, for a night like this.",
  "special3": "Word is, tonight's special is the moon candy. I may have had three already.",
  "special4": "Word is, tonight's special is the rare mushroom. Pricey, but it practically glows.",
  "special5": "Word is, tonight's special is the fan. Perfect for a warm night under the stars.",
  "special6": "Word is, tonight's special is the pinwheel. It spins even when there's no wind. Spooky!"
}
```

### example.night-market/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.night-market",
  "name": "Night Market",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "After dark the flower shop becomes a lantern-lit night market with its own stock, and villagers drop hints about tonight's special.",
  "scope": "world",
  "content": {
    "shops": "shops.json",
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["talk", "day_start"]
  },
  "assets_original": true
}
```

### example.night-market/shops.json

```json
{
  "shops": [
    {
      "target": "flower",
      "name": "Night Market",
      "hours": { "open": "19:00", "close": "01:00" },
      "greeting": "Evening! The lanterns are lit, so the Night Market is open. Mind the moths, and take your time.",
      "stock_line": "Peaches, coconuts, moon candy, one very rare mushroom, a fan and a pinwheel. Night prices, I'm afraid, but the night is worth it.",
      "stock": [
        { "item": "0x2803", "price": 800 },
        { "item": "0x2807", "price": 700 },
        { "item": "0x2806", "price": 500 },
        { "item": "0x2805", "price": 6000 },
        { "item": "0x2257", "price": 900 },
        { "item": "0x2253", "price": 1200 }
      ]
    }
  ]
}
```


## example.nook-extras

### example.nook-extras/README.md

```
# Nook's Extras

A Nook's stock example (`shops.json`, target `nook`). World scope: a
visitor sees the same shelves, so a friend visit needs the same mod on both sides.

`"mode": "add"` keeps Nook's own roll and puts these goods in at most half of the
spots of their kind each day: three pieces of furniture, two umbrellas (one
umbrella spot, so the date picks which one shows), a shirt and a rug. A price is
the mod's floor price, never below what Nook pays back; no price is retail.

Changes show from the next restock, the morning after the mod is switched on.
In the City Nook's stock is the game's own.
```

### example.nook-extras/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.nook-extras",
  "name": "Nook's Extras",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Nook's shop puts a few extra goods out every day: furniture, umbrellas, a shirt and a rug, beside his usual stock.",
  "scope": "world",
  "content": {
    "shops": "shops.json"
  },
  "assets_original": true
}
```

### example.nook-extras/shops.json

```json
{
  "shops": [
    {
      "target": "nook",
      "mode": "add",
      "stock": [
        { "item": "0x1110", "price": 1800 },
        { "item": "0x1220", "price": 2400 },
        { "item": "0x1330" },
        { "item": "0x2205", "price": 900 },
        { "item": "0x2206", "price": 900 },
        { "item": "0x2410", "price": 700 },
        { "item": "0x2605", "price": 1500 }
      ]
    }
  ]
}
```


## example.tea-house

### example.tea-house/messages/en.json

```json
{
  "hours": "The Tea House is open from 3 PM until 1 AM."
}
```

### example.tea-house/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.tea-house",
  "name": "Tea House",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "The flower shop becomes a tea house in the evening: its own greeting, its own hours, and fruit for tea on every table.",
  "scope": "world",
  "content": {
    "shops": "shops.json",
    "messages": "messages/en.json"
  },
  "assets_original": true
}
```

### example.tea-house/shops.json

```json
{
  "shops": [
    {
      "target": "flower",
      "name": "Tea House",
      "hours": { "open": "15:00", "close": "01:00" },
      "greeting": "Welcome to the Tea House! Every fruit here goes lovely with a cup. Take your time.",
      "stock_line": "Fresh fruit, all six kinds, on the tables by the walls. Point at one and I'll tell you the price.",
      "stock": [
        { "item": "0x2800", "price": 600 },
        { "item": "0x2801", "price": 600 },
        { "item": "0x2802", "price": 600 },
        { "item": "0x2803", "price": 600 },
        { "item": "0x2804", "price": 600 },
        { "item": "0x2807", "price": 800 }
      ]
    }
  ]
}
```


## example.village-gossip

### example.village-gossip/main.lua

```lua
-- Village Gossip: each villager shares one line of gossip a day, then says
-- their usual hello. A worked example of the mod script API.

local told = {}        -- villagers who have gossiped today, by id
local GOSSIP = 4       -- gossip1..gossip4 in messages/en.json

on("day_start", function(date)
  told = {}
  store.set("days", (store.get("days") or 0) + 1)
end)

on("talk", function(npc)
  if told[npc.id] then return nil end
  told[npc.id] = true

  -- If the Tea House mod is installed too, sometimes mention it.
  local tea = message("example.tea-house:hours")
  local t = game.time()
  if tea and (npc.id + t.day) % 3 == 0 then
    return npc.name .. " here! " .. tea .. " Pop in!"
  end

  local n = (npc.id + t.day) % GOSSIP + 1
  return message("gossip" .. n)
end)

log("ready")
```

### example.village-gossip/messages/en.json

```json
{
  "gossip1": "Psst! I heard someone in town has been picking every last flower. Not me, of course.",
  "gossip2": "Have you noticed the river sounds different in the evening? I swear it hums.",
  "gossip3": "Between you and me, I think the mailbox is getting lonely. Write someone a letter!",
  "gossip4": "I saw a shooting star last night. Well, I think it was a star."
}
```

### example.village-gossip/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.village-gossip",
  "name": "Village Gossip",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Once a day, each villager you talk to shares a bit of town gossip before their usual hello.",
  "scope": "client",
  "content": {
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["talk", "day_start"]
  },
  "assets_original": true
}
```


## example.wish-list

### example.wish-list/README.md

```
# Wish List

A script example: tiny daily quests.

Each day about two villagers in five make a wish: a seashell, a piece of fruit,
a bag of bells, a mushroom in November, or a fruit you have picked up before
(so nobody wishes for a fruit that does not grow in your town). The wish comes
from the date and the villager, so it is the same all day, after a restart too.

1. Talk to a villager. If they have a wish today, they tell you, once.
2. Pick the thing up from the ground (shake a tree, walk the beach, hit a rock).
3. Talk to them again. They thank you and count your **wish streak**: wishes
   granted in a row. Three, five, ten and every ten after that get their own line.
   A wish the day ends on breaks the streak, and the villager mentions it, kindly,
   next time they wish.

When a villager has something of the game's own to say (an errand, a complaint,
moving out, a pitfall), that talk belongs to the game: no mod hears it, so the
wish or the thank-you waits. Talk to them once more and it comes. Nothing is
lost: a granted wish counts for your streak the moment you pick the thing up.

## What it does not do

Mod handlers only return data: a script cannot give items, bells or friendship
points, or change anything in the town. The reward is the story and the streak.

A wish is granted when the item lands in your pockets or wallet (`item_picked`):
picked up, caught or dug up. Buying it does not count. Wishes stick to things
found around town (shells, fruit, bells, mushrooms). Dropping a shell and picking
it back up counts. The villagers are trusting folk.

## How it is built

- `main.lua` uses `talk`, `day_start` and `item_picked`.
- Special and event talks never call `talk` (see the scripts guide). A wish
  is only marked told, and a thank-you only marked given, inside a `talk` that
  returns the line, so a talk the game kept for itself loses nothing: the next
  ordinary talk says it.
- `talk` returns nil unless it has a wish to state or a thank-you to give, so
  with other talk mods installed it only takes the villagers it has news for
  (the first mod in load order with a line wins a talk).
- The wish is a hash of the date and `npc.id`. The day comes from `game.time()`,
  so it also changes past midnight and after a clock change; `day_start` alone
  would miss a save loaded on the day it was last played.
- `store` keeps today's wishes (so a restart does not repeat them), the fruits
  you have picked up, and each villager's `streak,total,missed`, for the 48
  villagers seen most recently. Under 2 KB of the 8 KB. Every `store.set` is
  wrapped in `pcall`: a refused write must not stop the script.
- The store is per browser, not per town.
- Under 2,000 instructions per event with 60 villagers, against a budget of 200,000.
- Lines are in `messages/en.json`, with `{name}`, `{wish}`, `{hint}` and `{streak}`
  filled in by the script.

It is tested in the real script sandbox against these exact files.
```

### example.wish-list/main.lua

```lua
-- Wish List: tiny daily quests.
--
-- Each day about two villagers in five make a wish, picked from the date and
-- the villager's id, so it is the same all day. The first talk states it. Pick
-- up a matching item and the next talk thanks you and counts a friendship
-- streak, kept in the store. A wish the day ends on breaks that streak.
--
-- Handlers only return data: nothing here changes the game. The reward is the
-- story and the streak. The talk handler returns nil unless it has something
-- to say, so other mods' villagers still get their turn.

local WISHERS, OF = 2, 5   -- WISHERS in OF villagers wish on a given day
local KEEP = 48            -- villagers' streaks kept; the least recent drop off

-- What can be wished for. Each kind is a set of item numbers that grant it.
-- Only things the player PICKS UP from the ground count: item_picked does not
-- fire for a bug or fish caught, or anything dug up or bought.
local KINDS = {
  shell = { lo = 0x2514, hi = 0x251B },   -- ITM_SHELL0..ITM_SHELL7
  bells = { lo = 0x2100, hi = 0x2103 },   -- bags of bells (ITM_MONEY_*)
  fruit = { set = { [0x2800] = 1, [0x2801] = 1, [0x2802] = 1, [0x2803] = 1, [0x2804] = 1, [0x2807] = 1 } },
  apple = { lo = 0x2800, hi = 0x2800 },
  cherry = { lo = 0x2801, hi = 0x2801 },
  pear = { lo = 0x2802, hi = 0x2802 },
  peach = { lo = 0x2803, hi = 0x2803 },
  orange = { lo = 0x2804, hi = 0x2804 },
  coconut = { lo = 0x2807, hi = 0x2807 },
  mushroom = { lo = 0x2805, hi = 0x2805 }, -- only in November, when they grow
}
-- One fruit is wished for by name only once the player has picked one up, so a
-- town is never asked for a fruit that does not grow there.
local FRUIT_BITS = { [0x2800] = "apple", [0x2801] = "cherry", [0x2802] = "pear", [0x2803] = "peach",
                     [0x2804] = "orange", [0x2807] = "coconut" }
local FRUIT_ORDER = { 0x2800, 0x2801, 0x2802, 0x2803, 0x2804, 0x2807 }

local function grants(kind, item)
  local k = KINDS[kind]
  if not k then return false end
  if k.set then return k.set[item] ~= nil end
  return item >= k.lo and item <= k.hi
end

-- ── the store, never allowed to stop the script ──
local function save(key, value)
  local ok, err = pcall(store.set, key, value)
  if not ok then log("not saved: " .. tostring(err)) end
end

-- ── today ──
local function key_of(y, m, d) return y * 10000 + m * 100 + d end
local function clock_key()
  local t = game.time()
  return key_of(t.year, t.month, t.day)
end

-- A stable number from the day and a villager (splitmix64's finish; Lua
-- integers wrap at 64 bits, which is what it wants).
local function mix(a, b)
  local h = a * 0x100000001B3 ~ b
  h = (h ~ (h >> 30)) * 0xBF58476D1CE4E5B9
  h = (h ~ (h >> 27)) * 0x94D049BB133111EB
  return (h ~ (h >> 31)) & 0x7fffffff
end

local day = 0         -- the day the entries below belong to
local clock = 0       -- the game clock's date last time we looked
local entries = {}    -- [villager id] = { w = kind, s = 1 stated / 2 granted / 3 thanked }
local order = {}      -- villager ids in the order their wishes were stated

local function save_day()
  local parts = {}
  for _, id in ipairs(order) do
    local e = entries[id]
    parts[#parts + 1] = id .. "=" .. e.w .. ":" .. e.s
  end
  save("day", day)
  save("open", table.concat(parts, ";"))
end

-- A villager's friendship record: "streak,total,missed".
local function record(id)
  local s, t, m = string.match(store.get("v" .. id) or "", "^(%d+),(%d+),(%d)$")
  return { streak = tonumber(s) or 0, total = tonumber(t) or 0, missed = m == "1" }
end

local function put_record(id, r)
  -- most recent first; past KEEP villagers the oldest record is dropped
  local ids = { tostring(id) }
  for v in string.gmatch(store.get("ids") or "", "%d+") do
    if v ~= ids[1] then
      if #ids < KEEP then ids[#ids + 1] = v else save("v" .. v, nil) end
    end
  end
  save("v" .. id, r.streak .. "," .. r.total .. "," .. (r.missed and "1" or "0"))
  save("ids", table.concat(ids, ","))
end

-- A new day: a wish stated and never granted breaks that villager's streak.
local function roll(to)
  if to == day then return end
  for _, id in ipairs(order) do
    if entries[id].s == 1 then
      local r = record(id)
      if r.streak > 0 then r.streak = 0; r.missed = true; put_record(id, r) end
    end
  end
  day, entries, order = to, {}, {}
  save_day()
end

local function today()
  local c = clock_key()
  if c ~= clock then clock = c; roll(c) end -- the clock passed midnight, or was changed
  return day
end

-- ── what a villager wishes for ──
local function wish_for(id, key)
  local h = mix(key, id)
  if h % OF >= WISHERS then return nil, h end
  local kinds = { "shell", "fruit", "bells" }
  local seen = store.get("fruit") or 0
  for i, item in ipairs(FRUIT_ORDER) do
    if seen & (1 << i) ~= 0 then kinds[#kinds + 1] = FRUIT_BITS[item] end
  end
  if (key // 100) % 100 == 11 then kinds[#kinds + 1] = "mushroom" end
  return kinds[(h >> 8) % #kinds + 1], h
end

-- ── lines ──
local function say(key, name, kind, streak)
  local text = message(key) or ""
  local wish = message("item." .. kind) or kind
  local hint = message("hint." .. kind) or ""
  text = string.gsub(text, "{(%a+)}", function(k)
    if k == "name" then return name end
    if k == "wish" then return wish end
    if k == "hint" then return hint end
    if k == "streak" then return tostring(streak or 0) end
  end)
  return (string.gsub(text, "%s+$", ""))
end

local function thanks_key(r, h)
  local s = r.streak
  if s == 3 or s == 5 or s == 10 then return "streak" .. s end
  if s >= 20 and s % 10 == 0 then return "streakbig" end
  if r.total == 1 then return "first" end
  if s == 1 then return "fresh" end -- a streak that broke and starts again
  return "thanks" .. ((h >> 16) % 4 + 1)
end

-- ── this town's wishes ──
-- `store` is kept per town and no town is loaded while this file first runs,
-- so today's wishes are read at the first event in a town, and again when the
-- player is in another town (store.town() changes).
local town = false
local function fresh()
  local t = store.town()
  if t == town then return end
  town = t
  day, entries, order = 0, {}, {}
  clock = clock_key()
  day = store.get("day") or 0
  for id, w, s in string.gmatch(store.get("open") or "", "(%d+)=(%a+):(%d)") do
    id = tonumber(id)
    if KINDS[w] and not entries[id] then
      entries[id] = { w = w, s = tonumber(s) }
      order[#order + 1] = id
    end
  end
  roll(clock)
end

-- ── handlers ──
on("day_start", function(date)
  fresh()
  roll(key_of(date.year, date.month, date.day))
end)

on("talk", function(npc)
  fresh()
  local key = today()
  local e = entries[npc.id]
  if not e then
    local kind, h = wish_for(npc.id, key)
    if not kind then return nil end
    entries[npc.id] = { w = kind, s = 1 }
    order[#order + 1] = npc.id
    save_day()
    log(npc.name .. " wishes for: " .. kind)
    local r = record(npc.id)
    if r.missed then
      r.missed = false
      put_record(npc.id, r)
      return say("again", npc.name, kind)
    end
    return say("wish" .. ((h >> 16) % 5 + 1), npc.name, kind)
  end
  if e.s ~= 2 then return nil end -- told already, or thanked already: let someone else talk
  e.s = 3
  save_day()
  local r = record(npc.id)
  return say(thanks_key(r, mix(key, npc.id)), npc.name, e.w, r.streak)
end)

on("item_picked", function(item)
  fresh()
  today()
  local bit
  for i, f in ipairs(FRUIT_ORDER) do if f == item then bit = 1 << i end end
  if bit then
    local seen = store.get("fruit") or 0
    if seen & bit == 0 then save("fruit", seen | bit) end
  end
  -- one item grants one wish: the earliest one told that it matches
  for _, id in ipairs(order) do
    local e = entries[id]
    if e.s == 1 and grants(e.w, item) then
      e.s = 2
      local r = record(id)
      r.streak, r.total = r.streak + 1, r.total + 1
      put_record(id, r)
      save_day()
      log("granted a wish (" .. e.w .. "), streak " .. r.streak)
      return
    end
  end
end)

log("ready")
```

### example.wish-list/messages/en.json

```json
{
  "wish1": "{name} here, and I have a tiny wish today. I'd love to see {wish}. {hint}",
  "wish2": "Can {name} tell you a secret? All day I've been daydreaming about {wish}. Silly, right? {hint}",
  "wish3": "Oh! {name} has a wish today: {wish}. Just picking one up would make my whole day. {hint}",
  "wish4": "Today's wish, from {name} to you: {wish}. No pressure. Okay, a little pressure. {hint}",
  "wish5": "If you spot {wish} out there, think of {name}. That's all I'm wishing for today! {hint}",
  "again": "{name} here. My last wish slipped away, but that's okay! Today I'm hoping for {wish}. {hint}",

  "item.shell": "a seashell",
  "item.fruit": "a piece of fruit",
  "item.apple": "a crisp apple",
  "item.cherry": "some cherries",
  "item.pear": "a juicy pear",
  "item.peach": "a sweet peach",
  "item.orange": "a bright orange",
  "item.coconut": "a coconut",
  "item.mushroom": "a mushroom",
  "item.bells": "a bag of bells",

  "hint.shell": "The beach always has a few.",
  "hint.fruit": "Any kind, straight off a tree!",
  "hint.apple": "Give a tree a good shake!",
  "hint.cherry": "Give a tree a good shake!",
  "hint.pear": "Give a tree a good shake!",
  "hint.peach": "Give a tree a good shake!",
  "hint.orange": "Give a tree a good shake!",
  "hint.coconut": "Palm trees keep them.",
  "hint.mushroom": "They hide under the trees this month.",
  "hint.bells": "Some rocks are luckier than others.",

  "thanks1": "You picked up {wish} and thought of {name}? I'm beaming! That's {streak} wishes in a row.",
  "thanks2": "You really listened! {name} owes you one. Our wish streak is at {streak} now.",
  "thanks3": "I heard you found {wish}. That counts, you know. {name}'s streak with you: {streak}!",
  "thanks4": "My wish came true, all thanks to you. {name} is keeping count: {streak} in a row.",
  "fresh": "You found {wish}! {name} is so glad. Our streak starts over at one, and that's fine by me.",
  "first":"You found {wish} for me! That's the first wish you've granted {name}. I won't forget it.",

  "streak3": "Three wishes in a row! {name} thinks this could be the start of something lovely.",
  "streak5": "Five in a row! {name} is telling everyone you're the best wish-granter in town.",
  "streak10": "Ten wishes in a row?! {name} is writing this in my diary, in very big letters.",
  "streakbig": "{streak} wishes in a row. {name} is starting to think you might be magic."
}
```

### example.wish-list/mod.json

```json
{
  "schema": 1,
  "api": 2,
  "id": "example.wish-list",
  "name": "Wish List",
  "version": "1.0.0",
  "authors": ["Play AC Online"],
  "description": "Tiny daily quests: a few villagers make a wish each day. Pick up what they wished for and they thank you and keep a friendship streak.",
  "scope": "client",
  "content": {
    "messages": "messages/en.json"
  },
  "scripts": {
    "main": "main.lua",
    "hooks": ["talk", "day_start", "item_picked"]
  },
  "assets_original": true
}
```
