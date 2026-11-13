-- My Script: the four everyday events in one file, with a little saved data.
-- Every event used here is listed in mod.json under "scripts" > "hooks".
-- log() lines show in Settings, Mods, Mod log, and in the browser console as
-- "[Mods] yourname.my-script: ...". At "api": 2 there are more events
-- (fish_caught, shop_buy, letter_read and others): see the scripts guide.

-- The main chunk runs once, when the game starts, BEFORE any town is loaded.
-- Register handlers here. Do not read the store here: store is kept per town,
-- so store.get answers nil until a town is loaded. Read it inside events.
log("loaded")

-- A new day in the game (also when the game starts on a new day). A restart
-- later on a day the town already saw does not fire it again, so the day is
-- counted by date, not by call.
on("day_start", function(date)
  local today = string.format("%04d-%02d-%02d", date.year, date.month, date.day)
  if store.get("last_day") ~= today then
    store.set("last_day", today)
    store.set("days", (store.get("days") or 0) + 1)
  end
  log("day", today, "days seen in this town:", store.get("days"))
end)

-- You picked an item up. It is already in your pockets.
on("item_picked", function(item)
  local n = (store.get("picked") or 0) + 1
  store.set("picked", n)
  log(string.format("picked item 0x%04X (%d so far)", item, n))
end)

-- The game entered a scene (outdoors, a house, a shop and so on).
on("enter_scene", function(scene)
  log("scene", scene)
end)

-- You started talking to a villager. Return text to have them say it first,
-- or nil to leave the talk alone. This one speaks once per play session.
local greeted = false
on("talk", function(npc)
  if greeted then return nil end
  greeted = true
  return message("first_talk")
end)
