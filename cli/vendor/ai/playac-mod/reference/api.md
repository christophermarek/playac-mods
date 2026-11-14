# Mod API reference

Generated from https://playaconline.com/schemas/api.json, the mod API spec. Do not edit by hand.

This game reads mod API levels 1 to 2. Put `"api": 2` in a new mod.json.

- Level 1 (2026-11-12): The first level: textures, lines, the flower shop, and scripts with four events, log, message, game.time and a per-browser store.
- Level 2 (2026-11-12): Mod items: an items file (content.items) of new furniture on a vanilla base, renames, and mod items in a shop's stock. Also: a per-town store (store.client keeps the per-browser one), data_version and the migrate event, settings, translations in a messages folder, depends and conflicts with version ranges, and remote calls between mods. And the typed targets: Nook's stock (shops target nook), letter templates (content.letters), dated events (content.events) and villager line pools (content.talk). Effects: commands (cmd.send_letter, give_item, set_flag, show_line, ask) queued by a hook and applied at the end of a frame's update, declared in permissions; ten more events; read-only queries (game.pockets, bells, town, villagers, player); flag() and a seeded rng().

## mod.json

| key | required | what | example |
|---|---|---|---|
| `$schema` | no | Optional. The JSON Schema an editor checks mod.json against, for autocomplete and errors as you type. The game ignores it. since api 1 | `"https://playaconline.com/schemas/mod.schema.json"` |
| `schema` | yes | The manifest format. Always 1. since api 1 | `1` |
| `api` | yes | The mod API level the mod is made for. The game checks a mod by the rules of its own level, and runs an older level through shims while that level is supported. Use the newest level. since api 1 | `2` |
| `id` | yes | author.mod-name: lowercase letters, digits and dashes, one dot. The author part playaconline, official, admin and example are reserved for the site's own mods in the registry. since api 1 | `"yourname.tea-house"` |
| `name` | yes | The name players see, 1 to 60 characters (after trimming spaces). since api 1 | `"Tea House"` |
| `version` | yes | x.y.z, each part 1 to 9 digits with no leading zero. Every upload needs a version number this mod has not used yet (a refused upload's number can be used again). since api 1 | `"1.0.0"` |
| `authors` | yes | 1 to 8 names, each 1 to 40 characters. since api 1 | `["Your Name"]` |
| `description` | no | Optional text of at most 500 characters. null is refused: leave the key out instead. since api 1 | `"The flower shop becomes a tea house in the evening."` |
| `tags` | no | Optional. The mod list's filters: at most 5 different tags from a fixed list, lower case. Players filter Player mods by them; the game never reads them. Anything else is refused (manifest-tags). since api 1 | `["textures","seasonal"]` |
| `scope` | yes | client: only you see it. world: it changes what a visitor to your town would see. Only a world mod may hold a shop (content.shops) or, from api 2, an events file with a board notice. A friend visit needs the same world mods that count (see visit_scope) on both sides. since api 1 | `"client"` |
| `content` | no | What the mod adds, each a path inside the mod. textures, messages and shops; from api 2 also items, letters, events and talk. Anything else is refused. From api 2, messages may name a folder of translations (en.json required; de es fr it). since api 1 | `{"messages":"messages/en.json"}` |
| `scripts` | no | A Lua script and the events it listens to. From api 2 hooks may also list migrate (needs data_version). since api 1 | `{"main":"main.lua","hooks":["talk","day_start"]}` |
| `permissions` | no | The commands the mod's script may queue, each once. The game refuses any command the list leaves out, and the Mods tab and the moderators' review show what the list lets the mod do. Needs scripts. At api 1 the key is unknown and grants nothing. since api 2 | `["send_letter"]` |
| `exports` | no | A library's remote functions, by name, each with a one-line description: what other mods may remote.call. At most 32 names (1 to 32 of a-z 0-9 _), descriptions 1 to 120 characters on one line. Declared, the game lets remote.add offer only these names, and says in the mod log when a listed name was never offered. playac-mod types turns a dependency's exports into editor hints for the mods that depend on it. Needs scripts. At api 1 the key is unknown and does nothing. since api 2 | `{"count_pieces":"How many workshop pieces the player bought, as a whole number."}` |
| `assets_original` | yes | Must be true: your promise that the mod holds only work its authors made, never files taken from the game. since api 1 | `true` |
| `renames` | no | Old full item id to a full id of an item in this mod's items file, at most 64. Needs content.items. Each rename runs once per save (the sidecar records it), so a renamed item already in a house keeps working. since api 2 | `{"yourname.tea-house:old-cup":"yourname.tea-house:cup"}` |
| `depends` | no | Mods this one needs, mod id to version range ("*", or up to 4 of >= <= > < = and a version split by one space). At most 16. It loads after them, and not at all when one is missing, off, out of range or not loading. The game checks it again when it starts: a mod whose dependency is not loaded before it, in range, is not loaded at all. since api 2 | `{"yourname.tea-lib":">=1.0.0 <2.0.0"}` |
| `conflicts` | no | Mods this one cannot run with, mod id to version range. At most 16; an id may not also be in depends. This mod stays off while a matching one is on. since api 2 | `{"someone.other-shop":"*"}` |
| `data_version` | no | A whole number 1 to 1000000 for the shape of what the scripts save. When it changes, the migrate event runs once per town. The migrate hook needs it. since api 2 | `1` |
| `settings` | no | At most 16 settings the player sets on the Mods tab and scripts read with settings.get. Types bool, number (whole, min and max), choice (2 to 16 choices) and text (max_length 1 to 200). A world mod's values are part of the visit modset hash. since api 2 | `[{"name":"greet","type":"bool","label":"Say hello","default":true}]` |

Reserved keys, refused at every api level: `game`, `save`. Built at a later level and refused only below it: `depends` (api 2), `conflicts` (api 2). Top-level keys reserved for planned features. A key not built at a mod's api level is refused, even when null, so no mod carries one a later game would start obeying. depends and conflicts are built from api 2 (refused only at api 1); game and save are refused at every level.

### Rules across keys

- content.shops requires scope world.
- Unknown top-level keys are ignored, except the unbuilt keys, which are refused. Keys are case-sensitive.
- In every JSON file: duplicate keys and \u0000 are refused.
- A mod may hold only these file types (case-insensitive).
- All mods share 4 ms of Lua time a frame. Past it, every game event without an answer (day_start, item_picked, enter_scene and the events level 2 adds) waits for the next frame (in order for each mod, at most 64 waiting; past that one is dropped), and talk is skipped for the rest of that frame, so the villager says their own greeting. A mod with events still waiting is not asked for a talk until they ran (the next mod is), so each mod sees its own events in the order they happened. A remote.call into a mod is not one of its events: it runs at once, inside the caller's event. command_result and answer wait too but are never dropped or skipped, and a command queued by a command_result handler is applied at the next frame boundary, not the one that delivered the result; migrate runs when a town is bound, outside the cap.
- content.items and renames are api 2 keys: a mod.json that says "api": 1 is checked by level 1's rules, where they are not keys a mod can use.
- scripts.hooks may list migrate only with a data_version.
- A mod id may not be in both depends and conflicts, nor name the mod itself.
- A world mod that declares settings adds +<sha256 of "name=value\n" per setting, sorted> to its modset line. The visit's list of mods carries that hash and the values too, so two towns on one mod with different settings are told "same mod, different settings".
- Which mods a friend visit compares: a client mod never counts. A world mod counts if its content has textures, shops or items (visit_scope_content), or if its permissions (an api 2 key: ignored at api 1) list any command outside send_letter, give_item, set_flag, show_line and ask, or are not a list of strings. Every other world mod (only lines, letters, events or talk pools, with only those commands) does not count. Only mods that count must match between the two towns.
- The content keys that make a world mod count for visits, whatever its permissions: what a visitor must draw or meet in the town. items from api 2.
- What needs scope world, because it changes the town a visitor sees: a shops file (content.shops), and from api 2 an events file with a board notice. Everything else may be client (only you see it) or world.
- When two mods change the same thing, the LAST in load order wins: a texture with the same name, and each shop target (the flower shop, Nook's).
- The talk event goes to mods in load order and the FIRST handler that returns a line wins that talk; later mods' talk handlers are not asked.
- Developer mode (a mod loaded from a folder or from playac-mod dev) reloads these while you play, with no restart: the content files named here, any .lua script ("scripts") and the files under content.textures. Each value is a content key, or "scripts".
- Developer mode loads a change to these only when the game restarts: mod.json (read once at start, and so is a file added or removed) and the content files named here. Each value is "mod.json" or a content key.
- Visiting with the host's mods: when every world mod of the host that counts is a reviewed registry version, a visitor can load them for that visit only, after agreeing. They run with the host's settings (each mod's values travel with the visit, are checked against what its mod.json allows, and are never kept on the visitor's game). A text setting the host changed from its default must pass the site's word checks (no rude words, contact details or risky phrases), or the visit is refused instead of lent. Nothing is installed, the game restarts with them, and their scripts start with an empty store that is never saved. A lent mod acts only in the host's town: at home (the restart before the trip and the one after it) its shop, Nook goods, board notices, items, renames and commands do nothing, so it never changes the visitor's own town or save. A mod installed from a file cannot be lent, nothing is lent while mods are switched off for everyone, and a set that would not load whole on the visitor's game (with the visitor's own client mods, under the same caps) is refused before the restart.
- The City's own mod set: a short list chosen by the site and changed only with a release. A City mod may hold only textures and messages: no shops, no scripts, no permissions.
- content.letters, content.events, content.talk and shops target "nook" are api 2: a mod.json that says "api": 1 cannot use them.
- An events file with a board notice requires scope world (the board is the town's, a visitor reads it).
- An events file's "letter" goes out once per event per day per town, only in the player's own town (not on a visit, not in The City), and counts against the mod's daily send_letter cap; a refusal is written to the mod log, never to a script.
- The characters the game's font draws in a mod's lines (messages, talk lines, shop greetings, show_line and ask): every printable ASCII character except $ * ^ | \ (each drawn as ?), with # + / ; drawn by the font's own signs, [ ] { } as ( ), ` as ' and ~ as the villagers' wavy tilde; plus the letters and signs listed here. Curly quotes, dashes, the ellipsis and a no-break space become their ASCII spelling; any other character is drawn as ?. Letters and board notices take plain ASCII only. values: the extra characters, from the font's own table.
- permissions requires scripts: only a script can use a command.
- exports requires scripts: only a script offers functions.
- A hook never changes the game. Each cmd.* call queues a command; the game applies the queue at one point in each frame, at the end of the game's update for a frame (after the world moves, before that frame is drawn), only while the player is free (not in a talk, menu, cutscene, door or scene change). Its result comes back as a command_result event to the mod that queued it.
- Every command is refused in The City. Visiting a friend's town, send_letter and give_item are refused (only the town owner's game changes a town); set_flag, show_line and ask still run.
- A letter's present and a given item follow the shop's item rules: no money, turnips, tickets, grab bags, fossils or reserve ids. give_item also takes this mod's own new item by its full id; full pockets refuse that (a letter cannot carry its identity), while a plain item comes by letter instead.

## Files

### shops (`content.shops`)

Restocks and rewords a shop. The flower shop, and from api 2 Nook's (target nook: goods added to or replacing the day's roll per spot kind, every store size, from the next restock; off in the City). The game itself (not the page or the registry) refuses goods with no shelf model, money, turnips, tickets, grab bags, fossils and reserve ids, and raises a price below the item's buy-back to the buy-back. items.json lists what may be stocked. From api 2 a good may be an item of the same mod (its full id); without a price it takes the item's price. (since api 1)

Schema:

```json
{
  "type": "object",
  "required": [
    "shops"
  ],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "shops": {
      "type": "array",
      "minItems": 1,
      "maxItems": 4,
      "items": {
        "type": "object",
        "required": [
          "target",
          "stock"
        ],
        "properties": {
          "target": {
            "enum": [
              "flower",
              "nook"
            ],
            "description": "Which shop: \"flower\", or \"nook\" (api 2). One shop per target. A nook entry takes only mode and stock."
          },
          "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 40,
            "description": "The shop's name on its sign: one line (no line break).",
            "pattern": "^[^\\n]*$"
          },
          "hours": {
            "type": "object",
            "required": [
              "open",
              "close"
            ],
            "properties": {
              "open": {
                "type": "string",
                "pattern": "^([01][0-9]|2[0-3]):[0-5][0-9]$"
              },
              "close": {
                "type": "string",
                "pattern": "^([01][0-9]|2[0-3]):[0-5][0-9]$"
              }
            },
            "description": "HH:MM, open and close different. Close may be past midnight. Hours can only shorten the shop's own."
          },
          "greeting": {
            "type": "string",
            "minLength": 1,
            "maxLength": 160,
            "description": "What the keeper says first. At most 3 line breaks."
          },
          "stock_line": {
            "type": "string",
            "minLength": 1,
            "maxLength": 160,
            "description": "What the keeper says about the stock. At most 3 line breaks."
          },
          "stock": {
            "type": "array",
            "minItems": 1,
            "maxItems": 16,
            "items": {
              "type": "object",
              "required": [
                "item"
              ],
              "properties": {
                "item": {
                  "type": "string",
                  "description": "The item id as a string, \"0x\" and 4 hex digits; from api 2 also the full id of an item in this mod's items file (author.mod:thing). Listed at most once; two mod items may not share a base.",
                  "anyOf": [
                    {
                      "pattern": "^0x[0-9a-fA-F]{4}$"
                    },
                    {
                      "pattern": "^([a-z0-9][a-z0-9-]{0,31}\\.[a-z0-9][a-z0-9-]{0,47}):([a-z0-9][a-z0-9-]{0,31})$"
                    }
                  ]
                },
                "price": {
                  "type": "integer",
                  "minimum": 1,
                  "maximum": 99999,
                  "description": "Bells. Leave out for the game's own price."
                }
              }
            },
            "description": "The flower shop: 1 to 6 goods, one per table spot. Nook's: 1 to 16 goods, each in a spot of its own kind."
          },
          "mode": {
            "enum": [
              "add",
              "replace"
            ],
            "description": "Nook's only: \"add\" (default) puts the goods in at most half of each kind's spots, \"replace\" in all of them."
          }
        },
        "allOf": [
          {
            "description": "The flower shop sells at most 6 goods (one per table spot); Nook's up to 16.",
            "if": {
              "required": [
                "target"
              ],
              "properties": {
                "target": {
                  "const": "flower"
                }
              }
            },
            "then": {
              "properties": {
                "stock": {
                  "maxItems": 6
                }
              }
            }
          }
        ]
      }
    }
  }
}
```

### messages (`content.messages`)

Lines a script or another mod can use, by key. A script reads its own with message("key"), another mod's with message("author.mod:key"). This file cannot carry a $schema key (every key is a line): point your editor at messages.schema.json in its settings instead. From api 2, content.messages may name a folder of <lang>.json files instead (en.json required; de, es, fr, it), each by these rules, a translation holding only keys en.json has. (since api 1)

Schema:

```json
{
  "type": "object",
  "maxProperties": 256,
  "propertyNames": {
    "pattern": "^[a-z0-9_.-]{1,48}$"
  },
  "additionalProperties": {
    "type": "string",
    "minLength": 1,
    "description": "1 to 400 UTF-8 bytes. Lines wrap at 24 characters, 4 lines a page."
  }
}
```

### textures (`content.textures`)

A folder of replacement textures, named the way Dolphin names a custom texture. A mod's texture beats the HD pack; among mods, the one lower in the list wins. Use the texture inspector (Settings, Mods, Developer) to find a texture's name. (since api 1)

### scripts (`scripts.main`)

Lua 5.4 source text (bytecode is refused), run once when the game starts. It registers handlers with on() and returns nothing. One Lua state per mod; mods cannot see each other's globals. (since api 1)

### items (`content.items`)

New furniture, each on a vanilla base piece (api 2). The engine also refuses a base with no model, fossils, gyroids, clothing, design pieces and pieces that become a pocket item. In the save a mod item is its base piece; a sidecar maps it back, so removing the mod leaves the base piece behind and reinstalling restores it. (since api 2)

Schema:

```json
{
  "type": "object",
  "required": [
    "items"
  ],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "items": {
      "type": "array",
      "minItems": 1,
      "maxItems": 64,
      "items": {
        "type": "object",
        "required": [
          "id",
          "name",
          "base"
        ],
        "additionalProperties": false,
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9][a-z0-9-]{0,31}$",
            "description": "The item's own id; its full id is <mod id>:<id>."
          },
          "name": {
            "type": "string",
            "pattern": "^[A-Za-z0-9](?:[A-Za-z0-9 '.,!&-]{0,14}[A-Za-z0-9'.,!&-])?$",
            "description": "1 to 16 of letters, digits, space and ' . , ! & -, starting with a letter or digit, not ending with a space."
          },
          "base": {
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{4}$",
            "description": "A south-facing furniture id: 0x1000 to 0x1FFC or 0x3000 to 0x33C4, a multiple of 4."
          },
          "price": {
            "type": "integer",
            "minimum": 1,
            "maximum": 99999,
            "description": "Bells. Leave out for the base piece's price."
          }
        }
      }
    }
  }
}
```

### mod-items sidecar (`none (engine-owned)`)

/save/card_a/mod-items.json, written by the engine beside the home save, never by a mod: which placed or carried base pieces are which mod item, and which renames have run. It rides in the cloud save and a friend visit's town copy. A mod never reads or writes it. (since api 2)

### letters (`content.letters`)

Letter templates a mod command (send_letter) mails through the mailbox, named "<mod id>:<letter id>". The game wraps the body at the paper's width in its own font and refuses one that needs more than 6 lines, and refuses a present that is money, turnips, a ticket, a grab bag, a fossil or not an item. Either scope. (since api 2)

Schema:

```json
{
  "type": "object",
  "required": [
    "letters"
  ],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "letters": {
      "type": "array",
      "minItems": 1,
      "maxItems": 32,
      "items": {
        "type": "object",
        "required": [
          "id",
          "header",
          "body",
          "footer"
        ],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9_.-]{1,48}$",
            "description": "Unique in the file."
          },
          "header": {
            "type": "string",
            "minLength": 1,
            "maxLength": 32,
            "description": "1 to 24 characters besides at most one {player}, where the name goes. No line break. Plain text: printable ASCII, no { or }."
          },
          "body": {
            "type": "string",
            "minLength": 1,
            "maxLength": 192,
            "description": "1 to 192 characters on at most 6 lines. Plain text: printable ASCII, no { or }."
          },
          "footer": {
            "type": "string",
            "minLength": 1,
            "maxLength": 32,
            "description": "The sign-off at the foot of the letter, 1 to 32 characters. Plain text: printable ASCII, no { or }. The mailbox list shows only its first 8 characters unless the letter has a sender."
          },
          "sender": {
            "type": "string",
            "minLength": 1,
            "maxLength": 8,
            "description": "Optional: the name in the mailbox list, 1 to 8 characters (the list has room for 8). Without it the list shows the footer's first 8 characters, so \"The Lantern Keepers\" reads \"The Lant\". The letter itself always signs with the whole footer. Plain text: printable ASCII, no { or }."
          },
          "item": {
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{4}$",
            "description": "A present, optional."
          },
          "paper": {
            "type": "integer",
            "minimum": 0,
            "maximum": 63,
            "description": "The stationery, default 0."
          }
        }
      }
    }
  }
}
```

### events (`content.events`)

Dated town days with safe effects only: a notice on the town bulletin board, posted once on the day in the player's own town (never on a visit or in the City; needs scope world), villager lines for the day, ahead of talk pools, and a letter from the same mod's letters file, mailed once on the day to the player's mailbox in their own town (never on a visit or in the City), counted against the mod's daily letter cap, with no script. No decorations: the game has no data seam for them. (since api 2)

Schema:

```json
{
  "type": "object",
  "required": [
    "events"
  ],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "events": {
      "type": "array",
      "minItems": 1,
      "maxItems": 16,
      "items": {
        "type": "object",
        "required": [
          "id",
          "date"
        ],
        "anyOf": [
          {
            "required": [
              "board"
            ]
          },
          {
            "required": [
              "talk"
            ]
          },
          {
            "required": [
              "letter"
            ]
          }
        ],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9_.-]{1,48}$",
            "description": "Unique in the file."
          },
          "date": {
            "type": "object",
            "required": [
              "month"
            ],
            "description": "{month, day} (February 29 works) or {month, week 1 to 4 or \"last\", weekday 0 Sunday to 6}.",
            "properties": {
              "month": {
                "type": "integer",
                "minimum": 1,
                "maximum": 12
              },
              "day": {
                "type": "integer",
                "minimum": 1,
                "maximum": 31
              },
              "week": {
                "anyOf": [
                  {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4
                  },
                  {
                    "enum": [
                      "last"
                    ]
                  }
                ]
              },
              "weekday": {
                "type": "integer",
                "minimum": 0,
                "maximum": 6
              }
            }
          },
          "board": {
            "type": "string",
            "minLength": 1,
            "maxLength": 192,
            "description": "A bulletin board notice: 1 to 192 characters on at most 6 lines. Plain text: printable ASCII, no { or }. Needs scope world."
          },
          "talk": {
            "type": "array",
            "minItems": 1,
            "maxItems": 16,
            "items": {
              "type": "string",
              "minLength": 1,
              "maxLength": 160,
              "description": "A villager line: 1 to 160 characters, at most 3 line breaks."
            }
          },
          "letter": {
            "type": "string",
            "pattern": "^[a-z0-9_.-]{1,48}$",
            "description": "The id of a letter in this mod's letters file, mailed on the day: once per town per day, the first time the player is free in their own town, through the same rules as cmd.send_letter (mailbox, else the post office; counted against the daily letter cap). No permission or script needed."
          }
        }
      }
    }
  }
}
```

### talk (`content.talk`)

Villager line pools: on an ordinary talk (never a special or event talk) where no script said a line, a villager says at most one data line a day (today's event lines first, else the most specific matching pools: this villager, else this personality, else everyone), then their own hello. Either scope; runs in the City too. (since api 2)

Schema:

```json
{
  "type": "object",
  "required": [
    "pools"
  ],
  "properties": {
    "$schema": {
      "type": "string"
    },
    "pools": {
      "type": "array",
      "minItems": 1,
      "maxItems": 32,
      "items": {
        "type": "object",
        "required": [
          "lines"
        ],
        "properties": {
          "personality": {
            "enum": [
              "normal",
              "peppy",
              "lazy",
              "jock",
              "cranky",
              "snooty"
            ],
            "description": "Not with villager."
          },
          "villager": {
            "type": "string",
            "minLength": 1,
            "maxLength": 8,
            "description": "A villager's name, any case. Not with personality."
          },
          "chance": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "description": "Days in 100 the pool speaks to a villager. Default 100."
          },
          "lines": {
            "type": "array",
            "minItems": 1,
            "maxItems": 32,
            "items": {
              "type": "string",
              "minLength": 1,
              "maxLength": 160,
              "description": "A villager line: 1 to 160 characters, at most 3 line breaks."
            }
          }
        }
      }
    }
  }
}
```

## Lua globals

| name | params | returns | what |
|---|---|---|---|
| `on` | event: string, fn: function | nil | Registers a handler for an event, while the mod's own script loads (not from inside a handler, nor from a function another mod calls with remote.call). The event must be in mod.json's scripts.hooks. At most 16 handlers per event. since api 1 |
| `log` | ...: any | nil | Writes a line to the Mods tab's Mod log and the browser console as "[Mods] <id>: ...". Arguments are joined with spaces; a line is cut at 300 bytes. At most 20 lines per event and 500 per session. A script error or stop is written to the Mod log too, with a Lua traceback. since api 1 |
| `message` | key: string | string\|nil | A line from a messages file: "key" reads this mod's own, "author.mod:key" another mod's. nil when there is no such line. From api 2 a mod's messages can be a folder of translations: the line comes in the game's language (en, de, es, fr or it, from the disc), with English as the fallback. since api 1 |
| `game` |  |  | Read-only facts about the game. since api 1 |
| `store` |  |  | A small saved table per mod, per TOWN (from api 2): strings, numbers and booleans, 8 KB per mod per town. It travels with the town (cloud save, backups, Export with mod data). No town is loaded while the main chunk runs: get answers nil and set refuses. On a visit or in the City it lives in memory only. Written to disk when the game saves. A mod that says "api": 1 keeps level 1's store: one per browser (store.client's), usable from the main chunk too. since api 1 |
| `settings` |  |  | The mod's settings from mod.json "settings", as the player set them on the Mods tab (read at boot). since api 2 |
| `remote` |  |  | Calls between mods: one mod offers named functions, another calls them. Values are deep copies (nil, booleans, numbers, strings and tables of them; 64 KB, 16 levels, 4096 values, 8 results); the callee runs on the CALLER's budget and clock (over it, the caller is stopped), its commands count toward the caller's per-event cap, its rng starts from a seed of the caller's event, the callee and the function (the same call in the same event gives the same numbers), and a call into a mod that is already running is refused. since api 2 |
| `cmd` |  |  | The commands: each queues an effect the game applies at the end of a frame's update, before it is drawn. Each needs its name in mod.json permissions. In The City every command, and on a visit send_letter and give_item, return nil and the reason at once and count against no daily cap; one queued at home and applied after the player left comes back as a refused command_result and its count is given back. since api 2 |
| `flag` | key: string | boolean\|integer\|string\|nil | This mod's flag in this town (set with cmd.set_flag), or nil. since api 2 |
| `rng` | m: integer\|nil, n: integer\|nil | number\|integer | rng() a number in [0,1); rng(n) 1..n; rng(m, n) m..n. Seeded by the mod, the town, the game day, the event and what the event is about, so a reload gives the same numbers within a game day. The game day is part of the seed: changing the game's clock gives other numbers. Inside a remote.call the called mod's rng starts from a seed made of the caller's event, the called mod and the function, so it never depends on what that mod did earlier. For an api 2 mod math.random is the same function and math.randomseed is removed; an api 1 mod keeps Lua's own math.random, randomly seeded at each start, so its numbers change on every reload. since api 2 |

- `game.time`(): The game's clock now.
- `game.pockets`(): A copy of the 15 pocket slots, item numbers, 0 for an empty slot.
- `game.bells`(): The wallet, or nil before a town is loaded.
- `game.town`(): The town: { name, id, year, month, day, hour, minute, weekday, season } (season spring, summer, autumn or winter), or nil.
- `game.villagers`(): The town's villagers: { { id, name, species, personality }, ... }; personality normal, peppy, lazy, jock, cranky or snooty.
- `game.player`(): { name }, or nil.
- `game.events_today`(): The ids of this mod's own events (its events file) that fall on the town's date today, in file order: {} when none, or before a town is loaded. Only the calling mod's events.
- `store.get`(key: string): A value this mod saved in this town, or nil (nil while the main chunk runs). Integers come back as integers.
- `store.set`(key: string, value: string|number|boolean|nil): Saves a string, number or boolean under a key in this town; nil deletes it. Keys up to 64 bytes, strings up to 1024. A set that would take this town's store over 8 KB, or one before a town is loaded (the main chunk), raises an error and changes nothing.
- `store.town`(): Which town store is now: an opaque text that changes when the town does ("v:..." away from home), nil before a town is loaded. Compare it to reload what you keep in locals when the player moves to another town.
- `store.client`: The per-browser store (the store of api 1): the same get and set and caps, one per mod per browser whatever town is loaded.
- `settings.get`(name: string): A setting's value: the player's, else the default. A boolean, an integer or a string; nil for a name the mod does not declare.
- `remote.add`(name: string, fn: function): Offers a function to other mods, while the script loads. Names are 1 to 32 of a-z 0-9 _, at most 32 per mod. With mod.json "exports", only the names it lists.
- `remote.call`(mod: string, name: string, ...: any): Calls a function another running mod offers. Its errors come back as yours; it keeps running.
- `remote.has`(mod: string, name: string): Whether a running mod offers that function.
- `cmd.send_letter`(t: table): Queues a letter in the player's own mailbox (the post office keeps it when the mailbox is full). The save holds an ordinary letter, so it loads without the mod.
- `cmd.give_item`(item: integer|string|table): Queues an item into the first empty pocket; with full pockets it comes by letter. Also takes this mod's own new item by its full id (author.mod:thing, given with its identity, as a shop sells it); full pockets refuse that one.
- `cmd.set_flag`(key: string, value: boolean|integer|string|nil): Queues one of this mod's own flags into this TOWN's store (see store) as flag:<key>; the store's 8 KB cap applies. A flag belongs to the town it was set in: visiting a friend it lasts only the visit, and before a town is loaded it is refused. Not in the save.
- `cmd.show_line`(text: string): Queues a line in the player's own thought window, shown once the player is free. One line or question at a time.
- `cmd.ask`(t: table): Queues a question with 2 to 4 answers in the player's thought window. The pick comes back as an answer event.
## Events (scripts.hooks)

| event | gets | return | when |
|---|---|---|---|
| `talk` | npc: table { name, id } | string\|nil | The player starts an ordinary talk with a villager. Special and event talks never reach mods (a first meeting, a villager moving out, one with an errand, delivery or contest going with you, a complaint, a pitfall or a bee chase, an islander, Kamakura, summer camp): no handler is called for them, and the villager's next ordinary talk calls it as usual, so a line a script is keeping for "the next talk" waits for that one. Return a line and the villager says it before their usual greeting; return nil to stay quiet. The FIRST mod in load order whose handler returns a line wins that talk; later mods' talk handlers are not called for it. An empty string, a line over 400 bytes or one holding a zero byte is not a line: it is logged and the next mod is asked. since api 1 |
| `day_start` | date: table { year, month, day } | nil | A new day begins in the game, once per day, also when the game starts on a new day. It does not fire again when the game restarts later on a day the town already saw: the save holds the day it last began. If the game was not saved since that day began, the save still holds the day before, so the next start fires it again. Count days by storing the last date you saw, not by counting calls. since api 1 |
| `item_picked` | item: integer The item id (items.json). | nil | The player got an item: picked it up, caught it with the net or rod, or dug it up. Fires after it is in their pockets. since api 1 |
| `enter_scene` | scene: integer The scene number. | nil | A scene (the town, a house, a shop) starts. Not in the title demo. since api 1 |
| `migrate` | from: integer, to: integer | nil | Once per town, when mod.json "data_version" differs from the version the town's data was written at. It runs when the town is first used, not at the restart: at the first event in that town that any running mod handles, before that event's handlers run. So a mod that handles only talk (and no other mod handles an earlier event) migrates at the first talk; list enter_scene in scripts.hooks and handle it (an empty handler is enough) to migrate as the town loads. from is 0 for data from before data_version (or moved from the per-browser store). If it errors the script stops and the version stays, so the next start tries again. Migrations run in load order, and a remote.call from a migrate handler into a mod whose own migrate has not run in that town yet is refused. Needs data_version. since api 2 |
| `hour_change` | e: table { year, month, day, hour } | nil | The game's clock reached a new hour (the game's own hourly event update, midnight included). since api 2 |
| `shop_buy` | e: table { item, price, shop, ordered, mod_item } | nil | The player bought a good for Bells, as the seller takes the price, at any counter in the game. shop says which: "nook" (Nook's in every size, the City's Nookington's too), "flower" (the flower shop), "redd" (Crazy Redd), "saharah" (her carpet, swapped for one of yours and Bells), "joan" (turnips), "fireworks" (the fireworks show's stall), "shrine" (the New Year fortune slip), "gyroid" (what another player put up at their gyroid) or "villager" (a villager selling you something). Test e.shop == "nook" to keep to Nook's. item is the good's item number; price the Bells paid. ordered is true for a Nook's catalog order: paid now and mailed tomorrow, so it is not in the pockets yet. mod_item is the full id ("author.mod:thing") when the piece is a mod item (the base furniture it stands on is item), nil for a plain good; only Nook's and the flower shop sell mod items. A visitor buying in a friend's town gets a plain piece, so nil. Paid services that hand over no good (the barber, Katrina, the Dream Suite, an Able Sisters design) are not purchases and do not fire it. since api 2 |
| `item_sold` | e: table { item, count, bells, shop, mod_item } | nil | The player sold for Bells, once the wallet is credited. shop says to whom: "nook" (Nook's in every size, the City's Nookington's too) or "villager" (a villager buying something from your pockets); nobody else in the game buys. item is the first good, count how many went, bells what they fetched; mod_item is the first good's full id when it is a mod item, nil otherwise. What another player buys at your gyroid does not fire it: the gyroid hands you the takings later as one sum, with no record of what sold. since api 2 |
| `fish_caught` | e: table { item, pocketed } | nil | A fish was landed; pocketed says whether it went into the pockets. There is no size or length: the game keeps none for a caught fish (each kind has one fixed shadow size, and only the fishing tourney makes up a length, when the fish is shown to its host). since api 2 |
| `bug_caught` | e: table { item, pocketed } | nil | A bug was netted; pocketed says whether it went into the pockets. since api 2 |
| `letter_read` | e: table { sender, present, first_time } | nil | The player chose Read on a letter. since api 2 |
| `villager_moved_in` | e: table { id, name } | nil | A villager with no house was given one (the game start after a move-in; a brand-new town fires it for its first villagers). since api 2 |
| `visitor_arrived` | e: table { kind } | nil | A friend is riding into this player's own town (a friend visit, host side). kind is "friend". since api 2 |
| `command_result` | e: table { id, command, ok, error, via } | nil | A command this mod queued was applied or refused. via: mailbox, post_office, pockets, mail, store or shown. Sent only to that mod. since api 2 |
| `answer` | e: table { id, choice, text } | nil | The player picked an answer to this mod's ask. choice counts from 1; 0 with text "" when the window closed without a pick. since api 2 |

## Commands

Call them as `cmd.<name>(...)` inside an event handler. Each needs its name in mod.json `permissions`. A call returns the command's id, or nil and the reason it was refused (also logged); the outcome comes back as a `command_result` event.

### cmd.send_letter(t)

Queues a letter in the player's own mailbox (the post office keeps it when the mailbox is full). The save holds an ordinary letter, so it loads without the mod. (since api 2; permission `send_letter`)

| argument | type | what |
|---|---|---|
| `t` | table | { text, item?, from?, paper? } or { template }: text 1 to 192 characters fitting 6 lines; item a number or "0x" and four hex digits; from 1 to 8 characters ("A friend"); paper 0 to 63. template: one of this mod's own letters.json letters, by its id or "<this mod's id>:<id>" (header, body, sign-off, present and paper all come from it). |

Returns integer|nil: The command's id, or nil and the reason it was refused.

### cmd.give_item(item)

Queues an item into the first empty pocket; with full pockets it comes by letter. Also takes this mod's own new item by its full id (author.mod:thing, given with its identity, as a shop sells it); full pockets refuse that one. (since api 2; permission `give_item`)

| argument | type | what |
|---|---|---|
| `item` | integer\|string\|table | An item number, "0x" and four hex digits, this mod's "author.mod:thing", or { item, from? }. |

Returns integer|nil: The command's id, or nil and the reason it was refused.

### cmd.set_flag(key, value)

Queues one of this mod's own flags into this TOWN's store (see store) as flag:<key>; the store's 8 KB cap applies. A flag belongs to the town it was set in: visiting a friend it lasts only the visit, and before a town is loaded it is refused. Not in the save. (since api 2; permission `set_flag`)

| argument | type | what |
|---|---|---|
| `key` | string | ^[a-z0-9_.-]{1,32}$ |
| `value` | boolean\|integer\|string\|nil | nil clears it; text at most 64 bytes. |

Returns integer|nil: The command's id, or nil and the reason it was refused.

### cmd.show_line(text)

Queues a line in the player's own thought window, shown once the player is free. One line or question at a time. (since api 2; permission `show_line`)

| argument | type | what |
|---|---|---|
| `text` | string | 1 to 400 bytes. |

Returns integer|nil: The command's id, or nil and the reason it was refused.

### cmd.ask(t)

Queues a question with 2 to 4 answers in the player's thought window. The pick comes back as an answer event. (since api 2; permission `ask`)

| argument | type | what |
|---|---|---|
| `t` | table | { text, choices }: text 1 to 120 characters, choices 2 to 4 answers of 1 to 16 characters. |

Returns integer|nil: The command's id, or nil and the reason it was refused.


## Sandbox

Each mod runs in its own Lua 5.4 state with only these standard libraries. Source text only (no bytecode). The libraries are read-only: assigning to string.<name>, rawset on one or setmetatable on one raises "string.<name> is read-only", and getmetatable of a library or a string is the string "locked". The built-in globals (the base functions, the libraries, on, log, message, game, store) cannot be assigned, set to nil or rawset; a local may shadow one, and a mod's own globals are writable as usual. pairs(_G) lists only the mod's own globals. Work the instruction count cannot see is charged to the budget: patterns (per step, and per 16 bytes of a [...] set or of a gsub replacement), comparing long strings, and allocations; the run's clock is read at every 100 instructions and a run past its deadline stops. A weak-keyed table (__mode "k" without "v") keeps its keys: weak-keyed tables made one garbage collection cost the square of their size. Weak values work as usual.

- libraries: `base` Lua's base functions, without the removed ones below. pcall, xpcall and setmetatable are wrapped., `string` Without string.dump. Pattern matching is charged against the budget, and string.pack, packsize and unpack per 4 bytes of their format. Read-only., `table` insert, remove, sort, concat, move and unpack are charged per element; a table with a __len metamethod is refused by them. Read-only., `math` The whole math library. Read-only. From api 2 math.random is rng (seeded, repeatable within a game day) and math.randomseed is not there; a mod that says "api": 1 keeps Lua's own math.random and math.randomseed, randomly seeded at each start., `utf8` codepoint, len and offset are charged per byte. Read-only., `coroutine` resume and close are wrapped like pcall. Read-only.
- removed: `dofile` Reaches files., `loadfile` Reaches files., `load` Loads code past the text-only loader., `collectgarbage` Controls memory the sandbox manages., `print` Use log()., `string.dump` Hands out bytecode., `math.randomseed` From api 2 math.random is rng(), seeded by the mod, town, day and event, and cannot be reseeded. An api 1 mod keeps Lua's own math.random and math.randomseed, randomly seeded at each start.
- absent libraries: `io`, `os`, `package`, `debug`
- wrapped: `pcall` Cannot catch a budget stop: once the budget is gone it raises again., `xpcall` As pcall; the message handler is skipped after a budget stop., `coroutine.resume` As pcall., `coroutine.close` As pcall., `setmetatable` Refuses a __gc field: finalizers could never be stopped., `table.insert` Charged per element., `table.remove` Charged per element., `table.sort` Charged n log n., `table.concat` Charged per element., `table.move` Charged per element., `table.unpack` Charged per result., `string.byte` Charged per result., `utf8.codepoint` Charged per result., `utf8.len` Charged per 64 bytes., `utf8.offset` Charged per 64 bytes., `string.pack` Charged per 4 bytes of the format., `string.packsize` Charged per 4 bytes of the format., `string.unpack` Charged per 4 bytes of the format., `string.format` Charged per 64 bytes of its string arguments., `tonumber` Charged per 64 bytes of a string argument. A string over 200 bytes is never a number, here or in arithmetic.

## Limits

| limit | value | what |
|---|---|---|
| `zip.bytes` | 16 MB | The largest mod ZIP, compressed. |
| `zip.unpacked_bytes` | 64 MB | What every file in one mod adds up to, unpacked. |
| `zip.files` | 2,000 files | The most files one mod may hold. Folder entries and junk (__MACOSX, Thumbs.db and any hidden name starting with a dot: .DS_Store, .gitignore, .github/) are dropped first and not counted. |
| `zip.path_bytes` | 160 bytes | The longest path inside a mod, after the one top folder is stripped. ASCII only. |
| `file.manifest_bytes` | 64 KB | The largest mod.json. |
| `file.json_bytes` | 256 KB | The largest .json file other than mod.json. |
| `file.lua_bytes` | 512 KB | The largest .lua file. |
| `json.depth` | 32 levels | How deep JSON may nest: the top value is depth 0 and nothing may sit deeper than 32. |
| `mods.enabled` | 32 mods | The most mods switched on at once. |
| `mods.enabled_unpacked_bytes` | 96 MB | Every switched-on mod together, unpacked, on a computer. |
| `mods.enabled_unpacked_bytes_phone` | 24 MB | Every switched-on mod together, unpacked, on a phone or a low-memory device. Provisional until measured on a real phone. |
| `messages.lines` | 256 lines | The most lines in one mod's messages file. |
| `messages.key_bytes` | 48 bytes | The longest line key. |
| `messages.text_bytes` | 400 bytes | The longest line, in UTF-8 bytes. Lines wrap at 24 characters, 4 lines a page. |
| `shops.per_file` | 4 shops | The most shops in one shops.json (one per target). |
| `shops.stock` | 6 goods | The most goods in one shop's stock. |
| `shops.name_chars` | 40 characters | The longest shop name, in Unicode code points. |
| `shops.line_chars` | 160 characters | The longest greeting or stock_line, in Unicode code points. |
| `shops.line_newlines` | 3 newlines | The most line breaks in a greeting or stock_line. |
| `shops.price_max` | 99,999 Bells | The highest price a mod shop may ask. The game raises a price below its own buy-back (what Nook pays for the item) to the buy-back. |
| `lua.memory_bytes` | 4 MB | Memory one mod's script may use. Over it, the script stops for the session. |
| `lua.memory_total_bytes` | 16 MB | Memory every mod's script together may use. |
| `lua.budget` | 200,000 instructions | Instructions one mod may run per event, all its handlers for that event together (the main chunk gets its own). Library work is charged too: every 64 bytes allocated, every 4 pattern-matching steps, every element a table function touches. Over it, the script stops for the session. |
| `lua.deadline_ms` | 100 milliseconds | Wall-clock limit on a script's main chunk at boot. |
| `lua.handlers_per_event` | 16 handlers | The most handlers one mod may register for one event. |
| `lua.log_per_event` | 20 lines | log() lines kept per event; the rest are dropped. |
| `lua.log_per_session` | 500 lines | log() lines kept per mod per session. |
| `store.bytes` | 8 KB | The whole store of one mod. A store.set that would go over is refused and changes nothing. |
| `store.key_bytes` | 64 bytes | The longest store key. |
| `store.value_bytes` | 1 KB | The longest string a store value may be. |
| `items.per_mod` | 64 items | Items in one mod's items file. |
| `items.total` | 512 items | Mod items across every switched-on mod. |
| `items.renames` | 64 renames | Entries in one mod.json "renames". |
| `lua.event_deadline_ms` | 33 milliseconds | One event run longer than this (two 60 Hz frames) stops the script. |
| `lua.frame_budget_ms` | 4 milliseconds | Lua time all mods together get per frame. Once spent, every game event without an answer waits for the next frame and talk is skipped for the rest of that frame; command_result and answer always run. |
| `lua.slow_run_ms` | 8 milliseconds | An event run longer than this is a strike. |
| `lua.slow_runs` | 3 strikes | Strikes before the script is stopped ("kept the game waiting"). |
| `lua.deferred_events` | 64 events | Events waiting for a later frame; past that an event is dropped and logged. |
| `textures.png_side` | 2,048 pixels | The longest side of a PNG texture. |
| `textures.png_decoded_bytes` | 96 MB | Decoded pixels of every mod's PNG textures together, on a computer. A PNG past it is left out and named on its mod's row. |
| `textures.png_decoded_bytes_phone` | 24 MB | The same on a phone or low-memory device. |
| `settings.per_mod` | 16 settings | Settings one mod declares. |
| `depends.per_mod` | 16 mods | Mods in depends, and in conflicts, each. |
| `data_version.max` | 1,000,000 version | The largest data_version. |
| `store.towns` | 16 towns | Towns whose mod data one browser keeps; writing a 17th drops the least recently written other town's file. |
| `remote.copy_bytes` | 64 KB | Data a remote.call copies each way. |
| `remote.functions` | 32 functions | Functions one mod offers with remote.add. |
| `exports.per_mod` | 32 functions | Remote functions one mod.json "exports" lists (the most remote.add offers). |
| `exports.description_chars` | 120 characters | One "exports" description, on one line. |
| `nook.stock` | 16 goods | The most goods in Nook's stock entry. |
| `letters.per_file` | 32 letters | Letters in one letters file. |
| `letters.header_chars` | 24 characters | A letter header, not counting {player}. |
| `letters.body_bytes` | 192 characters | A letter body or a board notice. |
| `letters.body_lines` | 6 lines | Lines on the letter paper or a board page. |
| `letters.footer_chars` | 32 characters | A letter footer. |
| `letters.sender_chars` | 8 characters | A letter's name in the mailbox list (its optional sender; without one, the footer's first 8 characters). |
| `events.per_file` | 16 events | Events in one events file. |
| `events.talk_lines` | 16 lines | Talk lines in one event. |
| `talk.pools` | 32 pools | Pools in one talk file. |
| `talk.lines_per_pool` | 32 lines | Lines in one pool. |
| `talk.line_chars` | 160 characters | A villager line (pool or event), in Unicode code points; at most 3 line breaks. |
| `commands.per_event` | 4 commands | Commands one mod may queue in one event. |
| `commands.waiting` | 32 commands | Commands waiting, all mods together. |
| `commands.waiting_per_mod` | 8 commands | Commands one mod may have waiting. |
| `commands.letters_per_day` | 3 commands | send_letter per mod per game day in each town, counted when the game applies it (one lost with a closed tab before then never counts; the cap check adds the commands still waiting) and kept across a reload. A command refused for where the player is (The City, a visit) does not count. |
| `commands.items_per_day` | 5 commands | give_item per mod per game day in each town. |
| `commands.flags_per_day` | 100 commands | set_flag per mod per game day in each town. |
| `commands.lines_per_day` | 20 commands | show_line per mod per game day in each town. |
| `commands.asks_per_day` | 10 commands | ask per mod per game day in each town. |
| `commands.letter_chars` | 192 characters | A letter's text; it must also fit the letter's 6 lines of 192 pixels. |
| `commands.letter_from_chars` | 8 characters | A letter's signature, also the mailbox list's sender. |
| `commands.line_bytes` | 400 bytes | A show_line text. |
| `commands.ask_chars` | 120 characters | An ask question. |
| `commands.choice_chars` | 16 characters | One answer of an ask. |
| `commands.choices_min` | 2 answers | The fewest answers an ask may offer. |
| `commands.choices_max` | 4 answers | The most answers an ask may offer. |
| `commands.flag_key_chars` | 32 characters | A flag key, ^[a-z0-9_.-]{1,32}$. |
| `commands.flag_value_bytes` | 64 bytes | A flag's text value. |
| `commands.papers` | 64 papers | Letter papers, numbered 0 to 63. |
| `events.board_per_day` | 3 notices | Board notices that go up on one day across EVERY mod, the first ones in load order. On a full board a mod notice takes the place of an earlier day's mod notice first, and never pushes off a page dated today. |
| `store.towns_bytes` | 1536 KB | What every town's mod data in one browser adds up to; writing past it drops the least recently written other towns' files first, so mod data never pushes a save over the cloud's 5 MB. |
| `talk.line_newlines` | 3 newlines | The most line breaks in a villager line (pool or event). |
| `talk.villager_chars` | 8 characters | A pool's "villager" name, as the game spells it. |
| `items.price_max` | 99,999 Bells | The highest price an item in a mod's items file may have. |
| `manifest.name_chars` | 60 characters | The longest mod "name", in Unicode code points, spaces at the ends not counted. |
| `manifest.authors` | 8 names | The most names in "authors". |
| `manifest.author_chars` | 40 characters | The longest name in "authors", spaces at the ends not counted. |
| `manifest.description_chars` | 500 characters | The longest "description". |
| `manifest.tags` | 5 tags | The most different tags in "tags". |
| `settings.label_chars` | 60 characters | A setting's "label", spaces at the ends not counted. |
| `settings.description_chars` | 200 characters | A setting's "description". |
| `settings.choices_min` | 2 choices | The fewest "choices" a choice setting lists. |
| `settings.choices` | 16 choices | The most "choices" a choice setting lists. |
| `settings.choice_chars` | 40 characters | One choice of a choice setting, on one line. |
| `settings.text_chars` | 200 characters | The largest "max_length" a text setting may ask for. |
| `settings.number_max` | 1,000,000,000 number | A number setting's "min" and "max" lie within minus this and this. |
| `depends.range_bytes` | 64 bytes | The longest version range in depends or conflicts. |
| `depends.range_parts` | 4 comparisons | The most comparisons in one version range, like ">=1.0.0 <2.0.0" (two). |

## shims

```json
[]
```
