# Enemy library and template

`enemies.json`, `keywords.json`, `dungeons.json`, and `items.json` are external runtime data for the React PWA. Edit these files in `public/data/` during development; in a deployed build, edit the served `data/` files (normally `dist/data/`). Reopen the app online or select Refresh libraries when idle. JSON-only edits do not require a rebuild. All four files are validated together and the last valid set remains available offline. Templates are authoring examples, not loaded by the app.

Add as many enemy objects as needed inside the `enemies` array. Separate objects with commas, with no comma after the last entry. Remove unused sample entries. JSON does not allow comments.

| Field | Meaning |
|---|---|
| `id` | The exact enemy name. Must match `name`; use unique names within the list. |
| `name` | Enemy name. |
| `boss` | Required boolean: true for a boss, false otherwise. |
| `description` | Enemy description; use an empty string if absent. |
| `CV` | Challenge Value, integer at least 1. |
| `WV` | Wound Value, integer at least 0. |
| `F` | Fate reward, nonnegative integer. |
| `C` | Coin reward, nonnegative integer. |
| `KW` | Array of enemy keywords, or `[]`. Display: *Keyword 1 - Keyword 2*. |
| `Item` | Reward item using the V28 inventory structure below, or `null` for no item. |

## Item reward

```json
"Item": {
  "name": "Dagger",
  "description": "A small steel blade",
  "keywords": ["weapon", "metal"],
  "baseValue": 5
}
```

- `name`: required nonempty text, maximum 300 characters. Item lists, reward prompts and Heal consumption messages use this name.
- `description`: optional text. Omit it or use `""` when there is no description.
- `keywords`: an array of strings, not a single text string. Use `[]` when there are no keywords. Each entry can be a word or a phrase.
- `baseValue`: a nonnegative integer representing Coins.
- Item keywords display in italics, separated by ` - `: *weapon - metal*.
- Description and the keywords joined with ` - ` share a maximum of 300 characters, retaining the inventory's text limit.

Enemy-level keywords use the abbreviated key `KW`. Keywords inside an item keep the key `keywords`. Both are arrays; do not store the display separators as separate array entries.

Use `"Item": null` when there is no reward. The first template sample has no item; the second demonstrates keyword arrays, an item reward and the minimum Wound Value of 0. Neither template entry is a real enemy definition.

The V28 JSON wrapper uses `format: "quest-for-glory-enemy-cards"`, `version: 5`, with an `enemies` array. All ten Enemy Card fields are required; unknown enemy fields and duplicate names are rejected. Numeric values must be safe integers; CV also reserves room for the +6 modifier.

In app text fields, `-` is the keyword separator, with or without surrounding spaces. Spaces alone stay within a keyword: `resistant slash-magic` creates `["resistant slash", "magic"]`. Commas are rejected in enemy and item keyword input. JSON still uses arrays with normal JSON commas **between** entries; do not put a comma inside a keyword string. For example, `["weapon", "heavy metal"]` is valid; `["weapon, heavy metal"]` is not.

Older character items migrate their previous description into the required name while keeping the description, keywords and base value. Keyword-only legacy items use their keyword text as a name. Legacy internal hyphens remain intact; old comma-separated/spaced-hyphen lists migrate to separate array entries. Commas cannot remain inside keyword entries; new keyword entry uses the current separator rules. An existing active combat retains a copy of its enemy, so rebuilding the library changes future combats only.

The library wrapper version is 5 for automatic equipment activation. The five original supplied enemies keep their existing stats and text; the Giant Zombified Rat is added as the dungeon boss. The Thief reward explicitly has `"equipment": null`: its name or keywords alone do not define equipment or invent a combat modifier. Set an equipment object when you have assigned its actual game modifier. The template's second entry demonstrates a weapon reward; neither template enemy is a real definition.

## Equipment rewards

Ordinary items may omit `equipment` or use `null`. A weapon or armor uses:

