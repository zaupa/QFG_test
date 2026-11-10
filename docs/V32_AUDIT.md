# V32 audit — Adventures, cities and terrain movement

V32 implements the collected feature notes. Changes are local on `pwa_wip`; no commit or push was performed. The toolbox is unchanged.

## Delivered behavior

- Predefined Adventure Module selection replaces free text at creation and in Options. Module definitions reference maps, cities, dungeons and starting locations. Dungeon selection is filtered by the character's selected module.
- Visit City opens a module-filtered chooser. Each city snapshots its configured amenities/prices for the active visit. Missing amenities are unavailable. Temple healing defaults to 10 Coins for up to 5 Wound points, requires no item, supports cancellation/Undo, and charges only on confirmation.
- The character saves Wilderness/City/Dungeon position, the selected module ID, and a return map space. Entering/exiting cities or dungeons retains that space. New characters start at the selected module's configured location.
- Goriath's Revenge starts inside Lithengard at T01. Its map contains exactly 19 spaces: one starting center and rings of 5, 6 and 7 spaces. Outer-ring and side-boundary non-start spaces are Mountains named Horseshoe Mountains, forming a horseshoe around the city opening.
- Move to Another Terrain opens an SVG map. Only shared-border neighbors are selectable; corner contact, nonneighbors and skipped rings are unavailable. Selection is a draft until Move here. Movement preserves resources/Round, supports Undo, saves immediately, and works offline. On phones the map pans horizontally and opens centered on the hero; keyboard selection is also supported.
- Four external JSON catalogs and templates join the original four in an atomic online/offline library bundle. Runtime validation checks IDs, references, prices, starting positions, complete ring geometry, connectedness and exact adjacency. Labels render as literal text. No external JSON is evaluated as code.

## Migration and scope decisions

Old typed adventure names remain intact. Recognized names gain IDs; unmatched names require explicit predefined selection before world selection/travel. Existing active city/dungeon saves can finish without forced relocation, including paid Inn Rest. Legacy generic city visits retain V31 defaults. Old offline caches lacking world catalogs still open existing characters; reconnecting and refreshing restores map functionality. Character export envelope version is 23; the IndexedDB database version is unchanged.

City and dungeon availability is currently module-wide. Per-terrain location discovery/restrictions, movement Challenges, two-Action Round flow and Event/encounter automation were not part of the final concrete V32 notes and remain future work. Shop purchasing is still a placeholder. Blacksmith price is the configurable default editable payment, preserving the established repair rule; Inn/Supply/Temple prices and Guild rates apply directly.

## Verification

**420 unique checks passed; 0 failed.** Eight map/mobile/offline/text-rendering cases were additionally repeated after the final mobile-centering adjustment; these repeats are excluded from the unique count.

| Suite | Passed | Failed |
| --- | ---: | ---: |
| World UI, migration and offline behavior | 29 | 0 |
| World schemas and map geometry | 20 | 0 |
| Retained recovery behavior | 48 | 0 |
| Item/recovery rules | 16 | 0 |
| Custom catalogs | 43 | 0 |
| Retained gameplay | 225 | 0 |
| PWA platform and refresh | 37 | 0 |
| Offline paths and actually stopped server | 2 | 0 |

TypeScript checking, Vite production build, service-worker generation and whitespace validation passed. Browser suites assert no unhandled runtime errors and inspect saved IndexedDB state. Verification covers cancellation, Undo, reload, module filtering, city price changes/snapshots, old saves/caches, unaffordable/free services, XSS-safe labels, shared-border movement, offline persistence and 320px layout.

The retained gameplay/recovery/custom suites ran on the feature-complete V32 candidate. Final world schema/UI and PWA suites cover the required-label correction, literal map text, stricter IDs/amenity fields and zero-priced configurations. After centering the mobile viewport, eight targeted cases passed on the final production artifact. The manifest records this staged scope, component reports, source hashes and final production hashes; it does not represent every suite as a single final-build invocation.

Two first-run world checks needed test corrections: Playwright correctly refused to click an `aria-disabled` nonneighbor (the guard is now checked with a forced click), and Temple cancellation's assertion needed to compare from after menu selection rather than treat navigation state as a currency mutation. All final recorded checks pass. Existing test helpers now choose a real module and explicitly exit the starting city where a Wilderness fixture is required. Existing standalone legacy tests keep their original behavior.

- [Results and artifact manifest](validation/v32-results.json)
- [Final map rechecks](validation/v32-final-map-smoke.json)
- [Desktop map](validation/v32-map-desktop.png)
- [Mobile map](validation/v32-map-mobile.png)

Reproduce with `npm test`, or build then run `npm run test:v32` for the new world checks. Configure source data with the schemas in [public/data/README.md](../public/data/README.md). Preview serves the built `dist/data` directory.

## Publication integration

The user subsequently requested publication and a V31 backup. Remote V31 commit `608b102bee45bd9b3f3e408db4b5af3c951ff2fd` already existed on both remote branches. Its newer toolbox-only update was merged into V32 without changing toolbox contents. Both branches are prepared with identical toolbox tree `3bc087a218cecc8ce9a5fd541e22f87011908591`; `pwa_wip_backup` retains V31, while `pwa_wip` receives V32. The production build and all 20 world schema/geometry checks passed after integration. The earlier local-only/no-push statements describe the original audit-time status.
