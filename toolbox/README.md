# Quest for Glory data workshop

Open **data-editor.html** directly in a browser. It is a self-contained, offline HTML tool: no server, companion app, npm install or internet connection is needed to use it. Nothing in the main app imports or serves it.

## Workflow

1. Select Enemies, Keywords, Items or Dungeons. The included data is a snapshot from the repository at build time.
2. Use **Open data folder** to choose the folder containing your JSON libraries. All eight standard files load together, with save destinations linked to that folder in supported browsers. Alternatively, use **Open JSON files** to edit just one file or any selected subset. You can select several libraries together so references are validated against the same set. Opening replaces that library in the editor; it does not merge records.
3. Select an entry, edit the labeled fields and use **Apply entry**. Add, duplicate or delete entries using the controls. Add/remove buttons inside an entry manage keywords, encounter rows, dice rolls and optional equipment, rewards and treasure. Required schema fields remain fixed to keep files compatible with the app.
4. Use **Save current file** for one library, or **Save all modified files** to write every changed library, including new keywords and item presets. The editor validates the full bundle before a bulk save. Writes happen one file at a time; if a write fails, completed files are reported and remaining files stay marked unsaved. Supported browsers can write back to files selected with the browser file picker. New libraries prompt for a destination. If direct writing is unavailable, use the JSON download and replace the original file yourself. Downloads remain marked unsaved because the tool cannot verify replacement.
5. For development, place enemy, keyword, item and dungeon files in `public/data/`. For an existing deployment, replace the corresponding served `data/` files, then use the companion's Refresh libraries control. Save related enemy/dungeon changes together.

The editor checks files using the game's validation rules, including numeric limits, duplicate entries, equipment, dungeon roll coverage and enemy/boss references. Enemy IDs follow their names automatically. Renaming an enemy updates references in the editor's loaded dungeon library; save **both** modified files. Referenced enemies cannot be deleted until their dungeon references are changed. JSON import is atomic: a failed import leaves loaded libraries unchanged.

Applied edits stay in memory until saved. Drafts prompt before switching records; closing the page warns about unsaved work. The editor does not modify character saves or browser game storage. Keep copies of original JSON files before replacing them.

## Item presets

The Items tab loads the game's **items.json** library (`quest-for-glory-items`, version 1). Save it alongside the other libraries in `public/data/` or the deployed `data/` directory.

To reuse a catalog item, add a reward/treasure and choose **Copy from item catalog**. This copies the full item, including equipment and usage. Later catalog edits do not alter existing rewards; copy again to update them. Keyword suggestions use the currently loaded keyword catalog, and custom text remains allowed. Predefined keywords, category suggestions and the Keywords entry list appear in alphabetical order. For enemy associations, choose Unprotected, Resistant, Weak or Strong, then select or type the target keyword and click Add association. Existing associations use the same two-part fields; plain enemy keywords remain editable without an effect. Duplicate effect/target pairs are refused. Unknown keywords prompt for confirmation when added to an association or when an edited entry is applied. Confirm to add the keyword to the Custom category with its equipment use; cancel to keep it only on that entry. Save keywords.json separately to keep catalog additions. Existing imported keywords are not silently added. The saved JSON keeps the game's existing string format, for example `Resistant against slash`.

## Maintaining the tool

`editor.template.html` is the editable source. `data-editor.html` is the generated, distributable artifact with rules and starting data embedded. After editing the template, changing game rules, or refreshing starting data, run from the repository:

```sh
npm ci
node toolbox/build.mjs
```

The build uses the repository's TypeScript dependency to embed the shared rules without imports; there are no runtime dependencies in the generated HTML. Rebuilding does not read or overwrite files edited/downloaded in a browser.

Browser regression checks:

```sh
node toolbox/test.cjs
node toolbox/test-world.cjs
node toolbox/test-visual-map.cjs
node toolbox/test-terrain-enemies.cjs
node toolbox/test-bulk-danger.cjs
node toolbox/test-map-borders.cjs
node toolbox/test-remove-space.cjs
node tests/map-borders-rules.cjs
```

The editor uses the current game validator for dungeon `completionFateReward`, including its default of zero. Items with the exact `heal` keyword require a positive whole-number `healingAmount`; edit Healing amount in the Items tab, enemy rewards, or dungeon treasure. It is omitted from saved non-healing items. The `rest` keyword does not require a healing amount.

## Folder editing

