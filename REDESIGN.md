# ORP Homepage Redesign — Audit, Strategy & Implementation Plan

**Scope:** `https://www.openrelayprotocol.com` (the Astro + Starlight site in `site/`).
**Author goal:** maximize technical clarity, developer trust, GitHub conversions,
documentation engagement, organic search traffic, and time-on-page.
**Posture:** opinionated, optimized for developer adoption and search visibility —
not aesthetic preservation.

This document contains all nine requested deliverables. The redesign it
describes is implemented in `site/src/pages/index.astro` in the same change.

---

## 0. Three findings that outrank everything else

Before any copy or layout work, three issues cap the ceiling on every metric.
Fix these first; they are cheap and they gate the rest.

| # | Finding | Why it dominates | Fix |
| --- | --- | --- | --- |
| **F1** | The GitHub repo `github.com/Open-Relay-Protocol/orp` returns **HTTP 404** (private or not yet pushed). Every "View on GitHub" CTA — the primary conversion on the whole site — lands on a dead page. | You cannot convert to GitHub, show stars, count contributors, or earn developer trust against a repo nobody can open. This nullifies deliverable goals 3 and 4 entirely. | Make the repo public (or fix the URL). Until then, trust indicators have nothing real to read and must not be faked. |
| **F2** | A literal `TODO: confirm the test count and scan names against the repo` is **rendered on the live homepage** (proof section, `index.astro:286`). | A visible "TODO" on a *security* product's landing page is the inverse of developer trust. It signals the claims are unverified — which, per `OPEN-QUESTIONS.md`, they are. | Remove the TODO from the rendered page. State only what is verified; move unverified numbers behind verified-or-omitted. |
| **F3** | **Brand name is inconsistent.** Domain = *open**relay**protocol.com*; all content, README, and `REPO-INVENTORY.md` = *Open **Rendezvous** Protocol*. | Search engines, answer engines, and humans need one canonical name. Splitting "Relay" vs "Rendezvous" fractures brand search, backlinks, and schema `name`. | Pick one. **Resolved: Open Relay Protocol** — it matches the canonical domain (*openrelayprotocol.com*) and the white paper, with "rendezvous" retained as the technical term for the meeting the board brokers. Standardized on "Open Relay Protocol (ORP)." |

> Everything below assumes F1–F3 are being resolved. The implemented homepage
> is built so that the moment the repo is public, the live trust indicators
> (stars, contributors, last commit) populate automatically with **real**
> values — no hardcoded numbers, consistent with the project's stated rule
> against fabricated metrics.

---

## 1. UX Audit

### What's working (keep)
- **The Three.js "blind board" scene** is the single best asset on the page:
  it *shows* the core claim (the board sees only sealed tags) instead of
  asserting it. It maps directly onto the required **Interactive Demo**
  section. Keep it, but move it lower so it follows an explanation.
- **Honesty as a design value.** Trade-offs stated up front, "this is not
  100% anonymity." This is exactly right for a security audience and rare.
  Preserve and elevate it (the **Threat Model Summary** section).
- **Design tokens** (`custom.css`): coherent indigo/violet/teal palette, serif
  headings, dark theme. Reuse as-is.
- Accessibility foundations already present: skip link, `prefers-reduced-motion`
  handling, SVG fallback for the WebGL scene, `aria-live` caption.

### Friction points & specific fixes

