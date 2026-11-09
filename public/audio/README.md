# Sound effects

`medieval_fantasy_victory_fanfare_3s.wav` is the user-supplied combat-victory sound, kept unchanged: 3 seconds, mono, 44.1 kHz, 16-bit PCM WAV (264,644 bytes).

SHA-256: `9a589a69ad85dbcc6211153af1460f8a748807b8f1577ac9fe67667ecf798bc7`.

The PWA plays this external WAV file directly; its service worker caches it for offline playback. Keep future sound-effect sources in this folder. The legacy V28 builder can still embed it when rebuilding the old standalone HTML, but the active PWA does not embed audio.

A confirmed combat victory requests playback once. Resumed rewards do not replay it; leaving the character or Undo stops current playback. Browser/device restrictions may prevent sound, in which case gameplay continues normally. This repository records the supplied asset without making a separate licensing claim.
