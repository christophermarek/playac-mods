/* luasyntax.mjs - Lua syntax errors from the game's own parser.
 *
 * The game runs Lua 5.4.7 text chunks. `check` asked a `luac` on
 * PATH and, with none, said nothing: a script with a typo passed check and then
 * stopped in the game at load. luasyntax.wasm.mjs is the vendored Lua's parser
 * compiled to WebAssembly (the game's build), so every machine with
 * Node checks syntax the way the game does. It parses, never runs. */
import LuaSyntax from './luasyntax.wasm.mjs';

let mod = null;

async function load() {
  if (!mod) mod = await LuaSyntax();
  return mod;
}

/* '' when the chunk parses, else "<name>:<line>: <what> near <token>", the
 * words the game's Mods tab shows for the same script. */
export async function luaSyntaxError(name, bytes) {
  const m = await load();
  const src = bytes instanceof Uint8Array ? bytes : new TextEncoder().encode(String(bytes));
  const chunk = new TextEncoder().encode(`=${name}\0`);
  const ps = m._malloc(src.length + 1);
  const pc = m._malloc(chunk.length);
  try {
    m.HEAPU8.set(src, ps);
    m.HEAPU8[ps + src.length] = 0;
    m.HEAPU8.set(chunk, pc);
    return m.UTF8ToString(m._lua_syntax(ps, src.length, pc));
  } finally {
    m._free(ps);
    m._free(pc);
  }
}
