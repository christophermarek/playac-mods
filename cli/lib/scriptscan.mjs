/* scriptscan.mjs - a best-effort read of a mod's main script against mod.json.
 *
 * The game page does not run Lua, so nothing here refuses a mod at install:
 * these say what the engine does when the script runs (the game engine api_on,
 * the game engine pc_mod_fx_queue). An on() the engine refuses raises an error,
 * which stops the whole script at load, so those come back with `error: true`
 * and check lists them as problems; the rest are warnings. Only literal calls are seen:
 * on("event", ...) and cmd.<name>(...). Comments and strings are skipped, so
 * an example in a comment is not a call. */

/* Lua source with comments and string literals blanked (newlines kept, so
 * offsets and line numbers still match), and each string literal's value by
 * its start offset. */
export function stripLua(src) {
  const out = src.split('');
  const strings = new Map();
  const blank = (from, to) => { for (let k = from; k < to; k++) if (out[k] !== '\n') out[k] = ' '; };
  const longOpen = (at) => {
    /* "[", any "=", "[": returns the level, or -1 */
    if (src[at] !== '[') return -1;
    let k = at + 1;
    while (src[k] === '=') k++;
    return src[k] === '[' ? k - at - 1 : -1;
  };
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '-' && src[i + 1] === '-') {
      const lv = longOpen(i + 2);
      let end;
      if (lv >= 0) {
        const close = ']' + '='.repeat(lv) + ']';
        const j = src.indexOf(close, i + 4 + lv);
        end = j < 0 ? n : j + close.length;
      } else {
        const j = src.indexOf('\n', i);
        end = j < 0 ? n : j;
      }
      blank(i, end);
      i = end;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      let val = '';
      while (j < n && src[j] !== c && src[j] !== '\n') {
        if (src[j] === '\\' && j + 1 < n) { val += src[j + 1]; j += 2; continue; }
        val += src[j++];
      }
      const end = Math.min(j + 1, n);
      strings.set(i, val);
      blank(i, end);
      i = end;
      continue;
    }
    if (c === '[') {
      const lv = longOpen(i);
      if (lv >= 0) {
        const close = ']' + '='.repeat(lv) + ']';
        const start = i + 2 + lv;
        const j = src.indexOf(close, start);
        const end = j < 0 ? n : j + close.length;
        strings.set(i, src.slice(start, j < 0 ? n : j).replace(/^\n/, ''));
        blank(i, end);
        i = end;
        continue;
      }
    }
    i++;
  }
  return { code: out.join(''), strings };
}

/* The first offset from i that is not white space in the real source (a
 * blanked string is spaces in the stripped code, so skip in src). */
function skipSpace(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++;
  return i;
}

function lineAt(src, offset) {
  let line = 1;
  for (let k = 0; k < offset; k++) if (src.charCodeAt(k) === 10) line++;
  return line;
}

/* src: the script's text. ctx: { api, hooks: [], permissions: [], events:
 * [every event the game has], commands: [every command] }. Returns
 * [{ line, message }], one per name, at its first use. */
export function scanScript(src, ctx) {
  const { code, strings } = stripLua(src);
  const warnings = [];
  const said = new Set();
  const once = (key, offset, message, error = false) => {
    if (said.has(key)) return;
    said.add(key);
    warnings.push({ line: lineAt(src, offset), message, ...(error ? { error: true } : {}) });
  };
  const hooks = ctx.hooks || [];
  const perms = ctx.permissions || [];

  /* on("event", ...): a global call, not x.on or x:on */
  const ON_RE = /(^|[^\w.:])on\s*\(/g;
  for (let m; (m = ON_RE.exec(code));) {
    const at = skipSpace(src, m.index + m[0].length);
    if (!strings.has(at)) continue;
    const ev = strings.get(at);
    const callAt = m.index + m[1].length;
    if (!ctx.events.includes(ev)) {
      once(`on:${ev}`, callAt, `line ${lineAt(src, callAt)}: on(${JSON.stringify(ev)}) names no event the game has, so the game stops your script when it loads and none of it runs: on(): unknown event '${ev}' (the events: ${ctx.events.join(', ')})`, true);
    } else if (!hooks.includes(ev)) {
      once(`on:${ev}`, callAt, `line ${lineAt(src, callAt)}: on(${JSON.stringify(ev)}) but "${ev}" is not in "scripts.hooks" in mod.json, so the game stops your script when it loads and none of it runs: on(): '${ev}' is not in this mod's "hooks" list in mod.json. Add "${ev}" to "hooks"`, true);
    }
  }

  /* cmd.<name>( / cmd.<name>{ / cmd.<name>"..." */
  const CMD_RE = /(^|[^\w.:])cmd\s*\.\s*([A-Za-z_]\w*)/g;
  for (let m; (m = CMD_RE.exec(code));) {
    const next = skipSpace(src, m.index + m[0].length);
    if (code[next] !== '(' && code[next] !== '{' && !strings.has(next)) continue;
    const name = m[2];
    const at = m.index + m[1].length;
    const where = `line ${lineAt(src, at)}: cmd.${name}`;
    /* the game engine queue(): nil, why, and the log line "<event>: cmd.<name> refused: <why>" */
    const refused = `it returns nil and logs: cmd.${name} refused: ${name} is not in this mod's "permissions" in mod.json`;
    if (!ctx.commands.includes(name)) {
      once(`cmd:${name}`, at, `${where} is not a command (the commands: ${ctx.commands.join(', ')}), so calling it stops that handler with an error`);
    } else if (ctx.api < 2) {
      once(`cmd:${name}`, at, `${where}: a command needs "api": 2 and "${name}" in "permissions" in mod.json; at api ${ctx.api} the game refuses every call: ${refused}`);
    } else if (!perms.includes(name)) {
      once(`cmd:${name}`, at, `${where}: "${name}" is not in "permissions" in mod.json, so the game refuses every call: ${refused}`);
    }
  }
  return warnings.sort((a, b) => a.line - b.line);
}
