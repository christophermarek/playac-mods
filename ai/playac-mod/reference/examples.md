# Example mods

Generated from the Play AC Online mod API spec and errors catalogue. Do not edit by hand. These are the site's own working example mods, file by file. Each is its own repository, with the mod at the top: clone it, or download the ZIP of its tag.

## example.springtime-town

Repository: https://github.com/Play-AC-Online/playac-example-springtime-town (tag v1.0.0)

### example.springtime-town/README.md

```
# Springtime Town

A Just you mod (`"scope": "client"`) in two halves, with no script:

- **The grass** (`textures/`): the town grass is our own drawing, seamless
  green ground with clover leaves and small white flowers.
- **The talk** (`talk.json`): new small talk in each villager's own
  personality's voice, some of it for the season, the time of day or the
  weather, and an evening goodbye after the topic.

Both are data. Neither changes what a visitor sees, so the mod is Just you.

## In the game

![before](media/before.webp)

Before: a corner of town on a September afternoon, with no mods and the HD texture pack.

![after](media/after.webp)

After: the same spot with Springtime Town installed. The grass is the mod's, drawn with clover and tiny white flowers; the trees, houses and paths are untouched.

![own hello](media/own-hello.webp)

Twiggy's own hello, then the menu after it. Choose "I'm bored!" to chat, and she picks a topic.

![mod line](media/mod-line.webp)

This time the topic is small talk, and her small talk is a line from the mod's peppy pool.

[![Play the film](media/film.webp)](media/film.mp4)

The film (click the picture): A walk past the houses on the mod's clover grass, then a chat with Twiggy: her hello, "I'm bored!", and a line from the mod as her small talk.

## The grass

The grass is one 128x128 uncompressed RGBA DDS picture, saved under every name
the game draws the grass with. The names say which in-game texture to replace,
and the pixels are our own.

The grass is six textures. The game draws each under several palettes, through
the seasons and the time of day. A file can name one texture and one palette:

    tex1_32x32_<texture>_<palette>_8.dds

Or it can put `$` in place of the palette, for that texture under any palette:

    tex1_32x32_<texture>_$_8.dds

Our grass is the same picture all year, so the mod has one `$` file per
texture. That is six files.

These three grass textures are drawn under nine palettes:

    textures: 626709d910129694 903adc6355e36f59 e96fecd242518c9f
    palettes: 193ca5974976e36e 20430b0042498b04 4f54e78515f0a185
              8910d24f6fbd5f83 8b8a1c2cacd60254 963dc45f18e13cf7
              b2e512f9c0fe88ad e7f9e59c09c5f9d0 f83e63a8b6cb47b7

And these three under three palettes:

    textures: 82f28ec4199a45be cfa57a6e6f966d11 e2ab673814e71af6
    palettes: 6d5ff5628ae85b42 ce63d23d746a058a d9eb32f9a8b17411

To change the grass for one stretch of the year or one time of day, add a file
named with that palette next to the `$` file. The file named for one palette
wins under that palette, and the `$` file still covers the rest.

With one file per palette, 36 files, the mod could change with every palette.
A `$` file is loaded once and shared, so it is the lighter choice when the
picture does not change.

The pictures were drawn by a small program, never copied from the game.

## The talk

Talk to a villager and choose to chat. After their hello they pick a topic,
the way they always do: a trade, a letter, a hint, or small talk. When they
pick small talk, the line can come from this mod.

`talk.json` holds line pools. Each personality has its own pool, and a few
more pools are kept to a moment: a normal villager has a line for spring, a
peppy one for the rain, a lazy one for the evening, a jock for winter, a
cranky one for the snow and a snooty one for a spring morning (`"season"`,
`"time"` and `"weather"`). A pool counts only at its moment, and among the
pools that count the game picks one line. A villager can say several of the
mod's lines in a day, and never the same one twice running.

A pool can instead name one villager (`"villager": "Bob"`), or nobody, which
means every villager, and can be said less often (`"chance": 30`; every time
it fits when left out). The most specific pools that fit a villager decide.

Every pool names its place in the talk. The small talk pools say
`"place": "topic"`: their lines stand in for the topic the villager picks
when you chat. The last pool says `"place": "after"`: on an evening chat,
half the time, any villager adds a line after their topic, as the talk's
last message. Its line is a list of two pages, each on a clean window. A
pool's place can also be `"before"` the hello, the `"hello"` itself or the
whole `"conversation"`.

No script is needed.

## Install

In Play AC Online, open the Mods tab. Springtime Town is in the mod list as an
official example: install it from there. Or download its ZIP from the
[cookbook](https://playaconline.com/modding/cookbook/) and add the file in the
Mods tab.

## Make your own

This repository is one mod, laid out the way the GitHub import wants it:
`mod.json` at the top, and a tag named for the version in `mod.json`.

1. Copy the repository to your own account.
2. Change `"id"` in `mod.json` to your own, like `yourname.springtime-town`.
   Ids that start with `example.` are kept for these examples, so the import
   refuses them.
3. Tag the commit with the version, like `v1.0.0`.
4. Push the commit and the tag. Then, in the game, open **Settings**, then
   **Mods**, and scroll to **Share a mod**. Sign in, answer the age question
   and accept the mod rules the first time, and type the code from your
   authenticator app. **Import from GitHub** shows under the upload form once
   the code is accepted. Paste `github.com/<you>/<repository>@v1.0.0` there
   and choose **Import**.

To keep only one half, delete the other half's files and its lines in
`mod.json`, and `playac-mod check` tells you if anything still points at them.

The modding guide is at [playaconline.com/modding](https://playaconline.com/modding/).

`media/` holds the pictures and the film the cookbook shows, with their
captions in `media/media.json`. `.playac/screenshots/` holds the listing's
screenshots.

What goes in the mod's ZIP is decided by the pack rule, the same for
`playac-mod pack` and the GitHub import:

- Left out: the pictures and the film (`.webp` and `.mp4` are not mod file
  types), the screenshots (`.playac` starts with a dot), `LICENSE` (it has no
  file type) and `CHANGELOG.md` (it is sent beside the ZIP as the listing's
  changelog).
- Kept: every other `.json`, `.lua`, `.dds`, `.png`, `.txt` and `.md` file.
  That includes this `README.md` and `media/media.json`. The game never reads
  either, because `mod.json` does not name them, and `playac-mod check` warns
  that nothing points at `media/media.json`.

## License

MIT, see [LICENSE](LICENSE).
```

