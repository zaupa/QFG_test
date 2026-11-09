# Quest for Glory data workshop

Open **data-editor.html** directly in a browser. It is a self-contained, offline HTML tool: no server, companion app, npm install or internet connection is needed to use it. Nothing in the main app imports or serves it.

## Workflow

1. Select Enemies, Keywords, Items or Dungeons. The included data is a snapshot from the repository at build time.
2. Use **Open data folder** to choose the folder containing your JSON libraries. All four standard files load together, with save destinations linked to that folder in supported browsers. Alternatively, use **Open JSON files** to edit just one file or any selected subset. You can select enemies.json, keywords.json, items.json and dungeons.json together so references are validated against the same set. Opening replaces that library in the editor; it does not merge records.
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
```

The editor preserves and edits `completionFateReward` in dungeon data. The current game validator does not yet apply this field during gameplay; the toolbox does not change game rules.

## Folder editing

Choose the directory that directly contains `enemies.json`, `keywords.json`, `items.json` and `dungeons.json` (normally `public/data`). Other files and nested folders are ignored. Reopen the folder when starting a new editor session. Chrome and Edge support direct folder writing when allowed by browser permissions. Other browsers can load a folder through the directory upload picker; use individual JSON downloads to replace those files afterward. Single-file loading and saving remain available at all times.

Missing standard files prompt before loading as empty libraries; embedded sample data is never mixed into a selected folder. A missing file is created only when you save that library. Malformed files or invalid cross-references leave the previous libraries and file destinations untouched. Bulk saving is sequential, not a filesystem transaction.

When you create or change an enemy reward or dungeon treasure to an item name not already in the catalog, Apply entry asks whether to add it to `items.json`. Accepting copies the complete item, including keywords, value, equipment and usage; declining keeps it only in the reward/treasure. Existing catalog items are not overwritten. Save both the edited library and the item catalog, or use Save all modified files.
