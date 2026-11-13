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
