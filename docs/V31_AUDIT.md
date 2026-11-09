# V31 audit — City and recovery

V31 implements the requested city services, item-based healing, location-based Rest, and dungeon completion Fate. No changes have been pushed.

## Rules and transaction decisions

- Heal requires an eligible inventory item and uses its `healingAmount`. New definitions require a positive safe integer; existing character items and pre-V31 offline catalogs missing the field migrate to 5. The shared normalizer covers starting items, gear, custom definitions, enemy rewards and dungeon treasure. Cancel keeps the item; successful Heal consumes exactly one instance.
- Rest starts at Bad/Partial/Complete for dungeon/normal/Inn. Outside the Inn, lack of Supply demotes once, minimum Bad, and causes the existing 5-point Wound. An optional consumed `rest` item promotes once after that downgrade, maximum Complete. Fixed recovery limits are 5/15/30.
- Rest's final prompt follows type/item selection. Confirmation commits costs/item use into a persistent transaction; it then requires any Wound allocation and Fatigue recovery to finish. It cannot be cancelled or switched after payment. Empty recovery is allowed, avoiding a dead end when no Fatigue cards remain. Round advances once on completion, never on a fatal Wound.
- Inn Rest costs 10 Coins without Supply, downgrade or Wound. Supplies cost 1 Coin for each bundle of 2.
- Guild alone buys new Attribute Points for Fate. Existing unused points remain spendable through Card Zones outside the Guild, including elsewhere in a city; dungeon upgrading stays blocked.
- Blacksmith repairs broken equipped or inventory gear, default payment 5 Coins with the existing adjustable nonnegative cost. It restores four usage points and leaves inventory gear in inventory. Fix controls are absent elsewhere.
- Additional dungeon `completionFateReward` is banked once on boss victory, shown in congratulations, then paid with pending Coins on Exit. Both currencies are prevalidated before either is paid; overflow retains both pending. Boss-card Fate remains separate. Treasure decisions/reloads cannot repay currency.
- City services use their own screen and collapsed Character Sheet. Unstarted services can toggle/switch; a confirmed recovery or selected cards prevent switching. Shop purchasing remains undefined and is shown as a placeholder.

## Verification scope

Validation records in `docs/validation/v31-*.json` cover the final production build. The browser suites check runtime errors, saved IndexedDB values and UI guards, plus resource/card invariants, cancellation, reload, overflow, Undo, custom catalogs and offline behavior. Mobile city layout is captured separately.

The current gameplay regression suite retains 225 preexisting cases. Twenty-four old recovery/repair/Guild cases depend on removed manual values, default-screen Upgrade or old confirmation timing; these are explicitly superseded by V31's focused tests. Their original standalone tests remain available through `test:legacy`. The exact list is recorded in `v31-superseded-cases.json`. Three retained assertions are adapted for the absence of Fix outside Blacksmith and disabled itemless Heal. Comparisons normalize the new `city: null` and `restPlan: null` defaults; they still compare meaningful city/recovery state when present.

Earlier V31 candidate results found one stale Version 30 assertion and one stale Fix-button bounding-box assertion, both in test expectations. Corrected assertions are included in the final reruns. The audit also added migration for pre-V31 offline heal catalogs and validation of persisted recovery phases.

This release includes the pending V30.0.1 refresh-feedback fix. That earlier targeted audit is retained in `REFRESH_FEEDBACK_AUDIT.md`; its historical statement about reserved dungeon Fate is superseded by V31.

## Final results

Production build, TypeScript checking and whitespace validation passed. **371 checks passed; 0 failed.** All browser checks reference the final production runtime and layout; artifact/source SHA256 values and component reports are recorded in [validation/v31-results.json](validation/v31-results.json).

| Suite | Passed | Failed |
| --- | ---: | ---: |
| Retained gameplay regressions | 225 | 0 |
| V31 focused gameplay and transactions (44 + 4) | 48 | 0 |
| Shared rules and source data | 16 | 0 |
| PWA platform and refresh | 37 | 0 |
| Custom catalogs | 43 | 0 |
| Offline asset paths and actually stopped server | 2 | 0 |

The mobile city screenshot is [validation/v31-city-mobile.png](validation/v31-city-mobile.png). Run `npm test` to build and repeat all current suites, or `npm run test:v31` for the new feature checks against an existing build. The working branch is `pwa_wip`; no commit or push was performed.

## Publish integration

Before publishing, remote commits through `0b70fd9` were merged, preserving their toolbox and game-data updates. The toolbox tree remains exactly `c09c874fa7d4f600fd9bc2039814bdb447a10404`. The newly supplied Potion of Healing received `healingAmount: 5`, matching its description and V31's item schema. The production build, all 16 rule/data checks, and five targeted startup/healing/library-refresh checks passed after integration; see `validation/v31-post-merge-smoke.json`. The 371-check report above describes the pre-integration release audit; application runtime and stylesheet bytes are unchanged by this merge. The earlier no-push statement records audit-time status; publication was subsequently requested.
