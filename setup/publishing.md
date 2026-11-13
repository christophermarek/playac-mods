# Publishing: account, two-factor, sharing

Sharing puts your mod in **Browse mods** in every player's Mods tab. This guide
sets up what sharing needs, once: an account, two-factor sign-in, and (if you use
the tool) its sign-in. Then it walks through one upload.

You do not need any of this to make mods or to install your own. The full page,
with what happens after review: https://playaconline.com/modding/publishing/

## 1. An account

1. On https://playaconline.com, press **Sign up** (top right), or go to
   https://playaconline.com/register/. (**Log in** is next to it, for later.)
2. Choose a username and password, and confirm your email if asked.

**Check it worked:** you are signed in: your name shows at the top right, and
https://playaconline.com/profile/ opens your Profile page.

Sharing is for players 13 or older; the first upload asks your age. Younger
players can still make and install mods for themselves.

## 2. Two-factor sign-in

Every upload needs it, so nobody who learns your password can publish in your
name. You need an authenticator app on your phone. Any of them works, for
example Google Authenticator, Microsoft Authenticator, 2FAS, Aegis (Android),
or the Passwords app on an iPhone.

1. Open your **Profile** page, https://playaconline.com/profile/, and find
   **Two-factor sign-in**.
2. Press **Set up two-factor sign-in**. A QR code appears.
3. In the authenticator app, add an account and scan the QR code (or type the
   key shown under it).
4. Type the 6 digit code the app shows and press **Turn on two-factor sign-in**.
5. **Keep the recovery codes** it shows: **Copy the codes** or **Save as a file**,
   and keep them somewhere safe. Each works once, in place of a code, if you lose
   your phone. They are shown only this once. Then press **I saved them**.

**Check it worked:** the card says **On.** and how many recovery codes are left.

How the codes are used: when you upload, the site asks for a code from the app.
That code opens a 15-minute window in that browser, in which you can upload or
approve a `playac-mod` sign-in. A `playac-mod` sign-in you approve then lasts
60 minutes on its own.

## 3. Get the mod ready

- A ZIP that installs with no message and works after a restart (or a folder that
  passes `npx playac-mod check` with no error).
- 1 to 4 screenshots of it in the game: PNG or JPEG, at least 200 pixels a side,
  up to 2 MB each. On a computer: macOS Cmd+Shift+4, Windows Win+Shift+S, Linux
  the Print Screen key or your desktop's Screenshot app.
- One line about what this version changes (up to 300 characters).
- Read the rules once: only your own work, nothing from Nintendo or any other
  franchise. https://playaconline.com/modding/rules/ and the checklist at
  https://playaconline.com/modding/testing/

## 4. Upload, in the game

1. Start the game, open **Settings, Mods**, and scroll to **Share a mod**.
2. The first time, it asks your age and asks you to accept the mod rules.
3. Under **Upload a mod**, choose the ZIP, add the screenshots and the changelog
   line, and choose **Send for review**.
4. If it asks for a code, type the one your authenticator app shows.

Our server checks it at once (the game's rules, plus the pictures). A problem is
named with its file, and nothing is kept, so fix it and send again.

**Check it worked:** the upload shows under **Mods you shared** as **Waiting for
review**. An email confirms every upload under your account.

## 4b. Or upload with playac-mod

From the mod's folder:

```bash
npx playac-mod publish --shot shots/in-game.png --changelog "First version"
```

Without the flags it uses the PNG and JPEG files in `.playac/screenshots/` and
this version's section of `CHANGELOG.md` (else `.playac/changelog.txt`). It
checks the mod and those files before it asks you to sign in.

The first time (and again once its sign-in has ended), it signs in with a code:

1. It prints an address on the site (`https://playaconline.com/cli/...`) and a
   code of 8 letters, like `BCDF-GHJK`, then waits.
2. Open the address in a browser where you are signed in to the site.
3. Check that the code on the page is the one in your terminal, and press
   **Approve**. If the page asks, type a code from your authenticator app first.
   Never approve a code you did not start yourself.
4. The page says **Approved**. The terminal carries on by itself and uploads.

**Check it worked:** the terminal ends with
`uploaded yourname.my-mod 1.0.0 (content hash ...): waiting for review`.
`npx playac-mod status` lists your versions and their state.

The sign-in is saved for 60 minutes (another `publish` in that time asks nothing):
in `~/.config/playac-mod/` on macOS and Linux, `%APPDATA%\playac-mod\` on
Windows. `npx playac-mod logout` ends it at once. **Signed-in tools** on
https://playaconline.com/cli/ lists them and can revoke each one. `--no-save` keeps a
sign-in for that one run only.

From a GitHub tag instead of a folder: [Git and GitHub](git-github.md#4-share-a-version-from-a-tag).

## 5. Review

A moderator opens every file of every version: each texture, each line, the
script. There is no fixed time: it waits in the queue until a moderator gets to
it, and nobody else can see or download it meanwhile.

- **Listed**: it is in **Browse mods** for everyone, with a page of its own at
  `https://playaconline.com/mods/<your id>/`.
- **Not approved**: **Mods you shared** shows the rule it broke and the
  moderator's note. Fix it and send it again; a version that was not approved
  may reuse its number.

**Check it worked:** **Mods you shared** (or `npx playac-mod status`) shows the
new state.

## Updates

Raise `"version"` in `mod.json` (1.0.0 to 1.0.1 for a fix, 1.1.0 for something
new) and upload again the same way. Each version is reviewed. Players with an
older one see **Update available**. A version number cannot be reused once it is
waiting, listed or removed.

## When an upload is refused

Each message has a code; the errors catalogue explains it and the fix:
https://playaconline.com/modding/errors/ (the upload ones start with `upload-`).
The usual ones:

| You see | Code | Fix |
|---|---|---|
| Turn on two-factor sign-in on your Profile page before you share a mod. | `upload-two-factor` | Step 2 above. |
| Enter the code from your authenticator app ... | `upload-two-factor` | Type the current code from the app. |
| This version of the mod is already uploaded. | `upload-version-exists` | Raise `"version"` in `mod.json`. |
| An id someone else owns | `upload-not-owner`, `upload-prefix-taken` | Use your own name before the dot. |
| A screenshot refused | `upload-screenshot` | PNG or JPEG, 200 pixels a side or more, 2 MB or less. |
| Too many uploads | `upload-too-many` | 5 an hour, 10 waiting at once: wait. |
| A texture that is an unchanged copy of the game's | `texture-copied` | Paint your own; delete the files you did not repaint. |

More: [Troubleshooting](troubleshooting.md).
