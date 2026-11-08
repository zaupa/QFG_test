# V20 implementation and audit

V20 implements the agreed changes on top of V19. The app remains a single offline HTML file, with the same embedded fonts, character-slot storage key and JSON export envelope. No PWA migration or sound assets are included.

## Requirements and verification

| Requirement | Implemented behavior | Focused coverage |
|---|---|---|
| Minimum Challenge Value 1 | Setup requires at least 1. Combat retries clamp their effective base to 1. Applying the modifier also clamps the total to 1, including previews and exact-match resolution. | 107–109; existing modifier, Fate and combat tests |
| Remove initial explanatory sentence | The phrase “Paid Fate additions after the modifier may exceed 5.” is removed from both hand-selection screens. The five-card cap and paid exceptions remain enforced. | 80, 96, 110 |
| Combat reward animation | Changed Coin/Fate boxes shake gently and their central totals bounce/count up over 0.8 seconds. Supply and zero-reward resources remain still. Actual rewards are saved before animation. | 124–128 |
| Wound animation | Applying manual, Combat or no-Supply Rest wounds produces a 0.5-second screen shake and red overlay. Selecting or cancelling a wound does not trigger it. | 122–123, 127–128 |
| Round counter | Starts at 0, appears between the character banner and Resources, and advances once per completed Rest. It is saved/exported per character. | 111–116, 131 |
| Manual Round editing | Tapping Round opens an Add/Remove amount dialog with preview, validation, Cancel and keyboard support. Changes are logged and undoable. | 114–116, 120, 130 |
| Collapsible gameplay sections | Resources, Card Zones and Actions start expanded; Inventory, Dice Roller, Roll History and Recent Activity keep their closed defaults. Entry resets defaults; ordinary updates preserve the current open/closed state. | 119–121, existing card-zone/collapse tests |
| Always-visible character context | App title, character name, Adventure Module and Round remain outside collapsible bodies. Game Over also remains visible when Actions is collapsed. | 111, 119; existing Game Over tests |
| Resource layout | Large tappable totals sit between 44px minus/plus controls. The old Amount/Add row is replaced by an Add/Remove dialog with projected total. Cards stack on narrower screens and use three columns when space permits. | 117–118, 129–130 |
| Offline continuity | Resource edits, Round, floored combat, rewards and Rest work with browser networking disabled. | 57, 106, 131 |

The character's Round and the combat attempt number are separate concepts. Combat headings/logs use “Attempt” to avoid confusing retries with the Round counter.

## Round state and migration

- `round` is a nonnegative safe integer. New characters initialize it to 0. Older saves without it normalize to 0; no historical Round is guessed from possibly truncated activity logs.
- Round advances in the same saved transaction as successful Rest recovery and any Supply cost. Preparing Rest, applying the no-Supply wound, cancelling, invalid selection and Game Over do not advance it.
- Undo restores Round, cards, resources and activity together. A resumed paid no-Supply Rest increments Round only when recovery is confirmed.
- Manual Round changes are character gameplay state, so Undo and encounter cancellation treat them like manual resource edits. They are not global preferences.
- At the numeric maximum, Rest is blocked before new costs or wounds. The user can decrease Round through the editor. Invalid imported counters are rejected without replacing another slot.

## Challenge floor and legacy encounters

Base setup values, retry effective values, modifier-adjusted totals and preview comparisons all use a minimum of 1. The six random modifier buckets remain unchanged.

A legacy base of 0 migrates to 1. An unfinished legacy exact-match screen whose hand no longer matches the floored total returns to the decision stage, keeping all cards intact and allowing the player to adjust or resolve. Previously completed victory rewards remain collectible; V20 does not revoke already-earned rewards.

## Animation safety audit

Presentation effects are transient objects outside character state. They never alter resources, cards, Round or reward-granted flags.

- Combat resources and reward-granted state are saved atomically before the visual count-up starts.
- Each count-up is bound to the initiating character and to its committed target totals. Switching characters, returning to the menu, Undo, cancellation or changing the affected resources stops stale animation frames and restores the actual display values.
- Reloading or resuming a pending item decision does not replay the resource animation or award anything again.
- Collapsed Resources stays collapsed. Opening it later shows the final totals without replaying an expired animation. Animations do not scroll the page or steal focus.
- Wound cleanup is tied to the originating effect, with a 500ms timer and matching CSS duration. Old timers cannot clear a newer character's effect. The overlay ignores pointer events and is hidden from assistive technology.
- Reduced-motion preference makes reward totals update immediately without movement. Wounds use a quiet temporary red tint without shaking.
- Resource animation updates are not live-announced on every frame; normal status/activity messages convey the completed operation.

## UI and validation findings addressed

1. **Resource total overflow near the responsive breakpoint:** the inherited `.stat button` padding left too little room for 15-digit totals. The new total-button padding was explicitly scoped and the layout breakpoint was adjusted. Verification includes 320, 390, 600, 601, 800, 801 and 900px widths with maximum supported resource values.
2. **Dialog focus after confirmation:** resource rendering replaces the original total button. Focus now returns to the newly rendered edited total, while Cancel/Escape return to the existing opener.
3. **Round overflow before Rest:** both action entry and recovery confirmation check the next Round before changing gameplay state.
4. **Legacy zero-value exact matches:** those unfinished screens are returned to decision instead of incorrectly awarding a zero-value success under the new floor.
5. **Screen-shake scrollbars:** horizontal overflow is temporarily suppressed while the screen shakes, and the transient class is removed on cleanup/navigation.

The shared amount dialog rejects blank, zero, fractional, negative, non-integer and overflowing amounts. Removing more than the available value is disabled. Invalid or cancelled input creates no gameplay snapshot or activity entry. Each successful change creates one normal Undo snapshot and a Recent Activity entry.

## Test process and limits

The final V20 file passed **131 browser checks, zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. The source hash in `docs/validation/v20-results.json` matches the delivered HTML. Additional menu/title layout checks passed across mobile and desktop widths, and embedded font data is unchanged from V19.

Tests run against the uninstrumented standalone HTML through Playwright/Chromium, using isolated synthetic saves and browser UI actions. Existing V19 tests remain, with expected release, Round fixture and minimum-value boundary assertions updated for V20. Twenty-five new cases cover the requirements above. Validation JSON records the exact source hash used by each run.

Real iOS Safari, Windows, direct-file storage behavior and device GPU performance remain unverified. Earlier managed-browser restrictions prevented direct file navigation and WebKit installation. Chromium mobile emulation, reduced-motion checks and offline routing are useful coverage, not substitutes for physical-device testing.

The app still has a shared-state/DOM-rendering architecture. The new amount editor, section helpers and presentation helpers are grouped internally; broad framework/storage changes remain deferred as agreed.
