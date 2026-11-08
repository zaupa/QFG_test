# Enemy library and template

`enemies.json` contains the enemy library. `enemies.template.json` provides sample entries to copy when adding enemies. The application does not read these files yet; library integration is planned for V21.

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
| `KW` | Array of enemy keywords, or `[]`. Intended display: *Keyword 1 - Keyword 2*. |
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
- Item keywords are intended to display in italics, separated by ` - `: *weapon - metal*.
- Description and the keywords joined with ` - ` share a maximum of 300 characters, retaining the inventory's text limit.

Enemy-level keywords use the abbreviated key `KW`. Keywords inside an item keep the key `keywords`. Both are arrays; do not store the display separators as separate array entries.

Use `"Item": null` when there is no reward. The first template sample has no item; the second demonstrates keyword arrays, an item reward and the minimum Wound Value of 0. Neither template entry is a real enemy definition.

The JSON wrapper remains `format: "quest-for-glory-enemy-cards"`, `version: 1`, with an `enemies` array. The existing V20 application still stores item keywords as text; the app-side migration to arrays will be implemented with the remaining V21 changes after approval to begin coding.