```json
"Item": {
  "name": "Training sword",
  "description": "A basic blade",
  "keywords": ["weapon", "metal"],
  "baseValue": 5,
  "equipment": {
    "type": "weapon",
    "modifier": 2,
    "usage": [true, true, true, true]
  }
}
```

- `type`: required `"weapon"` or `"armor"`.
- `modifier`: required positive safe integer, at most `Number.MAX_SAFE_INTEGER - 364` so an Action Hand can be added safely.
- `usage`: four booleans; checked points are `true`. Omitted usage defaults to four checked points.
- Equipment is active automatically while at least one usage point remains. There is no `enabled` field in V28. Old flags are ignored during migration. Zero remaining points means broken.
- Usage is read-only in the app; failed combat/armor use spends points and Fix restores four points. These fields stay with the item through inventory, equipping, rewards, imports and swaps. Equipment received as a reward enters Inventory after Keep; it is not automatically equipped.
- Ordinary items omit equipment metadata in canonical app saves and saved encounter snapshots. Explicit `null` is accepted in authoring files.

To update an older library, retain/add item names as required by V22, set wrapper version to 5 and add `boss: false` to ordinary enemies, and optionally supply equipment objects. Existing V22 character items remain ordinary until explicitly marked Weapon or Armor in the app.

The PWA rejects malformed data before replacing its last validated offline libraries. The standalone V28 builder is retained only for the legacy HTML; it does not control PWA library refresh.

## Standard enemy keyword associations

Store an association as a complete string in the enemy `KW` array. Target keywords match an active equipped weapon/armor keyword exactly, without case sensitivity; extra whitespace is normalized. Spaces inside a target, such as `Full Body`, remain one keyword.

| Enemy association | Required equipment match | Effect |
|---|---|---|
| `Unprotected against slash` | Weapon has `slash` | CV −6 |
| `Resistant against slash` | Weapon has `slash` | CV +6 |
| `Weak against metal` | Armor has `metal` | WV −2 |
| `Strong against metal` | Armor has `metal` | WV +2 |

The older abbreviations `resistant slash` and `Unprotected fire` also work. Distinct matching associations add together; repeated copies of the same association apply once. Opposing effects offset. CV is floored at 1, then retry reduction and the random modifier retain their existing minimum-one rules. WV is floored at 0 after keyword effects, then armor's flat modifier reduces it, also floored at 0. The corrected example is CV 16 + 6 = 22, WV 4 + 2 = 6 before the armor's flat reduction.

Broken equipment supplies neither its modifier nor its keyword matches. A last usage point still applies to that attempt; its breakage changes later attempts. Armor spends one point on a failure when its flat modifier or a net weakness effect actually prevents wounds. Special enemy-specific effects in descriptions remain manual; no arbitrary prose is executed or interpreted as a formula.

The app shows combat values and matched adjustments while retaining original enemy stats in the saved card. Resolved-attempt availability is saved so breakage/reload keeps the previous explanation consistent; retry uses current remaining usage. Positive associations reserve safe numeric room when validating CV/WV.

## Suggested keywords (`keywords.json`)

The independent authoring catalog uses:

```json
{
  "format": "quest-for-glory-keywords",
  "version": 1,
  "keywords": [
    {"keyword": "slash", "category": "Damage type", "uses": ["weapon"]},
    {"keyword": "metal", "category": "Material", "uses": ["weapon", "armor", "generic"]},
    {"keyword": "heal", "category": "Effect", "uses": ["generic"]}
  ]
}
```

The supplied 36 entries cover the requested weapon, armor and generic categories, including `cristal`, `Partial Protection`, `Full Body`, `heal` and `rest`. Dice columns are omitted. `uses` contains one or more of weapon/armor/generic; keyword/category must be nonempty. Catalog keyword strings cannot contain comma or hyphen delimiters. Duplicate category/keyword entries are rejected.

