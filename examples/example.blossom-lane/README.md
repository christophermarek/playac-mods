# Blossom Lane

A texture-only example mod: every grown tree in town wears a cherry blossom
crown all year (with snow on top in winter), and fallen petals dot the grass
from spring to autumn. Golden trees stay gold, and saplings keep their look.

Every pixel is drawn by a small program (a crown of lit puffs covered in
five-petal flowers, and seamless grass with petal drifts), never copied from
the game. Each texture is one 128x128 RGBA DDS, named the way the game looks
textures up:

    tex1_<width>x<height>_<texture hash>_<palette hash>_<format>.dds

| What | Texture hash | Palettes |
|---|---|---|
| Tree crown, the rest of the year (February 25 to December 9) | `a67216e4ad55d908` (64x64) | 15 |
| Tree crown, cherry blossom days (April 1 to 8) | `ac6a2be34281d4e2` (64x64) | 15 |
| Tree crown, winter (December 10 to February 24, snow-capped) | `53d6cc5ace654ac7` (64x64) | 15 |
| Grass, spring to autumn | `626709d910129694`, `903adc6355e36f59`, `e96fecd242518c9f` (32x32) | 9 |

The trees change palette through the year, which is why each crown is listed
once per palette. Golden trees are the same crowns under a gold palette: this
mod names every palette but the gold one, so they stay gold (a `$` name, which
matches any palette, would turn them too). Cedars, palms and saplings have
crowns of their own, left as they are here: their names are in the textures
guide's common textures table. The crown keeps the game's cut-out shape: its corners are
fully transparent, so it draws as a round crown, never a square.

Winter grass is left as it is. The names identify which in-game texture to
replace; the pixels are our own. Clover Meadow and Cobble Town also replace the
grass: when two mods change the same texture, the lower one in your list wins.
