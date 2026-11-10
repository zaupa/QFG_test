# V34 — Shops and dungeon Challenge variety

- Adds per-shop JSON stock, quantities, decimal sell/purchase rates, confirmed buying and selling, and persistent character-owned stock. Sold equipment retains its remaining uses and becomes available to buy back.
- Adds atomic loading/validation of `shops.json`, city shop references, and a shop template. Default Lithengard rates are 1.5 to sell and 0.5 to purchase.
- Adds monster weights from 1 to 4 (default 1) to origin terrain encounter tables, preserving the existing Danger Level and movement sequence.
- Randomizes five dungeon level Challenge types with enforced applicable attributes and Luck. Each level entry rerolls; retries and reloads retain the current type. Bosses retain the existing Combat flow.
- Removes the duplicate Adventure Actions Rest button and global Dungeon Delve/Visit City buttons. Use Map to visit locations. Manual inventory additions are free; removal destroys without a sale.
- Targets fresh characters, uses character export envelope 25, and leaves the toolbox unchanged.

# V33 — Adventure Actions, local locations and movement encounters

- Renames the travel button to Map; all tiles can be inspected, with local city/dungeon listings and Settlement/Stairs markers. Entries are restricted to the hero's current tile. Adventure Modules derive locations solely from their map.
- Supports 2–6 surrounding rings and adaptive SVG geometry, including mobile panning/scrollable dialogs.
- Adds two saved Adventure Actions per Round. Movement attempts and location entry cost one; failed movement still spends it. At zero actions, offer Rest when permitted, allow the agreed supporting activities if declined, and refill only after completed Rest.
- Reuses the existing Challenge/Combat flow for movement: origin terrain CV (default 5), then origin encounter chance/enemy list, then arrival after victory. Default Danger Level is 2; global/per-tile configuration and independent movement checks are supported. Pending travel, rolls and rewards persist without duplicate charges or rerolls.
- Adds cosmetic Hero/Ranger/Spellcaster meeple selection during new-character creation and offline SVG assets.
- Uses map/adventure/terrain schema version 2 and character export envelope 24. Intended for fresh V33 characters. Toolbox files are unchanged.

# V32 — Adventure modules and graphical terrain movement

- Replaces typed Adventure Modules with selection from an external catalog, including per-module city/dungeon lists and starting locations.
- Adds configured city definitions and a Visit City picker, with optional amenities and city-specific prices/rates. Temple healing defaults to 10 Coins for up to 5 Wound points without an item.
- Saves Wilderness/City/Dungeon position and return-space information. Adds an accessible SVG travel map with shared-border adjacency, confirmation, Undo, offline persistence and mobile panning centered on the hero.
- Supplies Goriath’s Revenge, Lithengard and its 19-space map; exterior non-start spaces are Horseshoe Mountains.
- Adds external adventure/city/terrain/map JSON and templates to atomic library refresh and offline storage, with ID/reference/price/geometry validation and literal text rendering.
- Preserves old typed names and active city/dungeon saves, including paid recovery. New character exports use envelope version 23.
- Keeps toolbox files unchanged.

# V31 — City, item healing and location-based Rest

- Adds Visit City with a collapsed Character Sheet, Guild, Inn, Blacksmith, and a Shop placeholder.
- Restricts Fate purchases of Attribute Points to the Guild; spending unused points remains available outside the Guild through Card Zones, except in dungeons.
- Heal requires a consumable heal item with `healingAmount`, used consistently in forms, custom catalogs, rewards, data and save migration.
- Replaces manual Rest values with Bad/Partial/Complete recovery (5/15/30), location restrictions, Supply downgrade/Wounds and optional consumed Rest items. Confirmation follows selection; paid recovery resumes safely after reload.
- Inn Complete Rest costs 10 Coins without Supply; Supply bundles cost 1 Coin for 2. Blacksmith repairs broken equipped/inventory gear, default 5 Coins, replacing Fix controls elsewhere.
- Implements additional dungeon completion Fate, banked on boss victory and collected once with Coins on exit.
- Includes pending library-refresh feedback improvements. Character exports use version 22.

# V30.0.1 — Library refresh feedback

- Reports the JSON filename and validation/network error when an update is rejected, while retaining the previous valid libraries.
- Reports when served supported definitions have not changed, and identifies the served data URL.
- Keeps replacement status accurate if a newly opened action/editor defers application.
- Documents source versus preview data folders and the requirement to run the local server for refresh. The dungeon completion Fate field was still reserved in that patch; V31 implements it.

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
