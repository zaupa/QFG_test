# V24 implementation and audit

V24 implements the completed feature list on top of V23. It remains one offline HTML file with fonts, enemy definitions, keyword suggestions and validation rules embedded. The unchanged V23 app is archived in `backup/` with its matching data, build scripts, tests and docs. The older V22 backup is removed as requested.

## Requirements and coverage

| Requirement | Implementation | Coverage |
|---|---|---|
| Keyword rules everywhere | Commas rejected in all shared/new item, equipment, enemy and reward fields. Hyphens split; spaces remain within a keyword. Legacy lists normalize. | 158, 206–207; prior validation/migration checks |
| Usage display | Four read-only squares, red available/gray spent; no checkbox/checkmark or enable control. | 175, 182, 189, 208 |
| Automatic activation | Remaining usage determines both modifiers and keyword eligibility. Legacy enabled flags are discarded. | 184, 186–187, 199, 202, 207 |
| Combat lock | Ordinary inventory/equipment additions, edits, removals, equipping, swapping, moving and repairs blocked in every combat phase, including stale editor handlers. | 139, 185, 197, 202, 209–211 |
| Reward exception | Victory Keep/Discard and full-inventory item replacement remain available. | 210; prior reward/overflow checks |
| Equipment button layout | Small Edit at top right; Fix beside Move to inventory when broken. | 208, 229 |
| Enemy associations | Whole-keyword, case-insensitive standard associations change CV/WV and are shown explicitly. Distinct effects stack; duplicate associations count once. | 212–219, 228 |
| Keyword tips/data | 36 categorized suggestions with weapon/armor/generic uses; no dice columns; custom entry remains free. Chips append with separators, highlight and deduplicate. | 223–226, 229–230 |
| Zone colors | Nonempty Wounds red, Fatigue muted blue; color follows Heal/Rest/Undo and is retained on hover. | 227 |
| Resource hint | “Tap a total to adjust an amount.” removed. | 227 |
| Heal filter | Only exact heal keyword ignoring case; real inventory index preserved through filtering; stale selection invalidated. | 162–165, 171–172, 174, 220–222 |
| Offline/build/save | Both JSON snapshots embedded; build validates before replacement; unavailable suggestions allow custom input. | 146–148, 194, 226, 228, 230; prior offline/import checks |

## Keyword associations and combat order

Enemy `KW` entries support `Unprotected against [keyword]`, `Resistant against [keyword]`, `Weak against [keyword]`, and `Strong against [keyword]`. Older abbreviated forms such as `resistant slash` or `Unprotected fire` also work. Matching trims/collapses whitespace, ignores case and compares the complete keyword: `slash` does not match `slashing`; `Full Body` remains a phrase.

Only equipped gear with at least one usage point contributes matches. Weapon matches change CV by −6/+6; armor matches change WV by −2/+2. Each distinct kind/target association counts once; separate matches add, opposing matches offset. Enemy-specific prose remains visible and is handled manually.

Resolution order:

1. Add applicable keyword CV adjustments to original enemy CV, floor at 1.
2. Apply retry reduction (−2 each attempt), floor at 1; apply random modifier, floor at 1.
3. Compare that total with card Action Hand points plus the active weapon modifier, including live Fate previews and exact-match recovery.
4. On failure, apply keyword WV adjustments to original WV, floor at 0; then reduce by active armor's flat modifier, floor at 0.
5. Spend one active weapon point for failure. Spend one armor point when its flat modifier or net weakness effect actually prevents wounds. A weakness that already lowers WV to zero still spends one point if it prevented positive original wounds; original WV zero with no prevention costs none.

The last point still contributes before breakage. Later attempts recompute eligibility from remaining points. Original enemy CV/WV remain saved; the active card displays current base values, originals and matched changes. `lastWound` saves the resolved damage and `lastEquipment` records the two availability booleans before wear. Pending wounds and the failed-attempt screen use that availability for their displayed CV/WV and matched effects; retry recalculates from current gear and clears the snapshot. Breakage/reload therefore cannot change the resolved explanation, pending allocation or charge wear again. Validation allows bounded strong-effect increases, checks allocation consistency, and reserves numeric room for positive keyword and random adjustments.