### example.springtime-town/mod.json

```json
{
  "schema": 1,
  "api": 1,
  "id": "example.springtime-town",
  "name": "Springtime Town",
  "version": "1.0.0",
  "authors": [
    "Play AC Online"
  ],
  "description": "Town grass with clover and tiny white flowers, and new small talk from each villager in their own personality's voice, some of it for the season, the time of day or the weather. Textures and data only, no script.",
  "scope": "client",
  "content": {
    "textures": "textures/",
    "talk": "talk.json"
  },
  "assets_original": true
}
```

### example.springtime-town/talk.json

```json
{
  "pools": [
    {
      "place": "topic",
      "personality": "normal",
      "lines": [
        "I baked something this morning. The whole house smells like cinnamon now.",
        "Have you seen the flowers by the river? I could look at them all day.",
        "I wrote you a letter in my head. Maybe one day I'll put it on paper!"
      ]
    },
    {
      "place": "topic",
      "personality": "peppy",
      "lines": [
        "Guess what? Nothing happened today, and I'm SO excited about it!",
        "I practiced my dance moves all night. Want to see? Okay, maybe later!",
        "Today feels like a sparkly day. Do you feel sparkly too?"
      ]
    },
    {
      "place": "topic",
      "personality": "lazy",
      "lines": [
        "I was going to nap, but then I thought about snacks. Now I'm too busy.",
        "Do you ever just lie in the grass and count clouds? I got to three.",
        "Bugs are my friends. Well, the slow ones are."
      ]
    },
    {
      "place": "topic",
      "personality": "jock",
      "lines": [
        "I ran around the whole town twice before breakfast. Feel the burn!",
        "You look strong today. Have you been lifting rocks? Keep it up!",
        "Every step is a workout if you stomp hard enough!"
      ]
    },
    {
      "place": "topic",
      "personality": "cranky",
      "lines": [
        "Hmph. Kids these days don't even know how to sit on a bench properly.",
        "Back in my day the river was wetter. Don't ask me how.",
        "I'm not grumpy. I'm just thinking very loudly."
      ]
    },
    {
      "place": "topic",
      "personality": "snooty",
      "lines": [
        "Darling, your outfit is almost fashionable. Almost.",
        "I only drink tea from the finest cups. The chipped ones are for guests.",
        "One must always look one's best. Even for the fish."
      ]
    },
    {
      "place": "topic",
      "personality": "normal",
      "season": "spring",
      "lines": [
        "The cherry trees are out! I keep finding petals in my pockets."
      ]
    },
    {
      "place": "topic",
      "personality": "peppy",
      "weather": "rain",
      "lines": [
        "Rain boots ON! Every puddle in town is mine today!"
      ]
    },
    {
      "place": "topic",
      "personality": "lazy",
      "time": "evening",
      "lines": [
        "Evening already? I was just about to start my morning nap."
      ]
    },
    {
      "place": "topic",
      "personality": "jock",
      "season": "winter",
      "lines": [
        "Snow training! Run in it and your legs get twice as strong!"
      ]
    },
    {
      "place": "topic",
      "personality": "cranky",
      "weather": "snow",
      "lines": [
        "Snow. Again. My nose has been cold since breakfast."
      ]
    },
    {
      "place": "topic",
      "personality": "snooty",
      "season": "spring",
      "time": "morning",
      "lines": [
        "A spring morning, darling. Even the air is wearing perfume."
      ]
    },
    {
      "place": "after",
      "time": "evening",
      "chance": 50,
      "lines": [
        [
          "The sky is going all pink.",
          "Get home before the stars come out!"
        ]
      ]
    }
  ]
}
```

- `textures/`: 6 binary file(s), not shown

