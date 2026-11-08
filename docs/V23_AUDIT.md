# V23 implementation and audit

V23 implements the completed feature list on top of V22. It remains one offline HTML file, with fonts, validated enemy snapshot and rules embedded. The unchanged V22 app is archived in `backup/` with its matching data, build scripts, tests and docs. The older V21 backup is removed as requested.

## Requirements and coverage

| Requirement | Implementation | Coverage |
|---|---|---|
| Inventory typography | Bold item name; smaller regular-weight description. | 174; prior inventory checks |
| Heal layout/message | Healing value sits left of input, Use item immediately follows, and the consumed name is bold red after a colon. Responsive at 320px. | 171, 174 |
| Equipment section | Collapsible Weapons and Armors, one slot of each type; item details, positive modifier, red usage points, enabled switch. | 175–177, 189–190, 198 |
| Broken equipment | Zero checked points disables modifiers, shows red card and warning, and offers Fix. | 182, 186–189 |
| Combat weapon | Enabled/unbroken weapon adds to initial selection, current total, Fate previews, success/failure and exact matches. Failure spends one point; success spends none. | 178–182, 184–185, 196, 202 |
| Combat armor | Enabled/unbroken armor reduces wounds on failure, minimum zero. One point is spent only when reduction is positive. | 181–184, 199 |
| Repair | Valid nonnegative cost and sufficient Coin required. Cancel changes nothing; Fix pays once, restores all four points and enables. | 186–188, 197, 199 |
| Equipment flag/forms | Shared item editor and enemy reward editor expose equipment type/modifier only when flagged; both required. Condition survives editing. | 176, 193, 201 |
| Inventory swap | Equip swaps with the matching slot, or moves into an empty slot. Full Inventory is supported; condition/enabled state travels with each item. | 177, 190, 203 |
| Starting loadout | Optional weapon, armor, and eight starting inventory items through the same form, without purchase/point charges. Draft edits/removals/cancel/reset supported. | 191–192 |
| Enemy JSON/template | Version-3 schema supports null or equipment metadata; template demonstrates a weapon reward. No modifier is guessed for existing rewards. | 194–195, 200 |
| Save/Undo/offline safety | Old saves gain empty slots; exact matches resume using weapon totals. Gear, coins, cards and logs restore together. No runtime network fetch. | 185–188, 195–200, 204–205; prior offline/import checks |

## Data model and compatibility

Character state adds `equipment: {weapon: null, armor: null}`. Each non-null slot contains a complete normal item whose equipment type matches that slot. Equipped gear is separate from the eight inventory slots; it exists in exactly one place when moved or swapped.

An equipment item adds:

```json
"equipment": {
  "type": "weapon",
  "modifier": 2,
  "usage": [true, true, true, true],
  "enabled": true
}
```

Type must be weapon/armor. Modifier must be a positive safe integer with room reserved for the maximum 364 card points. Usage is exactly four booleans; omitted usage/enabled default to four checked points and true. All-false usage forces disabled state. Ordinary items may omit the field or use null; canonical normalization omits it for ordinary items.

Old saves/imports continue to use the existing storage key. They gain empty equipment slots; a name such as “A dagger” or keyword “weapon” does not silently assign a modifier. Prior item-name/keyword migrations remain. New character exports use envelope version 15. Canonical enemy and legacy long-form rewards both support normalization of the extended item schema.

The library wrapper advances to version 3. Supplied enemy stats/text remain unchanged; the Thief Item declares null equipment until actual equipment stats are authored. The second template entry demonstrates a weapon reward. `scripts/enemy-library-v23.cjs` provides shared validation and deep item-copy helpers, embedded by `scripts/build-v23.cjs`. Keyword and durability arrays are copied independently, so wearing or editing a rewarded item cannot mutate library definitions or another item.

## Combat decisions and transactions

- Weapon bonus is added to Action Hand card points, not to difficulty. Challenge math remains unchanged. Exact-match recovery still returns up to two actual hand cards.
- Enabled armor is used automatically on failed combat when it can reduce wounds. Disable it beforehand to save usage. Wound reduction is `min(original WV, armor modifier)`.
- Failure computes armor reduction and spends applicable weapon/armor usage once, in the same saved resolution transaction. The final remaining point still provides its modifier before the item breaks.
- The encounter keeps original enemy WV and records `lastWound` for the resolved attempt. Wound allocation uses that reduced value and import validation checks consistency. Reloading allocation or retry screens does not repeat wear.
- Zero effective WV skips allocation/animation. Existing exhaustion/death checks remain; this does not invent a new death rule.
- Gear can change during choose/decision/adjustment and after a failed attempt; every change rerenders combat totals. Equipped controls/swapping/repairs are locked during exact-match recovery, wound allocation and pending rewards, preventing committed results from changing underneath those phases.
- Inventory rewards still require Keep/Discard. Equipment rewards enter Inventory; the user explicitly equips them later. Full-inventory replacement retains the whole item structure.
- Encounter cancellation restores its pre-action gear, coins and cards, including any repair payment made between retries. Undo of failure restores gear and hand together; wound-allocation snapshots retain the already-committed failure cost.

## Equipment, repair and creation UI

Four red checkboxes allow manual usage tracking; zero points disables equipment. Manually restoring a checkbox does not silently re-enable it—use Enabled. Fix always restores four checked points and enables the item. Editing names/modifiers does not repair broken gear or restore spent points.

Fix is offered only for broken gear. It validates the live Coin balance, character owner and an exact item snapshot. Cancel/Escape/navigation or a changed item invalidates the draft. Confirmation saves the deduction and repaired condition atomically and uses the existing Coin countdown animation; zero cost causes no resource animation. Repair has no sale proceeds.

Equipping swaps the exact inventory entry with the same-type slot, preserving names, descriptions, values, modifiers, usage and enabled status. Moving equipped gear back to Inventory is blocked at capacity; a full-inventory swap remains possible. Game Over prevents equipment edits.

Creation drafts are separate from saved character state. Optional starting items/equipment are cloned into the character on Start; card-point accounting and starting resources are unchanged. Cancelling a draft or beginning another character does not leak items between characters. Starting slots force their known type while still requiring a modifier.

All new text is escaped. Fix supports focus placement, Escape/backdrop cancellation and Tab trapping. Equipment panels/cards and item forms were inspected at 320px; checkbox labels have generous click areas. The new section starts collapsed and resets on character entry like Inventory.

## Verification and limits

The final V23 HTML passed **205 browser checks with zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. The delivered file matches the source hash in its validation record.

The suite retains the prior 173 checks with version/default equipment expectations and the colon update, and adds 32 V23 checks. It targets the production standalone HTML using isolated Chromium contexts, synthetic characters, UI interactions and temporary library builds. Validation records the exact delivered source hash in `docs/validation/v23-results.json`.

Coverage includes disabled/broken/last-point gear, safe numeric bounds, exact outcomes, live previews, actual wound allocation, retries, reload/import/export, full Inventory, rewards, repairs, Undo, cancellation, starting drafts, offline operation and mobile layout. Existing card conservation, resource animations, Round, inventory and storage recovery checks remain.

Real iOS Safari, Windows, physical-device performance and direct-file persistence remain unverified. The managed browser previously blocked file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR` before app code ran; offline routed Chromium checks are not a substitute for device/file testing.
