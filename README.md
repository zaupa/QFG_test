# Quest For Glory V16

`board_game_tracker_v16.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

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

The production HTML is the test target, not a separate instrumented build. Full results in this bundle: 69 passed, zero failed. Real iOS Safari and direct-file persistence require separate device testing.
