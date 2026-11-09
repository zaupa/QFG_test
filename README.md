# Quest For Glory — React + TypeScript PWA

The companion now runs as an installable PWA with a service worker, IndexedDB character saves, and external JSON, font and audio files. The V28 game rules and interface are preserved. The original standalone HTML is retained in `legacy/board_game_tracker_v28.html`; V27 remains in `backup/`.

## Run on your computer

Install Node.js 20.19+ or 22.12+, then:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Development reloads source edits automatically. Service workers are disabled in development so an old offline cache cannot hide changes.

To test installation and offline play:

```sh
npm run build
npm run preview
```

Open the printed **localhost** URL online once. Wait for **Ready offline**. You can then reload and play offline, or install using the browser’s installation controls / the app’s Install button when offered. Production hosting requires HTTPS; localhost is supported without HTTPS. Double-clicking `index.html` does not run this PWA.

Use the same URL **and port** when returning to your characters: browser storage belongs to an origin. `npm run dev` and `npm run preview` usually use different ports, so they have separate saves. Export/import characters to move between them.

## Update game information without rebuilding

Edit these source files while using `npm run dev`:

- `public/data/enemies.json`
- `public/data/keywords.json`
- `public/data/dungeons.json`

The app fetches all three files afresh on each opening, validates them together, and keeps the last valid complete set in IndexedDB. When an installed app returns to the foreground, it also checks for changes; new libraries apply once the current action or delve finishes, without reloading the game. **Refresh libraries** reopens the app safely when no action or delve is underway. There is no rebuild needed for JSON-only changes.

For a built/deployed app, edit the files actually being served: `dist/data/*.json` (or the hosting server’s corresponding `data/` folder). Editing `public/data` alone does not change an already-built `dist` folder; copy the changed JSON into the served folder. Deploy related enemy/dungeon changes together so their references agree. An invalid or incomplete update shows a notice and preserves the last validated set instead of replacing it.

Active combats and delves retain their saved snapshots. Updated JSON applies to newly started encounters/delves; it cannot rewrite the rules of an encounter already in progress. When offline, the app uses the last validated library set. A first visit requires an online connection.

See [data authoring instructions](public/data/README.md) and the templates beside the JSON files.

## Files

| Location | Purpose |
| --- | --- |
| `src/main.tsx` | React startup, save status, library refresh, installation and update controls |
| `src/game/engine.ts` | Preserved V28 gameplay renderer and action flow, ported into a TypeScript module |
| `src/game/rules.ts`, `types.ts` | Runtime data validation, shared rules and library types |
| `src/game/styles.css` | Extracted application styles |
| `src/platform/storage.ts` | IndexedDB hydration, serialized atomic saves, conflict/error handling |
| `src/platform/libraries.ts` | Fresh JSON loading and validated offline library storage |
| `src/platform/service-worker.ts` | Service worker source, emitted during the production build |
| `public/app/game.html` | External game layout, mounted once by the React application |
| `public/fonts/`, `public/audio/`, `public/icons/` | External font, sound and installation assets |
| `dist/` | Generated deployable application; serve this folder |

React owns the application lifecycle and PWA controls. The existing gameplay DOM renderer is preserved behind a mounted surface to minimize rule regressions; this conversion does not pretend every game form has already been rewritten as a declarative React component. The gameplay module retains flexible typing for legacy save shapes, backed by its existing runtime validation. New platform code and data interfaces are typed. A later UI refactor can replace individual game panels without another storage migration.

## Saves and migration

Characters are saved in the browser’s `quest-for-glory` IndexedDB database. The app displays **Saving…**, **Saved locally**, or a visible unsaved error. Saves are queued and committed atomically. A stale second tab cannot overwrite newer changes from another tab; export its unsaved progress before reloading. Browser storage can be cleared/evicted, so retain JSON exports for important characters.

V28 localStorage saves on the **same origin** migrate automatically after validation. The original localStorage copy is retained as a backup and is never written by the PWA. An existing IndexedDB record, including an empty character list, takes precedence so old characters do not reappear after deletion. Invalid old data remains available through recovery controls.

For saves from a downloaded HTML file or a different URL, open V28, export each character, then use the PWA’s existing Import Character control. Browsers do not allow the PWA to read another origin’s storage. Character JSON remains compatible with the V28 format.

## Updates and offline behavior

The service worker caches the app shell, game layout, fonts, icons and audio. It deliberately does **not** cache JSON responses: the validated bundle in IndexedDB handles offline data. Application code changes require `npm run build`; a content-derived cache version makes the next app release available as **Update app**. Updates wait for explicit selection and are blocked during an open action/delve or while saving. Installing a new worker never automatically reloads an active game.

Deploy the whole `dist` folder, including `sw.js`. Subfolder deployment is supported. Keep the service worker and JSON responses revalidatable in your server/CDN configuration; JSON fetches explicitly bypass the browser HTTP cache.

## Checks

```sh
npm test
```

This builds and type-checks the PWA, runs platform/browser checks and a selected regression suite against the real PWA using IndexedDB. Install Chromium via `npx playwright install chromium` if needed; `/usr/bin/chromium` is used when available. `npm run test:pwa` and `npm run test:gameplay` run the suites against an existing build. Results are written to `results/`.

`npm run build:legacy` and `npm run test:legacy` retain the standalone V28 workflow. The PWA implementation is maintained on the `pwa_wip` branch.

The migration audit and verification limits are recorded in [docs/PWA_AUDIT.md](docs/PWA_AUDIT.md).
