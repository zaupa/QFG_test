# Quest For Glory V18

`board_game_tracker_v18.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

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

The production HTML is the test target, not a separate instrumented build. Release verification is recorded in `docs/validation/v18-results.json`. Additional focused border, font and title checks are recorded alongside it; each result includes the SHA-256 of the exact HTML tested. Real iOS Safari and direct-file persistence require separate device testing.

The supplied Righteous WOFF2 is embedded in V18 for the app title, character names and Adventure Module names. It was verified with networking disabled; focused results are in `docs/validation/v18-font-results.json`.
