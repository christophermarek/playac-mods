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
