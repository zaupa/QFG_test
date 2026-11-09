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
