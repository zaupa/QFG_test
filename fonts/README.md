# Local fonts

These files are extracted unchanged from the V28 standalone app. The active PWA loads them as external assets and caches them for offline use.

- `righteous.woff2`: the supplied Righteous title/name typeface.
- `gothic.ttf`, `cinzel.ttf`, `body.ttf`: the existing companion’s other font faces.

Font-family mappings live in `src/game/styles.css`. Replacing a font is an application-asset change: rebuild and deploy the PWA so the service-worker cache version changes.
