/* mods.js - player mods, the page's half.
 *
 * A mod is a ZIP with mod.json at its root (or inside one top folder). This file
 * keeps installed mods in IndexedDB ('acweb-mods'), and before main() runs it
 * unpacks the enabled ones into MEMFS:
 *
 *   /mods/m/<id>/...      the mod's files, paths as in the ZIP (top folder stripped)
 *   /mods/index.json      { schema, modset, mods: [{ id, version, scope, dir }] } in load order
 *
 * Mods sit under /mods/m so no mod id can ever collide with index.json.
 * the game engine reads index.json at boot. Changing mods reloads the game, the
 * way installing the HD pack does: a mod is read once, at boot, so a half-applied
 * mod set can never happen mid-play.
 *
 * Nobody without mods pays anything: with no 'acweb.mods' flag in localStorage
 * the database is never opened and boot does not wait.
 *
 * The rules (ZIP, paths, JSON, mod.json, shops.json, messages, modset hash) are
 * the ONE contract every layer implements: this file, the backend registry
 * (the game's server) and the game engine. the contract's test cases holds the shared cases;
 * the game's build runs every one of them against this file, and
 * pc/tests/test_pc_mod_contract.c the content-file ones against the game engine. */
(function (root) {
  'use strict';

  const DB_NAME = 'acweb-mods';
  const FLAG = 'acweb.mods';
  /* The world mod set the NEXT boot will run, for a page that asks for a
   * visit without the game running (/visit). Written at boot and after every
   * install, remove, switch or move. "" = no world mods. */
  const MODSET_KEY = 'acweb.modset';
  /* Beside it, the named list of the mods that hash, JSON, removed when
   * there are none: a refused visit names what differs from it. */
  const MODLIST_KEY = 'acweb.modlist';
  /* Set by skipNextBoot(): the next boot loads no mods (safe mode), once. */
  const SKIP_KEY = 'acweb.mods.skip';
  const MODS_DIR = '/mods';
  const MOD_ROOT = '/mods/m';
  const KIB = 1024;
  const MIB = 1024 * 1024;
  /* BEGIN generated limits (the game's build from api/api.json). Do not edit. */
  /* The mod API limits this file checks: api.json "limits", each naming its
   * constant in sources.js. Never declare one elsewhere or write its number in a rule. */
  const AUTHOR_CHARS = 40; /* manifest.author_chars */
  const AUTHORS_MAX = 8; /* manifest.authors */
  const DATA_VERSION_MAX = 1000000; /* data_version.max */
  const DESCRIPTION_CHARS = 500; /* manifest.description_chars */
  const EVENT_TALK_MAX = 16; /* events.talk_lines */
  const EVENTS_MAX = 16; /* events.per_file */
  const EXPORT_DESC_MAX = 120; /* exports.description_chars */
  const EXPORTS_MAX = 32; /* exports.per_mod */
  const ITEM_PRICE_MAX = 99999; /* items.price_max */
  const LETTER_FOOTER_MAX = 32; /* letters.footer_chars */
  const LETTER_HEADER_MAX = 24; /* letters.header_chars */
  const LETTER_SENDER_MAX = 8; /* letters.sender_chars */
  const LETTERS_MAX = 32; /* letters.per_file */
  const MAX_DEPS = 16; /* depends.per_mod */
  const MAX_ENABLED = 32; /* mods.enabled */
  const MAX_ENABLED_UNPACKED = 100663296; /* mods.enabled_unpacked_bytes */
  const MAX_FILES = 2000; /* zip.files */
  const MAX_JSON = 262144; /* file.json_bytes */
  const MAX_JSON_DEPTH = 32; /* json.depth */
  const MAX_LUA = 524288; /* file.lua_bytes */
  const MAX_MANIFEST = 65536; /* file.manifest_bytes */
  const MAX_PATH = 160; /* zip.path_bytes */
  const MAX_SETTINGS = 16; /* settings.per_mod */
  const MAX_TAGS = 5; /* manifest.tags */
  const MAX_UNPACKED = 67108864; /* zip.unpacked_bytes */
  const MAX_ZIP = 16777216; /* zip.bytes */
  const MESSAGE_BYTES_MAX = 400; /* messages.text_bytes */
  const MESSAGES_MAX = 256; /* messages.lines */
  const MOD_ITEMS_MAX = 64; /* items.per_mod */
  const MOD_RENAMES_MAX = 64; /* items.renames */
  const NAME_CHARS = 60; /* manifest.name_chars */
  const NOOK_STOCK_MAX = 16; /* nook.stock */
  const PAPER_BYTES = 192; /* letters.body_bytes */
  const PAPER_LINES = 6; /* letters.body_lines */
  const PAPERS = 64; /* commands.papers */
  const PHONE_MAX_ENABLED_UNPACKED = 25165824; /* mods.enabled_unpacked_bytes_phone */
  const POOL_LINES_MAX = 32; /* talk.lines_per_pool */
  const POOLS_MAX = 32; /* talk.pools */
  const RANGE_BYTES_MAX = 64; /* depends.range_bytes */
  const RANGE_PARTS_MAX = 4; /* depends.range_parts */
  const SETTING_CHOICE_CHARS = 40; /* settings.choice_chars */
  const SETTING_CHOICES_MAX = 16; /* settings.choices */
  const SETTING_CHOICES_MIN = 2; /* settings.choices_min */
  const SETTING_DESC_CHARS = 200; /* settings.description_chars */
  const SETTING_LABEL_CHARS = 60; /* settings.label_chars */
  const SETTING_NUM_MAX = 1000000000; /* settings.number_max */
  const SETTING_TEXT_MAX = 200; /* settings.text_chars */
  const SHOP_LINE_CHARS = 160; /* shops.line_chars */
  const SHOP_LINE_NEWLINES = 3; /* shops.line_newlines */
  const SHOP_NAME_CHARS = 40; /* shops.name_chars */
  const SHOP_PRICE_MAX = 99999; /* shops.price_max */
  const SHOP_STOCK_MAX = 6; /* shops.stock */
  const SHOPS_MAX = 4; /* shops.per_file */
  const TALK_LINE_CHARS = 160; /* talk.line_chars */
  const TALK_LINE_NEWLINES = 3; /* talk.line_newlines */
  const VILLAGER_CHARS = 8; /* talk.villager_chars */
  /* END generated limits */
  /* MAX_ENABLED_UNPACKED is what a computer can hold next to the game. On a
   * phone or a low-memory device (PHONE_MAX_ENABLED_UNPACKED) iOS kills
   * a tab that grows too far, the texture tables alone are ~37 MB once any mod
   * has a texture, and a mod's bytes sit in memory more than once at boot (its
   * ZIP, the unpacked copy in MEMFS, the preloaded textures). PROVISIONAL:
   * picked low on purpose and not yet measured on a low-memory iPhone. The
   * procedure that measures it is in the ios-memory-profiling skill ("Mods"). */
  /* Room asked for on top of a mod's ZIP and unpacked size before an install
   *: a browser close to its quota fails or evicts writes, and its
   * estimate is coarse, so a near miss is refused rather than tried. */
  const QUOTA_MARGIN = 16 * MIB;
  const HOOKS = ['talk', 'day_start', 'item_picked', 'enter_scene'];
  /* Api level 2: "permissions", the commands a script may queue
   * (the game engine; the engine refuses the rest and grants none to a mod below
   * level 2). The level-2 events are HOOKS_V2 below. */
  const PERMISSIONS = ['send_letter', 'give_item', 'set_flag', 'show_line', 'ask'];
  const EXTS = ['.json', '.lua', '.dds', '.png', '.txt', '.md'];
  const CONTENT_KEYS = ['textures', 'messages', 'shops'];
  /* Content keys of the Phase 3 typed targets (-), api level 2 only
   * (targetsRulesV2, called from manifestRulesV2). */
  const TARGET_CONTENT_KEYS_V2 = ['letters', 'events', 'talk'];
  /* The storefront's fixed tag list; Go validate.go Tags is the same. */
  const TAGS = ['textures', 'clothing', 'furniture', 'scenery', 'villagers', 'dialogue', 'shops',
    'seasonal', 'holidays', 'quality-of-life', 'translation', 'humor', 'accessibility', 'scripts'];
  /* The mod API levels this game reads (mod.json "api"). A mod states the
   * level it was written for, and is checked by THAT level's rules, at install
   * and again at every boot. Raising API_MAX adds a level; raising API_MIN drops
   * one, and an installed mod under it then shows "made for an older game" on its
   * row instead of a raw rule error. */
  const API_MIN = 1;
  const API_MAX = 2; /* 2: mod items, content.items + renames; the typed targets, content.letters/events/talk + shops target nook (-) */
  /* Top-level keys the epic plans but nothing enforces yet. Refused now,
   * so no approved mod carries one that a later build would start obeying.
   * Level 2 builds depends and conflicts: UNBUILT_KEYS_V2. */
  const UNBUILT_KEYS = ['depends', 'conflicts', 'game', 'save'];
  const UNBUILT_KEYS_V2 = ['game', 'save'];
  /* Level 2: the "migrate" event, run once per town when the mod's data_version
   * changes; the effects work's game events and the two answers
   * a command sends back (the game engine k_hooks). */
  const HOOKS_V2 = HOOKS.concat(['migrate', 'hour_change', 'shop_buy', 'item_sold', 'fish_caught', 'bug_caught',
    'letter_read', 'villager_moved_in', 'visitor_arrived', 'command_result', 'answer']);
  /* The languages a mod's messages folder may hold: the game's own,
   * en for the US and Australian discs, the five of the European disc. */
  const LANGS = ['en', 'de', 'es', 'fr', 'it'];
  const SCRIPT_KEYS = ['main', 'hooks'];
  const ID_RE = /^[a-z0-9][a-z0-9-]{0,31}\.[a-z0-9][a-z0-9-]{0,47}$/;
  const VERSION_RE = /^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$/;
  const HHMM_RE = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  const ITEM_RE = /^0x[0-9a-fA-F]{4}$/;
  const MSG_KEY_RE = /^[a-z0-9_.-]{1,48}$/;
  /* Phase 3 typed targets (-), the mod contract. */
  const SHOP_TARGETS = ['flower', 'nook'];
  const NOOK_FLOWER_ONLY = ['name', 'hours', 'greeting', 'stock_line'];
  const PERSONALITIES = ['normal', 'peppy', 'lazy', 'jock', 'cranky', 'snooty'];
  /* Mod items: an item's own id, its full id <mod id>:<id>, its name as
   * the game's 16-character item name box can draw it. */
  const MOD_ITEM_ID_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
  const MOD_ITEM_FULL_RE = /^([a-z0-9][a-z0-9-]{0,31}\.[a-z0-9][a-z0-9-]{0,47}):([a-z0-9][a-z0-9-]{0,31})$/;
  const MOD_ITEM_NAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9 '.,!&-]{0,14}[A-Za-z0-9'.,!&-])?$/;
  const MOD_ITEM_KEYS = ['id', 'name', 'base', 'price'];
  const LIMITS = {
    MAX_ZIP: MAX_ZIP, MAX_UNPACKED: MAX_UNPACKED, MAX_FILES: MAX_FILES, MAX_PATH: MAX_PATH,
    MAX_MANIFEST: MAX_MANIFEST, MAX_JSON: MAX_JSON, MAX_LUA: MAX_LUA,
    MAX_ENABLED: MAX_ENABLED, MAX_ENABLED_UNPACKED: MAX_ENABLED_UNPACKED,
    PHONE_MAX_ENABLED_UNPACKED: PHONE_MAX_ENABLED_UNPACKED, QUOTA_MARGIN: QUOTA_MARGIN
  };

  /* BEGIN generated error codes (the game's build from errors/catalogue.mjs). Do not edit. */
  /* The errors catalogue (/modding/errors/): a problem's code is the first
   * entry with a pattern that matches its text. problemCodes() below. */
  const ERROR_DOCS = "https://playaconline.com/modding/errors/";
  const ERROR_CODES = [
    ["visit-lend-wont-load", [new RegExp("^the friend.s mods (would not|did not) all load"), new RegExp("^a lent mod is missing from this tab")]],
    ["zip-too-big", [new RegExp("the ZIP is over 16 MB"), new RegExp("^The (ZIP|zip) is larger than \\d+ MiB")]],
    ["zip-unreadable", [new RegExp("not a ZIP the game can open"), new RegExp("that is not a file the game can read"), new RegExp("^This is not a ZIP file we can read"), new RegExp("^The upload is empty"), new RegExp("can't be read from the ZIP"), new RegExp("not the size its ZIP header says"), new RegExp("^The upload did not arrive whole")]],
    ["browser-no-zip", [new RegExp("ZIP support is unavailable")]],
    ["zip-no-manifest", [new RegExp("no mod\\.json at the top")]],
    ["zip-too-many-files", [new RegExp("^more than \\d+ files"), new RegExp("^The ZIP holds \\d+ files, more than"), new RegExp("^The ZIP has more than \\d+ entries")]],
    ["zip-unpacked-too-big", [new RegExp("^it unpacks to more than 64 MB"), new RegExp("^The files expand to more than")]],
    ["zip-duplicate-entry", [new RegExp("is in the ZIP twice"), new RegExp("^The ZIP holds \".*\" twice")]],
    ["path-unsafe", [new RegExp("is not a safe path"), new RegExp("^The path \".*\" (is longer than|uses a backslash|holds a colon|holds a control|is not plain ASCII|is not a plain path)")]],
    ["path-case-clash", [new RegExp("same name ignoring letter case"), new RegExp("the same path when case is ignored")]],
    ["path-file-and-folder", [new RegExp("is both a file and a folder"), new RegExp("is a file, and \".*\" uses it as a folder")]],
    ["file-type", [new RegExp("files can be in a mod$"), new RegExp("is not an allowed file type")]],
    ["file-too-big", [new RegExp("^mod\\.json is over 64 KB"), new RegExp("is over (256|512) KB$"), new RegExp("^mod\\.json is larger than"), new RegExp("is larger than \\d+ KiB, the most a"), new RegExp("^\\S+ is over \\d+ KiB$")]],
    ["json-duplicate-key", [new RegExp("duplicate key"), new RegExp("has the key \".*\" twice"), new RegExp("^a member name appears twice$")]],
    ["json-nul", [new RegExp("NUL character"), new RegExp("^\\\\u0000 in a string$")]],
    ["json-invalid", [new RegExp("is not valid JSON"), new RegExp("a number is out of range"), new RegExp("^(expected (a member name|':'|',' or [}\\]])|trailing data after the document|unexpected (end|character)|unterminated string|bad (number|escape|\\\\u escape)|control character in string|number (too long|out of range)|too many values)$")]],
    ["json-too-deep", [new RegExp("nested more than \\d+ levels"), new RegExp("^nested too deep$")]],
    ["manifest-unreadable", [new RegExp("^mod\\.json could not be read")]],
    ["manifest-not-object", [new RegExp("^mod\\.json is not a JSON object"), new RegExp("^mod\\.json must be a JSON object")]],
    ["api-missing", [new RegExp("^\"api\" must be a whole number"), new RegExp("must say \"api\" as a whole number")]],
    ["api-older", [new RegExp("made for an older game")]],
    ["api-newer", [new RegExp("needs a newer game")]],
    ["manifest-schema", [new RegExp("^\"schema\" must be 1"), new RegExp("must say \"schema\"")]],
    ["manifest-unbuilt-key", [new RegExp("is not built yet")]],
    ["manifest-id-reserved", [new RegExp("reserved for the site's own mods")]],
    ["manifest-id", [new RegExp("^\"id\" must look like"), new RegExp("^The id \".*\" must look like")]],
    ["manifest-name", [new RegExp("^\"name\" must be 1 to 60"), new RegExp("^The name must be 1 to 60")]],
    ["manifest-version", [new RegExp("^\"version\" must be like"), new RegExp("^The version \".*\" must be three numbers")]],
    ["manifest-authors", [new RegExp("^\"authors\" must list"), new RegExp("^List 1 to 8 authors"), new RegExp("^Each author must be")]],
    ["manifest-description", [new RegExp("^\"description\" must be text"), new RegExp("^The description must be text")]],
    ["manifest-tags", [new RegExp("^\"tags\" must list"), new RegExp("^tags must list")]],
    ["manifest-scope", [new RegExp("^\"scope\" must be \"client\" or \"world\""), new RegExp("^The scope must be")]],
    ["manifest-assets-original", [new RegExp("\"assets_original\"")]],
    ["shops-need-world", [new RegExp("changes what visitors see, so \"scope\" must be \"world\""), new RegExp("content\\.shops changes what visitors see"), new RegExp("^shops change what visitors see")]],
    ["content-not-object", [new RegExp("^\"content\" must be an object"), new RegExp("^content must be an object")]],
    ["content-unknown", [new RegExp("^\"content\\.[^\"]*\" is not something a mod can add yet"), new RegExp("^content\\.\\S+ is not something a mod can add yet")]],
    ["content-path", [new RegExp("^\"content\\.[^\"]*\" must be a path inside the mod"), new RegExp("^content\\.\\S+ must be a path inside the mod"), new RegExp("^(textures|messages|shops|items|letters|events|talk) path is not inside the mod"), new RegExp("^content: a value must be a path inside the mod")]],
    ["content-missing", [new RegExp("^\"content\\.[^\"]*\" names .*, which is not"), new RegExp("^content\\.\\S+ names \".*\", which is not"), new RegExp("^cannot open ")]],
    ["scripts-not-object", [new RegExp("^\"scripts\" must be an object"), new RegExp("^scripts must be an object")]],
    ["scripts-unknown-key", [new RegExp("is not a scripts setting")]],
    ["scripts-main-missing", [new RegExp("^\"scripts\\.main\" names .*, which is not in the mod"), new RegExp("^scripts\\.main names \".*\", which is not in the ZIP"), new RegExp("^scripts\\.main could not be read")]],
    ["scripts-main", [new RegExp("^\"scripts\\.main\" must be a \\.lua file"), new RegExp("^scripts\\.main must name a \\.lua file"), new RegExp("^scripts\\.main is not a path inside the mod"), new RegExp("^scripts\\.main must end in lowercase \\.lua"), new RegExp("folder path is too long")]],
    ["scripts-hooks", [new RegExp("^\"scripts\\.hooks\" must list"), new RegExp("^scripts\\.hooks (must list|lists)")]],
    ["scripts-permissions", [new RegExp("^\"permissions\" must list"), new RegExp("^permissions (must list|lists)")]],
    ["scripts-permissions-no-scripts", [new RegExp("permissions\"? is for a mod with \"?scripts")]],
    ["manifest-exports", [new RegExp("^\"exports\" must be an object"), new RegExp("^exports must be an object"), new RegExp("\"exports\" must be an object of at most")]],
    ["manifest-exports-no-scripts", [new RegExp("exports\"? is for a mod with \"?scripts")]],
    ["shops-file", [new RegExp("^shops: \"shops\" must be a list"), new RegExp("must be a JSON object with a \"shops\" list"), new RegExp("needs a \"shops\" list of 1 to"), new RegExp("^shops file needs a \"shops\" list"), new RegExp("^shops: the \"shops\" list must hold")]],
    ["shop-not-object", [new RegExp("^shops: shop \\d+ is not an object"), new RegExp(": shop \\d+ must be an object"), new RegExp("^shops: a shop must be an object")]],
    ["shop-target", [new RegExp("\"target\" must be \"flower\""), new RegExp(": shop \\d+ has target"), new RegExp("^shops: only the flower shop can be changed"), new RegExp("^shops: the shops a mod can change are")]],
    ["shop-target-twice", [new RegExp("one shop per target"), new RegExp(": two shops change the"), new RegExp("^shops: the flower shop is listed twice"), new RegExp("^shops: Nook's shop is listed twice")]],
    ["shop-name", [new RegExp("^shops: shop \\d+ \"name\" must be"), new RegExp(": shop \\d+'s name must be"), new RegExp("^shops: \"name\" must be 1 to 40")]],
    ["shop-hours-same", [new RegExp("\"hours\" open and close must differ"), new RegExp("'s hours open and close at the same time"), new RegExp("\"open\" and \"close\" are the same time")]],
    ["shop-hours", [new RegExp("\"hours\" must be \\{"), new RegExp("'s hours need \"open\" and \"close\""), new RegExp("^shops: hours need")]],
    ["shop-text", [new RegExp("\"(greeting|stock_line)\" must be 1 to 160"), new RegExp("'s \\S+ must be 1 to \\d+ characters on at most"), new RegExp("\"greeting\" and \"stock_line\" must be")]],
    ["nook-api", [new RegExp("target \"nook\" needs \"api\": 2")]],
    ["nook-flower-key", [new RegExp("is the flower shop's"), new RegExp("Nook's shop takes only \"mode\" and \"stock\"")]],
    ["nook-mode", [new RegExp("\"mode\" must be \"add\" or \"replace\""), new RegExp("'s mode must be \"add\" or \"replace\""), new RegExp("^shops: Nook's \"mode\" must be")]],
    ["nook-stock", [new RegExp("\"stock\" must list 1 to 16"), new RegExp("'s stock must list 1 to 16"), new RegExp("^shops: Nook's \"stock\" must list")]],
    ["nook-item-refused", [new RegExp("^shops: a Nook's stock item cannot be sold"), new RegExp("so the game leaves it out of Nook's shop")]],
    ["target-not-object", [new RegExp("^(letters: letter|events: event|talk: pool) \\d+ is not an object"), new RegExp(": (letter|event|pool) \\d+ must be an object"), new RegExp("^(letters: a letter|events: an event|talk: a pool) must be an object")]],
    ["target-id", [new RegExp("\"id\" must be 1 to 48 of a-z"), new RegExp("'s id must be 1 to 48 of a-z"), new RegExp("is used twice"), new RegExp("an \"id\" must be 1 to 48"), new RegExp("an \"id\" is used twice")]],
    ["letters-file", [new RegExp("^letters: \"letters\" must be a list"), new RegExp("needs a \"letters\" list"), new RegExp("^letters file needs")]],
    ["letter-header", [new RegExp("\"header\" must be 1 to 24"), new RegExp("'s header must be 1 to 24"), new RegExp("^letters: \"header\" is too long")]],
    ["letter-body", [new RegExp("\"body\" must be 1 to \\d+ plain"), new RegExp("'s body must be 1 to \\d+ plain")]],
    ["paper-fit", [new RegExp("does not fit on the letter paper"), new RegExp("does not fit on a board page")]],
    ["letter-footer", [new RegExp("\"footer\" must be 1 to 32"), new RegExp("'s footer must be 1 to 32")]],
    ["letter-sender", [new RegExp("\"sender\" must be 1 to 8"), new RegExp("'s sender must be 1 to 8")]],
    ["letter-item", [new RegExp("^letters: letter \\d+ \"item\""), new RegExp(": letter \\d+'s item"), new RegExp("^letters: \"item\" must be"), new RegExp("^letters: the item cannot be sent")]],
    ["letter-paper", [new RegExp("\"paper\" must be a whole number"), new RegExp("'s paper must be a whole number")]],
    ["events-file", [new RegExp("^events: \"events\" must be a list"), new RegExp("needs an \"events\" list"), new RegExp("^events file needs")]],
    ["event-date", [new RegExp("\"date\" must be"), new RegExp("'s date must be")]],
    ["event-empty", [new RegExp("needs a \"board\" notice, \"talk\" lines or a \"letter\""), new RegExp("needs a board notice, talk lines or a letter")]],
    ["event-letter", [new RegExp("\"letter\" must be the id of a letter"), new RegExp("'s letter must be the id of a letter"), new RegExp("names no letter in this mod's letters file")]],
    ["event-board-world", [new RegExp("\"board\" changes the town"), new RegExp("board notice changes the town"), new RegExp("^events: a \"board\" notice changes the town")]],
    ["event-board", [new RegExp("\"board\" must be 1 to \\d+ plain"), new RegExp("'s board must be 1 to \\d+ plain")]],
    ["event-talk", [new RegExp("\"talk\" must list 1 to 16"), new RegExp("'s talk must list 1 to"), new RegExp("^events: \"talk\" must list"), new RegExp("^events: a talk line must be")]],
    ["talk-file", [new RegExp("^talk: \"pools\" must be a list"), new RegExp("needs a \"pools\" list"), new RegExp("^talk file needs")]],
    ["talk-who", [new RegExp("\"personality\" or a \"villager\", not both"), new RegExp("a personality or a villager, not both")]],
    ["talk-personality", [new RegExp("\"personality\" must be"), new RegExp("'s personality must be")]],
    ["talk-villager", [new RegExp("\"villager\" must be a name"), new RegExp("'s villager must be a name")]],
    ["talk-chance", [new RegExp("\"chance\" must be a whole number"), new RegExp("'s chance must be a whole number")]],
    ["talk-lines", [new RegExp("\"lines\" must list 1 to 32"), new RegExp("'s lines must list 1 to"), new RegExp("^talk: a line must be")]],
    ["targets-out-of-memory", [new RegExp("^(letters|events|talk): out of memory")]],
    ["shop-stock", [new RegExp("\"stock\" must list 1 to 6"), new RegExp("'s stock must list 1 to"), new RegExp("^shops: \"stock\" must list")]],
    ["items-list", [new RegExp("^items: \"items\" must be a list of 1 to"), new RegExp("needs an \"items\" list of 1 to"), new RegExp("must be a JSON object with an \"items\" list")]],
    ["item-not-object", [new RegExp("^items: item \\d+ is not an object"), new RegExp(": item \\d+ must be an object")]],
    ["item-setting", [new RegExp("is not an item setting")]],
    ["item-id", [new RegExp("\"id\" must be 1 to 32 of a-z"), new RegExp("'s id must be 1 to 32 of a-z")]],
    ["item-id-twice", [new RegExp("^items: item \\d+ repeats the id"), new RegExp("two items have the id"), new RegExp("^items: an id is listed twice")]],
    ["item-name", [new RegExp("\"name\" must be 1 to 16 letters"), new RegExp("'s name must be 1 to 16 letters")]],
    ["item-base", [new RegExp("\"base\" must be"), new RegExp("'s base .*must be")]],
    ["item-price", [new RegExp("^items: item \\d+ \"price\" must be"), new RegExp("item .*'s price must be a whole number"), new RegExp("^items: a price must be a whole number")]],
    ["item-malformed", [new RegExp("^items: a malformed item is left out")]],
    ["item-base-refused", [new RegExp("^items: this base cannot be a mod item")]],
    ["items-too-many-total", [new RegExp("^items: the game holds \\d+ mod items at most")]],
    ["shop-mod-item-unknown", [new RegExp("is not an item in this mod's items file"), new RegExp("names an item that is not one of this mod's")]],
    ["shop-furniture-shared", [new RegExp("shares its furniture")]],
    ["item-renames", [new RegExp("^\"renames\""), new RegExp("^renames")]],
    ["shop-item-twice", [new RegExp("is a duplicate item"), new RegExp("'s stock lists item .* twice"), new RegExp("^shops: a stock item is listed twice")]],
    ["shop-item-refused", [new RegExp("^shops: a stock item cannot be sold"), new RegExp("so the game leaves it out of the flower shop")]],
    ["shop-item", [new RegExp("\"item\" must be \"0x\" and 4 hex"), new RegExp("'s stock entries must be objects with an item"), new RegExp("'s stock item .* must be a string like"), new RegExp("^shops: a stock item must be")]],
    ["shop-price", [new RegExp("\"price\" must be a whole number"), new RegExp("'s price for .* must be a whole number"), new RegExp("^shops: a price must be")]],
    ["shop-price-floor", [new RegExp("is under the floor for")]],
    ["manifest-depends", [new RegExp(" must be an object of mod id to version range"), new RegExp(" may name at most \\d+ mods"), new RegExp("\" is not a mod id"), new RegExp(" names the mod itself$"), new RegExp(" names the mod itself\\."), new RegExp("^\"?(depends|conflicts)\"? must be an object of mod id"), new RegExp("^\"?(depends|conflicts)\"? may name at most"), new RegExp("^\"?(depends|conflicts)\"?: \".*\" is not a mod id"), new RegExp("^\"?(depends|conflicts)\"? names the mod itself"), new RegExp("is in both \"?depends\"? and \"?conflicts\"?")]],
    ["manifest-depends-range", [new RegExp("the range for .* must be \"\\*\" or up to 4")]],
    ["manifest-data-version", [new RegExp("^\"?data_version\"? must be a whole number"), new RegExp("which needs a \"?data_version\"?"), new RegExp("migrate hook needs a data_version")]],
    ["manifest-setting-value", [new RegExp(" default must be true or false"), new RegExp(" min and max must be whole numbers from"), new RegExp(" default must be a whole number from min to max"), new RegExp(" choices must list 2 to 16 different texts"), new RegExp(" default must be one of its choices"), new RegExp(" max_length must be a whole number from 1 to 200"), new RegExp(" default must be text of at most max_length"), new RegExp("^settings: \".*\" \"?(default|min|choices|max_length)\"?( and \"?max\"?)? must")]],
    ["manifest-settings", [new RegExp(" is declared twice"), new RegExp(" type must be one of bool, number, choice, text"), new RegExp(", which a [a-z]+ setting does not take"), new RegExp(" label must be 1 to 60 characters"), new RegExp(" description must be text of at most 200 characters"), new RegExp("^\"?settings\"? must be a list of at most"), new RegExp("^settings: setting \\d+ "), new RegExp("^settings: \".*\" (is declared twice|\"?type\"? must be one of|has \".*\", which a|\"?label\"? must be|\"?description\"? must be)")]],
    ["messages-translations", [new RegExp("\"?content\\.messages\"?: .* is not one of en\\.json"), new RegExp("names a folder without en\\.json"), new RegExp("is not in en\\.json \\(a translation")]],
    ["setting-refused", [new RegExp(" must be on or off$"), new RegExp(" must be a whole number from -?\\d+ to -?\\d+$"), new RegExp(" must be one of: "), new RegExp(" characters, on one line$"), new RegExp(" has no setting \"")]],
    ["boot-dependency", [new RegExp("^needs .*, which (is not installed|is switched off|did not load)$"), new RegExp("^needs .* is installed$"), new RegExp("is in a dependency cycle"), new RegExp("^cannot run with .*: switch one of them off")]],
    ["engine-dependency", [new RegExp("^not loaded: needs .*, which the game did not load before it"), new RegExp("^not loaded: needs .*, and the game loaded ")]],
    ["engine-settings", [new RegExp("^settings: (a name is not one mod\\.json can declare|a value is not a boolean|a text value cannot be used|out of memory)")]],
    ["messages-not-object", [new RegExp("^messages: the file is not a JSON object"), new RegExp("must be a JSON object of line ids to text"), new RegExp("^messages file is not a JSON object")]],
    ["messages-too-many", [new RegExp("at most 256 lines per mod"), new RegExp("has \\d+ lines, more than"), new RegExp("^messages: a mod has at most")]],
    ["messages-key", [new RegExp("^messages(/[a-z]{2})?: key .* must be 1 to 48"), new RegExp(": the line id \".*\" must be"), new RegExp("^messages: a key must be")]],
    ["messages-text", [new RegExp("^messages(/[a-z]{2})?: \".*\" must be text of 1 to 400"), new RegExp(": the line \".*\" must be text of 1 to"), new RegExp("^messages: a line must be text")]],
    ["messages-out-of-memory", [new RegExp("^messages: out of memory")]],
    ["texture-copied", [new RegExp("is an unchanged copy of a texture from")]],
    ["texture-mipmaps", [new RegExp("mip levels\\. Save it with one level"), new RegExp("bytes after its image")]],
    ["texture-size", [new RegExp("A texture is 1 to \\d+ pixels a side"), new RegExp("A PNG in a mod is at most"), new RegExp("\" is a \\d+x\\d+ \\S+\\.$"), new RegExp("^PNG texture is over \\d+x\\d+")]],
    ["texture-small", [new RegExp("smaller than the original \\d+x\\d+"), new RegExp("not the shape of the original \\d+x\\d+")]],
    ["texture-png-unreadable", [new RegExp("^texture is not a PNG the game reads"), new RegExp("^PNG texture could not be read")]],
    ["texture-png-budget", [new RegExp("^PNG textures are over \\d+ MiB of pixels")]],
    ["texture-twice", [new RegExp("are the same texture: the game uses only one")]],
    ["picture-misnamed", [new RegExp("Pictures go in \\.png or \\.dds files"), new RegExp("is named as \\S* but holds"), new RegExp("is a picture in a format mods can't carry")]],
    ["png-extra-data", [new RegExp("chunk, which a picture in a mod may not carry"), new RegExp("of metadata\\. Export it again without metadata")]],
    ["texture-format", [new RegExp("is not a DDS file"), new RegExp("is a DDS format the game can't load"), new RegExp("is an uncompressed DDS of \\d+ bits"), new RegExp("is not a \\S+ we can read"), new RegExp("\" is cut short"), new RegExp("^is cut short")]],
    ["inspector-no-scene", [new RegExp("^The game is not in a scene yet")]],
    ["inspector-texture-gone", [new RegExp("^That texture is no longer kept")]],
    ["inspector-export", [new RegExp("^Select at least one texture"), new RegExp("^The mod id must look like yourname\\.mod-name"), new RegExp("^The id looks like yourname\\.mod-name"), new RegExp("^ZIP support is not loaded in the game page"), new RegExp("^the pixels do not match the size")]],
    ["dev-start-game", [new RegExp("^Start the game first: developer mode"), new RegExp("^no developer-mode mod is running in this session")]],
    ["dev-check-fails", [new RegExp("fails playac-mod check")]],
    ["dev-restart-needed", [new RegExp("^(mod\\.json|The mod id|the mod id) changed: restart"), new RegExp(": restart the game to load it"), new RegExp("^The script cannot reload"), new RegExp("^Textures cannot reload"), new RegExp("^reload refused: "), new RegExp("^could not write the files \\(.*\\): restart the game$")]],
    ["dev-folder-unreadable", [new RegExp("^The folder could not be read"), new RegExp("^Stopped watching the folder"), new RegExp("more than 2000 files"), new RegExp("more than 64 MB of mod files"), new RegExp("^no files$"), new RegExp(" is not file bytes$")]],
    ["dev-server-address", [new RegExp("^Use the address playac-mod dev prints")]],
    ["dev-server-origin", [new RegExp("dev server refused this site")]],
    ["dev-server-protocol", [new RegExp("speaks protocol")]],
    ["dev-server-hash", [new RegExp("does not match its hash in the index"), new RegExp("gives no sha256 for")]],
    ["dev-server-unreachable", [new RegExp("^The dev server could not be reached"), new RegExp("for /__playac/index")]],
    ["dev-not-reloaded", [new RegExp("^Not reloaded: "), new RegExp("^not reloaded: "), new RegExp("^Not loaded: ")]],
    ["dev-visits-off", [new RegExp("^A mod is loaded in developer mode, so friend visits are off")]],
    ["dev-upload-off", [new RegExp("^Sharing is off while a mod is loaded in developer mode")]],
    ["log-texture-not-read", [new RegExp("^texture .* not read: "), new RegExp("^texture .* could not be read: not a DDS")]],
    ["mods-cleared", [new RegExp("^Your browser cleared your mods")]],
    ["mods-watchdog", [new RegExp("^The game stopped responding the last time it started with")]],
    ["mods-unreadable", [new RegExp("^Your mods could not be read")]],
    ["mods-db", [new RegExp("mods database is held open by another tab"), new RegExp("mods database refused the change"), new RegExp("mods database could not be (read|opened|used)")]],
    ["mod-not-installed", [new RegExp("^that mod is not installed")]],
    ["mods-export-too-big", [new RegExp("^Your mods are .* together, more than the \\d+ MB one export can hold")]],
    ["storage-full", [new RegExp("not enough room in this browser's storage"), new RegExp("would not save the setting that turns mods on"), new RegExp("would not save the request to delete the mod.s data")]],
    ["mods-too-many", [new RegExp("^only the first \\d+ mods load"), new RegExp("^You already have \\d+ mods on")]],
    ["mods-size-cap", [new RegExp("more than the \\d+ MB"), new RegExp("already fill the \\d+ MB"), new RegExp("^Your mods would unpack to more than")]],
    ["mod-removed", [new RegExp("^Removed by the moderators")]],
    ["boot-failed", [new RegExp("^the stored mod is gone"), new RegExp("^the stored mod does not match its id"), new RegExp("^could not be unpacked"), new RegExp("the mod list could not be (finished|written)")]],
    ["script-budget", [new RegExp("took too long"), new RegExp(" \\(in a call to [^)]*\\)$")]],
    ["script-slow", [new RegExp("kept the game waiting")]],
    ["script-memory", [new RegExp("^out of memory"), new RegExp("not enough memory")]],
    ["script-on-event", [new RegExp("on\\(\\): unknown event"), new RegExp("is not in this mod's \"hooks\" list")]],
    ["script-on-late", [new RegExp("handlers can only be added while the script loads")]],
    ["script-on-too-many", [new RegExp("on\\(\\): at most \\d+ handlers")]],
    ["script-store-no-town", [new RegExp("no town is loaded yet")]],
    ["remote-not-exported", [new RegExp("is not in mod\\.json \"exports\"")]],
    ["script-remote", [new RegExp("remote\\.(add|call|has): "), new RegExp("remote\\.call "), new RegExp("it offers no function"), new RegExp("can be passed, not a"), new RegExp("cannot be passed$"), new RegExp("a table key must be a string"), new RegExp("values in one call$"), new RegExp("KB of data in one call$"), new RegExp("^its script failed$")]],
    ["script-store", [new RegExp("store\\.set: "), new RegExp("store\\.client\\.set: "), new RegExp("only strings, numbers and booleans can be saved"), new RegExp("key longer than \\d+ bytes"), new RegExp("a key cannot hold a zero byte"), new RegExp("value longer than \\d+ bytes"), new RegExp("a value cannot hold a zero byte"), new RegExp("NaN cannot be saved"), new RegExp("the store would be over"), new RegExp("the store could not be written")]],
    ["script-sandbox", [new RegExp("__gc is not allowed"), new RegExp("__len metamethod are not supported"), new RegExp("is not allowed in mod scripts")]],
    ["script-state-failed", [new RegExp("Lua state failed"), new RegExp("^script closed$"), new RegExp("raised an error that is not a string")]],
    ["script-syntax", [new RegExp("'[^']+' expected"), new RegExp("unexpected symbol near"), new RegExp("near <eof>"), new RegExp("unfinished (long )?(string|comment)"), new RegExp("malformed number near"), new RegExp("syntax error near"), new RegExp("invalid escape sequence"), new RegExp("expected \\(to close")]],
    ["command-permission", [new RegExp("is not in this mod's \"permissions\"")]],
    ["command-cap", [new RegExp("commands in one event"), new RegExp("a day for each mod"), new RegExp("commands waiting"), new RegExp("command queue is full")]],
    ["command-item", [new RegExp("^(give_item|send_letter): item "), new RegExp("can only give its own new items"), new RegExp("no item by that id in this mod's items file"), new RegExp("item must be an item number"), new RegExp("can only send its own letters\\.json letters"), new RegExp("no letter by that id in this mod's letters file")]],
    ["command-args", [new RegExp("^(send_letter|give_item|set_flag|show_line|ask): (takes a table|text must|from must|paper must|choices must|each choice must|the key must|a text value|a number value|the value must|the text does not fit|template must|template takes no)"), new RegExp("item: that item id is too long")]],
    ["command-city", [new RegExp("commands are switched off in The City")]],
    ["command-visiting", [new RegExp("only the town owner's game can change the town")]],
    ["command-lent-home", [new RegExp("lent for a visit acts only in their town")]],
    ["command-no-room", [new RegExp("post office are (both|all) full"), new RegExp("the pockets are full \\(a new item")]],
    ["command-not-shown", [new RegExp("cannot be drawn in the window"), new RegExp("the item is not this town's to give"), new RegExp("the flag could not be saved"), new RegExp("the mod's script (is not running|stopped)"), new RegExp("the letter is gone")]],
    ["upload-name-word", [new RegExp("^The mod's name has a word the site does not allow")]],
    ["upload-author-word", [new RegExp("^An author name has a word the site does not allow")]],
    ["upload-sign-in", [new RegExp("^Sign in to share a mod")]],
    ["upload-publisher-terms", [new RegExp("accept the mod rules before you share")]],
    ["upload-under-13", [new RegExp("^Sharing mods is for players 13 or older")]],
    ["upload-rights-removed", [new RegExp("can no longer share mods"), new RegExp("^Mod uploads are switched off for your account")]],
    ["upload-version-exists", [new RegExp("version of the mod is already uploaded"), new RegExp("That version is already shared")]],
    ["upload-screenshot", [new RegExp("[Ss]creenshot")]],
    ["upload-changelog", [new RegExp("[Cc]hangelog"), new RegExp("Say in one line what this version changes")]],
    ["upload-form", [new RegExp("^The upload form"), new RegExp("^Send one zip at a time")]],
    ["upload-not-owner", [new RegExp("already (uploaded|shares) a mod with (this|that) id")]],
    ["upload-too-many", [new RegExp("mods an hour"), new RegExp("a lot of uploads for one hour"), new RegExp("waiting for review"), new RegExp("the most mods waiting for review")]],
    ["upload-storage-full", [new RegExp("Your mods would take more than"), new RegExp("use all the space you have")]],
    ["upload-busy", [new RegExp("upload from your account or your network is still going"), new RegExp("too slow to upload the")]],
    ["upload-image-check", [new RegExp("couldn't check the images in your mod")]],
    ["upload-refused", [new RegExp("^This upload can't be accepted")]],
    ["upload-closed", [new RegExp("^Sharing mods is not open yet")]],
    ["upload-paused", [new RegExp("^New mod uploads are paused")]],
    ["upload-two-factor", [new RegExp("^Turn on two-factor sign-in"), new RegExp("^Enter the code from your authenticator app"), new RegExp("Sharing mods is switched off (on this server )?for now"), new RegExp("^Two-factor sign-in is not available"), new RegExp("^Too many wrong codes in a row")]],
    ["upload-prefix-taken", [new RegExp("before the dot belongs to another player")]],
    ["upload-content-taken-down", [new RegExp("were taken down from the registry")]],
    ["upload-too-many-attempts", [new RegExp("^You can try \\d+ uploads an hour"), new RegExp("a lot of upload tries for one hour")]],
    ["upload-too-many-images", [new RegExp("different pictures. Split it"), new RegExp("pictures add up to more than")]],
    ["import-bad-source", [new RegExp("github.com/<owner>/<repo>@<tag>"), new RegExp("^That is not a GitHub owner")]],
    ["mod-conflict", [new RegExp("^A moderator took this version out of the list"), new RegExp("Another decision on this version came first")]],
    ["status-update-available", [new RegExp("^Update available")]],
    ["status-yanked", [new RegExp("^No longer offered in the mod list")]],
    ["status-mods-switched-off", [new RegExp("^Mods are switched off for everyone")]],
    ["visit-modset-mismatch", [new RegExp("world mods don.t match"), new RegExp("Visits need the same world mods")]],
    ["visit-lend-failed", [new RegExp("does not match the friend.s copy"), new RegExp("is a different mod$"), new RegExp("do not add up to their town.s mod set"), new RegExp("does not need to be lent for a visit"), new RegExp("friend.s mod list could not be read"), new RegExp("cannot keep a friend.s mods for one visit"), new RegExp("friend.s settings for .* are not ones that mod takes"), new RegExp("^Couldn.t load .* mods for this visit"), new RegExp("^Invalid mod list")]],
    ["city-mod-refused", [new RegExp("a City mod may only hold textures and lines"), new RegExp("a City mod may not run scripts"), new RegExp("a City mod may not ask for commands"), new RegExp("City mod list could not be read"), new RegExp("^Couldn.t download the City.s mods")]]
  ];
  /* END generated error codes */

  /* Text the site puts before a problem; not part of it (errors.mjs PREFIXES). */
  const PROBLEM_PREFIX = /^(Installed but switched off|The mod was refused|This mod did not load|Script stopped|script stopped|developer copy): /;

  /* The catalogue code of each problem in a message ("a; b"), '' for one the
   * catalogue does not name. ERROR_DOCS + '#' + code is its page. */
  function problemCodes(msg) {
    let t = String(msg == null ? '' : msg).trim();
    while (PROBLEM_PREFIX.test(t)) t = t.replace(PROBLEM_PREFIX, '');
    return t.split(/;\s+/).map(function (s) { return s.trim(); }).filter(function (s) { return s && s !== 'and more'; })
      .map(function (p) {
        for (const row of ERROR_CODES) if (row[1].some(function (re) { return re.test(p); })) return row[0];
        return '';
      });
  }

  function errorCode(msg) { return problemCodes(msg)[0] || ''; }

  /* An error a rule raised on purpose (as opposed to a crash in a library). */
  function ruleError(msg) {
    const e = new Error(msg);
    e.modRule = true;
    e.codes = problemCodes(msg); /* one per problem, in order */
    e.code = e.codes[0] || '';
    return e;
  }

  function cpLen(s) { return Array.from(s).length; }
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function lowerExt(p) { const i = p.lastIndexOf('.'); return i < 0 ? '' : p.slice(i).toLowerCase(); }

  /* ── strict JSON ──
   * JSON.parse silently keeps the LAST of two equal keys, while the game engine reads
   * the FIRST, so a mod could show the registry one manifest and the game another.
   * This parser refuses duplicate keys, \u0000 (C strings end there) and values
   * nested deeper than MAX_JSON_DEPTH (the game engine's limit), and otherwise follows
   * RFC 8259 exactly. */
  function parseJsonStrict(text) {
    let i = 0;
    const n = text.length;
    const NUM_RE = /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/y;
    function fail(why) {
      const e = new Error(why || 'is not valid JSON');
      e.jsonRule = !!why;
      throw e;
    }
    function ws() {
      while (i < n) {
        const c = text.charCodeAt(i);
        if (c === 32 || c === 9 || c === 10 || c === 13) i++; else break;
      }
    }
    function str() {
      i++; /* the opening quote */
      let out = '';
      let start = i;
      for (;;) {
        if (i >= n) fail();
        const c = text.charCodeAt(i);
        if (c === 34) { out += text.slice(start, i); i++; return out; }
        if (c === 0) fail('a string holds a NUL character (\\u0000)');
        if (c < 0x20) fail();
        if (c === 92) {
          out += text.slice(start, i);
          const e = text[i + 1];
          i += 2;
          if (e === '"') out += '"';
          else if (e === '\\') out += '\\';
          else if (e === '/') out += '/';
          else if (e === 'b') out += '\b';
          else if (e === 'f') out += '\f';
          else if (e === 'n') out += '\n';
          else if (e === 'r') out += '\r';
          else if (e === 't') out += '\t';
          else if (e === 'u') {
            const h = text.slice(i, i + 4);
            if (!/^[0-9a-fA-F]{4}$/.test(h)) fail();
            const cp = parseInt(h, 16);
            if (cp === 0) fail('a string holds a NUL character (\\u0000)');
            out += String.fromCharCode(cp);
            i += 4;
          } else fail();
          start = i;
          continue;
        }
        i++;
      }
    }
    function value(depth) {
      if (depth > MAX_JSON_DEPTH) fail('nested more than ' + MAX_JSON_DEPTH + ' levels deep');
      ws();
      if (i >= n) fail();
      const c = text[i];
      if (c === '{') {
        i++;
        const obj = {};
        const keys = new Set();
        ws();
        if (text[i] === '}') { i++; return obj; }
        for (;;) {
          ws();
          if (text[i] !== '"') fail();
          const k = str();
          if (keys.has(k)) fail('duplicate key ' + JSON.stringify(k));
          keys.add(k);
          ws();
          if (text[i] !== ':') fail();
          i++;
          const v = value(depth + 1);
          /* defineProperty, so a "__proto__" key is a plain key, as in JSON.parse */
          Object.defineProperty(obj, k, { value: v, enumerable: true, writable: true, configurable: true });
          ws();
          if (text[i] === ',') { i++; continue; }
          if (text[i] === '}') { i++; return obj; }
          fail();
        }
      }
      if (c === '[') {
        i++;
        const arr = [];
        ws();
        if (text[i] === ']') { i++; return arr; }
        for (;;) {
          arr.push(value(depth + 1));
          ws();
          if (text[i] === ',') { i++; continue; }
          if (text[i] === ']') { i++; return arr; }
          fail();
        }
      }
      if (c === '"') return str();
      if (text.startsWith('true', i)) { i += 4; return true; }
      if (text.startsWith('false', i)) { i += 5; return false; }
      if (text.startsWith('null', i)) { i += 4; return null; }
      NUM_RE.lastIndex = i;
      const m = NUM_RE.exec(text);
      if (!m || !m[0].length || m[0] === '-') fail();
      i += m[0].length;
      const v = Number(m[0]);
      if (!isFinite(v)) fail('a number is out of range');
      return v;
    }
    let v;
    try {
      v = value(0);
      ws();
      if (i !== n) fail();
    } catch (e) {
      if (e && e.jsonRule !== undefined) throw e;
      fail(); /* a RangeError from very deep nesting */
    }
    return v;
  }

  function decodeUtf8(bytes) {
    /* ignoreBOM: a leading BOM stays in the text, so it is refused as JSON
     * (Go and the game engine refuse it too) instead of being stripped here only. */
    return new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes);
  }

  function parseFile(name, bytes) {
    try { return { value: parseJsonStrict(decodeUtf8(bytes)) }; } catch (e) {
      return { error: e && e.jsonRule ? name + ': ' + e.message : name + ' is not valid JSON' };
    }
  }

  /* ── paths ── */

  /* Dropped before any other rule sees it: macOS and Windows litter, and any
   * hidden name (a part starting "."), so a Finder or Explorer ZIP of a
   * `playac-mod new` folder with its .gitignore, .github/, .vscode/ or .playac/
   * installs. Never unpacked, hashed or counted. A "." or ".." part
   * is not hidden but unsafe: pathProblem refuses it. Go validate.go isJunk is
   * the same rule; the engine's texture scan skips "." names too. */
  function isHidden(s) { return s.charAt(0) === '.' && s !== '.' && s !== '..'; }
  function isJunk(p) {
    return p.split('/').some(function (s) { return isHidden(s) || s === '__MACOSX' || s === 'Thumbs.db'; });
  }

  /* Why this path cannot be in a mod, or '' when it can. */
  function pathProblem(p) {
    if (typeof p !== 'string' || !p.length) return 'empty';
    if (p.length > MAX_PATH) return 'over ' + MAX_PATH + ' bytes';
    for (let k = 0; k < p.length; k++) {
      const c = p.charCodeAt(k);
      if (c < 0x20 || c === 0x7f) return 'a control character';
      if (c > 0x7e) return 'not plain ASCII';
      if (c === 92) return 'a backslash';
      if (c === 58) return 'a colon';
    }
    if (p.split('/').some(function (s) { return s === '' || s === '.' || s === '..'; })) {
      return 'an empty, "." or ".." part';
    }
    return '';
  }

  function segmentOk(s) { return pathProblem(s) === '' && s.indexOf('/') < 0; }

  /* entries: { path: Uint8Array } straight from the ZIP. Drops junk and folder
   * entries, strips one top folder when mod.json is inside it, and applies the
   * path, type and size rules. Entry order never changes the answer. */
  function normalizeEntries(raw) {
    let names = Object.keys(raw).filter(function (n) { return !n.endsWith('/') && !isJunk(n); }).sort();
    let entries = {};
    for (const n of names) entries[n] = raw[n];
    const problems = [];
    if (names.indexOf('mod.json') < 0) {
      const slash = names.length ? names[0].indexOf('/') : -1;
      const top = slash > 0 ? names[0].slice(0, slash + 1) : '';
      if (top && segmentOk(top.slice(0, -1)) &&
          names.every(function (n) { return n.startsWith(top); }) && names.indexOf(top + 'mod.json') >= 0) {
        const out = {};
        for (const n of names) out[n.slice(top.length)] = entries[n];
        entries = out;
        names = Object.keys(out).sort();
      }
    }
    if (names.indexOf('mod.json') < 0) {
      return { entries: entries, names: names, problems: ['There is no mod.json at the top of the ZIP'] };
    }
    if (names.length > MAX_FILES) problems.push('more than ' + MAX_FILES + ' files');
    let total = 0;
    const folded = new Map();
    /* Case-folded, like the twin rule: "tex.png" and "TEX.png/a.png" clash on a
     * case-insensitive disk (Windows, macOS) just as an exact pair does (Go
     * checkPaths). Paths are ASCII by the time this is used. */
    const set = new Set(names.map(function (x) { return x.toLowerCase(); }));
    for (const n of names) {
      const bad = pathProblem(n);
      if (bad) { problems.push(JSON.stringify(n) + ' is not a safe path (' + bad + ')'); continue; }
      const ext = lowerExt(n);
      if (EXTS.indexOf(ext) < 0) {
        problems.push(JSON.stringify(n) + ': only ' + EXTS.join(' ') + ' files can be in a mod');
        continue;
      }
      const lower = n.toLowerCase();
      if (folded.has(lower)) {
        problems.push(JSON.stringify(folded.get(lower)) + ' and ' + JSON.stringify(n) + ' are the same name ignoring letter case');
      } else folded.set(lower, n);
      const parts = n.split('/');
      for (let k = 1; k < parts.length; k++) {
        const dir = parts.slice(0, k).join('/');
        if (set.has(dir.toLowerCase())) { problems.push(JSON.stringify(dir) + ' is both a file and a folder'); break; }
      }
      const size = entries[n].length;
      total += size;
      if (n === 'mod.json' && size > MAX_MANIFEST) problems.push('mod.json is over ' + (MAX_MANIFEST / KIB) + ' KB');
      else if (ext === '.json' && n !== 'mod.json' && size > MAX_JSON) problems.push(JSON.stringify(n) + ' is over ' + (MAX_JSON / KIB) + ' KB');
      else if (ext === '.lua' && size > MAX_LUA) problems.push(JSON.stringify(n) + ' is over ' + (MAX_LUA / KIB) + ' KB');
    }
    if (total > MAX_UNPACKED) problems.push('it unpacks to more than ' + (MAX_UNPACKED / MIB) + ' MB');
    return { entries: entries, names: names, problems: problems };
  }

  /* ── mod.json ── */

  /* Where a mod.json's "api" stands against this game: 'ok', 'older' (below
   * API_MIN, or no "api" at all: a mod from before the field), 'newer' (above
   * API_MAX), or 'bad' (present but not a whole number). */
  function apiStatus(m) {
    if (!isObj(m) || !has(m, 'api')) return 'older';
    const a = m.api;
    if (typeof a !== 'number' || !Number.isInteger(a)) return 'bad';
    if (a < API_MIN) return 'older';
    if (a > API_MAX) return 'newer';
    return 'ok';
  }

  function apiRange() { return API_MIN === API_MAX ? String(API_MIN) : API_MIN + ' to ' + API_MAX; }

  /* The plain reason for a mod this game cannot read by its "api"; '' when it can. */
  function apiProblem(m) {
    const st = apiStatus(m);
    if (st === 'ok') return '';
    if (st === 'newer') {
      return 'needs a newer game: it is made for mod API ' + m.api + ', this game reads ' + apiRange();
    }
    if (st === 'older' && isObj(m) && has(m, 'api')) {
      return 'made for an older game: it is made for mod API ' + m.api + ', this game reads ' + apiRange();
    }
    return '"api" must be a whole number, the mod API level the mod is made for (' + apiRange() + ' today)';
  }

  /* Each supported api level's rules. A new level adds its own entry here and
   * keeps the old ones while API_MIN still covers them, so installed mods are
   * checked by the rules they were written for. */
  const MANIFEST_RULES = { 1: manifestRulesV1, 2: manifestRulesV2 };

  /* "permissions", an api level 2 key: optional; one or more known
   * commands, each once, and only on a mod with "scripts". Called from
   * manifestRulesV2. */
  function rulesV2Permissions(m, errs) {
    if (!has(m, 'permissions')) return;
    const p = m.permissions;
    if (!Array.isArray(p) || !p.length ||
        p.some(function (x, k) { return PERMISSIONS.indexOf(x) < 0 || p.indexOf(x) !== k; })) {
      errs.push('"permissions" must list one or more commands, each once, from: ' + PERMISSIONS.join(', '));
    } else if (!has(m, 'scripts')) {
      errs.push('"permissions" is for a mod with "scripts": only a script can use a command');
    }
  }

  /* names: every file path in the mod (after the top folder is stripped). Returns
   * a list of problems in plain words; empty means the manifest is good. */
  function validateManifest(m, names) {
    if (!isObj(m)) return ['mod.json is not a JSON object'];
    const why = apiProblem(m);
    if (why) return [why];
    return MANIFEST_RULES[m.api](m, names);
  }

  /* mod.json "tags": the storefront's filters. At most MAX_TAGS
   * different strings from TAGS; an empty array is fine. The game itself never
   * reads them. Go parseTags is the same rule. '' when fine. */
  function tagsProblem(t) {
    const ok = Array.isArray(t) && t.length <= MAX_TAGS &&
      t.every(function (x, k) { return typeof x === 'string' && TAGS.indexOf(x) >= 0 && t.indexOf(x) === k; });
    return ok ? '' : '"tags" must list at most ' + MAX_TAGS + ' different tags from: ' + TAGS.join(', ');
  }

  /* mod.json rules at api level 1. lv: what a later level changes in them
   * (manifestRulesV2 passes LEVEL2); level 1 itself never passes it. */
  const LEVEL1 = { unbuilt: UNBUILT_KEYS, hooks: HOOKS, messagesFolder: false };
  const LEVEL2 = { unbuilt: UNBUILT_KEYS_V2, hooks: HOOKS_V2, messagesFolder: true };
  function manifestRulesV1(m, names, lv) {
    if (!lv) lv = LEVEL1;
    const errs = [];
    const isFile = function (p) { return names.indexOf(p) >= 0; };
    const isDir = function (p) { return names.some(function (n) { return n.startsWith(p + '/'); }); };
    if (typeof m.schema !== 'number' || m.schema !== 1) errs.push('"schema" must be 1');
    for (const k of lv.unbuilt) {
      if (has(m, k)) errs.push('"' + k + '" is not built yet, so a mod cannot use it: take it out of mod.json');
    }
    if (typeof m.id !== 'string' || !ID_RE.test(m.id)) {
      errs.push('"id" must look like author.mod-name (lowercase letters, digits and dashes, at most 32 + 48)');
    }
    if (typeof m.name !== 'string' || cpLen(m.name.trim()) < 1 || cpLen(m.name.trim()) > NAME_CHARS) {
      errs.push('"name" must be 1 to ' + NAME_CHARS + ' characters');
    }
    if (typeof m.version !== 'string' || !VERSION_RE.test(m.version)) {
      errs.push('"version" must be like 1.0.0 (each part 1 to 9 digits, no leading zeros)');
    }
    if (!Array.isArray(m.authors) || m.authors.length < 1 || m.authors.length > AUTHORS_MAX ||
        m.authors.some(function (a) { return typeof a !== 'string' || cpLen(a.trim()) < 1 || cpLen(a.trim()) > AUTHOR_CHARS; })) {
      errs.push('"authors" must list 1 to ' + AUTHORS_MAX + ' names of 1 to ' + AUTHOR_CHARS + ' characters');
    }
    if (has(m, 'description') && (typeof m.description !== 'string' || cpLen(m.description) > DESCRIPTION_CHARS)) {
      errs.push('"description" must be text of at most ' + DESCRIPTION_CHARS + ' characters');
    }
    if (has(m, 'tags') && tagsProblem(m.tags)) errs.push(tagsProblem(m.tags));
    if (m.scope !== 'client' && m.scope !== 'world') errs.push('"scope" must be "client" or "world"');
    if (m.assets_original !== true) {
      errs.push('"assets_original" must be true: a mod may only contain work its authors made, never files taken from the game');
    }
    if (has(m, 'content')) {
      const content = m.content;
      if (!isObj(content)) errs.push('"content" must be an object');
      else {
        for (const k of Object.keys(content)) {
          const what = '"content.' + k + '"';
          if (CONTENT_KEYS.indexOf(k) < 0) { errs.push(what + ' is not something a mod can add yet'); continue; }
          let p = content[k];
          if (typeof p !== 'string' || !p.length) { errs.push(what + ' must be a path inside the mod'); continue; }
          if (k === 'textures') {
            if (p.endsWith('/')) p = p.slice(0, -1);
            if (pathProblem(p)) errs.push(what + ' must be a path inside the mod');
            else if (!isDir(p)) errs.push(what + ' names ' + content[k] + ', which is not a folder with files in the mod');
          } else if (k === 'messages' && lv.messagesFolder && !isFile(p) &&
                     !pathProblem(p.replace(/\/$/, '')) && isDir(p.replace(/\/$/, ''))) {
            /* level 2: a folder of <lang>.json files, checked in readMod */
          } else {
            if (pathProblem(p)) errs.push(what + ' must be a path inside the mod');
            else if (!isFile(p)) errs.push(what + ' names ' + p + ', which is not in the mod');
          }
          if (k === 'shops' && m.scope !== 'world') {
            errs.push(what + ' changes what visitors see, so "scope" must be "world"');
          }
        }
      }
    }
    if (has(m, 'scripts')) {
      const s = m.scripts;
      if (!isObj(s)) errs.push('"scripts" must be an object');
      else {
        for (const k of Object.keys(s)) {
          if (SCRIPT_KEYS.indexOf(k) < 0) errs.push('"scripts.' + k + '" is not a scripts setting (only main and hooks)');
        }
        if (typeof s.main !== 'string' || pathProblem(s.main) || !s.main.endsWith('.lua')) {
          errs.push('"scripts.main" must be a .lua file inside the mod (lowercase .lua)');
        } else if (!isFile(s.main)) errs.push('"scripts.main" names ' + s.main + ', which is not in the mod');
        if (!Array.isArray(s.hooks) || !s.hooks.length ||
            s.hooks.some(function (h, k) { return lv.hooks.indexOf(h) < 0 || s.hooks.indexOf(h) !== k; })) {
          errs.push('"scripts.hooks" must list one or more events, each once, from: ' + lv.hooks.join(', '));
        }
      }
    }
    return errs;
  }

  /* ── api level 2 () ──
   * Level 1's rules, with depends and conflicts built, plus data_version,
   * settings, a messages folder of translations and the "migrate" hook. */

  const EXPORT_NAME_RE = /^[a-z0-9_]{1,32}$/;
  const SETTING_NAME_RE = /^[a-z][a-z0-9_]{0,31}$/;
  const SETTING_KEYS = {
    bool: ['default'],
    number: ['default', 'min', 'max'],
    choice: ['default', 'choices'],
    text: ['default', 'max_length']
  };
  const SETTING_COMMON = ['name', 'type', 'label', 'description'];
  const RANGE_CMP_RE = /^(>=|<=|>|<|=)?((?:0|[1-9][0-9]{0,8})\.(?:0|[1-9][0-9]{0,8})\.(?:0|[1-9][0-9]{0,8}))$/;

  /* x.y.z against x.y.z: -1, 0 or 1. */
  function compareVersions(a, b) {
    const x = String(a).split('.').map(Number);
    const y = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
    return 0;
  }

  /* A version range: "*" (any), or 1 to 4 comparators split by one space, each
   * an optional >= <= > < = and a version ("=" when none). At most 64 bytes.
   * [{ op, v }] (empty for "*"), or null when it is not one. */
  function parseRange(s) {
    if (typeof s !== 'string' || !s.length || s.length > RANGE_BYTES_MAX) return null;
    if (s === '*') return [];
    const parts = s.split(' ');
    if (parts.length > RANGE_PARTS_MAX) return null;
    const out = [];
    for (const p of parts) {
      const m = RANGE_CMP_RE.exec(p);
      if (!m) return null;
      out.push({ op: m[1] || '=', v: m[2] });
    }
    return out;
  }

  /* Whether version is inside range (a string parseRange reads). */
  function inRange(version, range) {
    const r = parseRange(range);
    if (!r || !VERSION_RE.test(String(version))) return false;
    return r.every(function (c) {
      const k = compareVersions(version, c.v);
      return c.op === '=' ? k === 0 : c.op === '>=' ? k >= 0 : c.op === '<=' ? k <= 0 : c.op === '>' ? k > 0 : k < 0;
    });
  }

  function hasControl(s) {
    for (let k = 0; k < s.length; k++) {
      const c = s.charCodeAt(k);
      if (c < 0x20 || c === 0x7f) return true;
    }
    return false;
  }

  function wholeIn(v, lo, hi) { return typeof v === 'number' && Number.isInteger(v) && v >= lo && v <= hi; }

  /* Problems with one declared setting (its shape; the value a player picks is
   * settingValueOk's). at: 'settings: "name"' for the messages. */
  function settingProblems(s, idx, seen) {
    const errs = [];
    const at0 = 'settings: setting ' + (idx + 1);
    if (!isObj(s)) return [at0 + ' must be an object'];
    if (typeof s.name !== 'string' || !SETTING_NAME_RE.test(s.name)) {
      return [at0 + ' "name" must be 1 to 32 of a-z 0-9 _, starting with a letter'];
    }
    const at = 'settings: "' + s.name + '"';
    if (seen.has(s.name)) errs.push(at + ' is declared twice');
    seen.add(s.name);
    if (!has(SETTING_KEYS, s.type)) return errs.concat([at + ' "type" must be one of bool, number, choice, text']);
    for (const k of Object.keys(s)) {
      if (SETTING_COMMON.indexOf(k) < 0 && SETTING_KEYS[s.type].indexOf(k) < 0) {
        errs.push(at + ' has "' + k + '", which a ' + s.type + ' setting does not take');
      }
    }
    if (typeof s.label !== 'string' || cpLen(s.label.trim()) < 1 || cpLen(s.label.trim()) > SETTING_LABEL_CHARS) {
      errs.push(at + ' "label" must be 1 to ' + SETTING_LABEL_CHARS + ' characters');
    }
    if (has(s, 'description') && (typeof s.description !== 'string' || cpLen(s.description) > SETTING_DESC_CHARS)) {
      errs.push(at + ' "description" must be text of at most ' + SETTING_DESC_CHARS + ' characters');
    }
    if (s.type === 'bool') {
      if (typeof s.default !== 'boolean') errs.push(at + ' "default" must be true or false');
    } else if (s.type === 'number') {
      if (!wholeIn(s.min, -SETTING_NUM_MAX, SETTING_NUM_MAX) || !wholeIn(s.max, -SETTING_NUM_MAX, SETTING_NUM_MAX) || s.min >= s.max) {
        errs.push(at + ' "min" and "max" must be whole numbers from -' + SETTING_NUM_MAX + ' to ' + SETTING_NUM_MAX + ', min below max');
      } else if (!wholeIn(s.default, s.min, s.max)) {
        errs.push(at + ' "default" must be a whole number from min to max');
      }
    } else if (s.type === 'choice') {
      const c = s.choices;
      if (!Array.isArray(c) || c.length < SETTING_CHOICES_MIN || c.length > SETTING_CHOICES_MAX ||
          c.some(function (x, k) { return typeof x !== 'string' || cpLen(x) < 1 || cpLen(x) > SETTING_CHOICE_CHARS || hasControl(x) || c.indexOf(x) !== k; })) {
        errs.push(at + ' "choices" must list ' + SETTING_CHOICES_MIN + ' to ' + SETTING_CHOICES_MAX + ' different texts of 1 to ' + SETTING_CHOICE_CHARS + ' characters');
      } else if (c.indexOf(s.default) < 0) {
        errs.push(at + ' "default" must be one of its choices');
      }
    } else {
      if (!wholeIn(s.max_length, 1, SETTING_TEXT_MAX)) errs.push(at + ' "max_length" must be a whole number from 1 to ' + SETTING_TEXT_MAX);
      else if (typeof s.default !== 'string' || cpLen(s.default) > s.max_length || hasControl(s.default)) {
        errs.push(at + ' "default" must be text of at most max_length characters, on one line');
      }
    }
    return errs;
  }

  /* depends / conflicts: an object of mod id -> version range. */
  function linkProblems(m, key) {
    const errs = [];
    if (!has(m, key)) return errs;
    const v = m[key];
    const what = '"' + key + '"';
    if (!isObj(v)) return [what + ' must be an object of mod id to version range, like {"author.mod": ">=1.0.0"}'];
    const ids = Object.keys(v);
    if (ids.length > MAX_DEPS) errs.push(what + ' may name at most ' + MAX_DEPS + ' mods');
    for (const id of ids) {
      if (!ID_RE.test(id)) { errs.push(what + ': ' + JSON.stringify(id) + ' is not a mod id'); continue; }
      if (id === m.id) errs.push(what + ' names the mod itself');
      if (!parseRange(v[id])) {
        errs.push(what + ': the range for ' + id + ' must be "*" or up to ' + RANGE_PARTS_MAX + ' of >=, <=, >, <, = and a version, like ">=1.0.0 <2.0.0"');
      }
    }
    return errs;
  }

  /* The language files of a level-2 messages folder: [{ lang, path }], from
   * the manifest's content.messages and the mod's file names. A single file
   * (level 1's form) is [{ lang: 'en', path }]. */
  function messageFiles(m, names) {
    const p = m && m.content && m.content.messages;
    if (typeof p !== 'string' || !p.length) return [];
    if (names.indexOf(p) >= 0) return [{ lang: 'en', path: p }];
    const dir = p.replace(/\/$/, '') + '/';
    return names.filter(function (n) { return n.startsWith(dir); })
      .map(function (n) { return { lang: n.slice(dir.length).replace(/\.json$/, ''), path: n }; });
  }

  /* Level 2, data side (): depends, conflicts, data_version,
   * the migrate hook's need for it, settings and a messages folder. */
  function rulesV2Data(m, names) {
    let errs = linkProblems(m, 'depends').concat(linkProblems(m, 'conflicts'));
    if (isObj(m.depends) && isObj(m.conflicts)) {
      for (const id of Object.keys(m.depends)) {
        if (has(m.conflicts, id)) errs.push('"' + id + '" is in both "depends" and "conflicts"');
      }
    }
    if (has(m, 'data_version') && !wholeIn(m.data_version, 1, DATA_VERSION_MAX)) {
      errs.push('"data_version" must be a whole number from 1 to ' + DATA_VERSION_MAX);
    }
    if (isObj(m.scripts) && Array.isArray(m.scripts.hooks) && m.scripts.hooks.indexOf('migrate') >= 0 && !has(m, 'data_version')) {
      errs.push('"scripts.hooks" lists "migrate", which needs a "data_version"');
    }
    if (has(m, 'settings')) {
      const s = m.settings;
      if (!Array.isArray(s) || s.length > MAX_SETTINGS) errs.push('"settings" must be a list of at most ' + MAX_SETTINGS + ' settings');
      else {
        const seen = new Set();
        s.forEach(function (one, k) { errs = errs.concat(settingProblems(one, k, seen)); });
      }
    }
    if (isObj(m.content) && typeof m.content.messages === 'string' && names.indexOf(m.content.messages) < 0) {
      const files = messageFiles(m, names);
      if (files.length) {
        for (const f of files) {
          if (LANGS.indexOf(f.lang) < 0 || f.path.slice(-5) !== '.json') {
            errs.push('"content.messages": ' + f.path + ' is not one of ' + LANGS.map(function (l) { return l + '.json'; }).join(' '));
          }
        }
        if (!files.some(function (f) { return f.lang === 'en'; })) {
          errs.push('"content.messages" names a folder without en.json: English is the fallback for every language');
        }
      }
    }
    return errs;
  }

  /* mod.json rules at api level 2: level 1's (with LEVEL2's three changes:
   * depends/conflicts built, the migrate hook, a messages folder), with
   * content.items and renames taken off a copy first, then each level-2
   * addition's own block: items and renames, the data side (
   *), the typed targets (-, targetsRulesV2, whose keys
   * are taken off the copy too). */
  function manifestRulesV2(m, names) {
    const t = targetsRulesV2(m, names);
    const base = Object.assign({}, t.base);
    if (isObj(t.base.content) && has(t.base.content, 'items')) {
      base.content = Object.assign({}, t.base.content);
      delete base.content.items;
    }
    delete base.renames;
    const errs = manifestRulesV1(base, names, LEVEL2).concat(rulesV2Items(m, names), rulesV2Data(m, names), t.errs);
    rulesV2Permissions(m, errs);
    rulesV2Exports(m, errs);
    return errs;
  }

  /* Level 2, "exports": what a library offers other mods, named for
   * their editor (playac-mod types writes LuaLS stubs from it) and held to by
   * the game (remote.add offers only what it lists). Optional; an object of at
   * most EXPORTS_MAX names (remote.add's: 1 to 32 of a-z 0-9 _), each with a
   * one-line description of 1 to EXPORT_DESC_MAX characters; needs scripts. */
  function rulesV2Exports(m, errs) {
    if (!has(m, 'exports')) return;
    const x = m.exports;
    const ok = isObj(x) && Object.keys(x).length <= EXPORTS_MAX && Object.keys(x).every(function (k) {
      const d = x[k];
      return EXPORT_NAME_RE.test(k) && typeof d === 'string' && cpLen(d) >= 1 && cpLen(d) <= EXPORT_DESC_MAX && !/[\u0000-\u001f\u007f]/.test(d);
    });
    if (!ok) {
      errs.push('"exports" must be an object of at most ' + EXPORTS_MAX + ' function names (1 to 32 of a-z 0-9 _), each with a description of 1 to ' +
        EXPORT_DESC_MAX + ' characters on one line');
    } else if (!has(m, 'scripts')) {
      errs.push('"exports" is for a mod with "scripts": only a script offers functions');
    }
  }

  /* Level 2, items side: content.items and renames. */
  function rulesV2Items(m, names) {
    const errs = [];
    const items = isObj(m.content) && has(m.content, 'items') ? m.content.items : undefined;
    if (items !== undefined) {
      if (typeof items !== 'string' || !items.length || pathProblem(items)) errs.push('"content.items" must be a path inside the mod');
      else if (names.indexOf(items) < 0) errs.push('"content.items" names ' + items + ', which is not in the mod');
    }
    if (has(m, 'renames')) {
      const r = m.renames;
      if (!isObj(r)) errs.push('"renames" must be an object of old item id to new item id');
      else {
        const keys = Object.keys(r);
        if (items === undefined) errs.push('"renames" needs "content.items": a rename names an item of this mod');
        if (keys.length > MOD_RENAMES_MAX) errs.push('"renames" may hold at most ' + MOD_RENAMES_MAX + ' entries');
        for (const k of keys) {
          const to = r[k];
          const own = typeof to === 'string' ? MOD_ITEM_FULL_RE.exec(to) : null;
          if (!MOD_ITEM_FULL_RE.test(k)) errs.push('"renames": ' + JSON.stringify(k) + ' must be a full item id like author.mod:thing');
          else if (!own || own[1] !== m.id) errs.push('"renames": ' + JSON.stringify(k) + ' must point at an item of this mod, like ' + m.id + ':thing');
          else if (k === to) errs.push('"renames": ' + JSON.stringify(k) + ' renames an item to itself');
        }
      }
    }
    return errs;
  }

  /* ── settings values ──
   * What a player picked, stored on the row (row.settings, only the values that
   * differ from the default). Boot hands the engine every declared setting's
   * value; a stored value the manifest no longer allows falls back to its
   * default. */

  /* Whether value is allowed for the declared setting s. */
  function settingValueOk(s, v) {
    if (!isObj(s)) return false;
    if (s.type === 'bool') return typeof v === 'boolean';
    if (s.type === 'number') return wholeIn(v, s.min, s.max);
    if (s.type === 'choice') return Array.isArray(s.choices) && s.choices.indexOf(v) >= 0;
    if (s.type === 'text') return typeof v === 'string' && cpLen(v) <= s.max_length && !hasControl(v);
    return false;
  }

  /* The settings a manifest declares. Level 2 only: at level 1 "settings" is an
   * unknown key, ignored (level 1's rules never change). */
  function declaredSettings(manifest) {
    if (!isObj(manifest) || !(manifest.api >= 2) || !Array.isArray(manifest.settings)) return [];
    return manifest.settings;
  }

  /* { name: value } for every setting the manifest declares: the stored value
   * when it is still allowed, else the default. {} for a mod with none. */
  function effectiveSettings(manifest, stored) {
    const out = {};
    const decl = declaredSettings(manifest);
    for (const s of decl) {
      if (!isObj(s) || typeof s.name !== 'string') continue;
      const v = isObj(stored) && has(stored, s.name) ? stored[s.name] : undefined;
      out[s.name] = v !== undefined && settingValueOk(s, v) ? v : s.default;
    }
    return out;
  }

  /* The settings part of a world mod's modset line: sha256 hex of one
   * "name=value\n" line per declared setting, sorted by name (byte order);
   * value is true/false, a whole number in decimal, or the text itself. ''
   * for a mod that declares none. */
  async function settingsSha(manifest, values) {
    const decl = declaredSettings(manifest);
    if (!decl.length) return '';
    const eff = effectiveSettings(manifest, values);
    const names = Object.keys(eff).sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; });
    let text = '';
    for (const n of names) text += n + '=' + String(eff[n]) + '\n';
    return sha256Hex(new TextEncoder().encode(text));
  }

  /* ── dependencies ──
   * Which enabled mods can load, and in what order. rows: in the player's
   * order, each { id, enabled, manifest }. Returns { order: [rows that load,
   * dependencies first], skip: [{ id, error }] }. A mod is skipped when a mod it
   * depends on is missing, off, outside its range or itself skipped; when it
   * conflicts with a mod that loads; or when it is in a dependency cycle. The
   * order is the player's, moved only as far as a dependency needs: of the mods
   * whose dependencies have all been placed, the earliest goes next. */
  function resolveLoad(rows) {
    /* r.cannotLoad: on, but it will not load whatever happens (boot's api check). */
    const on = rows.filter(function (r) { return r.enabled && !r.cannotLoad; });
    const byId = new Map();
    for (const r of rows) byId.set(r.id, r);
    const skip = [];
    const why = new Map();
    const deps = function (r) { return r.manifest && isObj(r.manifest.depends) ? r.manifest.depends : {}; };
    const conflicts = function (r) { return r.manifest && isObj(r.manifest.conflicts) ? r.manifest.conflicts : {}; };
    let live = on.slice();
    for (let changed = true; changed;) {
      changed = false;
      const ids = new Set(live.map(function (r) { return r.id; }));
      for (const r of live) {
        const d = deps(r);
        for (const id of Object.keys(d)) {
          const t = byId.get(id);
          let reason = '';
          if (!t) reason = 'needs ' + id + ' ' + d[id] + ', which is not installed';
          else if (!t.enabled) reason = 'needs ' + id + ', which is switched off';
          else if (!inRange(t.manifest && t.manifest.version, d[id])) {
            reason = 'needs ' + id + ' ' + d[id] + ', and ' + (t.manifest ? t.manifest.version : '?') + ' is installed';
          } else if (!ids.has(id)) reason = 'needs ' + id + ', which did not load';
          if (reason) { why.set(r.id, reason); break; }
        }
        if (why.has(r.id)) { live = live.filter(function (x) { return x !== r; }); changed = true; break; }
      }
    }
    /* Conflicts: the mod that declares the conflict is the one that stays off,
     * and only when the mod it names LOADS (contract review #9: a.a conflicting
     * with c.c, which is itself off for conflicting with d.d, loads). Whether
     * a mod loads is decided from what it names, depth first; a mod met again
     * while it is being decided (a conflict cycle) counts as not loading, so
     * in a cycle the earliest declaring mod in the player's order stays off,
     * as before. */
    const liveIds = new Set(live.map(function (r) { return r.id; }));
    const verdict = new Map(); /* id -> true (loads) | false | 'busy' */
    const loads = function (r) {
      const v = verdict.get(r.id);
      if (v === 'busy') return false;
      if (v !== undefined) return v;
      verdict.set(r.id, 'busy');
      let ok = true;
      const c = conflicts(r);
      for (const id of Object.keys(c)) {
        const t = byId.get(id);
        if (!t || !liveIds.has(id) || !inRange(t.manifest && t.manifest.version, c[id])) continue;
        if (!loads(t)) continue;
        why.set(r.id, 'cannot run with ' + id + ' ' + t.manifest.version + ': switch one of them off');
        ok = false;
        break;
      }
      verdict.set(r.id, ok);
      return ok;
    };
    const loaded = new Set();
    for (const r of live) if (loads(r)) loaded.add(r.id);
    live = live.filter(function (r) { return loaded.has(r.id); });
    /* A conflict can take away a dependency: drop dependents again. */
    for (let changed = true; changed;) {
      changed = false;
      const ids = new Set(live.map(function (r) { return r.id; }));
      for (const r of live) {
        const miss = Object.keys(deps(r)).find(function (id) { return !ids.has(id); });
        if (miss) {
          if (!why.has(r.id)) why.set(r.id, 'needs ' + miss + ', which did not load');
          live = live.filter(function (x) { return x !== r; });
          changed = true;
          break;
        }
      }
    }
    /* Stable topological order; whatever is left is in a cycle. */
    const order = [];
    const placed = new Set();
    let left = live.slice();
    while (left.length) {
      const next = left.find(function (r) { return Object.keys(deps(r)).every(function (id) { return placed.has(id); }); });
      if (!next) break;
      order.push(next);
      placed.add(next.id);
      left = left.filter(function (r) { return r !== next; });
    }
    for (const r of left) why.set(r.id, 'is in a dependency cycle (' + left.map(function (x) { return x.id; }).join(', ') + '): none of them can load');
    for (const r of on) if (why.has(r.id)) skip.push({ id: r.id, error: why.get(r.id) });
    return { order: order, skip: skip };
  }

  /* ── items.json (api 2) ──
   * Only C knows the furniture tables, so the game itself refuses a base with
   * no model, fossils, gyroids, design pieces, clothing and pieces that turn
   * into a pocket item. Here: the shape, and that base is a furniture id facing
   * south. Returns { errs, items: Map(id -> { base, price }) }. */
  function modItemBaseOk(v) {
    return (v & 3) === 0 && ((v >= 0x1000 && v <= 0x1ffc) || (v >= 0x3000 && v <= 0x33c4));
  }
  function validateItems(doc) {
    const errs = [];
    const items = new Map();
    if (!isObj(doc) || !Array.isArray(doc.items) || doc.items.length < 1 || doc.items.length > MOD_ITEMS_MAX) {
      return { errs: ['items: "items" must be a list of 1 to ' + MOD_ITEMS_MAX + ' items'], items: items };
    }
    doc.items.forEach(function (it, idx) {
      const at = 'items: item ' + (idx + 1) + ' ';
      if (!isObj(it)) { errs.push(at + 'is not an object'); return; }
      for (const k of Object.keys(it)) {
        if (MOD_ITEM_KEYS.indexOf(k) < 0) errs.push(at + '"' + k + '" is not an item setting (only ' + MOD_ITEM_KEYS.join(', ') + ')');
      }
      if (typeof it.id !== 'string' || !MOD_ITEM_ID_RE.test(it.id)) {
        errs.push(at + '"id" must be 1 to 32 of a-z, 0-9 and -, starting with a letter or digit');
      } else if (items.has(it.id)) errs.push(at + 'repeats the id ' + JSON.stringify(it.id));
      if (typeof it.name !== 'string' || !MOD_ITEM_NAME_RE.test(it.name)) {
        errs.push(at + '"name" must be 1 to 16 letters, digits, spaces or \' . , ! & -, starting with a letter or digit and not ending with a space');
      }
      let base = -1;
      if (typeof it.base !== 'string' || !ITEM_RE.test(it.base)) {
        errs.push(at + '"base" must be "0x" and 4 hex digits, a furniture id like "0x1234"');
      } else {
        base = parseInt(it.base.slice(2), 16);
        if (!modItemBaseOk(base)) {
          errs.push(at + '"base" must be a furniture id facing south: 0x1000 to 0x1FFC or 0x3000 to 0x33C4, a multiple of 4');
          base = -1;
        }
      }
      if (has(it, 'price') && (typeof it.price !== 'number' || !Number.isInteger(it.price) || it.price < 1 || it.price > ITEM_PRICE_MAX)) {
        errs.push(at + '"price" must be a whole number from 1 to ' + ITEM_PRICE_MAX);
      }
      if (typeof it.id === 'string' && MOD_ITEM_ID_RE.test(it.id) && !items.has(it.id)) items.set(it.id, { base: base });
    });
    return { errs: errs, items: items };
  }

  /* Level 2, the Phase 3 typed targets (-): content.letters, .events
   * and .talk, each a file in the mod. Returns { base: m without them, errs }. */
  function targetsRulesV2(m, names) {
    const errs = [];
    if (!isObj(m.content)) return { base: m, errs: errs };
    const base = Object.assign({}, m, { content: Object.assign({}, m.content) });
    for (const k of TARGET_CONTENT_KEYS_V2) {
      if (!has(m.content, k)) continue;
      delete base.content[k];
      const p = m.content[k];
      const what = '"content.' + k + '"';
      if (typeof p !== 'string' || !p.length || pathProblem(p)) errs.push(what + ' must be a path inside the mod');
      else if (names.indexOf(p) < 0) errs.push(what + ' names ' + p + ', which is not in the mod');
    }
    return { base: base, errs: errs };
  }

  /* The content files' rules, as readMod applies them once mod.json passes
   * (playac-mod check calls this too, so it never keeps a copy of
   * them). read(path) is { value } (the parsed JSON), { error } (a line to
   * report: too big, not JSON) or null (missing, or already reported: skip
   * it). Returns [{ file, message }] in readMod's order: the items file and
   * renames, the shops file, letters, events, talk, then each messages file
   * and the translation keys. A manifest that failed validateManifest is
   * read as far as its content paths are text. */
  function contentProblems(manifest, names, read) {
    const out = [];
    const m = isObj(manifest) ? manifest : {};
    const c = isObj(m.content) ? m.content : {};
    const add = function (file, list) { for (const x of list) out.push({ file: file, message: x }); };
    const doc = function (p) {
      if (typeof p !== 'string' || !p.length) return undefined;
      const r = read(p);
      if (!r) return undefined;
      if (r.error) { add(p, [r.error]); return undefined; }
      return r.value;
    };
    let ctx = null;
    if (c.items) {
      const d = doc(c.items);
      if (d !== undefined) {
        const r = validateItems(d);
        add(c.items, r.errs);
        ctx = { modId: m.id, items: r.items };
        if (isObj(m.renames)) {
          for (const from of Object.keys(m.renames)) {
            const to = String(m.renames[from]);
            if (!r.items.has(to.slice(String(m.id).length + 1))) add('mod.json', ['"renames": ' + JSON.stringify(from) + ' points at ' + to + ', which is not in ' + c.items]);
          }
        }
      }
    }
    if (c.shops) { const d = doc(c.shops); if (d !== undefined) add(c.shops, validateShops(d, ctx).concat(targetsShopsLevel(d, m.api))); }
    /* the typed targets (api 2,-) */
    let letters = null;
    if (c.letters) { const d = doc(c.letters); if (d !== undefined) { add(c.letters, validateLetters(d)); letters = letterIds(d); } else letters = undefined; }
    if (c.events) { const d = doc(c.events); if (d !== undefined) add(c.events, validateEvents(d, m.scope, letters)); }
    if (c.talk) { const d = doc(c.talk); if (d !== undefined) add(c.talk, validateTalk(d)); }
    if (c.messages) {
      /* One file (English), or at level 2 a folder of <lang>.json:
       * each by the messages rules, and a translation holds only keys
       * en.json has, so a typo in a key is caught here, not in the game. */
      const files = messageFiles(m, names);
      const docs = {};
      for (const f of files) {
        const d = doc(f.path);
        if (d === undefined) continue;
        const e = validateMessages(d);
        add(f.path, files.length > 1 ? e.map(function (x) { return x.replace(/^messages:/, 'messages/' + f.lang + ':'); }) : e);
        if (!e.length) docs[f.lang] = d;
      }
      if (files.length > 1 && docs.en) {
        for (const lang of Object.keys(docs)) {
          if (lang === 'en') continue;
          const extra = Object.keys(docs[lang]).filter(function (k) { return !has(docs.en, k); });
          const at = files.filter(function (f) { return f.lang === lang; })[0];
          if (extra.length) add(at ? at.path : c.messages, ['messages/' + lang + ': ' + JSON.stringify(extra[0]) + ' is not in en.json (a translation holds only keys en.json has)']);
        }
      }
    }
    return out;
  }

  /* Level 2: shops.json target "nook". Level 1 never had it. */
  function targetsShopsLevel(doc, api) {
    if (api >= 2 || !isObj(doc) || !Array.isArray(doc.shops)) return [];
    return doc.shops.some(function (s) { return isObj(s) && s.target === 'nook'; })
      ? ['shops: target "nook" needs "api": 2 in mod.json'] : [];
  }

  /* ── shops.json ──
   * Only C knows the item tables, so the game itself refuses items with no shelf
   * model, money bags, turnips, tickets, fossils and reserve ids, and raises a
   * price below the game's own buy-back. Here: the shape. */
  function validateShops(doc, ctx) {
    const errs = [];
    if (!isObj(doc) || !Array.isArray(doc.shops) || doc.shops.length < 1 || doc.shops.length > SHOPS_MAX) {
      return ['shops: "shops" must be a list of 1 to ' + SHOPS_MAX + ' shops'];
    }
    const targets = new Set();
    doc.shops.forEach(function (s, idx) {
      const at = 'shops: shop ' + (idx + 1) + ' ';
      if (!isObj(s)) { errs.push(at + 'is not an object'); return; }
      if (SHOP_TARGETS.indexOf(s.target) < 0) errs.push(at + '"target" must be "flower" or "nook"');
      else if (targets.has(s.target)) errs.push(at + 'is a second shop for "' + s.target + '": one shop per target');
      else targets.add(s.target);
      if (s.target === 'nook') { errs.push.apply(errs, validateNook(s, at, ctx)); return; }
      /* One line: the engine (the game engine shop_text, 0 newlines) drops the whole
       * shop over a line break in the name. */
      if (has(s, 'name') && (typeof s.name !== 'string' || cpLen(s.name) < 1 || cpLen(s.name) > SHOP_NAME_CHARS || s.name.indexOf('\n') >= 0)) {
        errs.push(at + '"name" must be 1 to ' + SHOP_NAME_CHARS + ' characters on one line');
      }
      if (has(s, 'hours')) {
        const h = s.hours;
        if (!isObj(h) || typeof h.open !== 'string' || typeof h.close !== 'string' ||
            !HHMM_RE.test(h.open) || !HHMM_RE.test(h.close)) {
          errs.push(at + '"hours" must be { "open": "HH:MM", "close": "HH:MM" }');
        } else if (h.open === h.close) errs.push(at + '"hours" open and close must differ');
      }
      for (const k of ['greeting', 'stock_line']) {
        if (!has(s, k)) continue;
        const v = s[k];
        if (typeof v !== 'string' || cpLen(v) < 1 || cpLen(v) > SHOP_LINE_CHARS || v.split('\n').length - 1 > SHOP_LINE_NEWLINES) {
          errs.push(at + '"' + k + '" must be 1 to ' + SHOP_LINE_CHARS + ' characters with at most ' + SHOP_LINE_NEWLINES + ' line breaks');
        }
      }
      if (!Array.isArray(s.stock) || s.stock.length < 1 || s.stock.length > SHOP_STOCK_MAX) {
        errs.push(at + '"stock" must list 1 to ' + SHOP_STOCK_MAX + ' items');
      } else errs.push.apply(errs, stockErrs(s.stock, at, ctx));
    });
    return errs;
  }

  /* One shop's stock list (the flower shop's and Nook's): "0x" ids, or
   * at api 2 an item of this mod by its full id. */
  function stockErrs(stock, at, ctx) {
    const errs = [];
    const seen = new Set();
    const bases = new Set();
    stock.forEach(function (it, k) {
          const sat = at + 'stock ' + (k + 1) + ' ';
          /* api 2: a good may be an item of this mod, by its full id */
          const own = isObj(it) && typeof it.item === 'string' && ctx && ctx.items ? MOD_ITEM_FULL_RE.exec(it.item) : null;
          if (own) {
            if (own[1] !== ctx.modId || !ctx.items.has(own[2])) {
              errs.push(sat + '"item" ' + it.item + ' is not an item in this mod\'s items file');
              return;
            }
          } else if (!isObj(it) || typeof it.item !== 'string' || !ITEM_RE.test(it.item)) {
            errs.push(sat + '"item" must be "0x" and 4 hex digits, like "0x2800"' + (ctx && ctx.items ? ', or an item of this mod like ' + ctx.modId + ':thing' : ''));
            return;
          }
          /* A mod item stands on the bench as its base, so two goods may not
           * share a furniture id. */
          const key = own ? it.item : parseInt(it.item.slice(2), 16);
          const base = own ? ctx.items.get(own[2]).base : key;
          if (seen.has(key)) errs.push(sat + 'is a duplicate item ' + it.item);
          else if (base >= 0 && bases.has(base)) errs.push(sat + 'shares its furniture ' + hex4(base) + ' with another good of this shop');
          seen.add(key);
          if (base >= 0) bases.add(base);
          if (has(it, 'price') && (typeof it.price !== 'number' || !Number.isInteger(it.price) || it.price < 1 || it.price > SHOP_PRICE_MAX)) {
            errs.push(sat + '"price" must be a whole number from 1 to ' + SHOP_PRICE_MAX);
          }
    });
    return errs;
  }

  function hex4(v) { return '0x' + v.toString(16).padStart(4, '0'); }

  /* ── messages ── */

  function validateMessages(doc) {
    if (!isObj(doc)) return ['messages: the file is not a JSON object of key to text'];
    const errs = [];
    const keys = Object.keys(doc);
    if (keys.length > MESSAGES_MAX) errs.push('messages: at most ' + MESSAGES_MAX + ' lines per mod');
    for (const k of keys) {
      if (!MSG_KEY_RE.test(k)) { errs.push('messages: key ' + JSON.stringify(k) + ' must be 1 to 48 of a-z 0-9 _ . -'); continue; }
      const v = doc[k];
      const bytes = typeof v === 'string' ? new TextEncoder().encode(v).length : 0;
      if (typeof v !== 'string' || bytes < 1 || bytes > MESSAGE_BYTES_MAX) {
        errs.push('messages: ' + JSON.stringify(k) + ' must be text of 1 to ' + MESSAGE_BYTES_MAX + ' bytes');
      }
    }
    return errs;
  }

  /* ── Phase 3 typed targets (-) ──
   * The shapes. Only C knows which goods Nook's shelves can show, what an item
   * is (money, turnips and the rest are refused there), and how wide a line of
   * a letter or a board page is in the game's font: it refuses a body or notice
   * that does not fit six lines of the paper. */

  /* Nook's stock: target "nook" in shops.json takes only mode and stock. */
  function validateNook(s, at, ctx) {
    const errs = [];
    for (const k of NOOK_FLOWER_ONLY) {
      if (has(s, k)) errs.push(at + '"' + k + '" is the flower shop\'s: Nook\'s shop takes only "mode" and "stock"');
    }
    if (has(s, 'mode') && s.mode !== 'add' && s.mode !== 'replace') errs.push(at + '"mode" must be "add" or "replace"');
    if (!Array.isArray(s.stock) || s.stock.length < 1 || s.stock.length > NOOK_STOCK_MAX) {
      errs.push(at + '"stock" must list 1 to ' + NOOK_STOCK_MAX + ' items');
      return errs;
    }
    /* the flower shop's stock rules, mod items by full id included */
    return errs.concat(stockErrs(s.stock, at, ctx));
  }

  /* Plain text for the letter paper and the board: printable ASCII (the game's
   * font has no other letters), "\n" only where lines may break, no { or }
   * except one {player} where allowed. Returns the length without {player}, or -1. */
  function plainLen(v, newlines, player) {
    if (typeof v !== 'string') return -1;
    let s = v;
    if (player) {
      const i = s.indexOf('{player}');
      if (i >= 0) s = s.slice(0, i) + s.slice(i + 8);
    }
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c === 10 && newlines) continue;
      if (c < 0x20 || c > 0x7e || c === 0x7b || c === 0x7d) return -1;
    }
    return s.length;
  }

  /* which character the paper refuses, and where (1-based, in
   * characters), so a writer is not left hunting a curly quote or an accent in
   * 192 characters. '' when every character is plain. Go paperCharNote says
   * the same words. */
  function paperCharNote(v) {
    if (typeof v !== 'string') return '';
    const cs = Array.from(v);
    for (let i = 0; i < cs.length; i++) {
      const c = cs[i].codePointAt(0);
      if (c === 10) continue;
      if (c >= 0x20 && c <= 0x7e && c !== 0x7b && c !== 0x7d) continue;
      const what = c < 0x20 || c === 0x7f ? 'a control character (U+' + c.toString(16).toUpperCase().padStart(4, '0') + ')' : '"' + cs[i] + '"';
      return ': ' + what + ' at character ' + (i + 1) + ' is not on the letter paper, which takes plain US keyboard characters only (no accents, curly quotes, { or })';
    }
    return '';
  }

  function paperOk(v) {
    return plainLen(v, true, false) >= 1 && v.length <= PAPER_BYTES && v.split('\n').length <= PAPER_LINES;
  }

  function idErrs(list, what) {
    const errs = [];
    const seen = new Set();
    list.forEach(function (e, k) {
      if (!isObj(e)) return;
      if (typeof e.id !== 'string' || !MSG_KEY_RE.test(e.id)) {
        errs.push(what + ' ' + (k + 1) + ' "id" must be 1 to 48 of a-z 0-9 _ . -');
      } else if (seen.has(e.id)) errs.push(what + ' ' + (k + 1) + ' "id" ' + JSON.stringify(e.id) + ' is used twice');
      else seen.add(e.id);
    });
    return errs;
  }

  /* letters.json */
  function validateLetters(doc) {
    if (!isObj(doc) || !Array.isArray(doc.letters) || doc.letters.length < 1 || doc.letters.length > LETTERS_MAX) {
      return ['letters: "letters" must be a list of 1 to ' + LETTERS_MAX + ' letters'];
    }
    let errs = idErrs(doc.letters, 'letters: letter');
    doc.letters.forEach(function (L, k) {
      const at = 'letters: letter ' + (k + 1) + ' ';
      if (!isObj(L)) { errs.push(at + 'is not an object'); return; }
      const h = plainLen(L.header, false, true);
      if (h < 1 || h > LETTER_HEADER_MAX || (typeof L.header === 'string' && L.header.split('{player}').length > 2)) {
        errs.push(at + '"header" must be 1 to ' + LETTER_HEADER_MAX + ' plain characters besides one {player}');
      }
      if (!paperOk(L.body)) errs.push(at + '"body" must be 1 to ' + PAPER_BYTES + ' plain characters on at most ' + PAPER_LINES + ' lines' + paperCharNote(L.body));
      const f = plainLen(L.footer, false, false);
      if (f < 1 || f > LETTER_FOOTER_MAX) errs.push(at + '"footer" must be 1 to ' + LETTER_FOOTER_MAX + ' plain characters');
      /* the mailbox list's 8-character sender slot */
      if (has(L, 'sender')) {
        const sl = plainLen(L.sender, false, false);
        if (sl < 1 || sl > LETTER_SENDER_MAX) errs.push(at + '"sender" must be 1 to ' + LETTER_SENDER_MAX + ' plain characters');
      }
      if (has(L, 'item') && (typeof L.item !== 'string' || !ITEM_RE.test(L.item))) {
        errs.push(at + '"item" must be "0x" and 4 hex digits, like "0x2800"');
      }
      if (has(L, 'paper') && (typeof L.paper !== 'number' || !Number.isInteger(L.paper) || L.paper < 0 || L.paper >= PAPERS)) {
        errs.push(at + '"paper" must be a whole number from 0 to ' + (PAPERS - 1));
      }
    });
    return errs;
  }

  function talkLineOk(v) {
    return typeof v === 'string' && cpLen(v) >= 1 && cpLen(v) <= TALK_LINE_CHARS && v.split('\n').length - 1 <= TALK_LINE_NEWLINES;
  }

  /* The ids of a letters.json doc, for an event's "letter"; an empty
   * set when the doc has no list (validateLetters says why). */
  function letterIds(doc) {
    const ids = new Set();
    if (isObj(doc) && Array.isArray(doc.letters)) doc.letters.forEach(function (L) { if (isObj(L) && typeof L.id === 'string') ids.add(L.id); });
    return ids;
  }

  /* events.json. scope: the manifest's; a board notice changes the town.
   * letters: the ids in the mod's letters file (letterIds), null when it
   * has none, undefined when not known (a lone sample): an event's "letter"
   * must name one of them. */
  function validateEvents(doc, scope, letters) {
    if (!isObj(doc) || !Array.isArray(doc.events) || doc.events.length < 1 || doc.events.length > EVENTS_MAX) {
      return ['events: "events" must be a list of 1 to ' + EVENTS_MAX + ' events'];
    }
    const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let errs = idErrs(doc.events, 'events: event');
    doc.events.forEach(function (e, k) {
      const at = 'events: event ' + (k + 1) + ' ';
      if (!isObj(e)) { errs.push(at + 'is not an object'); return; }
      const d = e.date;
      let dateOk = isObj(d) && wholeIn(d.month, 1, 12);
      if (dateOk && has(d, 'day')) dateOk = !has(d, 'week') && !has(d, 'weekday') && wholeIn(d.day, 1, DAYS[d.month - 1]);
      else if (dateOk) dateOk = (d.week === 'last' || wholeIn(d.week, 1, 4)) && wholeIn(d.weekday, 0, 6);
      if (!dateOk) errs.push(at + '"date" must be { "month", "day" } or { "month", "week" (1 to 4 or "last"), "weekday" (0 Sunday to 6) }');
      if (!has(e, 'board') && !has(e, 'talk') && !has(e, 'letter')) errs.push(at + 'needs a "board" notice, "talk" lines or a "letter"');
      if (has(e, 'letter')) {
        if (typeof e.letter !== 'string' || !MSG_KEY_RE.test(e.letter)) errs.push(at + '"letter" must be the id of a letter in this mod\'s letters file');
        else if (letters !== undefined && !(letters && letters.has(e.letter))) errs.push(at + '"letter" ' + JSON.stringify(e.letter) + ' names no letter in this mod\'s letters file');
      }
      if (has(e, 'board')) {
        if (!paperOk(e.board)) errs.push(at + '"board" must be 1 to ' + PAPER_BYTES + ' plain characters on at most ' + PAPER_LINES + ' lines' + paperCharNote(e.board));
        if (scope !== 'world') errs.push(at + '"board" changes the town, so "scope" must be "world"');
      }
      if (has(e, 'talk') && (!Array.isArray(e.talk) || e.talk.length < 1 || e.talk.length > EVENT_TALK_MAX || !e.talk.every(talkLineOk))) {
        errs.push(at + '"talk" must list 1 to ' + EVENT_TALK_MAX + ' lines of 1 to ' + TALK_LINE_CHARS + ' characters with at most ' + TALK_LINE_NEWLINES + ' line breaks');
      }
    });
    return errs;
  }

  /* talk.json */
  function validateTalk(doc) {
    if (!isObj(doc) || !Array.isArray(doc.pools) || doc.pools.length < 1 || doc.pools.length > POOLS_MAX) {
      return ['talk: "pools" must be a list of 1 to ' + POOLS_MAX + ' pools'];
    }
    const errs = [];
    doc.pools.forEach(function (p, k) {
      const at = 'talk: pool ' + (k + 1) + ' ';
      if (!isObj(p)) { errs.push(at + 'is not an object'); return; }
      if (has(p, 'personality') && has(p, 'villager')) errs.push(at + 'names a "personality" or a "villager", not both');
      if (has(p, 'personality') && PERSONALITIES.indexOf(p.personality) < 0) {
        errs.push(at + '"personality" must be one of ' + PERSONALITIES.join(', '));
      }
      if (has(p, 'villager')) {
        const n = plainLen(p.villager, false, false);
        if (n < 1 || n > VILLAGER_CHARS) errs.push(at + '"villager" must be a name of 1 to ' + VILLAGER_CHARS + ' plain characters');
      }
      if (has(p, 'chance') && !wholeIn(p.chance, 1, 100)) errs.push(at + '"chance" must be a whole number from 1 to 100');
      if (!Array.isArray(p.lines) || p.lines.length < 1 || p.lines.length > POOL_LINES_MAX || !p.lines.every(talkLineOk)) {
        errs.push(at + '"lines" must list 1 to ' + POOL_LINES_MAX + ' lines of 1 to ' + TALK_LINE_CHARS + ' characters with at most ' + TALK_LINE_NEWLINES + ' line breaks');
      }
    });
    return errs;
  }

  /* ── hashes ── */

  function hex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function sha256Hex(bytes) {
    return hex(await root.crypto.subtle.digest('SHA-256', bytes));
  }

  /* A mod's content hash: sha256 of "<file sha256> <path>\n" lines, sorted by
   * path, over the files after normalising. The author's ZIP and the registry's
   * rebuilt ZIP hash the same; ZIP metadata and compression never count. */
  async function contentSha(entries) {
    const names = Object.keys(entries).sort();
    let text = '';
    for (const n of names) text += (await sha256Hex(entries[n])) + ' ' + n + '\n';
    return sha256Hex(new TextEncoder().encode(text));
  }

  /* The world mod set, as the backend compares it for a visit:
   * "id@version#contentsha" lines of the enabled WORLD mods in LOAD ORDER (order
   * changes which mod wins, so it changes the world), hashed. "" when there are
   * none. "" only matches "": a player without world mods cannot visit a player
   * with some. mods: [{ id, enabled, contentSha, manifest: { version, scope } }],
   * already in load order and already cut to what loads. */
  async function modsetHash(mods) {
    const lines = [];
    /* a world mod with settings adds "+<settingsSha>": two players on
     * one mod with different settings run different worlds. A mod without
     * settings keeps the plain line, so its hash does not move. */
    for (const m of mods) {
      if (!m.enabled || !countsForVisits(m.manifest)) continue;
      const ss = await settingsSha(m.manifest, m.settings);
      lines.push(m.id + '@' + m.manifest.version + '#' + m.contentSha + (ss ? '+' + ss : ''));
    }
    if (!lines.length) return '';
    return sha256Hex(new TextEncoder().encode(lines.join('\n')));
  }

  /* ── visit scope: which mods a visitor must render ──
   *
   * Contract "Visit scope". A world mod counts in the modset unless all it can
   * do is make vanilla state or show its own player something: no textures, no
   * shops, no items, and every declared permission (Phase 2 commands) one whose result is
   * vanilla save state, the mod's own store, or a line only its player reads.
   * Anything this game does not know (an unknown command, a permissions value
   * that is not a list of strings) counts, so a new kind of effect blocks
   * visits until it is judged here. Client mods never count. `ask` is a
   * question only its own player sees, its answer back to the mod: vanilla output. */
  const VANILLA_OUTPUT_COMMANDS = ['send_letter', 'give_item', 'set_flag', 'show_line', 'ask'];

  function countsForVisits(m) {
    if (!isObj(m) || m.scope !== 'world') return false;
    const c = isObj(m.content) ? m.content : {};
    /* a world mod's new items too, so a visitor lent the host's set
     * sees them as the host does (without it they read as vanilla bases). */
    if (has(c, 'textures') || has(c, 'shops') || has(c, 'items')) return true;
    /* Contract review #6: "permissions" (the Phase 2 commands) is a level-2
     * key; at level 1 it is an unknown key the game ignores, so it decides
     * nothing here either. */
    if (!(typeof m.api === 'number' && m.api >= 2) || !has(m, 'permissions')) return false;
    const p = m.permissions;
    if (!Array.isArray(p)) return true;
    return p.some(function (x) { return typeof x !== 'string' || VANILLA_OUTPUT_COMMANDS.indexOf(x) < 0; });
  }

  /* The named list beside the modset hash: one entry per mod that
   * counts, in load order, so a refused visit can say what differs. registry:
   * the row came from the registry (the backend decides for itself; this is
   * only the client's claim). mods: as modsetHash takes them, plus source.
   *
   * A mod that declares settings also carries settings_sha (the "+<sha>" of
   * its modset line, so the backend rebuilds the same lines and the hash the
   * list came with) and settings, its EFFECTIVE values: what a visitor lent the
   * host's set runs, so the visit plays with the host's settings (third
   * review). A mod without settings carries neither, as before. */
  async function modsetList(mods) {
    const out = [];
    for (const m of mods) {
      if (!m.enabled || !countsForVisits(m.manifest)) continue;
      const e = {
        id: m.id, version: m.manifest.version, name: typeof m.manifest.name === 'string' ? m.manifest.name.trim() : m.id,
        content_sha: m.contentSha, registry: typeof m.source === 'string' && m.source.indexOf('registry:') === 0
      };
      const ss = await settingsSha(m.manifest, m.settings);
      if (ss) {
        e.settings_sha = ss;
        e.settings = effectiveSettings(m.manifest, m.settings);
      }
      out.push(e);
    }
    return out;
  }

  /* ── ZIP ── */

  function unzip(bytes, fflate) {
    if (!fflate || !fflate.unzipSync) throw ruleError('ZIP support is unavailable (fflate.umd.min.js failed to load). Please reload the page');
    let total = 0;
    let count = 0;
    const seen = new Set();
    try {
      return fflate.unzipSync(bytes, {
        /* Runs per entry BEFORE it is inflated: junk is never inflated, and the
         * declared sizes stop a ZIP bomb before any memory is spent on it. fflate
         * inflates into a buffer of the declared size, so a lying size truncates
         * the file instead of growing past it. */
        filter: function (f) {
          if (f.name.endsWith('/') || isJunk(f.name)) return false;
          if (seen.has(f.name)) throw ruleError(JSON.stringify(f.name) + ' is in the ZIP twice');
          seen.add(f.name);
          count++;
          total += f.originalSize || 0;
          if (count > MAX_FILES) throw ruleError('more than ' + MAX_FILES + ' files');
          if (total > MAX_UNPACKED) throw ruleError('it unpacks to more than ' + (MAX_UNPACKED / MIB) + ' MB');
          return true;
        }
      });
    } catch (e) {
      if (e && e.modRule) throw e;
      throw ruleError('this is not a ZIP the game can open (' + ((e && e.message) || e) + ')');
    }
  }

  /* ── CRC ──
   * fflate inflates into a buffer of the size the ZIP DECLARES, which keeps a
   * bomb from spending memory, but a lying size then truncates the file without
   * a word, and fflate never checks the CRC. The registry (Go archive/zip) does,
   * so a damaged ZIP is refused here too instead of installing cut-off files. */
  let crcTable = null;
  function crc32(bytes) {
    if (!crcTable) {
      crcTable = new Int32Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        crcTable[n] = c;
      }
    }
    let c = -1;
    for (let k = 0; k < bytes.length; k++) c = crcTable[(c ^ bytes[k]) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  }

  /* name -> CRC from the central directory; null when it cannot be read plainly
   * (ZIP64 markers), in which case the size bound alone applies. */
  function centralCrcs(bytes, fflate) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let eocd = -1;
    for (let k = bytes.length - 22; k >= 0 && k >= bytes.length - 22 - 65535; k--) {
      if (dv.getUint32(k, true) === 0x06054b50) { eocd = k; break; }
    }
    if (eocd < 0) return null;
    const count = dv.getUint16(eocd + 10, true);
    let at = dv.getUint32(eocd + 16, true);
    if (count === 0xffff || at === 0xffffffff) return null;
    const out = new Map();
    for (let k = 0; k < count; k++) {
      if (at + 46 > bytes.length || dv.getUint32(at, true) !== 0x02014b50) return null;
      const flags = dv.getUint16(at + 8, true);
      const crc = dv.getUint32(at + 16, true);
      const nl = dv.getUint16(at + 28, true);
      const el = dv.getUint16(at + 30, true);
      const cl = dv.getUint16(at + 32, true);
      if (at + 46 + nl > bytes.length) return null;
      const name = fflate.strFromU8(bytes.subarray(at + 46, at + 46 + nl), !(flags & 2048));
      out.set(name, crc);
      at += 46 + nl + el + cl;
    }
    return out;
  }

  function checkCrcs(bytes, raw, fflate) {
    if (!fflate.strFromU8) return;
    const crcs = centralCrcs(bytes, fflate);
    if (!crcs) return;
    for (const name of Object.keys(raw)) {
      if (crcs.has(name) && crc32(raw[name]) !== crcs.get(name)) {
        throw ruleError('this is not a ZIP the game can open (' + JSON.stringify(name) + ' is damaged or its size is wrong)');
      }
    }
  }

  function fail(problems) { throw ruleError(problems.slice(0, 4).join('; ')); }

  /* Read a mod from ZIP bytes: { manifest, entries, names, unpacked }, or throws
   * with the reasons. Every rule of the contract runs here, so a mod that would
   * break at boot is refused at install instead. opts.trusted (boot: the bytes
   * were checked at install) skips the CRC pass. */
  function readMod(bytes, fflate, opts) {
    if (bytes.length > MAX_ZIP) fail(['the ZIP is over ' + (MAX_ZIP / MIB) + ' MB']);
    const raw = unzip(bytes, fflate);
    if (!(opts && opts.trusted)) checkCrcs(bytes, raw, fflate);
    return readEntries(raw);
  }

  /* The same rules over files that never were a ZIP: { path: Uint8Array } (a
   * developer-mode folder). */
  function readEntries(raw) {
    const n = normalizeEntries(raw);
    if (n.problems.length) fail(n.problems);
    const json = {};
    const problems = [];
    for (const name of n.names) {
      if (lowerExt(name) !== '.json') continue;
      const r = parseFile(name, n.entries[name]);
      if (r.error) problems.push(r.error); else json[name] = r.value;
    }
    if (problems.length) fail(problems);
    const manifest = json['mod.json'];
    let errs = validateManifest(manifest, n.names);
    if (!errs.length) {
      /* The shops and messages files are read as JSON whatever they are called,
       * so they get the .json cap too (Go Inspect does the same). */
      const read = function (p) {
        if (has(json, p)) return { value: json[p] };
        if (n.entries[p].length > MAX_JSON) return { error: JSON.stringify(p) + ' is over ' + (MAX_JSON / KIB) + ' KB' };
        return parseFile(p, n.entries[p]);
      };
      errs = contentProblems(manifest, n.names, read).map(function (x) { return x.message; });
    }
    if (errs.length) fail(errs);
    let unpacked = 0;
    for (const name of n.names) unpacked += n.entries[name].length;
    return { manifest: manifest, entries: n.entries, names: n.names, unpacked: unpacked };
  }

  /* ── memory and storage ── */

  /* A phone or a low-memory device, the way the shell decides it: shell.html
   * sets window.acwebIsMobile (coarse pointer, mobile UA, iPad posing as a Mac,
   * low-power touch device) before mods.js runs anything. The fallback repeats
   * its main tells for a page without it. deviceMemory (GiB, Chrome only) of 2
   * or less counts on any device. Read at call time, never cached. */
  function lowMemoryDevice() {
    let nav = null;
    try { nav = root.navigator || null; } catch (_) { nav = null; }
    const dm = nav && nav.deviceMemory;
    if (typeof dm === 'number' && dm > 0 && dm <= 2) return true;
    if (typeof root.acwebIsMobile === 'boolean') return root.acwebIsMobile;
    if (!nav) return false;
    try {
      const ua = nav.userAgent || '';
      const touch = nav.maxTouchPoints || 0;
      if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
      if (/Macintosh|Mac OS X/.test(ua) && touch > 1) return true;
      return touch > 0 && (typeof dm === 'number' ? dm : 99) <= 4;
    } catch (_) { return false; }
  }

  /* The most enabled mods may unpack to, across all of them, on this device. */
  function enabledCap() { return lowMemoryDevice() ? PHONE_MAX_ENABLED_UNPACKED : MAX_ENABLED_UNPACKED; }

  function mbWords(bytes) {
    const mb = (bytes || 0) / MIB;
    return (mb < 10 && Math.round(mb) !== mb ? mb.toFixed(1) : String(Math.round(mb))) + ' MB';
  }

  function capWords(cap) {
    return mbWords(cap) + ' the game keeps for mods' + (cap < MAX_ENABLED_UNPACKED ? ' on a phone' : '');
  }

  /* Why a mod of this size is skipped after the ones before it. */
  function fillWords(cap, size) {
    if (size > cap) return 'it unpacks to ' + mbWords(size) + ', more than the ' + capWords(cap);
    return 'the mods before it already fill the ' + capWords(cap);
  }

  /* Ask the browser to keep this site's storage, once, on the first
   * install: Safari clears the storage of a site not visited for 7 days unless
   * it is persisted, and the mods live in IndexedDB. A refusal is fine and
   * nothing waits for the answer. */
  const PERSIST_KEY = 'acweb.mods.persist';
  function askPersist() {
    try {
      if (root.localStorage.getItem(PERSIST_KEY) === '1') return;
      root.localStorage.setItem(PERSIST_KEY, '1');
    } catch (_) { /* no storage: ask anyway, it is harmless */ }
    try {
      const st = root.navigator && root.navigator.storage;
      if (st && typeof st.persist === 'function') Promise.resolve(st.persist()).catch(function () {});
    } catch (_) { /* not offered */ }
  }

  /* Why this browser has no room for a mod, or ''. Asks
   * navigator.storage.estimate() for at most 3 s; no answer, no API or a
   * nonsense answer means '' (never block an install on a missing estimate).
   * Asks for the ZIP (what is stored) plus its unpacked size plus a margin:
   * generous on purpose, a write near the quota can fail half-way. */
  async function storageProblem(size, unpacked) {
    let est = null;
    let timer = null;
    try {
      const st = root.navigator && root.navigator.storage;
      if (!st || typeof st.estimate !== 'function') return '';
      est = await Promise.race([
        Promise.resolve(st.estimate()),
        new Promise(function (resolve) { timer = setTimeout(function () { resolve(null); }, 3000); })
      ]);
    } catch (_) { return ''; } finally { if (timer !== null) clearTimeout(timer); }
    if (!est || typeof est.quota !== 'number' || typeof est.usage !== 'number' || !(est.quota > 0)) return '';
    const free = Math.max(0, est.quota - est.usage);
    const need = size + unpacked + QUOTA_MARGIN;
    if (free >= need) return '';
    return 'There is not enough room in this browser\'s storage for this mod: it needs about ' + mbWords(need) +
      ' and about ' + mbWords(free) + ' is free. Remove a mod you do not use or free some space on this device, then try again';
  }

  /* "The browser cleared your mods". acweb.mods.n is how many mods were
   * stored after the last change. At boot, the flag still set and a count above
   * 0 with an empty or missing database means the browser deleted the database
   * but kept localStorage. It is recorded once in acweb.mods.cleared, which the
   * Mods tab reads and clears (takeClearedNotice). A browser that clears
   * localStorage too leaves nothing to tell, so no notice then. */
  const COUNT_KEY = 'acweb.mods.n';
  const CLEARED_KEY = 'acweb.mods.cleared';
  function rememberCount(n) {
    try { root.localStorage.setItem(COUNT_KEY, String(n)); } catch (_) { /* the notice is best effort */ }
  }
  function noteIfCleared() {
    try {
      const had = Number(root.localStorage.getItem(COUNT_KEY)) > 0;
      root.localStorage.removeItem(COUNT_KEY);
      if (!had) return false;
      root.localStorage.setItem(CLEARED_KEY, String(Date.now()));
      return true;
    } catch (_) { return false; }
  }
  /* True once after the browser cleared the mods; the next call is false. */
  function takeClearedNotice() {
    try {
      if (root.localStorage.getItem(CLEARED_KEY) === null) return false;
      root.localStorage.removeItem(CLEARED_KEY);
      return true;
    } catch (_) { return false; }
  }

  /* ── load plan ── */

  /* Which enabled rows load, in order: the first 32, while the running total of
   * unpacked bytes stays within the cap (96 MB, 24 MB on a phone: enabledCap).
   * rows: sorted by order. A row without a known size counts as 0 here; boot
   * checks the real size when it unpacks. */
  function planLoad(rows, cap) {
    if (cap === undefined) cap = enabledCap();
    const load = [];
    const skip = [];
    let total = 0;
    for (const r of rows) {
      if (!r.enabled) continue;
      if (load.length >= MAX_ENABLED) {
        skip.push({ id: r.id, error: 'only the first ' + MAX_ENABLED + ' mods load' });
        continue;
      }
      const size = r.unpacked || 0;
      if (total + size > cap) {
        skip.push({ id: r.id, error: fillWords(cap, size) });
        continue;
      }
      total += size;
      load.push(r);
    }
    return { load: load, skip: skip, total: total };
  }

  /* What loads and in what order: dependencies first (resolveLoad),
   * then the 32-mod and size caps over that order (planLoad), then once more
   * for a mod whose dependency the caps left out. { load, skip }. */
  function loadPlan(rows, cap) {
    const deps = resolveLoad(rows);
    const plan = planLoad(deps.order, cap);
    let skip = deps.skip.concat(plan.skip);
    if (plan.skip.length) {
      const capped = new Set(plan.skip.map(function (x) { return x.id; }));
      const again = resolveLoad(plan.load.concat(rows.filter(function (r) { return capped.has(r.id); })
        .map(function (r) { return { id: r.id, enabled: true, cannotLoad: true, manifest: r.manifest }; })));
      if (again.skip.length) {
        skip = skip.concat(again.skip);
        const out = new Set(again.skip.map(function (x) { return x.id; }));
        plan.load = plan.load.filter(function (r) { return !out.has(r.id); });
      }
    }
    return { load: plan.load, skip: skip, total: plan.total };
  }

  /* Why switching this row on would break the limits, or ''. */
  function enableProblem(rows, row) {
    const others = rows.filter(function (r) { return r.enabled && r.id !== row.id; });
    if (others.length >= MAX_ENABLED) {
      return 'You already have ' + MAX_ENABLED + ' mods on, the most the game loads. Turn one off first';
    }
    const cap = enabledCap();
    if ((row.unpacked || 0) > cap) {
      return 'This mod unpacks to ' + mbWords(row.unpacked) + ', more than the ' + capWords(cap) +
        ', so it cannot be switched on here';
    }
    const total = others.reduce(function (s, r) { return s + (r.unpacked || 0); }, 0);
    if (total + (row.unpacked || 0) > cap) {
      return 'Your mods would unpack to more than ' + mbWords(cap) + ', more than the ' + capWords(cap) +
        '. Turn one off first';
    }
    return '';
  }

  /* ── IndexedDB ── */

  function idb() { return root.indexedDB; }

  /* Version 2 ( third review): the ZIP bytes live in their own store,
   * 'zips' ({ id, zip }), beside the rows in 'mods' (everything else). A
   * cursor over 'mods' then never loads a ZIP, so listing, a toggle, a move,
   * the status check and boot read only the small rows; readRow joins the two
   * in one transaction. The upgrade from version 1 moves every row's ZIP out
   * in the upgrade transaction itself, one row at a time: it commits whole or
   * not at all, so a closed tab mid-upgrade leaves version 1 as it was. */
  const DB_VERSION = 2;

  function upgradeDb(db, t) {
    if (!db.objectStoreNames.contains('mods')) db.createObjectStore('mods', { keyPath: 'id' });
    if (db.objectStoreNames.contains('zips')) return;
    db.createObjectStore('zips', { keyPath: 'id' });
    if (!t) return;
    const mods = t.objectStore('mods');
    const zips = t.objectStore('zips');
    const c = mods.openCursor();
    c.onsuccess = function () {
      const cur = c.result;
      if (!cur) return;
      const v = cur.value;
      if (v && v.zip) {
        zips.put({ id: v.id, zip: v.zip });
        mods.put(metaOf(v));
      }
      cur.continue();
    };
  }

  function openDb(name) {
    return new Promise(function (resolve, reject) {
      let req;
      try { req = idb().open(name || DB_NAME, DB_VERSION); } catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        try { upgradeDb(req.result, req.transaction); } catch (e) {
          try { if (req.transaction) req.transaction.abort(); } catch (_) { /* reported by onerror */ }
        }
      };
      req.onsuccess = function () {
        const db = req.result;
        /* A newer page (another tab) upgrading: give way instead of blocking it. */
        try { db.onversionchange = function () { try { db.close(); } catch (_) { /* closed */ } }; } catch (_) { /* no events */ }
        resolve(db);
      };
      req.onerror = function () { reject(req.error || new Error('the mods database could not be opened')); };
      req.onblocked = function () { reject(new Error('the mods database is held open by another tab')); };
    });
  }

  /* A row without its ZIP bytes. */
  function metaOf(v) {
    const m = {};
    for (const k of Object.keys(v)) if (k !== 'zip') m[k] = v[k];
    return m;
  }

  /* The store as withRows' body sees it. put(row) writes the row to 'mods'
   * and, only when it carries one, its ZIP to 'zips': a row withRows handed
   * out (no zip) keeps its stored ZIP untouched, so no caller ever needs a
   * ZIP in memory to change one flag. delete removes both. */
  function rowWriter(mods, zips) {
    return {
      put: function (row) {
        if (row.zip) zips.put({ id: row.id, zip: row.zip });
        mods.put(metaOf(row));
      },
      delete: function (k) { mods.delete(k); zips.delete(k); }
    };
  }

  /* One transaction: read every row from 'mods' (never a ZIP: those are in
   * 'zips' since version 2), then body(rows, store, ctl) runs in the same
   * transaction, so a read-modify-write from two tabs cannot interleave
   * (IndexedDB runs overlapping readwrite transactions one after the other).
   * store is rowWriter's. body must be synchronous: an await would let the
   * transaction commit early. ctl.result is what the promise resolves to;
   * ctl.fail(err) rolls back. */
  function withRows(db, mode, body) {
    return new Promise(function (resolve, reject) {
      let t;
      try { t = db.transaction(['mods', 'zips'], mode); } catch (e) { reject(e); return; }
      const ctl = {
        result: undefined, error: null,
        fail: function (e) { ctl.error = e; try { t.abort(); } catch (_) { /* already done */ } }
      };
      t.oncomplete = function () { if (ctl.error) reject(ctl.error); else resolve(ctl.result); };
      t.onabort = function () { reject(ctl.error || t.error || new Error('the mods database refused the change')); };
      t.onerror = function () { /* onabort follows */ };
      const store = t.objectStore('mods');
      const zips = t.objectStore('zips');
      const rows = [];
      const req = store.openCursor();
      req.onsuccess = function () {
        const c = req.result;
        if (c) { rows.push(metaOf(c.value)); c.continue(); return; }
        rows.sort(function (a, b) { return a.order - b.order; });
        try { body(rows, rowWriter(store, zips), ctl); } catch (e) { ctl.fail(e); }
      };
    });
  }

  function flagOn() { try { return root.localStorage.getItem(FLAG) === '1'; } catch (_) { return false; } }

  /* The flag is what makes boot open the database at all, so a change that
   * cannot set it must say so instead of seeming to work. */
  function ensureFlag() {
    let ok = false;
    try {
      root.localStorage.setItem(FLAG, '1');
      ok = root.localStorage.getItem(FLAG) === '1';
    } catch (_) { ok = false; }
    if (!ok) {
      throw new Error('This browser would not save the setting that turns mods on (site storage is full or blocked), ' +
        'so your mods would not load. Free some space or allow site data for this site, then try again');
    }
  }

  function clearFlag() { try { root.localStorage.removeItem(FLAG); } catch (_) { /* nothing to undo */ } }

  function rememberModset(h, list) {
    /* while a developer-mode mod is stored, the next boot runs it, and
     * a visit must never match that set: the stored set is a marker instead. */
    if (devTainted()) { h = devMarker(); list = []; }
    try { root.localStorage.setItem(MODSET_KEY, h); } catch (e) { console.warn('[Mods] could not store the mod set for visits:', e); }
    try {
      if (h && list && list.length) root.localStorage.setItem(MODLIST_KEY, JSON.stringify(list));
      else root.localStorage.removeItem(MODLIST_KEY);
    } catch (_) { /* the hash alone still gates the visit */ }
  }

  function summary(r) {
    return { id: r.id, manifest: r.manifest, sha256: r.sha256, contentSha: r.contentSha, size: r.size,
             unpacked: r.unpacked, enabled: r.enabled, order: r.order, source: r.source, installedAt: r.installedAt,
             removed: r.removed, registry: r.registry, settings: r.settings || {} };
  }

  /* After every change: store the modset the NEXT boot will run, so /visit
   * sends the set the game will actually have. */
  async function refreshModset(db) {
    const rows = await withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
    rememberCount(rows.length);
    for (const r of rows) if ((r.manifest && apiSkip(r.manifest)) || bootRefused(r)) r.cannotLoad = true;
    const plan = loadPlan(rows);
    const mods = [];
    for (const r of plan.load) {
      if (!countsForVisits(r.manifest)) continue;
      let csha = r.contentSha;
      if (!csha) {
        try {
          const full = await readRow(r.id);
          if (!full || !full.zip) continue;
          csha = await contentSha(readMod(new Uint8Array(full.zip), root.fflate).entries);
        } catch (_) { continue; }
      }
      mods.push({ id: r.id, enabled: true, contentSha: csha, manifest: r.manifest, source: r.source, settings: r.settings });
    }
    rememberModset(await modsetHash(mods), await modsetList(mods));
  }

  /* Third review: boot re-reads every planned ZIP by the full rules, and a row
   * whose stored bytes no longer pass (a later build's rule, a damaged store)
   * is skipped there. Boot records that on the row, keyed by the ZIP's sha256
   * (row.bootFail = { sha256, error }), so refreshModset plans the same set
   * the next boot will run: a Mods tab change never puts a mod the boot
   * refuses back into acweb.modset. A new ZIP (an update) clears it by its
   * hash; a boot that reads the same bytes fine again drops the mark. */
  function bootRefused(r) {
    return !!(r && isObj(r.bootFail) && r.bootFail.sha256 && r.bootFail.sha256 === r.sha256);
  }

  async function storeBootFails(fails, cleared) {
    const ids = Object.keys(fails).concat(cleared);
    if (!ids.length) return;
    const db = await openDb();
    try {
      await withRows(db, 'readwrite', function (rows, store) {
        for (const r of rows) {
          if (has(fails, r.id)) {
            if (fails[r.id].sha256 !== r.sha256 || bootRefused(r)) continue;
            r.bootFail = { sha256: r.sha256, error: String(fails[r.id].error).slice(0, 300) };
            store.put(r);
          } else if (cleared.indexOf(r.id) >= 0 && r.bootFail) {
            delete r.bootFail;
            store.put(r);
          }
        }
      });
    } finally { db.close(); }
  }

  async function databaseExists() {
    const f = idb();
    if (!f) return false;
    if (typeof f.databases !== 'function') return true; /* cannot tell: open it */
    try {
      const all = await f.databases();
      return all.some(function (d) { return d.name === DB_NAME; });
    } catch (_) { return true; }
  }

  /* Installed mods in load order. Opens the database even without the flag
   * (this is the Mods tab, not boot): rows with no flag means the flag was
   * lost, so it is set again. */
  async function list() {
    if (!flagOn() && !(await databaseExists())) return [];
    const db = await openDb();
    try {
      const rows = await withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
      if (rows.length && !flagOn()) { try { ensureFlag(); } catch (_) { /* reported on the next change */ } }
      return rows.map(summary);
    } finally { db.close(); }
  }

  /* Bytes from a File, Blob, ArrayBuffer or typed array. Realm-safe: the Mods
   * tab lives in the parent window and hands over ITS Uint8Array, which fails
   * every instanceof check made in this (the game iframe's) window. */
  async function toBytes(input) {
    const tooBig = function () { return ruleError('the ZIP is over ' + (MAX_ZIP / MIB) + ' MB'); };
    if (input && ArrayBuffer.isView(input)) {
      if (input.byteLength > MAX_ZIP) throw tooBig();
      return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    }
    if (Object.prototype.toString.call(input) === '[object ArrayBuffer]') {
      if (input.byteLength > MAX_ZIP) throw tooBig();
      return new Uint8Array(input);
    }
    if (input && typeof input.arrayBuffer === 'function') {
      if (typeof input.size === 'number' && input.size > MAX_ZIP) throw tooBig();
      return new Uint8Array(await input.arrayBuffer());
    }
    throw ruleError('that is not a file the game can read');
  }

  /* Install or update from a File/Blob/ArrayBuffer/Uint8Array. Returns the row.
   * opts.source: where it came from ('file' or 'registry:<id>'). A NEW mod that
   * would break the 32-mod or 96 MB limit is installed switched off, with
   * row.notice saying why; an update to a mod that is on and would break them is
   * refused. */
  async function install(input, opts) {
    const bytes = await toBytes(input);
    const mod = readMod(bytes, root.fflate);
    const sha = await sha256Hex(bytes);
    const csha = await contentSha(mod.entries);
    const room = await storageProblem(bytes.length, mod.unpacked);
    if (room) throw ruleError(room);
    ensureFlag();
    const db = await openDb();
    try {
      const out = await withRows(db, 'readwrite', function (rows, store, ctl) {
        const prev = rows.find(function (r) { return r.id === mod.manifest.id; });
        const order = prev ? prev.order : rows.reduce(function (n, r) { return Math.max(n, r.order + 1); }, 0);
        /* the same content as a removed mod stays removed and off; new
         * content (an update to a fixed version) clears the mark and goes on. */
        const stillRemoved = !!(prev && prev.removed && prev.contentSha === csha);
        const unkilled = !!(prev && prev.removed && !stillRemoved);
        const row = {
          id: mod.manifest.id, manifest: mod.manifest, zip: bytes.slice().buffer, sha256: sha, contentSha: csha,
          size: bytes.length, unpacked: mod.unpacked, enabled: stillRemoved ? false : (prev && !unkilled ? prev.enabled : true), order: order,
          source: (opts && opts.source) || 'file', installedAt: Date.now()
        };
        if (stillRemoved) { row.removed = prev.removed; row.registry = prev.registry; }
        /* an update keeps the player's settings; one the new version no
         * longer allows falls back to its default at boot (effectiveSettings). */
        if (prev && isObj(prev.settings)) row.settings = prev.settings;
        let notice = '';
        if (row.enabled) {
          const why = enableProblem(rows, row);
          if (why && prev && !unkilled) { ctl.fail(ruleError(why)); return; }
          if (why) { row.enabled = false; notice = 'Installed but switched off: ' + why; }
        }
        store.put(row);
        ctl.result = summary(row);
        if (notice) ctl.result.notice = notice;
      });
      await refreshModset(db);
      askPersist();
      notifyChanged();
      return out;
    } finally { db.close(); }
  }

  /* fn(rows) -> { put: [rows], del: [ids] }, in ONE readwrite transaction. */
  async function update(fn) {
    const db = await openDb();
    try {
      await withRows(db, 'readwrite', function (rows, store, ctl) {
        const next = fn(rows);
        for (const r of next.put || []) store.put(r);
        for (const k of next.del || []) store.delete(k);
        ctl.result = true;
      });
      /* Third review: the flag stays on after the last mod goes. Another tab
       * may be installing one right now (its flag write came before this
       * remove), and clearing it would hide that mod from every boot. A boot
       * that finds the flag on and no rows clears it then (bootLoad). */
      await refreshModset(db);
    } finally { db.close(); }
    notifyChanged();
  }

  /* tell the page that hosts the Mods tab the installed set changed
   * (install, remove, on/off, order, a setting), so a signed-in player's set
   * follows them to their other devices. The page owns the account call
   * (lib/mods/sync.svelte.ts): this file never holds the session. Lent mods
   * live in their own databases and never come through here; neither does
   * boot's own bookkeeping (a refused ZIP, a removed mark). Asynchronous and
   * best effort: a page without the hook (or a cross-origin one) is fine. */
  function notifyChanged() {
    const wins = [root];
    try { if (root.parent && root.parent !== root) wins.push(root.parent); } catch (_) { /* cross-origin */ }
    const st = typeof root.setTimeout === 'function' ? root.setTimeout : null;
    for (const w of wins) {
      let hook = null;
      try { hook = typeof w._acwebHostModsChanged === 'function' ? w._acwebHostModsChanged : null; } catch (_) { hook = null; }
      if (!hook) continue;
      const call = function () { try { hook.call(w, api); } catch (_) { /* the page's problem */ } };
      if (st) st(call, 0); else call();
      return;
    }
  }

  /* put the installed mods in this load order: ids first, as listed
   * (unknown ids ignored), then every other mod in its current order. */
  function setOrder(ids) {
    const want = Array.isArray(ids) ? ids.filter(function (x) { return typeof x === 'string'; }) : [];
    return update(function (rows) {
      const pos = function (r) { const k = want.indexOf(r.id); return k < 0 ? want.length + r.order : k; };
      const sorted = rows.slice().sort(function (a, b) { return pos(a) - pos(b) || a.order - b.order; });
      const put = [];
      sorted.forEach(function (r, i) { if (r.order !== i) { r.order = i; put.push(r); } });
      return { put: put };
    });
  }

  /* Remove a mod. opts.deleteData: also delete what its scripts saved,
   * store.client and its part of every town's data. The engine does that at the
   * next boot (index.json "wipe"), before any script runs: the running game
   * still holds the data and would write it back. Without it the data stays,
   * and a reinstall finds it again. */
  async function remove(id, opts) {
    /* Third review: the wipe is queued only once the row is gone, so a remove
     * the database refused never deletes the data of a mod still installed. */
    await update(function () { return { del: [id] }; });
    if (opts && opts.deleteData) addWipe(id);
  }

  /* ── data cleanup at boot ── */
  const WIPE_KEY = 'acweb.mods.wipe';
  function pendingWipe() {
    try {
      const v = JSON.parse(root.localStorage.getItem(WIPE_KEY) || '[]');
      return Array.isArray(v) ? v.filter(function (x) { return typeof x === 'string' && ID_RE.test(x); }).slice(0, 64) : [];
    } catch (_) { return []; }
  }
  function addWipe(id) {
    if (!ID_RE.test(String(id))) return;
    const ids = pendingWipe().filter(function (x) { return x !== id; });
    ids.push(id);
    try { root.localStorage.setItem(WIPE_KEY, JSON.stringify(ids.slice(-64))); } catch (_) {
      throw new Error('This browser would not save the request to delete the mod\'s data (site storage is full or blocked)');
    }
  }
  /* Forget the requests for ids (done), keeping any added since. */
  function dropWipe(ids) {
    const left = pendingWipe().filter(function (x) { return ids.indexOf(x) < 0; });
    try {
      if (left.length) root.localStorage.setItem(WIPE_KEY, JSON.stringify(left));
      else root.localStorage.removeItem(WIPE_KEY);
    } catch (_) { /* tried again next boot: the wipe is harmless twice */ }
  }

  /* Saves review #10: a request is cleared only once it is done for good. Boot
   * hands the ids to the engine in index.json (wipeAwaiting); the engine
   * deletes the data at pc_mod_lua_init and reports each id
   * (_acwebModsWiped, the game engine); then a sync that LANDED in IndexedDB
   * (shell.html _acwebSyncNow resolving null) clears it. A boot that dies
   * before main, a sync that fails or a tab closed first: the request stays,
   * and the next boot wipes again (deleting nothing twice is harmless). */
  let wipeAwaiting = [];
  const wipeReported = [];
  let wipeQueued = false;
  function wipeDone(id) {
    if (typeof id !== 'string' || wipeAwaiting.indexOf(id) < 0) return;
    if (wipeReported.indexOf(id) < 0) wipeReported.push(id);
    if (wipeQueued) return;
    wipeQueued = true;
    const st = typeof root.setTimeout === 'function' ? root.setTimeout : null;
    const run = function () {
      wipeQueued = false;
      const ids = wipeReported.splice(0);
      const sync = root._acwebSyncNow;
      if (typeof sync !== 'function' || !ids.length) return;
      Promise.resolve().then(function () { return sync.call(root, 'mods-wipe'); }).then(function (err) {
        if (err) { console.warn('[Mods] the data cleanup is not saved yet (' + err + '); the next start does it again'); return; }
        dropWipe(ids);
      }, function () { /* the next start does it again */ });
    };
    /* Out of the engine's call: the sync waits for its own turn. Bound to root. */
    if (st) st.call(root, run, 0); else run();
  }
  root._acwebModsWiped = wipeDone;

  /* what mods saved in this browser, by mod id, read from the game's
   * /save/mods (the game engine, the game engine, the game engine): [{ id, towns (town
   * files holding a part of it), client (a store.client file), bytes }]. The
   * Mods tab lists the ones no installed mod owns (removed with "keep its
   * data"), which otherwise fill a town's 64 parts and the save for good. Read
   * only; [] before the game's files are up. */
  const SAVED_ROOT = '/save/mods';
  function savedData() {
    const FS = root.Module && root.Module.FS;
    if (!FS || typeof FS.readdir !== 'function') return [];
    const by = Object.create(null);
    function entry(id) {
      if (!ID_RE.test(id)) return null;
      return by[id] || (by[id] = { id: id, towns: 0, client: false, bytes: 0 });
    }
    function sizeOf(path) { try { return FS.stat(path).size | 0; } catch (_) { return 0; } }
    function list(dir) { try { return FS.readdir(dir); } catch (_) { return []; } }
    for (const name of list(SAVED_ROOT)) {
      const m = /^(.+)\.(store|fx)$/.exec(name);
      const e = m && entry(m[1]);
      if (!e) continue;
      if (m[2] === 'store') e.client = true;
      e.bytes += sizeOf(SAVED_ROOT + '/' + name);
    }
    const magic = 'acmods-town 1\n';
    for (const name of list(SAVED_ROOT + '/towns')) {
      if (!/^[0-9a-f]{4}-[0-9a-f]{16}(-[0-9a-f]{8})?\.dat$/.test(name)) continue;
      let b;
      try { b = FS.readFile(SAVED_ROOT + '/towns/' + name); } catch (_) { continue; }
      let at = magic.length;
      if (b.length < at || String.fromCharCode.apply(null, Array.from(b.subarray(0, at))) !== magic) continue;
      const seen = Object.create(null);
      /* "@<id> <data version> <byte length>\n" then that many bytes, per mod */
      while (at < b.length && b[at] === 0x40) {
        let nl = at;
        while (nl < b.length && nl - at < 160 && b[nl] !== 0x0a) nl++;
        if (nl >= b.length || b[nl] !== 0x0a) break;
        const head = /^@(\S+) (\d+) (\d+)$/.exec(String.fromCharCode.apply(null, Array.from(b.subarray(at, nl))));
        if (!head) break;
        const len = Number(head[3]);
        if (nl + 1 + len > b.length) break;
        const e = entry(head[1]);
        if (e && !seen[head[1]]) { seen[head[1]] = true; e.towns++; e.bytes += len; }
        at = nl + 1 + len;
      }
    }
    return Object.keys(by).sort().map(function (id) { return by[id]; });
  }

  /* delete what a mod that is no longer installed saved, the same way
   * "Remove and delete its data" does: the engine wipes it at the next start,
   * before any script runs. */
  function deleteSavedData(id) {
    if (!ID_RE.test(String(id))) throw ruleError('that is not a mod id');
    addWipe(String(id));
  }

  /* Set one of a mod's settings. The game reads settings at boot, so it
   * takes a restart, like every mod change. value null puts the default back. */
  function setSetting(id, name, value) {
    return update(function (rows) {
      const r = rows.find(function (x) { return x.id === id; });
      if (!r) throw ruleError('that mod is not installed');
      const decl = declaredSettings(r.manifest).find(function (s) { return s && s.name === name; });
      if (!decl) throw ruleError(r.manifest.name + ' has no setting ' + JSON.stringify(name));
      const next = Object.assign({}, isObj(r.settings) ? r.settings : {});
      if (value === null || value === undefined || value === decl.default) delete next[name];
      else if (!settingValueOk(decl, value)) throw ruleError(settingWords(decl));
      else next[name] = value;
      r.settings = next;
      return { put: [r] };
    });
  }

  function settingWords(s) {
    if (s.type === 'bool') return s.label + ' must be on or off';
    if (s.type === 'number') return s.label + ' must be a whole number from ' + s.min + ' to ' + s.max;
    if (s.type === 'choice') return s.label + ' must be one of: ' + s.choices.join(', ');
    return s.label + ' must be at most ' + s.max_length + ' characters, on one line';
  }

  /* "Export my mods": one ZIP holding every installed mod's own ZIP as
   * mods/<id>-<version>.zip and mods.json ({ schema, exported_at, mods: [{ id,
   * version, file, enabled, order, settings, source }] }). Data the mods saved
   * is in the town save, not here. Returns { blob, name, count } (bytes in
   * place of blob where there is no Blob).
   *
   * Each mod's ZIP is read, stored into the output (ZipPassThrough: no
   * recompression) and dropped before the next is read. the claim that
   * it "streams" was half true: every output chunk stayed in an array until
   * the end, so the page held the whole export (up to EXPORT_MAX) at once.
   * Now each mod's output chunks are folded into a Blob as soon as they are
   * written (a Blob of a Blob and new parts: the browser keeps the bytes,
   * paging a big one to disk, and the page's heap lets the chunks go), so the
   * heap holds at most one installed ZIP and its stored copy. Over EXPORT_MAX
   * in all it is still refused up front: the file has to fit the download.
   * Where there is no Blob (node tests) the bytes are joined at the end, and
   * out.peakChunkBytes says the most the page held at once, for the tests. */
  const EXPORT_MAX = 512 * MIB;
  async function exportAll() {
    const F = root.fflate;
    if (!F || !F.Zip || !F.ZipPassThrough) throw ruleError('ZIP support is unavailable (fflate.umd.min.js failed to load). Please reload the page');
    const db = await openDb();
    let rows;
    try {
      rows = await withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
    } finally { db.close(); }
    const total = rows.reduce(function (n, r) { return n + (r.size || 0); }, 0);
    if (total > EXPORT_MAX) {
      throw ruleError('Your mods are ' + mbWords(total) + ' together, more than the ' + mbWords(EXPORT_MAX) +
        ' one export can hold. Remove the mods you do not use, then export again');
    }
    const hasBlob = typeof root.Blob === 'function';
    let blob = hasBlob ? new root.Blob([], { type: 'application/zip' }) : null;
    let chunks = [];
    let held = 0;
    let peak = 0;
    let failed = null;
    const zip = new F.Zip(function (err, chunk) {
      if (err) { failed = err; return; }
      if (chunk && chunk.length) { chunks.push(chunk); held += chunk.length; if (held > peak) peak = held; }
    });
    /* Fold what was written into the Blob, so the page lets it go. */
    const flush = function () {
      if (!hasBlob || !chunks.length) return;
      blob = new root.Blob([blob].concat(chunks), { type: 'application/zip' });
      chunks = [];
      held = 0;
    };
    const add = function (name, bytes) {
      const f = new F.ZipPassThrough(name);
      zip.add(f);
      f.push(bytes, true);
      if (failed) throw failed;
      flush();
    };
    const list = [];
    for (const r of rows) {
      const file = 'mods/' + r.id + '-' + r.manifest.version + '.zip';
      /* withRows hands out rows without their ZIPs: one read each */
      let full = await readRow(r.id);
      if (!full || !full.zip) continue;
      add(file, new Uint8Array(full.zip));
      full = null;
      list.push({ id: r.id, version: r.manifest.version, file: file, enabled: !!r.enabled, order: r.order,
                  settings: isObj(r.settings) ? r.settings : {}, source: r.source || 'file' });
    }
    const doc = { schema: 1, exported_at: new Date().toISOString(), mods: list };
    /* new Uint8Array: fflate tells data from a folder by instanceof, and an encoder from another realm hands out another realm's array */
    add('mods.json', new Uint8Array(new TextEncoder().encode(JSON.stringify(doc, null, 2))));
    zip.end();
    if (failed) throw failed;
    flush();
    const d = new Date();
    const pad = function (x) { return String(x).padStart(2, '0'); };
    const out = { count: list.length, name: 'my-mods-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.zip', peakChunkBytes: peak };
    if (hasBlob) {
      out.blob = blob;
    } else {
      const bytes = new Uint8Array(chunks.reduce(function (n, c) { return n + c.length; }, 0));
      let at = 0;
      for (const c of chunks) { bytes.set(c, at); at += c.length; }
      out.bytes = bytes;
    }
    chunks.length = 0;
    return out;
  }

  async function setEnabled(id, on) {
    if (on) ensureFlag();
    return update(function (rows) {
      const r = rows.find(function (x) { return x.id === id; });
      if (!r || r.enabled === !!on) return { put: [] };
      if (on && r.removed) throw ruleError(removedWords(r.removed.reason) + '. It cannot be switched on');
      if (on) {
        const why = enableProblem(rows, r);
        if (why) throw ruleError(why);
      }
      r.enabled = !!on;
      return { put: [r] };
    });
  }

  /* Move a mod one place earlier (-1) or later (+1) in load order; later wins. */
  function move(id, dir) {
    return update(function (rows) {
      const i = rows.findIndex(function (x) { return x.id === id; });
      const j = i + (dir < 0 ? -1 : 1);
      if (i < 0 || j < 0 || j >= rows.length) return { put: [] };
      const t = rows[i].order; rows[i].order = rows[j].order; rows[j].order = t;
      if (rows[i].order === rows[j].order) { rows[i].order = j; rows[j].order = i; }
      return { put: [rows[i], rows[j]] };
    });
  }

  /* Safe mode: the next boot loads no mods, once (the Mods tab's "Start
   * without mods"). Returns false when the browser would not store it. */
  function skipNextBoot() {
    try { root.localStorage.setItem(SKIP_KEY, '1'); return root.localStorage.getItem(SKIP_KEY) === '1'; } catch (_) { return false; }
  }

  function noModsInUrl() {
    const wins = [root];
    try { if (root.parent && root.parent !== root) wins.push(root.parent); } catch (_) { /* cross-origin */ }
    return wins.some(function (w) {
      try { return !!w.location && new URLSearchParams(w.location.search).get('nomods') === '1'; } catch (_) { return false; }
    });
  }

  /* ?modlang=<de|es|fr|it|en> on the play URL, in developer mode only:
   * message() answers in that language whatever the disc, so a translation
   * can be tried on a US disc. index.json "lang"; the game engine reads it. '' when
   * not asked for (or not a language a messages folder may hold). */
  const MOD_LANGS = ['en', 'de', 'es', 'fr', 'it'];
  function modLangInUrl() {
    const wins = [root];
    try { if (root.parent && root.parent !== root) wins.push(root.parent); } catch (_) { /* cross-origin */ }
    for (const w of wins) {
      let v = null;
      try { v = w.location ? new URLSearchParams(w.location.search).get('modlang') : null; } catch (_) { v = null; }
      if (v && MOD_LANGS.indexOf(v) >= 0) return v;
    }
    return '';
  }

  function consumeSkip() {
    let skip = false;
    try {
      skip = root.localStorage.getItem(SKIP_KEY) === '1';
      if (skip) root.localStorage.removeItem(SKIP_KEY);
    } catch (_) { /* no storage, no skip */ }
    return skip || noModsInUrl();
  }


  /* ── update check and kill list ──
   *
   * Before the engine starts, and when the Mods tab opens, the installed mods
   * are checked against the registry: POST /api/mods/status. A mod the
   * moderators removed (taken down, or its content hash is on the server's
   * denylist) is switched off and marked row.removed = { reason, at }, so it
   * does not run and its row says why. row.registry keeps the last answer
   * ({ status, reason, latest, checkedAt }) for the "Update available" badge.
   *
   * Only rows go out, so nobody without mods makes a call. A file install
   * sends its content hash alone (matched against the denylist); a registry
   * install also sends its id and version. The content hash is the one that
   * names a mod across the author's ZIP and the registry's rebuilt copy.
   *
   * The call never holds boot up for long (STATUS_TIMEOUT_MS). When it gets
   * no answer (offline, the request blocked, too slow, a bad answer) the game
   * goes by the LAST answer this browser got, kept in localStorage
   * KILL_KEY: the global kill switch as it last stood, and every content hash
   * the registry last said is removed. So:
   *   - remembered as killed (the switch, or a removed mod): stays off, as the
   *     registry said, until an answer says otherwise. Fail closed on what we
   *     know: a removal is for a reason (a harmful mod), and being offline or
   *     blocking the request must not undo it.
   *   - never answered about (no remembered word at all): starts as before.
   *     Fail open on what we do not know: offline play is the game's normal
   *     case, and a mod the player chose is theirs to run.
   * A removed mark stored on a row stays too. The memory is replaced by each
   * answer: a batch that answers rewrites what it says about its rows; the
   * switch is rewritten whenever any batch answers.
   *
   * Transport: this file does not know the API's origin and the game frame
   * should not hold the session, so the call goes through the page that hosts
   * the frame: window._acwebModsStatusFetch here, or the parent's
   * _acwebHostModStatus (PlayHost.svelte, lib/mods/mods.ts postModStatus).
   * Each takes { mods: [...] } and resolves to the route's JSON. */

  const STATUS_TIMEOUT_MS = 2500;
  const STATUS_MAX = 128;
  const HEX64_RE = /^[0-9a-f]{64}$/;
  const STATUSES = ['listed', 'superseded', 'yanked', 'removed', 'unknown'];

  function removedWords(reason) {
    return 'Removed by the moderators' + (reason ? ': ' + reason : '');
  }

  function statusTransport() {
    if (typeof root._acwebModsStatusFetch === 'function') return root._acwebModsStatusFetch;
    try {
      const p = root.parent;
      if (p && p !== root && typeof p._acwebHostModStatus === 'function') return p._acwebHostModStatus;
    } catch (_) { /* a cross-origin parent: no transport */ }
    return null;
  }

  function isRegistry(r) { return typeof r.source === 'string' && r.source.indexOf('registry:') === 0; }

  /* What goes out: [{ content_sha, id?, version? }], and the row ids they
   * stand for. A row with no stored hash is left out (install always stores
   * one). Every row is asked about: checkStatus sends them STATUS_MAX at a
   * time, the most one call to the route may hold. */
  function statusQuery(rows) {
    const query = [];
    const ids = [];
    for (const r of rows) {
      if (typeof r.contentSha !== 'string' || !HEX64_RE.test(r.contentSha)) continue;
      const q = { content_sha: r.contentSha };
      /* A lent row is a registry version (the backend lent it as one): its
       * id and version go out too. r.modId: the mod id when r.id is a key. */
      if ((isRegistry(r) || r.lent) && r.manifest) { q.id = r.modId || r.id; q.version = r.manifest.version; }
      query.push(q);
      ids.push(r.id);
    }
    return { query: query, ids: ids };
  }

  /* The newer listed version, checked, or null. */
  function cleanLatest(l, installedVersion) {
    if (!isObj(l)) return null;
    const str = function (k) { return typeof l[k] === 'string' ? l[k] : ''; };
    if (!str('id') || !VERSION_RE.test(str('version')) || !HEX64_RE.test(str('sha256'))) return null;
    const a = str('version').split('.').map(Number);
    const b = String(installedVersion || '0.0.0').split('.').map(Number);
    let newer = false;
    for (let i = 0; i < 3; i++) { if (a[i] !== b[i]) { newer = a[i] > b[i]; break; } }
    if (!newer) return null;
    return { id: str('id'), mod_id: str('mod_id'), name: str('name').slice(0, 60), version: str('version'),
             size_bytes: typeof l.size_bytes === 'number' ? l.size_bytes : 0, sha256: str('sha256') };
  }

  /* the global kill switch, from the last answer: { message } when the
   * registry says every game must start without mods, else null. Any batch
   * saying so is enough. remembered (KILL_KEY) and applied when no
   * batch answers; { message, remembered: true } then. */
  let statusKill = null;

  /* ── the remembered verdicts ──
   * { v: 1, at, kill: { message } | null, removed: { <content sha>: { reason, code, at } } } */
  const KILL_KEY = 'acweb.mods.killed';
  const KILL_REMOVED_MAX = 512; /* hashes kept; the oldest go first */
  function readKillMemory() {
    try {
      const m = JSON.parse(root.localStorage.getItem(KILL_KEY) || 'null');
      if (isObj(m) && isObj(m.removed)) return { v: 1, at: m.at || 0, kill: isObj(m.kill) && typeof m.kill.message === 'string' ? { message: m.kill.message.slice(0, 300) } : null, removed: m.removed };
    } catch (_) { /* unreadable: nothing remembered */ }
    return { v: 1, at: 0, kill: null, removed: {} };
  }
  function writeKillMemory(m) {
    const keys = Object.keys(m.removed);
    if (keys.length > KILL_REMOVED_MAX) {
      keys.sort(function (a, b) { return (m.removed[a].at || 0) - (m.removed[b].at || 0); });
      for (const k of keys.slice(0, keys.length - KILL_REMOVED_MAX)) delete m.removed[k];
    }
    try {
      if (!m.kill && !Object.keys(m.removed).length) root.localStorage.removeItem(KILL_KEY);
      else root.localStorage.setItem(KILL_KEY, JSON.stringify(m));
    } catch (_) { /* no storage: nothing remembered, the old behaviour */ }
  }
  /* What the page shows for the switch: remembered, or from an answer. */
  function killNow() {
    if (!statusKill) return null;
    return statusKill.remembered ? { message: statusKill.message, remembered: true } : { message: statusKill.message };
  }
  function killFrom(res) {
    const k = isObj(res) ? res.kill_switch : null;
    if (!isObj(k) || k.on !== true) return null;
    const msg = typeof k.message === 'string' && k.message.trim() ? k.message.trim().slice(0, 300)
      : 'Mods are switched off for everyone for now.';
    return { message: msg };
  }

  /* One batch's answers as { <row id>: answer }, or null when the answer is
   * missing or of the wrong shape (the whole batch is then ignored). */
  function batchAnswers(res, query, ids) {
    if (!res || !Array.isArray(res.mods) || res.mods.length !== query.length) return null;
    const out = {};
    for (let i = 0; i < ids.length; i++) {
      const a = res.mods[i];
      if (!isObj(a) || STATUSES.indexOf(a.status) < 0 || a.content_sha !== query[i].content_sha) return null;
      out[ids[i]] = a;
    }
    return out;
  }

  /* Ask the registry about rows. Resolves to { <row id>: answer } or null (no
   * transport, nothing to ask, timed out, failed, or an answer of the wrong
   * shape). More than STATUS_MAX rows go out as several calls at once, under
   * the one timeout; a batch that fails or times out only leaves ITS rows
   * unchecked. Never rejects. */
  async function checkStatus(rows, opts) {
    statusKill = null;
    const q = statusQuery(rows);
    if (!q.query.length) return null;
    const send = (opts && opts.transport) || statusTransport();
    if (!send) return rememberedStatus(q, {}, false);
    const ms = (opts && opts.timeoutMs) || STATUS_TIMEOUT_MS;
    /* Bound to root: a detached window.setTimeout throws "Illegal invocation"
     * in a browser (Node does not), see watchTimers. */
    const rst = typeof root.setTimeout === 'function' ? root.setTimeout : (typeof setTimeout === 'function' ? setTimeout : null);
    const rct = typeof root.clearTimeout === 'function' ? root.clearTimeout : (typeof clearTimeout === 'function' ? clearTimeout : null);
    const st = rst ? function (fn, t) { return rst.call(root, fn, t); } : null;
    const ct = rct ? function (id) { return rct.call(root, id); } : null;
    let timer = null;
    const late = st ? new Promise(function (resolve) { timer = st(function () { resolve(null); }, ms); }) : null;
    try {
      const batches = [];
      for (let at = 0; at < q.query.length; at += STATUS_MAX) {
        const query = q.query.slice(at, at + STATUS_MAX);
        const ids = q.ids.slice(at, at + STATUS_MAX);
        const call = Promise.resolve().then(function () { return send({ mods: query }); })
          .catch(function (e) { console.warn('[Mods] the mod check failed:', (e && e.message) || e); return null; });
        batches.push((late ? Promise.race([call, late]) : call).then(function (res) {
          const kill = killFrom(res);
          if (kill) statusKill = kill;
          return batchAnswers(res, query, ids);
        }));
      }
      const results = await Promise.all(batches);
      const out = {};
      let any = false;
      for (const r of results) {
        if (!r) continue;
        any = true;
        for (const k of Object.keys(r)) out[k] = r[k];
      }
      if (!any) console.warn('[Mods] the mod check did not answer; going by the last answer this browser got');
      return rememberedStatus(q, out, any);
    } catch (e) {
      console.warn('[Mods] the mod check failed; going by the last answer this browser got:', (e && e.message) || e);
      return rememberedStatus(q, {}, false);
    } finally {
      if (timer !== null && ct) ct(timer);
    }
  }

  /* fold a check's fresh answers into the memory, and fill in, from
   * it, every row no batch answered about. answered: whether any batch did
   * (only then is the remembered switch replaced). Returns the answers, with
   * remembered ones marked { remembered: true }, or null when there is
   * neither a fresh answer nor a remembered verdict (start as before). */
  function rememberedStatus(q, fresh, answered) {
    const mem = readKillMemory();
    const now = Date.now();
    if (answered) {
      mem.at = now;
      mem.kill = statusKill ? { message: statusKill.message } : null;
      q.ids.forEach(function (id, i) {
        const a = fresh[id];
        if (!a) return;
        const sha = q.query[i].content_sha;
        if (a.status === 'removed') {
          mem.removed[sha] = { reason: typeof a.reason === 'string' ? a.reason.slice(0, 500) : '',
                               code: typeof a.reason_code === 'string' ? a.reason_code.slice(0, 40) : '', at: now };
        } else delete mem.removed[sha];
      });
      writeKillMemory(mem);
    } else if (mem.kill) {
      statusKill = { message: mem.kill.message, remembered: true };
      console.warn('[Mods] remembered: mods are switched off for everyone');
    }
    const out = fresh;
    let any = answered;
    q.ids.forEach(function (id, i) {
      if (out[id]) return;
      const m = mem.removed[q.query[i].content_sha];
      if (!m) return;
      out[id] = { status: 'removed', reason: m.reason || '', reason_code: m.code || '', content_sha: q.query[i].content_sha, remembered: true };
      any = true;
    });
    return any ? out : null;
  }

  /* Apply answers to rows in place. Returns the rows whose stored state
   * changed (worth a write). A remembered answer only switches a
   * removed mod off: it is not a check, so the row's registry badge stays. */
  function applyStatus(rows, answers, now) {
    const changed = [];
    const key = function (r) {
      return JSON.stringify([r.enabled, r.removed ? r.removed.reason : null,
        r.registry ? [r.registry.status, r.registry.reason, r.registry.latest] : null]);
    };
    for (const r of rows) {
      const a = answers[r.id];
      if (!a) continue;
      const before = key(r);
      const reason = typeof a.reason === 'string' ? a.reason.slice(0, 500) : '';
      /* The fixed reason code; the Mods tab words a removal by it. */
      const code = typeof a.reason_code === 'string' && /^[a-z_]{1,40}$/.test(a.reason_code) ? a.reason_code : '';
      if (a.status === 'removed') {
        if (!r.removed || r.removed.reason !== reason || (r.removed.code || '') !== code) r.removed = { reason: reason, code: code, at: now };
        r.enabled = false;
      } else if (r.removed) {
        delete r.removed; /* lifted: it stays off until the player switches it on */
      }
      if (a.remembered) { if (key(r) !== before) changed.push(r); continue; }
      r.registry = { status: a.status, reason: reason, reason_code: code, latest: cleanLatest(a.latest, r.manifest && r.manifest.version), checkedAt: now };
      if (key(r) !== before) changed.push(r);
    }
    return changed;
  }

  /* Store answers: re-read the rows in one readwrite transaction (another tab
   * may have changed them since) and apply again. */
  async function storeStatus(answers, now) {
    const db = await openDb();
    try {
      const n = await withRows(db, 'readwrite', function (rows, store, ctl) {
        const changed = applyStatus(rows, answers, now);
        for (const r of changed) store.put(r);
        ctl.result = changed.length;
      });
      if (n) await refreshModset(db);
      return n;
    } finally { db.close(); }
  }

  /* The Mods tab's check. Nothing installed, no call. Resolves to the list
   * (as list() gives it), checked or not. */
  async function refreshStatus(opts) {
    const rows = await list();
    if (!rows.length) return rows;
    const answers = await checkStatus(rows, opts);
    if (!answers) return rows;
    await storeStatus(answers, Date.now());
    return list();
  }

  /* ── boot ── */

  function mkdirs(FS, path) {
    let at = '';
    for (const part of path.split('/').filter(Boolean)) {
      at += '/' + part;
      try { FS.mkdir(at); } catch (_) { /* exists; a real clash fails the writeFile below */ }
    }
  }

  /* Boot's rows WITHOUT their ZIPs: withRows' cursor drops each ZIP as
   * it passes; readRow then fetches the ZIPs that load, one at a time. */
  function bootRows(db) {
    return withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
  }

  /* One stored row WITH its ZIP, or undefined when it is gone. The manifest,
   * hashes and switch come from the SAME record as the bytes, so a tab that
   * replaced the mod after the list was read cannot pair one version's
   * manifest with another version's files. dbName: LENT_DB for a lent row. */
  async function readRow(id, dbName) {
    const db = await openDb(dbName);
    try {
      return await new Promise(function (resolve, reject) {
        let t;
        try { t = db.transaction(['mods', 'zips'], 'readonly'); } catch (e) { reject(e); return; }
        let row;
        let zip;
        t.oncomplete = function () {
          if (row && zip && zip.zip) row.zip = zip.zip;
          resolve(row);
        };
        t.onabort = function () { reject(t.error || new Error('the mods database could not be read')); };
        t.onerror = function () { /* onabort follows */ };
        const req = t.objectStore('mods').get(id);
        req.onsuccess = function () { row = req.result || undefined; };
        const zreq = t.objectStore('zips').get(id);
        zreq.onsuccess = function () { zip = zreq.result || undefined; };
      });
    } finally { db.close(); }
  }

  /* Best effort: a failed mod's half-written folder is not in index.json, so the
   * engine never reads it either way; this only gives the memory back. */
  function rmrf(FS, path) {
    try {
      const st = FS.stat(path);
      if (FS.isDir(st.mode)) {
        for (const n of FS.readdir(path)) if (n !== '.' && n !== '..') rmrf(FS, path + '/' + n);
        FS.rmdir(path);
      } else FS.unlink(path);
    } catch (_) { /* gone, or this FS cannot */ }
  }

  /* ── mods lent for one friend visit ──
   *
   * When every world mod of a friend's town is a reviewed registry version, the
   * visitor may load them for that visit only. The parent page (it alone may
   * reach the API) fetches each version's ZIP and hands the bytes here; lend()
   * checks every one against what the host's visit named (id, version, content
   * hash, and the whole set against the host's modset hash), keeps them in a
   * SEPARATE database (LENT_DB, never the installed mods), and marks this TAB's
   * sessionStorage, so only this tab's next boots run them. Nothing is
   * installed. Such a boot loads the visitor's own mods that do not count for
   * visits, then the lent ones, each with temp_store (pc_mod_lua keeps its
   * store in MEMFS: the host's scripts start empty and leave nothing behind).
   * clearLent() ends it; a mark older than LENT_TTL_MS, or a lent database
   * left by a closed tab, is dropped at the next boot. */
  /* Third review: one database PER LEND, named
   * acweb-mods-lent-<ms>-<random>, its name in this tab's mark. It used to be
   * one database for the whole site, so any other tab's boot without a mark
   * deleted the visiting tab's set. A lent database is now dropped only by the
   * tab that made it (clearLent, or its next lend) or, at any boot, once its
   * name says it is older than LENT_TTL_MS. Names are also kept in
   * localStorage (LENT_DBS_KEY) for browsers without indexedDB.databases(). */
  const LENT_DB_PREFIX = 'acweb-mods-lent-';
  const LENT_DB_LEGACY = 'acweb-mods-lent';     /* before the third review: one for the site */
  const LENT_KEY = 'acweb.mods.lent';           /* sessionStorage: { visitId, at, db, modset, set } */
  const LENT_DB_KEY = 'acweb.mods.lentdb';      /* localStorage, legacy: '1' while LENT_DB_LEGACY may exist */
  const LENT_DBS_KEY = 'acweb.mods.lentdbs';    /* localStorage: names of lent databases that may exist */
  const LENT_TTL_MS = 12 * 60 * 60 * 1000;
  const LENT_DB_RE = /^acweb-mods-lent-(\d{1,15})-[0-9a-f]{8}$/;

  function sessionStore() { try { return root.sessionStorage || null; } catch (_) { return null; } }

  /* the curated City set. A City mod may only change how things look
   * and what is said: textures and lines, never a shop, a script or a command
   * (no mod-granted items or effects in The City, ever). '' when it qualifies. */
  function cityProblem(m) {
    if (!isObj(m)) return 'mod.json is not a JSON object';
    const c = isObj(m.content) ? m.content : {};
    const extra = Object.keys(c).filter(function (k) { return k !== 'textures' && k !== 'messages'; });
    if (extra.length) return 'a City mod may only hold textures and lines, not ' + extra.join(', ');
    if (has(m, 'scripts')) return 'a City mod may not run scripts';
    if (has(m, 'permissions') && !(Array.isArray(m.permissions) && m.permissions.length === 0)) return 'a City mod may not ask for commands';
    return '';
  }

  /* This tab's lent set, or null. A mark that is malformed or too old is dropped. */
  function lentState() {
    const ss = sessionStore();
    let v = null;
    try { v = ss ? JSON.parse(ss.getItem(LENT_KEY) || 'null') : null; } catch (_) { v = null; }
    const ok = v && typeof v.visitId === 'string' && typeof v.modset === 'string' && (HEX64_RE.test(v.modset) || v.kind === 'city') &&
      typeof v.db === 'string' && LENT_DB_RE.test(v.db) &&
      Array.isArray(v.set) && v.set.length > 0 && typeof v.at === 'number' && Date.now() - v.at < LENT_TTL_MS &&
      v.set.every(function (m) { return m && ID_RE.test(m.id) && typeof m.version === 'string' && HEX64_RE.test(m.contentSha); });
    if (!ok) {
      if (v) { try { ss.removeItem(LENT_KEY); } catch (_) { /* gone anyway */ } }
      return null;
    }
    return v;
  }

  function lentDbNames() {
    try {
      const v = JSON.parse(root.localStorage.getItem(LENT_DBS_KEY) || '[]');
      return Array.isArray(v) ? v.filter(function (n) { return typeof n === 'string' && LENT_DB_RE.test(n); }).slice(-64) : [];
    } catch (_) { return []; }
  }
  function setLentDbNames(names) {
    try {
      if (names.length) root.localStorage.setItem(LENT_DBS_KEY, JSON.stringify(names.slice(-64)));
      else root.localStorage.removeItem(LENT_DBS_KEY);
    } catch (_) { /* the databases() sweep still finds them */ }
  }

  function dropDb(name) {
    return new Promise(function (resolve) {
      try {
        const req = idb().deleteDatabase(name);
        req.onsuccess = req.onerror = req.onblocked = function () { resolve(); };
      } catch (_) { resolve(); }
    });
  }

  /* Delete one lent database and forget its name. */
  async function deleteLentDb(name) {
    if (!name) return;
    await dropDb(name);
    setLentDbNames(lentDbNames().filter(function (n) { return n !== name; }));
  }

  /* At boot: drop every lent database older than LENT_TTL_MS (by the time in
   * its name), and the one site-wide database from before. Never one younger:
   * it may be another tab's visit. keep: this tab's own. Best effort. */
  async function sweepLentDbs(keep) {
    const now = Date.now();
    const names = new Set(lentDbNames());
    try {
      const f = idb();
      if (f && typeof f.databases === 'function') {
        for (const d of await f.databases()) {
          if (d && typeof d.name === 'string' && (LENT_DB_RE.test(d.name) || d.name === LENT_DB_LEGACY)) names.add(d.name);
        }
      }
    } catch (_) { /* the stored names alone */ }
    let legacy = false;
    try { legacy = root.localStorage.getItem(LENT_DB_KEY) === '1'; } catch (_) { legacy = false; }
    if (legacy) names.add(LENT_DB_LEGACY);
    for (const n of names) {
      if (n === keep) continue;
      if (n === LENT_DB_LEGACY) {
        await dropDb(n);
        try { root.localStorage.removeItem(LENT_DB_KEY); } catch (_) { /* tried again next boot */ }
        continue;
      }
      const m = LENT_DB_RE.exec(n);
      if (m && now - Number(m[1]) >= LENT_TTL_MS) await deleteLentDb(n);
    }
  }

  /* End this tab's lent set: the next boot runs the player's own mods again. */
  async function clearLent() {
    const ss = sessionStore();
    let db = null;
    try {
      const v = ss ? JSON.parse(ss.getItem(LENT_KEY) || 'null') : null;
      if (v && typeof v.db === 'string' && LENT_DB_RE.test(v.db)) db = v.db;
    } catch (_) { db = null; }
    try { if (ss) ss.removeItem(LENT_KEY); } catch (_) { /* gone anyway */ }
    await deleteLentDb(db);
  }

  /* The player's own mods that a lent boot runs beside the lent set: the ones
   * on that do not count for visits (client mods), minus any with a lent id.
   * The City runs its set alone. Rows without ZIPs. */
  async function ownBesideLent(lentIds) {
    if (!flagOn()) return [];
    const db = await openDb();
    try {
      const rows = await bootRows(db);
      return rows.filter(function (r) {
        return r.enabled && !r.removed && lentIds.indexOf(r.id) < 0 && r.manifest && !countsForVisits(r.manifest);
      });
    } finally { db.close(); }
  }

  /* The parent's check before it downloads a lent set (third review): this
   * device's cap and the unpacked bytes of the player's own mods that stay on
   * beside a set with these ids. */
  async function lendRoom(ids) {
    let own = [];
    try { own = apiFilter(await ownBesideLent(Array.isArray(ids) ? ids : [])).rows; } catch (_) { own = []; }
    return { cap: enabledCap(), own: own.reduce(function (n, r) { return n + (r.unpacked || 0); }, 0) };
  }

  /* A lent mod that would not load here, said as one problem (the errors
   * catalogue's visit-lend-wont-load). */
  function wontLoad(why) { return ruleError('the friend\'s mods would not all load here: ' + why); }

  /* The host's settings for one lent mod, checked against what the
   * mod's mod.json declares: every declared name and no other, each value one
   * it allows. null for a mod that declares none (and was sent none). Throws
   * otherwise: a value the mod does not take is not the host's settings, and
   * falling back to its default would run a set the host does not. */
  function lentSettings(manifest, sent) {
    const decl = declaredSettings(manifest).filter(function (s) { return isObj(s) && typeof s.name === 'string'; });
    const bad = function () { return ruleError('the friend\'s settings for ' + manifest.id + ' are not ones that mod takes'); };
    if (!decl.length) {
      if (sent !== undefined && sent !== null && !(isObj(sent) && Object.keys(sent).length === 0)) throw bad();
      return null;
    }
    if (!isObj(sent) || Object.keys(sent).length !== decl.length) throw bad();
    const out = {};
    for (const s of decl) {
      if (!has(sent, s.name) || !settingValueOk(s, sent[s.name])) throw bad();
      out[s.name] = sent[s.name];
    }
    return out;
  }

  /* Check and keep the host's mods for one visit. expect: { visitId, modset,
   * mods: [{ id, version, content_sha, bytes, settings? }] } in the host's
   * LOAD ORDER (settings: the host's effective values, from the host's named
   * list). Throws (nothing kept) unless every ZIP passes the full rules, is
   * the named id and version, hashes to the named content hash, counts for
   * visits, carries settings its mod.json allows (lentSettings),
   * and the whole set, with those settings, hashes to the host's
   * modset; and unless the boot it sets up would load every lent mod: the
   * same load plan the boot runs (dependencies, conflicts, the 32-mod cap and
   * this device's size cap, beside the player's own mods that stay on), so a
   * set that would not load whole is refused here, before the restart, never
   * found out after it. Returns { modset, unpacked }. */
  async function lend(expect) {
    /* kind 'city' is the curated City set: textures and lines only, no
     * set hash to match (the City is not gated), and the boot runs ONLY it. */
    const city = !!expect && expect.kind === 'city';
    if (!expect || typeof expect.visitId !== 'string' || (!city && !HEX64_RE.test(expect.modset || '')) ||
        !Array.isArray(expect.mods) || !expect.mods.length || expect.mods.length > MAX_ENABLED) {
      throw ruleError(city ? 'the City mod list could not be read' : 'the friend\'s mod list could not be read');
    }
    const lentIds = expect.mods.map(function (w) { return w && typeof w.id === 'string' ? w.id : ''; });
    let own = [];
    if (!city) {
      try { own = await ownBesideLent(lentIds); } catch (_) { own = []; /* the boot finds the same, or skips them */ }
      own = apiFilter(own).rows.filter(function (r) { return !bootRefused(r); });
    }
    const cap = enabledCap();
    const ownUnpacked = own.reduce(function (n, r) { return n + (r.unpacked || 0); }, 0);
    const rows = [];
    const seen = {};
    let unpacked = 0;
    for (let k = 0; k < expect.mods.length; k++) {
      const want = expect.mods[k];
      const bytes = await toBytes(want.bytes);
      const mod = readMod(bytes, root.fflate);
      const m = mod.manifest;
      if (m.id !== want.id || m.version !== want.version || seen[m.id]) {
        throw ruleError('the download for ' + want.id + ' ' + want.version + ' is a different mod');
      }
      seen[m.id] = true;
      const csha = await contentSha(mod.entries);
      if (csha !== want.content_sha) throw ruleError('the download for ' + want.id + ' ' + want.version + ' does not match the friend\'s copy');
      if (city) {
        const why = cityProblem(m);
        if (why) throw ruleError(want.id + ': ' + why);
      } else if (!countsForVisits(m)) throw ruleError(want.id + ' does not need to be lent for a visit');
      unpacked += mod.unpacked;
      /* A running total: stop at the first mod over the cap, not after unpacking them all. */
      if (ownUnpacked + unpacked > cap) {
        throw wontLoad('they unpack to ' + mbWords(unpacked) + (ownUnpacked ? ' beside ' + mbWords(ownUnpacked) + ' of your own mods' : '') +
          ', and the game keeps ' + mbWords(cap) + ' for mods' + (cap < MAX_ENABLED_UNPACKED ? ' on a phone' : ''));
      }
      const row = { id: m.id, manifest: m, zip: bytes.slice().buffer, contentSha: csha, unpacked: mod.unpacked, order: 1e6 + k, enabled: true };
      /* The host's settings: exactly the settings this mod declares,
       * each a value it allows (the Mods tab's own rule), or the lend is
       * refused whole. They live only on this lent row, in the lend's own
       * database, and go when the lend does: never on the player's installed
       * copy, never sent anywhere. The set hash below then pins them to the
       * host's. */
      if (!city) {
        const st = lentSettings(m, want.settings);
        if (st) row.settings = st;
      }
      rows.push(row);
    }
    const hash = await modsetHash(rows);
    if (!city && hash !== expect.modset) throw ruleError('the friend\'s mods do not add up to their town\'s mod set');
    /* The boot's own plan over what it will see (mp review #5). */
    const plan = loadPlan(own.concat(rows), cap);
    const lentSkip = plan.skip.filter(function (x) { return seen[x.id]; });
    if (lentSkip.length) throw wontLoad(lentSkip[0].id + ' ' + lentSkip[0].error);
    const prev = lentState();
    if (prev) await deleteLentDb(prev.db);
    const at = Date.now();
    const rnd = new Uint8Array(4);
    root.crypto.getRandomValues(rnd);
    const dbName = LENT_DB_PREFIX + at + '-' + hex(rnd.buffer);
    setLentDbNames(lentDbNames().concat([dbName]));
    const db = await openDb(dbName);
    try {
      await withRows(db, 'readwrite', function (_old, store, ctl) {
        for (const r of rows) store.put(r);
        ctl.result = rows.length;
      });
    } finally { db.close(); }
    const ss = sessionStore();
    if (!ss) { await deleteLentDb(dbName); throw ruleError('this browser cannot keep a friend\'s mods for one visit'); }
    try {
      ss.setItem(LENT_KEY, JSON.stringify({
        visitId: expect.visitId, at: at, db: dbName, modset: hash, kind: city ? 'city' : 'visit',
        set: rows.map(function (r) { return { id: r.id, version: r.manifest.version, contentSha: r.contentSha }; })
      }));
    } catch (_) {
      await deleteLentDb(dbName);
      throw ruleError('this browser cannot keep a friend\'s mods for one visit');
    }
    return { modset: hash, unpacked: unpacked };
  }

  /* Boot: the lent rows (no ZIPs; readRow fetches each from the lend's database). */
  async function lentRows(lent) {
    const db = await openDb(lent.db);
    try {
      const rows = await bootRows(db);
      const want = lent.set.map(function (m) { return m.id; });
      const byId = {};
      for (const r of rows) byId[r.id] = r;
      return want.map(function (id, k) {
        const r = byId[id];
        if (!r || r.contentSha !== lent.set[k].contentSha) throw ruleError('a lent mod is missing from this tab');
        r.lent = true;
        r.order = 1e6 + k;
        return r;
      });
    } finally { db.close(); }
  }

  function publish(state) {
    for (const s of state.skipped) if (s && !s.code) s.code = errorCode(s.error);
    state.ready = true;
    root._acwebModsState = state;
    return state;
  }

  /* Boot's api check on an installed row's stored manifest: null when this game
   * reads its level, else { error, api: 'older' | 'newer' } for the Mods tab. */
  function apiSkip(manifest) {
    const st = apiStatus(manifest);
    if (st === 'newer') return { error: apiProblem(manifest), api: 'newer' };
    if (st === 'older') {
      return {
        error: has(manifest, 'api') ? apiProblem(manifest)
          : 'made for an older game: it has no mod API level, this game reads ' + apiRange(),
        api: 'older'
      };
    }
    return null;
  }

  /* Enabled rows this game can read by their api level, and the skips for the
   * rest. Both boot and refreshModset cut with it BEFORE planLoad, so a mod
   * that never loads neither counts against the caps nor enters the modset. */
  function apiFilter(rows) {
    const out = [];
    const skipped = [];
    for (const r of rows) {
      const why = r.enabled ? apiSkip(r.manifest) : null;
      if (why) skipped.push({ id: r.id, error: why.error, api: why.api });
      else out.push(r);
    }
    return { rows: out, skipped: skipped };
  }

  /* ── boot watchdog ──
   *
   * Mods run inside the engine, and a mod that freezes it (a script, a texture
   * the engine chokes on) would freeze EVERY boot, with "Start without mods" in
   * the frozen page. So a boot that loads mods leaves a mark in localStorage
   * ('acweb.mods.boot': the mod set, its names, and a heartbeat), and clears it
   * once the game is healthy: the ENGINE says so (the game engine calls
   * window._acwebModsHealthy once, after the player has been in the game world
   * for 300 frames, about five seconds; it used to be a debug print shell.html
   * scraped, and removing the print would have silently left only the five
   * minutes), or five minutes of the game running in a visible page pass.
   *
   * A frozen page runs no JavaScript at all, so the heartbeat stops and nothing
   * can clear the mark. A page that is still alive takes the mark down itself
   * when it goes away (pagehide, or hidden) and puts it back if it returns, so
   * a reload, a closed tab or a switch to another app during boot leaves
   * nothing behind.
   *
   * The next boot with the SAME mod set that finds the mark trips when the
   * heartbeat stopped at least WATCH_FREEZE_MS before (a page that hung, then
   * was reloaded), or when this is the second unfinished boot in a row (two
   * fast reloads of a hung page). It then starts without mods (safe mode),
   * says which mods were on (state.watchdog), and clears the mark, so a player
   * who keeps the mods tries them again on the next start. */
  const WATCH_KEY = 'acweb.mods.boot';
  const WATCH_FREEZE_MS = 8000;
  const WATCH_BEAT_MS = 2000;
  const WATCH_MAX_MS = 5 * 60 * 1000;

  function readWatchMark() {
    try {
      const text = root.localStorage.getItem(WATCH_KEY);
      if (!text) return null;
      const m = JSON.parse(text);
      return isObj(m) && typeof m.set === 'string' ? m : null;
    } catch (_) { return null; }
  }
  function writeWatchMark(m) {
    try { root.localStorage.setItem(WATCH_KEY, JSON.stringify(m)); } catch (_) { /* no storage: no watchdog */ }
  }
  function clearWatchMark() {
    try { root.localStorage.removeItem(WATCH_KEY); } catch (_) { /* nothing to clear */ }
  }

  /* What a boot makes of the mark it finds. mark: the stored mark or null;
   * set: the mod set this boot would load; now: ms. Returns { trip, n, ids,
   * names }: n is how many unfinished boots in a row the mark stands for (0
   * when it does not apply to this set). Pure, for the tests. */
  function watchdogVerdict(mark, set, now) {
    if (!isObj(mark) || typeof mark.set !== 'string' || mark.set !== set || !set) return { trip: false, n: 0 };
    const n = typeof mark.n === 'number' && mark.n >= 1 ? Math.floor(mark.n) : 1;
    const beat = typeof mark.alive === 'number' ? mark.alive : (typeof mark.at === 'number' ? mark.at : now);
    const ids = Array.isArray(mark.ids) ? mark.ids.filter(function (x) { return typeof x === 'string'; }) : [];
    const names = Array.isArray(mark.names) ? mark.names.filter(function (x) { return typeof x === 'string'; }) : [];
    const trip = now - beat >= WATCH_FREEZE_MS || n >= 2;
    return { trip: trip, n: n, ids: ids, names: names };
  }

  /* The set a mark compares: the planned mods, by id and ZIP hash, in order. */
  function watchSet(rows) {
    return rows.map(function (r) { return r.id + '@' + (r.sha256 || ''); }).join('\n');
  }

  let watch = null;

  /* Bound to root: a browser's window.setInterval called detached
   * (const f = window.setInterval; f(...)) throws "Illegal invocation", which
   * Node does not, so a node test cannot catch an unbound call. */
  function watchTimers() {
    const si = typeof root.setInterval === 'function' ? root.setInterval : (typeof setInterval === 'function' ? setInterval : null);
    const ci = typeof root.clearInterval === 'function' ? root.clearInterval : (typeof clearInterval === 'function' ? clearInterval : null);
    return {
      si: si ? function (fn, ms) { return si.call(root, fn, ms); } : null,
      ci: ci ? function (id) { return ci.call(root, id); } : null
    };
  }

  /* The game is healthy: the mark goes for good this session. */
  function bootHealthy() {
    const w = watch;
    if (!w || w.done) return;
    w.done = true;
    clearWatchMark();
    const t = watchTimers();
    if (w.timer !== null && t.ci) t.ci(w.timer);
    try {
      if (root.removeEventListener) {
        root.removeEventListener('pagehide', w.away);
        root.removeEventListener('pageshow', w.back);
      }
      if (root.document && root.document.removeEventListener) root.document.removeEventListener('visibilitychange', w.vis);
    } catch (_) { /* nothing to undo */ }
    if (root._acwebModsHealthy === engineHealthy) root._acwebModsHealthy = undefined;
  }

  /* The engine's signal (the game engine, once a session): the player has
   * been in the game world long enough to call the boot healthy. */
  function engineHealthy() {
    if (!watch || watch.done) return;
    watch.by = 'engine';
    bootHealthy();
  }

  function armWatchdog(set, mods, n) {
    const now = Date.now();
    const mark = {
      v: 1, set: set, n: n, at: now, alive: now,
      ids: mods.map(function (m) { return m.id; }),
      names: mods.map(function (m) { return String((m.manifest && m.manifest.name) || m.id).slice(0, 60); })
    };
    const w = { mark: mark, done: false, away: null, back: null, vis: null, timer: null, armed: true };
    watch = w;
    writeWatchMark(mark);
    const put = function () { if (w.done) return; w.armed = true; mark.alive = Date.now(); writeWatchMark(mark); };
    const take = function () { if (w.done) return; w.armed = false; clearWatchMark(); };
    w.away = take;
    w.back = put;
    w.vis = function () {
      try { if (root.document.visibilityState === 'hidden') take(); else put(); } catch (_) { /* leave it */ }
    };
    try {
      if (root.addEventListener) {
        root.addEventListener('pagehide', w.away);
        root.addEventListener('pageshow', w.back);
      }
      if (root.document && root.document.addEventListener) root.document.addEventListener('visibilitychange', w.vis);
    } catch (_) { /* no events: the heartbeat alone */ }
    const t = watchTimers();
    /* Third review: the five minutes count only time the game really ran in a
     * visible page: boot runs in preRun, before the click to start, and a
     * hidden tab runs nothing worth calling healthy. A beat counts when the
     * mark is up (visible) and the engine's main() has started
     * (Module.calledRun); its share is the real time since the last beat,
     * at most two beats' worth (a throttled or suspended timer). */
    w.ran = 0;
    w.last = now;
    const running = function () {
      const m = root.Module;
      return !m || typeof m !== 'object' || m.calledRun === true;
    };
    if (t.si) {
      w.timer = t.si(function () {
        if (w.done) return;
        const at = Date.now();
        const step = Math.min(Math.max(0, at - w.last), 2 * WATCH_BEAT_MS);
        w.last = at;
        if (w.armed && running()) w.ran += step;
        if (w.ran >= WATCH_MAX_MS) { w.by = 'time'; bootHealthy(); return; }
        if (w.armed) put();
      }, WATCH_BEAT_MS);
    }
    root._acwebModsHealthy = engineHealthy;
  }

  /* What the watchdog did this session, for the tests and a probe: null when
   * nothing was watched, else { done, by: 'engine' | 'time' | null }. */
  function watchState() {
    return watch ? { done: !!watch.done, by: watch.by || null } : null;
  }

  /* Unpack every enabled mod into MEMFS and write /mods/index.json. Never
   * rejects: a mod that will not read or write is skipped (its folder removed)
   * and listed in state.skipped, and the rest still load. _acwebModsState is
   * published only when done ({ ready: true, mods, modset, skipped, safeMode,
   * watchdog? }); until then it is undefined, which readers treat as unknown. */
  async function bootLoad(FS) {
    const state = { ready: false, mods: [], modset: '', modlist: [], skipped: [], safeMode: false, removed: [] };
    if (consumeSkip()) {
      clearWatchMark(); /* the player chose this start; their next one is a fresh try */
      state.safeMode = true;
      console.log('[Mods] safe mode: starting without mods');
      return publish(state);
    }
    /* a friend's mods lent to this tab for one visit. Their ZIPs are
     * only fetched when the mark is good. Lent databases past their time (a
     * closed tab, an ended visit) are dropped; never another tab's live one. */
    const lent = lentState();
    let sweepDue = false;
    try { sweepDue = !!lent || lentDbNames().length > 0 || root.localStorage.getItem(LENT_DB_KEY) === '1'; } catch (_) { sweepDue = !!lent; }
    if (sweepDue) sweepLentDbs(lent ? lent.db : null).catch(function () { /* next boot tries again */ });
    if (lent) state.lent = { visitId: lent.visitId, modset: lent.modset, kind: lent.kind || 'visit', mods: lent.set.map(function (m) { return m.id; }) };
    if (!flagOn() && !lent && !devTainted()) { /* a dev mod alone still boots */
      clearWatchMark();
      rememberModset('', []);
      /* the last mod was removed with its data: the engine still has
       * to delete that data, so it still gets an index.json to read. The
       * request is cleared only once the engine reports it done and a sync
       * has carried that to IndexedDB (wipeDone). */
      const wipe = pendingWipe();
      if (wipe.length) {
        try {
          mkdirs(FS, MODS_DIR);
          FS.writeFile(MODS_DIR + '/index.json', JSON.stringify({ schema: 1, modset: '', mods: [], wipe: wipe }));
          wipeAwaiting = wipe;
        } catch (e) { console.warn('[Mods] could not hand the data cleanup to the game:', e); }
      }
      return publish(state);
    }
    const index = [];
    let written = false;
    let set = '';
    let prevBoots = 0;
    if (devOn()) state.modLang = modLangInUrl() || undefined;
    /* Each entry of state.mods and state.skipped carries its row's source
     * ('file' or 'registry:<version id>'): analytics only name registry mods. */
    const sources = new Map();
    const tagSources = function () {
      for (const e of state.mods.concat(state.skipped)) {
        if (e && e.source === undefined && sources.has(e.id)) e.source = sources.get(e.id);
      }
    };
    /* Third review: what boot's own rules refused, recorded on the row (bootRefused). */
    const bootFails = {};
    const bootFine = [];
    const sizes = new Map(); /* id -> unpacked, of what this boot unpacked */
    let wipeHanded = [];
    try {
      const own = flagOn(); /* false on a lent boot of a player with no mods of their own */
      let rows = [];
      if (own) {
        const db = await openDb();
        try {
          rows = await bootRows(db); /* no ZIPs: each is read on its own below */
        } finally { db.close(); }
      }
      for (const r of rows) sources.set(r.id, typeof r.source === 'string' ? r.source : 'file');
      if (own && !rows.length) {
        if (noteIfCleared()) {
          state.cleared = true;
          console.warn('[Mods] the browser cleared the mods database; the Mods tab says so once');
        }
        clearFlag();
      }
      /* The lent rows are read BEFORE the status check, so the kill switch and
       * the moderators' removals cover them too, for a player with no mods of
       * their own as well (third review). A lent set that cannot be read is
       * this boot's lentError, never a failed boot: the player's own mods
       * that stay on still load. */
      let lentList = [];
      if (lent) {
        try { lentList = await lentRows(lent); } catch (e) {
          state.lentError = (e && e.message) || String(e);
          console.warn('[Mods] the lent set could not be read:', e);
        }
      }
      /* removed mods go off before the engine starts. Fails open. A
       * lent row is asked about by id and version as well (it is a registry
       * version), under its own key so it never touches an installed row. */
      const lentQuery = lentList.map(function (r) {
        return { id: 'lent:' + r.id, modId: r.id, lent: true, contentSha: r.contentSha, manifest: r.manifest };
      });
      if (rows.length || lentQuery.length) {
        const answers = await checkStatus(rows.concat(lentQuery));
        if (answers && rows.length && applyStatus(rows, answers, Date.now()).length) {
          try { await storeStatus(answers, Date.now()); } catch (e) { console.warn('[Mods] could not store the mod check:', e); }
        }
        for (const r of rows) if (r.removed) state.removed.push({ id: r.id, reason: r.removed.reason, code: r.removed.code || '' });
        if (answers) {
          lentList = lentList.filter(function (r) {
            const a = answers['lent:' + r.id];
            if (!a || a.status !== 'removed') return true;
            const code = typeof a.reason_code === 'string' && /^[a-z_]{1,40}$/.test(a.reason_code) ? a.reason_code : '';
            state.removed.push({ id: r.id, reason: typeof a.reason === 'string' ? a.reason.slice(0, 500) : '', code: code, lent: true });
            return false;
          });
        }
        /* the kill switch. Nothing loads this boot, lent mods included;
         * every mod stays installed, as it was, and comes back once the
         * switch is off. */
        if (statusKill) {
          state.killSwitch = killNow(); /* { message, remembered } */
          console.warn('[Mods] mods are switched off for everyone: ' + statusKill.message);
          rows = [];
          lentList = [];
        }
      }
      if (lent && lent.kind === 'city') {
        /* The City runs exactly the curated set; every mod of the
         * player's own stays off for this trip only. */
        rows = lentList;
      } else if (lent) {
        /* The visit runs the host's set: the player's own mods that count for
         * visits (and any with a lent id) stay off for this boot only. */
        const lentIds = lent.set.map(function (m) { return m.id; });
        rows = rows.filter(function (r) {
          return lentIds.indexOf(r.id) < 0 && !(r.enabled && r.manifest && countsForVisits(r.manifest));
        }).concat(lentList);
      }
      const cap = enabledCap();
      /* a developer-mode mod joins the plan as a row of its own,
       * so it satisfies an installed mod's depends and loads in dependency
       * order (a library before the mods that need it; otherwise last, where
       * it wins). It replaces an installed mod of the same id for this
       * session. Never while the kill switch is on, never on a lent boot. */
      const dev = !statusKill && !lent ? await devPlanRow(state) : null;
      let devGaveWay = null; /* the installed mod the copy replaces, and where it stood */
      if (dev) {
        const was = rows.findIndex(function (r) { return r.id === dev.row.id; });
        if (was >= 0) {
          dev.row.settings = isObj(rows[was].settings) ? rows[was].settings : {};
          devGaveWay = { at: was, row: rows[was] };
          rows.splice(was, 1);
          state.devReplaced = dev.row.id;
        }
        rows.push(dev.row);
      }
      /* A mod for an api level this game no longer (or does not yet) read says
       * so on its row, before its bytes are read by rules it was not made for,
       * and takes no room under the caps. It counts as not loading for the mods
       * that depend on it, which then say why. */
      const readable = apiFilter(rows);
      state.skipped = state.skipped.concat(readable.skipped);
      const unreadable = new Set(readable.skipped.map(function (s) { return s.id; }));
      for (const r of rows) if (unreadable.has(r.id)) r.cannotLoad = true;
      let plan = loadPlan(rows, cap);
      if (dev && devGaveWay && !plan.load.some(function (r) { return r.dev; })) {
        /* Third review: a copy that does not fit (or whose depends fail) leaves
         * the installed mod it would replace running, as it was. */
        const devSkips = plan.skip.filter(function (k) { return k.id === dev.row.id; });
        rows = rows.filter(function (r) { return !r.dev; });
        rows.splice(devGaveWay.at, 0, devGaveWay.row);
        delete state.devReplaced;
        plan = loadPlan(rows, cap);
        plan.skip = devSkips.concat(plan.skip);
      }
      const plannedRows = plan.load.slice(); /* what did not make it takes its dependents along */
      rows = null;
      state.skipped = state.skipped.concat(plan.skip.map(function (k) {
        return dev && k.id === dev.row.id ? { id: k.id, error: 'developer copy: ' + k.error, dev: true } : k;
      }));
      /* The watchdog: did the last boot with this very set stop responding? */
      set = watchSet(plan.load.filter(function (r) { return !r.dev; })); /* a dev copy is not watched, as */
      const verdict = watchdogVerdict(readWatchMark(), set, Date.now());
      if (verdict.trip) {
        clearWatchMark();
        state.safeMode = true;
        state.watchdog = { ids: verdict.ids, names: verdict.names };
        console.warn('[Mods] the last start with these mods stopped responding; starting without mods: ' + verdict.ids.join(', '));
        tagSources();
        return publish(state);
      }
      prevBoots = verdict.n;
      mkdirs(FS, MOD_ROOT);
      let total = 0;
      for (let k = 0; k < plan.load.length; k++) {
        const planned = plan.load[k];
        plan.load[k] = null;
        if (planned.dev) {
          if (dev && devUnpack(FS, state, index, dev, total, cap)) {
            total += dev.mod.unpacked;
            sizes.set(dev.row.id, dev.mod.unpacked);
            state.mods.push({ id: dev.row.id, manifest: dev.mod.manifest, contentSha: await contentSha(dev.mod.entries),
                              enabled: true, dev: true, settings: dev.row.settings || {} });
          }
          continue;
        }
        let mod;
        let r;
        try {
          /* One ZIP in memory at a time: read, unpack, then dropped.
           * fflate copies every entry out of it and MEMFS owns those copies
           * (canOwn), so nothing below keeps the ZIP alive. */
          const row = await readRow(planned.id, planned.lent ? lent.db : DB_NAME);
          if (!row || !row.zip) throw ruleError('the stored mod is gone');
          let zip = row.zip;
          r = metaOf(row);
          if (planned.lent) r.lent = true; /* from the lend's database, for this visit only */
          if (typeof r.source === 'string') sources.set(r.id, r.source);
          /* Another tab switched it off (or the moderators did) since the list
           * was read: it does not load, and the Mods tab shows it off. */
          if (!r.enabled) continue;
          const apiWhy = r.manifest ? apiSkip(r.manifest) : null;
          if (apiWhy) { state.skipped.push({ id: r.id, error: apiWhy.error, api: apiWhy.api }); continue; }
          try {
            mod = readMod(new Uint8Array(zip), root.fflate, { trusted: true });
            zip = null;
            if (mod.manifest.id !== r.id) throw ruleError('the stored mod does not match its id');
          } catch (e) {
            /* The stored bytes fail this build's rules: the next boot will
             * refuse them too, so the Mods tab's set must leave them out
             * (bootRefused). Not a lent row: those are never stored as own. */
            if (!r.lent && typeof r.sha256 === 'string') bootFails[r.id] = { sha256: r.sha256, error: (e && e.message) || String(e) };
            throw e;
          }
          if (!r.lent && r.bootFail) bootFine.push(r.id);
          if (total + mod.unpacked > cap) throw ruleError(fillWords(cap, mod.unpacked));
        } catch (e) {
          state.skipped.push({ id: planned.id, error: (e && e.message) || String(e) });
          continue;
        }
        const dir = MOD_ROOT + '/' + r.id;
        try {
          rmrf(FS, dir);
          FS.mkdir(dir);
          for (const name of mod.names) {
            const full = dir + '/' + name;
            mkdirs(FS, full.slice(0, full.lastIndexOf('/')));
            FS.writeFile(full, mod.entries[name], { canOwn: true });
          }
        } catch (e) {
          rmrf(FS, dir);
          state.skipped.push({ id: r.id, error: 'could not be unpacked (' + ((e && e.message) || e) + ')' });
          continue;
        }
        total += mod.unpacked;
        sizes.set(r.id, mod.unpacked);
        /* Manifest and hashes from the record that held these bytes (
         * review: a tab that replaced the mod after the list was read). */
        const csha = r.contentSha || await contentSha(mod.entries);
        const entry = { id: r.id, version: mod.manifest.version, scope: mod.manifest.scope, dir: dir,
                        settings: effectiveSettings(mod.manifest, r.settings) };
        if (r.lent) entry.temp_store = true; /* pc_mod_lua keeps its store out of the save */
        index.push(entry);
        state.mods.push({ id: r.id, manifest: mod.manifest, sha256: r.sha256, contentSha: csha, enabled: true,
          source: r.lent ? 'lent:' + lent.visitId : (typeof r.source === 'string' ? r.source : 'file'), lent: !!r.lent,
          settings: r.settings || {} });
      }
      /* a planned mod that did not unpack (or was switched off since)
       * takes the mods that need it along. */
      const loadedIds = new Set(state.mods.map(function (m) { return m.id; }));
      const failed = plannedRows.filter(function (p) { return p && !loadedIds.has(p.id); })
        .map(function (p) { return { id: p.id, enabled: true, cannotLoad: true, manifest: p.manifest }; });
      const after = resolveLoad(state.mods.concat(failed));
      if (after.skip.length) {
        const gone = new Set(after.skip.map(function (x) { return x.id; }));
        state.skipped = state.skipped.concat(after.skip);
        for (const id of gone) rmrf(FS, MOD_ROOT + '/' + id);
        state.mods = state.mods.filter(function (m) { return !gone.has(m.id); });
        for (let k = index.length - 1; k >= 0; k--) if (gone.has(index[k].id)) index.splice(k, 1);
      }
      state.modset = state.dev ? devMarker() : await modsetHash(state.mods);
      /* mp review #6: a developer-mode set is the marker alone. A list beside
       * it would not hash to it, and the backend refused the whole answer
       * (400) instead of refusing the visit. */
      state.modlist = state.dev ? [] : await modsetList(state.mods);
      if (lent && lent.kind !== 'city' && state.modset !== lent.modset && !state.lentError) {
        /* A lent mod was skipped (a cap, a bad ZIP): the visit would run a set
         * that is neither the host's nor the player's. Say so; the page checks
         * the running set against the host's before the visit goes on. */
        state.lentError = 'the friend\'s mods did not all load';
        console.warn('[Mods] lent set did not load whole: running ' + state.modset + ', the host runs ' + lent.modset);
      }
    } catch (e) {
      /* The database or the hash failed: start with what is safe to claim. If
       * the modset cannot be computed, no world mod may run (a visit would be
       * compared against the wrong set), so nothing loads. */
      console.warn('[Mods] boot load failed; starting without mods:', e);
      for (const m of state.mods) state.skipped.push({ id: m.id, error: 'the mod list could not be finished: ' + ((e && e.message) || e) });
      state.mods = [];
      state.modset = '';
      state.modlist = [];
      index.length = 0;
      state.error = (e && e.message) || String(e);
    } finally {
      if (!state.watchdog) {
        try {
          mkdirs(FS, MODS_DIR);
          const wipe = pendingWipe();
          const doc = { schema: 1, modset: state.modset, mods: index };
          if (wipe.length) doc.wipe = wipe;
          if (state.modLang) doc.lang = state.modLang;
          FS.writeFile(MODS_DIR + '/index.json', JSON.stringify(doc));
          written = true;
          /* Saves review #10: NOT cleared here. The engine has deleted
           * nothing yet and no sync has carried it to IndexedDB; a boot that
           * dies before main, or a tab closed in the next half minute, would
           * lose the request. wipeDone clears it (the engine's signal, then a
           * sync that landed). */
          wipeHanded = wipe;
        } catch (e) {
          console.warn('[Mods] could not write /mods/index.json; starting without mods:', e);
          for (const m of state.mods) state.skipped.push({ id: m.id, error: 'the mod list could not be written' });
          state.mods = [];
          state.modset = '';
          state.modlist = [];
        }
      }
    }
    /* index.json is written, so the engine WILL run state.mods. Every
     * step after it used to sit outside any try, and bootLoad "never rejects"
     * only by convention: a throw here rejected it with the truth unpublished
     * (shell.html's preRun then waited on a 'mods' run dependency that never
     * cleared). Each step is tried on its own; a failure is recorded in
     * state.afterErrors and the rest still run, then the state is published. */
    const after = async function (what, fn) {
      try { await fn(); } catch (e) {
        const msg = what + ': ' + ((e && e.message) || e);
        console.warn('[Mods] after the mod list was written, ' + msg);
        (state.afterErrors = state.afterErrors || []).push(msg);
      }
    };
    /* Only after index.json is written: this is the set the engine will run.
     * not for a lent boot: acweb.modset is the player's OWN next set. */
    await after('remembering the mod set', function () { if (written && !lent) rememberModset(state.modset, state.modlist); });
    if (written) wipeAwaiting = wipeHanded;
    /* Third review: what this boot's rules refused stays refused in the Mods
     * tab's set (bootRefused); a mark this boot read fine goes. */
    if (Object.keys(bootFails).length || bootFine.length) {
      await after('recording what did not load', function () { return storeBootFails(bootFails, bootFine); });
    }
    /* Mods the engine will run: watch this boot until the game is healthy. */
    await after('arming the boot watchdog', function () {
      if (written && state.mods.length && set) armWatchdog(set, state.mods, prevBoots + 1);
      else clearWatchMark();
    });
    await after('naming sources', tagSources);
    await after('the boot log', function () {
      console.log('[Mods] ' + state.mods.length + ' mod(s) unpacked' + (state.skipped.length ? ', ' + state.skipped.length + ' skipped' : ''));
      logBoot(state); /* the Mods tab's log says what did not load */
    });
    try {
      return publish(state);
    } catch (e) {
      console.warn('[Mods] the boot state could not be finished:', e);
      state.ready = true;
      root._acwebModsState = state;
      return state;
    }
  }

  /* ── the mod log ──
   *
   * What each mod said and what went wrong, for the Mods tab: the engine hands
   * every line over as it is written (the game engine's EM_JS calls
   * _acwebModLogPush), and this file adds its own (a mod that did not load, a
   * developer-mode file it refused). The tab reads it with log(since), a plain
   * JS call: no ccall, so it can be read at any moment, mid-boot included.
   * Lines are data: shown as text, never as HTML. */
  const LOG_MAX = 400;
  const LOG_TEXT_MAX = 2000;
  const LOG_KINDS = ['log', 'error', 'stop', 'refused', 'info'];
  const modLog = { lines: [], seq: 0, dropped: 0 };

  function logPush(kind, id, text) {
    modLog.seq++;
    modLog.lines.push({ seq: modLog.seq, kind: kind, id: String(id || ''), text: String(text || '').slice(0, LOG_TEXT_MAX), at: Date.now() });
    if (modLog.lines.length > LOG_MAX) { modLog.lines.shift(); modLog.dropped++; }
  }

  root._acwebModLogPush = function (seq, kind, id, text) {
    logPush(LOG_KINDS[kind] || 'info', id, text);
  };

  /* Lines after `since` (a seq this returned before; 0 for all it still has). */
  function readLog(since) {
    const s = Number(since) || 0;
    return { lines: modLog.lines.filter(function (l) { return l.seq > s; }), next: modLog.seq, dropped: modLog.dropped };
  }

  function logBoot(state) {
    for (const k of state.skipped || []) logPush('refused', k.id, 'did not load: ' + k.error);
    for (const r of state.removed || []) logPush('refused', r.id, 'switched off: ' + removedWords(r.reason));
    if (state.dev) logPush('info', state.dev.id, 'loaded in developer mode from ' + state.dev.source.label);
    if (state.modLang) logPush('info', '', 'developer mode: mod lines in "' + state.modLang + '" (?modlang=' + state.modLang + ')');
  }

  /* ── developer mode ──
   *
   * With ?moddev=1 (the page keeps it in localStorage acweb.moddev) a modder
   * loads a mod from a folder or from `playac-mod dev` on localhost, without
   * installing it. The PAGE reads the files (the game frame may only fetch its
   * own folder) and hands them here as { path: bytes }:
   *
   *   devLoad(files, source)  checks them by the install rules and stores them in
   *                           IndexedDB 'acweb-mods-dev'; the next boot loads the
   *                           mod LAST in load order (it wins), marked "dev" in
   *                           index.json, unless an installed mod depends on it:
   *                           it is a row of the load plan, so it then
   *                           loads before that mod. ONE dev folder at a time.
   *                           A restart, like any mod change.
   *   devApply(files)         the folder changed: writes what changed over the
   *                           running mod's MEMFS folder and asks the engine to
   *                           reload it, in tiers (the game engine): lines and shops,
   *                           the items file, the Lua script, textures.
   *                           mod.json changed, or a
   *                           different mod id: "restart needed", nothing applied.
   *   devUnload()             forgets it; the next boot runs without it.
   *
   * A stored dev mod TAINTS the mod set: the set a visit compares is a random
   * marker that never matches any other (devMarker), so the backend refuses
   * every visit, and the page says why before it asks (devTainted). It is not
   * an installed mod: it never shows in list(), and only this browser has it. */
  const DEV_DB = 'acweb-mods-dev';
  const DEV_FLAG = 'acweb.moddev';         /* the page's ?moddev=1 (texinspect.ts MODDEV_KEY) */
  const DEV_STORED = 'acweb.mods.dev';     /* '1' while a dev mod is stored */
  const DEV_DATA = 1, DEV_LUA = 2, DEV_TEXTURES = 4;
  const DEV_ITEMS = 8;                     /* the items file, read again with the data tier */
  let devCurrent = null;                   /* the dev mod this boot runs: { id, manifest, entries, dir } */
  let devPending = 0;                      /* reload tiers waiting for the engine */
  let devTimer = null;
  let devMarkerValue = null;

  function lsGet(k) { try { return root.localStorage.getItem(k); } catch (_) { return null; } }
  function lsSet(k, v) { try { if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v); } catch (_) { /* best effort */ } }

  function devOn() { return lsGet(DEV_FLAG) === '1'; }
  /* A dev mod is stored and developer mode is on: the next boot runs it. */
  function devTainted() { return devOn() && lsGet(DEV_STORED) === '1'; }

  /* 64 hex digits no other town can have: the wire form of a mod set (so the
   * page cannot mistake it for "no world mods") that matches nothing. One per
   * page load. */
  function devMarker() {
    if (!devMarkerValue) {
      const b = new Uint8Array(32);
      root.crypto.getRandomValues(b);
      devMarkerValue = hex(b.buffer);
    }
    return devMarkerValue;
  }

  function devDb() {
    return new Promise(function (resolve, reject) {
      let req;
      try { req = idb().open(DEV_DB, 1); } catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains('dev')) req.result.createObjectStore('dev', { keyPath: 'key' });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onblocked = function () { reject(new Error('the developer mods database is held open by another tab')); };
    });
  }

  function devTx(mode, fn) {
    return devDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        let t;
        try { t = db.transaction('dev', mode); } catch (e) { db.close(); reject(e); return; }
        let out;
        t.oncomplete = function () { db.close(); resolve(out); };
        t.onabort = function () { db.close(); reject(t.error || new Error('the developer mods database could not be used')); };
        t.onerror = function () { /* onabort follows */ };
        const req = fn(t.objectStore('dev'));
        if (req) req.onsuccess = function () { out = req.result; };
      });
    });
  }
  function devGet() { return devTx('readonly', function (s) { return s.get('current'); }); }
  function devPut(row) { return devTx('readwrite', function (s) { return s.put(row); }); }
  function devDel() { return devTx('readwrite', function (s) { return s.delete('current'); }); }

  /* { path: bytes } from the page, copied into this realm (a page Uint8Array is
   * not an instanceof here) and checked by the install rules. Throws the reasons. */
  function devRead(files) {
    if (!files || typeof files !== 'object') throw ruleError('no files');
    const raw = {};
    let count = 0;
    for (const k of Object.keys(files)) {
      const v = files[k];
      if (++count > MAX_FILES) throw ruleError('more than ' + MAX_FILES + ' files');
      if (v && ArrayBuffer.isView(v)) raw[k] = new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength));
      else if (Object.prototype.toString.call(v) === '[object ArrayBuffer]') raw[k] = new Uint8Array(v.slice(0));
      else throw ruleError(JSON.stringify(k) + ' is not file bytes');
    }
    return readEntries(raw);
  }

  function cleanSource(s) {
    const kind = s && (s.kind === 'url' || s.kind === 'folder') ? s.kind : 'folder';
    const label = String((s && s.label) || (kind === 'url' ? 'a local server' : 'a folder')).slice(0, 200);
    const out = { kind: kind, label: label };
    if (kind === 'url' && typeof s.url === 'string') out.url = s.url.slice(0, 200);
    return out;
  }

  async function devLoad(files, source) {
    const mod = devRead(files);
    await devPut({ key: 'current', id: mod.manifest.id, manifest: mod.manifest, files: mod.entries,
                   unpacked: mod.unpacked, source: cleanSource(source), loadedAt: Date.now() });
    lsSet(DEV_STORED, '1');
    rememberModset('', []);
    return { id: mod.manifest.id, name: mod.manifest.name, restart: true };
  }

  async function devUnload() {
    await devDel();
    lsSet(DEV_STORED, null);
    devMarkerValue = null;
    try {
      if (flagOn()) { const db = await openDb(); try { await refreshModset(db); } finally { db.close(); } }
      else rememberModset('', []);
    } catch (e) { console.warn('[Mods] could not recompute the mod set:', e); }
    return { restart: !!devCurrent };
  }

  /* What developer mode has: the stored mod (what the next boot loads) and the
   * one this boot runs. */
  async function devState() {
    let row = null;
    try { row = await devGet(); } catch (_) { row = null; }
    return {
      on: devOn(),
      stored: row ? { id: row.id, name: row.manifest && row.manifest.name, version: row.manifest && row.manifest.version,
                      source: row.source, loadedAt: row.loadedAt } : null,
      running: devCurrent ? { id: devCurrent.id, name: devCurrent.manifest.name, version: devCurrent.manifest.version,
                              dir: devCurrent.dir, pending: devPending } : null
    };
  }

  /* Boot, before the load plan: the stored dev mod as a row the plan
   * orders with the installed ones ({ row, mod }), or null. Never throws: a dev
   * mod that will not read is skipped with its reason, the rest boot. A dev mod
   * is ONE folder at a time: to work on a library and a mod that needs it,
   * install one (its packed ZIP) and load the other here; either way round the
   * depends resolve. */
  async function devPlanRow(state) {
    if (!devOn()) return null;
    let row;
    try { row = await devGet(); } catch (e) { console.warn('[Mods] developer mods database:', e); return null; }
    if (!row) { lsSet(DEV_STORED, null); return null; }
    lsSet(DEV_STORED, '1');
    let mod;
    try {
      mod = readEntries(row.files);
      if (mod.manifest.id !== row.id) throw ruleError('the stored mod does not match its id');
    } catch (e) {
      state.skipped.push({ id: row.id, error: 'developer copy: ' + ((e && e.message) || e), dev: true });
      return null;
    }
    return { mod: mod, source: row.source || { kind: 'folder', label: 'a folder' },
             row: { id: mod.manifest.id, enabled: true, dev: true, manifest: mod.manifest, unpacked: mod.unpacked, settings: {} } };
  }

  /* The planned dev mod into MEMFS and index.json, at its place in the order.
   * false (skipped, with its reason) when it does not fit or unpack; the mods
   * that need it then drop out (boot's second resolveLoad). Third review: the
   * copy runs with the settings of the installed mod it replaces (or every
   * default), like any installed mod. */
  function devUnpack(FS, state, index, dev, total, cap) {
    const id = dev.row.id;
    const mod = dev.mod;
    if (total + mod.unpacked > cap) {
      state.skipped.push({ id: id, error: 'developer copy: ' + fillWords(cap, mod.unpacked), dev: true });
      return false;
    }
    const dir = MOD_ROOT + '/' + id;
    try {
      rmrf(FS, dir);
      FS.mkdir(dir);
      for (const name of mod.names) {
        const full = dir + '/' + name;
        mkdirs(FS, full.slice(0, full.lastIndexOf('/')));
        FS.writeFile(full, mod.entries[name], { canOwn: true });
      }
    } catch (e) {
      rmrf(FS, dir);
      state.skipped.push({ id: id, error: 'developer copy: could not be unpacked (' + ((e && e.message) || e) + ')', dev: true });
      return false;
    }
    index.push({ id: id, version: mod.manifest.version, scope: mod.manifest.scope, dir: dir, dev: true,
                 settings: effectiveSettings(mod.manifest, dev.row.settings || {}) });
    state.dev = { id: id, name: mod.manifest.name, source: dev.source };
    devCurrent = { id: id, manifest: mod.manifest, entries: mod.entries, dir: dir, FS: FS };
    return true;
  }

  function sameBytes(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  /* Which tiers a set of changed paths needs, by the RUNNING manifest. The
   * data tier (pc_mod_reload_data) reads again the messages (one file or a
   * folder of languages), shops, letters, events and talk files. The
   * items file reloads too (DEV_ITEMS): the engine reads it before the
   * shops, keeps the save and its sidecar as they are, and says in the mod log
   * what does not change in the running game (pieces already placed keep their
   * base; a new id for a removed item's pieces is a mod.json "renames" entry,
   * which needs a restart). */
  function devTiers(paths, manifest) {
    const c = (manifest && manifest.content) || {};
    const tex = typeof c.textures === 'string' ? c.textures.replace(/\/+$/, '') + '/' : null;
    const msgDir = typeof c.messages === 'string' && c.messages ? c.messages.replace(/\/+$/, '') + '/' : null;
    let what = 0;
    for (const p of paths) {
      if (p === c.items) what |= DEV_ITEMS;
      else if (p === c.messages || p === c.shops || p === c.letters || p === c.events || p === c.talk ||
               (msgDir && p.startsWith(msgDir))) what |= DEV_DATA;
      else if (lowerExt(p) === '.lua') what |= DEV_LUA;
      else if (tex && p.startsWith(tex)) what |= DEV_TEXTURES;
    }
    return what;
  }

  function devEngine() {
    const m = root.Module;
    if (!m || !m.calledRun || !m.HEAP32 || typeof m.ccall !== 'function') return null;
    if (typeof m._pc_mod_dev_reload !== 'function') return null;
    const at = m._g_pc_scene_ready;
    if (typeof at === 'number' && m.HEAP32[at >> 2] !== 1) return null;
    return m;
  }

  /* One ccall for every tier waiting, at the frame yield of a live scene
   * (g_pc_scene_ready; see the asyncify note in the mods skill), else a retry
   * in half a second. Never per frame: only when the modder saved something. */
  function devFlush() {
    devTimer = null;
    if (!devPending || !devCurrent) return null;
    const m = devEngine();
    if (!m) { devTimer = root.setTimeout(devFlush, 500); return null; }
    const what = devPending;
    devPending = 0;
    let out;
    try { out = JSON.parse(m.ccall('pc_mod_dev_reload', 'string', ['string', 'number'], [devCurrent.id, what])); } catch (e) {
      out = { ok: 0, why: (e && e.message) || String(e) };
    }
    if (!out.ok) logPush('refused', devCurrent.id, 'reload refused: ' + out.why);
    return out;
  }

  /* The folder changed: files is the WHOLE mod as it is now ({ path: bytes }). */
  async function devApply(files) {
    if (!devCurrent) return { ok: false, why: 'no developer-mode mod is running in this session' };
    let mod;
    try { mod = devRead(files); } catch (e) {
      const why = (e && e.message) || String(e);
      logPush('refused', devCurrent.id, 'not reloaded: ' + why);
      return { ok: false, why: why };
    }
    const old = devCurrent.entries;
    const changed = [];
    for (const n of mod.names) if (!sameBytes(old[n], mod.entries[n])) changed.push(n);
    for (const n of Object.keys(old)) if (!(n in mod.entries)) changed.push(n);
    if (!changed.length) return { ok: true, changed: [], tiers: [] };
    /* The next restart boots what is here now. */
    try {
      await devPut({ key: 'current', id: mod.manifest.id, manifest: mod.manifest, files: mod.entries,
                     unpacked: mod.unpacked, source: (await devGet() || {}).source || cleanSource(null), loadedAt: Date.now() });
    } catch (e) { console.warn('[Mods] could not store the developer copy:', e); }
    if (mod.manifest.id !== devCurrent.id || changed.indexOf('mod.json') >= 0) {
      const why = mod.manifest.id !== devCurrent.id ? 'the mod id changed' : 'mod.json changed';
      logPush('info', devCurrent.id, why + ': restart the game to load it');
      return { ok: true, changed: changed, tiers: [], restart: true, why: why };
    }
    const what = devTiers(changed, devCurrent.manifest);
    const FS = devCurrent.FS;
    try {
      for (const n of changed) {
        const full = devCurrent.dir + '/' + n;
        if (n in mod.entries) {
          mkdirs(FS, full.slice(0, full.lastIndexOf('/')));
          FS.writeFile(full, mod.entries[n], { canOwn: true });
        } else {
          try { FS.unlink(full); } catch (_) { /* already gone */ }
        }
      }
    } catch (e) {
      const why = 'could not write the files (' + ((e && e.message) || e) + '): restart the game';
      logPush('refused', devCurrent.id, why);
      return { ok: false, why: why, restart: true };
    }
    devCurrent.entries = mod.entries;
    const tiers = [];
    if (what & DEV_DATA) tiers.push('data');
    if (what & DEV_ITEMS) tiers.push('items');
    if (what & DEV_LUA) tiers.push('script');
    if (what & DEV_TEXTURES) tiers.push('textures');
    if (!what) return { ok: true, changed: changed, tiers: tiers };
    devPending |= what;
    if (devTimer) { root.clearTimeout(devTimer); devTimer = null; }
    const out = devFlush();
    return { ok: true, changed: changed, tiers: tiers, pending: !out, result: out };
  }

  const api = {
    validateManifest: validateManifest, validateShops: validateShops, validateMessages: validateMessages,
    validateLetters: validateLetters, validateEvents: validateEvents, validateTalk: validateTalk, letterIds: letterIds,
    validateItems: validateItems,
    normalizeEntries: normalizeEntries, parseJsonStrict: parseJsonStrict, readMod: readMod,
    /* playac-mod check runs these instead of keeping copies */
    contentProblems: contentProblems, messageFiles: messageFiles, isJunk: isJunk, EXTS: EXTS.slice(), LETTER_SENDER_MAX: LETTER_SENDER_MAX,
    contentSha: contentSha, modsetHash: modsetHash, modsetList: modsetList, countsForVisits: countsForVisits,
    VANILLA_OUTPUT_COMMANDS: VANILLA_OUTPUT_COMMANDS, planLoad: planLoad,
    list: list, install: install, remove: remove, setEnabled: setEnabled, move: move, setOrder: setOrder,
    skipNextBoot: skipNextBoot, bootLoad: bootLoad, HOOKS: HOOKS, HOOKS_V2: HOOKS_V2, PERMISSIONS: PERMISSIONS, LIMITS: LIMITS,
    API_MIN: API_MIN, API_MAX: API_MAX, UNBUILT_KEYS: UNBUILT_KEYS, apiStatus: apiStatus, TAGS: TAGS,
    lowMemoryDevice: lowMemoryDevice, enabledCap: enabledCap, takeClearedNotice: takeClearedNotice,
    checkStatus: checkStatus, refreshStatus: refreshStatus,
    /* api level 2 () */
    LANGS: LANGS, HOOKS_V2: HOOKS_V2, setSetting: setSetting, exportAll: exportAll,
    effectiveSettings: effectiveSettings, settingValueOk: settingValueOk, settingsSha: settingsSha,
    resolveLoad: resolveLoad, parseRange: parseRange, inRange: inRange, compareVersions: compareVersions,
    pendingWipe: pendingWipe,
    savedData: savedData, deleteSavedData: deleteSavedData,
    lend: lend, clearLent: clearLent, lentState: lentState, lendRoom: lendRoom, cityProblem: cityProblem,
    killSwitch: killNow, KILL_KEY: KILL_KEY,
    problemCodes: problemCodes, errorCode: errorCode, ERROR_DOCS: ERROR_DOCS,
    watchdogVerdict: watchdogVerdict, bootHealthy: bootHealthy, engineHealthy: engineHealthy,
    WATCH: { KEY: WATCH_KEY, FREEZE_MS: WATCH_FREEZE_MS, BEAT_MS: WATCH_BEAT_MS, MAX_MS: WATCH_MAX_MS }, watchState: watchState,
    /* the mod log and developer mode */
    log: readLog, logPush: logPush, readEntries: readEntries,
    devLoad: devLoad, devApply: devApply, devUnload: devUnload, devState: devState, devTainted: devTainted,
    devTiers: devTiers
  };
  root._acwebMods = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