Suggestions appear in shared inventory, starting-item, equipped-item and enemy-reward forms. Clicking a chip toggles it: add with ` - ` if absent, remove matching words if selected, and update the highlight. Free custom keywords remain allowed and need not appear in this catalog. Changing item type filters suggestions without rewriting typed text. The combined Description/Keywords limit remains 300 characters; an oversized suggestion is refused without truncating text.

JSON catalog edits take effect on the next online opening without rebuilding. Invalid files leave the last validated library bundle unchanged and show a notice.

Heal's Use item picker accepts only an exact `heal` keyword (case-insensitive). `healing`, `heal potion` and `rest` are different keywords; adding `rest` to the suggestion catalog does not add a new Rest-item mechanic.

## Character custom suggestions in V28

Character preferences are separate from the shared catalog:

```json
"customKeywords": [
  {"keyword": "moon silver", "category": "Material", "origin": "custom"}
],
"customCategories": ["Celestial"]
```

Custom origin never changes when an entry is assigned to a predefined or new category. Missing origin in older character saves migrates to `"custom"`. Categories are nonempty names up to 60 characters; words are nonempty, at most 300 characters, and cannot contain comma/hyphen delimiters. Spaces remain part of a keyword. Existing global duplicates are overridden by that character's custom category choice, without editing the shared catalog.

While editing an item, a completed new word becomes a temporary selected toggle when focus leaves the field or a hyphen starts the next word. Temporary suggestions are draft state only. Confirmation learns selected new words; Cancel, failed validation or a failed purchase does not. Starting-item drafts transfer to the new character only on Start. Merely editing an existing item's name does not re-add a word removed through Manage Keywords.

Manage Keywords edits suggestions, not existing item/gear/enemy text. Its draft supports Add, live editing, Remove, category creation, Cancel and Save changes. These preferences remain through gameplay Undo/cancellation and stay isolated per character. Assigning a word to Material or another predefined group does not turn its origin into predefined.

### Shared custom-keyword JSON

```json
{
  "format": "quest-for-glory-custom-keywords",
  "version": 1,
  "categories": ["Celestial"],
  "keywords": [
    {"keyword": "moon silver", "category": "Material", "origin": "custom"},
    {"keyword": "star stone", "category": "Celestial", "origin": "custom"}
  ]
}
```

Export includes the manager's shown draft, including empty created categories. Import validates the dedicated format and custom origin, then merges case-insensitively into the draft; existing words keep their current spelling/category. Save changes applies it; Cancel discards it. The file contains no character cards/resources and can be imported into another character or game using this format. Full character exports use envelope version 22.

### Enemy entry toggles

Define Enemy keeps free text entry with no example placeholder. Expand Unprotected/Resistant to select weapon keywords, or Weak/Strong for armor keywords. Character custom words are also offered. Toggling adds/removes full association text; typed abbreviated aliases are recognized. A comma in enemy keywords, or in an enabled item reward's keywords, disables Begin combat until corrected. Submission validation remains in place as a guard.

This does not change `keywords.json` version 1 or enemy library version 5. The PWA loads these files at startup and keeps audio under `public/audio/`.

## Dungeon library (V28)

`dungeons.json` is fetched externally on each online opening. Copy entries from `dungeons.template.json`; keep dungeon IDs unique. Files use `format: "quest-for-glory-dungeons"`, `version: 1`, and a `dungeons` array. Reopen the app after changing the served JSON. Invalid formulas, incomplete roll tables, or missing enemy references reject the new bundle and preserve the previous valid set.

