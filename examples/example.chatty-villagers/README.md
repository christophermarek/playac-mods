# Chatty Villagers

A villager line pool example (`talk.json`). Client scope: only you hear it.
No script: the game picks the line.

## In the game

![mod line](../../examples-media/example.chatty-villagers/mod-line.webp)

The first talk of the day opens on a new line from the mod's talk pools, picked for the villager's personality.

![own hello](../../examples-media/example.chatty-villagers/own-hello.webp)

The next page is the villager's own hello: the mod's line comes first, and the game's conversation carries on as usual.

![second talk](../../examples-media/example.chatty-villagers/second-talk.webp)

Talk again the same day and there is no mod line: one new line per villager per day.

[![Play the film](../../examples-media/example.chatty-villagers/film.webp)](../../examples-media/example.chatty-villagers/film.mp4)

The film (click the picture): Twiggy's first talk of the day opens on the mod's line, then her own words; a second talk skips straight to her hello.

Each personality has its own pool. On the first ordinary talk of the day a
villager says one line from their personality's pool, then their usual hello,
errands and all. A pool can instead name one villager (`"villager": "Bob"`) or
nobody (every villager), and can say a line only some days (`"chance": 40`).
The most specific pools that match a villager decide.
