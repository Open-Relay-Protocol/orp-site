# ORP brand logos

Drop the brand artwork into this folder using the **exact filenames** below.
The site already references these paths; once the files are committed they
appear automatically (no code changes needed).

| File | Use | Where it's wired in |
| --- | --- | --- |
| `orp-logo-black.png` | Dark mark on **light** backgrounds | Reserved for light surfaces (print, light embeds) |
| `orp-logo-blue.png`  | Full-colour (blue gradient) lockup | General-purpose / social / decks |
| `orp-logo-white.png` | White mark on **dark** backgrounds | Site header (`src/pages/index.astro`) and the OG card (`scripts/generate-og.mjs`) |

Each file is the full lockup: the football mark with the carved **ORP**
plus the **OPEN RELAY PROTOCOL** wordmark.

## Recommended specs
- **Format:** PNG with a transparent background (SVG also fine — if you commit
  SVG instead, rename the references accordingly, or ask and they'll be updated).
- **Size:** at least ~1024×1024 so it stays crisp on hi-DPI screens.
- **Trim:** tight transparent padding; the header sizes by height (40px).

## Still using placeholders
Until these files exist, the site falls back gracefully:
- the **OG card** (`generate-og.mjs`) draws a placeholder football + “ORP”;
- the **header** shows a broken-image box for `orp-logo-white.png`;
- the **favicon** (`public/favicon.svg`) and the **docs nav logo**
  (`src/assets/logo_mark.svg` / `logo_white.svg`) are unchanged vector
  placeholders.

### Optional follow-ups (ask to wire these up)
- **Docs nav logo:** commit `orp-logo-black.png` + `orp-logo-white.png` to
  `src/assets/` and `astro.config.mjs` can switch the Starlight logo to them.
- **Favicon:** a square, **mark-only** icon (no wordmark) reads best at 16px;
  the full lockup is hard to read that small.
