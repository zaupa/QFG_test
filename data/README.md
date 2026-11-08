# Enemy list template

Copy `enemies.template.json` to `enemies.json` and replace the sample entries with your enemies. This is a data template only; the application does not read it yet.

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
| `KW` | Array of enemy keywords, or `[]`. Intended display: `Keyword 1 - Keyword 2`. |
| `Item` | Inventory-compatible reward item, or `null` for no item. |

For `Item`, keep `description`, `keywords` and `baseValue`, matching the existing inventory structure. The description is required when an item is present. Description and keywords share a maximum of 300 characters. `baseValue` is a nonnegative integer representing Coins. Item keywords remain a text string.

The first sample has no item reward. The second demonstrates an item reward and the minimum Wound Value of 0. Neither sample is a real enemy definition.
