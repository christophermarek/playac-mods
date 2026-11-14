# playac-mod

Make, check, pack, try and publish mods for [Play AC Online](https://playaconline.com).
Needs Node.js 18.17 or newer.

Until the package is on npm, install it from the site once (then `npx playac-mod`
uses that copy; run the line again to update):

```bash
npm install -g https://playaconline.com/modding/downloads/playac-mod.tgz
```

```bash
npx playac-mod new yourname.my-mod --kind lines   # texture | lines | shop | script; --github for a repo
cd yourname.my-mod
npx playac-mod check     # every rule the game applies, problems per file, Lua syntax too
npx playac-mod check ../some-mod.zip              # a ZIP, exactly as the Mods tab reads it
npx playac-mod dev       # serve the folder to the game's developer mode
npx playac-mod pack      # ../<id>-<version>.zip beside the folder, the same bytes every time
npx playac-mod publish   # sign in with a code (once an hour), upload for review
npx playac-mod publish --github you/my-mod@v1.2.0   # or have the site import a tag
npx playac-mod status    # what the registry did with each version
npx playac-mod yank 1.2.0 --reason "breaks the shop"   # unyank 1.2.0 lists it again
npx playac-mod logout
```

`check` and `pack` run the game's own rules, so a mod that passes installs.
`check` also fails a mod whose script the game would stop at load: a Lua
syntax error (the game's own Lua 5.4 parser is built in, no Lua install
needed) and an `on()` for an event not in `hooks`. It warns about what the
game accepts but probably not as you meant: a texture the mod list would
refuse or that is smaller than the one it replaces, a `cmd.*` call not in
`permissions`, a shop good the game leaves out or sells above your price, a
letter whose footer the mailbox list would cut at 8 characters (give it a
`sender`), two files of one texture, PNGs past the game's pixel budget, an
`"api"` below the game's newest level, a file (an old ZIP) that a hand-made ZIP of the folder would carry and the game
would refuse. `pack` prints the mod's content hash: the name the mod list,
the update check and friend visits know it by.

What goes in the ZIP: every `.json .lua .dds .png .txt .md` file, except
anything under a name starting with `.` (`.git`, `.github`, `.vscode`,
`.playac`), `node_modules`, and a `CHANGELOG.md` at the top (its section for
the version is sent beside the ZIP as the changelog line). `README.md` goes
in: write it for players.

`new` and `types` write `.playac/` (LuaLS annotations, JSON schemas for every
content file) and `.vscode/settings.json` so the editor knows the script API.

`dev` serves on port 2604; when that is taken it uses the next free port and
prints the address to put in the game's "playac-mod dev address" box.

`publish` signs in with a code: it prints an address and an 8-letter code, you
open the address on the site while signed in (with two-factor sign-in on, as
for any upload), check the code and press Approve. A code from your
authenticator app opens a 15-minute window in which you may approve; the
sign-in you approve then lasts an hour on its own. It can upload your mods and
list or yank your own versions, nothing else, and `logout` ends it.

Docs: https://playaconline.com/modding/  Errors: https://playaconline.com/modding/errors/
