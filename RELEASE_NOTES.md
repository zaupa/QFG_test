# Quest For Glory — Version 17

Challenge and Combat now show a live preview when selecting a card for a Fate adjustment. The preview shows the current and resulting Action Hand totals, the added or removed value, final difficulty, and Success or Failure. An exact match is identified explicitly.

Selecting a different card updates the preview immediately. Previewing does not spend Fate or move cards; the existing confirmation button applies the adjustment. Back clears the preview. Challenge suit restrictions, normal Luck face values, combat retry difficulty reductions and revealed modifiers all remain in effect.

V17 replaces the V16 release file on this branch. The save key and JSON format are unchanged; existing V16 exports remain supported. Earlier versions remain available in Git history.

All 74 browser checks passed, including live add/remove previews in both action types, exact matches, normal Luck values, combat retries, Back and confirmation behavior, and mobile touch interaction.

V17 regression results are recorded in `docs/validation/v17-results.json`; run `npm test` to repeat the suite.

## Existing fixes retained

V17 retains the V16 save protection, storage recovery exports and retries, import validation, character-bound dice results, resumable no-Supply Rest, optional exact-match recovery, card budget enforcement, collapsed section defaults and typography fixes. The original V15 file is preserved.

## Using the release

Open `board_game_tracker_v17.html` in a browser. To transfer characters between differently named files or browser origins, export them from the old version and import them into V17. The app remains a single offline HTML file with embedded assets.

Verification used Chromium 156.0.8078.79 and Playwright 1.62.1 on Linux, including mobile touch emulation. Real iOS Safari and direct-file persistence remain unverified.
