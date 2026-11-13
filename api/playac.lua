---@meta playac
-- Play AC Online mod API, levels 1 to 2. Generated from the mod API spec (https://playaconline.com/schemas/api.json). Do not edit by hand.
-- Reference: https://playaconline.com/modding/reference/  Put this file where your editor's Lua language server finds it
-- (for example a "types" folder listed in .luarc.json "workspace.library").

---@alias PlayacEvent "talk"|"day_start"|"item_picked"|"enter_scene"|"migrate"|"hour_change"|"shop_buy"|"item_sold"|"fish_caught"|"bug_caught"|"letter_read"|"villager_moved_in"|"visitor_arrived"|"command_result"|"answer"

---A copy: changing it changes nothing.
---@class PlayacTalkNpc
---@field name string The villager's name.
---@field id integer The villager's id.

---@class PlayacDayStartDate
---@field year integer
---@field month integer
---@field day integer

---@class PlayacHourChangeE
---@field year integer
---@field month integer
---@field day integer
---@field hour integer

---@class PlayacShopBuyE
---@field item integer
---@field price integer
---@field shop string
---@field ordered boolean
---@field mod_item string|nil

---@class PlayacItemSoldE
---@field item integer
---@field count integer
---@field bells integer
---@field shop string
---@field mod_item string|nil

---@class PlayacFishCaughtE
---@field item integer
---@field pocketed boolean

---@class PlayacBugCaughtE
---@field item integer
---@field pocketed boolean

---@class PlayacLetterReadE
---@field sender string
---@field present integer
---@field first_time boolean

---@class PlayacVillagerMovedInE
---@field id integer
---@field name string

---@class PlayacVisitorArrivedE
---@field kind string

---@class PlayacCommandResultE
---@field id integer
---@field command string
---@field ok boolean
---@field error string
---@field via string

---@class PlayacAnswerE
---@field id integer
---@field choice integer
---@field text string

---@class PlayacGameTimeResult
---@field year integer
---@field month integer 1 to 12.
---@field day integer 1 to 31.
---@field hour integer 0 to 23.
---@field minute integer 0 to 59.
---@field weekday integer 0 (Sunday) to 6.

---Registers a handler for an event, while the mod's own script loads (not from inside a handler, nor from a function another mod calls with remote.call). The event must be in mod.json's scripts.hooks. At most 16 handlers per event.
--- Since: api 1
---@overload fun(event: "talk", fn: fun(npc: PlayacTalkNpc): string|nil)
---@overload fun(event: "day_start", fn: fun(date: PlayacDayStartDate))
---@overload fun(event: "item_picked", fn: fun(item: integer))
---@overload fun(event: "enter_scene", fn: fun(scene: integer))
---@overload fun(event: "migrate", fn: fun(from: integer, to: integer))
---@overload fun(event: "hour_change", fn: fun(e: PlayacHourChangeE))
---@overload fun(event: "shop_buy", fn: fun(e: PlayacShopBuyE))
---@overload fun(event: "item_sold", fn: fun(e: PlayacItemSoldE))
---@overload fun(event: "fish_caught", fn: fun(e: PlayacFishCaughtE))
---@overload fun(event: "bug_caught", fn: fun(e: PlayacBugCaughtE))
---@overload fun(event: "letter_read", fn: fun(e: PlayacLetterReadE))
---@overload fun(event: "villager_moved_in", fn: fun(e: PlayacVillagerMovedInE))
---@overload fun(event: "visitor_arrived", fn: fun(e: PlayacVisitorArrivedE))
---@overload fun(event: "command_result", fn: fun(e: PlayacCommandResultE))
---@overload fun(event: "answer", fn: fun(e: PlayacAnswerE))
---@param event PlayacEvent An event name.
---@param fn function Called with the event's payload.
function on(event, fn) end

---Writes a line to the Mods tab's Mod log and the browser console as "[Mods] <id>: ...". Arguments are joined with spaces; a line is cut at 300 bytes. At most 20 lines per event and 500 per session. A script error or stop is written to the Mod log too, with a Lua traceback.
--- Since: api 1
---@param ... any Values to print.
function log(...) end

---A line from a messages file: "key" reads this mod's own, "author.mod:key" another mod's. nil when there is no such line. From api 2 a mod's messages can be a folder of translations: the line comes in the game's language (en, de, es, fr or it, from the disc), with English as the fallback.
--- Since: api 1
---@param key string "key" or "author.mod:key".
---@return string|nil
function message(key) end

---Read-only facts about the game.
---@class PlayacGame
game = {}

---The game's clock now.
--- Since: api 1
---@return PlayacGameTimeResult
function game.time() end

---A copy of the 15 pocket slots, item numbers, 0 for an empty slot.
--- Since: api 2
---@return table
function game.pockets() end

---The wallet, or nil before a town is loaded.
--- Since: api 2
---@return integer|nil
function game.bells() end

---The town: { name, id, year, month, day, hour, minute, weekday, season } (season spring, summer, autumn or winter), or nil.
--- Since: api 2
---@return table|nil
function game.town() end

---The town's villagers: { { id, name, species, personality }, ... }; personality normal, peppy, lazy, jock, cranky or snooty.
--- Since: api 2
---@return table
function game.villagers() end

---{ name }, or nil.
--- Since: api 2
---@return table|nil
function game.player() end

---The ids of this mod's own events (its events file) that fall on the town's date today, in file order: {} when none, or before a town is loaded. Only the calling mod's events.
--- Since: api 2
---@return table
function game.events_today() end

---A small saved table per mod, per TOWN (from api 2): strings, numbers and booleans, 8 KB per mod per town. It travels with the town (cloud save, backups, Export with mod data). No town is loaded while the main chunk runs: get answers nil and set refuses. On a visit or in the City it lives in memory only. Written to disk when the game saves. A mod that says "api": 1 keeps level 1's store: one per browser (store.client's), usable from the main chunk too.
---@class PlayacStore
store = {}

