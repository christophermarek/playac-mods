# Chatty Villagers

A villager line pool example (`talk.json`). Client scope: only you hear it.
No script: the game picks the line.

Each personality has its own pool. On the first ordinary talk of the day a
villager says one line from their personality's pool, then their usual hello,
errands and all. A pool can instead name one villager (`"villager": "Bob"`) or
nobody (every villager), and can say a line only some days (`"chance": 40`).
The most specific pools that match a villager decide.
