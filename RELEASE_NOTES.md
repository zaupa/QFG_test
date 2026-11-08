# Quest For Glory — Version 19

- Repeated Fate additions/removals share costs of **1, 2, 4, 8… Fate**. The next cost is displayed, and it resets on each combat retry.
- Initial Action Hands are limited to **five cards** in Challenge and each Combat attempt. Paid additions after revealing the modifier may exceed five.
- Combat opens an enemy setup dialog: **Enemy**, Challenge Value **5**, Wound Value **1**, Fate reward **1**, Coin reward **0**, and no item reward by default.
- Optional item rewards use the inventory Description, Keywords and Base Value structure, with the same 300-character combined text limit.
- Victory grants rewards once. When Inventory is full, choose to retain it or explicitly select an item to discard and replace. Resource rewards remain collected if the item is declined.
- Pending reward choices survive saves, reloads and JSON transfer. Old encounters migrate without retroactive rewards; adjustment costs, Undo and cancellation remain consistent.
- New dialogs support mobile scrolling and keyboard focus containment. Resource and difficulty overflow guards prevent invalid saved values.

Open `board_game_tracker_v19.html`. The app remains one offline HTML file with embedded fonts. The PWA migration remains deferred. V18 is archived in `backup/`, including its tests, documentation and validation records. Earlier versions are also available in Git history. To transfer a character between different browser origins or differently named files, export from the old file and import into V19.

See `docs/V19_AUDIT.md` and the recorded validation results. The full regression suite passed 106 checks; the final CSS-only mobile spacing correction passed three focused follow-up checks with unchanged JavaScript. Real iOS Safari and direct-file persistence remain unverified.