Choose the directory that directly contains `enemies.json`, `keywords.json`, `items.json`, `dungeons.json`, `cities.json`, `terrain-types.json`, `maps.json` and `adventure-modules.json` (normally `public/data`). Other files and nested folders are ignored. Reopen the folder when starting a new editor session. Chrome and Edge support direct folder writing when allowed by browser permissions. Other browsers can load a folder through the directory upload picker; use individual JSON downloads to replace those files afterward. Single-file loading and saving remain available at all times.

Missing standard files prompt before loading as empty libraries; embedded sample data is never mixed into a selected folder. A missing file is created only when you save that library. Malformed files or invalid cross-references leave the previous libraries and file destinations untouched. Bulk saving is sequential, not a filesystem transaction.

When you create or change an enemy reward or dungeon treasure to an item name not already in the catalog, Apply entry asks whether to add it to `items.json`. Accepting copies the complete item, including keywords, value, equipment and usage; declining keeps it only in the reward/treasure. Existing catalog items are not overwritten. Save both the edited library and the item catalog, or use Save all modified files.

The toolbox build validates all JSON libraries and templates under `public/data/` before regenerating the standalone HTML. Rebuild after data or rule changes to keep the starting snapshot and embedded validators current.

## V32 world data

The Cities, Terrain types, Maps and Adventures tabs edit the four world catalogs. They load and save alongside the original four libraries, including from a selected folder. The generated tool includes the current world data and the same city, map-geometry and cross-reference validators as the game.

- Cities: add/remove optional blacksmith, shop, inn, guild and temple amenities; edit their prices, bundle amounts and recovery rates. Removed amenities are omitted from JSON, rather than written as null.
- Terrain types: define stable IDs and display names. Referenced terrains cannot be deleted.
- Maps: use the visual editor to select spaces, edit names and terrain, paint terrain, or move spaces. Advanced map fields remain available in the collapsed geometry panel. **Recalculate map adjacency** derives all neighbor IDs from the current ring geometry. Apply still checks complete rings, valid geometry and connectivity; recalculating edges does not fix incomplete rings.
- Adventures: choose the map and city or wilderness start. Cities and dungeons now belong to individual map spaces. Reference dropdowns store IDs and display names. Selecting a different map refreshes the starting-space options.

Open related files together when their references change. Imports are staged and validated as a bundle before replacing anything. The game requires at least one terrain and adventure; folders missing those catalogs cannot be opened as a valid bundle until the required files are provided. To change a referenced world ID, add the replacement definition, update references, then delete the old one. The editor blocks invalid references rather than silently rewriting them. Existing world definitions are never substituted with embedded samples when opening a folder.

## Visual map editing

In Maps, click a colored space to show its name, terrain, exterior setting and neighbors in the inspector. The map is drawn from the same sector geometry as the game. Changes remain drafts until Apply entry, and require Save current file or Save all modified files to reach disk.

- **Select / edit:** click a space, or focus it and press Enter/Space. Edit the selected space in the inspector.
- **Paint terrain:** choose a terrain from the brush dropdown or terrain legend, then click spaces to paint them.
- **Move spaces:** drag a source onto another sector, or click the source followed by the destination. The two spaces swap ring/index/count positions, keeping their IDs, names, terrain and exterior settings. Neighbor lists are recalculated automatically. Adventure starting locations still reference the same space ID after a move.
- **Undo map change / Redo map change:** step through visual edits while the map entry is a draft. Applying/discarding the entry or switching entries resets this local history.
- **Ring layout:** expand Add or remove spaces, set the size of each ring (0–30) and apply the layout. The center always exists; occupied rings must be contiguous. Existing sector data is kept, new sectors get unique IDs and the brush terrain, and removed spaces require confirmation. Removing an adventure's starting space is blocked. New outer-ring spaces start with Exterior checked; inspect this setting to reflect your map's intended boundary.

Movement snaps to sectors because the game supports a center plus two to six half-circle rings. Free-position coordinates are not part of maps.json. Recalculate map adjacency and the full raw forms remain available for advanced authoring. All maps still pass the shared geometry/reference validator before saving.

## V33 terrain encounters

Open Maps and use **Terrain encounter enemies**. Each colored terrain column lists the enemies available on its spaces. **All enemies** is the catalog pool. Drag an enemy's name from the pool to add it, or between terrain columns to move it. The Move/Copy selector controls transfers between terrains. Destination dropdowns and action buttons provide the same operations without dragging. Remove deletes an assignment from that terrain group. Undo/Redo covers encounter changes.

