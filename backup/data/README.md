# Enemy library and template

`enemies.json` contains the enemy library. `enemies.template.json` provides sample entries to copy when adding enemies. V22 embeds a validated snapshot of this library during the build. After editing the JSON, run `npm run build` from the repository root and distribute the rebuilt `board_game_tracker_v22.html`. The standalone HTML works offline without fetching a separate file.

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
| `Item` | Reward item using the V22 inventory structure below, or `null` for no item. |

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

The V22 JSON wrapper uses `format: "quest-for-glory-enemy-cards"`, `version: 2`, with an `enemies` array. All nine Enemy Card fields are required; unknown enemy fields and duplicate names are rejected. Numeric values must be safe integers; CV also reserves room for the +6 modifier.

In app text fields, `-` is the keyword separator, with or without surrounding spaces. Spaces alone stay within a keyword: `resistant slash-magic` creates `["resistant slash", "magic"]`. Commas are rejected in enemy and item keyword input. JSON still uses arrays with normal JSON commas **between** entries; do not put a comma inside a keyword string. For example, `["weapon", "heavy metal"]` is valid; `["weapon, heavy metal"]` is not.

Older character items migrate their previous description into the required name while keeping the description, keywords and base value. Keyword-only legacy items use their keyword text as a name. Legacy internal hyphens and comma text are preserved during save migration; new keyword entry uses the current separator rules. An existing active combat retains a copy of its enemy, so rebuilding the library changes future combats only.

The library wrapper version increases from 1 to 2 because item names are now required. The five supplied enemy definitions retain their stats and text; the Thief reward has gained `name: "A dagger"`. The template demonstrates a separately named reward with optional description. To convert another version-1 library, add names to each non-null Item and set the wrapper version to 2 before building V22.

The build rejects malformed data before replacing the HTML. Advanced usage: `node scripts/build-v22.cjs --data path/to/library.json --output path/to/app.html`. The default library is `data/enemies.json`; the template is not included automatically.
