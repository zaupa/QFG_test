# Enemy library and template

`enemies.json` contains the enemy library. `enemies.template.json` provides sample entries to copy when adding enemies. V26 embeds a validated snapshot of this library during the build. After editing the JSON, run `npm run build` from the repository root and distribute the rebuilt `board_game_tracker_v26.html`. The standalone HTML works offline without fetching a separate file.

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
| `Item` | Reward item using the V26 inventory structure below, or `null` for no item. |

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

The V26 JSON wrapper uses `format: "quest-for-glory-enemy-cards"`, `version: 4`, with an `enemies` array. All nine Enemy Card fields are required; unknown enemy fields and duplicate names are rejected. Numeric values must be safe integers; CV also reserves room for the +6 modifier.

In app text fields, `-` is the keyword separator, with or without surrounding spaces. Spaces alone stay within a keyword: `resistant slash-magic` creates `["resistant slash", "magic"]`. Commas are rejected in enemy and item keyword input. JSON still uses arrays with normal JSON commas **between** entries; do not put a comma inside a keyword string. For example, `["weapon", "heavy metal"]` is valid; `["weapon, heavy metal"]` is not.

Older character items migrate their previous description into the required name while keeping the description, keywords and base value. Keyword-only legacy items use their keyword text as a name. Legacy internal hyphens remain intact; old comma-separated/spaced-hyphen lists migrate to separate array entries. Commas cannot remain inside keyword entries; new keyword entry uses the current separator rules. An existing active combat retains a copy of its enemy, so rebuilding the library changes future combats only.

The library wrapper version is 4 for automatic equipment activation. All five supplied enemies keep their existing stats and text. The Thief reward explicitly has `"equipment": null`: its name or keywords alone do not define equipment or invent a combat modifier. Set an equipment object when you have assigned its actual game modifier. The template's second entry demonstrates a weapon reward; neither template enemy is a real definition.

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
- Equipment is active automatically while at least one usage point remains. There is no `enabled` field in V26. Old flags are ignored during migration. Zero remaining points means broken.
- Usage is read-only in the app; failed combat/armor use spends points and Fix restores four points. These fields stay with the item through inventory, equipping, rewards, imports and swaps. Equipment received as a reward enters Inventory after Keep; it is not automatically equipped.
- Ordinary items omit equipment metadata in canonical app saves/embedded snapshots. Explicit `null` is accepted in authoring files.

To update an older library, retain/add item names as required by V22, set wrapper version to 4, and optionally supply equipment objects. Existing V22 character items remain ordinary until explicitly marked Weapon or Armor in the app.

The build rejects malformed data before replacing the HTML. Advanced usage: `node scripts/build-v26.cjs --data path/to/library.json --output path/to/app.html`. The default library is `data/enemies.json`; the template is not included automatically.

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

Run `npm run build` after changes to either JSON catalog. Both snapshots are embedded so the distributed HTML works offline. Advanced build flags include `--data`, `--keywords` and `--output`; invalid catalogs are rejected before output is replaced. If embedded suggestions are unavailable, custom keyword entry still works.

Heal's Use item picker accepts only an exact `heal` keyword (case-insensitive). `healing`, `heal potion` and `rest` are different keywords; adding `rest` to the suggestion catalog does not add a new Rest-item mechanic.

## Character custom suggestions in V26

Character preferences are separate from the shared catalog:

```json
"customKeywords": [
  {"keyword": "moon silver", "category": "Material", "origin": "custom"}
],
"customCategories": ["Celestial"]
```

Custom origin never changes when an entry is assigned to a predefined or new category. Missing origin in older character saves migrates to `"custom"`. Categories are nonempty names up to 60 characters; words are nonempty, at most 300 characters, and cannot contain comma/hyphen delimiters. Spaces remain part of a keyword. Existing global duplicates are overridden by that character's custom category choice, without editing the shared catalog.

While editing an item, a completed new word becomes a temporary selected toggle when focus leaves the field or a hyphen starts the next word. Temporary suggestions are draft state only. Confirmation learns selected new words; Cancel, failed validation or a failed purchase does not. Starting-item drafts transfer to the new character only on Start. Merely editing an existing item's name does not re-add a word removed through Manage Keywords.

Manage Keywords edits suggestions, not existing item/gear/enemy text. Its draft supports Add/Update, Remove, category creation, Cancel and Save changes. These preferences remain through gameplay Undo/cancellation and stay isolated per character. Assigning a word to Material or another predefined group does not turn its origin into predefined.

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

Export includes the manager's shown draft, including empty created categories. Import validates the dedicated format and custom origin, then merges case-insensitively into the draft; existing words keep their current spelling/category. Save changes applies it; Cancel discards it. The file contains no character cards/resources and can be imported into another character or game using this format. Full character exports use envelope version 18.

### Enemy entry toggles

Define Enemy keeps free text entry with no example placeholder. Expand Unprotected/Resistant to select weapon keywords, or Weak/Strong for armor keywords. Character custom words are also offered. Toggling adds/removes full association text; typed abbreviated aliases are recognized. A comma in enemy keywords, or in an enabled item reward's keywords, disables Begin combat until corrected. Submission validation remains in place as a guard.

This does not change `keywords.json` version 1 or enemy library version 4. Build V26 after authoring changes as before; `--audio` additionally selects the WAV source embedded alongside the two JSON catalogs.
