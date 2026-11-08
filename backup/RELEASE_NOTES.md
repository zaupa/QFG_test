# V21

- Combat starts with a choice between custom enemy creation and the enemy library. A raised information box shows the enemy name, description, original CV, WV, Fate/Coin rewards, italic keywords and item reward throughout combat.
- Enemy cards use `id`, `name`, `description`, `CV`, `WV`, `F`, `C`, `KW` and `Item`. WV may be zero; a failed zero-wound combat skips wound allocation and offers retry/flee under the existing rules.
- Library data is validated and embedded by `npm run build`, preserving standalone offline play. Active combats keep an independent enemy snapshot.
- Inventory and reward-item keywords are arrays displayed in italics with ` - ` separators. Older text keywords migrate on load; internal hyphens and phrases are preserved.
- Purchases and sales animate the Coin resource box and count toward the saved total. Free, zero-price and rejected transactions do not animate. Undo, navigation and reduced-motion handling remain supported.
- Character exports use envelope version 13. Existing storage keys and older imports remain supported. V20 is archived in `backup/`; the older V19 backup is removed.

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
