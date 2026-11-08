# V22 implementation and audit

V22 implements the completed feature list on top of V21. The app remains one offline HTML file. The unchanged V21 app is archived in `backup/` with its matching data, build scripts, tests and docs. The older V20 backup is removed as requested.

## Requirements and coverage

| Requirement | Implementation | Coverage |
|---|---|---|
| Expanded enemy labels | Full enemy cards spell out Challenge Value and Wound Value. Compact selector rows retain CV/WV. | 154; previous 133–136 |
| Always ask about item rewards | Victory saves Fate/Coin once and waits for Keep/Discard. Keep adds the item if there is space; at capacity it opens the replacement list. Back/Escape do not silently discard rewards. | 155–157; previous victory/replacement/reload/export/overflow checks |
| Keyword separators | New text input rejects commas and splits on hyphens with optional surrounding whitespace. Spaces alone remain within a keyword. JSON arrays reject commas inside keyword strings. | 158, 168; prior array/text-budget checks |
| Rest confirmation | Rest/Cancel modal appears before recovery or no-Supply wounds. Cancel/Escape make no gameplay changes. | 159–160; prior Rest/Round checks |
| Default values | Heal and Rest start at 5, including recovery following a no-Supply wound. | 159–161 |
| Round hover | Same background and border color as hovered resource totals, also available on keyboard focus. | 169 |
| Wound labels | Action button is Wound; setup confirmation is Select Cards. | 169 |
| Remove adjustment explanation | Removed at all cost levels in both encounters. Add/Remove buttons retain the actual costs and enforcement. | 170; prior adjustment-cost checks |
| Optional Heal item | Use item sits right of Healing value; one inventory item may be selected. Selection is transient and shows the required consumption text. Actual item removal happens in the same transaction as healing. | 161–165, 171–172 |
| Required item name, optional description | Applied across inventory add/edit/remove/list, custom enemies, library/template, combat reward/replacement, Heal and imports/exports. | 166–168, 173; prior inventory and combat checks |

## Item schema and migration

Items now use `{name, description, keywords, baseValue}`. Name is required, nonempty, and at most 300 characters. Description may be omitted or empty; canonical saves use an empty string. The existing combined 300-character Description/Keywords budget remains; Name is a separate field. Keywords are arrays displayed in italics with ` - ` separators, and baseValue is a nonnegative safe integer.

Legacy items without a name use their old description as the name and retain that description. A legacy keyword-only item uses its joined keywords as a name. An explicitly blank name is rejected rather than silently dropping an item. Long-form old combat rewards and V21 canonical enemy items also migrate. Existing storage keys are unchanged. New character exports use version 14; older raw/enveloped imports remain supported. Normalized state is saved on the next save operation.

New input treats every `-` as a separator. Existing internal hyphens, phrases and comma text are preserved on legacy save migration; unrelated data is not rewritten to invent new keywords. New library definitions and new keyword input reject commas. JSON commas between array entries remain required syntax.

`data/enemies.json` and `data/enemies.template.json` use library version 2 and named Item rewards. Enemy names, descriptions, stats and keyword content are preserved. The Thief's existing reward gains name “A dagger”. `scripts/enemy-library-v22.cjs` supplies validation/migration rules to both the V22 runtime and `scripts/build-v22.cjs`. `npm run build` refreshes the embedded validated snapshot. V21's original helpers and standalone HTML remain unchanged.

## Transaction and dialog safety

- Victory resources and their granted flag commit before the item question. Reload, export/import, Back, Keep and Discard do not repeat Fate/Coin awards. Item acceptance/decline/replacement remains undoable.
- Heal selection holds the character identity, inventory index and an exact item snapshot. Duplicate names do not cause the wrong item to be consumed. Editing/removing the selected item invalidates selection rather than consuming another item at that index.
- Selecting an item changes no saved state. Healing requires a valid card selection and value before any item removal. Consumption has no sale proceeds or Coin changes. Undo restores healed cards, item and log together.
- Navigation/reload, cancelling Heal, and changing actions clear the transient selection. Heal without an item remains supported. An empty inventory has a recoverable picker message.
- Rest confirmation does not spend Supply, apply wounds, increment Round, clear a previous action's selection, or create an Undo snapshot. Confirming enters the existing Rest flow; only completed recovery advances Round.
- New dialogs support Escape, backdrop cancellation, focus placement and keyboard focus trapping. Long text is escaped; new names use the same safe text rendering as descriptions.

## Verification and limits

The final V22 file passed **173 browser checks with zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. Its SHA-256 matches the validation record.

The browser suite targets the production HTML, with synthetic saves and isolated Chromium contexts. The previous 153 checks are retained with explicit Rest confirmation and Keep choices, item-name fixtures, and the revised label/separator expectations. Twenty new checks cover V22 behavior. Prior victory tests explicitly choose Keep when a free slot is available; new consent checks leave the prompt pending and assert no early item acquisition.

The validation record at `docs/validation/v22-results.json` records the executed source hash. Mobile screenshots cover the Heal input/button placement and picker. Existing offline, reduced-motion, card conservation, inventory limits, rollback, resource-animation and Round coverage remain in the regression suite.

A direct-file Chromium check was attempted but browser policy rejected `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR` before app code ran; the attempt is recorded in `docs/validation/v22-direct-file.json`. Direct-file persistence therefore remains unverified. Real iOS Safari, Windows and physical-device performance also remain unverified. Offline Chromium routing and mobile emulation are useful checks, not substitutes for device testing.