## example.after-hours

Repository: https://github.com/Play-AC-Online/playac-example-after-hours (tag v1.0.0)

### example.after-hours/README.md

```
# After Hours

A World mod (`"scope": "world"`) in two halves:

- **The shop** (`shops.json`): from 1 AM to 3 AM the town shop opens again,
  and all it sells is gyroids, a different few each night. Every other spot
  is empty.
- **The lantern** (`items.json`, `items/ghost-lantern/`): the Ghost Lantern,
  a tall lantern of the mod's own with its own pictures. Now and then it
  stands among the gyroids.

A shop changes the town, so the mod is a World mod.

## In the game

![door at night](media/door-at-night.webp)

1:20 AM in the rain: the town shop is lit and open, hours after it would usually shut.

![shop at night](media/shop-at-night.webp)

Inside at night every shelf is bare. The only goods are by the counter: tonight a Ghost Lantern and a gyroid.

![ghost lantern](media/ghost-lantern.webp)

The Ghost Lantern, the mod's own piece: a tall lantern with green glowing windows, a face in them, and moss down its stone. Only this lantern wears these pictures.

![shop by day](media/shop-by-day.webp)

The same shop at 10 AM: the day's own goods on every shelf. The mod changes nothing outside its hours.

[![Play the film](media/film.webp)](media/film.mp4)

The film (click the picture): Inside the shop at 1:20 AM with the mod: empty shelves, and by the counter only tonight's gyroid and the Ghost Lantern.

## The shop

`shops.json` changes one shop, Nook's store, by its id `"nook"`. Its block says
when it applies, what it does then, and its sixteen goods: fifteen gyroids and
the Ghost Lantern.

- `"when": { "hours": { "from": "01:00", "to": "03:00" } }`: the block applies
  only inside these hours.
- `"open": true`: while it applies the shop is open, even though it is shut at
  night.
- `"own_goods": false`: while it applies the mod's goods are the shop's whole
  stock. Each furniture spot holds one of them and every other spot is bare.
  Without it the goods would join the day's own instead.
- Outside the hours nothing changes. The shop keeps its own hours and its own
  goods, and the day's stock is still there when it opens in the morning.
- The shop has fewer furniture spots than sixteen goods, so it shows a few of
  them each night, and a different few the next night. The Ghost Lantern is
  one of the sixteen, so it is there only on some nights.
- A good may be an item of the same mod, named by its full id,
  `example.after-hours:ghost-lantern`. Without a `price` it takes the item's
  own price from `items.json`. The gyroids sell at the game's own price.
- Every shop takes the same fields with the same meaning. The same block works
  on the flower shop as `"flower"`.

## The lantern

`items.json` lists the new item. It has an `id`, a `name`, a `price`, a `base`
(the game's own piece it is built on, here the tall lantern) and `textures`,
a folder of pictures only this item draws.

- The pictures in `items/ghost-lantern/` are named like texture mod files,
  after the base's textures. Only the Ghost Lantern wears them: a tall lantern
  next to it keeps its own look. Four of the lantern's textures are replaced,
  the windows and the stone beside them, and the rest stay the base's.
- A gyroid cannot be a base, so the mod's own piece is a lantern.
- With the mod installed, the piece is the mod's item, with its own name.
- Remove the mod and the piece stays in the house as the plain base piece.
- Put the mod back and it is the mod's item again.

Other files name an item as `example.after-hours:ghost-lantern`: the mod id, a
colon, and the item id. Never change an item's id once players have it. To
rename one in a later version, map the old id to the new one with `"renames"`
in `mod.json`.

## Install

In Play AC Online, open the Mods tab. After Hours is in the mod list as an
official example: install it from there. Or download its ZIP from the
[cookbook](https://playaconline.com/modding/cookbook/) and add the file in the
Mods tab.

## Make your own

This repository is one mod, laid out the way the GitHub import wants it:
`mod.json` at the top, and a tag named for the version in `mod.json`.

1. Copy the repository to your own account.
2. Change `"id"` in `mod.json` to your own, like `yourname.after-hours`, and
   the full ids in `shops.json` with it. Ids that start with `example.` are
   kept for these examples, so the import refuses them.
3. Tag the commit with the version, like `v1.0.0`.
4. Push the commit and the tag. Then, in the game, open **Settings**, then
   **Mods**, and scroll to **Share a mod**. Sign in, answer the age question
   and accept the mod rules the first time, and type the code from your
   authenticator app. **Import from GitHub** shows under the upload form once
   the code is accepted. Paste `github.com/<you>/<repository>@v1.0.0` there
   and choose **Import**.

To keep only one half, delete the other half's files and its lines in
`mod.json`, and `playac-mod check` tells you if anything still points at them.

The modding guide is at [playaconline.com/modding](https://playaconline.com/modding/).

`media/` holds the pictures and the film the cookbook shows, with their
captions in `media/media.json`. `.playac/screenshots/` holds the listing's
screenshots.

What goes in the mod's ZIP is decided by the pack rule, the same for
`playac-mod pack` and the GitHub import:

- Left out: the pictures and the film (`.webp` and `.mp4` are not mod file
  types), the screenshots (`.playac` starts with a dot), `LICENSE` (it has no
  file type) and `CHANGELOG.md` (it is sent beside the ZIP as the listing's
  changelog).
- Kept: every other `.json`, `.lua`, `.dds`, `.png`, `.txt` and `.md` file.
  That includes this `README.md` and `media/media.json`. The game never reads
  either, because `mod.json` does not name them, and `playac-mod check` warns
  that nothing points at `media/media.json`.

## License

MIT, see [LICENSE](LICENSE).
```

