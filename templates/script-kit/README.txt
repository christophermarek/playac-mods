My Script: a starter kit for a Lua mod script.

main.lua listens to the four everyday events (a talk, a new day, an item
picked up, a new scene), keeps a count in the store and logs what happens.
Read the log lines in Settings, Mods, Mod log, or in the browser's
developer console (F12, or Cmd+Option+J on a Mac; type [Mods] in its
filter box).

The store is kept per town, and the top of main.lua runs before any town is
loaded: read and save the store inside events, as main.lua does.

1. Change "yourname" in mod.json's "id" and "authors" to your own name.
2. Edit main.lua. List only the events you use in mod.json's "hooks". More
   events (fish_caught, shop_buy, letter_read and others) are in the
   scripts guide below.
3. ZIP it: the folder (Finder Compress, Windows Send to) or the files inside it,
   either works, as long as mod.json is at the top or in the one folder. Install
   it in the game:
   Settings, Mods, Install from a file, Choose ZIP. Then Restart now.

Guide: https://playaconline.com/modding/guides/scripts/
