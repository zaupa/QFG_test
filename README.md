# Quest For Glory — V34

V34 adds JSON-configured shops with stock quantities and decimal buy/sell rates, weighted terrain encounters, and random dungeon Challenge types. Use **Map** to enter local cities or dungeons. Manual inventory addition is free and removal destroys the item; use shops for commerce.

This version is intended for **new characters**. Shop stock, sold equipment condition, and active dungeon Challenge types save locally and work offline after the app has loaded online once. Existing shop stock is retained when libraries refresh; new characters use the latest JSON definitions. The toolbox is unchanged.

See [data configuration](public/data/README.md#v34-shops-and-weighted-encounters), [release notes](RELEASE_NOTES.md), and the versioned audits in `docs`. The historical notes below describe earlier releases.

# Quest For Glory — React + TypeScript PWA

The companion now runs as an installable PWA with a service worker, IndexedDB character saves, and external JSON, font and audio files. The current release is V33, with map-owned locations, Adventure Actions, movement Challenges/encounters and selectable character meeples. The original standalone HTML is retained in `legacy/board_game_tracker_v28.html`; V27 remains in `backup/`.

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

Open the printed **localhost** URL online once. Wait for **Ready offline**. This now checks the cached files and successful game startup, rather than just the presence of an active service worker. You can then reload and play offline, or install using the browser’s installation controls / the app’s Install button when offered. Production hosting requires HTTPS; localhost is supported without HTTPS. Double-clicking `index.html` does not run this PWA.

Use the same URL **and port** when returning to your characters: browser storage belongs to an origin. `npm run dev` and `npm run preview` usually use different ports, so they have separate saves. Export/import characters to move between them.

## Update game information without rebuilding

Edit these source files while using `npm run dev`:

- `public/data/enemies.json`
- `public/data/keywords.json`
- `public/data/dungeons.json`
- `public/data/items.json`

The app fetches all four files afresh on each opening, validates them together, and keeps the last valid complete set in IndexedDB. When an installed app returns to the foreground, it also checks for changes; new libraries apply once the current action or delve finishes, without reloading the game. **Refresh libraries** checks and applies JSON updates in place when no action or delve is underway. It never reloads the document; if the server is stopped, the current character and libraries stay open and a message explains that updates are unavailable. There is no rebuild needed for JSON-only changes.

For a built/deployed app, edit the files actually being served: `dist/data/*.json` (or the hosting server’s corresponding `data/` folder). Editing `public/data` alone does not change an already-built `dist` folder; copy the changed JSON into the served folder. Deploy related enemy/dungeon changes together so their references agree. An invalid or incomplete update shows a notice and preserves the last validated set instead of replacing it.

Active combats and delves retain their saved snapshots. Updated JSON applies to newly started encounters/delves; it cannot rewrite the rules of an encounter already in progress. When offline, the app uses the last validated library set. A first visit requires an online connection.

See [data authoring instructions](public/data/README.md) and the templates beside the JSON files.

## Files

| Location | Purpose |
| --- | --- |
| `src/main.tsx` | React startup, save status, library refresh, installation and update controls |
| `src/game/engine.ts` | Preserved Gameplay renderer and action flow, ported into a TypeScript module |
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

## Recover a blank installed window

Start the server again from the project folder with `npm.cmd run preview` in Windows PowerShell (`npm run preview` in other shells). Use the same browser profile, address and port as installation. Reload the installed window with Ctrl+R; if it stays blank, try Ctrl+Shift+R while the server is running, or open the same address directly in the browser that installed it. Do not uninstall the PWA or clear site/browser data: those steps can remove IndexedDB characters. Export character backups after recovery.

Version 29.0.1 changes manual library refresh to an in-place operation, adds an HTML recovery message if JavaScript cannot start, and retains two previous shell caches to handle older asset references during an app update. The Ready offline indicator waits for an active service worker. A stopped local server is tested separately from a disconnected internet connection.

### Windows offline startup repair (29.0.2)

Earlier Windows builds put backslashes in the service-worker asset list. That could bypass the cached `app/game.html` and show “Failed to fetch” after stopping the server. Asset paths now use URL forward slashes on every operating system. The matching game layout also has a content-verified IndexedDB fallback; character records are untouched.

After installing this repair, keep the server running while opening the app and applying **Update app**. Wait until **Ready offline** appears, then stop the server and retry offline. “Network available” describes the browser network connection, not the status of the local preview server. Do not uninstall or clear site data when recovering.

## V30 custom definitions

Newly confirmed enemies are stored as Custom definitions in the current character and appear in the enemy picker. Newly confirmed item configurations become reusable Custom item templates; typing an inventory item name offers close saved/game-defined matches, prioritizing exact names. Choose a suggestion to fill its fields, then review and confirm. Multiple physical inventory copies remain allowed. Editing an owned game item does not overwrite its shared definition; give a changed variant a new unique name to save it as a separate custom template. Equipment templates represent a new item with four usage points; inventory wear is independent.

Options contains Manage Custom Keywords, Manage Custom Enemies and Manage Custom Items. Enemy/item managers support add, edit, remove and JSON export/import. Changes remain in a temporary draft until Save changes; Cancel discards them. Definition changes never rewrite existing inventory/equipment or an active combat. Confirmed definitions, like custom keyword preferences, remain through gameplay Undo/Cancel.

Names are unique within each definition kind, ignoring case, Unicode compatibility differences and repeated spaces. New definitions cannot reuse names already in the shared library or character catalog. Import conflicts reject the entire import before changing the draft. If a later shared JSON update introduces a name already owned by a character’s custom catalog, that character retains one selectable Custom entry; the new shared record is not shown as a second definition. Dungeon snapshots continue using their own referenced game enemies.

`items.json` has format `quest-for-glory-items`, version 1, and an `items` array using the existing item schema. `items.template.json` is an authoring example. The initial game catalog contains the existing dagger reward and dungeon treasure with their original stats; loading the catalog does not give free inventory items. All four JSON files refresh/validate together and work through the same IndexedDB offline fallback. Older cached bundles without an item catalog remain usable offline with an empty game-item catalog until the next successful online refresh.

Click an enemy’s name in the dungeon encounter table to inspect its full snapshot stats without starting a fight.

V30's custom catalogs, duplicate-name policy, migration notes and test evidence are documented in [docs/V30_AUDIT.md](docs/V30_AUDIT.md).

## If Refresh libraries appears not to update

The server must be running at the installed app’s exact address/port to read edited files. With `npm run preview`, the served files are in `dist/data`, not `public/data`. After editing source JSON, copy it without rebuilding:

```powershell
Copy-Item .\public\data\*.json .\dist\data\ -Force
npm.cmd run preview
```

Then use Refresh libraries when idle. Opening the app’s `/data/enemies.json` (or the corresponding library filename) in the same browser shows exactly what that server is supplying. With `npm run dev`, edit `public/data` directly. Refresh now reports unchanged supported definitions or the specific JSON file/validation error, while retaining the last valid bundle. Custom definitions and active encounter snapshots remain separate.

V31 implements dungeon `completionFateReward`: additional Fate is banked after boss victory, listed in congratulations, and collected once with pending Coins on Exit Dungeon. Active delves keep their original definition snapshot; updated JSON affects the next delve.

## V31 — City and recovery

**Visit City**, beside Dungeon Delve, opens a separate screen with Blacksmith, Shop, Inn and Guild, plus a collapsed Character Sheet. Exit City returns to the normal screen. The Shop is a placeholder until its purchasing rules are defined. City visits, paid Rest transactions, and character progress persist in IndexedDB and work offline. Library/application updates wait until the city visit or other active operation ends.

The **Guild** alone sells Attribute Points for Fate (3 points per Fate). The Card Zones Attribute Points shortcut still lets you spend already unused points outside the Guild, including elsewhere in the city. Upgrade is unavailable throughout a dungeon.

**Heal** requires an inventory item with the exact `heal` keyword. Set its positive integer `healingAmount` in every item definition, including enemy rewards and dungeon treasure. The amount sets the maximum combined value of selected Wound cards; there is no manual Heal value. Confirmation consumes one selected item and returns those cards to the Attribute Deck; cancellation consumes nothing. Older character items and pre-V31 offline catalogs missing this value migrate to the previous default, 5. New forms, imports of custom definitions, and network JSON require an explicit amount.

**Rest** starts with a location-specific type: Bad in a dungeon (5 Fatigue points), Partial normally (15), Complete in the Inn (30). Other types are shown disabled. Outside the Inn it spends 1 Supply when available; without Supply it drops one type (minimum Bad) and first causes 5 Wound points. An optional inventory item with `rest` promotes one type after this downgrade, capped at Complete, and is consumed on confirmation. Inn Rest costs 10 Coins, uses no Supply, never downgrades or causes the no-Supply Wound, and does not need a promoting item.

Select the type/item before the final Rest prompt. Confirming commits costs/item use and persists the recovery transaction. It cannot then be cancelled or switched to another action; finish any Wound allocation, then choose Fatigue cards up to the fixed recovery limit and confirm recovery. Recovering zero cards is allowed so Rest can finish even if no Fatigue cards remain. Round advances once when recovery completes; dying during the Wound allocation does not advance Round. Reload resumes paid recovery without charging again. Dungeon Rest remains once per cleared level, after its challenge and encounter are won.

The **Inn** also sells integer Supply bundles: 1 Coin buys 2 Supply. The **Blacksmith** repairs broken equipped or inventory weapons/armor. The repair confirmation starts at 5 Coins, supports an adjusted nonnegative payment, and restores all four usage points. Cancellation is free; no Fix control is available elsewhere. Repairs leave inventory equipment in inventory.

Build and preview the update with `npm.cmd run build` then `npm.cmd run preview`. Keep the same browser profile, host and port to retain your local saves. Source JSON lives in `public/data`; preview serves the built `dist/data` copy.

V31 validation and transaction details are in [docs/V31_AUDIT.md](docs/V31_AUDIT.md).

## V32 — Adventures, cities and terrain movement

New characters choose a predefined Adventure Module. The supplied test adventure is **Goriath’s Revenge**, starting inside **Lithengard** on map space **T01**. Its fan-shaped map has 19 spaces. All exterior non-start spaces are Mountains named **Horseshoe Mountains**; the starting city occupies the opening at the base.

Exit the city to enter Wilderness. **Move to Another Terrain**, beside Visit City, opens the map: choose a highlighted border-sharing space and confirm **Move here**. Corner contact does not count. On phones the map scrolls horizontally and initially centers on the hero. Current position and adventure ID save locally, survive offline reloads, and participate in Undo.

**Visit City** opens a list filtered by the selected adventure. Its city screen shows only configured amenities: Blacksmith, Shop, Inn, Guild and optional Temple. The Temple defaults to 10 Coins for up to 5 Wound-card points, requires no item, and charges only on confirmed healing. Each city controls Inn prices, Supply bundle price/quantity, Guild points per Fate, Temple price/recovery, and default repair payment. Blacksmith payment remains adjustable as in V31. Active city visits retain their configuration snapshot; reentry uses refreshed definitions.

The four new catalogs live beside the existing game libraries in `public/data`: `adventure-modules.json`, `cities.json`, `terrain-types.json`, and `maps.json`, each with a matching template. All eight catalogs refresh and validate atomically; invalid references or geometry preserve the last good offline bundle. See [public/data/README.md](public/data/README.md) for schemas. Preview serves `dist/data`, so rebuild or copy changed source JSON into the served folder before refreshing.

The current adventure lists govern city/dungeon availability throughout Wilderness. Visits preserve the map space to return to; map movement itself always crosses one shared border. Terrain discovery, travel Challenges, two-Action Rounds and Event/encounter automation remain separate future mechanics.

Old character names and progress are preserved. Recognized adventure names migrate to IDs; unmatched names remain visible and require choosing a predefined module before map/city/dungeon selection. Existing city and dungeon activities can finish using their saved state. An old offline cache without the new world catalogs can still open characters; reconnect and refresh to enable the new catalogs. Character export envelope version is 23; IndexedDB’s database version is unchanged.

V32 audit evidence and screenshots: [docs/V32_AUDIT.md](docs/V32_AUDIT.md). No toolbox files are changed.

## V33 — Adventure Actions and map locations

Create fresh V33 characters for this release. Choose **Wandering Hero**, **Ranger**, or **Spellcaster** during creation; the meeple is cosmetic and marks the character's map tile.

The **Map** button opens a view where every tile can be inspected, including its cities/dungeons. Settlement and stairs symbols identify cities and dungeons. The map owns all location placement; Adventure Modules reference their map rather than separate city/dungeon lists. Visit City, Dungeon Delve and the Map's entry buttons allow only locations on the character's current Wilderness tile.

Each Round grants **2 Adventure Actions**. A confirmed movement attempt or location entry spends one. Inspection, cancellation before confirmation, exiting a location, inventory management, healing, dice rolls and manual Combat/Challenge do not spend these actions. Existing activities within a city/dungeon visit retain their existing rules.

Movement follows the confirmed sequence: spend one action → starting terrain's Challenge → on success, starting tile's encounter roll → win any triggered combat → arrive at the adjacent destination. Failure, abandoning the movement Challenge, or fleeing combat leaves the hero on the starting tile with the action spent. Existing Challenge modifiers, Fate adjustments, exact recovery, equipment, wounds and rewards still apply. A forced encounter can use Deadly Effort when no Attribute cards remain; if combat cannot start, abandon the attempt rather than become stuck. Rolls, enemy choice and pending stages save without charging or rerolling on reload.

Terrain `movementCV` defaults to 5. Map encounters use Danger Level 2 by default (1–2 on 1d6), either globally or per tile. Each successful movement Challenge gets its own encounter check; there is no one-encounter-per-Round cap. The enemy list comes from the starting tile, falling back to the map table, and uses equal selection odds.

At zero actions, Rest is offered once the current movement/combat is resolved and existing Rest rules allow it. Decline to stay in the Round: viewing the character/map, dice, healing, inventory/equipment management and manual Combat/Challenge remain available. Movement and location entry are blocked. The Rest button remains available later; completed Rest advances Round and restores two actions. Costs/Wounds, Inn rules and the dungeon's one-Rest-per-cleared-level rule remain unchanged. Cancelling or dying during Rest does not refill actions. Manual Round-number corrections do not grant actions.

Maps configure **2–6 surrounding rings**, excluding the center, with complete tile definitions and exact shared-border neighbor lists. Goriath's Revenge still uses 19 tiles: Lithengard on T01 and the test dungeon on T04. Update source JSON/templates under `public/data`; preview still serves `dist/data`. [V33 audit and screenshots](docs/V33_AUDIT.md). Toolbox files remain unchanged.

## V34 verification

`npm test` builds the production app and runs current PWA, custom-library, stopped-server, world/movement, recovery-rule, and V34 shop/Challenge suites. `npm run test:v34` runs the focused new behavior checks against an existing production build. Historical gameplay/release suites remain available through their existing scripts and `test:historical`; their obsolete pre-V34 inventory-commerce controls and legacy-character fixtures are not part of the V34 fresh-character acceptance checks.