### example.after-hours/items.json

```json
{
  "items": [
    { "id": "ghost-lantern", "name": "Ghost Lantern", "base": "0x122C", "price": 2600, "textures": "items/ghost-lantern/" }
  ]
}
```

### example.after-hours/mod.json

```json
{
  "schema": 1,
  "api": 1,
  "id": "example.after-hours",
  "name": "After Hours",
  "version": "1.0.0",
  "authors": [
    "Play AC Online"
  ],
  "description": "From 1 AM to 3 AM the town shop opens again, and all it sells is gyroids. A different few stand on the floor each night, and among them, now and then, a Ghost Lantern of the mod's own, its windows glowing green. Every other spot is empty. The rest of the day the shop is its usual self. Remove the mod and a Ghost Lantern you bought stays in your house as the plain tall lantern it is built on.",
  "scope": "world",
  "content": {
    "items": "items.json",
    "shops": "shops.json"
  },
  "assets_original": true
}
```

### example.after-hours/shops.json

```json
{
  "shops": {
    "nook": {
      "when": { "hours": { "from": "01:00", "to": "03:00" } },
      "open": true,
      "own_goods": false,
      "goods": [
        { "item": "example.after-hours:ghost-lantern" },
        { "item": "0x1768" },
        { "item": "0x1738" },
        { "item": "0x16E4" },
        { "item": "0x1780" },
        { "item": "0x15BC" },
        { "item": "0x15E0" },
        { "item": "0x16C0" },
        { "item": "0x16CC" },
        { "item": "0x16FC" },
        { "item": "0x16F0" },
        { "item": "0x16B0" },
        { "item": "0x1728" },
        { "item": "0x1744" },
        { "item": "0x1774" },
        { "item": "0x1798" }
      ]
    }
  }
}
```

- `items/ghost-lantern/`: 4 binary file(s), not shown

## example.harvest-post

Repository: https://github.com/Play-AC-Online/playac-example-harvest-post (tag v1.0.0)

### example.harvest-post/README.md

