# Quest For Glory — Version 20

- Challenge and Combat setup, retry effective bases and modifier-adjusted totals never fall below **1**.
- Removed the initial hand-selection sentence about paid Fate additions; the five-card initial limit and paid exceptions remain unchanged.
- Added a per-character **Round** display between the character banner and Resources. It starts at **0**, advances on completed Rest, and opens a manual Add/Remove dialog when tapped.
- Resources, Card Zones and Actions are collapsible and start expanded. Existing lower-section defaults remain collapsed. The title, character banner and Round stay visible.
- Resource totals are larger and centered between **−** and **+** controls. Tapping a total opens an Add/Remove amount dialog with a preview; invalid or negative resulting totals cannot be confirmed.
- Combat reward totals count up and bounce while changed Coin/Fate boxes shake for about **0.8 seconds**. Supply remains still. Rewards are saved before this visual feedback.
- Applied wounds trigger a **0.5-second** screen shake and red overlay, including manual, Combat and no-Supply Rest wounds.
- Reduced motion disables reward movement/count-up and replaces wound shaking with a quiet temporary tint. Effects stop safely on Undo, cancellation and character changes.
- Combat retry headings now say **Attempt**, distinct from the character's Round.

Open `board_game_tracker_v20.html`. Old saves default to Round 0. V19 is archived under `backup/`, including its tests, documentation and validation records. For different browser origins or differently named files, transfer characters with JSON Export/Import.

The app remains one offline HTML file with embedded fonts. PWA migration is deferred, and no sound assets have been added. See `docs/V20_AUDIT.md` and `docs/validation/v20-results.json` for verification and practical limits.
