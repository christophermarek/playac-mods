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
