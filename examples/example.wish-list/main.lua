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
