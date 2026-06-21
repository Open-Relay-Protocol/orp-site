# ORP brand logos

Drop the brand artwork into this folder using the **exact filenames** below.
The site already references these paths; once the files are committed they
appear automatically (no code changes needed).

| File | Use | Where it's wired in |
| --- | --- | --- |
| `orp-logo-black.png` | Dark mark on **light** backgrounds | Docs nav logo, light mode (copied to `src/assets/`) |
| `orp-logo-blue.png`  | Full-colour (blue gradient) lockup | General-purpose / social / decks |
| `orp-logo-white.png` | White mark on **dark** backgrounds | Site header (`src/pages/index.astro`), docs nav logo (dark mode), and the OG card (`scripts/generate-og.mjs`) |

Each file is the full lockup: the football mark with the carved **ORP**
plus the **OPEN RELAY PROTOCOL** wordmark, set in the brand face **Share Tech**.

## Recommended specs
- **Format:** PNG with a transparent background (SVG also fine — if you commit
  SVG instead, rename the references accordingly, or ask and they'll be updated).
- **Size:** at least ~1024×1024 so it stays crisp on hi-DPI screens.
- **Trim:** tight transparent padding; the header sizes by height (40px).

## Where the brand is wired in
All references now point at the current lockup and the **Share Tech** brand
face — there are no placeholder marks left:
- the **OG card** (`scripts/generate-og.mjs`) composites `orp-logo-white.png`
  and renders the tagline in Share Tech (bundled at `scripts/fonts/`);
- the **homepage header** (`src/pages/index.astro`) uses `orp-logo-white.png`;
- the **docs nav logo** uses `orp-logo-black.png` / `orp-logo-white.png`
  (copied into `src/assets/` and wired in `astro.config.mjs`);
- the **favicon** (`public/favicon.svg`) is a mark-only version of the current
  football lens (no wordmark, since the full lockup is unreadable at 16px).
