# V34 audit

V34 targets fresh characters, as requested. No old-character migration work was added. The toolbox remains unchanged. Changes have not been committed or pushed.

## Implemented behavior

- `shops.json` and its template define shop-specific stock, decimal sell/purchase rates, and quantities. Cities reference a shop ID. All nine catalogs fetch and validate as one bundle, including item/shop references, and retain the last good offline bundle on failure.
- Purchases and sales require confirmation. Buy prices round up; sale prices round down, using exact decimal arithmetic. Transactions guard inventory capacity, Coins, stock, stale selections, and safe integer limits. Cancellation is inert; Undo restores both inventory and stock.
- Sold items become available in that shop. Item configuration and remaining equipment uses survive resale, reload and offline reopening. Identical stock merges quantities; different conditions/configurations remain separate. Stock and rates initialize once per character/shop and remain in that character's save.
- Manual inventory addition is free and removal destroys without payment. Removed the former purchase/sale controls, duplicate counter Rest button, and global city/dungeon entry buttons. Map supplies location entry. City Rest outside the Inn remains accessible without the removed counter button.
- Terrain encounter weights are integers 1–4, default 1. Origin settings and weights are snapshotted with movement; Danger Level and Challenge/Combat/arrival order are unchanged.
- Dungeon level types are equally likely: Trap, Puzzle, Physical Barrier, Magical Barrier, Deceiving Encounter. Each has the agreed attribute restrictions plus Luck, enforced for the initial hand and Fate additions. Entry rerolls; retries/reloads do not. Boss levels have no level Challenge type.

## Verification

**216 checks passed**, with zero final failures. The production build, final TypeScript check, whitespace check and unchanged-toolbox check passed. Suites ran independently against the same build; the V33 report combines its full run with one corrected-selector rerun.

Final results and production fingerprints are recorded in `docs/validation/v34-summary.json`. Browser suites use Chromium against the production `dist` build. Reports include page-error assertions, mobile layout checks, character-owned shop stock offline reopening, real stopped-server refresh/reload, valid JSON refresh and atomic fallback after invalid edits.

The V33 movement-lock check also needed its removed counter-Rest selector replaced with a real Rest-action attempt; its targeted rerun passed. The first V34 browser run found an obsolete test selector for inventory removal; the corrected suite passed. Earlier PWA/custom tests were updated for Map entry and the removed manual purchase controls. The former missing-item migration expectation was replaced with a recovery/data-preservation check because cached shops now require valid item references. The old V33 dungeon migration fixture is retained in the historical test file and excluded from the current default run. No product migration was implemented for that fixture.

`npm test` runs the current release acceptance suites. Historical release/gameplay scripts remain available separately; obsolete controls and old-character fixtures are not V34 acceptance requirements.

## Practical limits

- JSON edits apply to the files actually served: preview uses `dist/data`; rebuild after editing `public/data`.
- Existing character-owned shop stock and rates are retained on library refresh. Updated initial stock/rates apply to new characters or shops not yet initialized for a character.
- Shops transact one item per confirmation. Equipped equipment must be moved to inventory before selling.
- Browser automation covers Chromium, including narrow mobile layouts; no physical phone installation was tested.
