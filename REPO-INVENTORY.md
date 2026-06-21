# REPO-INVENTORY.md

> **Sourcing note (read first).** The upstream protocol source repo
> (`SPEC.md`, `core/`, `board/`, `client/`, `tests/`, `README.md`,
> `LICENSING.md`) was **not present** in this `orp-site` workspace when the
> site was built. This repository contained only a stub `README.md`. Every
> claim below is therefore sourced from the build handoff brief, which
> summarizes the protocol, rather than verified line by line against
> `SPEC.md` and the `core/` exports. Items that the brief does not fully
> pin down (exact function signatures, exact env var names, exact spec
> section numbers) are marked `TODO: confirm against SPEC §X` and tracked in
> `OPEN-QUESTIONS.md`. Before publishing, reconcile this file against the
> real spec and code.

---

## Canonical definition

ORP (Open Relay Protocol) is a device-first messaging protocol whose
rendezvous server is structurally unable to read message contents, keys, or
unsealed signaling. The server brokers a meeting between two devices that
already share one key bound to one target, and that structural blindness is
an enforced invariant of the wire format, not a logging policy the operator
promises to follow.

One-line form for reuse: *The rendezvous server is structurally blind. An
enforced invariant, not a logging policy.*

---

## The blindness invariant (SPEC §0 / §1)

The board (the rendezvous server) never receives readable message contents,
private keys, or unsealed signaling. What flows across it is reduced to
opaque presence and routing tags plus sealed payloads it cannot open. The
invariant is enforced by the wire types: there is no frame shape that
carries plaintext the board could read, so blindness does not depend on the
operator choosing not to log.

The model is **one key, one target**: a shared key is bound to a single
rendezvous target, so possessing a key lets two parties meet at exactly one
point and nothing wider.

`TODO: confirm exact §0/§1 wording and the precise list of what the board
does and does not observe against SPEC.`

---

## Wire types and phases

**Wire frame types**

| Frame | Role |
| --- | --- |
| Presence frame | Announces that a party is present at a rendezvous target, as an opaque tag. |
| Intent frame | Signals intent to connect for a matched target. |
| Match frame | Carries the matched-pair signaling exchange across the board. |

A `frame_kind` routing tag distinguishes frame types on the single stateful
channel so the board can route without reading payloads.

**Connection phases**

1. **KEY** phase: establish/confirm the shared key bound to the target.
2. **Offer** phase: the initiating peer's sealed offer.
3. **Answer** phase: the responding peer's sealed answer.

The offer/answer payloads are WebRTC signaling (SDP/ICE) sealed so the board
forwards without reading them.

`TODO: confirm exact frame names, field sets, and the KEY/offer/answer state
machine against SPEC §1 wire types and the schemas in core/schemas.`

---

## ORP-00x design decisions

| ID | Title | One-line summary |
| --- | --- | --- |
| ORP-004 | Identity rotation | Devices can rotate identity keys without breaking existing rendezvous bindings; covered in SPEC §12. |
| ORP-006 | Neighbor propagation | Defines how presence/routing state propagates between neighboring board nodes; covered in SPEC §13. |

`TODO: confirm the full ORP-00x list (001-003, 005, and any beyond 006) and
each decision's exact scope against SPEC.`

---

## Public API surface per `core/` module

Captured from the module list in the handoff. **Exact exported type and
function signatures were not available** (no `core/` source in this
workspace), so each entry states the module's responsibility; signatures are
marked TODO and tracked in `OPEN-QUESTIONS.md`.

| Module | Responsibility |
| --- | --- |
| `identity` | Device identity keypairs and identity rotation primitives (ORP-004). |
| `canonical` | Canonical JSON serialization used as the signing/sealing input. |
| `sign` | Detached signatures over canonical JSON. |
| `sealedbox` | Sealed-box encryption (control a): payloads the board cannot open. |
| `ice` | ICE candidate handling and the ICE transport policy (control b). |
| `messagelayer` | The static inner message layer carried inside the sealed channel. |
| `schemas` | JSON Schemas for the wire frames and message payloads. |
| `wire` | Wire frame encode/decode, including the `frame_kind` routing tag. |
| `protocol` | The KEY/offer/answer state machine and rendezvous orchestration. |
| `deliverylayer` | Delivery acknowledgement layer (SPEC §11). |
| `migration` | Identity/state migration support (relates to ORP-004 rotation). |
| `propagation` | Neighbor propagation between board nodes (ORP-006, SPEC §13). |
| `clock` | Time source / clock abstraction used for ordering and expiry. |

`TODO: capture exported symbols and signatures for every module above from
core/<module>.ts and link each to its GitHub source line.`

---

## License terms per component

A split license, per `LICENSING.md` as summarized in the handoff:

| Component | License | Rationale |
| --- | --- | --- |
| `core/` | Apache-2.0 | Permissive so the protocol and reference primitives can be embedded anywhere. |
| `client/` | Apache-2.0 | Reference client, permissive for adoption. |
| `SPEC.md` | Apache-2.0 | The specification is freely implementable. |
| `tests/` | Apache-2.0 | The adversarial test suite is reusable as conformance evidence. |
| `board/` | AGPL-3.0 | The rendezvous server is copyleft so network operators must share modifications (the SPEC §13 / AGPL §13 network obligation). |

`TODO: confirm exact license versions (Apache-2.0, AGPL-3.0) and the precise
boundary of which files fall under each against LICENSING.md.`

---

## Quickstart commands (from README, to confirm)

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies. |
| `npm test` | Run the adversarial test suite (the handoff cites 146 tests). |
| `npm run demo` | Run the in-process demo. |
| `npm run demo:real` | Run the demo against real transport adapters. |
| `npm run typecheck` | Type-check the project. |

`TODO: confirm exact script names and the test count against README and
package.json.`

---

## Proof artifacts cited

- **146 adversarial tests** with a per-test "what each proves" table.
- A **board-view scan**: asserts what the board can observe is limited to
  opaque tags and sealed payloads.
- A **dgram wire-byte scan**: inspects raw datagram bytes to confirm no
  plaintext leaks onto the wire.

`TODO: confirm the test count, the names of the two scans, and their
locations under tests/ against the repo.`

---

## Documented limitations (stated trade-offs)

| Limitation | Section | Accepted trade-off |
| --- | --- | --- |
| No forward secrecy | SPEC §9.3 | Static inner message layer keeps the model simple; a key compromise exposes past sealed payloads. |
| Social graph visible | SPEC §9.4 | The board sees that two endpoints meet (the graph of who rendezvouses with whom), even though it cannot read what they exchange. |
| Replay / linkability | SPEC §9.5 | Presence tags can be linkable/replayable within the documented bounds; mitigations are scoped, not absolute. |

`TODO: confirm §9.3 / §9.4 / §9.5 numbering and the exact trade-off wording
against SPEC §9.`