The corrected example gives CV **16 + 6 = 22** and keyword-adjusted WV **4 + 2 = 6**, before the armor's own flat reduction. Equipment has no effect on Challenge difficulty or manual/Rest wounds. Existing death/exhaustion rules remain unchanged.

## Item availability, locking and presentation

Equipment metadata is `{type, modifier, usage}`. The canonical enabled flag is removed. All four usage booleans remain saved, but the UI displays noninteractive squares with an accessible availability label. No usage editing handlers remain. Broken gear retains its warning and Fix action; Fix restores four points, which implicitly activates it.

All ordinary inventory/equipment controls and mutation handlers are locked while a combat object exists, covering choose, decision, adjustment, exact recovery, wounds, retry/flee and pending rewards. Fix is locked too. A draft opened before combat cannot save afterward. Reward acceptance/replacement uses its dedicated transaction and remains available. Combat cancellation restores the pre-action snapshot; Undo continues to restore cards, gear, coins and logs together.

Occupied-zone colors are derived from card arrays, never saved separately. Empty boxes revert automatically and colors survive hover/focus. Equipment Edit/actions and tips were inspected at 320px.

## Suggestions and data

`data/keywords.json` contains format `quest-for-glory-keywords`, version 1, with 36 entries `{keyword, category, uses}`. Weapon/armor/generic use metadata follows the supplied lists, preserves `cristal` and protection phrases, and includes generic `heal`/`rest` effects. No dice metadata is stored.

The shared form filters chips by item type, including starting items, equipped-item edits and enemy reward entry. Clicking appends with ` - ` and avoids case-insensitive duplicates without replacing custom text. Type changes affect suggestions only. Additions beyond the existing 300-character Description/Keywords budget are refused without truncation. Missing/invalid embedded suggestions fall back to free text.

`scripts/build-v24.cjs` validates both catalogs and embeds safely escaped JSON plus the shared rules from `scripts/enemy-library-v24.cjs`. It accepts `--data`, `--keywords`, `--output`; invalid input fails before any output replacement. No runtime fetch is needed. Enemy data/template use library version 4; template activation flags are removed and examples show standard associations.

## Save compatibility and Heal safety

Storage keys remain unchanged. New exports use envelope version 16. Legacy enabled flags are discarded: equipment with remaining points becomes active automatically. Old comma-delimited/spaced-hyphen keyword lists normalize to arrays; internal hyphens from older saved keywords remain intact. New text input and authored keyword arrays reject commas inside entries. JSON punctuation between array entries remains valid.

Heal lists only inventory entries with exact `heal` after case normalization; `healing`, `heal potion`, `rest` and unrelated equipment are excluded. Filtering preserves original inventory indices, so duplicate names or hidden ineligible items do not change which entry is consumed. Eligibility/item snapshot is checked again before selection/confirmation; removing the keyword invalidates the draft. Selection/cancellation changes no saved inventory; confirmation/Undo retains the existing atomic healing transaction.

## Verification and limits

The final V24 HTML passed **230 browser checks with zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. Its SHA-256 matches the delivered file and validation record.

The suite retains 205 prior cases with expected changes for automatic activation, read-only indicators, full combat locks and heal-qualified fixtures. Twenty-five new V24 cases cover associations, all matching/floor rules, lock guards, suggestions/build validation, zone colors, healing indices and offline/mobile use. The production HTML is tested with synthetic saves and isolated Chromium contexts. The validation record at `docs/validation/v24-results.json` records its exact source hash.

Real iOS Safari, Windows, physical-device performance and direct-file persistence remain unverified. The managed browser previously blocked file navigation with `ERR_BLOCKED_BY_ADMINISTRATOR` before app code ran; offline routed Chromium checks do not replace device/file tests.
