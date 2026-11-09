# V26 implementation and audit

V26 implements the completed feature list on top of V25. It remains one offline HTML file, including both validated JSON catalogs and the supplied WAV. V25 and the existing V24 backup remain unchanged during local development; no push/archive rotation has been performed.

## Requirements and coverage

| Requirement | Implementation | Coverage |
|---|---|---|
| Align equipment checkbox/text | Scoped flex row and fixed 20px checkbox in shared inventory and enemy reward editors. | 251 |
| Immediate temporary keywords | Blur captures all words; a hyphen captures completed preceding words. Temporary selected chips appear without a permanent save. | 252–254 |
| Confirm/cancel boundary | Only selected newly introduced draft words are learned on valid confirmation. Cancel/failed validation/payment do not save them. | 34, 91, 233, 235, 252–254 |
| Keyword/category manager | Header button beside Edit Module; add/edit/remove, predefined categories, new categories, draft Cancel/Save. | 255–257, 272–273 |
| Preserve custom origin | Entries carry origin custom independently from category; legacy entries migrate. Manager changes do not rewrite items. | 255–260, 273 |
| Share complete list | Dedicated JSON includes categories/origin, exports shown draft, imports merge into cancellable draft with duplicate protection. | 258–260 |
| Enemy entry | No example placeholder; expandable association toggles use relevant weapon/armor catalog plus character words. Commas disable Begin combat. | 158, 261–263 |
| Victory sound | Supplied WAV copied unchanged, embedded, decoded as three seconds, and requested once on confirmed combat victory. | 264–270 |
| Offline/build/mobile safety | No external assets; invalid WAV/catalog input cannot replace output; 320px review, escaping and keyboard cancellation. | 146, 271–275 |

## Draft state and confirmation

Item editors hold separate transient keyword drafts, including original-word keys and pending new suggestions. Starting a new keyword captures completed phrases; leaving the field captures the final phrase. Pending words are selected based on current text and remain togglable if removed. They do not alter character preferences until successful item confirmation.

Blur redraw is deferred during pointer activation so adding a suggestion cannot move a Confirm/Cancel button between mouse-down and click. Keyboard/programmatic blur flushes safely; focused suggestion buttons are restored when rebuilt. Closing/cancelling discards pending words. Failed validation/purchase does not reach the preference commit. Existing words are tracked at edit start, so unrelated edits do not silently re-learn a custom word removed through the manager.

Starting items use creation-local preferences until character Start; enemy item rewards commit their draft words only when enemy creation succeeds. Enemy association prose does not become item suggestions. Global catalog membership is not required for custom text.

## Preference model and sharing

Entries are `{keyword, category, origin: "custom"}`. Missing origin in older character data migrates to custom; incompatible origin values are rejected. Category is independent, nonempty and up to 60 characters. Custom category names persist separately in `customCategories`, including empty created categories. Character exports use envelope version 18; storage keys, enemy schema 4 and global suggestion catalog 1 are unchanged.

The manager edits a cloned per-character draft. Add/Update applies its form to the shown list; Save changes commits the list/categories. Cancel/Escape/navigation discards it. Renaming/removing suggestions does not rewrite items, equipped keywords or active enemy cards. It is therefore usable during combat without bypassing inventory/equipment locks. Gameplay Undo/cancellation preserves the current preference registry exactly, including removals/category edits.

Custom entries override same-named global suggestions for that character's chosen category; the global JSON stays unchanged. All custom entries keep their provenance regardless of whether the category is predefined or newly created.

Shared files use format `quest-for-glory-custom-keywords`, version 1, with `keywords` and `categories`. Export includes the shown manager draft. Import validates the entire file, then merges case-insensitively; existing entries keep their spelling and category. Category assignments and unused categories are retained. Nothing is written to character state until Save changes. Asynchronous imports check manager identity and character ownership before applying results. Character cards/resources are not exported in this bundle.

## Enemy association UI

Define Enemy's keyword placeholder is removed. Four expandable groups offer complete standard associations. Unprotected/Resistant use weapon terms; Weak/Strong use armor terms, with character-specific words also available. The existing rule parser recognizes canonical and abbreviated manual text; a selected chip removes either representation of the same association. Free text remains supported.

Enemy keyword commas disable Begin combat and display the existing correction tip. Commas in the item reward field also disable it when that reward is enabled; hidden unused fields do not block an otherwise valid enemy. The submission path still validates, so the UI state is not the only guard. The same existing CV/WV matching/resolution rules consume the resulting keyword array.

## Audio asset and playback safety

`audio/medieval_fantasy_victory_fanfare_3s.wav` is copied unchanged from the user attachment: 264,644 bytes, mono 44.1 kHz 16-bit PCM, duration 3.0 seconds. SHA-256 is recorded in `audio/README.md`. Build validates RIFF/WAVE framing before atomically replacing output, and embeds the bytes as a data URL. Downloaded HTML needs no audio folder or network connection.

A new combat victory sets `victorySoundPlayed` before requesting playback, alongside the saved pending reward state. Exact matches wait for recovery confirmation. Failure and Challenge resolution do not play it. Resource-overflow collection, item decisions, reload and resumed legacy rewards do not repeat it. Old pending victories missing the flag normalize to already played.

Menu/character changes and Undo stop/reset playback. Reconfirming a victory after Undo may play again because that prior result was undone. Rejected playback promises or unavailable browser sound are caught without changing resources, cards or rewards. Tests verify actual WAV decoding/duration and playback invocation/once-only behavior; physical audibility/device volume is not claimed.

## Verification and limits

The final V26 HTML passed **275 browser checks with zero failures**, using Playwright 1.62.1 and Chromium 156.0.8078.79 on Linux. Its SHA-256 matches the delivered file and validation record.

The suite retains 250 prior checks with expected updates for custom origin/category defaults, comma-disabled buttons and export version 18. Twenty-five new cases cover draft transitions, first-click confirmation/cancellation, category/origin management, sharing, exact association controls, audio decode/playback/reload, invalid asset handling, mobile layout, offline use and escaped text. Tests target the production HTML using synthetic saves and isolated Chromium contexts. The exact source hash is recorded in `docs/validation/v26-results.json`.

Mobile review caught and fixed a cramped New Category field; it now stacks on narrow screens and the test checks input/button separation. Existing card conservation, Deadly Effort, Game Over, rewards, animations and storage recovery remain in regression coverage.

Real iOS Safari, Windows, device audio output, physical-device performance and direct-file persistence remain unverified. Previous managed-browser file navigation was blocked before app code ran. Offline routed Chromium checks are not a substitute for device/file testing.
