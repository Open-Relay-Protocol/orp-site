# CONTENT-MAP.md

Full sitemap for the ORP marketing + docs site. Reference pages mirror the
spec sections. Landing and comparison are the marketing/SEO surface. All
docs URLs sit under `/docs/` to keep them separate from the landing at `/`.

| URL | Page title (H1) | Target query / intent | Page type |
| --- | --- | --- | --- |
| `/` | The rendezvous server is structurally blind | "blind rendezvous server", brand + problem framing | landing |
| `/compare/` | Blind rendezvous vs trusted signaling servers | "metadata-free webrtc signaling", "p2p messaging without a trusted server" | comparison |
| `/docs/overview/` | What ORP is | "what is open rendezvous protocol", "structurally blind server" | concept |
| `/docs/quickstart/` | Quickstart | "orp install", "run orp demo" | reference |
| `/docs/protocol/` | Protocol reference | "orp wire types", "rendezvous protocol frames" | reference |
| `/docs/blindness/` | The blindness invariant and collision analysis | "blind broker collision", "structural blindness messaging" | concept |
| `/docs/crypto/` | Cryptographic controls | "sealed box signaling", "webrtc sdp end-to-end encryption relay" | reference |
| `/docs/threat-model/` | Threat model | "messaging threat model board adversary", "what metadata does a signaling server see" | concept |
| `/docs/operating-the-board/` | Operating the board | "deploy rendezvous server", "no-log signaling broker deployment" | reference |
| `/docs/transport-gap/` | The production-transport gap | "webrtc rendezvousbroker adapter", "production webrtc signaling transport" | reference |
| `/docs/api/` | API reference | "orp core api", "rendezvous protocol library api" | reference |
| `/docs/identity-rotation/` | Identity rotation (ORP-004) | "rotate device identity messaging", "key rotation rendezvous" | concept |
| `/docs/neighbor-propagation/` | Neighbor propagation (ORP-006) | "rendezvous neighbor propagation", "federated signaling nodes" | concept |
| `/docs/faq/` | Frequently asked questions | "can the server read my messages", "does orp have forward secrecy" | FAQ |

## Internal linking plan

- Landing links to: `/docs/overview/`, `/compare/`, `GITHUB_URL`, and
  `/docs/threat-model/` (trade-offs).
- `/compare/` (pillar page) links to `/docs/blindness/`, `/docs/threat-model/`,
  `/docs/crypto/`.
- Every reference page links to the next logical page and back to
  `/docs/overview/`, and ends with a Source note.
- FAQ answers link to the reference page that expands each answer.
- `/docs/overview/` is the docs hub and links to every section.

## Grouping (sidebar)

1. **Start here**: Overview, Quickstart.
2. **Protocol**: Protocol reference, Blindness invariant, Cryptographic
   controls.
3. **Security**: Threat model.
4. **Operations**: Operating the board, Production-transport gap.
5. **Reference**: API reference.
6. **Concepts**: Identity rotation, Neighbor propagation.
7. **Help**: FAQ.