```
# Harvest Post

A World mod (`"scope": "world"`) in two halves:

- **The calendar** (`calendar.json`, `letters.json`, `talk.json`): two days of our own.
  The Harvest Fair is the third Wednesday of September and Apple Day is
  October 21. A notice goes up on the bulletin board and villagers talk about
  it all day.
- **The post** (`main.lua`, `messages/en.json`): once a game day, a script
  mails you a letter with a little present. On fair day it runs a fruit
  contest with a 100 Bell entry fee. A worked example of mod commands, a
  question, a setting, a timer and a function other mods can call.

A board notice changes the town, so the whole mod is a World mod. It still
does not count for a friend visit: only a World mod with textures, shops or
items does, so two friends need not both have it. The board notice goes up in
the player's own town only. The script half alone would run in a Just you mod
too.

## In the game

![board](media/board.webp)

On the third Wednesday of September the town bulletin board carries the mod's notice, dated by the game.

![fair line](media/fair-line.webp)

All day, villagers open with a line about the fair from the mod's talk.json, then carry on in their own words.

![at the mailbox](media/at-the-mailbox.webp)

The day's first visit to town: the mod's script has already mailed today's letter, so there is mail waiting at the house.

![the letter](media/the-letter.webp)

The letter is the mod's own text, from its messages file, sent with the send_letter command from "A friend", with a little present attached.

[![Play the film](media/film.webp)](media/film.mp4)

The film (click the picture): The Harvest Fair notice on the bulletin board and Twiggy talking about the fair before her usual chat, then a walk to the mailbox to take out the day's letter and read it.

## The calendar

- It adds two calendar days. The Harvest Fair is the third Wednesday of
  September (`week` 3, `weekday` 3). Apple Day is October 21 (`day`).
- On each day a notice goes up on the town bulletin board. It is posted once,
  in the player's own town only.
- `talk.json` has a pool for each day: `"day"` names the calendar day by its
  `id`, and `"place": "before"` puts the line before the villager's hello.
  Every pool names its place; the others are the hello itself, the topic
  after a chat answer, a line after the topic, and the whole conversation.
- `letters.json` holds two letter templates. The player's name goes where
  `{player}` is, and an apple comes with each.
- `fair-thanks` is mailed by the script, with
  `cmd.send_letter{ template = "fair-thanks" }`, once a player pays to enter
  the fruit contest. Another mod's command would name it
  `example.harvest-post:fair-thanks`.
- `apple-day` is mailed by the calendar, with no script: the Apple Day entry
  in `calendar.json` says `"letter": "apple-day"`. It goes out once on the day,
  the first time the player is free in their own town, and it counts against
  the mod's 3 letters a day.
- The thank-you signs "The Fair Committee". The mailbox list has room for 8
  characters, so `sender` names it "The Fair" there.

Letter and notice text is plain ASCII and must fit six lines of the paper. The
game measures it in its own font and refuses text that does not fit.

## The post: commands

An event handler never changes the game itself. It queues a command, and the
game applies it at the end of a frame's update, once the player is free.

- `cmd.send_letter{ text = ..., item = ..., from = ... }` queues the letter.
  It returns the command's id, or `nil`, a message and a code when the game
  refuses it now. The text and the sender come from `messages/en.json`, read
  with `message("letter")` and `message("from")`.
- `"permissions": ["send_letter"]` in `mod.json` names the command. A
  command the mod does not name is refused.
- `command_finished` says what happened to it: `e.ok`, `e.via`
  (`mailbox`, or `post_office` when the mailbox was full), or `e.code` and
  `e.message` for a refusal.
- The game's cap is 3 letters a day from one mod, per town. The refusal's code
  is `command-day-cap`.

## The post: a setting

`mod.json` declares one setting, `present`, a `choice` of `fruit` or `none`.
The player sets it on the Mods tab, and `settings.get("present")` reads it.
With `none` the daily letter comes with no present.

- A setting has no `scope`, so it is `world`, the default: the value is part
  of the town. A friend visit compares it, and a visitor lent the mod runs the
  host's value.
- A World setting may decide what the town gets, so the letter command after
  it is allowed. A `"scope": "client"` setting is each player's own, and in a
  handler that read one the game refuses `send_letter`, `give_item`,
  `take_item` and `take_bells` with `command-client-setting`. The script kit
  shows a client setting.

## The fruit contest: a question and a take

On the Harvest Fair, the first time a resident enters the town, the script
asks them to enter the fruit contest.

- `cmd.ask{ text = message("contest"), choices = { "Apple", "Pear", "Not today" } }`
  puts the question in the player's thought window. It has 2 to 4 answers of
  up to 16 characters.
- `question_answered` brings back `e.id` (what `cmd.ask` returned),
  `e.choice` (counting from 1) and `e.text`. Both are `nil` when the window
  closed with no pick.
- For Apple or Pear, `cmd.take_bells{ amount = 100 }` asks for the fee. The
  game shows its own question, which names the amount and the mod, and the
  player says yes or no there. The script cannot change those words.
- `command_finished` with `e.command == "take_bells"` says how it went:
  `e.via` is `"taken"` on yes, and `e.code` is `command-declined` on no, or
  `command-not-held` when the wallet holds less than 100 Bells.
- Once the fee is taken the script mails `fair-thanks`.
- A take is refused on a visit, so the contest is asked only at home:
  `store.town()` starts with `"v:"` away from home.

## The fair at 6 PM: hour_changed and show_line

`hour_changed` fires on the game's own hourly update, with `e.hour` from 0 to
23. At 18 on fair day the script runs `cmd.show_line(message("packing_up"))`,
which puts a line in the player's thought window once they are free.

`game.calendar_today()` tells the script which of its calendar days fall today.
It lists this mod's own days only, by their `id` in `calendar.json`.

## A function other mods can call

`remote.add("fair_today", ...)` offers a function to other mods while the
script loads. `"exports"` in `mod.json` lists it, with one line that says what
it returns, and the game then lets the script offer only the names listed.

Another mod names Harvest Post in `"optional_depends"` and calls it:

```lua
if remote.version("example.harvest-post") and remote.has("example.harvest-post", "fair_today") then
  local fair = remote.call("example.harvest-post", "fair_today")
