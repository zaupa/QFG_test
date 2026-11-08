# Quest For Glory — Version 18

The app title is now **Quest For Glory - Companion App**. The header keeps **Quest For Glory** centered on its own line, with a smaller centered **Companion App** below; controls appear beneath the title.

The supplied Righteous WOFF2 font is embedded directly in the HTML and used for the app title, character names and Adventure Module names, including menu labels. It loads without network access or installation.

Selected cards now have the approved subtle 1px dark-brown border (`#49352B`) across the app, including hover and focus, while keeping the ivory fill, 8% enlargement, 5° tilt and shadow.

Inventory shows a one-time purchase tip when Purchased is first checked and a separate one-time sale tip when Sold is first checked. These preferences are saved per character, included in JSON exports, and preserved through Undo and action cancellation. Seeing a tip is remembered even if the transaction is cancelled.

Main Menu character actions keep fixed columns. Long character and Adventure Module labels are displayed on one line with an ellipsis; the full label remains available on hover and in saved data. On narrow screens the three buttons share an evenly spaced row.

The Action Hand add/remove preview now uses **Total Challenge Value** in place of **Final difficulty**, consistently in Combat and Challenge. This is a wording change only; preview calculations and gameplay rules are unchanged.

## Verification

All 78 browser checks passed on the final V18 release file.

The regression suite covers gameplay, saving, JSON export/import, per-character inventory tips, Undo, encounter cancellation, selection borders, embedded fonts and mobile touch interaction. Results are recorded in `docs/validation/v18-results.json`. Additional focused border, font and centered-title checks are included alongside that report, each with its tested source SHA-256. Menu alignment and ellipsis checks passed at 320, 390, 520, 521 and 900 pixels; centered-title layout checks passed on menu and gameplay screens at 320, 390, 520, 900 and 1280 pixels.

## Using V18

Open `board_game_tracker_v18.html`. To transfer characters between differently named files or browser origins, export from the old version and import into V18. The save key and JSON format are unchanged. V18 retains the previous gameplay, save-recovery and live-preview fixes. Earlier releases are available in Git history.

Real iOS Safari and direct-file persistence remain unverified. Browser checks use Chromium on Linux, including mobile touch emulation and offline routing.
