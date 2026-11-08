# Quest For Glory V22

`board_game_tracker_v22.html` is the complete offline application. It needs no server, installation or network connection to play. `RELEASE_NOTES.md` describes the fixes and save compatibility.

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

The production HTML is the test target, not a separate instrumented build. V22 has 173 browser checks. Read `docs/V22_AUDIT.md` for requirements, state migration, animation safety and verification limits; executed results are recorded in `docs/validation/v22-results.json`.

V22 remains a standalone offline HTML app. It adds item names, optional item descriptions, explicit combat item-reward consent, optional item consumption during Heal, Rest confirmation, default Heal/Rest values of 5, and the requested wording/hover changes. Existing saves migrate on load; new character exports use envelope version 14. Real iOS Safari and direct-file persistence need separate device verification.

## Updating enemies

Edit `data/enemies.json` using `data/enemies.template.json` and `data/README.md`, then run:

```sh
npm run build
```

The build validates every entry and embeds a snapshot in V22. Distribute the rebuilt HTML; gameplay needs no separate JSON file or network connection. Rebuild whenever library data changes. Ongoing saved combats retain their original enemy snapshot. No fixed enemy count is imposed.

V21 is archived in `backup/`, including its standalone app, matching data, build scripts, tests, documentation and validation records. The older V20 backup has been removed.

The archived V21 app and library retain their original schema. The root build and data files target V22.
