# V30 — Custom enemy and item catalogs

- Confirmed player-defined enemies persist as Custom records and appear in future enemy selection. Reusable custom item templates are learned at confirmation; item-name typing offers ranked saved/game matches.
- Renames Manage Keywords to Manage Custom Keywords and adds draft-based custom enemy/item managers with add/edit/remove and JSON export/import.
- Enforces normalized unique definition names across creation, renaming, shared JSON and imports. Multiple inventory instances remain allowed, while active fights and owned equipment retain their snapshots.
- Adds external items.json and items.template.json to the atomic online/offline library bundle. Older saves/bundles migrate without invented definitions. Character exports use version 21.
- Adds spacing below Event Keywords and clickable full enemy details in dungeon encounter tables.

# V29.0.2 — Windows offline startup

- Normalizes filesystem paths into URL paths before filtering and generating the service-worker asset list. This fixes Windows builds skipping their cached game interface and incorrectly including data JSON in precaching.
- Keeps a content-verified copy of the exact game interface in IndexedDB as a fallback, independently of character records.
- Ready offline now requires verified cached assets and successful game startup. Missing files can be repaired when the server is reachable. Startup errors identify the missing interface; character storage is preserved.
- Adds Windows path simulation, offline interface recovery, truthful readiness and cache-repair regressions.

# V29.0.1 — Offline refresh recovery

- Refresh libraries now fetches JSON in place, preserving the current character and document when the local server is unavailable.
- The initial HTML includes recovery instructions when application JavaScript fails to load. Offline readiness waits for an active worker.
- Service-worker updates retain two previous shell caches and can resolve their older runtime/font/audio/icon assets.
- Regression tests cover an actually stopped HTTP server while the browser still reports online, offline saving/reload, manual refresh without navigation, and boot recovery. No character-storage schema or game rules changed.

# V29 — React / TypeScript PWA

- Adds React startup/PWA controls, IndexedDB local character saves, a versioned service worker, installation metadata and offline shell assets.
- Moves fonts, audio, layout and JSON into external files. Enemy, keyword and dungeon JSON refresh online at opening/foreground return without rebuilding; invalid updates preserve the validated offline bundle.
- Preserves active encounter/delve snapshots, defers foreground library application while busy, and requires a safe explicit action to activate an app update.
- Validates/migrates same-origin localStorage without deleting the old backup. Existing character JSON imports/exports support moving from the standalone HTML or another origin.
- Preserves V28 in `legacy/` and the V27 backup. Character JSON format remains V28-compatible. See README for localhost development, production preview and JSON authoring locations.

# V28

- Upgrade flashes the Available points box when opened with unused points. Repeated action selection closes an unstarted action; an action with selected cards or an active encounter cannot be closed or reset through action selection.
- Dungeon Delve opens selection; Start Delve enters the selected dungeon. Completed entries remain gray, disabled and labeled Dungeon Completed. Exited attempts record the deepest visited level; re-entry starts at level one.
- A numbered level progress display highlights the current/cleared levels and marks the final level Boss. Attempt/Retry Level Challenge uses red. The requested Coin guidance now reads “Each level grants Coins once per level. Treasure requires boss victory.” Existing once-per-character level reward history still prevents replay payouts.
- Dungeon JSON defines encounter chance as base + thresholdPerLevel × level on its chosen die. Missing base defaults to zero. The app shows the formula, current range, enemy table and rolled results.
- A pending monster locks Heal and Rest until victory. Upgrade and its Attribute Points shortcut are unavailable throughout a delve. Coins bank only after the challenge and any encounter are won.
- Boss victory shows persistent congratulations, Coin and treasure rewards, and only Exit Dungeon. Exit collects Coins and continues the existing Keep/Discard/replacement flow. Reload never repeats rewards.
- Character exports use version 20. Existing V27 histories and active delves migrate; the standalone HTML remains the development target before a separate PWA conversion.

# V27

- Start Game moves to the bottom right with vertical spacing. Name fields capitalize each word as typed; descriptions and keywords retain their spelling.
- Options groups Rename Character, Edit Adventure Module, and Manage Keywords. Keyword edits update the draft live; Save persists and Cancel discards. Enemy association targets gain temporary suggestions until combat confirmation.
- Active combat keyword matches and contributing equipment display bold red. Event Keywords adds a collapsed editable italic list with hidden adventure-module provenance. Recent Activity retains 30 entries. Attribute Points opens Upgrade and flashes unused points.
- Dungeons load from embedded validated JSON. Their dedicated screen reuses Challenge and Combat, locks actions until the level challenge is won, supports retries and one Rest per level, and includes a collapsed Character Sheet. Timing is ignored; existing Rest rules apply. Prepare before entering the boss level.
- Level and eligible encounter Coins bank until exit; repeat visits do not repay Coins. Re-entry starts at level one. Boss victory completes the dungeon and offers treasure with full-inventory replacement. Fleeing combat exits the dungeon without changing terrain.
- Character exports use version 19; older saves migrate with empty dungeon history and Event Keywords. Enemy library version 5 adds a boss flag. Active delves snapshot dungeon and enemy definitions.
