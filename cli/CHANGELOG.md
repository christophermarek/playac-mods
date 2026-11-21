# playac-mod changelog

Every release of the tool, newest first. `playac-mod --version` prints the
version and the build you have.

A version is MAJOR.MINOR.PATCH. The middle number goes up when the rules, the
API level or a command changes. The last number goes up for fixes. A release
never changes after it is listed.

## 1.0.0

First release.

- Three commands: `check`, `dev` and `pack`. `playac-mod help` lists them, and
  `playac-mod <command> --help` shows a command's options, one per line. An
  option a command does not have is refused by name.
- `check` reads a mod folder by the game's own rules, from the tool's own
  folder only: mod.json, every data file, `optional_depends`, settings and
  their `scope`, `renames`, calendar dates, an items file's `textures` folder
  (up to 16 `.png` or `.dds` files named after the base's textures, outside
  `content.textures`), and the events and permissions a script names.
- `check` reads a talk file's pools by the game's rules, `season` (spring,
  summer, fall, winter), `time` (morning, day, evening, night) and `weather`
  (clear, rain, snow) included, and refuses any other value (`talk-when`).
  It reads each pool's `place` (`talk-place`), `topics` (`talk-topics`) and
  `day`, which must be a day of the mod's calendar file (`talk-day`), and a
  line that is a list of up to 8 pages. A script may list
  `villager_answered`.
- `check` reads a texture name with or without a label in front, as in
  `bookshelf-top_tex1_32x32_626709d910129694_$_8.png`: 1 to 40 lowercase
  letters, digits and dashes, then one underscore. The game matches on the
  `tex1_` part only. `check` refuses a label that breaks that rule, and a
  labelled file that is the same texture as another file in the same folder.
- `check` reads `shops.json` by shop id: each shop in the shop table takes one
  block or a list of blocks, with `when`, `open`, `own_goods`, `goods`,
  `price_percent`, `buy_back_percent`, `services`, `name` and `lines`. It warns
  about a good a shop's spots cannot hold and a price the game raises to its
  floor, refuses furniture the game has no model for (`shop-item-no-model`),
  and knows the permissions `set_shop_goods` and `set_shop_open`.
- `check` refuses what the game and the site refuse: a JSON file that is not
  UTF-8, a `.lua` or `.json` file with a carriage return no line feed follows
  (`file-lone-cr`), an unknown key in a calendar date, a setting label or
  description with a character a reader cannot see, a `renames` entry whose
  old id is not this mod's own, `content.translations`, and a
  `content.messages` that names a folder.
- `check` reads a script the way Lua does: line ends, string escapes, `on`
  with spaces around the dot, and a script that defines its own `on`. It warns
  when a script calls `timer.after` without `timer_fired` in `scripts.events`,
  when a script that reads a client setting also sends a letter, gives an item
  or takes an item or Bells, and says an unknown `cmd.` name stops the script
  for the session.
- `dev` serves a folder to the game and prints the steps that load it: open
  the game with `?moddev=1`, go to Settings, Mods, press Connect, then Restart
  now once. It answers game pages at playaconline.com, its dev site and
  `http://localhost:5173`. `--origin` adds another. A page it refuses reads
  why, and the terminal prints the `--origin` to add.
- `pack` prints one hash, the content hash. The ZIP's own SHA-256 is in
  `pack --json`. `--version` prints the build as well as the version.
- Start a mod from an example repository or a starter kit, and share it from
  the website, by upload or "Import from GitHub". The editor types are
  `api/playac.lua` in the public mods repository.
- The tool's releases are files of GitHub releases of the playac-mods
  repository. The package carries its licence and this changelog.
