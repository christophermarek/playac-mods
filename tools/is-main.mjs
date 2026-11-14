/* is-main.mjs - "was this file run as the program?" for the mods scripts.
 *
 * `import.meta.url === \`file://${process.argv[1]}\`` is false whenever the
 * checkout path has a space or a non-ASCII byte (a file URL percent-encodes,
 * argv does not), the script was reached through a symlink (node resolves the
 * main module's real path), or on Windows (file:///C:/... vs C:\...). Then
 * main() never ran and a CI gate like `api-gen.mjs --check` exited 0 having
 * checked nothing (the game's build is the same lesson). */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export function isMain(metaUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  let real;
  try { real = fs.realpathSync(argv1); } catch { return false; }
  return metaUrl === pathToFileURL(real).href;
}