end
```

The script kit in the modding guide does exactly that.

## The post: timers

A letter the game could not take now (both boxes full, or the player away from
home) is tried again half a game hour later.

- `timer.after(30, "retry", p.id)` counts game minutes. The timer is kept with
  the town's data, so it still fires after a save and a reload.
- `timer_fired` brings back the name and the data: here, whose letter it was.
- `timer.cancel(id)` cancels a waiting timer. When the letter gets through on
  the next scene first, the script cancels the retry.

## The post: saved data

- `store.player` remembers the day's letter, so each resident of the town gets
  their own.
- The town's `store` keeps the mark that a retry timer is waiting, under the
  resident's id. The timer may fire while another resident plays, and only the
  town's store can be cleared then.
- `rng()` counts the numbers the mod drew in this town today and keeps that
  count with the town, so reloading the game cannot reroll the present.

## The post: events

`day_started` sends the day's letter. `scene_entered` tries too, since a game
loaded on a day it already saw does not run `day_started` again.

`command_finished` comes for every command, the line and the question too
(`e.via` is `"shown"` for those), so the script reads `e.command` first.

`letter_read` fires when the player reads a letter. `e.letter` is
`"example.harvest-post:fair-thanks"` or `"example.harvest-post:apple-day"` for
this mod's templates, and `nil` for a letter sent as plain `text`.

## Install

In Play AC Online, open the Mods tab. Harvest Post is in the mod list as an
official example: install it from there. Or download its ZIP from the
[cookbook](https://playaconline.com/modding/cookbook/) and add the file in the
Mods tab.

## Make your own

This repository is one mod, laid out the way the GitHub import wants it:
`mod.json` at the top, and a tag named for the version in `mod.json`.

1. Copy the repository to your own account.
2. Change `"id"` in `mod.json` to your own, like `yourname.harvest-post`.
   Ids that start with `example.` are kept for these examples, so the import
   refuses them.
3. Tag the commit with the version, like `v1.0.0`.
4. Push the commit and the tag. Then, in the game, open **Settings**, then
   **Mods**, and scroll to **Share a mod**. Sign in, answer the age question
   and accept the mod rules the first time, and type the code from your
   authenticator app. **Import from GitHub** shows under the upload form once
   the code is accepted. Paste `github.com/<you>/<repository>@v1.0.0` there
   and choose **Import**.

To keep only one half, delete the other half's files and its lines in
`mod.json`, and `playac-mod check` tells you if anything still points at them.

The modding guide is at [playaconline.com/modding](https://playaconline.com/modding/).

`media/` holds the pictures and the film the cookbook shows, with their
captions in `media/media.json`. `.playac/screenshots/` holds the listing's
screenshots.

What goes in the mod's ZIP is decided by the pack rule, the same for
`playac-mod pack` and the GitHub import:

- Left out: the pictures and the film (`.webp` and `.mp4` are not mod file
  types), the screenshots (`.playac` starts with a dot), `LICENSE` (it has no
  file type) and `CHANGELOG.md` (it is sent beside the ZIP as the listing's
  changelog).
- Kept: every other `.json`, `.lua`, `.dds`, `.png`, `.txt` and `.md` file.
  That includes this `README.md` and `media/media.json`. The game never reads
  either, because `mod.json` does not name them, and `playac-mod check` warns
  that nothing points at `media/media.json`.

## License

MIT, see [LICENSE](LICENSE).
```

### example.harvest-post/calendar.json

```json
{
  "days": [
    {
      "id": "harvest-fair",
      "date": { "month": 9, "week": 3, "weekday": 3 },
      "board": "HARVEST FAIR TODAY!\nBring your best fruit and\nshow it to your neighbours.\nThe biggest apple wins\nbragging rights for a year."
    },
    {
      "id": "apple-day",
      "date": { "month": 10, "day": 21 },
      "board": "APPLE DAY\nShare an apple with a friend\ntoday. Any apple will do,\nbut a red one says it best.",
      "letter": "apple-day"
    }
  ]
}
```

### example.harvest-post/letters.json

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
    },
    {
      "id": "apple-day",
      "header": "Dear {player},",
      "body": "Happy Apple Day! Here is an\napple to share with a friend.\nOr plant it, and share the\ntree for years to come.",
      "footer": "The Harvest Post",
      "sender": "Harvest",
      "item": "0x2800",
      "paper": 12
    }
  ]
}
```

### example.harvest-post/main.lua

```lua
-- Harvest Post, the script half. Four small pieces in one file:
--
--   1. The post: once a game day, a letter with a little present arrives in
--      the mailbox. A setting decides the present. A timer tries again later.
--   2. The fruit contest, on fair day only: a question (cmd.ask), an entry
--      fee (cmd.take_bells) and a thank-you letter from letters.json.
--   3. A line at 6 PM on fair day (hour_changed, cmd.show_line).
--   4. A function other mods can call (remote.add, mod.json "exports").
--
-- An event handler never changes the game itself. It QUEUES a command, and the
-- game applies it at the end of a frame's update, once the player is free.
-- mod.json must name each command in "permissions". command_finished then
-- says how each one went, whatever kind it was.
--
-- The game's cap is per town, not per player: 3 letters a day from one mod,
-- so in a town of four the fourth resident to play that day gets none.

local MOD = "example.harvest-post"
local FAIR = "harvest-fair" -- a day's id in calendar.json
local ENTRY_FEE = 100

-- Fruit: always a fine present (the shop's item rules refuse money, turnips,
-- tickets, grab bags, fossils and reserve ids).
local GIFTS = { 0x2800, 0x2801, 0x2802, 0x2803, 0x2804 }

-- The game day as one number, 20261112, or nil before a town is loaded.
local function today()
  local t = game.town()
  if not t then return nil end
  return t.year * 10000 + t.month * 100 + t.day
end

-- Is one of this mod's calendar days today? game.calendar_today() lists the
-- ids of this mod's own days that fall on the town's date, and only its own.
local function is_today(day_id)
  for _, id in ipairs(game.calendar_today()) do
    if id == day_id then return true end
  end
  return false
end

-- store.town() names the town the store is for. It starts with "v:" away from
-- home, on a friend's town, where a take is refused.
local function at_home()
  local town = store.town()
  return town ~= nil and town:sub(1, 2) ~= "v:"
end

