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
