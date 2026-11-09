# V27

- Start Game moves to the bottom right with vertical spacing. Name fields capitalize each word as typed; descriptions and keywords retain their spelling.
- Options groups Rename Character, Edit Adventure Module, and Manage Keywords. Keyword edits update the draft live; Save persists and Cancel discards. Enemy association targets gain temporary suggestions until combat confirmation.
- Active combat keyword matches and contributing equipment display bold red. Event Keywords adds a collapsed editable italic list with hidden adventure-module provenance. Recent Activity retains 30 entries. Attribute Points opens Upgrade and flashes unused points.
- Dungeons load from embedded validated JSON. Their dedicated screen reuses Challenge and Combat, locks actions until the level challenge is won, supports retries and one Rest per level, and includes a collapsed Character Sheet. Timing is ignored; existing Rest rules apply. Prepare before entering the boss level.
- Level and eligible encounter Coins bank until exit; repeat visits do not repay Coins. Re-entry starts at level one. Boss victory completes the dungeon and offers treasure with full-inventory replacement. Fleeing combat exits the dungeon without changing terrain.
- Character exports use version 19; older saves migrate with empty dungeon history and Event Keywords. Enemy library version 5 adds a boss flag. Active delves snapshot dungeon and enemy definitions.
