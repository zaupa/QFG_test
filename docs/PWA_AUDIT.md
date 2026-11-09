# React / TypeScript PWA migration audit

This is the local V29 PWA implementation based on audited V28 gameplay. It is prepared for publication to the `pwa_wip` branch. V28 is preserved in `legacy/board_game_tracker_v28.html`; V27 remains in `backup/`.

## Implemented

- React manages startup, error/recovery screens, save status, installation, foreground data refresh and explicit service-worker updates.
- V28 gameplay and runtime validation are ported into TypeScript modules. Existing gameplay DOM rendering is mounted once into the React surface; this is an incremental React migration, not a claim that every game form is now declarative JSX. Legacy save shapes retain flexible typing and runtime validation; platform interfaces are typed. No TypeScript checks are suppressed with `@ts-nocheck`.
- Active assets are external: `public/app/game.html`, CSS, four font files, the original WAV, icons, manifest, and the three JSON libraries. The PWA does not load the archived embedded HTML.
- Character slots are hydrated from IndexedDB before gameplay starts. Writes are serialized and committed atomically with revision checks; another tab cannot silently overwrite a newer save. Pending writes show Saving, committed writes show Saved locally, and failures preserve in-memory progress with export/retry controls.
- Same-origin legacy localStorage is read only when no IndexedDB character record exists. Validated migration preserves the original localStorage bytes. Invalid data is not replaced with an empty save. Different-origin / downloaded-HTML saves move through existing character JSON export/import.
- Enemy, keyword and dungeon JSON are fetched with no HTTP caching on each opening and on foreground return. All three are validated together, including dungeon enemy references. Only a valid complete bundle replaces the IndexedDB offline copy. Invalid updates show a notice and retain the previous set.
- Foreground changes apply when idle. An active action/delve defers library replacement, while saved combats/delves keep their existing snapshots. No automatic document reload interrupts gameplay.
- A production service worker precaches the shell, layout, fonts, icons and audio. JSON responses bypass its cache; offline libraries come from the validated IndexedDB bundle. Shell caches are scoped to the deployment path. Content-derived versions expose an Update app control; activation requires an explicit idle action after saves finish.
- Vite serves the development app with service workers disabled. A production build and preview exercise installation/offline behavior. Localhost and deployment subdirectories are supported.

## Verification

**274 distinct checks passed: 25 PWA/platform checks and 249 selected existing gameplay regressions run against the PWA with IndexedDB.** A final 21-case gameplay smoke run also passed after the final platform changes and patched Vite update. The aggregate is not a claim that all original 338 standalone checks were rerun against the final PWA build.

The platform suite verifies actual IndexedDB persistence, migration/empty-save precedence, malformed data recovery, service-worker installation, offline reload, external audio/fonts offline, JSON-only edits without rebuilding, invalid/cross-reference fallback, active snapshots, portable exports/imports, multi-tab conflicts, quota failures/export/retry, subfolder deployment, update deferral, foreground refresh and mobile layout. The gameplay suite covers cards, challenges, combat, Fate, retries, equipment, wounds, healing/rest, upgrades, inventory, keyword modifiers, Deadly Effort, Game Over, animation/audio, and dungeon/boss/reward flows.

Type-checking, a production build, development-server startup, static asset separation, and whitespace checks pass. Dependency audit reports zero known vulnerabilities after updating Vite to 7.3.8. Detailed results and final deployed-file hashes are stored in `docs/validation/pwa-results.json` and the accompanying raw reports. A 320px screenshot is retained there.

## Operational notes and limits

Use `npm ci`, then `npm run dev` for feature development. Use `npm run build` and `npm run preview` to test installation/offline play. Edit `public/data/*.json` during development; edit the served `dist/data/*.json` after building/deploying. JSON-only updates require no rebuild. App-code and asset changes do require rebuilding. HTTPS is required outside localhost; opening index.html directly is unsupported.

Browser storage is origin/port-specific and can be removed by the browser or user. Keep exported backups. Physical Safari/iOS installation and browser-specific eviction behavior have not been tested here. Chromium tests establish local PWA behavior, not an external hosting deployment. No server sync or cloud account has been added.

## V29.0.1 offline refresh repair

The user reported a blank installed window after stopping the preview server and selecting Refresh libraries. The old control was confirmed to navigate/restart the app; a stopped-server regression failed its no-navigation assertion. The exact blank Windows installed-window state was not reproduced in managed Chromium, so no claim is made that its cache state was identified.

Manual refresh now fetches and validates JSON in place. Server/validation failures leave the current character and rules visible; active operations remain protected. Initial HTML contains recovery guidance before React loads, Ready offline waits for an active worker, and two previous version caches remain available for older asset references during updates. Character IndexedDB data is not cleared or migrated by this fix.

See `docs/validation/offline-refresh-results.json` for the repair's final artifact hashes, platform checks, stopped-server regression and affected gameplay rerun. Recovery on an existing older installation starts by restoring the same local server and browser origin; reinstalling or clearing site data is not part of the remedy. This repair is prepared for publication to `pwa_wip`.

## V29.0.2 Windows offline startup

The second reported screen identifies a startup resource failure after the shell loaded. Source inspection isolated `app/game.html`: the old build script used native `path.join` strings as URL keys. On Windows those strings contain backslashes. URL construction during precaching normalized them, but the fetch-handler membership check did not; it skipped the cached interface and attempted a dead server. Its string-based `dist/data/` exclusion also failed on Windows. A Windows-path regression demonstrates both mismatches.

The builder now normalizes relative asset URLs before filtering, hashing and emitting them. The worker defensively normalizes its manifest and handles app resources explicitly. A content-hashed, matching interface copy in IndexedDB provides an additional fallback, without touching character data. Ready offline is gated by successful gameplay startup and a worker/cache verification handshake; the handshake repairs missing files only when fetch succeeds. The network label no longer implies the local server is running.

Verification includes browser tests with a Windows-style manifest, deleted interface cache with/without its IndexedDB fallback, precise recovery errors, preserved recovery exports, and repair after reconnecting the server. The tests simulate Windows path handling under managed Chromium; a physical Windows installed-PWA session is not claimed. See `docs/validation/windows-offline-results.json` for final outcomes and artifact hashes. This repair is prepared for publication to `pwa_wip`.
