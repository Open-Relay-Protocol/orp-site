# OPEN-QUESTIONS.md

Everything flagged as unconfirmed while building the site. The upstream
protocol source (`SPEC.md`, `core/`, `board/`, `client/`, `tests/`,
`README.md`, `LICENSING.md`) was **not present** in this `orp-site`
workspace, so the content was authored from the build handoff brief.
Resolve each item against the real repo before publishing.

## Blocking: source repo not present

1. The site was built from the handoff brief, not from `SPEC.md` and
   `core/`. Re-verify every protocol claim, section number, and code
   reference against the upstream `Prograde-Solutions/orp` repo. Until then,
   treat all `SPEC §X` citations as provisional.

## Domain

2. `DOMAIN` is not final ("not 100% on domain yet"). The site is domain and
   base aware via the `SITE_URL` and `BASE_PATH` env vars, with defaults in
   `site/site.config.mjs` (`https://orp.dev` and `/`). The GitHub Pages
   workflow (`.github/workflows/deploy.yml`) sets these automatically for the
   project subpath. When the real domain is ready: add it as a custom domain
   in Settings, Pages (base returns to `/`) and update the `SITE_URL` default
   in `site/site.config.mjs`. `site/public/robots.txt` still hardcodes the
   placeholder sitemap URL; update it when the domain is set.

## Spec section numbers and wording

3. Confirm the blindness invariant lives in SPEC §0/§1 and capture its exact
   wording.
4. Confirm the wire frame names (presence / intent / match), their fields,
   and the `frame_kind` tag against SPEC §1 and `core/schemas` / `core/wire`.
5. Confirm the KEY/offer/answer state machine against `core/protocol`.
6. Confirm §7 (single stateful channel), §8 (capacity), §10 (transport
   split), §11 (delivery ACK), §12 (identity rotation), §13 (neighbor
   propagation) numbering and content.
7. Confirm §9.3 (no forward secrecy), §9.4 (social graph), §9.5 (replay /
   linkability) numbering and the exact accepted trade-offs.

## Decisions

8. Confirm the full ORP-00x decision list. The site only documents ORP-004
   and ORP-006; identify ORP-001..003, ORP-005, and any beyond 006.

## API reference

9. Capture exported types and function signatures for every `core/` module
   (`identity`, `canonical`, `sign`, `sealedbox`, `ice`, `messagelayer`,
   `schemas`, `wire`, `protocol`, `deliverylayer`, `migration`,
   `propagation`, `clock`). The API page currently describes each module's
   responsibility but not its signatures.
10. Confirm the GitHub source URLs/line anchors for each symbol so the API
    page can deep-link.

## Quickstart and tests

11. Confirm the exact npm script names (`test`, `demo`, `demo:real`,
    `typecheck`) and the install command against `package.json` / README.
12. Confirm the test count (the brief says 146 adversarial tests) and the
    names/locations of the board-view scan and the dgram wire-byte scan.

## Operations

13. Confirm the board environment variables (names, defaults, required vs
    optional) for the env var table.
14. Confirm the `os.freemem()` autoscaling caveat wording and the TLS
    reverse-proxy recipe against README.
15. Confirm the AGPL network obligation wording (AGPL §13) against
    `LICENSING.md`.

## Production transport

16. Confirm the exact adapter interface names: `RendezvousBroker`,
    `WebRTCEndpoint`, and the TURN/relay-only guidance against README / SPEC
    §10.

## Licensing

17. Confirm exact license versions (Apache-2.0 for core/client/spec/tests,
    AGPL-3.0 for board) and the precise file boundary.

## Assets

18. Logo source files were not present. `site/src/assets/logo_white.svg` and
    `logo_mark.svg` are placeholder SVG lockups built to the brand tokens.
    Replace with the real ORP logo (convert the official PNG to SVG) before
    publishing.
19. The blue crab mascot (`assets/crab.png`) was not present. It is
    referenced only in the README "Documentation" section per the mascot
    rule; add the real asset there. It is intentionally absent from all
    reference and threat-model pages.
20. The 1200x630 OG card (`site/public/og/orp-og.png`) is generated from
    `site/scripts/generate-og.mjs` using the placeholder logo and brand
    tokens. Regenerate after the real logo lands.
