# Quest For Glory V23

`board_game_tracker_v23.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

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

The production HTML is the test target, not a separate instrumented build. V23 has 205 browser checks. Read `docs/V23_AUDIT.md` for requirements, state migration, animation safety and verification limits; executed results are recorded in `docs/validation/v23-results.json`.

V23 remains a standalone offline HTML app. It adds equipped weapon/armor slots, durability and repairs, combat equipment modifiers, inventory swaps and optional starting equipment/items. Item names and descriptions have distinct typography, and Heal uses the revised inline value controls and red consumption name. Older saves migrate to empty equipment slots without guessing item types. New exports use version 15; the enemy library uses schema version 3. Real iOS Safari and direct-file persistence need separate device verification.

## Updating enemies

Edit `data/enemies.json` using `data/enemies.template.json` and `data/README.md`, then run:

```sh
npm run build
```

The build validates every entry and embeds a snapshot in V23. Distribute the rebuilt HTML; gameplay needs no separate JSON file or network connection. Rebuild whenever library data changes. Ongoing saved combats retain their original enemy snapshot. No fixed enemy count is imposed.

This is the V23 archive with its matching data, build scripts, tests, docs and validation records. Run its build/tests from this directory. The older V22 backup has been removed. The active V24 app is in the repository root.
