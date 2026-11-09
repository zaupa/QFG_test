# V30 custom definition audit

V30 adds reusable per-character enemy/item definitions and an external shared item catalog to the React/TypeScript PWA. The existing offline and Windows path repairs remain in place. This release is prepared for publication to `pwa_wip`.

## Implemented requirements

| Requirement | Behavior |
| --- | --- |
| Event Keywords spacing | Adds 14px above Add Event Keyword below the expanded tab header. |
| Custom enemies | A valid confirmed Define Enemy form stores the complete canonical enemy card with Custom origin. Form cancellation/validation failures save nothing. Saved enemies appear in the regular chooser and can be used again. |
| Custom managers | Options contains Manage Custom Keywords, Manage Custom Enemies and Manage Custom Items. Enemy/item editors support add/edit/remove plus dedicated JSON export/import. Draft edits are isolated until Save changes; Cancel discards them. |
| Item reuse | Confirmed item definitions are recorded separately from inventory instances, including starting items/equipment and user-defined enemy rewards. Inventory name typing shows ranked matches (exact, prefix, substring, nearby spelling); selecting a match fills fields for review. |
| Unique definitions | Names compare case-insensitively after whitespace and Unicode compatibility normalization. Shared JSON, forms, renaming and imports reject duplicates. Multiple copies in inventory are allowed; reusing an identical existing configuration does not create another definition. |
| Shared items | items.json and items.template.json use the existing item schema. The initial entries copy the existing dagger reward and dungeon treasure without new invented stats. Loading the library does not add possessions. |
| Dungeon details | Encounter-table enemy names open a read-only full-stat box using the active delve snapshot. Viewing does not start combat, reroll or mutate state. |

## State and data contracts

Character exports use envelope version 21. `customEnemies` and `customItems` contain `{origin:"custom", definition:...}` records; older characters receive empty defaults. Inventory/equipment and active combats remain independent snapshots. Confirmed custom definitions, like keyword preferences, survive ordinary gameplay Undo and combat cancellation; managers do not retroactively rewrite owned items or active fights.

Item templates describe newly acquired equipment with four usage points; existing item wear is retained on physical instances. Editing an owned custom item under its existing name updates its reusable custom configuration while leaving other instances unchanged. A differently configured same-name new item is rejected before purchase/payment. Existing shared definitions must be reused or given a new unique name when creating a definition. Editing an already-owned game item remains allowed without overwriting its shared template or learning a conflicting named custom template.

The runtime bundle fetches and atomically validates enemies, keywords, dungeons and items. Failed or conflicting JSON leaves the previous complete offline set intact. Older cached bundles without items remain readable offline with an empty game-item catalog until a successful online refresh. Custom records never rewrite shared JSON. If a later shared update introduces an existing custom name, the character keeps one selectable Custom definition; current dungeon references still use their own saved game definitions.

Imports validate the full dedicated file before changing a manager draft. Conflicting same-name entries reject the import rather than partially applying it. Identical existing imported entries can be skipped. Explicit Custom origin is required. Conflicting same-name item rewards across enemy drafts cannot partially update character catalogs.

## Verification

The dedicated custom-library suite checks form confirmation/cancellation, full enemy stats, uniqueness, manager Save/Cancel, current-combat/owned-item isolation, item matching/reuse/payment guards, game item JSON refresh, malformed/duplicate imports, provenance, per-character isolation, old saves/offline bundles, dungeon viewing, and mobile layout. Platform tests continue to cover IndexedDB, workers, Windows asset paths, offline loading, foreground updates, save conflicts/recovery and update activation.

The existing gameplay suite retains card/resource/combat assertions. Its complete-character comparisons omit the two new custom catalog preference arrays because those are intentionally persistent through Undo/Cancel; the dedicated suite asserts them directly. Repeated baseline fights use distinct default enemy definition names so they exercise game rules without violating the new uniqueness rule.

Executed results and build-file hashes are retained under `docs/validation/`. Physical Windows/iOS installed-app testing is not claimed; browser tests use managed Chromium, including mobile emulation and simulated Windows paths. V28 remains in legacy/ and V27 in backup/.

## Final result

**328 checks passed, 0 unresolved failures**, aggregated from 43 custom-library checks, 34 PWA/platform checks, 249 existing gameplay cases with final affected reruns, one Windows path regression and one stopped-server/offline reload check. This is an aggregate result; the raw broad run retains its earlier failures. The owned-game-item editing defect was fixed, the changed-rule fixtures were corrected, and the short animation test now observes its lifecycle rather than sampling it after a potentially delayed browser round-trip.

Detailed reports and final deployable-file hashes are in `docs/validation/v30-results.json`. A reviewed mobile manager screenshot is included. Type-checking, production build and whitespace checks pass. This release is prepared for `pwa_wip`.