Each dungeon has `id`, `name`, `type`, `description`, and `maxLevel`. `challenge` and `coinReward` each hold `base` and `perLevel`: value = base + perLevel × current level. The final level skips its challenge and fights the boss. `monsterChance` holds `base`, `die`, and `thresholdPerLevel`; an encounter occurs when the roll is at most base + level × thresholdPerLevel (capped at die size). Missing `base` defaults to zero for older files. The formula is declarative data, not executable JavaScript. For `1 + 1 × level` on 1d6, use `{"base":1,"thresholdPerLevel":1,"die":6}`; at level 2 the encounter range is 1–3. Nonnegative safe integers are required, and unsupported arithmetic ranges stop the build. `encounters` contains rows such as `{ "rolls": [1,2,3], "enemyId": "Giant Rats" }` covering every die result exactly once. Enemy IDs reference `enemies.json`. `boss` contains final `level` and `enemyId`, which must reference an enemy with the required boolean `boss: true`. Ordinary enemy cards use `boss: false`; enemy library version is now 5.

`treasure` is an inventory item or null, offered only after boss victory. `timing` is descriptive metadata, currently ignored. Rest uses existing rules and is allowed once per level per attempt after the level challenge and any monster combat are won. Heal is also locked until the monster is defeated. Upgrade is unavailable throughout a delve. Boss-level preparation is unavailable; prepare before delving from the preceding level.

Coins accumulate pending until exit or completion. Each level and its encounter Coins pay once per character across attempts; monster Fate and item rewards follow existing combat rules. Re-entry starts at level 1. Defeating the boss closes the dungeon for that character. Active delves save snapshots of dungeon and enemy definitions, so later library updates do not change a delve underway.

V28 records `highestLevelReached` per character and dungeon, including the deepest visited level on exited attempts. Older history derives a minimum from rewarded levels and the active delve. Completed dungeons remain listed with **Dungeon Completed** and disabled selection. Boss victory persists a `victory` phase: congratulations lists pending Coins and treasure, then **Exit Dungeon** pays Coins and opens the existing treasure decision. No payout occurs merely by showing or reloading congratulations.

## Shared item library

`items.json` uses `{"format":"quest-for-glory-items","version":1,"items":[...]}`. Copy entries from `items.template.json`. Each item requires `name`, `keywords` (an array, possibly empty), and nonnegative integer `baseValue`; `description` is optional. Equipment optionally adds `{"type":"weapon"|"armor","modifier":positiveInteger,"usage":[true,true,true,true]}` under `equipment`. Names must be unique ignoring case and extra spaces. Loading items makes them available as inventory-name suggestions, not as starting possessions.

Player-created definitions are separate per-character records: `{"origin":"custom","definition":{...}}`. Custom enemy/item exports use `quest-for-glory-custom-enemies` or `quest-for-glory-custom-items`, version 1, and a `definitions` array. Import through the matching manager. It validates the entire file and merges into a cancellable draft; conflicts never overwrite an existing definition. Game item definitions are never written back by a character action.

## V31 item recovery and dungeon completion

Items with the exact `heal` keyword (case-insensitive) require a positive safe integer `healingAmount`. This is the maximum combined Wound-card value restored when the item is consumed by Heal. It applies equally to generic items, weapons/armor, enemy `Item` rewards and dungeon `treasure`. Omit the field when the item has no heal keyword. New JSON is validated strictly; only older saved character items and cached pre-V31 catalogs receive the migration default of 5. The templates include healing examples; no new possessions are granted by loading them.

```json
{"name":"Healing Potion","description":"","keywords":["heal"],"baseValue":2,"healingAmount":5}
```

An item with `rest` can be consumed to promote Rest by one type. It needs no numeric recovery field: Bad/Partial/Complete have fixed maxima of 5/15/30.

Dungeon `completionFateReward` is a nonnegative safe integer, default 0 for older files. It is additional to the boss card's own `F`. After victory it is banked once, shown in congratulations, and paid atomically with pending Coins on Exit Dungeon. An overflowing Coin or Fate pool leaves both payments pending until corrected. The treasure choice does not re-award currency. Changing JSON does not rewrite a dungeon snapshot already being explored.

## V32 world catalogs

