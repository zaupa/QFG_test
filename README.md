# Quest For Glory V26

`board_game_tracker_v26.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

## Development checks

Use Node.js 20+ and install the pinned test dependency:

```sh
npm install
npx playwright install chromium
npm test
```

An installed `/usr/bin/chromium` is used when present; otherwise the harness uses Playwright's Chromium. To select a different installed Chromium, set `CHROMIUM_PATH` to its executable.

The suite serves the HTML on an ephemeral loopback port, uses isolated browser contexts and synthetic saves, and writes results into `results/`. It never reads a regular browser profile or real character saves. The offline test also runs with networking disabled and serves the source through browser routing.

To run selected cases on macOS/Linux:

```sh
TEST_FILTER='^(40|58|62) ' npm test
```

On Windows PowerShell set `$env:TEST_FILTER='^(40|58|62) '` before `npm test`. Filtered runs write `filtered-results.json`; full runs write `baseline-results.json`. A failed assertion exits with status 1. Test fixtures are generated in the suite; no private saves are bundled.

The production HTML is the test target, not a separate instrumented build. V26 has 275 browser checks. Read `docs/V26_AUDIT.md` for requirements, state migration, animation safety and verification limits; executed results are recorded in `docs/validation/v26-results.json`.

V26 remains a standalone offline HTML app. It adds temporary keyword toggles while editing, character-specific keyword/category management with JSON sharing, enemy association toggles and comma gating, aligned equipment checkboxes, and the supplied three-second combat-victory sound. Exports use character envelope version 18; older custom words migrate with explicit custom origin. The enemy/global keyword formats remain unchanged. Real iOS Safari and direct-file persistence need separate device verification.

## Updating enemies

Edit `data/enemies.json` using `data/enemies.template.json` and `data/README.md`. Edit `data/keywords.json` to change suggestions, then run:

```sh
npm run build
```

The build validates both catalogs and embeds their snapshots in V26. Distribute the rebuilt HTML; gameplay needs no separate JSON file or network connection. Rebuild whenever library data changes. Ongoing saved combats retain their original enemy snapshot. No fixed enemy count is imposed.

V24 is archived in `backup/`, including its standalone app, matching data, build scripts, tests, docs and validation records. The older V23 backup has been removed. The root build and data files target V26. V25 remains unchanged in the root during development.

## Sound effects

Source assets live in `audio/`. The supplied `medieval_fantasy_victory_fanfare_3s.wav` is embedded by `npm run build`; downloaded HTML needs no separate sound folder. Build overrides support `--audio path/to/sound.wav`. Browser audio restrictions are handled without affecting game state.

## Custom keyword sharing

Use **Manage Keywords** beside Edit Module to add/edit/remove suggestions, assign a predefined category or create a new one. Add/Update puts a word into the shown draft; **Save changes** commits it. Cancel discards edits. Existing item/enemy keywords are not rewritten. **Export Custom Keywords** exports the shown list and category assignments with custom provenance; **Import Custom Keywords** merges into the draft without overwriting existing duplicate assignments. Save to apply the import.
