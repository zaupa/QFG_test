# Move a character from standalone V28

Open `board_game_tracker_v28.html`, use its Main Menu Export control for each character, then open the React PWA at its localhost/HTTPS address and choose Import Character. This works even if the HTML file’s storage belongs to a different origin.

If both apps already share the same origin, the PWA validates and migrates the old localStorage slots automatically into IndexedDB. It leaves the old copy unchanged for recovery. Continue future play in the PWA to avoid creating two independent versions of the same character.
