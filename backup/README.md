# Quest For Glory V21

`board_game_tracker_v21.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

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

The production HTML is the test target, not a separate instrumented build. V21 has 153 browser checks. Read `docs/V21_AUDIT.md` for requirements, state migration, animation safety and verification limits; executed results are recorded in `docs/validation/v21-results.json`.

V21 remains a standalone offline HTML app. Combat now offers custom enemies or the embedded enemy library, and shows enemy details throughout the encounter. Inventory keywords use arrays and italic display; buying and selling animate Coin changes. Older character saves are migrated on load. Real iOS Safari and direct-file persistence need separate device verification.

## Updating enemies

Edit `data/enemies.json` using `data/enemies.template.json` and `data/README.md`, then run:

```sh
npm run build
```

The build validates every entry and embeds a snapshot in V21. Distribute the rebuilt HTML; gameplay needs no separate JSON file or network connection. Rebuild whenever library data changes. Ongoing saved combats retain their original enemy snapshot. No fixed enemy count is imposed.

This is the V21 archive, including matching data, build scripts, tests and documentation. Run its build/tests from this directory. The older V20 backup has been removed.
