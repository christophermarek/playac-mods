# Clover Meadow

A texture-only example mod. It replaces the town grass with our own drawing:
seamless green ground with clover leaves and small white flowers, one 128x128
uncompressed RGBA DDS picture, saved under every name the game draws the
grass with.

The names say which in-game texture to replace; the pixels are our own. The
grass is six textures, and the game draws each under several palettes through
the seasons and the time of day, so the mod has one file per pairing:

    tex1_32x32_<texture>_<palette>_8.dds

These three grass textures are drawn under nine palettes:

    textures: 626709d910129694 903adc6355e36f59 e96fecd242518c9f
    palettes: 193ca5974976e36e 20430b0042498b04 4f54e78515f0a185
              8910d24f6fbd5f83 8b8a1c2cacd60254 963dc45f18e13cf7
              b2e512f9c0fe88ad e7f9e59c09c5f9d0 f83e63a8b6cb47b7

And these three under three palettes:

    textures: 82f28ec4199a45be cfa57a6e6f966d11 e2ab673814e71af6
    palettes: 6d5ff5628ae85b42 ce63d23d746a058a d9eb32f9a8b17411

That is 36 files, all the same picture. One file per texture named with `$` in
place of the palette (`tex1_32x32_626709d910129694_$_8.dds`) would cover every
palette too.

The pictures are drawn by a small program, never copied from the game.
