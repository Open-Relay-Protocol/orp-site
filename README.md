# orp-site

Marketing site and protocol reference for **ORP**, the Open Rendezvous
Protocol: a device-first messaging protocol whose rendezvous server is
structurally unable to read message contents, keys, or unsealed signaling.
An enforced invariant, not a logging policy.

> [!NOTE]
> This repository holds the **website** (Astro + Starlight) plus planning
> docs. The protocol source of truth lives in the upstream
> [`Prograde-Solutions/orp`](https://github.com/Prograde-Solutions/orp) repo.
> The site was authored from a build handoff brief; every protocol claim is
> tracked for verification against the real `SPEC.md` and `core/` sources in
> [`OPEN-QUESTIONS.md`](./OPEN-QUESTIONS.md).

## Documentation

The site contains:

- **Landing** (`/`): the blind-broker pitch, trade-offs stated up front.
- **Protocol reference** (`/docs/...`): wire types, the KEY/offer/answer
  phases, cryptographic controls, the threat model, board operations, and an
  API reference per `core/` module.
- **Comparison** (`/compare/`): blind rendezvous vs trusted signaling
  servers.
- **FAQ** (`/docs/faq/`): can the server read my messages, forward secrecy,
  and the other common questions.

> TODO: add the docs site badge and link once the domain is confirmed
> (see `OPEN-QUESTIONS.md`). Placeholder: `https://orp.dev`.

## Develop the site

```bash
cd site
npm install
npm run dev      # local dev server
npm run build    # static build to site/dist
npm run preview  # preview the built site
```

`npm run build` also regenerates the Open Graph card and the
`llms.txt` / `llms-full.txt` answer-engine files via the `prebuild` step.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub
Pages. To turn it on, in the repo go to **Settings, Pages** and set
**Source** to **GitHub Actions** (one time). The workflow then runs on every
push to `main` that touches `site/`, and can also be run manually from the
**Actions** tab (Run workflow) against any branch.

The workflow reads the Pages origin and base path automatically, so the build
works at the project subpath (`https://<owner>.github.io/<repo>/`) with all
links, canonical URLs, the sitemap, and `llms.txt` correctly prefixed.

The build is domain and base aware through two environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `SITE_URL` | `https://orp.dev` | The deployed origin (scheme + host). |
| `BASE_PATH` | `/` | The path the site is served under, for example `/orp-site`. |

When the real domain is ready, point DNS at Pages, add the custom domain in
**Settings, Pages** (which sets the base back to `/`), and update the
`SITE_URL` default in `site/site.config.mjs`.

## Repository layout

| Path | What |
| --- | --- |
| `site/` | The Astro + Starlight site (static output). |
| `REPO-INVENTORY.md` | Protocol facts the site is built from, with sources. |
| `CONTENT-MAP.md` | The sitemap, page types, and target intents. |
| `SEO-STRATEGY.md` | Titles, meta, JSON-LD, AEO plan, and the "not doing" list. |
| `REFERENCE-OUTLINE.md` | The heading tree for every reference page, sourced. |
| `OPEN-QUESTIONS.md` | Everything to confirm against the upstream repo. |

## SEO and answer-engine files

- `sitemap-index.xml` and `robots.txt` are generated at build time.
- `/llms.txt` and `/llms-full.txt` give answer engines a clean, in-sync copy
  of the site.
- Per-page canonical, Open Graph, Twitter Card, and JSON-LD
  (`SoftwareSourceCode`, `TechArticle`, `FAQPage`) are emitted on every page.

## Social preview

The 1200x630 Open Graph card lives at `site/public/og/orp-og.png` (logo
lockup on the slate base with the tagline). Set it as the GitHub social
preview under **Settings, Options, Social preview** so shared links render
the card. The blue crab mascot is reserved for README and social use; it
stays off the reference and threat-model pages.

## License

ORP itself ships a split license: the core, client, spec, and tests under
Apache-2.0, and the board (the rendezvous server) under AGPL-3.0. See the
upstream `LICENSING.md`.
