# The mod API

- [`api.json`](api.json): the one machine-readable description of everything a mod
  may use: every `mod.json` key, every file format, every limit, every Lua global,
  event and command, and the api level each arrived in. Nothing outside it is
  promised. The same file is served at https://playaconline.com/schemas/api.json.
- `*.schema.json`: JSON Schema (draft-07) for each mod file. `mod.json` and
  `shops.json` may name theirs with `"$schema"`; map the others in your editor's
  settings.
- [`playac.lua`](playac.lua): Lua language server annotations: types and hover
  docs for every global, and an `on()` overload per event.
- [`items.json`](items.json): every item and piece of furniture, its price, and
  whether each mod shop may stock it.

The game reads mods made for api levels 1 to 2. A mod names its level
in `mod.json` (`"api"`) and is checked by that level's rules. Reference:
https://playaconline.com/modding/reference/; what changed: https://playaconline.com/modding/changelog/.
