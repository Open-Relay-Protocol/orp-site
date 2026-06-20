# SEO-STRATEGY.md

ORP is a zero-demand technical project: nobody is searching the product
name yet. The strategy is therefore problem-space SEO plus answer-engine
optimization (AEO/GEO), not keyword-volume chasing. We rank for the problem
("metadata exposure at the signaling server") and we make the site trivially
ingestible by LLM answer engines.

## Target long-tail queries (problem-space)

Validated by intent, not stuffed. Primary cluster:

- metadata-free webrtc signaling
- blind rendezvous server
- no-log signaling broker
- verifiable private messaging infrastructure
- p2p messaging without a trusted server
- webrtc sdp end-to-end encryption relay

Secondary cluster:

- what metadata does a signaling server see
- can a signaling server read my messages
- webrtc signaling privacy
- structurally blind messaging server
- rotate device identity messaging

Each query maps to a page in `CONTENT-MAP.md`. The comparison/problem page
(`/compare/`) is the pillar; the reference cluster supports it.

## AEO / GEO plan

- **`/llms.txt`** at site root: a concise index of every page with a
  one-line summary and absolute link, so answer engines can crawl the map.
- **`/llms-full.txt`** at site root: the full reference text concatenated,
  so an LLM can ingest the whole protocol in one fetch. Kept in sync with
  the MDX sources.
- **Definitional first sentence** on every concept and FAQ page. Answer
  engines lift the lead sentence; we make it a clean, liftable definition
  (for example: "ORP is a device-first messaging protocol whose rendezvous
  server is structurally unable to read message contents, keys, or unsealed
  signaling.").
- **Question-shaped headings** on the FAQ so they match spoken/typed
  questions and feed `FAQPage` structured data.

## Per-page title and meta description table

Titles target ~50-60 chars, descriptions ~150-160 chars. No em dashes.

| URL | `<title>` | Meta description |
| --- | --- | --- |
| `/` | ORP: The structurally blind rendezvous server | ORP is a device-first messaging protocol whose rendezvous server cannot read contents, keys, or signaling. An enforced invariant, not a logging policy. |
| `/compare/` | Blind rendezvous vs trusted signaling servers | Why a conventional signaling server still sees your metadata, and how a structurally blind rendezvous broker removes that trust from the path. |
| `/docs/overview/` | What ORP is: a blind rendezvous protocol | ORP brokers a meeting between two devices that share one key bound to one target, while the server stays structurally unable to read what they exchange. |
| `/docs/quickstart/` | ORP quickstart: install, test, demo | Install ORP, run the 146-test adversarial suite, and start the in-process and real-transport demos in a few commands. |
| `/docs/protocol/` | ORP protocol reference: wire types and phases | The presence, intent, and match frames, the frame_kind routing tag, the KEY/offer/answer phases, JSON Schemas, and canonical-JSON signing. |
| `/docs/blindness/` | The blindness invariant and collision analysis | How ORP's wire format makes the rendezvous server structurally blind, plus the collision analysis behind the one-key-one-target model. |
| `/docs/crypto/` | ORP cryptographic controls: sealed box and ICE | The sealed-box control, the ICE transport policy, the static inner message layer, and the delivery acknowledgement layer that keep the board blind. |
| `/docs/threat-model/` | ORP threat model: board and peer adversaries | What ORP protects against a board adversary and a peer, plus the stated limits: no forward secrecy, a visible social graph, and replay bounds. |
| `/docs/operating-the-board/` | Operating the ORP board: deployment guide | Deploy the rendezvous board: environment variables, autoscaling, the freemem caveat, a TLS reverse proxy, and the AGPL network obligation. |
| `/docs/transport-gap/` | ORP production-transport gap: what to supply | Production deployers must supply a WebSocket RendezvousBroker adapter, a real WebRTCEndpoint, and optionally TURN for relay-only operation. |
| `/docs/api/` | ORP API reference: the core modules | The public surface of the ORP core modules: identity, wire, protocol, sealedbox, schemas, delivery layer, propagation, and more. |
| `/docs/identity-rotation/` | Identity rotation in ORP (ORP-004) | How devices rotate identity keys without breaking existing rendezvous bindings, the migration path, and the constraints behind the design. |
| `/docs/neighbor-propagation/` | Neighbor propagation in ORP (ORP-006) | How presence and routing state propagate between neighboring board nodes while preserving the blindness invariant. |
| `/docs/faq/` | ORP FAQ: blindness, forward secrecy, trade-offs | Straight answers: can the server read my messages, does ORP have forward secrecy, is the board really stateless, how does this differ from Signal. |

## JSON-LD per page

| Page | Schema.org type |
| --- | --- |
| `/` | `SoftwareSourceCode` (with `codeRepository` = GITHUB_URL) plus `WebSite` |
| `/compare/` | `TechArticle` |
| All `/docs/*` reference and concept pages | `TechArticle` |
| `/docs/faq/` | `FAQPage` (each Q/A as a `Question` / `Answer`) |

All JSON-LD is validated against schema.org shapes before ship.

## We are NOT doing

- No keyword stuffing or repeated exact-match phrases.
- No vanity/doorway pages for the product name ("open rendezvous protocol"
  landing variants).
- No thin blog filler to chase search volume.
- No fabricated testimonials, metrics, or social proof.
- No tracking scripts or heavy client JS that hurt Core Web Vitals.
- No overstated claims ("unbreakable", "100% anonymous"): the social graph
  is visible and we say so.
