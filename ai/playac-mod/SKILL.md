---
name: playac-mod
description: Make, test, fix and publish mods for Play AC Online (playaconline.com), the browser town life game. Covers texture mods (tex1_*.dds or .png), villager lines (messages/*.json, talk pools), shops (shops.json, each shop by its id: Nook's, the flower shop, Crazy Redd and the rest), new furniture (items.json), letters and calendar days, Lua 5.4 scripts (main.lua with on("villager_talked"...)) and their commands (cmd.send_letter, cmd.give_item...), mod.json, settings, dependencies, the Mods tab, the playac-mod CLI, sharing a mod for review, and every error message with its fix. Use whenever the user wants to make or change a Play AC Online mod, pastes an error from the Mods tab or the mod list, asks what a mod can do, or edits mod.json, shops.json, a messages file or a mod script. Triggers on "Play AC mod", "playaconline mod", "make a mod", "mod.json", "shops.json", "tex1_", "Mods tab", "playac-mod", "moddev", "my mod won't load", "share my mod".
---

# Making a Play AC Online mod

You are helping someone make a mod for Play AC Online, a town life game that
runs in the browser at playaconline.com. They do NOT have the game's source
code and neither do you. Everything you need is in this file and in
`reference/`:

- `reference/api.md`: every mod.json key, file format, Lua function, event and limit.
- `reference/errors.md`: every error message a mod can get, with its code, meaning and fix.
- `reference/examples.md`: the site's complete working example mods, file by file.
- `reference/items.md`: item ids each shop can stock, with names, prices and price floors.

Never invent API. If something is not in `reference/api.md`, the game does not
have it: say so plainly and offer what IS possible. Online, the same docs are at
https://playaconline.com/modding/ (errors: https://playaconline.com/modding/errors/).

<!-- BEGIN generated facts: from the mod API spec, do not edit by hand -->
## Facts from the API spec (generated)

- The game reads mod api level 1. Every mod.json says `"api": 1`; without it the mod is refused.
- Level 1 (2026-11-16): The first level. Content is textures (a file may carry a readable label before its name), lines (a messages file), shops (each by its id in the shop table, from Nook's store and the flower shop to Katrina's tent, one block shape for every shop, each block applying while its when holds), new furniture on a vanilla base with pictures of its own (an items file, renames), letter templates, calendar days and villager line pools. Scripts get the events in the events list, each handed one table. They also get log, message, the game queries, a store per town with a part per player and one per browser, settings, remote calls between mods, a seeded rng and timers on the game clock. Eight commands are declared in permissions: six (cmd.send_letter, give_item, show_line, ask, take_item, take_bells) are applied at the end of a frame's update, and two (cmd.set_shop_goods, set_shop_open) are set at the call. Mods also have depends and conflicts with version ranges, and data_version with the data_migrated event. Mods can name optional_depends, and a setting can be world or client.
- Versioning: A level is read for at least 12 months after the next level ships. A deprecated name keeps working for at least two more levels and at least 90 days, whichever is later.
- mod.json keys: `$schema`, `schema`, `api`, `id`, `name`, `version`, `authors`, `description`, `tags`, `scope`, `content`, `scripts`, `permissions`, `exports`, `assets_original`, `renames`, `depends`, `optional_depends`, `conflicts`, `data_version`, `settings`. Reserved and refused: `game`, `save`. Any other key is refused (`unknown-key`), in mod.json, at the top of each content file and in each entry; the message names the closest known key.
- `content` keys: `textures`, `messages`, `shops`, `items`, `letters`, `calendar`, `talk`.

Events (17; list each one a script uses in `scripts.events`; every handler gets ONE table `e`, and a field marked `?` may be nil):

- `villager_talked` e = { villager { id, name, species?, personality? } }, returns table|nil: The player starts an ordinary talk with a villager. Return where your words go in it: nil to stay quiet, a talk table { place, line, topics, ask }, or a list of talk tables, one a place. Every line names its place: a plain string is refused and logged, with nothing said. place is "before" (ahead of the hello), "hello" (instead of an everyday hello; a hello with news is kept), "topic" (instead of the topic the game picks when the player chats, if it is one of topics, small_talk when you name none, "any" for all), "after" (after the topic, before a chat ends) or "conversation" (the whole talk: no hello, no menu, no topic). line is a page of 1 to 400 bytes or a list of 1 to 8 pages. ask = { text, choices } (2 to 4 answers) goes only with "conversation": its last page asks the question, and the player's pick goes to villager_answered. Every mod's handler is called, in load order. The first line returned for a place takes it; a later one for that place is logged and not said. A conversation needs every place free and ends the event. Lines are said only when that part of the talk comes: topic and after only when the player chats. A table that is not right is logged and nothing of it is said. Special talks never reach mods. These are a first meeting, a villager moving out, one with an errand, delivery or contest going with you, a complaint, a pitfall or a bee chase, an islander, Kamakura and summer camp. No handler is called for a special talk. The villager's next ordinary talk calls it as usual, so a line a script is keeping for "the next talk" waits for that one.
- `day_started` e = { year, month, day, weekday }: A new day begins in the game. It fires once per day, also when the game starts on a new day. It does not fire again when the game restarts later on a day the town already saw, because the save holds the day it last began. If the game was not saved since that day began, the save still holds the day before, so the next start fires it again. Count days by storing the last date you saw, not by counting calls. Its handler sees the whole day, the first day of a session included: game.calendar_today() lists today's calendar days, game.town() has the date, and game.player() and store.player have the player. A command queued here is applied once the player is free in the town.
- `item_picked_up` e = { item, mod_item? }: The player got an item. They picked it up, outdoors or off a room's floor, caught it with the net or the rod, or dug it up with the shovel. It fires once the item is in their pockets, or in the wallet for Bells. It does not fire for anything bought. A fish or a bug that goes into the pockets fires this event and then fish_caught or bug_caught, so a script that counts both counts that catch twice. It does not fire when the pockets were full. Outdoors the game then offers to swap the item for one in the pockets, and no event is sent whatever the player chooses. Indoors a full pocket refuses the pickup.
- `scene_entered` e = { scene, name? }: A scene starts, such as the town, a house or a shop. Not in the title demo, at player select or in the intro (the rule own_game_only).
- `data_migrated` e = { from, to }: Fires once per town, when mod.json "data_version" differs from the version the town's data was written at. It runs as the town loads, before any other event's handlers run in that town. from is 0 for data from before data_version. If the handler errors, the script stops and the version stays, so the next start tries again. Migrations run in load order. A remote.call from a data_migrated handler into a mod whose own data_migrated has not run in that town yet is refused. Needs data_version.
- `hour_changed` e = { year, month, day, hour }: The game's clock reached a new hour. This is the game's own hourly update, midnight included.
- `item_bought` e = { item, mod_item?, price, shop, ordered }: The player bought a good for Bells at any counter in the game. It fires as the seller takes the price. shop says which counter: "nook" (Nook's in every size, The City's Nookington's too), "flower" (the flower shop), "redd" (Crazy Redd), "saharah" (her carpet, swapped for one of yours and Bells), "joan" (turnips), "fireworks" (the fireworks show's stall), "shrine" (the New Year fortune slip), "gyroid" (what another player put up at their gyroid) or "villager" (a villager selling you something). Test e.shop == "nook" to keep to Nook's. price is the Bells paid. ordered is true for a Nook's catalog order, which is paid now and mailed tomorrow, so it is not in the pockets yet. Only Nook's and the flower shop sell mod items. A visitor buying in a friend's town gets a plain piece, so mod_item is nil there. Paid services that hand over no good are not purchases and do not fire it. These are the barber, Katrina, the Dream Suite and an Able Sisters design.
- `item_sold` e = { item, mod_item?, count, bells, shop }: The player sold for Bells. It fires once the wallet is credited. shop says to whom: "nook" (Nook's in every size, The City's Nookington's too) or "villager" (a villager buying something from your pockets). Nobody else in the game buys. item is the first good, count is how many went and bells is what they fetched. mod_item is the first good's full id when it is a mod item. What another player buys at your gyroid does not fire it. The gyroid hands you the takings later as one sum, with no record of what sold.
- `fish_caught` e = { item, pocketed }: A fish was landed. pocketed says whether it went into the pockets. There is no size or length, because the game keeps none for a caught fish. Each kind has one fixed shadow size. Only the fishing tourney makes up a length, when the fish is shown to its host. When pocketed is true, item_picked_up fired for the same catch just before this event.
- `bug_caught` e = { item, pocketed }: A bug was netted. pocketed says whether it went into the pockets. When pocketed is true, item_picked_up fired for the same catch just before this event.
- `letter_read` e = { sender?, item?, mod_item?, first_time, letter? }: The player chose Read on a letter. item is the present, nil when the letter carries none. letter names the letters file letter it is, when a mod sent it.
- `villager_moved_in` e = { villager { id, name, species?, personality? } }: A villager with no house was given one. It fires at the game start after a move-in. A brand-new town fires it for its first villagers.
- `visitor_arrived` e = { kind }: A friend is riding into this player's own town. This is a friend visit, on the host's side. kind is "friend".
- `command_finished` e = { id, command, ok, via?, code?, message? }: A command this mod queued was applied or refused. When applied, ok is true and via says how (mailbox, post_office, pockets, mail, shown or taken). When refused, ok is false, with a code (command_codes) and a message. Sent only to that mod.
- `question_answered` e = { id, choice?, text? }: The player answered this mod's ask, or closed it. choice counts from 1 and text is the answer picked. Both are nil when the window closed with no pick. Sent only to that mod.
- `timer_fired` e = { id, name, data? }: A timer this mod set with timer.after is due. It fires once, at the end of a frame's update, in whatever scene the player is in, and the timer is gone before the handler runs. It is an event like any other. Its handlers share one instruction budget, it waits for a later frame when the frame's time is spent, and the commands it queues count against the per-event and per-day caps. At most one timer per mod fires in a frame. A timer that came due while the game was closed fires soon after the town loads. Sent only to that mod.
- `villager_answered` e = { villager { id, name, species?, personality? }, choice, text }, returns string|table|nil: The player answered the question this mod's conversation asked (villager_talked returned place = "conversation" with an ask). Sent only to that mod, while the window waits. Return what the villager says next, in the same conversation: a line, or { line, ask } to ask again. Return nil and the talk ends. A reply that is not right is logged and the talk ends.

Lua globals (anything else does not exist):

- `on`
- `log`
- `message`
- `game`: `game.time`, `game.day_number`, `game.pockets`, `game.bells`, `game.town`, `game.villagers`, `game.player`, `game.calendar_today`
- `store`: `store.get`, `store.set`, `store.town`, `store.client.get`, `store.client.set`, `store.player.get`, `store.player.set`
- `settings`: `settings.get`
- `remote`: `remote.add`, `remote.call`, `remote.has`, `remote.version`
- `cmd`: `cmd.send_letter`, `cmd.give_item`, `cmd.show_line`, `cmd.ask`, `cmd.take_item`, `cmd.take_bells`, `cmd.set_shop_goods`, `cmd.set_shop_open`
- `rng`
- `timer`: `timer.after`, `timer.cancel`

Commands (each needs its name in mod.json `permissions`; at most 4 per event; a call returns the id, or nil, a message and a code):

- `cmd.send_letter`: Queues a letter in the player's own mailbox. The post office keeps it when the mailbox is full. The save holds an ordinary letter, so it loads without the mod.
- `cmd.give_item`: Queues an item into the first empty pocket. With full pockets it comes by letter. Also takes this mod's own new item by its full id (author.mod:thing). A mod item is given with its identity, as a shop sells it, and full pockets refuse it.
- `cmd.show_line`: Queues a line in the player's own thought window, shown once the player is free. One line or question at a time.
- `cmd.ask`: Queues a question with 2 to 4 answers in the player's thought window. The pick comes back as a question_answered event.
- `cmd.take_item`: Asks the player to hand over items from their pockets. The game shows its own question, which names the item, the count and this mod. The mod's name stands between quotes, and a mod item is named as the pockets show it. A script cannot change that text. On yes the items leave the pockets and command_finished says via taken. On no, or when the window closes with no pick, nothing is taken and command_finished carries command-declined. It is refused with command-not-held when the pockets do not hold that many. Only plain pocket slots count. A wrapped present or an item held for a villager's errand is never taken. Items a command cannot give cannot be taken either (money bags, turnips, tickets, grab bags, fossils). It is refused on a visit and in The City, so a lent mod can never take anything.
- `cmd.take_bells`: Asks the player to pay Bells from their wallet. The game shows its own question, which names the amount and this mod. The mod's name stands between quotes. A script cannot change that text. On yes the Bells leave the wallet and command_finished says via taken. On no, or when the window closes with no pick, nothing is taken and command_finished carries command-declined. It is refused with command-not-held when the wallet holds less than the amount, so the wallet never goes below zero. The bank account and money bags in the pockets are never touched. It is refused on a visit and in The City, so a lent mod can never take anything.
- `cmd.set_shop_goods`: Sets a shop's goods for the rest of the game day, as one more block after the mod's shops.json blocks for that shop. It is set at the call, with no queue, no daily cap and no command_finished, and applies from the next frame, also when the shop is shut, and is gone when the day changes or the game restarts, so set it again in day_started. nil clears it. Only for a shop with goods in the shop table, and refused when a mod later in the load order changes that shop. Needs scope world.
- `cmd.set_shop_open`: Opens or shuts a shop for the rest of the game day, as one more block after the mod's shops.json blocks for that shop. true opens it, false shuts it, nil clears it. It is set at the call, with no queue, no daily cap and no command_finished, and applies from the next frame and is gone when the day changes or the game restarts. Only for a shop with open in the shop table, and refused when a mod later in the load order changes that shop. Needs scope world.

Refusal codes (branch on the code, never on the message):

- `command-shop` (retry: never): A shop command the shop cannot take: the shop is not in the shop table, it has no goods or no open, or a mod later in the load order changes that shop.
- `command-permission` (retry: never): The command is not in mod.json permissions.
- `command-args` (retry: never): Wrong arguments, such as their shape, a length, the paper or the choices.
- `command-item` (retry: never): An item the command cannot hand out, or an unknown item or letter id of the mod's own. Also sent in command_finished when the mod's item or letter was gone by the time the game applied the command.
- `command-event-cap` (retry: next-event): More than commands.per_event commands in one event.
- `command-queue-full` (retry: later): The mod's queue, or the game's, is full.
- `command-day-cap` (retry: tomorrow): The per-day limit for this command in this town is used up.
- `command-city` (retry: later): Commands are off in The City.
- `command-visiting` (retry: later): On a visit, only the town owner's game changes the town.
- `command-lent-home` (retry: never): A lent mod acting outside the host's town. It arrives in command_finished, never as the return of a cmd call.
- `command-no-room` (retry: later): No room now. The mailbox and the post office are full, or the pockets are full for a mod item. The command still counts against the day's cap, so do not try again in a loop.
- `command-not-shown` (retry: never): The line or question cannot be drawn in the window, because the text has too many pages. The command still counts against the day's cap.
- `command-not-held` (retry: later): A take the player cannot meet. The pockets do not hold that many of the item in plain slots, or the wallet holds fewer Bells.
- `command-declined` (retry: later): The player said no to a take's question, or closed it with no pick. Nothing was taken.
- `command-client-setting` (retry: never): The event read a client setting, and a client setting cannot decide what the town gets or gives up. Make the setting world, or do not read it in an event that sends a letter, gives an item, or takes an item or Bells.

Retry rules: try tomorrow on `command-day-cap`. Try later, from a later event, on `command-queue-full`, `command-city`, `command-visiting`, `command-no-room`, `command-not-held`, `command-declined`. Try in the next event on `command-event-cap`. Do not try again on `command-shop`, `command-permission`, `command-args`, `command-item`, `command-lent-home`, `command-not-shown`, `command-client-setting`.

timer.after refusal codes (it returns the id, or nil, a message and a code):

- `timer-args` (retry: never): Wrong arguments, such as the minutes, the name or the data. Also when the script has no timer_fired handler.
- `timer-limit` (retry: later): The mod already has timers.per_mod timers waiting in this town.
- `timer-no-town` (retry: later): No town is loaded yet. The script's main chunk runs before the save loads.
- `timer-no-clock` (retry: later): The game clock is not set. It reads a date before the year 2000, so there is no minute to count from.
- `timer-store-full` (retry: later): The timer does not fit in this mod's town store (store.bytes), or the store could not be written.

Dependency codes (remote.version(mod) returns the version, or nil, a message and one of these; remote.call to an absent optional dependency returns the same three):

- `dependency-absent`: The mod is not installed, is switched off, did not load, or has no running script.
- `dependency-version`: The mod loaded, but its version is outside the range this mod names.
- `dependency-undeclared`: The mod is not in this mod's depends or optional_depends.

Key limits: ZIP 16 MiB; 256 lines per messages file, 400 bytes each; script 200,000 instructions per event (the stop; wall-clock backstops of 125 ms per event, 250 ms for the main chunk at start, and 3 runs in a row over 8 ms, all stretched up to 8x on a slow device), 4 MB memory; store 8 KB per mod per town. All limits: `reference/api.md`.

### Common texture names

Any-palette (`$`) names: each covers every time of day and stretch of the year it is drawn in. A tree crown name covers golden trees too (same crown, gold palette).

- Tree crown (grown broadleaf, fruit and golden trees) (February 25 to December 9, except April 1 to 8): `tex1_64x64_a67216e4ad55d908_$_8.dds`
- Tree crown, cherry blossom days (April 1 to 8): `tex1_64x64_ac6a2be34281d4e2_$_8.dds`
- Tree crown, winter (snow on top) (December 10 to February 24): `tex1_64x64_53d6cc5ace654ac7_$_8.dds`
- Cedar crown (February 25 to December 9): `tex1_64x64_2913073a15235562_$_8.dds`
- Cedar crown, winter (December 10 to February 24): `tex1_64x64_136aa80a0926d0a3_$_8.dds`
- Palm fronds (February 25 to December 9): `tex1_128x32_9dff2c84fba803e5_$_8.dds`
- Palm fronds, winter (December 10 to February 24): `tex1_128x32_53b283fa3171bbdd_$_8.dds`
- Grass (3 variants) (February 25 to December 9): `tex1_32x32_626709d910129694_$_8.dds`, `tex1_32x32_903adc6355e36f59_$_8.dds`, `tex1_32x32_e96fecd242518c9f_$_8.dds`
- Grass, winter (3 variants) (December 10 to February 24): `tex1_32x32_e2ab673814e71af6_$_8.dds`, `tex1_32x32_cfa57a6e6f966d11_$_8.dds`, `tex1_32x32_82f28ec4199a45be_$_8.dds`
- Cliff faces (3 variants) (February 25 to December 9): `tex1_64x64_99c780e750314916_$_8.dds`, `tex1_64x64_16de5cbb85d58cc0_$_8.dds`, `tex1_64x64_f628105fb6e026fd_$_8.dds`
- Cliff faces, winter (3 variants) (December 10 to February 24): `tex1_64x64_0dd181f7c8e1d9e1_$_8.dds`, `tex1_64x64_e5488c12d43d6cbc_$_8.dds`, `tex1_64x64_64ac9d75399172f0_$_8.dds`
- River and pond banks (3 variants) (February 25 to December 9): `tex1_64x64_1218fdfe9c963f24_$_8.dds`, `tex1_64x64_78690dcebd874a3b_$_8.dds`, `tex1_64x64_2d865e307f1a0fdc_$_8.dds`
- River and pond banks, winter (3 variants) (December 10 to February 24): `tex1_64x64_2ec0ba79769bedc7_$_8.dds`, `tex1_64x64_b6437b8020145bc6_$_8.dds`, `tex1_64x64_9438dc9288174b5a_$_8.dds`

### The playac-mod tool

A command line tool (Node.js 18.17 or newer) with three commands: `check` (a folder or a .zip; Lua syntax by the game's own parser), `pack` (writes `<id>-<version>.zip` beside the folder) and `dev` (serves the folder to the game). Start a mod from an example repository or a starter kit. Share it on the website.
`playac-mod help` lists the commands and `playac-mod <command> --help` shows one command's options. Write commands as `playac-mod ...`, never `npx playac-mod ...`.
Install it with the line on https://playaconline.com/modding/cli/#install, which names one release by its address and gives its SHA-256. Never install or run the tool by its bare name from the npm registry (no `npx playac-mod`, no `npm install playac-mod`): a package there by that name is not the game's. Without Node, use the no-Node route: write the files, ZIP them, and install in the game with Settings, Mods, Install from a file, Choose a file (the same checks run). "Choose ZIP" is a different button: it uploads a mod to share it.
<!-- END generated facts -->

## What a mod can and cannot do

Can:
- Replace any texture the game draws with your own art, as `.dds` or `.png`.
- Add villager lines: a line goes in one of five places in a talk, the same in a talk pool's `"place"` and a script's talk table: `before` the hello, as the `hello` (an everyday hello only), as the `topic` after a chat answer (its `topics` name which: `small_talk` by default, `trade`, `letter`, `memory`, `hint`, `news` or `"any"`), `after` the topic, or the whole `conversation`. Every pool and every script line names its place: there is no default, and a pool or a plain string return without one is refused. With no code, talk pools (`content.talk`) keep a line to a personality or villager, a season, a time of day, the weather or a calendar `day`. A script's `villager_talked` returns a talk table `{ place, line, topics, ask }` or a list of them; a conversation's `ask` sends the pick to `villager_answered`. A line is a string or a list of up to 8 pages.
- Change the game's shops, each by its id (`nook`, `flower`, `redd`, `saharah`, `fireworks`, `able`, `barber`, `dream`, `katrina`), with one block shape: goods and prices, `own_goods`, opening and shutting, service prices, a name and lines, each block kept to hours, a time of day, a season, the weather, weekdays, months or a setting with `when`. A block with `when` applies at once, while it holds. At Nook's the goods of a block with no `when` show from the next morning's restock (the first play on a day at or after 6:00 AM).
- Add new furniture on a game piece's model (`content.items`), sold in your shops or given by a script.
- Letter templates (`content.letters`), calendar days with a bulletin board notice and a letter, and talk pools kept to a calendar `day` for the day's lines.
- Scripts on every event listed above, reading the date, pockets, Bells, town, villagers; a per-town store and a per-player one (`store.player`: a town has up to 4 residents); settings the player sets; calls between mods (`remote`).
- Commands, declared in `permissions`, applied at the end of a frame's update (before it is drawn): see the list above. Daily caps are per mod per town (for every resident together: a safety limit), and a command counts when it is applied.

Cannot (do not promise these):
- Add villagers, buildings, acres, music, or new kinds of item other than house furniture on a game model.
- Add a shop of its own, or give a shop a field the shop table does not list for it.
- Give Bells, or take them without the player's yes. `give_item` refuses money, and `take_bells` shows the game's own question first.
- Run code every frame, change the game's code or memory, read files, reach the internet, or run JavaScript. There is no `io`, `os`, `require`, `load` or `debug`.
- Change anything in The City (every command is refused there) or a friend's town while visiting (letters, items and takes are refused).

## Rules (a mod breaking these is refused or removed)

- Only the author's own work. No textures, models, music or text taken or traced from any Nintendo game or any other game, film, show or brand. A PNG saved from the model viewer is the game's art: use it only to see the size and layout, and draw a new picture. A recolour, hue shift, filter, touch-up or trace of a game texture is NOT original and cannot be shared (fine in the player's own game); say so plainly when asked to recolour one for sharing. Unchanged copies are refused automatically.
- No Nintendo or franchise names or logos in a mod's name, id, description or pictures.
- `"assets_original": true` in mod.json is the author's promise of the above.
- Nothing sexual, hateful, gory or graphically violent, or holding personal information. Scripts must not try to slow or break the game.
- Sharing needs an account, age 13 or older, two-factor sign-in, and accepting the mod rules. Full rules: https://playaconline.com/wiki/mod-rules/

## Pick the path

Ask what they want to make, then follow ONE of these. Each ends with a mod that installs.

### 1. Artist (textures, no tools needed)

1. Find the name. Open `https://playaconline.com/viewer/` (the model viewer; it reads the player's own disc, like the game), pick the model (a villager, tree, rock, furniture, clothing, tool or building), press **Textures**, pick the texture and press **Copy name**. For a texture with a palette (grass, trees, cliffs) press **Any palette** instead: the `$` name, `tex1_32x32_626709d910129694_$_8`, shows the art at night and in every season, so keep the `$`. **Save PNG** saves the picture for its size and layout. The common names (trees by season, cedars, palms, grass, cliffs, banks) are listed under "Common texture names" above.
2. Start from a mod that works: the texture kit (a ZIP in the newest "Starter kits and AI pack" release of playac-mods, linked from `https://playaconline.com/modding/downloads/`; the grass as a green check) or the Springtime Town example repo (`playac-example-springtime-town`, its grass textures). There is no export that makes a mod: never tell the user to look for one.
3. Draw a NEW picture (2x or 4x the size is fine; smaller looks blurry) and save it in `textures/` as `.png` or `.dds` under exactly the copied name. The saved PNG is the game's art: only a guide to the layout.
4. Delete the kit's pictures the user did not replace (unchanged game textures are refused when shared). Edit mod.json: your own id, name, authors.
5. ZIP the folder (Finder Compress or Windows Send to; the folder or the files inside it both work). Keep other ZIPs out of the folder: a `.zip` inside a mod is refused. Settings, Mods, "Install from a file", **Choose a file**, then **Restart now**.

Texture facts: names are `tex1_<w>x<h>_<texture hash>_<palette hash>_<format>.dds` (or `.png`; no palette part for a texture without a palette; `$` in place of the palette hash matches any palette; a `$` file is loaded once and shared by every palette, and any mod's exact-palette file wins over it for that palette). A `.dds` must be BC7, DXT1, DXT5 or uncompressed 32-bit RGBA (either channel order: RGBA or BGRA/A8R8G8B8), ONE level, no mipmaps (the game draws a DDS with mipmaps, but the mod list refuses it). A `.png` is drawn too: at most 2048 x 2048, and all mods' PNGs together at most 96 MB of pixels (24 MB on a phone). Do not keep a `.png` and a `.dds` of the same texture: the game uses only one. A file may carry a label in front of the name so the folder stays readable: `bookshelf-top_tex1_32x32_626709d910129694_$_8.png` is the same texture as `tex1_32x32_626709d910129694_$_8.png`. The label is 1 to 40 lowercase letters, digits and dashes, then ONE underscore, then the name exactly as copied; the game matches on the `tex1_` part only, in `textures/` and in an item's own textures folder. Suggest a label when you name files for the user. A label with a capital letter, a space or an underscore of its own is refused (`texture-label`), and two files that are the same texture once the labels are taken off are refused (`texture-label-twice`): different labels never make different textures. A mod's texture wins over the HD pack. On a phone all switched-on mods share 24 MB unpacked.

### 2. Writer (lines, shops, letters, calendar days; a text editor)

1. Make a folder with `mod.json` (template below) and the content file.
2. Villager lines, no script: a talk pools file (`content.talk`): lines by personality or by villager, optionally kept to a `season` (spring, summer, fall, winter), a `time` (morning, day, evening, night), the `weather` (clear, rain, snow) or a calendar `day`, with a `chance` in 100 talks it fits (default 100), and a required `place` (before, hello, topic, after, conversation; a topic line is small talk unless `topics` says more). A topic line is said whenever the game picks one of its topics, so a villager can say several a day. See `reference/api.md` and the Springtime Town example. Use this first for lines by personality, season, time or weather; a script only for lines that depend on something else (an item in the pockets, a count the script keeps).
3. Lines a script says: `messages/en.json` (one file) and a tiny script (the talk example below). Every player sees a mod's texts as written, whatever the game's language: there are no translations.
4. A shop: `shops.json` (template below), `"scope": "world"`. Themed goods that are furniture (lanterns, a tea set) need the mod's own items (`content.items`), which the flower shop and Nook's both sell; the flower shop cannot show the game's own furniture.
5. A letter: `content.letters` with `id`, `header` (`{player}` for the name), `body` (6 lines), `footer` (the sign-off, up to 32 characters) and an optional `sender` (up to 8, the name in the mailbox list, which otherwise shows the footer cut to 8: "The Lantern Keepers" reads "The Lant"; `check` warns), `item`, `paper`. A script mails it with `cmd.send_letter`, a calendar day with `letter`.
6. A calendar day: `content.calendar` (a file with a top-level `"days"` list) where a day has an optional `board` (world scope) and an optional `letter` (the id of one of the mod's `content.letters` letters, mailed on the day with NO script, once per town); a day's villager lines are talk pools with its `id` as their `day`, ahead of other pools on the day. `"week": 2, "weekday": 5` means the second Friday of the month (week n = the nth such weekday; `"last"` = the last). To test: set the date to today while testing; or move the device clock (the game reads it at start; back up the save first). Installed mid-day, the notice posts the next time the player walks outside that day; `day_started` does not fire again after a restart the same day, so a script uses `game.calendar_today()`.
7. ZIP the folder (the folder or its files, either works), Settings, Mods, "Install from a file", **Choose a file**, **Restart now**.

### 3. Scripter (Lua, ideally VS Code and Node)

1. Start from the script starter kit (`templates/script-kit` in the playac-mods repository) or an example repository: copy the folder and change `id` in mod.json. For the editor, a starter kit ZIP from the release already has `.playac/playac.lua`; otherwise copy `api/playac.lua` from the playac-mods repository to `.playac/playac.lua` (LuaLS types; also at https://playaconline.com/schemas/playac.lua); the JSON schemas are in its `api/` too.
2. `playac-mod check` runs every rule the game runs at install, lists every problem at once (JSON errors with line and column), and FAILS on a script the game would stop at load: a Lua syntax error (checked with the game's own Lua 5.4 parser, built into the tool) and an `on()` for an event not in `scripts.events`. It warns about what the game accepts but probably not as meant (cmd.* not in permissions, a shop good the game leaves out, a texture the mod list refuses). `check some.zip` checks a ZIP exactly as the Mods tab reads it. `playac-mod pack` writes `<id>-<version>.zip` NEXT TO the mod folder (the same bytes every time) and prints its content hash. Hidden files and folders (`.playac/`, `.claude/`, `.vscode/`) and a top-level `CHANGELOG.md` never go in the ZIP; README.md does, so it is for players.
3. Test without zipping. Opening the game with `?moddev=1` only shows the Developer section: it loads nothing by itself. The whole loop is: (a) run `playac-mod dev` in the mod folder and leave it running; (b) open the game with `?moddev=1`; (c) Settings, Mods, Developer, "Load a mod you are making"; (d) put the address the tool printed in **playac-mod dev address** (the box already holds `http://127.0.0.1:2604`; the tool uses the next free port when 2604 is taken) and press **Connect** (the tool answers only game pages at playaconline.com, its dev site and http://localhost:5173; for a page at another address, start it with `playac-mod dev --origin <that address>`, or Connect says the dev server refused this site); (e) press **Restart now** once. Without Node, **Choose folder** (the folder with mod.json) replaces (a) and (d). Always tell the user to press Connect: the page reaches the tool only then, and again after the page is reloaded. After that, saving reloads it in the running game: lines, shops, `talk`, `letters` and `calendar` files at once (shop goods on the next visit, a talk pool on a villager's first talk of the day), `main.lua` restarts the script with its store kept, textures are drawn again, and the `items` file is read again at once (a new name or price shows the next time it is shown or offered; a new base is what new pieces are made of, while pieces already in the town keep the base they were made of; a removed item's pieces show as their base and are it again when it is back; the Mod log says which applies). A mod.json change needs a restart, and so does giving a removed item's pieces a new id (a `renames` entry in mod.json). Errors (with a Lua traceback), stops and refused files are in the Mods tab's **Mod log**. While a mod is loaded this way, friend visits and sharing are off.
4. Without Node: write the files by hand from the templates here, ZIP them and install with **Choose a file**: the install runs the same checks.

### 4. Power user (sharing, versions, dependencies, multiplayer)

- Raise `version` for every shared update; a version can never be replaced.
- Share on the website only: Settings, Mods, Share a mod (two-factor on; a code from the authenticator app opens a 15-minute window in that browser). Upload the ZIP with 1 to 4 screenshots and an optional changelog line, or paste `github.com/owner/repo@tag` to import a tagged GitHub release: the tag must match mod.json's version, and the import reads screenshots from `.playac/screenshots/` (200 to 4096 px a side and at most 3840x2160 pixels in all, as an 8 bit PNG or a standard JPEG) and an optional line from a `## <version>` section in `CHANGELOG.md` (never packed, so editing it keeps the content hash). The playac-mod tool does not upload.
- "Mods you shared" in the Mods tab lists every uploaded version and its state: Waiting for review, Listed, Older version, Withdrawn, Refused (with the reason), Removed. A listed version can be withdrawn there and listed again.
- A mod it can use but does not need: `"optional_depends": { "author.lib": ">=1.0.0" }` (same shape as `depends`; an id goes in only one of `depends`, `optional_depends`, `conflicts`). The mod always loads; a present one (installed, on, loading, in range) loads first. `remote.version("author.lib")` returns its version or `nil, message, code` (`dependency-absent`, `dependency-version`, `dependency-undeclared`); `remote.call` to an absent optional dependency returns the same three and raises nothing. Ask in an event, not at the top of the script: two mods that use each other load in the player's order, so the first one's top level runs before the other exists.
- A library and a mod that needs it: developer mode loads ONE folder, and that copy counts as installed for `depends`; install the other from its ZIP (`playac-mod pack`), either way round. A library declares `exports` (name -> one-line description) in mod.json.
- `data_migrated` (`e.from`, `e.to`) runs as the town loads, NOT at the restart, before any other event in that town.
- `data_migrated` runs only for data that exists: on a fresh install there is none, so it is not called, and the first `store.set` writes at the current `data_version`. `from` is 0 for data saved before the mod set a `data_version`.
- World mods (`"scope": "world"`) that count must match for friend visits: same mods, same versions, same order, same world settings. A setting is `"scope": "world"` (the default: part of the town, compared, the host's value when mods are lent) or `"scope": "client"` (the player's own: never compared or sent; each player keeps theirs on a visit). Mark a cosmetic toggle `client`. A client setting may decide only what its own player sees or hears: in an event that read one with `settings.get`, `cmd.send_letter`, `cmd.give_item`, `cmd.take_item` and `cmd.take_bells` are refused with `command-client-setting`, so never read one in an event that sends, gives or takes, and never keep its value (a variable, `store`, a timer's `data`) to use in one. Just you mods (`"scope": "client"`) never block a visit. When every World mod of the host that counts is a reviewed version from the mod list, the visitor can load them for that visit only: nothing is installed, they run with the host's world settings and the visitor's own client settings (a text setting changed from its default must pass the site's word checks, or the visit is refused) and an empty store that is never kept, and at the visitor's home (the restarts before and after the trip) their shop, Nook goods, board notices, items, renames and commands do nothing. A mod installed from a file cannot be lent, so publish World mods. A World mod that depends on a Just you mod cannot load for a friend without that Just you mod, so the visit is refused: World mods should depend only on World mods.
- In The City, World mods' shops and board notices switch off, mod items are off, and every command is refused; textures, lines and scripts keep running for the player, but nothing a script commands applies there.

## mod.json

```json
{
  "schema": 1,
  "api": 1,
  "id": "yourname.my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "authors": ["yourname"],
  "description": "What it does, in a sentence or two.",
  "scope": "client",
  "content": {
    "textures": "textures/",
    "messages": "messages/en.json"
  },
  "scripts": { "main": "main.lua", "events": ["villager_talked", "day_started"] },
  "assets_original": true
}
```

- Required: `schema` (1), `api` (1), `id`, `name`, `version`, `authors`, `scope`, `assets_original: true`.
- `id`: `author.mod-name`, lowercase letters, digits and dashes, one dot. Never change it after sharing. `playaconline`, `official`, `admin` and `example` are reserved author names.
- `version`: `"1.0.0"` style, three numbers, no leading zeros.
- `scope`: `"client"` (only the player sees it) or `"world"` (changes the town for visitors; REQUIRED for shops and board notices).
- `content`: the keys listed above. Paths are exact, case-sensitive, relative to mod.json.
- `scripts.events`: every event the script uses with `on()`, each once. An `on()` for an event NOT in `events` raises an error at load and the whole script stops (the mod still installs): always add the event to `events`. A library mod that only offers `remote.add` functions still lists one event and registers no handler for it.
- `settings`, one of each type: `[{ "name": "greet", "type": "bool", "label": "Say hello", "default": true }, { "name": "price", "type": "number", "label": "Fruit price", "default": 600, "min": 100, "max": 5000 }, { "name": "drink", "type": "choice", "label": "Drink", "default": "tea", "choices": ["tea", "coffee"] }, { "name": "motto", "type": "text", "label": "Shop motto", "default": "", "max_length": 40 }]`. name 1 to 32 of `a-z 0-9 _` starting with a letter; label 1 to 60 characters; optional description up to 200; at most 16. Read with `settings.get("price")`.
- `permissions`: every command the script uses (`cmd.<name>`).
- JSON is strict: double quotes, no comments, no trailing commas, no key twice.
- A key the game does not know is refused, in mod.json and in every data file except messages, and the message names the closest key: `mod.json: unknown key "permisions" (did you mean "permissions"?)`.

## shops.json (World mods only)

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
    },
    "nook": {
      "goods": [{ "item": "0x1110", "price": 1800 }, { "item": "0x2205", "price": 900 }]
    }
  }
}
```

- Each key under `"shops"` is a shop id: `nook`, `flower`, `redd` (Crazy Redd), `saharah`, `fireworks`, `able` (Able Sisters), `barber`, `dream` (the Dream Suite), `katrina`. Any other key is refused (`shop-id`). A shop takes one block, or a list of 1 to 8 blocks (`shop-blocks`).
- A block's keys, in this order: `when`, `open`, `own_goods`, `goods`, `price_percent`, `buy_back_percent`, `services`, `name`, `lines`. Each means the same on every shop. A block needs a key besides `when` (`shop-block-empty`).
- Which fields each shop has is the shop table in `reference/api.md` (online https://playaconline.com/modding/guides/shops/#table). Nook's: `when`, `open`, `own_goods`, `goods` (1 to 16), `price_percent`, `buy_back_percent`. The flower shop: `when`, `open`, `own_goods`, `goods` (1 to 6, six bench spots of one kind), `price_percent`, `name`, `lines` (slots `greeting` and `stock`). Crazy Redd, Saharah, the fireworks stall: `when`, `own_goods`, `goods` (1 to 6), `price_percent`. Able Sisters (`design`), Katrina (`fortune`): `when`, `services`. The barber shop (`haircut`): `when`, `open`, `services`. The Dream Suite (`dream`): `when`, `services` (it keeps no hours). A piece of furniture the game has no model for (the kadomatsu 0x1220 and the like) is refused as a good everywhere (`shop-item-no-model`). A field a shop does not have is NOT refused: the game leaves it out, the rest of the block applies, and the mod's row on the Mods tab names the shop and the field (`shop-field-ignored`).
- `when`: the block applies only while every key holds; leave it out for always. `hours` `{ "from": "HH:MM", "to": "HH:MM" }` (24-hour, from and to differ, to may pass midnight), `time` (morning, day, evening, night), `season` (spring, summer, fall, winter), `weather` (clear, rain, snow), `weekday` (a list, `"monday"` to `"sunday"`), `month` (a list, 1 to 12), `setting` (the name of one of the mod's own bool settings with scope world: the block applies while it is on). A good may carry a `when` of its own too.
- `open`: `true` opens the shop while the block applies, also when its own hours have it shut; `false` shuts it. Leave it out for the shop's own hours.
- `own_goods`: `true` (the default) puts the goods in at most half the spots of their kind, rounded up, and the shop's own keep the rest. `false` makes the goods of the applying blocks the whole stock, every other spot bare. A night shop of only your goods is `"when"` hours, `"open": true` and `"own_goods": false` (the After Hours example).
- `price_percent` (1 to 1000): the percent of its own price the shop asks for every good with no price of its own. `buy_back_percent` (1 to 1000, Nook's): the percent of his usual pay for what the player sells, never more than he asks for it; not turnips. `services`: a service's price in Bells by name (`shop-service` for a name the shop does not have). `name` (1 to 40 characters, one line): the flower shop's door sign while shut. `lines`: a slot to a line or a list of 1 to 8 (the keeper picks one each time), each 1 to 160 characters with at most 3 line breaks (`shop-line-slot` for a slot the shop does not have).
- Inside one mod every block whose `when` holds applies: their goods together, and for a single value (`open`, `own_goods`, a percent, a service, a line slot) the last of them that sets it. When two mods change the same shop, the one LAST in load order has that shop whole and the earlier mod's row says its change is not used (`shop-replaced`); two mods on different shops both apply.
- A script with the permissions can add one block after the JSON ones for the rest of the game day: `cmd.set_shop_goods(shop, goods)` and `cmd.set_shop_open(shop, on)`, `nil` clears.
- `item` is a STRING `"0x"` + 4 hex digits, or one of the mod's own items by full id (`"yourname.my-mod:lamp"`), at Nook's and the flower shop only. Each item once per block. `price` optional, whole Bells 1 to 99999; below the good's floor it is raised to it (the floor is what Nook pays; a town fruit at the flower shop is 500).
- What each shop may stock is in `reference/items.md` (flower and Nook's columns). The flower shop needs a good with a shop table model: none of the game's own furniture has one, but the mod's OWN items always work there. Nook's sells the game's furniture, clothing, stationery, carpets, wallpaper, tools, umbrellas, paint, saplings, flower bags; not fruit. Money, tickets, grab bags, turnips and fossils never. A refused good is left out, with the reason on the Mods tab row after a restart; `playac-mod check` warns first.

## messages/en.json

```json
{ "greet": "Hello there!", "shop.hours": "We open at three." }
```

Ids 1 to 48 of `a-z 0-9 _ . -`; at most 256 lines; each 1 to 400 bytes. Lines wrap by width, not by a count of characters: a line holds 180 pixels of the game's font (about 24 letters, more of narrow ones, fewer of wide ones), 4 lines to a page; characters the font lacks show as `?`. A script reads its own line with `message("greet")` and another mod's with `message("author.mod:greet")` (nil when that mod is not installed). `content.messages` names one `.json` file, never a folder.

## Scripts (Lua 5.4)

```lua
-- main.lua: the top level runs once at start, BEFORE any town is loaded.
-- Register handlers here. Read and save the store only inside events.
-- Every handler gets ONE table, e. A field with nothing to say is nil.
on("villager_talked", function(e)   -- e.villager = { id, name, species, personality }
  if store.get("met_" .. e.villager.id) then return nil end
  store.set("met_" .. e.villager.id, true)
  return { place = "before", line = message("greet") }  -- said before their usual hello
  -- another place: return { place = "after", line = { "Page one.", "Page two." } }
end)

on("day_started", function(e)       -- e = { year, month, day, weekday }
  local today = ("%04d-%02d-%02d"):format(e.year, e.month, e.day)
  if store.get("last_day") ~= today then  -- a restart the same day does not fire it again; count by date
    store.set("last_day", today)
    store.set("days", (store.get("days") or 0) + 1)
  end
  log("day", store.get("days"))
end)
```

- `store` is per mod per TOWN (8 KB): `store.get` answers nil and `store.set` is refused at the top level, before a town loads. A town has up to 4 residents and they share `store`; `store.player.get/set` is per mod, per town, per player, inside the same 8 KB: keep anything one resident earns (a quest, today's gift) there. `game.player()` is `{ name, id }`. `store.client` is per browser. Strings, numbers, booleans only; `set(key, nil)` deletes.
- Every `store.set`, `store.player.set` and `store.client.set` writes the mod's file in the save folder before it returns. The browser keeps the save folder at the game's next save sync (a game save, and a mod-data upload at most every 2 minutes for the cloud). A tab closed before that sync loses the last sets.
- Ids are numbers in Lua (`e.item == 0x2800`). JSON files write them as `"0x2800"` strings. `cmd.*` take a number, `"0x2800"` or the mod's own `"author.mod:thing"`.
- `rng()`, `rng(n)`, `rng(m, n)`: each call gives the mod's next number for this town and game day, so calls differ and a reload carries on (it cannot reroll). `math.random` and `math.randomseed` are not available: calling one stops the script with an error that says to use `rng()`. `game.day_number()` is the game day as one whole number.
- `log(...)` writes a line in the Mods tab's **Mod log** and the browser console as `[Mods] <id>: ...` (20 per event, 500 per session).
- `villager_talked`: every mod's handler runs in load order; the FIRST line returned for a place takes it, and a conversation takes the whole talk and stops the event. Textures and shops: the LAST mod wins (so a mod loaded in developer mode, which loads last, wins textures and shops but not a talk place). Talk pools fill the places no script took; pools from every mod are pooled, not ranked. `command_finished` and `question_answered` go only to the mod that asked, `villager_answered` only to the mod whose conversation asked, `data_migrated` only to the mod whose data version moved; every other event runs every mod's handlers.
- Commands (`cmd.send_letter{...}`, `cmd.give_item(item)` ...) return the command's id, or `nil, message, code`; the outcome arrives as a `command_finished` event: `e.ok` true with `e.via`, or `e.ok` false with `e.code` and `e.message`. The code says whether to try again (the codes are listed above and in `reference/api.md`). Mark a reward as given only in `command_finished` when `e.ok`; follow the retry word of the code in the "Refusal codes" list above, and the "Retry rules" line under it. A code marked `later` or `next-event` must not mark the reward as refused for good. A command refused with `command-no-room` or `command-not-shown` still used one of the day's cap, so try again from a later event, never in a loop. A refusal when the game applies the command is also written to the Mod log. At most 4 per event; daily caps and every command's arguments in `reference/api.md`. A question with answers:

```lua
-- mod.json: "permissions": ["ask", "show_line"], "scripts": { "main": "main.lua", "events": ["scene_entered", "question_answered"] }
local asked = false
on("scene_entered", function(e)     -- e = { scene, name }: name is "player_house", "museum"..., or nil
  if asked then return end
  asked = true
  cmd.ask{ text = "Join the fishing derby?", choices = { "Sign me up!", "No thanks" } }
end)

on("question_answered", function(e) -- e = { id, choice, text }: choice counts from 1; nil if closed with no pick
  if e.choice == 1 then cmd.show_line("You're in the derby!") end
end)
```

- A letter body is 192 pixels a line in the game's font: about 30 characters of ordinary English a line, 6 lines (capitals, m and w are wider: 19 W's fill a line; words never split). Keep text a script builds under about 150 characters with at most 5 line breaks; `cmd.send_letter` refuses one that does not fit at once: it returns `nil, message, code`. Plain US keyboard characters only.
- `fish_caught` gives `e.item` (the fish) and `e.pocketed`; there is no size or length.
- `item_picked_up` also fires for a fish or a bug that goes into the pockets, just before `fish_caught` or `bug_caught`, and for anything dug up. Never count the same catch in both handlers.
- Over a limit, or on any Lua error (syntax errors included), the script stops for the session and the Mods tab row says why with the line; the rest of the mod keeps working. `pcall` does not get around the budget. Payloads are copies. No `__gc`, and no table with a `__len` metamethod passed to `table.insert`, `remove`, `sort` or `concat`.

## Testing checklist

1. `playac-mod check` (or install the ZIP: the Mods tab refuses with the reasons). Read every warning.
2. Restart the game and read the mod's row in Settings, Mods: anything the game itself refused (shop items, a script that stopped) is listed there.
3. Script output: the Mods tab's **Mod log** (log() lines, errors with a traceback, stops, refused files, live), and the browser console (F12, Console), lines starting `[Mods] yourname.my-mod:`.
4. Something broke the game? Settings, Mods, **Start without mods**, or add `?nomods=1` to the play address.
5. Before sharing: no file you did not make, unchanged textures deleted, version raised, description says what it does, a screenshot ready.

## Sharing and review

1. Sign in at playaconline.com with two-factor sign-in on. Settings, Mods, Share a mod. The first time, confirm age 13+ and accept the mod rules. Then enter the code from the authenticator app.
2. Upload the ZIP, or use Import from GitHub, which shows under the upload form once the code is accepted. The automatic checks answer at once (the same rules, plus image checks: unchanged game textures, DDS formats, mipmaps).
3. A moderator reviews it. There is no fixed time: the version waits in the queue until a moderator gets to it. Refusals and removals come with a reason code (`review-*` in `reference/errors.md`) and a note. If the author logs in with an email address, every upload and every review decision emails it. A username login gets no email.
4. Updates: raise `version` and upload again. Players who have it see "Update available". A version the moderators removed is switched off in every player's game.

## Troubleshooting: always use the errors catalogue

When the user pastes an error, find it in `reference/errors.md` (search a distinctive phrase; the page's, the site's and the game's wordings are all listed) and answer with: the code, what it means in one sentence, and the exact fix applied to THEIR file. Link `https://playaconline.com/modding/errors/#<code>`. A Lua syntax error (`main.lua:7: 'end' expected near <eof>`) is `script-syntax`; any other Lua error with a file and line is `script-error`: open that line.

Common ones: no mod.json at the top of the ZIP (`zip-no-manifest`: zip the folder's contents, not a parent folder); a `"scope": "client"` mod with shops (`shops-need-world`); `"item": 0x2800` without quotes (`shop-item`); an event used with `on()` but missing from `scripts.events` (`script-on-event`); a misspelt key (`unknown-key`); a texture that does not show (the name must be exact, copy it with Copy name in the model viewer (/viewer/, Textures); a DDS saved with one level; a later mod in load order may replace it).

## How to answer

- Give COMPLETE files, ready to save, never fragments with "...".
- Check every file against the rules above before you give it: required keys, `"api": 1`, string item ids, `scripts.events` matching `on()` calls, permissions matching `cmd.` calls, scope world for shops, limits.
- Prefer the smallest mod that does what they asked. Say what it cannot do instead of faking it.
- Remind them to raise `version` when they change a shared mod.
- No Nintendo names in ids, names or descriptions you write.
