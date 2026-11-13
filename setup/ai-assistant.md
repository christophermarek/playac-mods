# An AI assistant

An AI assistant does not know this game's mod rules on its own, and will happily
invent functions that do not exist. The **skill pack** gives it the whole mod
API, every error with its fix, the working examples and the items a shop can
stock, so what it writes installs the first time.

The pack works with any assistant: Claude Code, GitHub Copilot, Codex, Cursor,
Aider, Zed, or a chat in the browser. More: https://playaconline.com/modding/ai/

## 1. Get the pack

Pick one:

- **With playac-mod** (easiest): `npx playac-mod new` already puts the pack in
  every new mod, for Claude Code and Copilot. Nothing to download. (`--no-ai`
  leaves it out.)
- **Download it:** https://playaconline.com/modding/ai/playac-mod-ai.zip
- **From this repository:** the `ai/` folder holds the same files. `ai/pack.json`
  lists where each one goes in a mod folder.

What is in the ZIP:

```
playac-mod-ai/
  .claude/skills/playac-mod/SKILL.md      Claude Code
  .claude/skills/playac-mod/reference/    api.md, errors.md, examples.md, items.md
  AGENTS.md                               Codex, Cursor, Aider, Zed and others
  .github/copilot-instructions.md         GitHub Copilot
  README.txt
```

## 2. Put it where your assistant looks

The files go in your **mod folder**, the one with `mod.json` in it, not inside a
`playac-mod-ai` folder. On macOS and Linux, folders starting with a dot are
hidden in Finder and file managers, so a terminal is the easy way.

**macOS, Linux:**

```bash
cd path/to/your-mod
unzip ~/Downloads/playac-mod-ai.zip
mv playac-mod-ai/.claude playac-mod-ai/.github playac-mod-ai/AGENTS.md .
rm -r playac-mod-ai
```

**Windows (PowerShell):**

```powershell
cd path\to\your-mod
Expand-Archive $HOME\Downloads\playac-mod-ai.zip -DestinationPath .
Move-Item playac-mod-ai\.claude, playac-mod-ai\.github, playac-mod-ai\AGENTS.md .
Remove-Item -Recurse playac-mod-ai
```

If `mv` says `Directory not empty` (or `Move-Item` says the item already exists)
for `.claude` or `.github`,
your mod has the pack already (from `playac-mod new`): skip this step, or
delete the old folders first to update them.

**Check it worked:** your mod folder now has `mod.json`, `.claude/`, `.github/`
and `AGENTS.md` side by side (`ls -a` on macOS and Linux, `dir -Force` on
Windows).

Keep only what your assistant reads, if you like:

| Assistant | Reads |
|---|---|
| Claude Code | `.claude/skills/playac-mod/` (loads by itself when you talk about the mod) |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Codex, Cursor, Aider, Zed and others | `AGENTS.md` |

`.claude/` and `.github/` are hidden folders, so they are never packed into your
mod's ZIP. `AGENTS.md` is a `.md` file, so `playac-mod pack` puts it in the ZIP
too. That is harmless; to leave it out, keep it one folder up instead.

For Claude Code in every project, not just this mod, copy
`.claude/skills/playac-mod` into `~/.claude/skills/playac-mod`.

## 3. A chat in the browser (ChatGPT, Claude.ai, others)

No files to place. Upload `SKILL.md` and the four `reference/` files to the chat
(or to a project, so every chat has them), then ask. Or give it
https://playaconline.com/llms-full.txt: all of the modding docs as one text file.

## 4. Ask, then test

Ask for what you want, for example: "Make a mod that restocks the flower shop
with fruit and opens it at night."

Then test what it wrote, the same as anything else:

```bash
npx playac-mod check
```

or install the ZIP in the game (**Settings, Mods, Install from a file**). When
something is refused, paste the whole message to the assistant: each one has a
code, and the pack has the fix for every code.

**Check it worked:** ask the assistant "Which events can a mod script listen
to?". It should list the game's real events (like `talk` and `day_start`) and
mention that each must be in `scripts.hooks` in `mod.json`. An assistant that
invents events has not read the pack.

## Good to know

- You are the author: the rules apply to what an assistant makes for you. Only
  original work, no art or text from any game.
- The pack changes when the mod API does. Get it again after a game update
  (download it again, or make a new mod with `playac-mod new` and copy its
  `.claude/` and `.github/` across).
