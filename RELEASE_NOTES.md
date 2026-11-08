# Quest For Glory — Version 16

Fixed the baseline audit findings in priority order. The original V15 attachment remains unchanged. This release is still one standalone HTML file with embedded assets and no runtime dependencies.

## High priority: saves and imports

- Unreadable or invalid stored data is preserved, with a persistent recovery notice, a download of the original bytes, and a retry control. Startup no longer silently writes an empty character collection over damaged data.
- Failed storage writes remain visible. Players can export the current in-memory characters and retry saving after storage becomes available.
- Stored and imported character data is validated before rendering, including resources, all card locations, the full 52-card partition, budgets, encounter fields/stages, eligible suits, wound allocations, rollback snapshots, logs and dice.
- Encounter fields containing executable HTML are rejected. Invalid imports leave existing slots unchanged.
- Missing legacy pool/budget fields are derived. Explicitly contradictory balances are rejected rather than silently modifying a character.

## Gameplay and state

- Dice results belong to the character that initiated the roll. Leaving for the menu finishes the pending roll before changing characters. A label tap no longer produces a duplicate synthetic roll.
- No-Supply Rest resumes after reload or returning through the menu without charging another five-point wound. Cancelling that Rest is persisted.
- Exact matches allow zero, one or two selected recovery cards, up to the hand size, in both Challenge and Combat, as specified. Remaining hand cards enter Fatigue.
- Attribute purchases independently enforce the point limit. Resource increments and Fate upgrades reject safe-integer overflow.

## Presentation

- Dice Roller, Roll History, Inventory and Recent Activity reset to collapsed when entering a character.
- The stylesheet boundary is repaired and the embedded Gothic font loads.
- The app identifies itself as Version 16. Irrelevant character-edit controls are hidden on the initial menu.
- Storage key `quest-for-glory-v12-slots` and the version-12 JSON export wrapper are retained for compatibility; the app release number is independent of the save format.

## Verification

69 browser checks passed, zero failed, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. The full suite includes the original 57 checks (release assertion updated to V16 and the zero-resource test updated to require the disabled control), plus 12 regression cases covering recovery backup/retry, schema/rollback validation, legacy fields, save retry, optional exact recovery, Rest resumption/cancellation, in-combat reload, old slot keys, numeric overflow, dice event handling and collapse defaults.

Checked offline operation with browser networking disabled, mobile touch emulation, save/export/import flows, synthetic legacy migration, cancellation after multiple combat retries and the V15 delegated deck-panel interaction fix. Embedded font assets are unchanged. `docs/validation/v16-results.json` records the release verification and source SHA-256; subsequent test runs write `results/baseline-results.json`.

Real iOS Safari, Windows and direct-file storage behavior remain unverified. WebKit download was blocked during the audit; managed Chromium blocks file:// navigation. These limits are not represented as passing tests.

## Using the release

Open `board_game_tracker_v16.html` in a browser. To transfer characters between differently named files or browser origins, export them from V15 and import them into V16. Keep the old V15 file until the transfer is complete. Storage corruption is preserved for manual recovery; V16 does not guess how to repair contradictory character data.
