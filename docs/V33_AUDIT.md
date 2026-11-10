# V33 audit — Adventure Actions and local movement

V33 implements the collected notes and the confirmed movement order. The user clarified that characters will be new; fresh creation and the new gameplay flow are the release focus. Changes remain local on `pwa_wip`, with no commit or push. Toolbox files are unchanged.

## Delivered behavior

- Map replaces Move to Another Terrain. Every tile is inspectable; only adjacent destinations can be attempted. Cities and dungeons are map-owned locations with Settlement/Stairs SVGs, and both symbols appear when both types occupy a tile. Entry is permitted only on the current Wilderness tile.
- Adventure Modules reference their map rather than city/dungeon availability lists. Authored map/adventure/terrain schemas are version 2. Maps support 2–6 surrounding rings excluding the center; geometry, exact shared-border adjacency and location/enemy references are validated.
- Two Adventure Actions start each Round. Confirmed movement and location entry spend one. A failed/abandoned movement does not refund it. Browsing, exiting locations and supporting/manual actions do not spend one. Existing activities within an entered city/dungeon continue under their established rules.
- Movement spends the action, uses the origin terrain's existing Challenge procedure, then rolls the origin's Danger Level/enemy table after success. Any encounter must be won before arrival; fleeing stays at the origin. CV defaults to 5; Danger Level defaults to 2. Enemy selection is uniform among listed IDs. Every successful movement Challenge checks independently.
- Existing modifiers, Fate adjustments, exact recovery, equipment, Wounds, rewards and Deadly Effort are reused. If a forced encounter cannot start for lack of a usable hand, an explicit abandon option prevents a dead end without refunding the action.
- Pending stages/rolls/enemy selection save atomically. Reload does not charge again or reroll. Rest offers wait until the operation and rewards finish and location Rest rules permit it. Declining preserves zero actions; completed Rest advances Round and refills two. Cancelled/fatal Rest does not refill. The established dungeon Rest limit still applies.
- Hero, Ranger and Spellcaster meeples are selectable during creation and purely cosmetic. Character and location SVGs are external, precached assets. New character export envelope is version 24; IndexedDB database version stays unchanged.

## Verification

**477 unique checks passed; 0 final failures.** Counts aggregate final results per case, rather than counting reruns twice.

| Suite | Passed | Failed |
| --- | ---: | ---: |
| V33 adventure gameplay and save validation | 41 | 0 |
| V33 world rules/geometry | 25 | 0 |
| Retained gameplay | 225 | 0 |
| Recovery regressions | 48 | 0 |
| Item/recovery rules | 16 | 0 |
| Custom catalogs | 43 | 0 |
| Retained world browser cases | 22 | 0 |
| Retained world rules | 18 | 0 |
| PWA platform | 37 | 0 |
| Offline paths and actually stopped server | 2 | 0 |

TypeScript, Vite, service-worker generation (17 external shell assets) and whitespace checks passed. Browser suites check saved IndexedDB values and unhandled runtime errors. New checks exercise fresh meeple creation, local access, 2/6-ring maps, confirmed action costs, failed/exact/abandoned movement, origin-specific CV/Danger/enemies, encounter victory/fleeing/reload, zero-action activity permissions, deferred Rest, complete-round flow, Deadly Effort, malformed save rejection, offline SVGs and 320px layout.

The full gameplay candidate had 221 passes and four missing-return-position scenarios. The missing position is now inferred when a map location uniquely identifies it; the four targeted reruns pass. This compatibility handling was already underway before the user's fresh-character clarification; no additional migration feature work is required for release. The custom suite had one old non-local dungeon fixture, corrected to its real tile. A retained mobile check exposed an inaccessible Cancel button; world and Rest-offer dialogs now scroll within the viewport, and that rerun passes. The first V33-only run also had an expectation that ignored deprecated lists should report a library change; the test now changes a supported name alongside those lists, with locations still map-authoritative.

Raw candidate/rerun reports are retained with deduplicated aggregates. The final 41-case V33 suite, world schemas and targeted mobile checks ran after the dialog correction. Older broad candidates precede the final scrolling/inference adjustments; the manifest describes this staged scope and records source and final production SHA256 values. Seven obsolete V32 instant-movement/module-list/disabled-Map expectations and two module-list schema expectations are superseded by V33 cases; original definitions remain in their test files. Existing regression fixtures now use valid physical dungeon tiles. No test bypasses gameplay action costs in the new end-to-end scenarios.

- [Results and artifact manifest](validation/v33-results.json)
- [Mobile Map](validation/v33-map-mobile.png)
- [Six-ring Map](validation/v33-six-rings.png)

Build and run `npm test` for all current suites, or `npm run test:v33` for the new rule/browser checks against an existing production build. Configure data with [public/data/README.md](../public/data/README.md).
