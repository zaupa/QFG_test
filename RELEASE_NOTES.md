# V24

V23 is archived in `backup/` with its matching development files; the older V22 backup is removed.

- All item/equipment/enemy keyword fields reject commas, use `-` as the separator, and retain spaces within a keyword. Legacy comma-delimited lists normalize into arrays.
- Shared item forms offer grouped, optional keyword chips from `data/keywords.json`, filtered for weapons, armor or generic items. Custom text remains allowed; duplicate/oversized chip additions do not alter existing content. All supplied terms are included without dice metadata.
- Standard enemy associations match active equipped keywords: Unprotected −6 CV, Resistant +6 CV, Weak −2 WV, Strong +2 WV. Whole-keyword matches ignore case. Distinct effects stack; duplicates apply once. Combat shows matched adjustments, respects CV/WV floors, retries and armor reduction, and retains original enemy stats.
- Equipment activates automatically when usage remains. Usage appears as read-only red available/gray spent squares without checkmarks or enable controls. Edit is small at the card's top right; Fix sits beside Move to inventory.
- All ordinary inventory/equipment additions, edits, removals, swaps and repairs are locked throughout combat. Dedicated victory-item Keep/Discard/replacement remains available.
- Occupied Wounds tiles turn red and Fatigue tiles muted blue; empty zones retain normal colors. The Resources adjustment hint is removed.
- Heal's Use item picker shows only items with exact `heal` keyword, ignoring case, and consumes the correct inventory entry after confirmation.
- Character exports use envelope version 16; enemy library version 4 removes manual activation metadata. Old flags are discarded and remaining usage determines availability. The standalone app embeds both validated data catalogs.

# V23

V22 is archived in `backup/` with its matching development files; the older V21 backup is removed.

- Inventory item names are bold; descriptions are smaller and regular weight. Heal's label sits left of its value box, Use item sits closer, and consumption reads “Heal will consume item:” with the item name in bold red.
- Weapons and Armors is a collapsible section with one equipped slot per type. Gear adds a positive modifier, four red usage checkboxes and an enable switch. Zero usage produces a red broken warning and prevents modifiers.
- Enabled weapons add to combat Action Hand totals, live Fate previews and exact-match resolution. A failed attempt spends one weapon point. Enabled armor reduces failed-combat wounds, floored at zero, and spends one point only when it reduces wounds. Challenges/manual wounds are unaffected.
- Broken equipment offers Fix with custom nonnegative Coin cost and Cancel/Fix. Valid confirmation pays once, restores all four points, and enables the item. Repair, wear, equipping and swaps are saved and undoable.
- Shared item forms allow equipment classification and require type/modifier when checked. Inventory Equip swaps with the matching slot, preserving condition; empty slots move the item out of Inventory. Full-inventory swaps do not discard an item.
- Character Creation optionally adds a starting weapon, armor and up to eight inventory items through the shared item form. Starting equipment has four points; starting items have no purchase cost.
- Existing saves gain empty equipment slots without guessing from names/keywords. Exports use envelope version 15. Enemy data/template/README use library version 3 and support equipment rewards; existing enemy stats remain unchanged.

# V22

V21 is archived in `backup/` with its matching development files; the older V20 backup has been removed.

- Expanded enemy details spell out Challenge Value and Wound Value. Compact library rows retain CV/WV.
- Combat always asks Keep item / Discard item for an item reward, including when inventory has space. Keep at capacity opens the existing single-item replacement list. Fate/Coin rewards remain saved once while the item decision is pending.
- All items now have a required `name` and optional `description`: inventory, enemy setup/library, combat rewards, replacement and Heal item selection. Old descriptions migrate into names without losing the original text, keywords or value. New exports use envelope version 14; the library schema uses version 2.
- New keyword input rejects commas and splits on `-`. Spaces remain within a keyword. Legacy spelling is preserved on migration.
- Rest asks “Rest will move to the next Round.” with Rest/Cancel before the existing process. Heal and Rest start with value 5. Round advances on completed Rest as before.
- Heal offers Use item to the right of Healing value. Selecting one item shows “Heal will consume item [name]”; confirmation consumes it with healing. Cancellation and invalid healing do not consume it; Undo restores it.
- Round hover matches resource totals. Wound / Select Cards replace the requested button labels. The adjustment explanation is removed from Combat/Challenge while costs remain on their buttons.

# V21

- Combat starts with a choice between custom enemy creation and the enemy library. A raised information box shows the enemy name, description, original CV, WV, Fate/Coin rewards, italic keywords and item reward throughout combat.
- Enemy cards use `id`, `name`, `description`, `CV`, `WV`, `F`, `C`, `KW` and `Item`. WV may be zero; a failed zero-wound combat skips wound allocation and offers retry/flee under the existing rules.
- Library data is validated and embedded by `npm run build`, preserving standalone offline play. Active combats keep an independent enemy snapshot.
- Inventory and reward-item keywords are arrays displayed in italics with ` - ` separators. Older text keywords migrate on load; internal hyphens and phrases are preserved.
- Purchases and sales animate the Coin resource box and count toward the saved total. Free, zero-price and rejected transactions do not animate. Undo, navigation and reduced-motion handling remain supported.
- Character exports use envelope version 13. Existing storage keys and older imports remain supported. V20 is archived in `backup/`; the older V19 backup is removed.

# Quest For Glory — Version 20

- Challenge and Combat setup, retry effective bases and modifier-adjusted totals never fall below **1**.
- Removed the initial hand-selection sentence about paid Fate additions; the five-card initial limit and paid exceptions remain unchanged.
- Added a per-character **Round** display between the character banner and Resources. It starts at **0**, advances on completed Rest, and opens a manual Add/Remove dialog when tapped.
- Resources, Card Zones and Actions are collapsible and start expanded. Existing lower-section defaults remain collapsed. The title, character banner and Round stay visible.
- Resource totals are larger and centered between **−** and **+** controls. Tapping a total opens an Add/Remove amount dialog with a preview; invalid or negative resulting totals cannot be confirmed.
- Combat reward totals count up and bounce while changed Coin/Fate boxes shake for about **0.8 seconds**. Supply remains still. Rewards are saved before this visual feedback.
- Applied wounds trigger a **0.5-second** screen shake and red overlay, including manual, Combat and no-Supply Rest wounds.
- Reduced motion disables reward movement/count-up and replaces wound shaking with a quiet temporary tint. Effects stop safely on Undo, cancellation and character changes.
- Combat retry headings now say **Attempt**, distinct from the character's Round.

Open `board_game_tracker_v20.html`. Old saves default to Round 0. V19 is archived under `backup/`, including its tests, documentation and validation records. For different browser origins or differently named files, transfer characters with JSON Export/Import.

The app remains one offline HTML file with embedded fonts. PWA migration is deferred, and no sound assets have been added. See `docs/V20_AUDIT.md` and `docs/validation/v20-results.json` for verification and practical limits.
