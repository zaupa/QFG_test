# V21 implementation and audit

V21 implements the completed feature list on top of V20. It remains a single offline HTML file with embedded fonts. The unchanged V20 app and its matching tests/docs are archived in `backup/`; the older V19 backup is removed as requested. No PWA migration or sounds are included.

## Requirements and coverage

| Requirement | Result | Tests |
|---|---|---|
| Animate Coin on inventory transactions | Paid purchases count down; sales count up using the existing resource shake/bounce. Actual resources and inventory save together before animation. Free, unsold, zero-price and invalid transactions produce no effect. | 141–144; existing 32–38, 124–128 |
| Enemy Card schema | Canonical abbreviated fields, description, id equal to name, CV ≥1, WV ≥0, nonnegative rewards, keyword arrays, optional inventory-shaped Item. | 134–135, 145–146 |
| External enemy library | Five supplied definitions are validated and embedded from `data/enemies.json` by `npm run build`. No fixed entry count; offline gameplay performs no library fetch. | 133, 146–148, 150, 152 |
| Choose custom or library combat | Entry chooser opens before gameplay changes. Library uses one radio selection, details preview and explicit Start. Back/Cancel leave gameplay unchanged. | 132–135, 147, 149 |
| Raised enemy information box | Name, description, original CV, WV, Fate, Coin, italic keywords and reward-item details remain visible through active combat phases. | 134–136; existing reward-replacement tests |
| Zero-wound enemies | Failure applies no wound or wound animation; retry/flee and existing death checks remain in effect. | 135, 137, 151 |
| Inventory/reward keyword arrays | Arrays display in italics joined with ` - `. Text entry uses that separator; the combined 300-character inventory budget remains. | 138–140, 145, 150, 153 |
| Save compatibility | Legacy keyword strings and long-form enemy reward data migrate; old saves/imports remain supported. New exports use envelope version 13. | 03, 06, 37, 89, 93, 139, 145, 152–153 |

## Data and offline build

`scripts/enemy-library.cjs` holds pure validation/migration helpers. The build embeds the same helpers and validated JSON into the app, keeping source and runtime rules aligned. Invalid libraries fail before output is written; successful writes use a temporary file and rename. Library JSON escapes HTML-sensitive characters so descriptions cannot terminate the data script. Display text is escaped separately.

All nine enemy fields are required; unknown enemy fields, duplicate IDs, invalid keyword arrays, invalid item text budgets and invalid numeric values are rejected. Numeric values must be safe integers; CV reserves room for the +6 modifier. Tests cover invalid data, script injection, deterministic builds and 1,000 enemy entries. The template remains a separate authoring aid.

The standalone HTML contains a snapshot of the library. Edit the external JSON and run `npm run build` to update future combats. This preserves direct-file/offline distribution without browser fetch/CORS requirements. Saved active combats carry their own copied Enemy Card, so rebuilding does not silently alter an ongoing encounter. Item rewards clone their keyword array before entering inventory.

## Migration and state safety

The existing local-storage key is retained. Older text keywords split on a spaced hyphen delimiter, preserving phrases and internal hyphens such as `two-handed`. Empty keyword lists become `[]`. Legacy keyword-only inventory entries remain intact. Existing old combats migrate their long-form reward fields to canonical cards; combats predating rewards receive no retroactive rewards.

Enemy selection and preview are transient UI state. Starting combat saves the validated enemy, challenge/wound values and original rollback snapshot together. Cancellation and Undo retain their previous behavior. The displayed CV is the original card CV; the existing combat controls show the current reduced retry difficulty.

Coin effects remain transient presentation state. Both increases and decreases interpolate between committed endpoints without changing stored totals. Existing ownership, target-value, Undo, navigation, reload and reduced-motion safeguards apply. Reopening a saved reward decision neither repeats rewards nor replays the animation.

WV 0 bypasses wound allocation while preserving the preexisting failure-death predicate. It does not introduce a new exhaustion/death rule.

## Verification

The final V21 HTML passed **153 checks with zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. Its SHA-256 matches the validation record.

The browser suite targets the production V21 HTML with isolated synthetic saves. It retains the 131 prior checks (adapted for the new combat chooser and canonical fields) and adds 22 V21 checks. The validation record at `docs/validation/v21-results.json` records the exact delivered source hash and executed results.

Mobile Chromium checks cover 320px layout, single-selection controls, focus trapping and escaped text; screenshots were inspected. Build checks use temporary outputs and do not alter the source library. The full suite also exercises prior combat rewards, full-inventory replacement, rollback, card conservation, rounds, resource controls and animations.

Real iOS Safari, Windows, direct-file persistence and physical-device GPU performance remain unverified. Offline routed Chromium tests and mobile emulation do not replace device testing. The app keeps its existing shared state/DOM rendering architecture; broader storage/PWA changes remain deferred.
