# My Play AC Online mod

A mod for [Play AC Online](https://playaconline.com), made from the
playac-mod template.

## First steps

1. Open `mod.json`. Change `"id"` to `yourname.mod-name` (lowercase letters,
   digits and dashes), and set `"name"`, `"authors"` and `"description"`.
2. Run `npx playac-mod types` once, so your editor knows the game's script API
   and the shape of every JSON file. (VS Code: install the recommended Lua
   extension when it asks.)
3. Run `npx playac-mod dev` and open the game with `?moddev=1` on the address,
   for example `https://playaconline.com/play/?moddev=1`. Edits to lines, the
   shop and scripts show up without a restart.
4. `npx playac-mod check` lists every problem the game would refuse, per file.

## Share it

Every file must be your own work: never the game's pictures or text.

- From GitHub: raise `"version"` in mod.json, commit, and tag the commit with
  the same version (`git tag v1.2.0 && git push --tags`). Then, signed in on
  playaconline.com, open Settings, Mods, Share a mod, and paste
  `github.com/<you>/<repo>@v1.2.0`. The site fetches that tag once, builds the
  mod from it and sends it for review. Pushing to the tag later changes nothing.
  Or let the tool do it and check the tag first:
  `npx playac-mod publish --github <you>/<repo>@v1.2.0`.
- From your computer: `npx playac-mod publish` (sign in with a code once an
  hour), or `npx playac-mod pack` (it writes the ZIP beside this folder) and
  upload the ZIP on the site.
- `npx playac-mod status` shows what the registry did with each version, and
  `npx playac-mod yank 1.2.0` takes a bad one out of the list.

What goes in the mod: every `.json .lua .dds .png .txt .md` file, except
anything in a folder or file whose name starts with `.`, `node_modules`, and
`CHANGELOG.md` at the top. So `.github`, `.vscode` and `.playac` never ship,
and neither does `LICENSE`. This README does ship: players and the reviewer
read it, so rewrite it about your mod.

The workflow in `.github/workflows/mod.yml` runs one release of playac-mod:
it downloads that release's file and refuses it unless its SHA-256 is the one
written at the top of the workflow, so no other package with the same name
can ever run there. To move to a newer release, copy its version and SHA-256
from https://playaconline.com/modding/downloads/playac-mod-releases.json.

The listing is not in the mod but is read from the same tag: put 1 to 4
screenshots (PNG or JPEG) in `.playac/screenshots/` and commit them, and say
what the version changes in a `## 1.2.0` section of `CHANGELOG.md` (or in
`.playac/changelog.txt`). `.gitignore` leaves out only what `playac-mod types`
writes (`.playac/playac.lua`, `.playac/schemas/`), so these are committed.

Guide: https://playaconline.com/wiki/making-mods/
