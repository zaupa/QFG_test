# Enemy library and template

`enemies.json` contains the enemy library. `enemies.template.json` provides sample entries to copy when adding enemies. V21 embeds a validated snapshot of this library during the build. After editing the JSON, run `npm run build` from the repository root and distribute the rebuilt `board_game_tracker_v21.html`. The standalone HTML works offline without fetching a separate file.

Add as many enemy objects as needed inside the `enemies` array. Separate objects with commas, with no comma after the last entry. Remove unused sample entries. JSON does not allow comments.

| Field | Meaning |
|---|---|
| `id` | The exact enemy name. Must match `name`; use unique names within the list. |
| `name` | Enemy name. |
| `description` | Enemy description; use an empty string if absent. |
| `CV` | Challenge Value, integer at least 1. |
| `WV` | Wound Value, integer at least 0. |
| `F` | Fate reward, nonnegative integer. |
| `C` | Coin reward, nonnegative integer. |
| `KW` | Array of enemy keywords, or `[]`. Display: *Keyword 1 - Keyword 2*. |
| `Item` | Reward item using the V21 inventory structure below, or `null` for no item. |

## Item reward

```json
"Item": {
  "description": "A dagger",
  "keywords": ["weapon", "metal"],
  "baseValue": 5
}
```

- `description`: required nonempty text when an item is present.
- `keywords`: an array of strings, not a single text string. Use `[]` when there are no keywords. Each entry can be a word or a phrase.
- `baseValue`: a nonnegative integer representing Coins.
- Item keywords display in italics, separated by ` - `: *weapon - metal*.
- Description and the keywords joined with ` - ` share a maximum of 300 characters, retaining the inventory's text limit.

Enemy-level keywords use the abbreviated key `KW`. Keywords inside an item keep the key `keywords`. Both are arrays; do not store the display separators as separate array entries.

Use `"Item": null` when there is no reward. The first template sample has no item; the second demonstrates keyword arrays, an item reward and the minimum Wound Value of 0. Neither template entry is a real enemy definition.

The JSON wrapper remains `format: "quest-for-glory-enemy-cards"`, `version: 1`, with an `enemies` array. All nine Enemy Card fields are required; unknown enemy fields and duplicate names are rejected. Numeric values must be safe integers; CV also reserves room for the +6 modifier.

V21 migrates existing character item keyword strings into arrays when loading. In the app's text fields, separate keywords with a spaced hyphen (` - `). Internal hyphens, such as `two-handed`, remain part of a keyword. Keywords can contain phrases. Existing active combats retain a copy of their enemy, so rebuilding the library changes future combats only.

The build rejects malformed data before replacing the HTML. Advanced usage: `node scripts/build-v21.cjs --data path/to/library.json --output path/to/app.html`. The default library is `data/enemies.json`; the template is not included automatically.
