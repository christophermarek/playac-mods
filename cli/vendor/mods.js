/* The mod rules of Play AC Online, as the game's page runs them (comments
 * removed). playac-mod loads this file so that its check and the game cannot
 * disagree. MIT License, see LICENSE in this folder. */
(function (root) {
  'use strict';

  const TT_PARAM = 'moddev';
  const TT_SUFFIX = '~testtown';
  const TT_ON = (function () {
    try { return new URLSearchParams((root.location && root.location.search) || '').get(TT_PARAM) === '1'; } catch (_) { return false; }
  })();
  function townKey(name) { return TT_ON ? name + TT_SUFFIX : name; }

  const DB_NAME = townKey('acweb-mods');
  const FLAG = townKey('acweb.mods');

  const MODSET_KEY = townKey('acweb.modset');

  const MODLIST_KEY = townKey('acweb.modlist');

  const SKIP_KEY = 'acweb.mods.skip';
  const MODS_DIR = '/mods';
  const MOD_ROOT = '/mods/m';
  const KIB = 1024;
  const MIB = 1024 * 1024;

  const AUTHOR_CHARS = 40;
  const AUTHORS_MAX = 8;
  const CALENDAR_MAX = 16;
  const DATA_VERSION_MAX = 1000000;
  const DESCRIPTION_CHARS = 500;
  const EXPORT_DESC_MAX = 120;
  const EXPORTS_MAX = 32;
  const ITEM_PRICE_MAX = 99999;
  const LETTER_FOOTER_MAX = 32;
  const LETTER_HEADER_MAX = 24;
  const LETTER_SENDER_MAX = 8;
  const LETTERS_MAX = 32;
  const MAX_DEPS = 16;
  const MAX_ENABLED = 32;
  const MAX_ENABLED_UNPACKED = 100663296;
  const MAX_FILES = 2000;
  const MAX_JSON = 262144;
  const MAX_JSON_DEPTH = 32;
  const MAX_LUA = 524288;
  const MAX_MANIFEST = 65536;
  const MAX_PATH = 160;
  const MAX_SETTINGS = 16;
  const MAX_TAGS = 5;
  const MAX_UNPACKED = 67108864;
  const MAX_ZIP = 16777216;
  const MESSAGE_BYTES_MAX = 400;
  const MESSAGES_MAX = 256;
  const MOD_ITEM_TEXTURE_FILES_MAX = 16;
  const MOD_ITEMS_MAX = 64;
  const MOD_RENAMES_MAX = 64;
  const NAME_CHARS = 60;
  const NOOK_STOCK_MAX = 16;
  const PAPER_BYTES = 192;
  const PAPER_LINES = 6;
  const PAPERS = 64;
  const PHONE_MAX_ENABLED_UNPACKED = 25165824;
  const POOL_LINES_MAX = 32;
  const POOLS_MAX = 32;
  const RANGE_BYTES_MAX = 64;
  const RANGE_PARTS_MAX = 4;
  const SETTING_CHOICE_CHARS = 40;
  const SETTING_CHOICES_MAX = 16;
  const SETTING_CHOICES_MIN = 2;
  const SETTING_DESC_CHARS = 200;
  const SETTING_LABEL_CHARS = 60;
  const SETTING_NUM_MAX = 1000000000;
  const SETTING_TEXT_MAX = 200;
  const SHOP_BLOCKS_MAX = 8;
  const SHOP_LINE_CHARS = 160;
  const SHOP_LINE_NEWLINES = 3;
  const SHOP_LINES_MAX = 8;
  const SHOP_NAME_CHARS = 40;
  const SHOP_PERCENT_MAX = 1000;
  const SHOP_PRICE_MAX = 99999;
  const SHOP_STOCK_MAX = 6;
  const TALK_LINE_CHARS = 160;
  const TALK_LINE_NEWLINES = 3;
  const TALK_PAGES_MAX = 8;
  const TEXTURE_LABEL_CHARS = 40;
  const VILLAGER_CHARS = 8;
  const VISITOR_STOCK_MAX = 6;

  const SHOP_KEYS = ['when', 'open', 'own_goods', 'goods', 'price_percent', 'buy_back_percent', 'services', 'name', 'lines'];
  const WHEN_KEYS = ['hours', 'time', 'season', 'weather', 'weekday', 'month', 'setting'];
  const SHOP_IDS = ['nook', 'flower', 'redd', 'saharah', 'fireworks', 'able', 'barber', 'dream', 'katrina'];

  const FTR_NO_MODEL = [31, 32, 33, 35, 36, 37, 38, 39, 40, 44, 45, 48, 51, 52, 53, 126, 128, 129, 130, 136, 137, 144, 145, 146, 148, 188, 197, 209, 254, 255, 256, 262, 264, 268, 269, 270, 271, 275, 277, 278, 280, 281, 285, 292, 294, 296, 300, 301, 302, 303, 307, 328, 330, 331, 338, 339, 340, 345, 349, 357, 358, 925, 926, 928, 929, 951, 952, 1002, 1038, 1039, 1040, 1046, 1047, 1050, 1051, 1059, 1062, 1135, 1142, 1143, 1159, 1162, 1164, 1265];
  const SHOP_INFO = {
    nook: { words: 'Nook\'s store', fields: ['when', 'open', 'own_goods', 'goods', 'price_percent', 'buy_back_percent'], goods: NOOK_STOCK_MAX, services: [], lines: [] },
    flower: { words: 'the flower shop', fields: ['when', 'open', 'own_goods', 'goods', 'price_percent', 'name', 'lines'], goods: SHOP_STOCK_MAX, services: [], lines: ['greeting', 'stock'] },
    redd: { words: 'Crazy Redd\'s tent', fields: ['when', 'own_goods', 'goods', 'price_percent'], goods: VISITOR_STOCK_MAX, services: [], lines: [] },
    saharah: { words: 'Saharah', fields: ['when', 'own_goods', 'goods', 'price_percent'], goods: VISITOR_STOCK_MAX, services: [], lines: [] },
    fireworks: { words: 'the fireworks stall', fields: ['when', 'own_goods', 'goods', 'price_percent'], goods: VISITOR_STOCK_MAX, services: [], lines: [] },
    able: { words: 'Able Sisters', fields: ['when', 'services'], goods: 0, services: ['design'], lines: [] },
    barber: { words: 'the barber shop', fields: ['when', 'open', 'services'], goods: 0, services: ['haircut'], lines: [] },
    dream: { words: 'the Dream Suite', fields: ['when', 'services'], goods: 0, services: ['dream'], lines: [] },
    katrina: { words: 'Katrina\'s tent', fields: ['when', 'services'], goods: 0, services: ['fortune'], lines: [] }
  };

  const QUOTA_MARGIN = 16 * MIB;

  const EVENTS = ['villager_talked', 'day_started', 'item_picked_up', 'scene_entered', 'data_migrated', 'hour_changed', 'item_bought', 'item_sold', 'fish_caught', 'bug_caught', 'letter_read', 'villager_moved_in', 'visitor_arrived', 'command_finished', 'question_answered', 'timer_fired', 'villager_answered'];

  const PERMISSIONS = ['send_letter', 'give_item', 'show_line', 'ask', 'take_item', 'take_bells', 'set_shop_goods', 'set_shop_open'];

  const WORLD_PERMISSIONS = ['set_shop_goods', 'set_shop_open'];
  const EXTS = ['.json', '.lua', '.dds', '.png', '.txt', '.md'];

  const CONTENT_KEYS = ['textures', 'messages', 'shops', 'items', 'letters', 'calendar', 'talk'];
  const BASE_CONTENT_KEYS = ['textures', 'messages', 'shops'];
  const TARGET_CONTENT_KEYS = ['letters', 'calendar', 'talk'];

  const TAGS = ['textures', 'clothing', 'furniture', 'scenery', 'villagers', 'dialogue', 'shops',
    'seasonal', 'holidays', 'quality-of-life', 'humor', 'accessibility', 'scripts'];

  const API_MIN = 1;
  const API_MAX = 1;

  const UNBUILT_KEYS = ['game', 'save'];

  const MANIFEST_KEYS = ['$schema', 'schema', 'api', 'id', 'name', 'version', 'authors', 'description', 'tags', 'scope', 'content', 'scripts', 'permissions', 'exports', 'assets_original', 'renames', 'depends', 'optional_depends', 'conflicts', 'data_version', 'settings'];

  const SHOPS_FILE_KEYS = ['$schema', 'shops'];
  const ITEMS_FILE_KEYS = ['$schema', 'items'];
  const LETTERS_FILE_KEYS = ['$schema', 'letters'];
  const LETTER_KEYS = ['id', 'header', 'body', 'footer', 'sender', 'item', 'paper'];
  const CALENDAR_FILE_KEYS = ['$schema', 'days'];
  const CALENDAR_DAY_KEYS = ['id', 'date', 'board', 'letter'];
  const CALENDAR_DATE_KEYS = ['month', 'day', 'week', 'weekday'];
  const TALK_FILE_KEYS = ['$schema', 'pools'];
  const TALK_POOL_KEYS = ['place', 'topics', 'personality', 'villager', 'season', 'time', 'weather', 'day', 'chance', 'lines'];

  const TALK_PLACES = ['before', 'hello', 'topic', 'after', 'conversation'];
  const TALK_TOPICS = ['small_talk', 'trade', 'letter', 'memory', 'hint', 'news'];

  const SETTING_SCOPES = ['world', 'client'];
  const SCRIPT_KEYS = ['main', 'events'];
  const ID_RE = /^[a-z0-9][a-z0-9-]{0,31}\.[a-z0-9][a-z0-9-]{0,47}$/;
  const VERSION_RE = /^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})$/;
  const HHMM_RE = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  const ITEM_RE = /^0x[0-9a-fA-F]{4}$/;
  const MSG_KEY_RE = /^[a-z0-9_.-]{1,48}$/;

  const PERSONALITIES = ['normal', 'peppy', 'lazy', 'jock', 'cranky', 'snooty'];

  const TALK_WHEN = [['season', ['spring', 'summer', 'fall', 'winter'], 'spring, summer, fall or winter'],
    ['time', ['morning', 'day', 'evening', 'night'], 'morning, day, evening or night'],
    ['weather', ['clear', 'rain', 'snow'], 'clear, rain or snow']];

  const MOD_ITEM_ID_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
  const MOD_ITEM_FULL_RE = /^([a-z0-9][a-z0-9-]{0,31}\.[a-z0-9][a-z0-9-]{0,47}):([a-z0-9][a-z0-9-]{0,31})$/;
  const MOD_ITEM_NAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9 '.,!&-]{0,14}[A-Za-z0-9'.,!&-])?$/;
  const MOD_ITEM_KEYS = ['id', 'name', 'base', 'price', 'textures'];

  const ITEM_TEXTURE_NAME_RE = /^tex1_[0-9]{1,5}x[0-9]{1,5}_[0-9a-fA-F]{16}(?:_[0-9a-fA-F]{16}|_\$)?_[0-9]{1,2}\.(?:[pP][nN][gG]|[dD][dD][sS])$/;
  const LIMITS = {
    MAX_ZIP: MAX_ZIP, MAX_UNPACKED: MAX_UNPACKED, MAX_FILES: MAX_FILES, MAX_PATH: MAX_PATH,
    MAX_MANIFEST: MAX_MANIFEST, MAX_JSON: MAX_JSON, MAX_LUA: MAX_LUA,
    MAX_ENABLED: MAX_ENABLED, MAX_ENABLED_UNPACKED: MAX_ENABLED_UNPACKED,
    PHONE_MAX_ENABLED_UNPACKED: PHONE_MAX_ENABLED_UNPACKED, QUOTA_MARGIN: QUOTA_MARGIN
  };

  const ERROR_DOCS = "https://playaconline.com/modding/errors/";
  const ERROR_CODES = [
    ["visit-lend-wont-load", [new RegExp("^the friend.s mods (would not|did not) all load"), new RegExp("^a lent mod is missing from this tab")]],
    ["zip-too-big", [new RegExp("the ZIP is over 16 MB"), new RegExp("^The (ZIP|zip) is larger than \\d+ MB")]],
    ["zip-unreadable", [new RegExp("not a ZIP the game can (open|read)"), new RegExp("that is not a file the game can read"), new RegExp("^This is not a ZIP file we can read"), new RegExp("^The upload is empty"), new RegExp("can't be read from the ZIP"), new RegExp("not the size its ZIP header says"), new RegExp("^The upload did not arrive whole")]],
    ["browser-no-zip", [new RegExp("ZIP support is unavailable")]],
    ["zip-no-manifest", [new RegExp("no mod\\.json at the top")]],
    ["zip-too-many-files", [new RegExp("^more than \\d+ files"), new RegExp("^The ZIP holds \\d+ files, more than"), new RegExp("^The ZIP has more than \\d+ entries")]],
    ["zip-unpacked-too-big", [new RegExp("^it unpacks to more than 64 MB"), new RegExp("^The files expand to more than")]],
    ["zip-duplicate-entry", [new RegExp("is in the ZIP twice"), new RegExp("^The ZIP holds \".*\" twice")]],
    ["path-unsafe", [new RegExp("is not a safe path"), new RegExp("^The path \".*\" (is longer than|uses a backslash|holds a colon|holds a control|is not plain ASCII|is not a plain path)")]],
    ["path-case-clash", [new RegExp("same name ignoring letter case"), new RegExp("the same path when case is ignored")]],
    ["path-file-and-folder", [new RegExp("is both a file and a folder"), new RegExp("is a file, and \".*\" uses it as a folder")]],
    ["file-type", [new RegExp("files can be in a mod$"), new RegExp("is not an allowed file type")]],
    ["file-too-big", [new RegExp("^mod\\.json is over 64 KB"), new RegExp("is over (256|512) KB$"), new RegExp("^mod\\.json is larger than"), new RegExp("is larger than \\d+ KB, the most a"), new RegExp("^\\S+ is over \\d+ KB$")]],
    ["json-duplicate-key", [new RegExp("duplicate key"), new RegExp("has the key \".*\" twice"), new RegExp("^a member name appears twice$")]],
    ["json-nul", [new RegExp("NUL character"), new RegExp("^\\\\u0000 in a string$")]],
    ["json-invalid", [new RegExp("is not valid JSON"), new RegExp("a number is out of range"), new RegExp("^(expected (a member name|':'|',' or [}\\]])|trailing data after the document|unexpected (end|character)|unterminated string|bad (number|escape|\\\\u escape)|control character in string|number (too long|out of range)|too many values)$")]],
    ["json-too-deep", [new RegExp("nested more than \\d+ levels"), new RegExp("^nested too deep$")]],
    ["manifest-unreadable", [new RegExp("^mod\\.json could not be read")]],
    ["manifest-not-object", [new RegExp("^mod\\.json is not a JSON object"), new RegExp("^mod\\.json must be a JSON object")]],
    ["api-missing", [new RegExp("^\"api\" must be a whole number"), new RegExp("must say \"api\" as a whole number"), new RegExp("mod\\.json needs \"api\": \\d+")]],
    ["api-older", [new RegExp("made for an older game")]],
    ["api-newer", [new RegExp("needs a newer game")]],
    ["manifest-schema", [new RegExp("^\"schema\" must be 1"), new RegExp("must say \"schema\"")]],
    ["manifest-unbuilt-key", [new RegExp("is not built yet")]],
    ["unknown-key", [new RegExp("unknown key \"")]],
    ["manifest-id-reserved", [new RegExp("reserved for the site's own mods")]],
    ["manifest-id", [new RegExp("^\"id\" must look like"), new RegExp("^The id \".*\" must look like")]],
    ["manifest-name", [new RegExp("^\"name\" must be 1 to 60"), new RegExp("^The name must be 1 to 60")]],
    ["manifest-version", [new RegExp("^\"version\" must be like"), new RegExp("^The version \".*\" must be three numbers")]],
    ["manifest-authors", [new RegExp("^\"authors\" must list"), new RegExp("^List 1 to 8 authors"), new RegExp("^Each author must be")]],
    ["manifest-description", [new RegExp("^\"description\" must be text"), new RegExp("^The description must be text")]],
    ["manifest-tags", [new RegExp("^\"tags\" must list"), new RegExp("^tags must list")]],
    ["manifest-scope", [new RegExp("^\"scope\" must be \"client\" or \"world\""), new RegExp("^The scope must be")]],
    ["manifest-assets-original", [new RegExp("\"assets_original\"")]],
    ["shops-need-world", [new RegExp("changes what visitors see, so \"scope\" must be \"world\""), new RegExp("content\\.shops changes what visitors see"), new RegExp("^shops change what visitors see"), new RegExp("^permissions lists \\w+, which changes what visitors see")]],
    ["content-not-object", [new RegExp("^\"content\" must be an object"), new RegExp("^content must be an object")]],
    ["content-unknown", [new RegExp("^\"content\\.[^\"]*\" is not something a mod can add yet"), new RegExp("^content\\.\\S+ is not something a mod can add yet")]],
    ["content-path", [new RegExp("^\"content\\.[^\"]*\" must be a path inside the mod"), new RegExp("^content\\.\\S+ must be a path inside the mod"), new RegExp("^(textures|messages|shops|items|letters|calendar|talk) path is not inside the mod"), new RegExp("^content: a value must be a path inside the mod")]],
    ["content-missing", [new RegExp("^\"content\\.[^\"]*\" names .*, which is not"), new RegExp("^content\\.\\S+ names \".*\", which is not"), new RegExp("^cannot open ")]],
    ["scripts-not-object", [new RegExp("^\"scripts\" must be an object"), new RegExp("^scripts must be an object")]],
    ["scripts-unknown-key", [new RegExp("is not a scripts setting")]],
    ["scripts-main-missing", [new RegExp("^\"scripts\\.main\" names .*, which is not in the mod"), new RegExp("^scripts\\.main names \".*\", which is not in the ZIP"), new RegExp("^scripts\\.main could not be read")]],
    ["scripts-main", [new RegExp("^\"scripts\\.main\" must be a \\.lua file"), new RegExp("^scripts\\.main must name a \\.lua file"), new RegExp("^scripts\\.main is not a path inside the mod"), new RegExp("^scripts\\.main must end in lowercase \\.lua"), new RegExp("folder path is too long")]],
    ["scripts-events", [new RegExp("^\"scripts\\.events\" must list"), new RegExp("^scripts\\.events (must list|lists)")]],
    ["scripts-permissions", [new RegExp("^\"permissions\" must list"), new RegExp("^permissions (must list|lists)")]],
    ["scripts-permissions-no-scripts", [new RegExp("permissions\"? is for a mod with \"?scripts")]],
    ["manifest-exports", [new RegExp("^\"exports\" must be an object"), new RegExp("^exports must be an object"), new RegExp("\"exports\" must be an object of at most")]],
    ["manifest-exports-no-scripts", [new RegExp("exports\"? is for a mod with \"?scripts")]],
    ["shops-file", [new RegExp("\"shops\" must be an object of shop ids"), new RegExp("needs a \"shops\" object of shop ids")]],
    ["shop-id", [new RegExp("there is no shop \"")]],
    ["shop-blocks", [new RegExp("takes one block or a list of 1 to")]],
    ["shop-not-object", [new RegExp("a block must be an object")]],
    ["shop-block-empty", [new RegExp("a block needs a field besides \"when\"")]],
    ["shop-name", [new RegExp("\"name\" must be 1 to \\d+ characters on one line")]],
    ["shop-hours-same", [new RegExp("\"hours\" from and to must differ")]],
    ["shop-hours", [new RegExp("\"hours\" must be \\{ \"from\"")]],
    ["shop-when", [new RegExp("\"when\" must be an object with at least one of"), new RegExp("\"when\": \"[^\"]*\" must be"), new RegExp("\"when\": \"weekday\" must list"), new RegExp("\"when\": \"month\" must list")]],
    ["shop-when-setting", [new RegExp("\"when\": \"setting\" must name a bool setting of this mod")]],
    ["shop-flag", [new RegExp("(^|[^\"] |[^ ])\"[a-z_]+\" must be true or false\\.?$")]],
    ["shop-percent", [new RegExp("\" must be a whole number from 1 to 1000\\.?$")]],
    ["shop-service", [new RegExp("\"services\" must be an object of service to Bells"), new RegExp("\"services\" has no \""), new RegExp("\"services\" \".*\" must be a whole number of Bells")]],
    ["shop-line-slot", [new RegExp("\"lines\" must be an object of slot to"), new RegExp("\"lines\" has no slot \"")]],
    ["shop-text", [new RegExp("\"lines\" \".*\" must be a line or a list of 1 to")]],
    ["shop-field-ignored", [new RegExp("has no \"[a-z_]+\", so it is left out")]],
    ["target-not-object", [new RegExp("^(letters: letter|calendar: day|talk: pool) \\d+ is not an object"), new RegExp(": (letter|day|pool) \\d+ must be an object"), new RegExp("(a letter|a day|a pool) must be an object")]],
    ["target-id", [new RegExp("\"id\" must be 1 to 48 of a-z"), new RegExp("'s id must be 1 to 48 of a-z"), new RegExp("is used twice"), new RegExp("an \"id\" must be 1 to 48"), new RegExp("an \"id\" is used twice")]],
    ["letters-file", [new RegExp("^letters: \"letters\" must be a list"), new RegExp("needs a \"letters\" list"), new RegExp("^letters file needs")]],
    ["letter-header", [new RegExp("\"header\" must be 1 to 24"), new RegExp("'s header must be 1 to 24"), new RegExp("^letters: \"header\" is too long")]],
    ["letter-body", [new RegExp("\"body\" must be 1 to \\d+ plain"), new RegExp("'s body must be 1 to \\d+ plain")]],
    ["paper-fit", [new RegExp("does not fit on the letter paper"), new RegExp("does not fit on a board page")]],
    ["letter-footer", [new RegExp("\"footer\" must be 1 to 32"), new RegExp("'s footer must be 1 to 32")]],
    ["letter-sender", [new RegExp("\"sender\" must be 1 to 8"), new RegExp("'s sender must be 1 to 8")]],
    ["letter-item", [new RegExp("^letters: letter \\d+ \"item\""), new RegExp(": letter \\d+'s item"), new RegExp("^letters: \"item\" must be"), new RegExp("^letters: the item cannot be sent")]],
    ["letter-paper", [new RegExp("\"paper\" must be a whole number"), new RegExp("'s paper must be a whole number")]],
    ["calendar-file", [new RegExp("\"days\" must be a list"), new RegExp("needs a \"days\" list"), new RegExp("^calendar file needs")]],
    ["calendar-date", [new RegExp("\"date\" must be"), new RegExp("'s date must be")]],
    ["calendar-letter", [new RegExp("\"letter\" must be the id of a letter"), new RegExp("'s letter must be the id of a letter"), new RegExp("names no letter in this mod's letters file")]],
    ["calendar-board-world", [new RegExp("\"board\" changes the town"), new RegExp("board notice changes the town"), new RegExp("a \"board\" notice changes the town")]],
    ["calendar-board", [new RegExp("\"board\" must be 1 to \\d+ plain"), new RegExp("'s board must be 1 to \\d+ plain")]],
    ["talk-file", [new RegExp("^talk: \"pools\" must be a list"), new RegExp("needs a \"pools\" list"), new RegExp("^talk file needs")]],
    ["talk-no-place", [new RegExp("\"place\" is required"), new RegExp("'s place is required")]],
    ["talk-place", [new RegExp("\"place\" must be before, hello"), new RegExp("'s place must be before, hello")]],
    ["talk-topics", [new RegExp("\"topics\" must be \"any\""), new RegExp("'s topics must be \"any\""), new RegExp("\"topics\" goes only with"), new RegExp("'s topics go only with")]],
    ["talk-day", [new RegExp("\"day\" must be the id of a day"), new RegExp("'s day must be the id of a day"), new RegExp("names no day in this mod's calendar file")]],
    ["talk-who", [new RegExp("\"personality\" or a \"villager\", not both"), new RegExp("a personality or a villager, not both")]],
    ["talk-personality", [new RegExp("\"personality\" must be"), new RegExp("'s personality must be")]],
    ["talk-villager", [new RegExp("\"villager\" must be a name"), new RegExp("'s villager must be a name")]],
    ["talk-when", [new RegExp("\"(season|time|weather)\" must be"), new RegExp("'s (season|time|weather) must be")]],
    ["talk-chance", [new RegExp("\"chance\" must be a whole number"), new RegExp("'s chance must be a whole number")]],
    ["talk-lines", [new RegExp("\"lines\" must list 1 to 32"), new RegExp("'s lines must list 1 to"), new RegExp("^talk: a line must be")]],
    ["targets-out-of-memory", [new RegExp("^(letters|calendar|talk): out of memory")]],
    ["shop-replaced", [new RegExp("^shops: a later mod changes .* too, so this mod's change to it is not used")]],
    ["shop-stock", [new RegExp("\"goods\" must list 1 to \\d+")]],
    ["items-list", [new RegExp("^items: \"items\" must be a list of 1 to"), new RegExp("needs an \"items\" list of 1 to"), new RegExp("must be a JSON object with an \"items\" list")]],
    ["item-not-object", [new RegExp("^items: item \\d+ is not an object"), new RegExp(": item \\d+ must be an object")]],
    ["item-setting", [new RegExp("is not an item setting")]],
    ["item-id", [new RegExp("\"id\" must be 1 to 32 of a-z"), new RegExp("'s id must be 1 to 32 of a-z")]],
    ["item-id-twice", [new RegExp("^items: item \\d+ repeats the id"), new RegExp("two items have the id"), new RegExp("^items: an id is listed twice")]],
    ["item-name", [new RegExp("\"name\" must be 1 to 16 letters"), new RegExp("'s name must be 1 to 16 letters")]],
    ["item-base", [new RegExp("\"base\" must be"), new RegExp("'s base .*must be")]],
    ["item-price", [new RegExp("^items: item \\d+ \"price\" must be"), new RegExp("item .*'s price must be a whole number"), new RegExp("^items: a price must be a whole number")]],
    ["item-textures", [new RegExp("\"textures\" must be a folder inside the mod"), new RegExp("'s textures must be a folder inside the mod")]],
    ["item-textures-count", [new RegExp("\"textures\" folder .* holds \\d+ files"), new RegExp("'s textures folder .* holds \\d+ files"), new RegExp("textures folder holds more than \\d+ files")]],
    ["item-textures-name", [new RegExp("\"textures\" file .* is not a .png or .dds texture name"), new RegExp("'s textures file .* is not a .png or .dds texture name")]],
    ["item-textures-overlap", [new RegExp("textures\"? folder .*is inside content\\.textures or holds it")]],
    ["item-malformed", [new RegExp("^items: a malformed item is left out")]],
    ["item-base-refused", [new RegExp("^items: this base cannot be a mod item")]],
    ["items-too-many-total", [new RegExp("^items: the game holds \\d+ mod items at most")]],
    ["shop-mod-item-unknown", [new RegExp("is not an item in this mod's items file"), new RegExp("names an item that is not one of this mod's")]],
    ["shop-furniture-shared", [new RegExp("shares its furniture")]],
    ["shop-item-no-model", [new RegExp("has no model in the game: it would stand as a placeholder sign")]],
    ["item-renames", [new RegExp("^\"renames\""), new RegExp("^renames")]],
    ["shop-item-twice", [new RegExp("is a duplicate item")]],
    ["shop-item-refused", [new RegExp("^shops: a good cannot be sold at"), new RegExp("so the game leaves it out of ")]],
    ["shop-item", [new RegExp("\"item\" must be \"0x\" and 4 hex")]],
    ["shop-price", [new RegExp("\"price\" must be a whole number")]],
    ["shop-price-floor", [new RegExp("is under the floor for")]],
    ["manifest-depends", [new RegExp(" must be an object of mod id to version range"), new RegExp(" may name at most \\d+ mods"), new RegExp("\" is not a mod id"), new RegExp(" names the mod itself$"), new RegExp(" names the mod itself\\."), new RegExp("^\"?(depends|optional_depends|conflicts)\"? must be an object of mod id"), new RegExp("^\"?(depends|optional_depends|conflicts)\"? may name at most"), new RegExp("^\"?(depends|optional_depends|conflicts)\"?: \".*\" is not a mod id"), new RegExp("^\"?(depends|optional_depends|conflicts)\"? names the mod itself"), new RegExp("\" is in both \"?[a-z_]+\"? and \"?[a-z_]+\"?\\.?$")]],
    ["manifest-depends-range", [new RegExp("the range for .* must be \"\\*\" or up to 4")]],
    ["manifest-data-version", [new RegExp("^\"?data_version\"? must be a whole number"), new RegExp("which needs a \"?data_version\"?")]],
    ["manifest-setting-value", [new RegExp(" default must be true or false"), new RegExp(" min and max must be whole numbers from"), new RegExp(" default must be a whole number from min to max"), new RegExp(" choices must list 2 to 16 different texts"), new RegExp(" default must be one of its choices"), new RegExp(" max_length must be a whole number from 1 to 200"), new RegExp(" default must be text of at most max_length"), new RegExp("^settings: \".*\" \"?(default|min|choices|max_length)\"?( and \"?max\"?)? must")]],
    ["manifest-settings", [new RegExp(" is declared twice"), new RegExp(" type must be one of bool, number, choice, text"), new RegExp(", which a [a-z]+ setting does not take"), new RegExp(" label must be 1 to 60 characters"), new RegExp(" description must be text of at most 200 characters"), new RegExp(" \"?scope\"? must be \"world\" or \"client\""), new RegExp("^\"?settings\"? must be a list of at most"), new RegExp("^settings: setting \\d+ "), new RegExp("^settings: \".*\" (is declared twice|\"?type\"? must be one of|has \".*\", which a|\"?label\"? must be|\"?description\"? must be)")]],
    ["setting-refused", [new RegExp(" must be on or off$"), new RegExp(" must be a whole number from -?\\d+ to -?\\d+$"), new RegExp(" must be one of: "), new RegExp(" characters, on one line$"), new RegExp(" has no setting \"")]],
    ["boot-dependency", [new RegExp("^needs .*, which (is not installed|is switched off|did not load)$"), new RegExp("^needs .* is installed$"), new RegExp("is in a dependency cycle"), new RegExp("^cannot run with .*: switch one of them off")]],
    ["engine-dependency", [new RegExp("^not loaded: needs .*, which the game did not load before it"), new RegExp("^not loaded: needs .*, and the game loaded ")]],
    ["engine-settings", [new RegExp("^settings: (a name is not one mod\\.json can declare|a value is not a boolean|a text value cannot be used|out of memory)")]],
    ["messages-not-object", [new RegExp("^messages: the file is not a JSON object"), new RegExp("must be a JSON object of line ids to text"), new RegExp("^messages file is not a JSON object")]],
    ["messages-too-many", [new RegExp("a messages file has at most 256 lines"), new RegExp("has \\d+ lines, more than"), new RegExp("^messages: a messages file has at most")]],
    ["messages-key", [new RegExp("^messages(/[a-z]{2})?: key .* must be 1 to 48"), new RegExp(": the line id \".*\" must be"), new RegExp("^messages: a key must be")]],
    ["messages-text", [new RegExp("^messages(/[a-z]{2})?: \".*\" must be text of 1 to 400"), new RegExp(": the line \".*\" must be text of 1 to"), new RegExp("^messages: a line must be text")]],
    ["messages-out-of-memory", [new RegExp("^messages: out of memory")]],
    ["texture-copied", [new RegExp("is an unchanged copy of a texture from")]],
    ["texture-mipmaps", [new RegExp("mip levels\\. Save it with one level"), new RegExp("bytes after its image")]],
    ["texture-size", [new RegExp("A texture is 1 to \\d+ pixels a side"), new RegExp("A PNG in a mod is at most"), new RegExp("\" is a \\d+x\\d+ \\S+\\.$"), new RegExp("^PNG texture is over \\d+x\\d+")]],
    ["texture-small", [new RegExp("smaller than the original \\d+x\\d+"), new RegExp("not the shape of the original \\d+x\\d+")]],
    ["texture-png-unreadable", [new RegExp("^texture is not a PNG the game reads"), new RegExp("^PNG texture could not be read")]],
    ["texture-png-budget", [new RegExp("^PNG textures are over \\d+ MB of pixels")]],
    ["texture-dds-budget", [new RegExp("^DDS textures are over \\d+ MB")]],
    ["texture-twice", [new RegExp("are the same texture: the game uses only one")]],
    ["texture-label", [new RegExp("the label before tex1_")]],
    ["texture-label-twice", [new RegExp("are the same texture once labels are taken off")]],
    ["picture-misnamed", [new RegExp("Pictures go in \\.png or \\.dds files"), new RegExp("is named as \\S* but holds"), new RegExp("is a picture in a format mods can't carry")]],
    ["png-extra-data", [new RegExp("chunk, which a picture in a mod may not carry"), new RegExp("of metadata\\. Export it again without metadata")]],
    ["texture-format", [new RegExp("is not a DDS file"), new RegExp("is a DDS format the game can't load"), new RegExp("is an uncompressed DDS of \\d+ bits"), new RegExp("is not a \\S+ we can read"), new RegExp("\" is cut short"), new RegExp("^is cut short")]],
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
    ["timer-no-town", [new RegExp("timer\\.after refused: no town is loaded")]],
    ["timer-no-clock", [new RegExp("timer\\.after refused: the game clock is not set")]],
    ["timer-limit", [new RegExp("timer\\.after refused: this mod already has \\d+ timers waiting")]],
    ["timer-store-full", [new RegExp("timer\\.after refused: the timer does not fit")]],
    ["timer-args", [new RegExp("timer\\.after refused: ")]],
    ["script-budget", [new RegExp("took too long"), new RegExp(" \\(in a call to [^)]*\\)$")]],
    ["script-slow", [new RegExp("kept the game waiting")]],
    ["script-memory", [new RegExp("^out of memory"), new RegExp("not enough memory")]],
    ["script-on-event", [new RegExp("on\\(\\): unknown event"), new RegExp("is not in this mod's \"scripts\\.events\" list")]],
    ["script-on-late", [new RegExp("handlers can only be added while the script loads")]],
    ["script-on-too-many", [new RegExp("on\\(\\): at most \\d+ handlers")]],
    ["script-store-no-town", [new RegExp("no town is loaded yet")]],
    ["script-store-no-player", [new RegExp("no player is in the game yet")]],
    ["remote-not-exported", [new RegExp("is not in mod\\.json \"exports\"")]],
    ["script-remote", [new RegExp("remote\\.(add|call|has): "), new RegExp("remote\\.call "), new RegExp("it offers no function"), new RegExp("can be passed, not a"), new RegExp("cannot be passed$"), new RegExp("a table key must be a string"), new RegExp("values in one call$"), new RegExp("KB of data in one call$"), new RegExp("^its script failed$")]],
    ["script-store", [new RegExp("store\\.set: "), new RegExp("store\\.client\\.set: "), new RegExp("store\\.player\\.set: "), new RegExp("a key cannot start with a control character"), new RegExp("only strings, numbers and booleans can be saved"), new RegExp("key longer than \\d+ bytes"), new RegExp("a key cannot hold a zero byte"), new RegExp("value longer than \\d+ bytes"), new RegExp("a value cannot hold a zero byte"), new RegExp("NaN cannot be saved"), new RegExp("the store would be over"), new RegExp("the store could not be written")]],
    ["script-sandbox", [new RegExp("__gc is not allowed"), new RegExp("__len metamethod are not supported"), new RegExp("is not allowed in mod scripts"), new RegExp("is not available: use rng\\(\\)")]],
    ["script-state-failed", [new RegExp("Lua state failed"), new RegExp("^script closed$"), new RegExp("raised an error that is not a string")]],
    ["script-syntax", [new RegExp("'[^']+' expected"), new RegExp("unexpected symbol near"), new RegExp("near <eof>"), new RegExp("unfinished (long )?(string|comment)"), new RegExp("malformed number near"), new RegExp("syntax error near"), new RegExp("invalid escape sequence"), new RegExp("expected \\(to close"), new RegExp("<name> expected"), new RegExp("function arguments expected"), new RegExp("hexadecimal digit expected"), new RegExp("break outside a loop"), new RegExp("no visible label"), new RegExp("label '[^']+' already defined"), new RegExp("jumps into the scope of local"), new RegExp("attempt to assign to const variable"), new RegExp("outside a vararg function"), new RegExp("ambiguous syntax"), new RegExp("unknown attribute"), new RegExp("multiple to-be-closed variables"), new RegExp("decimal escape too large"), new RegExp("UTF-8 value too large"), new RegExp("invalid long string delimiter")]],
    ["command-permission", [new RegExp("is not in this mod's \"permissions\"")]],
    ["command-event-cap", [new RegExp("commands in one event")]],
    ["command-queue-full", [new RegExp("commands waiting"), new RegExp("command queue is full")]],
    ["command-day-cap", [new RegExp("a day for each mod")]],
    ["command-item", [new RegExp("^(?:\\w+: cmd\\.\\w+ refused: )?(give_item|send_letter|take_item): item 0x"), new RegExp("can only (give|take) its own new items"), new RegExp("no item by that id in this mod's items file"), new RegExp("can only send its own letters\\.json letters"), new RegExp("no letter by that id in this mod's letters file"), new RegExp("the item is not this town's to give"), new RegExp("the letter is gone")]],
    ["command-args", [new RegExp("^(?:\\w+: cmd\\.\\w+ refused: )?(send_letter|give_item|show_line|ask|take_item|take_bells|set_shop_goods|set_shop_open): (takes a table|text must|from must|paper must|choices must|each choice must|the text does not fit|template must|template takes no|item must be an item number|count must|amount must|shop must|goods must|each good must|price must|open must|no town is loaded yet)"), new RegExp("item: that item id is too long")]],
    ["command-city", [new RegExp("commands are switched off in The City"), new RegExp("^(?:\\w+: cmd\\.\\w+ refused: )?set_shop_(goods|open): shops are off in The City")]],
    ["command-client-setting", [new RegExp("this event read the client setting")]],
    ["command-shop", [new RegExp("^(?:\\w+: cmd\\.\\w+ refused: )?(set_shop_goods|set_shop_open): (there is no such shop|.+ has no (goods|open)$|a later mod changes |a shop changes what visitors see)")]],
    ["dependency-absent", [new RegExp("^[a-z0-9.-]+ is not loaded$"), new RegExp("^[a-z0-9.-]+ is loaded, but it has no running script$")]],
    ["dependency-version", [new RegExp("is loaded, but its version is outside the range this mod names$")]],
    ["dependency-undeclared", [new RegExp("is not in this mod's \"depends\" or \"optional_depends\"$")]],
    ["command-visiting", [new RegExp("only the town owner's game can change the town")]],
    ["command-lent-home", [new RegExp("lent for a visit acts only in their town")]],
    ["command-no-room", [new RegExp("post office are (both|all) full"), new RegExp("the pockets are full \\(a new item")]],
    ["command-not-shown", [new RegExp("cannot be drawn in the window")]],
    ["command-not-held", [new RegExp("the pockets do not hold \\d+ of that item"), new RegExp("the wallet holds fewer than \\d+ Bells"), new RegExp("the pockets no longer hold those items"), new RegExp("the wallet no longer holds that many Bells")]],
    ["command-declined", [new RegExp("the player said no, nothing was taken")]],
    ["upload-name-word", [new RegExp("^The mod's name has a word the site does not allow")]],
    ["upload-author-word", [new RegExp("^An author name has a word the site does not allow")]],
    ["upload-not-text", [new RegExp("is not text\\. A \\.txt, \\.md or \\.lua file must be")]],
    ["file-lone-cr", [new RegExp("has a carriage return with no line feed after it")]],
    ["upload-text-too-much", [new RegExp("^The text files of the mod add up to more than")]],
    ["upload-sign-in", [new RegExp("^Sign in to share a mod")]],
    ["upload-publisher-terms", [new RegExp("accept the mod rules before you share")]],
    ["upload-under-13", [new RegExp("^Sharing mods is for players 13 or older")]],
    ["upload-rights-removed", [new RegExp("can no longer share mods"), new RegExp("^Mod uploads are switched off for your account")]],
    ["upload-version-exists", [new RegExp("version of the mod is already uploaded"), new RegExp("That version is already shared")]],
    ["upload-screenshot", [new RegExp("[Ss]creenshot")]],
    ["upload-changelog", [new RegExp("[Cc]hangelog")]],
    ["upload-form", [new RegExp("^The upload form"), new RegExp("^Send one zip at a time")]],
    ["upload-not-owner", [new RegExp("already (uploaded|shares) a mod with (this|that) id")]],
    ["upload-too-many", [new RegExp("mods an hour"), new RegExp("a lot of uploads for one hour"), new RegExp("reached the hourly upload limit"), new RegExp("waiting for review"), new RegExp("the most mods waiting for review")]],
    ["upload-storage-full", [new RegExp("Your mods would take more than"), new RegExp("use all the space you have")]],
    ["upload-busy", [new RegExp("upload from your account or your network is still going"), new RegExp("too slow to upload the")]],
    ["upload-image-check", [new RegExp("couldn't check the images in your mod")]],
    ["upload-refused", [new RegExp("^This upload can't be accepted")]],
    ["upload-closed", [new RegExp("^Sharing mods is not open yet")]],
    ["upload-paused", [new RegExp("^New mod uploads are paused")]],
    ["upload-two-factor", [new RegExp("^Turn on two-factor sign-in"), new RegExp("^Enter the code from your authenticator app"), new RegExp("Sharing mods is switched off (on this server )?for now"), new RegExp("^Two-factor sign-in is not available"), new RegExp("^Too many wrong codes in a row"), new RegExp("^That code is not right, or it was used already")]],
    ["upload-prefix-taken", [new RegExp("before the dot belongs to another player")]],
    ["upload-content-taken-down", [new RegExp("were removed from the mod list, so they")]],
    ["upload-too-many-attempts", [new RegExp("^You can try \\d+ uploads an hour"), new RegExp("a lot of upload tries for one hour"), new RegExp("hourly limit for upload tries")]],
    ["upload-too-many-images", [new RegExp("different pictures. Split it"), new RegExp("pictures add up to more than")]],
    ["import-bad-source", [new RegExp("github.com/<owner>/<repo>@<tag>"), new RegExp("^That is not a GitHub owner")]],
    ["mod-conflict", [new RegExp("^A moderator took this version out of the list"), new RegExp("Another decision on this version came first"), new RegExp("^The moderators are looking at this version")]],
    ["status-update-available", [new RegExp("^Update available")]],
    ["status-yanked", [new RegExp("^This version was withdrawn from the mod list")]],
    ["status-mods-switched-off", [new RegExp("^Mods are switched off for everyone")]],
    ["visit-modset-mismatch", [new RegExp("World mods don.t match"), new RegExp("Visits need the same World mods")]],
    ["visit-lend-failed", [new RegExp("does not match the friend.s copy"), new RegExp("is a different mod$"), new RegExp("do not add up to their town.s mod set"), new RegExp("does not need to be lent for a visit"), new RegExp("friend.s mod list could not be read"), new RegExp("cannot keep a friend.s mods for one visit"), new RegExp("friend.s settings for .* are not ones that mod takes"), new RegExp("^Couldn.t load .* mods for this visit"), new RegExp("^Invalid mod list")]],
    ["city-mod-refused", [new RegExp("a City mod may only hold textures and lines"), new RegExp("a City mod may not run scripts"), new RegExp("a City mod may not ask for commands"), new RegExp("City mod list could not be read"), new RegExp("^Couldn.t download the City.s mods")]]
  ];

  const PROBLEM_PREFIX = /^(Installed but switched off|The mod was refused|This mod did not load|Script stopped|script stopped|developer copy): /;

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

  function ruleError(msg) {
    const e = new Error(msg);
    e.modRule = true;
    e.codes = problemCodes(msg);
    e.code = e.codes[0] || '';
    return e;
  }

  function cpLen(s) { return Array.from(s).length; }
  function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function lowerExt(p) { const i = p.lastIndexOf('.'); return i < 0 ? '' : p.slice(i).toLowerCase(); }

  function editDistance(a, b) {
    let prev = [];
    for (let j = 0; j <= b.length; j++) prev.push(j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  function closestKey(key, known) {

    const fold = function (s) { return s.replace(/[A-Z]/g, function (c) { return c.toLowerCase(); }); };
    const low = fold(key);
    for (const k of known) if (fold(k) === low) return k;
    const kc = Array.from(key);
    let best = '';
    let bestD = Infinity;
    for (const k of known) {
      const d = editDistance(kc, Array.from(k));
      if (d < bestD) { bestD = d; best = k; }
    }
    return bestD <= (cpLen(best) >= 8 ? 3 : 2) ? best : '';
  }

  function unknownKeyErrs(obj, known, at, skip) {
    const errs = [];
    for (const k of Object.keys(obj)) {
      if (known.indexOf(k) >= 0 || (skip && skip.indexOf(k) >= 0)) continue;
      const c = closestKey(k, known);
      errs.push(at + 'unknown key ' + JSON.stringify(k) + (c ? ' (did you mean "' + c + '"?)' : ''));
    }
    return errs;
  }

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
      i++;
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
            i += 4;

            if (cp >= 0xD800 && cp <= 0xDBFF) {
              const lo = text[i] === '\\' && text[i + 1] === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6)) ? parseInt(text.slice(i + 2, i + 6), 16) : 0;
              if (lo >= 0xDC00 && lo <= 0xDFFF) { out += String.fromCharCode(cp, lo); i += 6; }
              else out += '\uFFFD';
            } else if (cp >= 0xDC00 && cp <= 0xDFFF) out += '\uFFFD';
            else out += String.fromCharCode(cp);
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
      fail();
    }
    return v;
  }

  function decodeUtf8(bytes) {

    return new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }).decode(bytes);
  }

  function parseFile(name, bytes) {
    try { return { value: parseJsonStrict(decodeUtf8(bytes)) }; } catch (e) {
      return { error: e && e.jsonRule ? name + ': ' + e.message : name + ' is not valid JSON' };
    }
  }

  function isHidden(s) { return s.charAt(0) === '.' && s !== '.' && s !== '..'; }
  function isJunk(p) {
    return p.split('/').some(function (s) { return isHidden(s) || s === '__MACOSX' || s === 'Thumbs.db'; });
  }

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

  function normalizeEntries(raw) {
    let names = Object.keys(raw).filter(function (n) { return !n.endsWith('/') && !isJunk(n); }).sort();
    let entries = {};
    for (const n of names) entries[n] = raw[n];
    const problems = [];
    if (names.indexOf('mod.json') < 0) {
      const slash = names.length ? names[0].indexOf('/') : -1;
      const top = slash > 0 ? names[0].slice(0, slash + 1) : '';

      if (top && top !== './' && top !== '../' &&
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

      else if ((ext === '.lua' || ext === '.json') && hasLoneCR(entries[n])) {
        problems.push(JSON.stringify(n) + ' has a carriage return with no line feed after it. Save it with LF or CRLF line endings');
      }
    }
    if (total > MAX_UNPACKED) problems.push('it unpacks to more than ' + (MAX_UNPACKED / MIB) + ' MB');
    return { entries: entries, names: names, problems: problems };
  }

  const HIDDEN_LINE_RE = /[\u0000-\u001f\u007f-\u009f\u2028\u2029\u115f\u1160\u3164\uffa0\u2800\p{Cf}]/u;
  const HIDDEN_TEXT_RE = /[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u2028\u2029\u115f\u1160\u3164\uffa0\u2800\p{Cf}]/u;
  const HIDDEN_LINE_RULE = 'on one line, with no invisible, text-direction or control character';
  const HIDDEN_TEXT_RULE = 'with no invisible, text-direction or control character but a line break';
  function hiddenChar(s, lines) { return (lines ? HIDDEN_TEXT_RE : HIDDEN_LINE_RE).test(s); }

  function hasLoneCR(b) {
    for (let i = 0; i < b.length; i++) if (b[i] === 13 && b[i + 1] !== 10) return true;
    return false;
  }

  function apiStatus(m) {
    if (!isObj(m) || !has(m, 'api')) return 'older';
    const a = m.api;
    if (typeof a !== 'number' || !Number.isInteger(a)) return 'bad';
    if (a < API_MIN) return 'older';
    if (a > API_MAX) return 'newer';
    return 'ok';
  }

  function apiRange() { return API_MIN === API_MAX ? String(API_MIN) : API_MIN + ' to ' + API_MAX; }

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

  const MANIFEST_RULES = { 1: manifestRules1 };

  function permissionRules(m, errs) {
    if (!has(m, 'permissions')) return;
    const p = m.permissions;
    if (!Array.isArray(p) || !p.length ||
        p.some(function (x, k) { return PERMISSIONS.indexOf(x) < 0 || p.indexOf(x) !== k; })) {
      errs.push('"permissions" must list one or more commands, each once, from: ' + PERMISSIONS.join(', '));
    } else if (!has(m, 'scripts')) {
      errs.push('"permissions" is for a mod with "scripts": only a script can use a command');
    } else if (m.scope !== 'world') {
      for (const x of p) {
        if (WORLD_PERMISSIONS.indexOf(x) >= 0) errs.push('"permissions" lists "' + x + '", which changes what visitors see, so "scope" must be "world"');
      }
    }
  }

  function validateManifest(m, names) {
    if (!isObj(m)) return ['mod.json is not a JSON object'];
    const why = apiProblem(m);
    if (why) return [why];
    return MANIFEST_RULES[m.api](m, names);
  }

  function tagsProblem(t) {
    const ok = Array.isArray(t) && t.length <= MAX_TAGS &&
      t.every(function (x, k) { return typeof x === 'string' && TAGS.indexOf(x) >= 0 && t.indexOf(x) === k; });
    return ok ? '' : '"tags" must list at most ' + MAX_TAGS + ' different tags from: ' + TAGS.join(', ');
  }

  function baseRules(m, names) {
    const errs = [];
    const isFile = function (p) { return names.indexOf(p) >= 0; };
    const isDir = function (p) { return names.some(function (n) { return n.startsWith(p + '/'); }); };
    if (typeof m.schema !== 'number' || m.schema !== 1) errs.push('"schema" must be 1');
    for (const k of UNBUILT_KEYS) {
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
          if (BASE_CONTENT_KEYS.indexOf(k) < 0) { errs.push(what + ' is not something a mod can add yet'); continue; }
          let p = content[k];
          if (typeof p !== 'string' || !p.length) { errs.push(what + ' must be a path inside the mod'); continue; }
          if (k === 'textures') {
            if (p.endsWith('/')) p = p.slice(0, -1);
            if (pathProblem(p)) errs.push(what + ' must be a path inside the mod');
            else if (!isDir(p)) errs.push(what + ' names ' + content[k] + ', which is not a folder with files in the mod');
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
          if (SCRIPT_KEYS.indexOf(k) < 0) errs.push('"scripts.' + k + '" is not a scripts setting (only main and events)');
        }
        if (typeof s.main !== 'string' || pathProblem(s.main) || !s.main.endsWith('.lua')) {
          errs.push('"scripts.main" must be a .lua file inside the mod (lowercase .lua)');
        } else if (!isFile(s.main)) errs.push('"scripts.main" names ' + s.main + ', which is not in the mod');
        if (!Array.isArray(s.events) || !s.events.length ||
            s.events.some(function (h, k) { return EVENTS.indexOf(h) < 0 || s.events.indexOf(h) !== k; })) {
          errs.push('"scripts.events" must list one or more events, each once, from: ' + EVENTS.join(', '));
        }
      }
    }
    return errs;
  }

  const EXPORT_NAME_RE = /^[a-z0-9_]{1,32}$/;
  const SETTING_NAME_RE = /^[a-z][a-z0-9_]{0,31}$/;
  const SETTING_KEYS = {
    bool: ['default'],
    number: ['default', 'min', 'max'],
    choice: ['default', 'choices'],
    text: ['default', 'max_length']
  };
  const SETTING_COMMON = ['name', 'type', 'label', 'description', 'scope'];
  const RANGE_CMP_RE = /^(>=|<=|>|<|=)?((?:0|[1-9][0-9]{0,8})\.(?:0|[1-9][0-9]{0,8})\.(?:0|[1-9][0-9]{0,8}))$/;

  function compareVersions(a, b) {
    const x = String(a).split('.').map(Number);
    const y = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
    return 0;
  }

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
    } else if (hiddenChar(s.label.trim(), false)) {
      errs.push(at + ' "label" must be 1 to ' + SETTING_LABEL_CHARS + ' characters ' + HIDDEN_LINE_RULE);
    }
    if (has(s, 'description') && (typeof s.description !== 'string' || cpLen(s.description) > SETTING_DESC_CHARS)) {
      errs.push(at + ' "description" must be text of at most ' + SETTING_DESC_CHARS + ' characters');
    } else if (has(s, 'description') && hiddenChar(s.description, true)) {
      errs.push(at + ' "description" must be text of at most ' + SETTING_DESC_CHARS + ' characters, ' + HIDDEN_TEXT_RULE);
    }

    if (has(s, 'scope') && SETTING_SCOPES.indexOf(s.scope) < 0) {
      errs.push(at + ' "scope" must be "world" or "client"');
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

  function dataRules(m, names) {
    let errs = linkProblems(m, 'depends').concat(linkProblems(m, 'optional_depends'), linkProblems(m, 'conflicts'));

    const LINKS = ['depends', 'optional_depends', 'conflicts'];
    for (let a = 0; a < LINKS.length; a++) {
      for (let b = a + 1; b < LINKS.length; b++) {
        if (!isObj(m[LINKS[a]]) || !isObj(m[LINKS[b]])) continue;
        for (const id of Object.keys(m[LINKS[a]])) {
          if (has(m[LINKS[b]], id)) errs.push('"' + id + '" is in both "' + LINKS[a] + '" and "' + LINKS[b] + '"');
        }
      }
    }
    if (has(m, 'data_version') && !wholeIn(m.data_version, 1, DATA_VERSION_MAX)) {
      errs.push('"data_version" must be a whole number from 1 to ' + DATA_VERSION_MAX);
    }
    if (isObj(m.scripts) && Array.isArray(m.scripts.events) && m.scripts.events.indexOf('data_migrated') >= 0 && !has(m, 'data_version')) {
      errs.push('"scripts.events" lists "data_migrated", which needs a "data_version"');
    }
    if (has(m, 'settings')) {
      const s = m.settings;
      if (!Array.isArray(s) || s.length > MAX_SETTINGS) errs.push('"settings" must be a list of at most ' + MAX_SETTINGS + ' settings');
      else {
        const seen = new Set();
        s.forEach(function (one, k) { errs = errs.concat(settingProblems(one, k, seen)); });
      }
    }
    return errs;
  }

  function manifestRules1(m, names) {
    const unknown = unknownKeyErrs(m, MANIFEST_KEYS, 'mod.json: ', UNBUILT_KEYS);
    const t = targetRules(m, names);
    const base = Object.assign({}, t.base);
    if (isObj(t.base.content) && has(t.base.content, 'items')) {
      base.content = Object.assign({}, t.base.content);
      delete base.content.items;
    }
    delete base.renames;
    const errs = unknown.concat(baseRules(base, names), itemRules(m, names), dataRules(m, names), t.errs);
    permissionRules(m, errs);
    exportRules(m, errs);
    return errs;
  }

  function exportRules(m, errs) {
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

  function itemRules(m, names) {
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
          else if (MOD_ITEM_FULL_RE.exec(k)[1] !== m.id) errs.push('"renames": ' + JSON.stringify(k) + ' must be an old id of this mod, like ' + m.id + ':old-thing');
          else if (!own || own[1] !== m.id) errs.push('"renames": ' + JSON.stringify(k) + ' must point at an item of this mod, like ' + m.id + ':thing');
          else if (k === to) errs.push('"renames": ' + JSON.stringify(k) + ' renames an item to itself');
        }
      }
    }
    return errs;
  }

  function settingValueOk(s, v) {
    if (!isObj(s)) return false;
    if (s.type === 'bool') return typeof v === 'boolean';
    if (s.type === 'number') return wholeIn(v, s.min, s.max);
    if (s.type === 'choice') return Array.isArray(s.choices) && s.choices.indexOf(v) >= 0;
    if (s.type === 'text') return typeof v === 'string' && cpLen(v) <= s.max_length && !hasControl(v);
    return false;
  }

  function declaredSettings(manifest) {
    if (!isObj(manifest) || !Array.isArray(manifest.settings)) return [];
    return manifest.settings;
  }

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

  async function settingsSha(manifest, values) {
    const eff = worldSettings(manifest, values);
    const names = Object.keys(eff).sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; });
    if (!names.length) return '';
    let text = '';
    for (const n of names) text += n + '=' + String(eff[n]) + '\n';
    return sha256Hex(new TextEncoder().encode(text));
  }

  function settingScope(s) { return isObj(s) && s.scope === 'client' ? 'client' : 'world'; }

  function worldSettings(manifest, values) {
    const eff = effectiveSettings(manifest, values);
    const out = {};
    for (const s of declaredSettings(manifest)) {
      if (isObj(s) && typeof s.name === 'string' && settingScope(s) === 'world' && has(eff, s.name)) out[s.name] = eff[s.name];
    }
    return out;
  }

  function resolveLoad(rows) {

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

    const liveIds = new Set(live.map(function (r) { return r.id; }));
    const verdict = new Map();
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

    const order = [];
    const placed = new Set();
    let left = live.slice();
    const loading = new Set(live.map(function (r) { return r.id; }));
    const optional = {};
    const wants = new Map();

    const pinAt = new Map();
    const pinPrev = new Map();
    let lastPin = null;
    for (const r of live) {
      if (!r.pinned) continue;
      pinAt.set(r.id, pinAt.size);
      if (lastPin !== null) pinPrev.set(r.id, lastPin);
      lastPin = r.id;
    }
    for (const r of live) {
      const o = r.manifest && isObj(r.manifest.optional_depends) ? r.manifest.optional_depends : {};
      const st = {};
      const present = [];
      for (const id of Object.keys(o)) {
        const t = byId.get(id);
        if (!t || !loading.has(id)) st[id] = 'absent';
        else if (!inRange(t.manifest && t.manifest.version, o[id])) st[id] = 'range';
        else if (pinAt.has(r.id) && pinAt.has(id)) st[id] = pinAt.get(id) < pinAt.get(r.id) ? 'present' : 'late';
        else { st[id] = 'present'; present.push(id); }
      }
      if (Object.keys(st).length) optional[r.id] = st;
      wants.set(r.id, present);
    }
    const needed = function (r) {
      return Object.keys(deps(r)).every(function (id) { return placed.has(id); }) &&
        (!pinPrev.has(r.id) || placed.has(pinPrev.get(r.id)));
    };
    while (left.length) {
      let next = left.find(function (r) { return needed(r) && wants.get(r.id).every(function (id) { return placed.has(id); }); });
      if (!next) {

        next = left.find(needed);
        if (!next) break;
        for (const id of wants.get(next.id)) if (!placed.has(id)) optional[next.id][id] = 'late';
      }
      order.push(next);
      placed.add(next.id);
      left = left.filter(function (r) { return r !== next; });
    }
    for (const r of left) {
      why.set(r.id, 'is in a dependency cycle (' + left.map(function (x) { return x.id; }).join(', ') + '): none of them can load');
      delete optional[r.id];
    }

    for (const id of Object.keys(optional)) {
      for (const dep of Object.keys(optional[id])) {
        if ((optional[id][dep] === 'late' || optional[id][dep] === 'present') && !placed.has(dep)) optional[id][dep] = 'absent';
      }
    }
    for (const r of on) if (why.has(r.id)) skip.push({ id: r.id, error: why.get(r.id) });
    return { order: order, skip: skip, optional: optional };
  }

  function modItemBaseOk(v) {
    return (v & 3) === 0 && ((v >= 0x1000 && v <= 0x1ffc) || (v >= 0x3000 && v <= 0x33c4));
  }

  const TEXTURE_CORE_RE = /^tex1_([0-9]+)x([0-9]+)_([0-9a-fA-F]{16})(?:_([0-9a-fA-F]{16}|\$))?_([0-9]+)\.(?:[pP][nN][gG]|[dD][dD][sS])$/;
  const TEXTURE_LABEL_RE = new RegExp('^[a-z0-9-]{1,' + TEXTURE_LABEL_CHARS + '}$');
  function textureName(base) {
    let label = '';
    let core = base;
    let badLabel = false;
    if (base.slice(0, 5) !== 'tex1_') {
      const at = base.lastIndexOf('_tex1_');
      if (at < 0) return null;
      label = base.slice(0, at);
      core = base.slice(at + 1);
      badLabel = !TEXTURE_LABEL_RE.test(label);
    }
    const m = TEXTURE_CORE_RE.exec(core);
    if (!m) return null;
    const num = function (s) { return String(Number(s)); };
    const tlut = m[4] ? m[4].toLowerCase() : '0000000000000000';
    return { label: label, core: core, badLabel: badLabel,
             key: num(m[1]) + 'x' + num(m[2]) + '_' + m[3].toLowerCase() + '_' + tlut + '_' + num(m[5]) };
  }

  function textureLabelErrs(at, folder, names) {
    const errs = [];
    const byKey = new Map();
    const under = names.filter(function (n) { return n.startsWith(folder); }).sort();
    for (const n of under) {
      const t = textureName(n.slice(n.lastIndexOf('/') + 1));
      if (!t) continue;
      if (t.badLabel) {
        errs.push({ file: n, message: at + n + ': the label before tex1_ (' + JSON.stringify(t.label) + ') must be 1 to ' +
                    TEXTURE_LABEL_CHARS + ' lowercase letters, digits and dashes, then one underscore' });
        continue;
      }
      if (!byKey.has(t.key)) byKey.set(t.key, { files: [], labelled: false });
      const g = byKey.get(t.key);
      g.files.push(n);
      if (t.label) g.labelled = true;
    }
    for (const g of byKey.values()) {
      if (g.files.length > 1 && g.labelled) {
        errs.push({ file: g.files[0], message: at + g.files.join(' and ') + ' are the same texture once labels are taken off: keep one file for a texture' });
      }
    }
    return errs;
  }
  function itemTexturesErrs(at, p, files) {
    const bad = at + '"textures" must be a folder inside the mod with files in it';
    if (typeof p !== 'string' || !p.length) return [bad];
    const dir = p.replace(/\/$/, '');
    if (pathProblem(dir)) return [bad];
    if (!files) return [];
    const folder = dir + '/';
    const under = files.names.filter(function (n) { return n.startsWith(folder); });
    if (!under.length) return [bad];
    const errs = [];
    if (typeof files.textures === 'string' && files.textures.length) {
      const t = files.textures.replace(/\/+$/, '') + '/';
      if (folder.startsWith(t) || t.startsWith(folder)) {
        errs.push(at + '"textures" folder ' + folder + ' is inside content.textures or holds it: there its pictures would change every copy of the base');
      }
    }
    if (under.length > MOD_ITEM_TEXTURE_FILES_MAX) {
      errs.push(at + '"textures" folder ' + folder + ' holds ' + under.length + ' files, at most ' + MOD_ITEM_TEXTURE_FILES_MAX);
    }
    for (const n of under) {

      const base = n.slice(n.lastIndexOf('/') + 1);
      const t = textureName(base);
      if (!ITEM_TEXTURE_NAME_RE.test(t ? t.core : base)) {
        errs.push(at + '"textures" file ' + n + ' is not a .png or .dds texture name (tex1_WxH_hash[_palette]_fmt)');
      }
    }
    return errs.concat(textureLabelErrs(at + '"textures" folder: ', folder, under).map(function (x) { return x.message; }));
  }
  function validateItems(doc, files) {
    const errs = [];
    const items = new Map();
    if (!isObj(doc) || !Array.isArray(doc.items) || doc.items.length < 1 || doc.items.length > MOD_ITEMS_MAX) {
      return { errs: (isObj(doc) ? unknownKeyErrs(doc, ITEMS_FILE_KEYS, 'items: ') : []).concat(['items: "items" must be a list of 1 to ' + MOD_ITEMS_MAX + ' items']), items: items };
    }
    errs.push.apply(errs, unknownKeyErrs(doc, ITEMS_FILE_KEYS, 'items: '));
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
      if (has(it, 'textures')) errs.push.apply(errs, itemTexturesErrs(at, it.textures, files));
      if (typeof it.id === 'string' && MOD_ITEM_ID_RE.test(it.id) && !items.has(it.id)) items.set(it.id, { base: base });
    });
    return { errs: errs, items: items };
  }

  function targetRules(m, names) {
    const errs = [];
    if (!isObj(m.content)) return { base: m, errs: errs };
    const base = Object.assign({}, m, { content: Object.assign({}, m.content) });
    for (const k of TARGET_CONTENT_KEYS) {
      if (!has(m.content, k)) continue;
      delete base.content[k];
      const p = m.content[k];
      const what = '"content.' + k + '"';
      if (typeof p !== 'string' || !p.length || pathProblem(p)) errs.push(what + ' must be a path inside the mod');
      else if (names.indexOf(p) < 0) errs.push(what + ' names ' + p + ', which is not in the mod');
    }
    return { base: base, errs: errs };
  }

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
        const r = validateItems(d, { names: names, textures: c.textures });
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
    if (c.shops) { const d = doc(c.shops); if (d !== undefined) add(c.shops, validateShops(d, Object.assign({ modId: m.id, items: null }, ctx || {}, { settings: m.settings }))); }

    let letters = null;
    if (c.letters) { const d = doc(c.letters); if (d !== undefined) { add(c.letters, validateLetters(d)); letters = letterIds(d); } else letters = undefined; }
    let days = null;
    if (c.calendar) { const d = doc(c.calendar); if (d !== undefined) { add(c.calendar, validateCalendar(d, m.scope, letters)); days = calendarIds(d); } else days = undefined; }
    if (c.talk) { const d = doc(c.talk); if (d !== undefined) add(c.talk, validateTalk(d, days)); }
    if (c.messages) { const d = doc(c.messages); if (d !== undefined) add(c.messages, validateMessages(d)); }

    if (typeof c.textures === 'string' && c.textures.length && !pathProblem(c.textures.replace(/\/+$/, ''))) {
      out.push.apply(out, textureLabelErrs('', c.textures.replace(/\/+$/, '') + '/', names));
    }
    return out;
  }

  const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const GOOD_KEYS = ['item', 'price', 'when'];
  const HOURS_KEYS = ['from', 'to'];
  function validateShops(doc, ctx) {
    const errs = isObj(doc) ? unknownKeyErrs(doc, SHOPS_FILE_KEYS, 'shops: ') : [];
    if (!isObj(doc) || !isObj(doc.shops) || Object.keys(doc.shops).length < 1) {
      return errs.concat(['shops: "shops" must be an object of shop ids, like { "nook": { ... } }']);
    }
    for (const id of Object.keys(doc.shops)) {
      const info = SHOP_INFO[id];
      if (SHOP_IDS.indexOf(id) < 0 || !info) {
        const c = closestKey(id, SHOP_IDS);
        errs.push('shops: there is no shop ' + JSON.stringify(id) + (c ? ' (did you mean "' + c + '"?)' : '') + ': the shops are ' + SHOP_IDS.join(', '));
        continue;
      }
      const v = doc.shops[id];
      const list = Array.isArray(v);
      if (list && (v.length < 1 || v.length > SHOP_BLOCKS_MAX)) {
        errs.push('shops: ' + info.words + ' takes one block or a list of 1 to ' + SHOP_BLOCKS_MAX + ' blocks');
        continue;
      }
      (list ? v : [v]).forEach(function (b, k) {
        const at = 'shops: ' + info.words + (list ? ' block ' + (k + 1) : '') + ': ';
        const path = 'shops: ' + id + (list ? ' block ' + (k + 1) : '') + ': ';
        errs.push.apply(errs, blockErrs(b, info, at, path, ctx));
      });
    }
    return errs;
  }

  function blockErrs(b, info, at, path, ctx) {
    if (!isObj(b)) return [at + 'a block must be an object'];
    const errs = unknownKeyErrs(b, SHOP_KEYS, path);
    if (errs.length) return errs;
    if (Object.keys(b).filter(function (k) { return k !== 'when'; }).length === 0) return [at + 'a block needs a field besides "when"'];
    if (has(b, 'when')) errs.push.apply(errs, whenErrs(b.when, at, path, '', ctx));
    for (const k of ['open', 'own_goods']) {
      if (has(b, k) && typeof b[k] !== 'boolean') errs.push(at + '"' + k + '" must be true or false');
    }
    for (const k of ['price_percent', 'buy_back_percent']) {
      if (has(b, k) && (typeof b[k] !== 'number' || !Number.isInteger(b[k]) || b[k] < 1 || b[k] > SHOP_PERCENT_MAX)) {
        errs.push(at + '"' + k + '" must be a whole number from 1 to ' + SHOP_PERCENT_MAX);
      }
    }

    if (has(b, 'goods') && info.fields.indexOf('goods') >= 0) errs.push.apply(errs, goodsErrs(b.goods, info, at, path, ctx));
    if (has(b, 'services')) {
      const s = b.services;
      if (!isObj(s) || Object.keys(s).length < 1) errs.push(at + '"services" must be an object of service to Bells');
      else if (info.fields.indexOf('services') >= 0) {
        for (const name of Object.keys(s)) {
          if (info.services.indexOf(name) < 0) errs.push(at + '"services" has no ' + JSON.stringify(name) + ': ' + info.words + ' has ' + info.services.join(' '));
          else if (typeof s[name] !== 'number' || !Number.isInteger(s[name]) || s[name] < 1 || s[name] > SHOP_PRICE_MAX) {
            errs.push(at + '"services" ' + JSON.stringify(name) + ' must be a whole number of Bells from 1 to ' + SHOP_PRICE_MAX);
          }
        }
      }
    }

    if (has(b, 'name') && (typeof b.name !== 'string' || cpLen(b.name) < 1 || cpLen(b.name) > SHOP_NAME_CHARS || b.name.indexOf('\n') >= 0)) {
      errs.push(at + '"name" must be 1 to ' + SHOP_NAME_CHARS + ' characters on one line');
    }
    if (has(b, 'lines')) {
      const l = b.lines;
      if (!isObj(l) || Object.keys(l).length < 1) errs.push(at + '"lines" must be an object of slot to a line or a list of lines');
      else if (info.fields.indexOf('lines') >= 0) {
        for (const slot of Object.keys(l)) {
          if (info.lines.indexOf(slot) < 0) { errs.push(at + '"lines" has no slot ' + JSON.stringify(slot) + ': the slots are ' + info.lines.join(' ')); continue; }
          const v = l[slot];
          const all = typeof v === 'string' ? [v] : Array.isArray(v) && v.length >= 1 && v.length <= SHOP_LINES_MAX ? v : null;
          const ok = all && all.every(function (t) {
            return typeof t === 'string' && cpLen(t) >= 1 && cpLen(t) <= SHOP_LINE_CHARS && t.split('\n').length - 1 <= SHOP_LINE_NEWLINES;
          });
          if (!ok) {
            errs.push(at + '"lines" ' + JSON.stringify(slot) + ' must be a line or a list of 1 to ' + SHOP_LINES_MAX + ' lines, each 1 to ' +
              SHOP_LINE_CHARS + ' characters with at most ' + SHOP_LINE_NEWLINES + ' line breaks');
          }
        }
      }
    }
    return errs;
  }

  function whenErrs(w, at, path, whose, ctx) {
    const sub = whose ? whose + ' ' : '';
    if (!isObj(w) || Object.keys(w).length < 1) {
      return [at + sub + '"when" must be an object with at least one of ' + WHEN_KEYS.join(', ')];
    }
    const errs = unknownKeyErrs(w, WHEN_KEYS, path + (whose ? whose + ': ' : '') + 'when: ');
    if (errs.length) return errs;
    if (has(w, 'hours')) {
      const h = w.hours;
      if (isObj(h)) {
        const u = unknownKeyErrs(h, HOURS_KEYS, path + (whose ? whose + ': ' : '') + 'when: ');
        if (u.length) return u;
      }
      if (!isObj(h) || typeof h.from !== 'string' || typeof h.to !== 'string' || !HHMM_RE.test(h.from) || !HHMM_RE.test(h.to)) {
        errs.push(at + sub + '"hours" must be { "from": "HH:MM", "to": "HH:MM" }, 00:00 to 23:59');
      } else if (h.from === h.to) errs.push(at + sub + '"hours" from and to must differ');
    }
    const one = function (k, list, words) {
      if (has(w, k) && list.indexOf(w[k]) < 0) errs.push(at + sub + '"when": "' + k + '" must be ' + words);
    };
    one('time', ['morning', 'day', 'evening', 'night'], 'morning, day, evening or night');
    one('season', ['spring', 'summer', 'fall', 'winter'], 'spring, summer, fall or winter');
    one('weather', ['clear', 'rain', 'snow'], 'clear, rain or snow');
    const distinct = function (v, ok, max) {
      return Array.isArray(v) && v.length >= 1 && v.length <= max && v.every(ok) && new Set(v).size === v.length;
    };
    if (has(w, 'weekday') && !distinct(w.weekday, function (d) { return WEEKDAYS.indexOf(d) >= 0; }, 7)) {
      errs.push(at + sub + '"when": "weekday" must list 1 to 7 different days, monday to sunday');
    }
    if (has(w, 'month') && !distinct(w.month, function (m) { return Number.isInteger(m) && m >= 1 && m <= 12; }, 12)) {
      errs.push(at + sub + '"when": "month" must list 1 to 12 different months, 1 to 12');
    }
    if (has(w, 'setting')) {
      const list = ctx && Array.isArray(ctx.settings) ? ctx.settings : [];
      const s = typeof w.setting === 'string' ? list.find(function (x) { return isObj(x) && x.name === w.setting; }) : null;
      if (!s || s.type !== 'bool' || s.scope === 'client') {
        errs.push(at + sub + '"when": "setting" must name a bool setting of this mod with scope world' + (typeof w.setting === 'string' ? ': ' + w.setting : ''));
      }
    }
    return errs;
  }

  function goodsErrs(goods, info, at, path, ctx) {
    const max = info.goods || NOOK_STOCK_MAX;
    if (!Array.isArray(goods) || goods.length < 1 || goods.length > max) {
      return [at + '"goods" must list 1 to ' + max + ' goods'];
    }
    const errs = [];
    const seen = new Set();
    const bases = new Set();
    goods.forEach(function (it, k) {
      const no = 'goods ' + (k + 1);
      if (isObj(it)) {
        const u = unknownKeyErrs(it, GOOD_KEYS, path + no + ': ');
        if (u.length) { errs.push.apply(errs, u); return; }
      }

      const own = isObj(it) && typeof it.item === 'string' && ctx && ctx.items ? MOD_ITEM_FULL_RE.exec(it.item) : null;
      if (own) {
        if (own[1] !== ctx.modId || !ctx.items.has(own[2])) {
          errs.push(at + no + ' "item" is not an item in this mod\'s items file: ' + it.item);
          return;
        }
      } else if (!isObj(it) || typeof it.item !== 'string' || !ITEM_RE.test(it.item)) {
        errs.push(at + no + ' "item" must be "0x" and 4 hex digits, or an item of this mod' + (isObj(it) && typeof it.item === 'string' ? ': ' + it.item : ''));
        return;
      }

      const key = own ? it.item : parseInt(it.item.slice(2), 16);
      const base = own ? ctx.items.get(own[2]).base : key;
      if (seen.has(key)) errs.push(at + no + ' is a duplicate item: ' + it.item);
      else if (base >= 0 && bases.has(base)) errs.push(at + no + ' shares its furniture with another good: ' + it.item);
      seen.add(key);
      if (base >= 0) bases.add(base);

      if (!own && FTR_NO_MODEL.indexOf(ftrIndex(key)) >= 0) {
        errs.push(at + no + ' "item" ' + it.item + ' has no model in the game: it would stand as a placeholder sign');
      }
      if (has(it, 'price') && (typeof it.price !== 'number' || !Number.isInteger(it.price) || it.price < 1 || it.price > SHOP_PRICE_MAX)) {
        errs.push(at + no + ' "price" must be a whole number from 1 to ' + SHOP_PRICE_MAX);
      }
      if (has(it, 'when')) errs.push.apply(errs, whenErrs(it.when, at, path, no, ctx));
    });
    return errs;
  }

  function ftrIndex(n) {
    const t = n >> 12;
    return t === 1 ? (n - 0x1000) >> 2 : t === 3 ? 0x400 + ((n - 0x3000) >> 2) : -1;
  }

  function validateMessages(doc) {
    if (!isObj(doc)) return ['messages: the file is not a JSON object of key to text'];
    const errs = [];
    const keys = Object.keys(doc);
    if (keys.length > MESSAGES_MAX) errs.push('messages: a messages file has at most ' + MESSAGES_MAX + ' lines');
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

  function validateLetters(doc) {
    const top = isObj(doc) ? unknownKeyErrs(doc, LETTERS_FILE_KEYS, 'letters: ') : [];
    if (!isObj(doc) || !Array.isArray(doc.letters) || doc.letters.length < 1 || doc.letters.length > LETTERS_MAX) {
      return top.concat(['letters: "letters" must be a list of 1 to ' + LETTERS_MAX + ' letters']);
    }
    let errs = top.concat(idErrs(doc.letters, 'letters: letter'));
    doc.letters.forEach(function (L, k) {
      const at = 'letters: letter ' + (k + 1) + ' ';
      if (!isObj(L)) { errs.push(at + 'is not an object'); return; }
      errs = errs.concat(unknownKeyErrs(L, LETTER_KEYS, 'letters: letter ' + (k + 1) + ': '));
      const h = plainLen(L.header, false, true);
      if (h < 1 || h > LETTER_HEADER_MAX || (typeof L.header === 'string' && L.header.split('{player}').length > 2)) {
        errs.push(at + '"header" must be 1 to ' + LETTER_HEADER_MAX + ' plain characters besides one {player}');
      }
      if (!paperOk(L.body)) errs.push(at + '"body" must be 1 to ' + PAPER_BYTES + ' plain characters on at most ' + PAPER_LINES + ' lines' + paperCharNote(L.body));
      const f = plainLen(L.footer, false, false);
      if (f < 1 || f > LETTER_FOOTER_MAX) errs.push(at + '"footer" must be 1 to ' + LETTER_FOOTER_MAX + ' plain characters');

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

  function talkPageOk(v) {
    return typeof v === 'string' && cpLen(v) >= 1 && cpLen(v) <= TALK_LINE_CHARS && v.split('\n').length - 1 <= TALK_LINE_NEWLINES;
  }

  function talkLineOk(v) {
    if (Array.isArray(v)) return v.length >= 1 && v.length <= TALK_PAGES_MAX && v.every(talkPageOk);
    return talkPageOk(v);
  }

  const TALK_LINE_RULE = 'lines of 1 to ' + TALK_LINE_CHARS + ' characters with at most ' + TALK_LINE_NEWLINES +
    ' line breaks, or lists of 1 to ' + TALK_PAGES_MAX + ' such pages';

  function calendarIds(doc) {
    const ids = new Set();
    if (isObj(doc) && Array.isArray(doc.days)) doc.days.forEach(function (d) { if (isObj(d) && typeof d.id === 'string') ids.add(d.id); });
    return ids;
  }

  function letterIds(doc) {
    const ids = new Set();
    if (isObj(doc) && Array.isArray(doc.letters)) doc.letters.forEach(function (L) { if (isObj(L) && typeof L.id === 'string') ids.add(L.id); });
    return ids;
  }

  function validateCalendar(doc, scope, letters) {
    const top = isObj(doc) ? unknownKeyErrs(doc, CALENDAR_FILE_KEYS, 'calendar: ') : [];
    if (!isObj(doc) || !Array.isArray(doc.days) || doc.days.length < 1 || doc.days.length > CALENDAR_MAX) {
      return top.concat(['calendar: "days" must be a list of 1 to ' + CALENDAR_MAX + ' days']);
    }
    const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let errs = top.concat(idErrs(doc.days, 'calendar: day'));
    doc.days.forEach(function (e, k) {
      const at = 'calendar: day ' + (k + 1) + ' ';
      if (!isObj(e)) { errs.push(at + 'is not an object'); return; }
      errs = errs.concat(unknownKeyErrs(e, CALENDAR_DAY_KEYS, 'calendar: day ' + (k + 1) + ': '));
      const d = e.date;
      if (isObj(d)) errs = errs.concat(unknownKeyErrs(d, CALENDAR_DATE_KEYS, 'calendar: day ' + (k + 1) + ': date: '));
      let dateOk = isObj(d) && wholeIn(d.month, 1, 12);
      if (dateOk && has(d, 'day')) dateOk = !has(d, 'week') && !has(d, 'weekday') && wholeIn(d.day, 1, DAYS[d.month - 1]);
      else if (dateOk) dateOk = (d.week === 'last' || wholeIn(d.week, 1, 4)) && wholeIn(d.weekday, 0, 6);
      if (!dateOk) errs.push(at + '"date" must be { "month", "day" } or { "month", "week" (1 to 4 or "last"), "weekday" (0 Sunday to 6) }');
      if (has(e, 'letter')) {
        if (typeof e.letter !== 'string' || !MSG_KEY_RE.test(e.letter)) errs.push(at + '"letter" must be the id of a letter in this mod\'s letters file');
        else if (letters !== undefined && !(letters && letters.has(e.letter))) errs.push(at + '"letter" ' + JSON.stringify(e.letter) + ' names no letter in this mod\'s letters file');
      }
      if (has(e, 'board')) {
        if (!paperOk(e.board)) errs.push(at + '"board" must be 1 to ' + PAPER_BYTES + ' plain characters on at most ' + PAPER_LINES + ' lines' + paperCharNote(e.board));
        if (scope !== 'world') errs.push(at + '"board" changes the town, so "scope" must be "world"');
      }
    });
    return errs;
  }

  function validateTalk(doc, days) {
    const errs = isObj(doc) ? unknownKeyErrs(doc, TALK_FILE_KEYS, 'talk: ') : [];
    if (!isObj(doc) || !Array.isArray(doc.pools) || doc.pools.length < 1 || doc.pools.length > POOLS_MAX) {
      return errs.concat(['talk: "pools" must be a list of 1 to ' + POOLS_MAX + ' pools']);
    }
    doc.pools.forEach(function (p, k) {
      const at = 'talk: pool ' + (k + 1) + ' ';
      if (!isObj(p)) { errs.push(at + 'is not an object'); return; }
      errs.push.apply(errs, unknownKeyErrs(p, TALK_POOL_KEYS, 'talk: pool ' + (k + 1) + ': '));
      if (!has(p, 'place')) errs.push(at + '"place" is required: before, hello, topic, after or conversation');
      else if (TALK_PLACES.indexOf(p.place) < 0) errs.push(at + '"place" must be before, hello, topic, after or conversation');
      if (has(p, 'topics')) {
        const t = p.topics;
        const list = Array.isArray(t) && t.length >= 1 && t.length <= TALK_TOPICS.length &&
          t.every(function (x, i) { return TALK_TOPICS.indexOf(x) >= 0 && t.indexOf(x) === i; });
        if (p.place !== 'topic') errs.push(at + '"topics" goes only with "place": "topic"');
        else if (t !== 'any' && !list) errs.push(at + '"topics" must be "any" or a list of small_talk, trade, letter, memory, hint and news');
      }
      if (has(p, 'day')) {
        if (typeof p.day !== 'string' || !MSG_KEY_RE.test(p.day)) errs.push(at + '"day" must be the id of a day in this mod\'s calendar file');
        else if (days !== undefined && !(days && days.has(p.day))) errs.push(at + '"day" ' + JSON.stringify(p.day) + ' names no day in this mod\'s calendar file');
      }
      if (has(p, 'personality') && has(p, 'villager')) errs.push(at + 'names a "personality" or a "villager", not both');
      if (has(p, 'personality') && PERSONALITIES.indexOf(p.personality) < 0) {
        errs.push(at + '"personality" must be one of ' + PERSONALITIES.join(', '));
      }
      if (has(p, 'villager')) {
        const n = plainLen(p.villager, false, false);
        if (n < 1 || n > VILLAGER_CHARS) errs.push(at + '"villager" must be a name of 1 to ' + VILLAGER_CHARS + ' plain characters');
      }
      TALK_WHEN.forEach(function (w) {
        if (has(p, w[0]) && w[1].indexOf(p[w[0]]) < 0) errs.push(at + '"' + w[0] + '" must be ' + w[2]);
      });
      if (has(p, 'chance') && !wholeIn(p.chance, 1, 100)) errs.push(at + '"chance" must be a whole number from 1 to 100');
      if (!Array.isArray(p.lines) || p.lines.length < 1 || p.lines.length > POOL_LINES_MAX || !p.lines.every(talkLineOk)) {
        errs.push(at + '"lines" must list 1 to ' + POOL_LINES_MAX + ' ' + TALK_LINE_RULE);
      }
    });
    return errs;
  }

  function hex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function sha256Hex(bytes) {
    return hex(await root.crypto.subtle.digest('SHA-256', bytes));
  }

  async function contentSha(entries) {
    const names = Object.keys(entries).sort();
    let text = '';
    for (const n of names) text += (await sha256Hex(entries[n])) + ' ' + n + '\n';
    return sha256Hex(new TextEncoder().encode(text));
  }

  async function modsetHash(mods) {
    const lines = [];

    for (const m of mods) {
      if (!m.enabled || !countsForVisits(m.manifest)) continue;
      const ss = await settingsSha(m.manifest, m.settings);
      lines.push(m.id + '@' + m.manifest.version + '#' + m.contentSha + (ss ? '+' + ss : ''));
    }
    if (!lines.length) return '';
    return sha256Hex(new TextEncoder().encode(lines.join('\n')));
  }

  const VANILLA_OUTPUT_COMMANDS = ['send_letter', 'give_item', 'show_line', 'ask', 'take_item', 'take_bells'];

  function countsForVisits(m) {
    if (!isObj(m) || m.scope !== 'world') return false;
    const c = isObj(m.content) ? m.content : {};

    if (has(c, 'textures') || has(c, 'shops') || has(c, 'items')) return true;
    if (!has(m, 'permissions')) return false;
    const p = m.permissions;
    if (!Array.isArray(p)) return true;
    return p.some(function (x) { return typeof x !== 'string' || VANILLA_OUTPUT_COMMANDS.indexOf(x) < 0; });
  }

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
        e.settings = worldSettings(m.manifest, m.settings);
      }
      out.push(e);
    }
    return out;
  }

  function unzip(bytes, fflate) {
    if (!fflate || !fflate.unzipSync) throw ruleError('ZIP support is unavailable (fflate.umd.min.js failed to load). Please reload the page');
    let total = 0;
    let count = 0;
    const seen = new Set();
    try {
      return fflate.unzipSync(bytes, {

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

  function readMod(bytes, fflate, opts) {
    if (bytes.length > MAX_ZIP) fail(['the ZIP is over ' + (MAX_ZIP / MIB) + ' MB']);
    const raw = unzip(bytes, fflate);
    if (!(opts && opts.trusted)) checkCrcs(bytes, raw, fflate);
    return readEntries(raw);
  }

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

  function enabledCap() { return lowMemoryDevice() ? PHONE_MAX_ENABLED_UNPACKED : MAX_ENABLED_UNPACKED; }

  function mbWords(bytes) {
    const mb = (bytes || 0) / MIB;
    return (mb < 10 && Math.round(mb) !== mb ? mb.toFixed(1) : String(Math.round(mb))) + ' MB';
  }

  function capWords(cap) {
    return mbWords(cap) + ' the game keeps for mods' + (cap < MAX_ENABLED_UNPACKED ? ' on a phone' : '');
  }

  function fillWords(cap, size) {
    if (size > cap) return 'it unpacks to ' + mbWords(size) + ', more than the ' + capWords(cap);
    return 'the mods before it already fill the ' + capWords(cap);
  }

  const PERSIST_KEY = 'acweb.mods.persist';
  function askPersist() {
    try {
      if (root.localStorage.getItem(PERSIST_KEY) === '1') return;
      root.localStorage.setItem(PERSIST_KEY, '1');
    } catch (_) {   }
    try {
      const st = root.navigator && root.navigator.storage;
      if (st && typeof st.persist === 'function') Promise.resolve(st.persist()).catch(function () {});
    } catch (_) {   }
  }

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

  const COUNT_KEY = townKey('acweb.mods.n');
  const CLEARED_KEY = townKey('acweb.mods.cleared');
  function rememberCount(n) {
    try { root.localStorage.setItem(COUNT_KEY, String(n)); } catch (_) {   }
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

  function takeClearedNotice() {
    try {
      if (root.localStorage.getItem(CLEARED_KEY) === null) return false;
      root.localStorage.removeItem(CLEARED_KEY);
      return true;
    } catch (_) { return false; }
  }

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

  function idb() { return root.indexedDB; }

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

  const OPEN_DB_TIMEOUT_MS = 5000;

  function openDb(name) {
    return new Promise(function (resolve, reject) {
      let req;
      let settled = false;

      const hasTimers = typeof root.setTimeout === 'function' && typeof root.clearTimeout === 'function';
      const timer = hasTimers ? root.setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error('the mods database did not open in ' + (OPEN_DB_TIMEOUT_MS / 1000) + ' seconds'));
      }, OPEN_DB_TIMEOUT_MS) : null;
      const settle = function () {
        if (settled) return false;
        settled = true;
        if (hasTimers) root.clearTimeout(timer);
        return true;
      };
      try { req = idb().open(name || DB_NAME, DB_VERSION); } catch (e) { if (settle()) reject(e); return; }
      req.onupgradeneeded = function () {
        try { upgradeDb(req.result, req.transaction); } catch (e) {
          try { if (req.transaction) req.transaction.abort(); } catch (_) {   }
        }
      };
      req.onsuccess = function () {
        const db = req.result;

        if (!settle()) { try { db.close(); } catch (_) {   } return; }

        try { db.onversionchange = function () { try { db.close(); } catch (_) {   } }; } catch (_) {   }
        resolve(db);
      };
      req.onerror = function () { if (settle()) reject(req.error || new Error('the mods database could not be opened')); };
      req.onblocked = function () { if (settle()) reject(new Error('the mods database is held open by another tab')); };
    });
  }

  function metaOf(v) {
    const m = {};
    for (const k of Object.keys(v)) if (k !== 'zip') m[k] = v[k];
    return m;
  }

  function rowWriter(mods, zips) {
    return {
      put: function (row) {
        if (row.zip) zips.put({ id: row.id, zip: row.zip });
        mods.put(metaOf(row));
      },
      delete: function (k) { mods.delete(k); zips.delete(k); }
    };
  }

  function withRows(db, mode, body) {
    return new Promise(function (resolve, reject) {
      let t;
      try { t = db.transaction(['mods', 'zips'], mode); } catch (e) { reject(e); return; }
      const ctl = {
        result: undefined, error: null,
        fail: function (e) { ctl.error = e; try { t.abort(); } catch (_) {   } }
      };
      t.oncomplete = function () { if (ctl.error) reject(ctl.error); else resolve(ctl.result); };
      t.onabort = function () { reject(ctl.error || t.error || new Error('the mods database refused the change')); };
      t.onerror = function () {   };
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

  function clearFlag() { try { root.localStorage.removeItem(FLAG); } catch (_) {   } }

  function rememberModset(h, list) {

    if (devTainted()) { h = devMarker(); list = []; }
    try { root.localStorage.setItem(MODSET_KEY, h); } catch (e) { console.warn('[Mods] could not store the mod set for visits:', e); }
    try {
      if (h && list && list.length) root.localStorage.setItem(MODLIST_KEY, JSON.stringify(list));
      else root.localStorage.removeItem(MODLIST_KEY);
    } catch (_) {   }
  }

  function summary(r) {
    return { id: r.id, manifest: r.manifest, sha256: r.sha256, contentSha: r.contentSha, size: r.size,
             unpacked: r.unpacked, enabled: r.enabled, order: r.order, source: r.source, installedAt: r.installedAt,
             removed: r.removed, registry: r.registry, settings: r.settings || {} };
  }

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
    if (typeof f.databases !== 'function') return true;
    try {
      const all = await f.databases();
      return all.some(function (d) { return d.name === DB_NAME; });
    } catch (_) { return true; }
  }

  async function list() {
    if (!flagOn() && !(await databaseExists())) return [];
    const db = await openDb();
    try {
      const rows = await withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
      if (rows.length && !flagOn()) { try { ensureFlag(); } catch (_) {   } }
      return rows.map(summary);
    } finally { db.close(); }
  }

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

        const stillRemoved = !!(prev && prev.removed && prev.contentSha === csha);
        const unkilled = !!(prev && prev.removed && !stillRemoved);
        const row = {
          id: mod.manifest.id, manifest: mod.manifest, zip: bytes.slice().buffer, sha256: sha, contentSha: csha,
          size: bytes.length, unpacked: mod.unpacked, enabled: stillRemoved ? false : (prev && !unkilled ? prev.enabled : true), order: order,
          source: (opts && opts.source) || 'file', installedAt: Date.now()
        };
        if (stillRemoved) { row.removed = prev.removed; row.registry = prev.registry; }

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

      try { ensureFlag(); } catch (_) {   }
      await refreshModset(db);
      askPersist();
      notifyChanged();
      return out;
    } finally { db.close(); }
  }

  async function update(fn) {
    const db = await openDb();
    try {
      await withRows(db, 'readwrite', function (rows, store, ctl) {
        const next = fn(rows);
        for (const r of next.put || []) store.put(r);
        for (const k of next.del || []) store.delete(k);
        ctl.result = true;
      });

      await refreshModset(db);
    } finally { db.close(); }
    notifyChanged();
  }

  function notifyChanged() {
    const wins = [root];
    try { if (root.parent && root.parent !== root) wins.push(root.parent); } catch (_) {   }
    const st = typeof root.setTimeout === 'function' ? root.setTimeout : null;
    for (const w of wins) {
      let hook = null;
      try { hook = typeof w._acwebHostModsChanged === 'function' ? w._acwebHostModsChanged : null; } catch (_) { hook = null; }
      if (!hook) continue;
      const call = function () { try { hook.call(w, api); } catch (_) {   } };
      if (st) st(call, 0); else call();
      return;
    }
  }

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

  async function remove(id, opts) {

    await update(function () { return { del: [id] }; });
    if (opts && opts.deleteData) addWipe(id);
  }

  const WIPE_KEY = townKey('acweb.mods.wipe');
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

  function dropWipe(ids) {
    const left = pendingWipe().filter(function (x) { return ids.indexOf(x) < 0; });
    try {
      if (left.length) root.localStorage.setItem(WIPE_KEY, JSON.stringify(left));
      else root.localStorage.removeItem(WIPE_KEY);
    } catch (_) {   }
  }

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
      }, function () {   });
    };

    if (st) st.call(root, run, 0); else run();
  }
  root._acwebModsWiped = wipeDone;

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

  function deleteSavedData(id) {
    if (!ID_RE.test(String(id))) throw ruleError('that is not a mod id');
    addWipe(String(id));
  }

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

      let full = await readRow(r.id);
      if (!full || !full.zip) continue;
      add(file, new Uint8Array(full.zip));
      full = null;
      list.push({ id: r.id, version: r.manifest.version, file: file, enabled: !!r.enabled, order: r.order,
                  settings: isObj(r.settings) ? r.settings : {}, source: r.source || 'file' });
    }
    const doc = { schema: 1, exported_at: new Date().toISOString(), mods: list };

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

  function skipNextBoot() {
    try { root.localStorage.setItem(SKIP_KEY, '1'); return root.localStorage.getItem(SKIP_KEY) === '1'; } catch (_) { return false; }
  }

  function noModsInUrl() {
    const wins = [root];
    try { if (root.parent && root.parent !== root) wins.push(root.parent); } catch (_) {   }
    return wins.some(function (w) {
      try { return !!w.location && new URLSearchParams(w.location.search).get('nomods') === '1'; } catch (_) { return false; }
    });
  }

  function consumeSkip() {
    let skip = false;
    try {
      skip = root.localStorage.getItem(SKIP_KEY) === '1';
      if (skip) root.localStorage.removeItem(SKIP_KEY);
    } catch (_) {   }
    return skip || noModsInUrl();
  }

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
    } catch (_) {   }
    return null;
  }

  function isRegistry(r) { return typeof r.source === 'string' && r.source.indexOf('registry:') === 0; }

  function statusQuery(rows) {
    const query = [];
    const ids = [];
    for (const r of rows) {
      if (typeof r.contentSha !== 'string' || !HEX64_RE.test(r.contentSha)) continue;
      const q = { content_sha: r.contentSha };

      if ((isRegistry(r) || r.lent) && r.manifest) { q.id = r.modId || r.id; q.version = r.manifest.version; }
      query.push(q);
      ids.push(r.id);
    }
    return { query: query, ids: ids };
  }

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

  let statusKill = null;

  const KILL_KEY = 'acweb.mods.killed';
  const KILL_REMOVED_MAX = 512;
  function readKillMemory() {
    try {
      const m = JSON.parse(root.localStorage.getItem(KILL_KEY) || 'null');
      if (isObj(m) && isObj(m.removed)) return { v: 1, at: m.at || 0, kill: isObj(m.kill) && typeof m.kill.message === 'string' ? { message: m.kill.message.slice(0, 300) } : null, removed: m.removed };
    } catch (_) {   }
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
    } catch (_) {   }
  }

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

  async function checkStatus(rows, opts) {
    statusKill = null;
    const q = statusQuery(rows);
    if (!q.query.length) return null;
    const send = (opts && opts.transport) || statusTransport();
    if (!send) return rememberedStatus(q, {}, false);
    const ms = (opts && opts.timeoutMs) || STATUS_TIMEOUT_MS;

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

      const code = typeof a.reason_code === 'string' && /^[a-z_]{1,40}$/.test(a.reason_code) ? a.reason_code : '';
      if (a.status === 'removed') {
        if (!r.removed || r.removed.reason !== reason || (r.removed.code || '') !== code) r.removed = { reason: reason, code: code, at: now };
        r.enabled = false;
      } else if (r.removed) {
        delete r.removed;
      }
      if (a.remembered) { if (key(r) !== before) changed.push(r); continue; }
      r.registry = { status: a.status, reason: reason, reason_code: code, latest: cleanLatest(a.latest, r.manifest && r.manifest.version), checkedAt: now };
      if (key(r) !== before) changed.push(r);
    }
    return changed;
  }

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

  async function refreshStatus(opts) {
    const rows = await list();
    if (!rows.length) return rows;
    const answers = await checkStatus(rows, opts);
    if (!answers) return rows;
    await storeStatus(answers, Date.now());
    return list();
  }

  function mkdirs(FS, path) {
    let at = '';
    for (const part of path.split('/').filter(Boolean)) {
      at += '/' + part;
      try { FS.mkdir(at); } catch (_) {   }
    }
  }

  function bootRows(db) {
    return withRows(db, 'readonly', function (rows, _s, ctl) { ctl.result = rows; });
  }

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
        t.onerror = function () {   };
        const req = t.objectStore('mods').get(id);
        req.onsuccess = function () { row = req.result || undefined; };
        const zreq = t.objectStore('zips').get(id);
        zreq.onsuccess = function () { zip = zreq.result || undefined; };
      });
    } finally { db.close(); }
  }

  function rmrf(FS, path) {
    try {
      const st = FS.stat(path);
      if (FS.isDir(st.mode)) {
        for (const n of FS.readdir(path)) if (n !== '.' && n !== '..') rmrf(FS, path + '/' + n);
        FS.rmdir(path);
      } else FS.unlink(path);
    } catch (_) {   }
  }

  const LENT_DB_PREFIX = 'acweb-mods-lent-';
  const LENT_DB_LEGACY = 'acweb-mods-lent';
  const LENT_KEY = 'acweb.mods.lent';
  const LENT_DB_KEY = 'acweb.mods.lentdb';
  const LENT_DBS_KEY = 'acweb.mods.lentdbs';
  const LENT_TTL_MS = 12 * 60 * 60 * 1000;
  const LENT_DB_RE = /^acweb-mods-lent-(\d{1,15})-[0-9a-f]{8}$/;

  function sessionStore() { try { return root.sessionStorage || null; } catch (_) { return null; } }

  function cityProblem(m) {
    if (!isObj(m)) return 'mod.json is not a JSON object';
    const c = isObj(m.content) ? m.content : {};
    const extra = Object.keys(c).filter(function (k) { return k !== 'textures' && k !== 'messages'; });
    if (extra.length) return 'a City mod may only hold textures and lines, not ' + extra.join(', ');
    if (has(m, 'scripts')) return 'a City mod may not run scripts';
    if (has(m, 'permissions') && !(Array.isArray(m.permissions) && m.permissions.length === 0)) return 'a City mod may not ask for commands';
    return '';
  }

  function lentState() {
    const ss = sessionStore();
    let v = null;
    try { v = ss ? JSON.parse(ss.getItem(LENT_KEY) || 'null') : null; } catch (_) { v = null; }
    const ok = v && typeof v.visitId === 'string' && typeof v.modset === 'string' && (HEX64_RE.test(v.modset) || v.kind === 'city') &&
      typeof v.db === 'string' && LENT_DB_RE.test(v.db) &&
      Array.isArray(v.set) && v.set.length > 0 && typeof v.at === 'number' && Date.now() - v.at < LENT_TTL_MS &&
      v.set.every(function (m) { return m && ID_RE.test(m.id) && typeof m.version === 'string' && HEX64_RE.test(m.contentSha); });
    if (!ok) {
      if (v) { try { ss.removeItem(LENT_KEY); } catch (_) {   } }
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
    } catch (_) {   }
  }

  function dropDb(name) {
    return new Promise(function (resolve) {
      try {
        const req = idb().deleteDatabase(name);
        req.onsuccess = req.onerror = req.onblocked = function () { resolve(); };
      } catch (_) { resolve(); }
    });
  }

  async function deleteLentDb(name) {
    if (!name) return;
    await dropDb(name);
    setLentDbNames(lentDbNames().filter(function (n) { return n !== name; }));
  }

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
    } catch (_) {   }
    let legacy = false;
    try { legacy = root.localStorage.getItem(LENT_DB_KEY) === '1'; } catch (_) { legacy = false; }
    if (legacy) names.add(LENT_DB_LEGACY);
    for (const n of names) {
      if (n === keep) continue;
      if (n === LENT_DB_LEGACY) {
        await dropDb(n);
        try { root.localStorage.removeItem(LENT_DB_KEY); } catch (_) {   }
        continue;
      }
      const m = LENT_DB_RE.exec(n);
      if (m && now - Number(m[1]) >= LENT_TTL_MS) await deleteLentDb(n);
    }
  }

  async function clearLent() {
    const ss = sessionStore();
    let db = null;
    try {
      const v = ss ? JSON.parse(ss.getItem(LENT_KEY) || 'null') : null;
      if (v && typeof v.db === 'string' && LENT_DB_RE.test(v.db)) db = v.db;
    } catch (_) { db = null; }
    try { if (ss) ss.removeItem(LENT_KEY); } catch (_) {   }
    await deleteLentDb(db);
  }

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

  async function lendRoom(ids) {
    let own = [];
    try { own = apiFilter(await ownBesideLent(Array.isArray(ids) ? ids : [])).rows; } catch (_) { own = []; }
    return { cap: enabledCap(), own: own.reduce(function (n, r) { return n + (r.unpacked || 0); }, 0) };
  }

  async function ownSettingsOf(ids) {
    const out = {};
    if (!flagOn()) return out;
    const db = await openDb();
    try {
      const rows = await bootRows(db);
      for (const r of rows) if (ids.indexOf(r.id) >= 0 && isObj(r.settings)) out[r.id] = r.settings;
    } finally { db.close(); }
    return out;
  }

  function clientSettings(manifest, stored) {
    const out = {};
    for (const s of declaredSettings(manifest)) {
      if (!isObj(s) || typeof s.name !== 'string' || settingScope(s) !== 'client') continue;
      if (isObj(stored) && has(stored, s.name) && settingValueOk(s, stored[s.name])) out[s.name] = stored[s.name];
    }
    return out;
  }

  function wontLoad(why) { return ruleError('the friend\'s mods would not all load here: ' + why); }

  function lentSettings(manifest, sent) {

    const decl = declaredSettings(manifest).filter(function (s) { return isObj(s) && typeof s.name === 'string' && settingScope(s) === 'world'; });
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

  async function lend(expect) {

    const city = !!expect && expect.kind === 'city';
    if (!expect || typeof expect.visitId !== 'string' || (!city && !HEX64_RE.test(expect.modset || '')) ||
        !Array.isArray(expect.mods) || !expect.mods.length || expect.mods.length > MAX_ENABLED) {
      throw ruleError(city ? 'the City mod list could not be read' : 'the friend\'s mod list could not be read');
    }
    const lentIds = expect.mods.map(function (w) { return w && typeof w.id === 'string' ? w.id : ''; });
    let own = [];
    if (!city) {
      try { own = await ownBesideLent(lentIds); } catch (_) { own = [];   }
      own = apiFilter(own).rows.filter(function (r) { return !bootRefused(r); });
    }
    const cap = enabledCap();
    const ownUnpacked = own.reduce(function (n, r) { return n + (r.unpacked || 0); }, 0);
    let mine = {};
    if (!city) { try { mine = await ownSettingsOf(lentIds); } catch (_) { mine = {};   } }
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

      if (ownUnpacked + unpacked > cap) {
        throw wontLoad('they unpack to ' + mbWords(unpacked) + (ownUnpacked ? ' beside ' + mbWords(ownUnpacked) + ' of your own mods' : '') +
          ', and the game keeps ' + mbWords(cap) + ' for mods' + (cap < MAX_ENABLED_UNPACKED ? ' on a phone' : ''));
      }

      const row = { id: m.id, manifest: m, zip: bytes.slice().buffer, contentSha: csha, unpacked: mod.unpacked, order: 1e6 + k, enabled: true, pinned: !city };

      if (!city) {
        const st = lentSettings(m, want.settings);

        const both = Object.assign(clientSettings(m, mine[m.id]), st || {});
        if (Object.keys(both).length) row.settings = both;
      }
      rows.push(row);
    }
    const hash = await modsetHash(rows);
    if (!city && hash !== expect.modset) throw ruleError('the friend\'s mods do not add up to their town\'s mod set');

    if (!city) {
      for (let k = 0; k < rows.length; k++) {
        const need = isObj(rows[k].manifest.depends) ? rows[k].manifest.depends : {};
        const after = rows.slice(k + 1).find(function (x) { return has(need, x.id); });
        if (after) throw wontLoad(rows[k].id + ' needs ' + after.id + ', and the friend\'s list loads ' + after.id + ' after it');
      }
    }

    const plan = loadPlan(own.concat(rows), cap);
    const lentSkip = plan.skip.filter(function (x) { return seen[x.id]; });
    if (lentSkip.length) {

      const cyc = /^is in a dependency cycle/;
      const inWay = plan.skip.filter(function (x) { return !seen[x.id] && cyc.test(x.error); }).map(function (x) { return x.id; });
      if (inWay.length && cyc.test(lentSkip[0].error)) {
        throw wontLoad('your own mod ' + inWay[0] + ' and the friend\'s mods need each other in an order the friend\'s town does not load them in. Switch ' + inWay[0] + ' off for this visit');
      }
      throw wontLoad(lentSkip[0].id + ' ' + lentSkip[0].error);
    }

    if (!city && await modsetHash(plan.load) !== expect.modset) {
      throw wontLoad('they would not load in the order the friend\'s town loads them in');
    }
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

        r.pinned = lent.kind !== 'city';
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

  const WATCH_KEY = 'acweb.mods.boot';
  const WATCH_FREEZE_MS = 8000;
  const WATCH_BEAT_MS = 2000;
  const WATCH_LIVE_MS = 3 * WATCH_BEAT_MS;
  const WATCH_MAX_MS = 5 * 60 * 1000;
  const WATCH_UNFINISHED_MAX = 2;
  const WATCH_RUN_KEY = 'acweb.mods.run';

  function watchKey(rid) { return WATCH_KEY + '.' + rid; }
  function newRunId() {
    let r = '';
    try {
      const a = new Uint32Array(2);
      root.crypto.getRandomValues(a);
      r = a[0].toString(36) + a[1].toString(36);
    } catch (_) { r = Math.floor(Math.random() * 0x7fffffff).toString(36); }
    return Date.now().toString(36) + '-' + r;
  }

  function readWatchMarks() {
    const out = [];
    try {
      const ls = root.localStorage;
      const keys = [];
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (typeof k === 'string' && (k === WATCH_KEY || k.indexOf(WATCH_KEY + '.') === 0)) keys.push(k);
      }
      for (const k of keys) {
        let m = null;
        try { m = JSON.parse(ls.getItem(k)); } catch (_) { m = null; }
        out.push({ key: k, mark: isObj(m) && typeof m.set === 'string' ? m : null });
      }
    } catch (_) {   }
    return out;
  }

  function pageReloaded() {
    try { if (root.location && new URLSearchParams(root.location.search).get('tabnav') === 'reload') return true; } catch (_) {   }
    try {
      const p = root.performance;
      const nav = p && typeof p.getEntriesByType === 'function' ? p.getEntriesByType('navigation')[0] : null;
      if (nav && typeof nav.type === 'string') return nav.type === 'reload';
      return !!(p && p.navigation && p.navigation.type === 1);
    } catch (_) { return false; }
  }

  let ownPrevRun;
  function prevRunOfThisTab() {
    if (ownPrevRun !== undefined) return ownPrevRun;
    ownPrevRun = null;
    try {
      const ss = root.sessionStorage;
      if (ss) {
        const v = ss.getItem(WATCH_RUN_KEY);
        ss.removeItem(WATCH_RUN_KEY);
        if (typeof v === 'string' && v && pageReloaded()) ownPrevRun = v;
      }
    } catch (_) {   }
    return ownPrevRun;
  }
  function writeWatchMark(key, m) {
    try { root.localStorage.setItem(key, JSON.stringify(m)); } catch (_) {   }
  }
  function dropWatchMarks(keys) {
    for (const k of keys) {
      try { root.localStorage.removeItem(k); } catch (_) {   }
    }
  }

  function watchdogVerdict(marks, set, now, own) {
    const out = { trip: false, n: 0, dead: [] };
    let chosen = null;
    let chosenTrips = false;
    for (const e of Array.isArray(marks) ? marks : []) {
      if (!e || typeof e.key !== 'string') continue;
      const mark = e.mark;
      const beat = !isObj(mark) ? null : (typeof mark.alive === 'number' ? mark.alive : (typeof mark.at === 'number' ? mark.at : null));

      const gone = typeof own === 'string' && own !== '' && e.key === watchKey(own);
      if (!gone && beat !== null && Math.abs(now - beat) < WATCH_LIVE_MS) continue;
      out.dead.push(e.key);
      if (!isObj(mark) || !set || mark.set !== set) continue;
      const n = typeof mark.n === 'number' && mark.n >= 1 ? Math.floor(mark.n) : 1;
      const trips = n >= WATCH_UNFINISHED_MAX || (mark.phase !== 'run' && beat !== null && now - beat >= WATCH_FREEZE_MS);
      if (!chosen || (trips && !chosenTrips) || (trips === chosenTrips && n > out.n)) { chosen = mark; chosenTrips = trips; }
      if (n > out.n) out.n = n;
      if (trips) out.trip = true;
    }
    if (chosen) {
      out.ids = Array.isArray(chosen.ids) ? chosen.ids.filter(function (x) { return typeof x === 'string'; }) : [];
      out.names = Array.isArray(chosen.names) ? chosen.names.filter(function (x) { return typeof x === 'string'; }) : [];
    }
    return out;
  }

  function sweepWatchMarks() {
    dropWatchMarks(watchdogVerdict(readWatchMarks(), '', Date.now(), prevRunOfThisTab()).dead);
  }

  function watchSet(rows) {
    return rows.map(function (r) { return r.id + '@' + (r.sha256 || ''); }).join('\n');
  }

  let watch = null;

  function watchTimers() {
    const si = typeof root.setInterval === 'function' ? root.setInterval : (typeof setInterval === 'function' ? setInterval : null);
    const ci = typeof root.clearInterval === 'function' ? root.clearInterval : (typeof clearInterval === 'function' ? clearInterval : null);
    return {
      si: si ? function (fn, ms) { return si.call(root, fn, ms); } : null,
      ci: ci ? function (id) { return ci.call(root, id); } : null
    };
  }

  function bootHealthy() {
    const w = watch;
    if (!w || w.done) return;
    w.done = true;
    w.mark.phase = 'run';
    if (w.armed) { w.mark.alive = Date.now(); writeWatchMark(w.key, w.mark); }
    if (root._acwebModsHealthy === engineHealthy) root._acwebModsHealthy = undefined;
  }

  function engineHealthy() {
    if (!watch || watch.done) return;
    watch.by = 'engine';
    bootHealthy();
  }

  function pageVisible() {
    try { return !root.document || root.document.visibilityState !== 'hidden'; } catch (_) { return true; }
  }

  function armWatchdog(set, mods, n) {
    const now = Date.now();
    const rid = newRunId();
    const mark = {
      v: 2, rid: rid, set: set, n: n, phase: 'boot', at: now, alive: now,
      ids: mods.map(function (m) { return m.id; }),
      names: mods.map(function (m) { return String((m.manifest && m.manifest.name) || m.id).slice(0, 60); })
    };
    if (watch) { watch.over = true; dropWatchMarks([watch.key]); }
    const w = { mark: mark, key: watchKey(rid), done: false, away: null, back: null, vis: null, timer: null, armed: false, over: false };
    watch = w;
    prevRunOfThisTab();
    try { if (root.sessionStorage) root.sessionStorage.setItem(WATCH_RUN_KEY, rid); } catch (_) {   }
    const take = function () { w.armed = false; dropWatchMarks([w.key]); };

    const put = function () {
      if (w.over) return;
      if (!pageVisible()) { take(); return; }
      w.armed = true;
      mark.alive = Date.now();
      writeWatchMark(w.key, mark);
    };
    put();
    w.away = take;
    w.back = put;
    w.vis = put;
    try {
      if (root.addEventListener) {
        root.addEventListener('pagehide', w.away);
        root.addEventListener('pageshow', w.back);
      }
      if (root.document && root.document.addEventListener) root.document.addEventListener('visibilitychange', w.vis);
    } catch (_) {   }
    const t = watchTimers();

    w.ran = 0;
    w.last = now;
    const running = function () {
      const m = root.Module;
      return !m || typeof m !== 'object' || m.calledRun === true;
    };
    if (t.si) {
      w.timer = t.si(function () {
        if (!w.done) {
          const at = Date.now();
          const step = Math.min(Math.max(0, at - w.last), 2 * WATCH_BEAT_MS);
          w.last = at;
          if (w.armed && running()) w.ran += step;
          if (w.ran >= WATCH_MAX_MS) { w.by = 'time'; bootHealthy(); }
        }
        if (w.armed) put();
      }, WATCH_BEAT_MS);
    }
    root._acwebModsHealthy = engineHealthy;
  }

  function watchState() {
    return watch ? { done: !!watch.done, by: watch.by || null } : null;
  }

  function watchMark() {
    if (!watch) return null;
    for (const e of readWatchMarks()) if (e.key === watch.key) return e.mark;
    return null;
  }

  async function bootLoad(FS) {
    const state = { ready: false, mods: [], modset: '', modlist: [], skipped: [], safeMode: false, removed: [] };
    if (consumeSkip()) {
      sweepWatchMarks();
      state.safeMode = true;
      console.log('[Mods] safe mode: starting without mods');
      return publish(state);
    }

    const lent = lentState();
    let sweepDue = false;
    try { sweepDue = !!lent || lentDbNames().length > 0 || root.localStorage.getItem(LENT_DB_KEY) === '1'; } catch (_) { sweepDue = !!lent; }
    if (sweepDue) sweepLentDbs(lent ? lent.db : null).catch(function () {   });
    if (lent) state.lent = { visitId: lent.visitId, modset: lent.modset, kind: lent.kind || 'visit', mods: lent.set.map(function (m) { return m.id; }) };
    if (!flagOn() && !lent && !devTainted()) {
      sweepWatchMarks();
      rememberModset('', []);

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
    let watchDead = null;

    const sources = new Map();
    const tagSources = function () {
      for (const e of state.mods.concat(state.skipped)) {
        if (e && e.source === undefined && sources.has(e.id)) e.source = sources.get(e.id);
      }
    };

    const bootFails = {};
    const bootFine = [];
    const sizes = new Map();
    let wipeHanded = [];
    try {
      const own = flagOn();
      let rows = [];
      if (own) {
        const db = await openDb();
        try {
          rows = await bootRows(db);
        } finally { db.close(); }
      }
      for (const r of rows) sources.set(r.id, typeof r.source === 'string' ? r.source : 'file');
      if (own && !rows.length) {
        if (noteIfCleared()) {
          state.cleared = true;
          console.warn('[Mods] the browser cleared the mods database; the Mods tab says so once');
        }
        clearFlag();

        try {
          const again = await openDb();
          try { if ((await bootRows(again)).length) ensureFlag(); } finally { again.close(); }
        } catch (_) {   }
      }

      let lentList = [];
      if (lent) {
        try { lentList = await lentRows(lent); } catch (e) {
          state.lentError = (e && e.message) || String(e);
          console.warn('[Mods] the lent set could not be read:', e);
        }
      }

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

        if (statusKill) {
          state.killSwitch = killNow();
          console.warn('[Mods] mods are switched off for everyone: ' + statusKill.message);
          rows = [];
          lentList = [];
        }
      }
      if (lent && lent.kind === 'city') {

        rows = lentList;
      } else if (lent) {

        const lentIds = lent.set.map(function (m) { return m.id; });
        rows = rows.filter(function (r) {
          return lentIds.indexOf(r.id) < 0 && !(r.enabled && r.manifest && countsForVisits(r.manifest));
        }).concat(lentList);
      }
      const cap = enabledCap();

      const dev = !statusKill && !lent ? await devPlanRow(state) : null;
      let devGaveWay = null;
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

      const readable = apiFilter(rows);
      state.skipped = state.skipped.concat(readable.skipped);
      const unreadable = new Set(readable.skipped.map(function (s) { return s.id; }));
      for (const r of rows) if (unreadable.has(r.id)) r.cannotLoad = true;
      let plan = loadPlan(rows, cap);
      if (dev && devGaveWay && !plan.load.some(function (r) { return r.dev; })) {

        const devSkips = plan.skip.filter(function (k) { return k.id === dev.row.id; });
        rows = rows.filter(function (r) { return !r.dev; });
        rows.splice(devGaveWay.at, 0, devGaveWay.row);
        delete state.devReplaced;
        plan = loadPlan(rows, cap);
        plan.skip = devSkips.concat(plan.skip);
      }
      const plannedRows = plan.load.slice();
      rows = null;
      state.skipped = state.skipped.concat(plan.skip.map(function (k) {
        return dev && k.id === dev.row.id ? { id: k.id, error: 'developer copy: ' + k.error, dev: true } : k;
      }));

      set = watchSet(plan.load.filter(function (r) { return !r.dev; }));
      const verdict = watchdogVerdict(readWatchMarks(), set, Date.now(), prevRunOfThisTab());
      if (verdict.trip) {
        dropWatchMarks(verdict.dead);
        state.safeMode = true;
        state.watchdog = { ids: verdict.ids, names: verdict.names };
        console.warn('[Mods] the last start with these mods stopped responding; starting without mods: ' + verdict.ids.join(', '));
        tagSources();
        return publish(state);
      }
      prevBoots = verdict.n;
      watchDead = verdict.dead;
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

          const row = await readRow(planned.id, planned.lent ? lent.db : DB_NAME);
          if (!row || !row.zip) throw ruleError('the stored mod is gone');
          let zip = row.zip;
          r = metaOf(row);
          if (planned.lent) r.lent = true;
          if (typeof r.source === 'string') sources.set(r.id, r.source);

          if (!r.enabled) continue;
          const apiWhy = r.manifest ? apiSkip(r.manifest) : null;
          if (apiWhy) { state.skipped.push({ id: r.id, error: apiWhy.error, api: apiWhy.api }); continue; }
          try {
            mod = readMod(new Uint8Array(zip), root.fflate, { trusted: true });
            zip = null;
            if (mod.manifest.id !== r.id) throw ruleError('the stored mod does not match its id');
          } catch (e) {

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

        const csha = r.contentSha || await contentSha(mod.entries);
        const entry = { id: r.id, version: mod.manifest.version, scope: mod.manifest.scope, dir: dir,
                        settings: effectiveSettings(mod.manifest, r.settings) };
        if (r.lent) entry.temp_store = true;
        index.push(entry);
        state.mods.push({ id: r.id, manifest: mod.manifest, sha256: r.sha256, contentSha: csha, enabled: true,
          source: r.lent ? 'lent:' + lent.visitId : (typeof r.source === 'string' ? r.source : 'file'), lent: !!r.lent,
          settings: r.settings || {} });
      }

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

      state.modlist = state.dev ? [] : await modsetList(state.mods);
      if (lent && lent.kind !== 'city' && state.modset !== lent.modset && !state.lentError) {

        state.lentError = 'the friend\'s mods did not all load';
        console.warn('[Mods] lent set did not load whole: running ' + state.modset + ', the host runs ' + lent.modset);
      }
    } catch (e) {

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
          FS.writeFile(MODS_DIR + '/index.json', JSON.stringify(doc));
          written = true;

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

    const after = async function (what, fn) {
      try { await fn(); } catch (e) {
        const msg = what + ': ' + ((e && e.message) || e);
        console.warn('[Mods] after the mod list was written, ' + msg);
        (state.afterErrors = state.afterErrors || []).push(msg);
      }
    };

    await after('remembering the mod set', function () { if (written && !lent) rememberModset(state.modset, state.modlist); });
    if (written) wipeAwaiting = wipeHanded;

    if (Object.keys(bootFails).length || bootFine.length) {
      await after('recording what did not load', function () { return storeBootFails(bootFails, bootFine); });
    }

    await after('arming the boot watchdog', function () {
      if (written && state.mods.length && set) {
        if (watchDead) dropWatchMarks(watchDead);
        armWatchdog(set, state.mods, prevBoots + 1);
      } else sweepWatchMarks();
    });
    await after('naming sources', tagSources);
    await after('the boot log', function () {
      console.log('[Mods] ' + state.mods.length + ' mod(s) unpacked' + (state.skipped.length ? ', ' + state.skipped.length + ' skipped' : ''));
      logBoot(state);
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

  const LOG_MAX = 400;
  const LOG_TEXT_MAX = 2000;
  const LOG_KINDS = ['log', 'error', 'stop', 'refused', 'info'];
  const modLog = { lines: [], seq: 0, dropped: 0 };

  function logEvict() {
    const count = Object.create(null);
    let most = 0;
    for (const l of modLog.lines) {
      const n = (count[l.id] || 0) + 1;
      count[l.id] = n;
      if (n > most) most = n;
    }
    for (let i = 0; i < modLog.lines.length; i++) {
      if (count[modLog.lines[i].id] === most) { modLog.lines.splice(i, 1); break; }
    }
    modLog.dropped++;
  }

  function logPush(kind, id, text) {
    modLog.seq++;
    modLog.lines.push({ seq: modLog.seq, kind: kind, id: String(id || ''), text: String(text || '').slice(0, LOG_TEXT_MAX), at: Date.now() });
    if (modLog.lines.length > LOG_MAX) logEvict();
  }

  root._acwebModLogPush = function (seq, kind, id, text) {
    logPush(LOG_KINDS[kind] || 'info', id, text);
  };

  function readLog(since) {
    const s = Number(since) || 0;
    return { lines: modLog.lines.filter(function (l) { return l.seq > s; }), next: modLog.seq, dropped: modLog.dropped };
  }

  function logBoot(state) {
    for (const k of state.skipped || []) logPush('refused', k.id, 'did not load: ' + k.error);
    for (const r of state.removed || []) logPush('refused', r.id, 'switched off: ' + removedWords(r.reason));
    if (state.dev) logPush('info', state.dev.id, 'loaded in developer mode from ' + state.dev.source.label);
  }

  const TT_MARK = 'acweb.testtown';
  const TT_MAKE = 'acweb.testtown.make';
  const TT_TOWN_DBS = ['/save', 'acweb-mods'];

  const TT_TOWN_KEYS = ['acweb.mods', 'acweb.mods.n', 'acweb.modset', 'acweb.modlist', 'acweb.mods.wipe'];
  const TT_DELETE_MS = 10000;
  let ttState = null;

  function testTownDb(name) {
    return TT_ON && TT_TOWN_DBS.indexOf(String(name)) >= 0 ? name + TT_SUFFIX : name;
  }

  function ttReadMark() {
    try {
      const m = JSON.parse(lsGet(TT_MARK) || 'null');
      if (m && (m.from === 'copy' || m.from === 'fresh') && typeof m.at === 'number') return m;
    } catch (_) {   }
    return null;
  }

  function ttReq(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('IndexedDB refused a read')); };
    });
  }

  function ttOpenExisting(name) {
    return new Promise(function (resolve, reject) {
      let absent = false;
      let req;
      try { req = idb().open(name); } catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        absent = true;
        try { req.transaction.abort(); } catch (_) {   }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function (ev) {
        try { if (ev && ev.preventDefault) ev.preventDefault(); } catch (_) {   }
        if (absent) resolve(null); else reject(req.error || new Error(name + ' could not be opened'));
      };
      req.onblocked = function () { reject(new Error(name + ' is held open by another tab')); };
    });
  }

  function ttDelete(name) {
    return new Promise(function (resolve, reject) {
      let req;
      try { req = idb().deleteDatabase(name); } catch (e) { reject(e); return; }
      let done = false;
      const t = typeof root.setTimeout === 'function' ? root.setTimeout(function () {
        if (!done) { done = true; reject(new Error('the old test town could not be removed (another tab holds it)')); }
      }, TT_DELETE_MS) : null;
      const end = function (err) {
        if (done) return;
        done = true;
        if (t !== null) root.clearTimeout(t);
        if (err) reject(err); else resolve();
      };
      req.onsuccess = function () { end(null); };
      req.onerror = function () { end(req.error || new Error('the old test town could not be removed')); };

    });
  }

  async function ttCopyDb(src, dst) {
    const from = await ttOpenExisting(src);
    if (!from) return 0;
    let shape = [];
    let version = 1;
    try {
      version = from.version;
      const names = Array.prototype.slice.call(from.objectStoreNames);
      if (names.length) {
        const tx = from.transaction(names, 'readonly');
        shape = names.map(function (n) {
          const st = tx.objectStore(n);
          return {
            name: n, keyPath: st.keyPath, autoIncrement: st.autoIncrement,
            indexes: Array.prototype.slice.call(st.indexNames).map(function (i) {
              const ix = st.index(i);
              return { name: i, keyPath: ix.keyPath, unique: ix.unique, multiEntry: ix.multiEntry };
            }),
            keys: ttReq(st.getAllKeys()), values: ttReq(st.getAll())
          };
        });
        for (const s of shape) { s.keys = await s.keys; s.values = await s.values; }
      }
    } finally { from.close(); }
    const to = await new Promise(function (resolve, reject) {
      let req;
      try { req = idb().open(dst, version); } catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        const db = req.result;
        for (const s of shape) {
          if (db.objectStoreNames.contains(s.name)) continue;
          const st = db.createObjectStore(s.name, s.keyPath === null
            ? { autoIncrement: s.autoIncrement } : { keyPath: s.keyPath, autoIncrement: s.autoIncrement });
          for (const ix of s.indexes) st.createIndex(ix.name, ix.keyPath, { unique: ix.unique, multiEntry: ix.multiEntry });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error(dst + ' could not be made')); };
      req.onblocked = function () { reject(new Error(dst + ' is held open by another tab')); };
    });
    let n = 0;
    try {
      if (shape.length) {
        await new Promise(function (resolve, reject) {
          const tx = to.transaction(shape.map(function (s) { return s.name; }), 'readwrite');
          for (const s of shape) {
            const st = tx.objectStore(s.name);
            for (let i = 0; i < s.values.length; i++) {
              if (s.keyPath === null) st.put(s.values[i], s.keys[i]); else st.put(s.values[i]);
              n++;
            }
          }
          tx.oncomplete = function () { resolve(); };
          tx.onerror = function () { reject(tx.error || new Error('the copy could not be written')); };
          tx.onabort = function () { reject(tx.error || new Error('the copy could not be written')); };
        });
      }
    } finally { to.close(); }
    return n;
  }

  async function testTownPrepare(opts) {
    if (!TT_ON) return (ttState = { on: false, made: null, mark: null });
    const had = ttReadMark();
    if (had || (opts && opts.make === false)) return (ttState = { on: true, made: null, mark: had });
    const asked = lsGet(TT_MAKE) === 'fresh' ? 'fresh' : 'copy';
    let error = null;
    let records = 0;
    try {
      for (const n of TT_TOWN_DBS) await ttDelete(n + TT_SUFFIX);
      if (asked === 'copy') for (const n of TT_TOWN_DBS) records += await ttCopyDb(n, n + TT_SUFFIX);
    } catch (e) {
      error = String((e && e.message) || e);
      for (const n of TT_TOWN_DBS) { try { await ttDelete(n + TT_SUFFIX); } catch (_) {   } }
    }
    const copied = asked === 'copy' && !error;
    for (const k of TT_TOWN_KEYS) lsSet(k + TT_SUFFIX, copied ? lsGet(k) : null);
    lsSet(CLEARED_KEY, null);
    const mark = { v: 1, from: copied ? 'copy' : 'fresh', asked: asked, at: Date.now(), records: records };
    if (error) mark.error = error;
    lsSet(TT_MARK, JSON.stringify(mark));
    lsSet(TT_MAKE, null);
    return (ttState = { on: true, made: mark.from, mark: mark });
  }

  const testTown = {
    on: TT_ON, SUFFIX: TT_SUFFIX, PARAM: TT_PARAM, MARK_KEY: TT_MARK, MAKE_KEY: TT_MAKE, TOWN_DBS: TT_TOWN_DBS.slice(),
    dbName: testTownDb, key: townKey, mark: ttReadMark, prepare: testTownPrepare,
    state: function () { return ttState; }
  };

  const DEV_DB = 'acweb-mods-dev';
  const DEV_STORED = 'acweb.mods.dev';
  const DEV_DATA = 1, DEV_LUA = 2, DEV_TEXTURES = 4;
  const DEV_ITEMS = 8;
  let devCurrent = null;
  let devPending = 0;
  let devTimer = null;
  let devMarkerValue = null;

  function lsGet(k) { try { return root.localStorage.getItem(k); } catch (_) { return null; } }
  function lsSet(k, v) { try { if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v); } catch (_) {   } }

  function devOn() { return TT_ON; }

  function devTainted() { return devOn() && lsGet(DEV_STORED) === '1'; }

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
        t.onerror = function () {   };
        const req = fn(t.objectStore('dev'));
        if (req) req.onsuccess = function () { out = req.result; };
      });
    });
  }
  function devGet() { return devTx('readonly', function (s) { return s.get('current'); }); }
  function devPut(row) { return devTx('readwrite', function (s) { return s.put(row); }); }
  function devDel() { return devTx('readwrite', function (s) { return s.delete('current'); }); }

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

  function devTiers(paths, manifest) {
    const c = (manifest && manifest.content) || {};
    const tex = typeof c.textures === 'string' ? c.textures.replace(/\/+$/, '') + '/' : null;
    let what = 0;
    for (const p of paths) {
      if (p === c.items) what |= DEV_ITEMS;
      else if (p === c.messages || p === c.shops || p === c.letters || p === c.calendar || p === c.talk) what |= DEV_DATA;
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
          try { FS.unlink(full); } catch (_) {   }
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
    validateLetters: validateLetters, validateCalendar: validateCalendar, validateTalk: validateTalk, letterIds: letterIds, calendarIds: calendarIds,
    TALK_PLACES: TALK_PLACES, TALK_TOPICS: TALK_TOPICS,
    validateItems: validateItems,
    normalizeEntries: normalizeEntries, parseJsonStrict: parseJsonStrict, readMod: readMod,

    contentProblems: contentProblems, isJunk: isJunk, textureName: textureName,   EXTS: EXTS.slice(), LETTER_SENDER_MAX: LETTER_SENDER_MAX,
    contentSha: contentSha, modsetHash: modsetHash, modsetList: modsetList, countsForVisits: countsForVisits,
    VANILLA_OUTPUT_COMMANDS: VANILLA_OUTPUT_COMMANDS, planLoad: planLoad,
    list: list, install: install, remove: remove, setEnabled: setEnabled, move: move, setOrder: setOrder,
    skipNextBoot: skipNextBoot, bootLoad: bootLoad, EVENTS: EVENTS, PERMISSIONS: PERMISSIONS, WORLD_PERMISSIONS: WORLD_PERMISSIONS, LIMITS: LIMITS,
    API_MIN: API_MIN, API_MAX: API_MAX, UNBUILT_KEYS: UNBUILT_KEYS, MANIFEST_KEYS: MANIFEST_KEYS, CONTENT_KEYS: CONTENT_KEYS,
    FILE_KEYS: {
      shops: SHOPS_FILE_KEYS, shop: SHOP_KEYS, good: GOOD_KEYS, when: WHEN_KEYS, items: ITEMS_FILE_KEYS, letters: LETTERS_FILE_KEYS, letter: LETTER_KEYS,
      calendar: CALENDAR_FILE_KEYS, day: CALENDAR_DAY_KEYS, talk: TALK_FILE_KEYS, pool: TALK_POOL_KEYS
    },
    closestKey: closestKey, apiStatus: apiStatus, TAGS: TAGS,
    lowMemoryDevice: lowMemoryDevice, enabledCap: enabledCap, takeClearedNotice: takeClearedNotice,
    checkStatus: checkStatus, refreshStatus: refreshStatus,

    setSetting: setSetting, exportAll: exportAll,
    effectiveSettings: effectiveSettings, settingValueOk: settingValueOk, settingsSha: settingsSha,

    SETTING_SCOPES: SETTING_SCOPES, settingScope: settingScope,
    worldSettings: worldSettings, clientSettings: clientSettings,
    resolveLoad: resolveLoad, parseRange: parseRange, inRange: inRange, compareVersions: compareVersions,
    pendingWipe: pendingWipe,
    savedData: savedData, deleteSavedData: deleteSavedData,
    lend: lend, clearLent: clearLent, lentState: lentState, lendRoom: lendRoom, cityProblem: cityProblem,
    killSwitch: killNow, KILL_KEY: KILL_KEY,
    problemCodes: problemCodes, errorCode: errorCode, ERROR_DOCS: ERROR_DOCS,
    watchdogVerdict: watchdogVerdict, bootHealthy: bootHealthy, engineHealthy: engineHealthy,
    WATCH: { KEY: WATCH_KEY, FREEZE_MS: WATCH_FREEZE_MS, BEAT_MS: WATCH_BEAT_MS, LIVE_MS: WATCH_LIVE_MS, MAX_MS: WATCH_MAX_MS }, watchState: watchState, watchMark: watchMark,

    log: readLog, logPush: logPush, readEntries: readEntries,
    devLoad: devLoad, devApply: devApply, devUnload: devUnload, devState: devState, devTainted: devTainted,
    devTiers: devTiers,

    testTown: testTown
  };
  root._acwebMods = api;
  root._acwebTestTown = testTown;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