-- ── 4. A function for other mods ────────────────────────────────────────────
-- remote.add offers it while the script loads. mod.json "exports" lists the
-- names a mod offers, each with a line that says what it returns. Another mod
-- names this one in "optional_depends" and asks with remote.call.
remote.add("fair_today", function()
  return is_today(FAIR)
end)

-- ── 1. The post ─────────────────────────────────────────────────────────────

-- "present" is a setting from mod.json, set by the player on the Mods tab.
-- It is a World setting (the default scope), so it is part of the town: a
-- visitor lent this mod runs the host's choice. A World setting may decide
-- what the town gets, so the letter command below is allowed after it.
local function present()
  if settings.get("present") == "none" then return nil end
  -- rng() counts the numbers this mod has drawn in this town today and keeps
  -- that count with the town, so a reload carries on from it: reloading the
  -- game cannot reroll the present.
  return GIFTS[rng(#GIFTS)]
end

local function send_today()
  local day = today()
  if not day or store.player.get("sent") == day then return end
  local gift = present()
  local id, why, code = cmd.send_letter{ text = message("letter"), item = gift, from = message("from") }
  if id then
    store.player.set("sent", day)
    log("letter #" .. id .. " queued" .. (gift and string.format(" with item 0x%04X", gift) or ", no present"))
  else
    log("no letter today: " .. why .. " (" .. code .. ")")
    -- The town's letters for today are used up: do not ask again until tomorrow.
    if code == "command-day-cap" then store.player.set("sent", day) end
  end
end

-- Try again later. timer.after counts GAME minutes and keeps the timer with
-- this town's data, so it still fires after a save and a reload. One timer per
-- resident is enough: a second refusal finds the first still waiting. The name
-- comes back in timer_fired, and the data says whose letter it was.
--
-- The timer's id is kept in the town's store under the resident's id, not in
-- store.player. The timer may fire while another resident plays, and only the
-- town's store can be cleared then.
local RETRY_MINUTES = 30
local function retry_key(id) return "retry:" .. tostring(id) end
local function retry_later()
  local p = game.player()
  if not p or store.get(retry_key(p.id)) then return end
  local id, why, code = timer.after(RETRY_MINUTES, "retry", p.id)
  if id then
    store.set(retry_key(p.id), id)
  else
    log("no retry timer: " .. why .. " (" .. code .. ")")
  end
end

-- The letter got through some other way first: the waiting timer is not
-- needed now. timer.cancel answers true when there was one to cancel.
local function cancel_retry()
  local p = game.player()
  if not p then return end
  local timer_id = store.get(retry_key(p.id))
  if timer_id then
    log("retry timer cancelled: " .. tostring(timer.cancel(timer_id)))
    store.set(retry_key(p.id), nil)
  end
end

-- ── 2. The fruit contest ────────────────────────────────────────────────────

local ask_id = nil   -- the contest question, while it is out
local thanks = {}    -- command ids of thank-you letters, so their results are not the post's

-- cmd.ask puts a question with 2 to 4 answers in the player's thought window.
-- The pick comes back in question_answered. Asked once per fair day per
-- resident, in their own town.
local function invite()
  local day = today()
  if not day or ask_id or not at_home() or not is_today(FAIR) then return end
  if store.player.get("contest") == day then return end
  local id, why, code = cmd.ask{ text = message("contest"), choices = { "Apple", "Pear", "Not today" } }
  if id then
    ask_id = id
    store.player.set("contest", day) -- asked today, whatever the answer
  else
    log("no contest question: " .. why .. " (" .. code .. ")")
  end
end

-- e.choice counts from 1 and e.text is the answer. Both are nil when the
-- player closed the window with no pick.
on("question_answered", function(e)
  if e.id ~= ask_id then return end
  ask_id = nil
  if e.choice == nil or e.choice == 3 then
    log("contest: not entered")
    return
  end
  -- take_bells shows the game's own question, which names the amount and this
  -- mod, so the player always sees what they pay. Its one result comes back in
  -- command_finished: via "taken", or command-declined for a no.
  local id, why, code = cmd.take_bells{ amount = ENTRY_FEE }
  if id then
    store.player.set("fruit", e.text)
  else
    log("contest: no entry fee asked: " .. why .. " (" .. code .. ")")
  end
end)

-- ── 3. A line at 6 PM on fair day ───────────────────────────────────────────

-- hour_changed fires on the game's own hourly update. cmd.show_line puts a
-- line in the player's thought window once the player is free.
on("hour_changed", function(e)
  if e.hour ~= 18 or not is_today(FAIR) then return end
  local id, why, code = cmd.show_line(message("packing_up"))
  if not id then log("no packing-up line: " .. why .. " (" .. code .. ")") end
end)

-- ── Events ──────────────────────────────────────────────────────────────────

-- A new day, and the first scene of each session (a game loaded on a day it
-- already saw does not run day_started again).
on("day_started", send_today)
on("scene_entered", function(e)
  send_today()
  if e.name == "town" then invite() end
end)

-- What happened to each command. e.command names its kind. e.via says how it
-- was applied ("mailbox" or "post_office" for a letter, "taken" for a take,
-- "shown" for a line or a question). A refusal has e.code (stable, for the
-- script) and e.message (for the log).
on("command_finished", function(e)
  if e.command == "take_bells" then
    if e.ok then
      log("contest: entered with " .. tostring(store.player.get("fruit")) .. ", " .. ENTRY_FEE .. " Bells paid")
      -- the letters.json template: header, body, sign-off, present and paper
      local id, why, code = cmd.send_letter{ template = "fair-thanks" }
      if id then thanks[id] = true else log("no thank-you letter: " .. why .. " (" .. code .. ")") end
    else
      -- command-declined: the player said no. command-not-held: the wallet
      -- holds less than the fee. Nothing was taken either way.
      log("contest: no entry (" .. e.code .. ")")
    end
    return
  end
  if e.command ~= "send_letter" then return end -- the line and the question report "shown"
  if thanks[e.id] then
    thanks[e.id] = nil
    log("thank-you letter " .. (e.ok and ("delivered via " .. e.via) or ("not delivered: " .. e.message)))
    return
  end
  if e.ok then
    log("letter #" .. e.id .. " delivered via " .. e.via)
    cancel_retry()
  elseif e.code == "command-day-cap" then
    log("letter #" .. e.id .. " not delivered: " .. e.message)
  else
    -- Refused for now (in The City, visiting a friend, both boxes full): the
    -- day's letter is owed again. The next scene tries, and so does a timer
    -- half a game hour from now, for a player who stays where they are.
    -- Away from home, store and timers live in memory only. A result that
    -- arrives there clears "sent" in that copy, not at home, so the letter is
    -- not owed again today. Tomorrow's comes as usual.
    log("letter #" .. e.id .. " not delivered: " .. e.message)
    store.player.set("sent", nil)
    retry_later()
  end
end)

-- The timer is gone once it fires, so its mark goes too, whoever is playing.
-- Send only to the resident it was set for: another resident may be playing by
-- now, and has a letter of their own.
on("timer_fired", function(e)
  if e.name ~= "retry" then return end
  store.set(retry_key(e.data), nil)
  local p = game.player()
  if p and p.id == e.data then send_today() end
end)

-- The player read a letter. e.letter names a letters.json letter as
-- "<mod id>:<letter id>" when a mod mailed it: the contest's thank-you, or
-- Apple Day's, which calendar.json mails with no script at all.
on("letter_read", function(e)
  if e.first_time and e.letter and e.letter:sub(1, #MOD + 1) == MOD .. ":" then
    log("read " .. e.letter)
  end
end)
```

### example.harvest-post/messages/en.json

```json
{
  "letter": "Good morning! Here is a little something to start your day. Have a lovely time in town, and come back tomorrow for another!",
  "from": "A friend",
  "contest": "The fruit contest is on! It costs 100 Bells to enter. Which fruit will you show?",
  "packing_up": "The Harvest Fair is packing up for the year. See you next September!"
}
```

### example.harvest-post/mod.json

```json
{
  "schema": 1,
  "api": 1,
  "id": "example.harvest-post",
  "name": "Harvest Post",
  "version": "1.0.0",
  "authors": [
    "Play AC Online"
  ],
  "description": "Two calendar days of our own, the Harvest Fair and Apple Day, with a notice on the bulletin board, villagers talking about it all day and a letter on Apple Day. On fair day you can enter the fruit contest for 100 Bells and get a thank-you letter. And once a game day, a script mails you a letter with a little present: a worked example of mod commands, a question, a setting and a timer.",
  "scope": "world",
  "content": {
    "calendar": "calendar.json",
    "letters": "letters.json",
    "messages": "messages/en.json",
    "talk": "talk.json"
  },
  "scripts": {
    "main": "main.lua",
    "events": [
      "day_started",
      "scene_entered",
      "hour_changed",
      "question_answered",
      "command_finished",
      "timer_fired",
      "letter_read"
    ]
  },
  "permissions": [
    "send_letter",
    "show_line",
    "ask",
    "take_bells"
  ],
  "exports": {
    "fair_today": "true when today is the Harvest Fair in this town, else false."
  },
  "settings": [
    {
      "name": "present",
      "type": "choice",
      "label": "Present in the daily letter",
      "description": "Fruit puts a piece of fruit in each day's letter. None sends the letter alone.",
      "choices": ["fruit", "none"],
      "default": "fruit"
    }
  ],
  "assets_original": true
}
```

### example.harvest-post/talk.json

```json
{
  "pools": [
    {
      "place": "before",
      "day": "harvest-fair",
      "lines": [
        "It's the Harvest Fair! I've been polishing my pears since sunrise.",
        "Harvest Fair day! Did you bring any fruit? Mine is the shiniest, I checked.",
        "The fair smells like apples and wood smoke. Best day of the season!"
      ]
    },
    {
      "place": "before",
      "day": "apple-day",
      "lines": [
        "Happy Apple Day! Have you shared an apple with anyone yet?",
        "An apple a day, they say. Today it's an apple for everyone!"
      ]
    }
  ]
}
```