The game stores encounters per map/space, not per terrain definition. Group operations write `enemyIds` overrides onto every matching space in the selected map; the global map default is retained. Changes do not affect other maps. Duplicate enemy IDs are prevented, and removal/movement is blocked if it would empty any source space's list. Mixed per-space lists are labeled explicitly; adding/removing a card preserves the other per-space differences.

Expand **Map-wide danger and default enemy list** for global/tile danger mode, Danger Level 0–6, and the inherited default pool. Select a space and expand **Space locations and encounter settings** to edit its city/dungeon placements, optional Danger Level and enemy override. Use default controls remove overrides rather than writing null. Terrain types now expose movement CV. Ring layout and map rendering support two through six surrounding rings.

Enemy renames update both dungeon references and map encounter tables; save every modified file. Old world catalogs are normalized together on import, promoted to schema version 2, and marked unsaved when migration changes them. The validator uses the real enemy catalog to reject unknown encounter IDs.

### Source-data repairs in this update

The published adventure/map JSON contained committed merge-conflict markers. The repair preserves the edited 16-space geometry (rings 1/5/6/4, including T20), removes obsolete module-wide city/dungeon fields and retains V33 location/encounter fields. R1 remains at its existing map space; the former module-level R2/T1 dungeon availability is migrated to the adventure's starting space. No enemy statistics or item definitions are changed.

## Bulk danger levels and expanded sections

In Maps → Terrain encounter enemies, each terrain column has a **Danger level** control. Enter a whole number from 0 to 6 and click **Apply danger to [terrain]**. This changes every space of that terrain in the selected map. Zero never triggers an encounter; six always triggers one. Apply entry, then save maps.json.

If the map was using global danger mode, applying a terrain level switches it to tile mode and preserves every other space's previous effective danger level. Other terrain groups therefore keep the same encounter chances. In existing tile mode, other groups and their individual overrides remain untouched. Mixed levels show a blank input with Mixed levels as its placeholder until you choose a uniform value.

**Reset [terrain] danger** removes those space overrides; the game's tile-mode default is 2. It does not change the map's danger mode. Undo/Redo includes bulk changes and mode switching.

Expanded map settings, space settings, ring layout, encounter board and advanced sections retain their open/closed state throughout edits, Apply entry and Undo/Redo. Space settings stay expanded when you select another space. Closing a section explicitly keeps it closed. Enemy-column scroll positions are retained when controls rebuild the editor. These preferences last for the current page session.

## Dragging map borders

Choose **Edit borders** from Map tool. Gold dividers appear between neighboring spaces within each ring. Drag a divider clockwise or counterclockwise to resize the two spaces. Neighbor lists update automatically as the border crosses spaces in adjacent rings. Apply entry and save maps.json to keep the geometry.

Undo/Redo includes border edits. Press Escape during a drag to cancel. Focus a gold divider and use Left/Right arrows to adjust one degree, or Shift with an arrow for five degrees. Outer fan edges and ring radii stay fixed; dividers stop before collapsing a space.

Changed spaces store optional `startAngle`/`endAngle` endpoints in degrees from 0 to 180 across the fan, left to right. Existing maps omit them and retain equal-width sectors. The game's shared validation, rendering, label positions and travel adjacency now understand these endpoints; use the updated application build when deploying edited maps. Rings must remain complete, ordered and free of gaps/overlaps. Corner-only contact is not adjacency.

Moving spaces swaps their angular endpoints along with their sectors. Rebuilding a ring with a different number of spaces resets that ring to equal widths; rings whose counts are unchanged keep their edited borders.

## Removing a selected space

Choose Select / edit, click a map space, then click **Remove selected space** in its inspector. Confirm the removal. The previous space in that ring expands into the gap (or the next space when deleting the first sector), and sector indices/counts and adjacency lists are updated. Existing custom borders on other spaces are preserved.

City/dungeon markers move onto the absorbing neighbor so they remain available; the removed space's danger/enemy overrides are discarded. Center spaces and adventure starting spaces cannot be removed. Removing the sole space of the outermost ring removes that ring only when at least two surrounding rings remain. A required inner ring cannot be left empty.

Undo restores the removed space and its settings. Apply entry and save maps.json to keep the removal.
