# V28 implementation audit

The production file is `board_game_tracker_v28.html`. V27 and its matching support files are archived in `backup/`. V28 is prepared for publication to `wip`; the PWA conversion remains deferred.

## Requirements and behavior

| Requirement | Implemented behavior |
| --- | --- |
| Upgrade point flash | Opening Upgrade from its action button or Attribute Points flashes the Available points box for 0.5 seconds only when unused points exist. Reduced-motion styling remains supported. |
| Repeated action selection | Selecting an already open, unstarted action closes it. Selected cards, a chosen healing item, resolved Rest wounds, or a persistent Challenge/Combat/Wound task prevent action-button closing or switching. Explicit existing Cancel/Flee flows remain available under their normal rules. |
| Dungeon progress | Read-only numbered boxes show cleared/current levels and a final Boss label. Five levels fit a narrow phone; very large dungeons use a bounded window with ellipses rather than allocating every level. |
| Challenge emphasis | Attempt and Retry Level Challenge are red until victory. |
| Coin wording and timing | Exact requested guidance: “Each level grants Coins once per level. Treasure requires boss victory.” Existing reward history still prevents repeat payouts across attempts. Pending Coins increase only after winning both the level challenge and any monster encounter, or immediately after the challenge if no monster appears. |
| Encounter rules | Each dungeon supplies `monsterChance.base`, `thresholdPerLevel`, and `die`. Threshold = min(die, base + thresholdPerLevel × current level). The UI shows formula, threshold, table and actual roll results. No arbitrary expressions are executed. |
| Support actions | Pending encounters block Heal and Rest before combat and through retries. Upgrade is removed from the dungeon controls, and Attribute Points cannot open it anywhere during a delve. Rest remains once per cleared level under existing rules. |
| Dungeon selection | Main button: Dungeon Delve. Confirmation: Start Delve. Completed entries remain gray, disabled and labeled Dungeon Completed. Unfinished entries show deepest visited level. Re-entry still starts at one. |
| Boss completion | Victory persists a congratulations screen listing pending delve Coins and dungeon treasure, with only Exit Dungeon. Escape cannot bypass it. Exit pays Coins once, then uses the existing treasure Keep/Discard/full-inventory replacement flow. No treasure uses the same completion screen, then exits directly. |

## Save/data compatibility

Character exports use version 20. Dungeon library version 1 remains backward compatible: absent chance base means zero. Both JSON data and template explicitly include base zero for the existing Tomb, preserving its encounter probability. Nonnegative safe-integer parameters and supported arithmetic ranges are validated by the build and save loader.

Dungeon history now records `highestLevelReached`. Older history derives the best known depth from rewarded levels and any active delve; an older exited attempt that never recorded its visited depth cannot be reconstructed beyond that evidence. Active V27 definitions are normalized with a zero chance base, preserving saved encounter rules. Existing pending treasure/payout states remain supported.

The new boss `victory` phase records completion and pending Coins before showing congratulations. Reload resumes that phase without replaying payout, treasure, equipment wear, or victory sound. Coin overflow after Exit leaves the existing pending-payout recovery available. Completed selection also has a handler guard, independent of the disabled radio.

## Verification and limits

The browser suite targets the unchanged production HTML with isolated synthetic saves. Results and source hashes are retained in `docs/validation/v28-results.json`. New checks cover action toggling/locks, Upgrade flashes, progress, red challenge buttons, formulas driving real rolls, encounter support locks, payout timing, deepest-level history, completion labels, boss rewards/reload, no-treasure bosses, invalid data, mobile layout and offline behavior. Existing checks cover card conservation, Fate, retries, Deadly Effort, Game Over, equipment wear, inventory transactions, migration, audio and storage failures.

Build/schema/template validation, deterministic rebuilding, JavaScript syntax and whitespace checks are run separately. Tests navigate when DOM initialization completes; gameplay does not depend on waiting for media preload to finish. Chromium mobile emulation is checked visually; physical Safari remains unverified. Direct `file://` navigation is blocked by the managed browser policy observed during V27. Offline tests serve the complete standalone HTML through routing with networking disabled; no verified direct-file launch is claimed here.

The broad regression found an existing enemy-keyword redraw timing defect: clicking a group summary immediately after a chip focused the keyword field could leave the replacement group closed. V28 defers that redraw until the summary’s native toggle completes. The affected picker/combat checks are rerun, including repeated transitions between association groups.

## Final result

**338 checks passed, 0 unresolved failures**, using the latest outcomes from the full regression, focused V28 checks, final affected-check reruns, and three repeated enemy-group transitions. The raw broad run retains the keyword timing failure and pre-save migration-fixture failure; both have passing reruns. Results are aggregated rather than represented as one clean full run against the final hash.

Final HTML SHA-256: `4e872e91351479f55321f6b824bbbfa51c043b019e6bcd14cf0b2fa57343cade`.

A reviewed 320px screenshot is stored at `docs/validation/v28-dungeon-mobile.png`. V27 is archived in `backup/`; V28 is the current release prepared for `wip`.