Four additional external catalogs are loaded with enemies, keywords, dungeons and items. The complete bundle is validated before replacement; offline play uses its last validated IndexedDB copy. Corresponding `.template.json` files contain the playable test examples. IDs are unique, stable ASCII letters/digits/hyphens/underscores beginning with a letter or digit; names are ordinary text. IDs are case-sensitive.

| File | Format | Root list |
| --- | --- | --- |
| adventure-modules.json | quest-for-glory-adventure-modules | modules |
| cities.json | quest-for-glory-cities | cities |
| terrain-types.json | quest-for-glory-terrain-types | terrainTypes |
| maps.json | quest-for-glory-maps | maps |

Each uses `version: 1`. An adventure entry has this structure:

```json
{
  "id": "goriaths-revenge",
  "name": "Goriath's Revenge",
  "mapId": "goriath-map",
  "cityIds": ["lithengard"],
  "dungeonIds": ["R1"],
  "startingLocation": {"type":"city", "cityId":"lithengard", "spaceId":"T01"}
}
```

For a Wilderness start use `{"type":"wilderness","spaceId":"T03"}`. Every referenced city, dungeon, map and starting space must exist. A starting city must belong to `cityIds`. Empty city/dungeon lists are valid. Module selection is required for new characters. Changing an existing character's selected module moves it to that module's start while keeping resources, cards, inventory, custom preferences, event keywords and dungeon history. Changing modules is blocked during an activity or city/dungeon visit.

City configuration:

```json
{
  "id":"lithengard",
  "name":"Lithengard",
  "amenities":{
    "blacksmith":{"repairCost":5},
    "shop":{},
    "inn":{"restCost":10,"supplyBundleCost":1,"supplyBundleAmount":2},
    "guild":{"attributePointsPerFate":3},
    "temple":{"healingCost":10,"healingAmount":5}
  }
}
```

Omit an amenity to make it unavailable. Costs are nonnegative safe integers; healing amount, Supply bundle amount and Attribute Points per Fate are positive safe integers. Zero-priced configured services are supported. Shop buying rules are not yet defined. Template repair price is the default editable payment; other configured prices/rates apply directly. Visiting a city snapshots its definition to protect ongoing operations from later library edits; exit/reenter to use new settings.

Terrain types have `id` and `name`. The initial five are Forest, Plains, Mountains, Deep Forest and Swamp. Map entries contain `id`, `name` and `tiles`. A tile has `id`, `name`, `terrainTypeId`, `adjacentIds`, `ring`, `index`, `count` and `exterior`. The fan map supports a center (`ring:0,index:0,count:1`) and up to three surrounding half-circle rings. Each ring must contain every index from zero to count minus one, use one consistent count (at most 30), and have no duplicated sector. Neighbor lists must exactly match shared borders, be symmetric, and keep the map connected. Same-ring neighbors differ by one index; adjacent rings connect where their angular intervals overlap with positive width. Point-only contact and skipped rings are unavailable.

The test map has 1 center + 5 inner + 6 middle + 7 outer spaces = 19. Its outer ring and side boundary spaces are Mountains named Horseshoe Mountains. T01 is the starting city opening. Cities and dungeons are currently available according to module lists, rather than discovered per-tile locations; entering/leaving retains the Wilderness space. Individual visit restrictions and travel Challenges can be added later.

Saved characters reference the module ID and a position such as `{"type":"wilderness","spaceId":"T03"}`, `{"type":"city","cityId":"lithengard","spaceId":"T03"}`, or `{"type":"dungeon","dungeonId":"R1","spaceId":"T03"}`. The space is the return position for a city/dungeon visit. Old unknown module names and their progress remain intact until the player selects a new module.

## V33 authoritative map locations, rings and encounters

Use schema version **2** for `maps.json`, `adventure-modules.json` and `terrain-types.json`. Cities and the original enemy/item/keyword/dungeon catalogs keep their own existing versions. V33 is intended for fresh characters. Templates contain a ready-to-play Goriath's Revenge configuration.

