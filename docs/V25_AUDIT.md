# V25 implementation and audit

V25 implements the completed feature list on top of V24. The app remains a standalone offline HTML file. The unchanged V24 app is archived in `backup/` with its matching data, build scripts, tests and docs. The older V23 backup is removed as requested.

## Requirements and coverage

| Requirement | Implementation | Coverage |
|---|---|---|
| Toggle suggested words | Selected chip removes case-insensitive matches; absent chip appends with hyphens; unrelated text remains. | 224, 231, 249 |
| Character Custom keywords | Confirmed new words saved with category custom, reused across types, deduplicated by case, retained after item removal. | 232–235, 247–249 |
| Enemy stat hierarchy | Original CV/WV stay in the main stat row; separate combat base shows keyword effects before retry/random changes. | 236, 249; previous matching/retry checks |
| Deadly Effort name/cost | Empty-deck Fatigue-hand option costs 2 Fate per selected card, displays total and tip beneath commitment. Selection respects Fate and initial cap. | 22, 52, 96, 237 |
| Direct wound destination | Committed Deadly cards go to Wounds, not Fatigue/recovery, independent of armor/keyword wound modifiers; normal combat penalty is separate. | 238–243, 248, 250 |
| Action messages | Dedicated live status inside Actions; result, validation, reward and cancellation messages routed there. Dialog errors also reflected. | 21, 99, 104, 116, 245–246 |
| Empty-deck buttons | Light-gray unavailable appearance; activation explains inside Actions and does not start/change gameplay. | 21, 245 |
| Game Over threshold | Failure exhaustion requires Fate exactly zero; all-cards-wounded condition remains, including Deadly Effort successes. | 25–27, 243–244 |
| Saved/offline safety | Tracking/custom preferences export/import, reload, Undo, isolated slots, guarded input and offline play. | 233–235, 241–242, 247–250; prior regressions |

## Custom keyword preferences

Character state adds `customKeywords: [{keyword, category: "custom"}]`, default empty for older saves. Entries are nonempty strings up to 300 characters without comma/hyphen delimiters. Import deduplicates case-insensitively and validates category/type before rendering. Shared UI escapes labels/data attributes and wraps long chip labels on mobile.

Confirmed item keywords not already offered by that type's global catalog are remembered; a known catalog word from another item type can also become a reusable Custom preference. Chips filter duplicate visible global entries, preserving their normal category. Item/equipment, starting-item and custom enemy reward entry share this behavior. Enemy association prose is not added to item suggestions.

No word is learned merely by typing or cancelling, nor after failed validation/payment. Preferences persist after later removal, Undo or encounter cancellation, like existing inventory-tip preferences. Creation drafts keep their own registry until Start; another character gets its own independent registry. The global data catalog is not modified. New exports use envelope version 17; storage keys and global JSON formats are unchanged.

## Deadly Effort rules and state

Deadly Effort remains the existing Fatigue-hand selection path inside an ongoing encounter when the Attribute Deck is empty, including combat retries. It does not allow an empty-deck character to start a new Combat/Challenge; those buttons explain the restriction as requested.

Each selected Fatigue card costs two Fate when committed. Selection is capped by `min(5, floor(Fate/2))`; ordinary Attribute Deck commitment and exponential post-modifier adjustments retain their own costs. The commitment button shows Deadly Effort and the selected total; a tip below explains eligibility, cost and direct wound destination.

The encounter records `deadlyCards` as a subset of the current hand. Import validates unique valid card IDs, hand membership and compatible phase. On resolution these cards move directly from Hand to Wounds before other hand destinations, regardless of success/failure, with no wound-value allocation or mitigation. Direct wounds use the existing presentation effect. A failed combat's normal adjusted WV still creates a separate allocation from remaining Fatigue/Deck cards.

On exact matches, Deadly cards are displayed as nonselectable and excluded from the recoverable list/count. Ordinary hand cards can still be recovered. Deadly cards settle when the exact-recovery confirmation finishes the action. If all owned cards become wounded, Game Over ends resolution before rewards/continuation, even on success.

A standard paid removal of a tracked card returns it to Fatigue and removes its tracking; the original two-Fate payment is not refunded. It cannot be laundered into Attribute Deck/recovery. Tracked cards that remain in the resolved hand always go to Wounds.

Costs/tracking/card moves commit with normal save/Undo snapshots. Reload cannot repeat payment; resolution/Undo conserves the full deck/pool partition. Cancellation uses the existing pre-encounter rollback when present. Older committed saves without tracking retain their existing hand behavior; origin/payment is not guessed from activity text and no retroactive charges are made.

## Game Over and action feedback

The unchanged first condition is all owned cards in Wounds, with no Deck, Fatigue or Hand cards, checked after wound application. Direct Deadly wounds also check this.

The second condition, checked after failed Combat/Challenge, is empty Attribute Deck, nonempty Fatigue, nonempty Wounds, and **Fate === 0**. One Fate does not satisfy it. Combat with zero effective WV still runs the failure check. Manual/Rest wounds continue checking the all-wounded condition. Existing stored Game Over flags are not silently revived.

Action handlers use `updateAction`/`notifyAction`, with a live status inside Actions that expands the section when feedback is generated. Dialog validation remains visible in its dialog and is also reflected in Actions. Import, storage, inventory and resource feedback retain their existing global locations. Action notices are transient and reset on character entry; persistent activity stays in the saved log.

Unavailable empty-deck action buttons are visually gray and remain activatable solely to explain the restriction. Native disabling would suppress the requested feedback, so the start guard prevents gameplay instead. Actual Game Over still disables action controls.

## Verification and limits

The final artifact has **250 passing browser checks**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. The full run initially had 249 passes and one outdated cancellation expectation: case 101 expected learned Custom preferences to disappear. That expectation was corrected to match the requested retention rule; focused reruns of 101 and expanded Deadly Effort cancellation case 241 both passed against the **same application hash**. The aggregate record links the unmodified full-run and focused-run records for provenance.

The suite retains the prior 230 checks with expected updates for per-card Fatigue costs, zero-Fate failure, toggle behavior, new preference defaults, and action-status placement. Twenty new cases cover V25 state transitions, recovery exclusions, metadata validation, per-character preferences, mobile layout and offline use. Tests target the production HTML through isolated Chromium contexts and synthetic saves; the exact source hash is recorded in `docs/validation/v25-results.json`.

Real iOS Safari, Windows, physical-device performance and direct-file persistence remain unverified. Previous managed-browser file navigation was blocked before app code ran. Offline routed Chromium coverage is not a substitute for device/file testing.