---A value this mod saved in this town, or nil (nil while the main chunk runs). Integers come back as integers.
--- Since: api 1
---@param key string
---@return string|number|boolean|nil
function store.get(key) end

---Saves a string, number or boolean under a key in this town; nil deletes it. Keys up to 64 bytes, strings up to 1024. A set that would take this town's store over 8 KB, or one before a town is loaded (the main chunk), raises an error and changes nothing.
--- Since: api 1
---@param key string
---@param value string|number|boolean|nil
function store.set(key, value) end

---Which town store is now: an opaque text that changes when the town does ("v:..." away from home), nil before a town is loaded. Compare it to reload what you keep in locals when the player moves to another town.
--- Since: api 2
---@return string|nil
function store.town() end

---The per-browser store (the store of api 1): the same get and set and caps, one per mod per browser whatever town is loaded.
---@class PlayacStoreClient
store.client = {}

---A value this mod saved in this browser, or nil.
--- Since: api 2
---@param key string
---@return string|number|boolean|nil
function store.client.get(key) end

---Saves a value in this browser; nil deletes it. 8 KB per mod.
--- Since: api 2
---@param key string
---@param value string|number|boolean|nil
function store.client.set(key, value) end

---The mod's settings from mod.json "settings", as the player set them on the Mods tab (read at boot).
---@class PlayacSettings
settings = {}

---A setting's value: the player's, else the default. A boolean, an integer or a string; nil for a name the mod does not declare.
--- Since: api 2
---@param name string
---@return boolean|integer|string|nil
function settings.get(name) end

---Calls between mods: one mod offers named functions, another calls them. Values are deep copies (nil, booleans, numbers, strings and tables of them; 64 KB, 16 levels, 4096 values, 8 results); the callee runs on the CALLER's budget and clock (over it, the caller is stopped), and a call into a mod that is already running is refused.
---@class PlayacRemote
remote = {}

---Offers a function to other mods, while the script loads. Names are 1 to 32 of a-z 0-9 _, at most 32 per mod. With mod.json "exports", only the names it lists.
--- Since: api 2
---@param name string
---@param fn function
function remote.add(name, fn) end

---Calls a function another running mod offers. Its errors come back as yours; it keeps running.
--- Since: api 2
---@param mod string
---@param name string
---@param ... any Copied arguments.
---@return any
function remote.call(mod, name, ...) end

---Whether a running mod offers that function.
--- Since: api 2
---@param mod string
---@param name string
---@return boolean
function remote.has(mod, name) end

---The commands: each queues an effect the game applies between frames. Each needs its name in mod.json permissions. In The City every command, and on a visit send_letter and give_item, return nil and the reason at once and count against no daily cap; one queued at home and applied after the player left comes back as a refused command_result and its count is given back.
---@class PlayacCmd
cmd = {}

---Queues a letter in the player's own mailbox (the post office keeps it when the mailbox is full). The save holds an ordinary letter, so it loads without the mod.
--- Since: api 2
---@param t table { text, item?, from?, paper? } or { template }: text 1 to 192 characters fitting 6 lines; item a number or "0x" and four hex digits; from 1 to 8 characters ("A friend"); paper 0 to 63. template: one of this mod's own letters.json letters, by its id or "<this mod's id>:<id>" (header, body, sign-off, present and paper all come from it).
---@return integer|nil
function cmd.send_letter(t) end

---Queues an item into the first empty pocket; with full pockets it comes by letter. Also takes this mod's own new item by its full id (author.mod:thing, given with its identity, as a shop sells it); full pockets refuse that one.
--- Since: api 2
---@param item integer|string|table An item number, "0x" and four hex digits, this mod's "author.mod:thing", or { item, from? }.
---@return integer|nil
function cmd.give_item(item) end

---Queues one of this mod's own flags into this TOWN's store (see store) as flag:<key>; the store's 8 KB cap applies. A flag belongs to the town it was set in: visiting a friend it lasts only the visit, and before a town is loaded it is refused. Not in the save.
--- Since: api 2
---@param key string ^[a-z0-9_.-]{1,32}$
---@param value boolean|integer|string|nil nil clears it; text at most 64 bytes.
---@return integer|nil
function cmd.set_flag(key, value) end

---Queues a line in the player's own thought window, shown once the player is free. One line or question at a time.
--- Since: api 2
---@param text string 1 to 400 bytes.
---@return integer|nil
function cmd.show_line(text) end

---Queues a question with 2 to 4 answers in the player's thought window. The pick comes back as an answer event.
--- Since: api 2
---@param t table { text, choices }: text 1 to 120 characters, choices 2 to 4 answers of 1 to 16 characters.
---@return integer|nil
function cmd.ask(t) end

---This mod's flag in this town (set with cmd.set_flag), or nil.
--- Since: api 2
---@param key string
---@return boolean|integer|string|nil
function flag(key) end

---rng() a number in [0,1); rng(n) 1..n; rng(m, n) m..n. Seeded by the mod, the town, the game day, the event and what the event is about, so a reload gives the same numbers. For an api 2 mod math.random is the same function and math.randomseed is removed; an api 1 mod keeps Lua's own math.random.
--- Since: api 2
---@param m integer|nil
---@param n integer|nil
---@return number|integer
function rng(m, n) end