Adventure entries now reference their map and start only; remove `cityIds` and `dungeonIds` lists:

```json
{"id":"goriaths-revenge","name":"Goriath's Revenge","mapId":"goriath-map","startingLocation":{"type":"city","spaceId":"T01","cityId":"lithengard"}}
```

Each tile owns a `locations` array; empty means no locations. City IDs reference `cities.json`; dungeon IDs reference `dungeons.json`. A location can be placed on only one tile per map, but a tile may hold both types. Example tile fields:

```json
"locations": [
  {"type":"city","id":"lithengard"},
  {"type":"dungeon","id":"R1"}
]
```

Adventure availability comes entirely from its map, and the starting city must physically exist on the configured start tile. Deprecated module-level lists do not override map placement. In the test map Lithengard is on T01 and R1 is on T04; all exterior non-start spaces remain Horseshoe Mountains.

Each map has `ringCount`, an integer from **2 to 6**, excluding the center. Add/remove complete tile rings when changing it. Every ring has all indices from 0 to count minus one, no duplicated sectors, and consistent count. Maintain exact `adjacentIds`: same-ring neighboring sectors, or positive angular overlap between adjacent rings. Corner-only contact is not adjacency. The SVG radii adapt to ring count; incomplete or contradictory geometry rejects the update rather than changing the map partially.

Terrain entries now include `movementCV`, a positive safe integer with room for the existing ±6 random modifier; omission defaults to 5:

```json
{"id":"forest","name":"Forest","movementCV":5}
```

Map encounter configuration:

```json
"encounters": {
  "dangerMode":"global",
  "dangerLevel":2,
  "enemyIds":["Giant Rats","Skeleton","Zombie","Giant Spiders"]
}
```

`dangerMode` is `global` or `tile`. Global mode uses the map's Danger Level. Tile mode uses the origin tile's `dangerLevel`, default 2 if omitted. Levels are integers 0–6: zero never triggers, six always triggers. A roll at most the applicable level triggers combat. Tiles may supply `enemyIds` to override the map's table, independently of danger mode. Lists must be nonempty, contain unique existing enemy IDs and currently use equal selection odds. Example additional origin-tile fields:

```json
"dangerLevel":4,
"enemyIds":["Skeleton","Zombie"]
```

Confirmed travel snapshots its origin, destination, CV, Danger Level and enemy cards. It spends one Adventure Action before the Challenge, rolls an encounter only after success, and arrives only after winning any encounter. The destination never supplies this attempt's CV, chance or enemy list. Failed/abandoned movement stays at the origin without refund. Reload resumes a pending stage; changing JSON cannot reroll an already selected encounter. Each later movement checks again.

Character state now includes `meeple` (`hero`, `ranger`, `spellcaster`), `adventureActions` (0–2), `restOfferPending`, and optional `pendingTravel`. These are gameplay save fields, not map configuration. Completed Rest refills two actions; profile creation starts with two without charging for the initial city. Character exports use envelope version 24. Meeple/location SVGs live under `public/icons` and are precached for offline use.

All eight libraries still refresh atomically. Missing locations/enemies, invalid CVs/Danger Levels/rings or incomplete adjacency retain the last valid bundle. Rebuild or copy the edited source JSON into `dist/data` when using preview. The toolbox is retained unchanged and is not expanded into a world-map editor by this release.

## Optional custom map borders

A tile may define both `startAngle` and `endAngle` as finite degrees within 0–180 across the fan. Omit both for the original equal-width sector determined by index/count. The start must be smaller than the end. Within a ring, sectors sorted by index must cover 0–180 continuously without gaps or overlap; the center always spans 0–180.

The toolbox's Edit borders tool writes these fields and rebuilds symmetric adjacentIds automatically. Shared-border overlap, excluding point-only contact, determines connections between neighboring rings. The PWA renderer and movement validation use the same endpoints. Deploy the application code supporting custom borders together with maps that use them.