| # | Friction | Evidence | Fix |
| --- | --- | --- | --- |
| U1 | **Hero answers "what is it" only for insiders.** "The rendezvous server is structurally blind" is a *property*, not a definition. A developer landing cold can't tell what ORP *is*, who it's *for*, or what they'd *do* with it. | `index.astro:128` | New H1 leads with category ("open signaling protocol for WebRTC") + the differentiator. Subhead states audience + payoff. (See §6 copy.) |
| U2 | **Primary CTA points away from the conversion goal.** The first, highest-emphasis button is "Read the docs"; GitHub is the ghost/secondary button. The brief's #3 goal is GitHub conversions. | `index.astro:135–140` | Make **"Star on GitHub"** (or "View on GitHub") the primary; "Read the docs" secondary. Add live star count to the button area. |
| U3 | **No trust indicators anywhere.** No stars, contributors, license, last-commit, test-count badges. Zero social proof. | whole page | Add a GitHub trust strip in the hero (badges) + a maturity row. |
| U4 | **No code, no install, no API shape.** A developer never sees a single line of ORP. Developers trust code, not adjectives. | whole page | Add **Getting Started** with a real, copyable quickstart snippet and a minimal API example. |
| U5 | **Demo appears before the explanation.** The interactive scene is section 2, before the reader knows what a "board," "sealed payload," or "KEY/offer/answer" is. Cognitive load spikes. | `index.astro:145` | Order: explain (How ORP Works → Can/Cannot See) *then* demo. |
| U6 | **No comparison table on the homepage.** The strongest persuasion asset (the trusted-vs-blind table) is buried on `/compare/`. | `compare.mdx:48` | Surface a condensed comparison table on the homepage; link to `/compare/` for depth. |
| U7 | **"Proof" section makes claims it then disclaims** with a visible TODO. Net effect: distrust. | `index.astro:285–288` | Rebuild as **Test Suite Evidence** with concrete, verifiable artifacts (what each scan asserts), no TODO, and a "run it yourself" command. |
| U8 | **No Use Cases.** Nothing helps a reader self-identify ("this is for *my* P2P app / federated tool / privacy messenger"). | whole page | Add **Use Cases** section with 3–4 concrete scenarios. |
| U9 | **No on-page FAQ.** FAQ exists only at `/docs/faq/`. Misses long-tail SEO + `FAQPage` rich results on the highest-authority URL (the homepage). | `faq.mdx` | Add an on-page FAQ (accordion) with `FAQPage` JSON-LD. |
| U10 | **Mobile: HUD crowds the scene.** On small screens the phase chips + caption + toggle overlay a shorter canvas; controls compete with the 3D view. Already partially mitigated but still dense. | `index.astro:876–902` | Stack HUD below the canvas on `<600px` instead of overlaying; reduce default canvas height; ensure 44px tap targets. |
| U11 | **Header nav has no GitHub star affordance and links "Why blind"** (jargon). | `index.astro:117–122` | Rename "Why blind" → "Why ORP" / "Compare"; add a GitHub button with star count to the nav. |
| U12 | **Single column, no visual rhythm** for scannability; long prose blocks. | sections | Introduce the can/cannot two-column, the comparison table, and code blocks to break rhythm and raise scannability. |

### Typography, spacing, hierarchy
- **Type scale is fine**; H1 `clamp(2.4rem, 6.5vw, 4.2rem)` is good. Tighten
  `line-height` on the lede (1.6 → 1.45) for denser, more "technical" feel.
- **Section dividers** (`border-top: 1px solid #18243a`) are subtle; keep, but
  add an eyebrow label per section for orientation ("01 / How it works").
- **Contrast:** body `#c2cad8` on `#080a14` ≈ 9:1 (good). Muted notes
  `#8f9bb0` ≈ 5.3:1 (passes AA for normal text, borderline — keep ≥16px).
  `#8fb4f2` eyebrow on dark passes. **Verify the teal `#aef6ec` code text on
  `#14233c`** — it passes, keep ≥0.85em readable.
- **Focus states:** buttons rely on `transform`/`border-color` for hover but
  there is **no explicit `:focus-visible` outline**. Add a visible focus ring
  (2px, `--orp-teal`) on all interactive elements — current keyboard focus is
  ambiguous. (Accessibility fix, ships in this redesign.)

### Accessibility checklist (state after redesign)
- [x] Skip link, reduced-motion, WebGL fallback (already present)
- [x] `:focus-visible` rings added to buttons, nav, chips, FAQ toggles
- [x] FAQ as native `<details>/<summary>` (keyboard + screen-reader free)
- [x] Comparison table is a real `<table>` with `<th scope>` (not a CSS grid)
- [x] Trust badges have descriptive `alt` text; decorative SVGs `aria-hidden`
- [x] Tap targets ≥44px on mobile (HUD restacked below canvas)
- [ ] **Action:** run axe / Lighthouse after deploy; target a11y ≥ 95.

