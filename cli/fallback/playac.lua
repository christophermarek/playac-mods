---@meta playac
-- Play AC Online mod script API, mod API level 1.
-- FALLBACK copy shipped with playac-mod. When the game's spec
-- (api/api.json) generates playac.lua, `playac-mod types` uses that
-- one instead. Do not edit: run `npx playac-mod types` to refresh.
--
-- The game runs Lua 5.4 with base, string, table, math, utf8 and coroutine.
-- There is no io, os, debug, package, require, load, dofile, loadfile,
-- collectgarbage, print or string.dump. Each event has a budget of 200k
-- instructions per mod; a script that errors or runs over is stopped for the
-- session and the reason shows in Settings, Mods.

---@alias PlayacEvent "talk"|"day_start"|"item_picked"|"enter_scene"

---A villager the player started talking to.
---@class PlayacNpc
---@field name string The villager's name.
---@field id integer The villager's id (stable for this villager).

---A date in the game's calendar.
---@class PlayacDate
---@field year integer
---@field month integer 1..12
---@field day integer 1..31

---The game clock.
---@class PlayacTime: PlayacDate
---@field hour integer 0..23
---@field minute integer 0..59
---@field weekday integer 0 (Sunday) .. 6

---Add a handler for an event. The event must be listed in mod.json
---"scripts.hooks". Only while the script loads (not inside a handler); at most
---16 handlers per event.
---
---`talk`: return a string to say it before the villager's own hello, or nil.
---The first mod in load order that returns a line wins that talk.
---`day_start`: once per new day (also when the game boots on a new day).
---`item_picked`: the item id, after it is in the pockets.
---`enter_scene`: the scene number.
---@overload fun(event: "talk", handler: fun(npc: PlayacNpc): string?)
---@overload fun(event: "day_start", handler: fun(date: PlayacDate))
---@overload fun(event: "item_picked", handler: fun(item: integer))
---@overload fun(event: "enter_scene", handler: fun(scene: integer))
---@param event PlayacEvent
---@param handler function
function on(event, handler) end

---Write a line to the mod log (Settings, Mods, and the browser console as
---"[Mods] <id>: ..."). At most 20 lines per event and 500 per session.
---@param ... any
function log(...) end

---A line from this mod's messages file, or another mod's as "other.mod:key".
---nil when there is no such line.
---@param key string
---@return string?
function message(key) end

---The game.
game = {}

---The game's clock now.
---@return PlayacTime
function game.time() end

---This mod's saved values: one store per mod per browser, 8 KB in all.
---Strings, numbers and booleans; integers come back as integers.
store = {}

---@param key string
---@return string|number|boolean|nil
function store.get(key) end

---Save a value (nil deletes it). A set that would pass 8 KB is refused.
---@param key string
---@param value string|number|boolean|nil
function store.set(key, value) end
