# Git and GitHub (optional)

You never need Git to make or share a mod. It is worth it when you want a
history of every change, to work on a mod with someone else, or to share each
version straight from a tagged release on GitHub, with no ZIP to upload.

This guide covers installing Git, keeping a mod in a GitHub repository, and
sharing a version from a tag. It assumes the `playac-mod` tool
([Node.js and playac-mod](node-and-cli.md)) for the parts that use it.

## 1. Install Git

- **macOS**: in a terminal, run `git --version`. If Git is missing, macOS offers
  to install the "command line developer tools": accept and wait. (Or
  `xcode-select --install`, or `brew install git`.)
- **Windows**: download from https://git-scm.com/downloads/win and run it with the
  defaults, or `winget install Git.Git`. Then open a **new** terminal.
- **Linux**: `sudo apt install git` (Debian, Ubuntu) or `sudo dnf install git`
  (Fedora).

Tell Git your name and email once (they go in every commit you make, and are
public on GitHub; GitHub can give you a private no-reply address, under
Settings, Emails):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Check it worked:** `git --version` prints a version, and
`git config --global user.name` prints your name.

## 2. A GitHub account and a way to push

1. Make an account at https://github.com/signup.
2. Pick a way to sign in from the terminal. The easiest is GitHub's own tool,
   `gh`: install it from https://cli.github.com (macOS `brew install gh`,
   Windows `winget install GitHub.cli`, Linux as that page says), then run
   `gh auth login` and follow its questions (GitHub.com, HTTPS, log in with a
   browser).

**Check it worked:** `gh auth status` says you are logged in.

(Without `gh`, Git for Windows and macOS's Git ask you to sign in with a browser
the first time you push. On Linux, use `gh` or an SSH key:
https://docs.github.com/en/authentication.)

## 3. A mod in a repository

Make the mod with the GitHub files included:

```bash
npx playac-mod new yourname.tea-house --kind shop --github
cd yourname.tea-house
```

`--github` adds `.github/workflows/mod.yml` (a check that runs on every push) and
a `CHANGELOG.md`. The `.gitignore` it writes leaves out only the generated editor
types, so everything else is committed.

Put it on GitHub (the repository must be **public** for the site to import from
it):

```bash
git init -b main         # older Git: git init, then git branch -M main after the commit
git add .
git commit -m "First version"
gh repo create tea-house --public --source . --push
```

(Without `gh`: make an empty public repository on github.com, then
`git remote add origin https://github.com/<you>/tea-house.git` and
`git push -u origin main`.)

**Check it worked:** `git status` says `nothing to commit, working tree clean`,
and the repository page on GitHub shows `mod.json`.

**About the workflow.** It runs one release of playac-mod, named at the top of
the file (`PLAYAC_MOD_VERSION`): it downloads that release's file and refuses it
unless its SHA-256 matches `PLAYAC_MOD_SHA256`, then runs `playac-mod check`. It
never looks the tool up on the npm registry by name, so no other package called
playac-mod can run in your repository. To move to a newer release, copy the
three lines from a fresh `playac-mod new x --github`, or the version and SHA-256
from https://playaconline.com/modding/downloads/playac-mod-releases.json.

### Or start from an example

This repository (`playac-mods`) holds every example mod and starter kit. Copy one
folder out of `examples/` or `templates/` into a repository of your own, change
the `id` in `mod.json` to `yourname.something`, and carry on from the commit step
above. Run `npx playac-mod types` in it for the editor files.

## 4. Share a version from a tag

The site can import a tagged version straight from GitHub. What it reads at
that tag:

- the mod: every file the game would read, the same as `playac-mod pack`;
- the listing: 1 to 4 screenshots (PNG or JPEG, at least 200 pixels a side, up to
  2 MB each) in `.playac/screenshots/`, and the changelog line from this
  version's section of `CHANGELOG.md` (a heading like `## 0.1.0`), or from
  `.playac/changelog.txt`.

1. Take screenshots of your mod in the game, put them in `.playac/screenshots/`,
   and write the version's section in `CHANGELOG.md`.
2. Make sure `"version"` in `mod.json` is the version you are sharing.
3. Commit, tag with the same version, and push the tag:

   ```bash
   git add .
   git commit -m "0.1.0"
   git tag v0.1.0
   git push
   git push origin v0.1.0
   ```

4. Send it for review, either way:
   - in the game: **Settings, Mods, Share a mod**, and paste
     `github.com/<you>/tea-house@v0.1.0`; or
   - in the terminal: `npx playac-mod publish --github <you>/tea-house@v0.1.0`.
     It first checks that the tag matches `mod.json`, that the screenshots and
     changelog are there, and that the tag was pushed, then signs you in
     ([Publishing](publishing.md)).

**Check it worked:** the version shows under **Mods you shared** as **Waiting
for review**, or `npx playac-mod status` lists it as pending.

The site fetches the tag once. Moving or re-pushing the tag later changes
nothing; a fix is always a new, higher version with a new tag.

## Good to know

- Hidden files and folders (`.git/`, `.github/`, `.playac/`, `.vscode/`) and
  `CHANGELOG.md` never go in the mod. Your `README.md` does: players and the
  reviewer read it, so write it about your mod.
- An account needs two-factor sign-in to import, the same as any upload
  ([Publishing](publishing.md)).
- More on sharing: https://playaconline.com/modding/publishing/