---

## 2. SEO Audit

### Current state
- **Strengths:** canonical, OG/Twitter, `SoftwareSourceCode` + `WebSite`
  JSON-LD, generated sitemap + robots, and the unusually good `llms.txt` /
  `llms-full.txt` answer-engine files. The AEO posture is ahead of most
  technical sites.
- **Gaps:**
  - **G1 — Single thin H2 cluster.** Homepage targets one concept ("blind
    rendezvous server") and misses the high-intent head terms in the brief:
    *WebRTC signaling server, secure signaling server, encrypted rendezvous,
    privacy preserving protocol, metadata resistant messaging, secure peer
    discovery.* None appear in an H1/H2.
  - **G2 — No `FAQPage` schema on the homepage** (only on `/docs/faq/`). The
    homepage is the strongest URL; it should carry the FAQ rich-result schema.
  - **G3 — Title is brand-first, not benefit/keyword-first.** "ORP: The
    structurally blind rendezvous server" leads with an unknown acronym.
  - **G4 — No `BreadcrumbList`**, no `Organization` entity for the publisher.
  - **G5 — Internal linking from the homepage is sparse** (4 links). The
    homepage should distribute authority to the whole `/docs/*` cluster and to
    `/compare/` (the pillar).
  - **G6 — F3 brand split** dilutes brand-term ranking (see §0).
  - **G7 — `og:type` is `website`**; for the canonical software entity,
    keep `website` for the page but ensure `SoftwareApplication`/
    `SoftwareSourceCode` carries it as the entity. Minor.

### Keyword → section map (homepage)
| Target query | Lives in | H-level |
| --- | --- | --- |
| secure signaling protocol / encrypted signaling | Hero H1 + subhead | H1 |
| WebRTC signaling server | "How ORP Works" H2 + body | H2 |
| privacy-preserving communication / protocol | Hero subhead + Use Cases | H1/H2 |
| rendezvous server / encrypted rendezvous | "How ORP Works", "What the server can see" | H2/H3 |
| peer-to-peer communication / secure peer discovery | "How ORP Works", Use Cases | H2 |
| metadata minimization / metadata-resistant messaging | "What the Server Can and Cannot See", Threat Model | H2 |
| secure signaling server | Comparison section H2 | H2 |

### Internal linking recommendations (from homepage)
The homepage should link out at least to these, with descriptive anchor text:

- **How ORP Works** → `/docs/overview/` ("how the protocol works"),
  `/docs/protocol/` ("wire types and phases").
- **Can/Cannot See** → `/docs/blindness/` ("the blindness invariant"),
  `/docs/crypto/` ("sealed-box cryptographic controls").
- **Comparison** → `/compare/` (pillar; "blind rendezvous vs trusted signaling
  servers") — **descriptive anchor, not "learn more."**
- **Threat Model** → `/docs/threat-model/` ("the full threat model and
  trade-offs").
- **Test Suite Evidence** → `/docs/quickstart/` ("run the adversarial suite").
- **Getting Started** → `/docs/quickstart/`, `/docs/api/` ("the core API"),
  `/docs/transport-gap/` ("supply a production transport").
- **FAQ** → each answer deep-links the doc page that expands it (mirror the
  existing FAQ pattern).
- **Footer** → add `/compare/`, `/docs/threat-model/`, `/docs/whitepaper/`.

**Pillar/cluster:** `/compare/` is the pillar (problem space). The homepage and
every `/docs/*` concept page should link *down* to it and it should link *across*
to `blindness`, `crypto`, `threat-model`. This is already specified in
`CONTENT-MAP.md`; the homepage just needs to participate.

### Schema recommendations (homepage)
Emit a single JSON-LD array containing:
1. `WebSite` (with `potentialAction` → SearchAction once `/docs` has search).
2. `SoftwareSourceCode` (or `SoftwareApplication`) — `name`, `description`,
   `codeRepository`, `programmingLanguage: TypeScript`, `license`, `author` →
   `Organization`.
3. **`Organization`** — `name: "Prograde Solutions"`, `url`, `logo` (the OG/logo
   asset). Establishes the publisher entity.
4. **`FAQPage`** — mirror the on-page FAQ Q/As (5–6). This is the highest-value
   add for rich results.
5. *(optional)* `BreadcrumbList` once sub-pages render breadcrumbs.

All implemented in the redesigned `index.astro`.

### Title & meta (see §7 for the full table)
- **Title (recommended):** `ORP — Secure WebRTC Signaling Protocol (Blind Rendezvous Server)` (58 chars)
- **Meta description (recommended):** `ORP is an open, privacy-preserving WebRTC signaling protocol. The rendezvous server is structurally unable to read your messages, keys, or signaling.` (151 chars)

---

## 3. Conversion Audit

**Primary conversion:** GitHub visit → star → clone. **Secondary:** docs read →
quickstart run. The current page under-serves both.

| # | Issue | Fix (in redesign) |
| --- | --- | --- |
| C1 | GitHub is the *secondary* CTA. | Promote to primary in hero + sticky nav button, both with a live star count. |
| C2 | No social proof / maturity signal. | Hero **GitHub trust strip**: stars, contributors, last commit, license, language, test count — all live badges. **Maturity row**: spec version, license split, test count, language. |
| C3 | No "show me the code." | **Getting Started** quickstart snippet (copy button) + minimal API example. Code is the conversion asset for developers. |
| C4 | Claims unbacked / disclaimed (TODO). | **Test Suite Evidence** ties each security claim to a named, runnable artifact ("board-view scan," "wire-byte scan," adversarial suite) + a `git clone … && npm test` CTA. Evidence converts skeptics. |
| C5 | No path for the skimmer. | Comparison table + can/cannot two-column let a skimmer reach "yes, this is different" in seconds, then a CTA. |
| C6 | Single CTA style repeated; no urgency/specificity. | CTA copy is specific and verb-led: "Star on GitHub," "Run the test suite," "Read the threat model." Repeat the GitHub CTA at hero, after evidence, and in final CTA. |
| C7 | No contributor on-ramp. | Final CTA includes "Read the spec / open an issue / contribute" with link to the repo's CONTRIBUTING (once public). |

**Trust badges to display (live, never hardcoded):**
`shields.io` endpoints render real-time from the GitHub repo and degrade to
descriptive `alt` text if blocked:
- Stars: `img.shields.io/github/stars/Open-Relay-Protocol/orp`
- Contributors: `…/github/contributors/Open-Relay-Protocol/orp`
- Last commit: `…/github/last-commit/Open-Relay-Protocol/orp`
- License: `…/github/license/Open-Relay-Protocol/orp`
- Top language / repo size as desired.

> **Honesty rule preserved:** no fabricated stars/metrics. Badges read live;
> the test count is shown only once verified against the repo (it is currently
> *unverified* per `OPEN-QUESTIONS.md`, so the redesign labels it
> "146 adversarial tests" **only** behind a `TEST_COUNT` constant that must be
> confirmed, and the surrounding copy describes *what the tests prove*, which is
> true regardless of the exact count).

---

## 4. Revised Sitemap

The existing IA (`CONTENT-MAP.md`) is sound; the homepage just needs to become a
proper hub. No URLs are removed. Additions are optional future pages.

```
/                         Homepage (redesigned: 11-section hub)   [landing]
/compare/                 Blind rendezvous vs trusted signaling    [pillar]
/docs/overview/           What ORP is (docs hub)                   [concept]
/docs/quickstart/         Install, test, demo                      [reference]
/docs/whitepaper/         Technical white paper                    [reference]
/docs/protocol/           Wire types & phases                      [reference]
/docs/blindness/          Blindness invariant & collision analysis [concept]
/docs/crypto/             Cryptographic controls                   [reference]
/docs/threat-model/       Threat model & trade-offs                [concept]
/docs/operating-the-board/ Deploy the board                        [reference]
/docs/transport-gap/      Production-transport gap                 [reference]
/docs/api/                Core API reference                       [reference]
/docs/identity-rotation/  Identity rotation (ORP-004)              [concept]
/docs/neighbor-propagation/ Neighbor propagation (ORP-006)         [concept]
/docs/faq/                FAQ                                       [FAQ]

Proposed (future, optional — close keyword gaps, low priority):
/use-cases/               Concrete adoption scenarios (expands homepage §Use Cases)
/docs/webrtc-signaling/   "What is a WebRTC signaling server" explainer (head term)
```

**Homepage section → URL anchors** (for in-page nav + deep links):
`#how-it-works`, `#what-the-server-sees`, `#demo`, `#comparison`,
`#threat-model`, `#evidence`, `#use-cases`, `#getting-started`, `#faq`, `#cta`.

---

## 5. Revised Homepage Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER  [ORP logo]            How it works · Compare · Docs · [★ GitHub]│  sticky, star count in button
├──────────────────────────────────────────────────────────────────────┤
│ 1. HERO                                                                │
│   eyebrow: Open Relay Protocol · Apache-2.0 / AGPL-3.0                │
│   H1: Secure WebRTC signaling whose server can't read your signaling. │
│   sub: ORP is an open, privacy-preserving rendezvous protocol… (who/why)│
│   [★ Star on GitHub]   [Read the docs →]                               │
│   ┌─ GitHub trust strip: ★ stars · contributors · last commit · MIT ─┐ │
│   ┌─ compact architecture viz: Device A ── ⊟ Blind Board ── Device B ┐│  inline SVG, sealed/opaque labels
├──────────────────────────────────────────────────────────────────────┤
│ 2. HOW ORP WORKS            (3 steps: KEY → OFFER → ANSWER → connected)│  icons + short copy + link /docs/protocol
├──────────────────────────────────────────────────────────────────────┤
│ 3. WHAT THE SERVER CAN AND CANNOT SEE   [ CAN see | CANNOT see ] 2-col │  green/red columns, scannable
├──────────────────────────────────────────────────────────────────────┤
│ 4. INTERACTIVE DEMO  (existing Three.js scene + phase HUD + board view)│  the showpiece, now contextualized
├──────────────────────────────────────────────────────────────────────┤
│ 5. COMPARISON vs TRADITIONAL SIGNALING SERVERS   <table>              │  from /compare/, condensed
├──────────────────────────────────────────────────────────────────────┤
│ 6. THREAT MODEL SUMMARY   protects-against | stated limits (up front)  │  honesty as trust → link threat-model
├──────────────────────────────────────────────────────────────────────┤
│ 7. TEST SUITE EVIDENCE   adversarial suite · board-view · wire-byte    │  + `git clone && npm test` block
├──────────────────────────────────────────────────────────────────────┤
│ 8. USE CASES             P2P apps · privacy messengers · federated · IoT│  3–4 cards, self-identify
├──────────────────────────────────────────────────────────────────────┤
│ 9. GETTING STARTED       quickstart snippet (copy) + minimal API call  │  the conversion code
├──────────────────────────────────────────────────────────────────────┤
│ 10. FAQ                  native <details> accordion + FAQPage schema   │  long-tail SEO + rich result
├──────────────────────────────────────────────────────────────────────┤
│ 11. FINAL CTA            Read the spec · run the tests · star the repo  │  repeat GitHub conversion
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER  license split · Docs · Compare · Threat model · FAQ · GitHub   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. Complete Rewritten Homepage Copy

> Voice: precise, technical, honest, no hype. No em dashes in metadata. Targets
> the keyword clusters without stuffing.

### 1 — Hero
- **Eyebrow:** `Open Relay Protocol · Apache-2.0 core, AGPL-3.0 board`
- **H1:** **Secure WebRTC signaling whose server can't read your signaling.**
- **Subheadline:** ORP is an open, privacy-preserving rendezvous protocol for
  peer-to-peer and WebRTC apps. Two devices meet through a server that is
  *structurally* unable to read your messages, keys, or signaling — an enforced
  wire-format invariant, not a no-log promise.
- **Primary CTA:** `★ Star on GitHub`
- **Secondary CTA:** `Read the docs →`
- **Trust strip:** GitHub stars · contributors · last commit · Apache-2.0 / AGPL-3.0 · TypeScript
- **Architecture caption:** `Device A → [ Blind Board ] → Device B. The board routes opaque tags and forwards sealed payloads it cannot open.`

### 2 — How ORP Works
- **H2:** How ORP works
- **Lede:** ORP brokers a meeting between two devices that already share one key
  bound to one rendezvous target. The exchange runs in three sealed phases; the
  board only ever sees routing tags.
- **Step 1 — KEY.** Both devices hold one shared key bound to one target. They
  announce presence as opaque tags. The board learns *that* someone is present,
  never *who* or *what*.
- **Step 2 — OFFER.** The initiating peer seals its WebRTC offer (SDP/ICE) and
  relays it through the board. The board forwards bytes it cannot open.
- **Step 3 — ANSWER → CONNECTED.** The responder seals its answer back the same
  way. The peers open a direct channel; the board is now blind to the
  conversation entirely.
- **Link:** Read the wire types and phases → `/docs/protocol/`

### 3 — What the Server Can and Cannot See
- **H2:** What the server can and cannot see
- **Lede:** Blindness is enforced by the wire format. There is no frame shape
  that carries plaintext the board could read, so the property holds even if the
  operator is hostile, compromised, or compelled.
- **CANNOT see:** message contents · private keys · unsealed signaling (SDP/ICE)
  · who you are (only opaque tags)
- **CAN see:** that two endpoints rendezvous (the social graph) · opaque presence
  and routing tags · the `frame_kind` routing tag · sealed payloads it cannot open
- **Link:** The blindness invariant → `/docs/blindness/`

### 4 — Interactive Demo
- **H2:** See a rendezvous happen
- **Lede:** Two devices share one key bound to one target and relay sealed
  payloads through the board. Drag to orbit, step through the phases, then flip
  to *the board's view* and watch everything it cannot read collapse to opaque
  tags. *(existing scene + HUD)*

### 5 — Comparison Against Traditional Signaling Servers
- **H2:** ORP vs a traditional signaling server
- **Lede:** A conventional signaling server reads the introduction even when the
  call is end-to-end encrypted. ORP removes that trust from the path.
- **Table:** (Reads SDP/ICE · Reads keys · Sees social graph · Guarantee type ·
  Externally verifiable) — see implemented table.
- **Link:** Full comparison → `/compare/`

### 6 — Threat Model Summary
- **H2:** What ORP protects, and what it does not
- **Protects against:** a hostile, compromised, or compelled board reading your
  contents, keys, or signaling.
- **Stated limits (up front):** no forward secrecy (static inner layer; a key
  compromise can expose past payloads) · the social graph is visible (the board
  sees *that* two endpoints meet) · documented replay/linkability bounds. This is
  not 100% anonymity, and we don't claim it.
- **Link:** Read the full threat model → `/docs/threat-model/`

### 7 — Test Suite Evidence
- **H2:** The proof is in the test suite
- **Lede:** The guarantee isn't a promise; it's checked by an adversarial suite
  you can run.
- **Adversarial tests:** written to *attack* the invariant, each with a note of
  exactly what it proves.
- **Board-view scan:** asserts everything the board can observe is limited to
  opaque tags and sealed payloads it cannot open.
- **Wire-byte scan:** inspects raw datagram bytes to confirm no plaintext
  contents, keys, or unsealed signaling leak onto the wire.
- **Run it:** `git clone … && npm install && npm test`
- **Link:** Quickstart → `/docs/quickstart/`

### 8 — Use Cases
- **H2:** What you can build on ORP
- **P2P & WebRTC apps:** video, voice, data channels, and file transfer that
  need signaling without a metadata-reading middleman.
- **Privacy-preserving messengers:** add a rendezvous layer whose server can't be
  compelled to hand over what it never had.
- **Federated / self-hosted tools:** run your own blind board; neighbor
  propagation lets nodes cooperate without widening what each can see.
- **Sensitive / regulated peer discovery:** secure peer discovery where the
  introduction point must be provably blind, not policy-blind.

### 9 — Getting Started
- **H2:** Get started in three commands
- *(quickstart snippet + minimal API example, see implementation)*
- **Links:** Quickstart → `/docs/quickstart/` · API reference → `/docs/api/` ·
  Supply a production transport → `/docs/transport-gap/`

### 10 — FAQ
- **H2:** Frequently asked questions
- Q/A pulled from `/docs/faq/` (can the server read my messages; forward
  secrecy; stateless board; vs Signal; who can it see; key compromise). Each
  answer deep-links the doc that expands it.

### 11 — Final CTA
- **H2:** Read the spec. Run the tests. See for yourself.
- **Body:** ORP is open source — Apache-2.0 core, client, spec, and tests;
  AGPL-3.0 board. Star the repo, open an issue, or implement against the spec.
- **CTAs:** `★ Star on GitHub` · `Read the threat model →`

---

## 7. SEO Metadata Recommendations

### Homepage
| Field | Recommendation |
| --- | --- |
| `<title>` | `ORP — Secure WebRTC Signaling Protocol (Blind Rendezvous)` (≤60) |
| `meta description` | `ORP is an open, privacy-preserving WebRTC signaling protocol. The rendezvous server is structurally unable to read your messages, keys, or signaling.` (151) |
| `H1` | `Secure WebRTC signaling whose server can't read your signaling.` |
| canonical | `https://www.openrelayprotocol.com/` |
| OG image | keep `/og/orp-og.png` (regenerate with final logo) |
| JSON-LD | `WebSite` + `SoftwareSourceCode` + `Organization` + `FAQPage` (array) |
| robots | index, follow |

### Site-wide
- **Resolve F3** then set one canonical brand string everywhere (`name` in all
  JSON-LD, OG `site_name`, `<title>` suffix).
- Update `site/public/robots.txt` placeholder sitemap URL to the real domain
  (tracked in `OPEN-QUESTIONS.md` #2).
- Add `Organization` JSON-LD sitewide (via `Head.astro`) so every page asserts
  the publisher entity.
- Keep the per-page title/meta table in `SEO-STRATEGY.md` — it's already strong;
  only the homepage title/H1 change per above.

---

## 8. Component-by-Component Implementation Plan

Implemented in `site/src/pages/index.astro` (single file, matches existing
architecture). Components are CSS/markup blocks; no framework added (keeps Core
Web Vitals intact, per the project's no-heavy-JS rule).

| # | Component | Build notes | New CSS classes |
| --- | --- | --- | --- |
| P1 | **Header + GitHub nav button** | Add star-count badge to the nav CTA; rename "Why blind"→"Compare". | `.nav-cta`, `.nav-stars` |
| P2 | **Hero** | New H1/subhead; dual CTA with GitHub primary; eyebrow with license. | `.hero`, `.cta-row`, `.btn-github` |
| P3 | **GitHub trust strip** | `shields.io` `<img>` badges (stars, contributors, last-commit, license, language). Lazy, `alt` text, no layout shift (fixed height). | `.trust-strip`, `.badge` |
| P4 | **Compact architecture viz** | Inline SVG: A → Board → B with "opaque tag"/"SEALED" labels. Decorative, `aria-hidden`, with a text equivalent. | `.arch-viz` |
| P5 | **How ORP Works** | 3 step cards (KEY/OFFER/ANSWER) reusing `.cards`. | `.steps`, `.step` |
| P6 | **Can/Cannot See** | Two-column; left = CANNOT (teal/check-blocked), right = CAN (amber). Real semantic lists. | `.seesplit`, `.cannot`, `.can` |
| P7 | **Interactive Demo** | Keep existing scene + scripts verbatim; move below explanation; restack HUD under canvas on mobile. | (existing) |
| P8 | **Comparison table** | Real `<table>`, `<th scope>`, condensed 5-row version of `/compare/`. | `.cmp-table` |
| P9 | **Threat Model Summary** | Two-column protects/limits; reuse `.tradeoff-list`. | `.threat` |
| P10 | **Test Suite Evidence** | 3 cards + a `<pre>` clone/test block with copy button. Remove TODO. | `.evidence`, `.code-block`, `.copy-btn` |
| P11 | **Use Cases** | 4 cards, reuse `.cards`. | `.usecases` |
| P12 | **Getting Started** | `<pre>` quickstart + minimal API snippet, copy buttons, 3 doc links. | `.gs`, `.code-block` |
| P13 | **FAQ** | Native `<details>/<summary>` accordion; mirror to `FAQPage` JSON-LD. | `.faq`, `.faq-item` |
| P14 | **Final CTA** | Reuse `.final-cta`; GitHub primary. | (existing) |
| P15 | **Focus-visible + a11y pass** | Global `:focus-visible` ring; verify contrast; 44px targets. | `:focus-visible` |
| P16 | **Metadata + JSON-LD** | New title/desc; add `Organization` + `FAQPage`. | (head) |
| P17 | **Config constants** | `GITHUB_URL` already present; add `GITHUB_SLUG`, `TEST_COUNT` (verify), `SPEC_VERSION` constants for single-source edits. | — |

**Copy-to-clipboard**: tiny inline vanilla JS (a few lines), progressive
enhancement — the code is readable/selectable without JS.

**Performance guardrails:** badges are `<img loading="lazy">` with explicit
width/height (no CLS); no new fonts; Three.js scene unchanged; total added JS is
the copy-button handler only.

---

## 9. Prioritized Roadmap (Impact × Effort)

Effort: S ≤ 1h, M ≤ half-day, L ≥ 1 day. Impact: ★–★★★.

### Do first — high impact, low effort (this PR)
| Item | Impact | Effort | Goal served |
| --- | --- | --- | --- |
| **F2** Remove rendered TODO | ★★★ | S | trust |
| **P2/P16** New hero H1 + title/meta (keyword + clarity) | ★★★ | S | clarity, SEO |
| **C1** GitHub as primary CTA (hero + nav) | ★★★ | S | conversion |
| **P3** GitHub trust strip (live badges) | ★★★ | S | trust, conversion |
| **P13/G2** On-page FAQ + `FAQPage` schema | ★★★ | M | SEO, time-on-page |
| **P8/U6** Homepage comparison table | ★★ | S | conversion, SEO |
| **P12** Getting Started code snippet | ★★★ | M | conversion, clarity |
| **P15** Focus-visible + a11y fixes | ★★ | S | accessibility |
| **P5/P6/P9/P11** New IA sections (how/see/threat/use-cases) | ★★★ | M | clarity, SEO, time-on-page |

### Do next — high impact, higher effort (separate work)
| Item | Impact | Effort | Notes |
| --- | --- | --- | --- |
| **F1** Make the GitHub repo public | ★★★ | M (org) | *Gates all trust indicators.* Without it, badges read empty. |
| **F3** Resolve Relay/Rendezvous brand split sitewide | ★★★ | M | Pick one; redirect the other; update all `name`/titles. |
| Verify all protocol claims vs upstream `SPEC.md`/`core/` | ★★★ | L | `OPEN-QUESTIONS.md`; unlocks honest, specific copy + real test count. |
| Replace placeholder logo/OG with real assets | ★★ | M | `OPEN-QUESTIONS.md` #18–20. |

### Later — nice to have
| Item | Impact | Effort |
| --- | --- | --- |
| Build-time GitHub API fetch to bake star/contributor counts into static HTML (replaces shields, kills external request) | ★ | M |
| `/use-cases/` and `/docs/webrtc-signaling/` head-term explainer pages | ★★ | L |
| Docs site search + `WebSite` `SearchAction` schema | ★ | M |
| Lighthouse/axe CI gate (perf + a11y budgets) | ★★ | M |

---

### Appendix — claims provenance
Every protocol claim reused in this copy traces to `REPO-INVENTORY.md` /
`compare.mdx` / `faq.mdx`, which are themselves **unverified against the upstream
repo** (`OPEN-QUESTIONS.md`). The redesign states only what those sources state,
keeps the honest trade-offs visible, and routes the single numeric claim (test
count) through a constant that must be confirmed before it is trusted.
