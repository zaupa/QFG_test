# V19 implementation and audit

V19 implements the agreed changes on top of V18. The standalone HTML distribution, embedded fonts, existing storage key and JSON character export format are retained. PWA, React, IndexedDB and service-worker migration remain deferred.

## Requirements and implementation

| Requirement | Implemented behavior | Main verification |
|---|---|---|
| Repeated Fate adjustments | Adding and removing share one sequence: 1, 2, 4, 8 Fate, doubling after each confirmed adjustment. The next cost appears in the controls and confirmation step. Back and previews do not charge Fate. | 14, 53, 79, 81, 95, 103 |
| Combat retry reset | Each retry resets adjustment usage to zero, making the next adjustment cost 1 Fate. Enemy metadata/rewards persist, and base difficulty still drops by 2 per retry. | 19, 82, 101 |
| Five-card initial hand | Initial selection is capped at five cards for both actions, including eligible Fatigue hands. Unselected cards disable at the limit; deselecting re-enables them. The commit operation independently enforces the cap. | 80, 96 |
| Paid additions beyond five | After revealing the modifier, paid additions can grow the hand beyond five; the expanded hand and next cost survive reload. | 80, 102 |
| Enemy setup prompt | Invoking Combat opens an in-app dialog with Enemy name `Enemy`, Challenge Value 5, Wound Value 1, Fate reward 1, Coin reward 0, and no item reward. Cancelling changes no gameplay data. | 83, 91, 99, 105 |
| Inventory-compatible item reward | Optional Description, Keywords and Base Value; Description required, combined text at most 300 characters, nonnegative whole-number Base Value default 1. | 84, 91, 92 |
| Victory rewards | Both ordinary and exact-match victory grant the configured resources and optional item. Exact-match recovery is completed before rewards. No rewards are granted for failed combat, fleeing or Game Over. | 84–86, 98 |
| Full Inventory | A prompt asks whether to keep current Inventory or choose an item to discard. The latter lists all eight items and requires an explicit selection and confirmation. Replacement grants no sale proceeds. Declining loses only the item reward. | 87–90, 97 |
| Resumable reward decision | Resource rewards and a `rewardsGranted` flag are saved together. The pending item choice survives reload and export/import without repeating resource grants. A free slot found on restoration is used directly. | 89, 100 |
| Undo and cancellation | Undo restores the appropriate gameplay/reward state. Cancellation before victory restores the entire pre-encounter state after repeated adjustments and retries. Seen inventory tips remain seen. | 17, 19, 63, 65, 77, 81, 90, 101 |
| Offline and mobile | Single-file app continues to work offline. Enemy/reward dialogs scroll within the viewport, escape text, and support keyboard focus containment. | 48, 57, 74, 97, 105, 106 |

The pre-existing 2-Fate cost to form an ongoing action hand from Fatigue remains separate from post-modifier adjustment costs. Challenge eligible-suit restrictions, normal Luck face values, exact-match recovery, wounds, rest, healing and card-pool rules remain in effect.

## State and compatibility audit

- `adjustmentsUsed` records completed post-modifier adjustments. `adjusted` is retained as a compatibility flag and must agree with the count. Missing counts in older encounters migrate from `adjusted`: false becomes 0, true becomes 1.
- A new combat stores the enemy's name, resource rewards and optional item in `combat.enemy`; difficulty and wound value remain in the existing `base` and `wound` fields.
- Older combat saves without an enemy definition migrate to zero rewards. Loading an already-started V18 encounter does not invent a new Fate reward.
- Victory with pending rewards uses the explicit `reward` stage. `rewardsGranted` separates resource collection from the item decision. `rewardChoosing` remembers whether the replacement list is open; no item is discarded until selection is confirmed.
- The new fields and item structures are validated when importing or loading characters. Encounter values are validated as safe integers, text is escaped for rendering, and malformed reward state is rejected without overwriting an existing save.
- New fields are ordinary character data, so existing autosave, JSON import/export and state snapshots include them. The browser storage key remains `quest-for-glory-v12-slots` and character exports retain their existing envelope.
- V18 is available in Git history. Compatibility was exercised with synthetic old saves, including a V18 combat lacking new fields. Real historical exports beyond the supplied application were not provided.

## Audit findings addressed during development

1. **Unsafe reward totals:** victory first checks both resource totals. If a reward would overflow, neither resource reward is partially granted. The won encounter stays pending so the player can adjust resource totals and collect safely.
2. **Exponential cost overflow:** counts are validated and capped at the supported numeric range. Beyond representable payment, adjustment controls are disabled; no Infinity or NaN is persisted.
3. **Difficulty boundaries:** new difficulty values leave room for the six-point modifier. Unsafe initial/imported choose states and unsafe retries are rejected before creating an invalid save.
4. **Stale confirmation state:** lowering Fate while selecting an adjustment disables confirmation and cannot move a card or create a negative resource balance.
5. **Restored free inventory slot:** resuming a reward with room available adds the item without granting the already-collected resource rewards again.
6. **Dialog keyboard access:** the new dialogs contain Tab focus. Escape cancels enemy setup; in replacement selection it returns to the question without silently discarding the reward.
7. **Mobile button spacing:** visual review caught the old `#startCombat` top margin after moving that button into a dialog. The margin was removed and mobile alignment was rechecked.

The first exploratory new-feature run also exposed a test-driver mistake: it tried to add a card already in the Combat Action Hand. The test was corrected to select an available deck card. This was not counted as an app defect.

## Executed verification

The full suite completed **106 passing checks and zero failures** with Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. It includes the 78 V18 regression cases (with expected rule/version assertions updated) and 28 V19 cases. Tests operate through the browser UI and isolated synthetic localStorage/JSON fixtures; production code is not instrumented.

`docs/validation/v19-results.json` records that run, its exact HTML hash and its JavaScript hash. Afterward, the mobile visual review corrected one CSS-only button margin. Three focused checks—enemy defaults, mobile enemy/reward flow including alignment, and keyboard focus—were rerun on the final HTML. `docs/validation/v19-presentation-results.json` records this final-source verification. The JavaScript hash is unchanged between the full run and the final presentation correction.

Additional layout checks verify the retained menu-button alignment, name ellipses and centered title at mobile and desktop widths. Embedded font data is byte-for-byte unchanged from V18. The explicit offline V19 test exercises enemy setup, a paid adjustment and victory rewards with browser networking disabled, and confirms Righteous is loaded without external requests.

## Practical limits and remaining architecture concerns

No unresolved functional failures remain in the executed V19 suite. This is not exhaustive proof of every possible gameplay sequence. Real iOS Safari, Windows and direct-file browser storage remain unverified; managed Chromium blocks file navigation and WebKit downloads were previously blocked. Physical keyboard/screen-reader coverage of older dialogs, storage-eviction behavior and large-history performance were not audited comprehensively here.

The app still uses one closure with shared mutable state and DOM rendering. V19 introduces shared adjustment helpers and explicit reward stages without undertaking a broad framework/storage rewrite. This keeps the current distribution intact; further separation of rules, rendering and persistence remains useful before a later PWA migration.
