# V27 implementation audit

The standalone app is `board_game_tracker_v27.html`. The `wip` branch now contains V27 and its supporting files; previous version files and backups were removed for publication. Earlier commits retain their history.

## Implemented requirements

| Area | Implementation |
| --- | --- |
| Creation and names | Start Game at bottom right with vertical space. New typed name fields capitalize each word without rewriting descriptions, keywords or imported names. |
| Keyword management | Options groups character rename, Edit Adventure Module and Manage Keywords. Selected edits update a temporary draft immediately; only Save persists. Enemy association targets follow temporary item-style suggestions. |
| Combat highlighting | Matched keywords and contributing equipment are bold red. Base enemy stats remain visible; existing equipment/keyword math is reused. |
| Event Keywords | Collapsed section, italic list, add/edit/remove; each entry preserves its creation adventure module. |
| History and upgrades | Activity capped at 30 on load and logging. Attribute Points opens Upgrade and briefly highlights available unused points; action locks and reduced motion remain respected. |
| Dungeon data | Validated JSON/template references canonical enemy cards; explicit boss flag. Active delves snapshot definitions. Formula values, roll coverage and cross-references are checked before building. |
| Dungeon flow | Level challenge, possible rolled combat, level completion, support actions and deeper levels reuse existing mechanics. Challenge failure allows retry. Combat Flee exits with the usual Fate cost. No terrain changes. |
| Rest | Existing Rest rules, once per level per attempt. Timing ignored. Boss level allows Fight or Exit; prepare before delving to it. |
| Rewards | Coins bank until exit/completion, with no repeat level/encounter Coins on revisits. Re-entry starts at level 1. Boss victory closes the dungeon and offers treasure, including replacement at full inventory. |
| Character Sheet | Existing panels move into a collapsed section below dungeon information; no duplicate controls or state. |

## Save and validation behavior

Character envelope version 19 adds Event Keywords, dungeon history and the active delve snapshot. Older characters receive empty defaults. Enemy library version 5 adds `boss`; existing character combat snapshots migrate with false when absent. Dungeon library version 1 includes formulas, a complete encounter table, boss reference, treasure and optional timing metadata. Existing storage keys remain unchanged.

Imports validate phases, level bounds, reward history, challenge CV, encounter rolls, boss completion and references. Active Challenge/Combat still use the existing card ownership, Fate and wound validation. Dungeon Coin overflow leaves payout pending, so no partial/duplicate payment occurs. Treasure decisions persist until Keep/Discard/replacement is resolved. Dead characters cannot collect pending rewards.

## Verification

See `docs/validation/v27-results.json` for executed browser results and source hashes. The browser suite targets the production HTML with isolated synthetic saves; it does not touch real character data. Focused checks cover new UI, dungeon retries/re-entry, payout timing, boss restrictions/rewards, full inventory, action locks, reloads, schema rejection and mobile layout. Existing regression checks cover combat, challenge, equipment wear, keyword math, Deadly Effort, Game Over, save migration, audio and offline operation.

Build validation, JavaScript syntax and whitespace checks are also run. Chromium mobile emulation and screenshots check layout; physical iOS/Safari behavior remains unverified. The managed browser rejected direct `file://` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; offline behavior is tested by serving the unchanged HTML through Playwright routing with networking disabled, rather than claiming a verified double-click launch. Browsers may restrict sound or local-file storage; JSON export/import remains the portable backup mechanism.

## Result

**313 checks passed, 0 unresolved failures**, aggregated from the 275-case regression run, 38 V27 checks, and focused reruns. Raw runs retain earlier failures and source hashes in `docs/validation/`. Six old name assertions were updated for the requested capitalization; the payout-message visibility defect was fixed and retested. The invalid zero-points fixture was corrected. Direct-file navigation was blocked by managed browser policy; its replacement offline test passes without network access. This is an aggregate result, not a claim that every case was rerun together against the final hash.

Final standalone HTML SHA-256: `f083c6a33661265ce4a1d9b7f64644fa3aaa15934052191a5665122ca13dbcad`.
