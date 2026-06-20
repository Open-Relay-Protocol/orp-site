# REFERENCE-OUTLINE.md

Heading tree for every reference and concept page. Each leaf is annotated
with its source: `SPEC §X`, `core/<module>`, a test file, `README`, or
`LICENSING`. Sources are as cited in the handoff brief; verify against the
real repo before publishing (see `OPEN-QUESTIONS.md`).

---

## /docs/overview/ (concept)

- H1 What ORP is
  - H2 The one-key-one-target model  :: SPEC §0/§1
  - H2 The blindness invariant in plain terms  :: SPEC §0/§1
  - H2 What the board does and does not see  :: SPEC §1, §7
  - H2 Where to go next  :: internal links

## /docs/quickstart/ (reference)

- H1 Quickstart
  - H2 Install  :: README
  - H2 Run the tests  :: README, tests/
  - H2 Run the demo (in-process)  :: README
  - H2 Run the demo against real transport  :: README
  - H2 Type-check  :: README
  - H2 Source :: README

## /docs/protocol/ (reference)

- H1 Protocol reference
  - H2 Wire frame types  :: SPEC §1, core/wire
    - H3 Presence frame  :: SPEC §1, core/schemas
    - H3 Intent frame  :: SPEC §1, core/schemas
    - H3 Match frame  :: SPEC §1, core/schemas
  - H2 The frame_kind routing tag  :: core/wire
  - H2 The KEY / offer / answer phases  :: SPEC §1, core/protocol
  - H2 JSON Schemas  :: core/schemas
  - H2 Canonical-JSON signing  :: core/canonical, core/sign
  - H2 The single stateful channel  :: SPEC §7
  - H2 Capacity  :: SPEC §8
  - H2 Source

## /docs/blindness/ (concept)

- H1 The blindness invariant and collision analysis
  - H2 What "structurally blind" means  :: SPEC §0/§1
  - H2 The collision table  :: README collision analysis
  - H2 Why one key maps to one target  :: SPEC §1
  - H2 Invariant vs policy  :: SPEC §0
  - H2 Source

## /docs/crypto/ (reference)

- H1 Cryptographic controls
  - H2 Control a: the sealed box  :: core/sealedbox
  - H2 Control b: the ICE policy  :: core/ice
  - H2 The static inner message layer  :: core/messagelayer, SPEC §9.3
  - H2 The delivery acknowledgement layer  :: core/deliverylayer, SPEC §11
  - H2 Source

## /docs/threat-model/ (concept)

- H1 Threat model
  - H2 Adversaries  :: SPEC §9
    - H3 The board adversary  :: SPEC §1, §7
    - H3 The peer adversary  :: SPEC §9
  - H2 What is protected  :: SPEC §1
  - H2 Documented limitations  :: SPEC §9
    - H3 No forward secrecy  :: SPEC §9.3
    - H3 The social graph is visible  :: SPEC §9.4
    - H3 Replay and linkability  :: SPEC §9.5
  - H2 Source

## /docs/operating-the-board/ (reference)

- H1 Operating the board
  - H2 Deployment recipe  :: README deployment recipe
  - H2 Environment variables  :: README, board/
  - H2 Autoscaling and the os.freemem() caveat  :: README
  - H2 TLS reverse proxy  :: README
  - H2 The AGPL network obligation  :: LICENSING, SPEC §13
  - H2 Source

## /docs/transport-gap/ (reference)

- H1 The production-transport gap
  - H2 What the reference ships vs what you supply  :: README, SPEC §10
  - H2 The WebSocket RendezvousBroker adapter  :: README, SPEC §10
  - H2 A real WebRTCEndpoint  :: README, SPEC §10
  - H2 Optional TURN for relay-only  :: README, core/ice
  - H2 Source

## /docs/api/ (reference)

- H1 API reference
  - H2 identity  :: core/identity
  - H2 canonical  :: core/canonical
  - H2 sign  :: core/sign
  - H2 sealedbox  :: core/sealedbox
  - H2 ice  :: core/ice
  - H2 messagelayer  :: core/messagelayer
  - H2 schemas  :: core/schemas
  - H2 wire  :: core/wire
  - H2 protocol  :: core/protocol
  - H2 deliverylayer  :: core/deliverylayer
  - H2 migration  :: core/migration
  - H2 propagation  :: core/propagation
  - H2 clock  :: core/clock
  - H2 Source

## /docs/identity-rotation/ (concept)

- H1 Identity rotation (ORP-004)
  - H2 Why rotation  :: SPEC §12
  - H2 How a rotation works  :: SPEC §12, core/identity, core/migration
  - H2 What survives a rotation  :: SPEC §12
  - H2 Constraints  :: SPEC §12
  - H2 Source

## /docs/neighbor-propagation/ (concept)

- H1 Neighbor propagation (ORP-006)
  - H2 The problem propagation solves  :: SPEC §13
  - H2 How state propagates between neighbors  :: SPEC §13, core/propagation
  - H2 Preserving blindness across nodes  :: SPEC §13
  - H2 Source

## /docs/faq/ (FAQ)

- H1 Frequently asked questions
  - H2 Can the server read my messages?  :: SPEC §1
  - H2 Does ORP have forward secrecy?  :: SPEC §9.3
  - H2 Is the board really stateless?  :: SPEC §7, §8
  - H2 How is this different from Signal's model?  :: SPEC §9
  - H2 Can the server see who I talk to?  :: SPEC §9.4
  - H2 What happens if a key is compromised?  :: SPEC §9.3
  - H2 Do I need to run TURN?  :: README, core/ice
  - H2 What do I have to build for production?  :: SPEC §10
