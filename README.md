# Recall Delta

**A discussion draft of a protocol for evolving agent recall.**

Recall Delta Protocol defines how an agent host exchanges observations and maintains a session of evidence-linked recollections with a memory service. As context changes, the service reports which recollections appeared, changed, or were withdrawn. The host can update its working context without treating recalled content as authoritative state.

The proposed contract separates three things:

1. **Evidence:** a record of what a source reported, including provenance. Recording a statement does not establish that it is true.
2. **Memory:** interpretations derived from evidence, which may be revised or contradicted.
3. **Recall:** the candidates currently surfaced to a particular task, with separate activation, relevance, and factual-confidence estimates.

The protocol is independent of programming language, model, agent framework, storage engine, and retrieval algorithm. Deterministic retrieval is allowed. Graph activation, consolidation, and stochastic recall are optional implementation choices.

The central design goal is **human-inspired, cue-dependent remembering and recall**. Recall can be absent, incomplete, or initially wrong and then improve as a conversation supplies better evidence. Remembering matters just as much: temporary traces can become durable memories through selective encoding and consolidation. Activation persists as the task evolves; new cues can change which memories come to mind. The exchange contract represents those behaviors; Part II explores an engine that could produce them. See the [design context](docs/design-context.md).

**Private by default.** An agent serving multiple people binds memory operations to an authenticated caller and an authorized tenant/scope. Personal and shared memories have separate permissions; recall sessions and private feedback remain caller-specific even when using shared knowledge. Derived memories preserve source restrictions. See [identity and memory isolation](spec/recall-delta-protocol.md#4-actors-identity-and-boundaries).

## Part I — The protocol

Read the [Recall Delta Protocol draft](spec/recall-delta-protocol.md) first. It proposes the vocabulary, operation semantics, session lifecycle, delta ordering, provenance requirements, errors, and extension boundaries.

For example, one recall session might evolve like this:

| New context | Change reported to the host |
| --- | --- |
| “There is a stock discrepancy.” | No candidate clears the engine's relevance policy. |
| “The ERP balance did not change after dispatch.” | A previous dispatch incident emerges. |
| “This was warehouse B, not warehouse A.” | The first candidate is withdrawn; a different incident emerges. |
| A source corrects the incident explanation. | The current candidate is revised with the new evidence reference. |

These are illustrative outcomes, not prescribed rankings. Engines may recall different candidates while obeying the same exchange semantics.

- [Example session transcript](examples/session-evolution.json)
- [Conformance scenarios](spec/conformance.md)
- [Questions for reviewers](docs/design-questions.md)

## Part II — A conceptual TypeScript implementation

Read the [TypeScript implementation concept](docs/conceptual-typescript.md) after the protocol. It explains host integration, engine and storage boundaries, an illustrative deterministic scoring approach, and a small [session reducer](conceptual/recall-session.ts).

The TypeScript is an explanatory sketch. There is no SDK, memory engine, service, database adapter, or production implementation in this repository.

## Why explore this?

The design hypothesis is that a common contract for changing recollection will make memory integrations easier to inspect and replace. Evidence separation, temporal memory, associative retrieval, confidence estimates, and consolidation all have substantial prior work. We do not claim to have invented them, or to have established that this protocol composition is novel.

The [claim audit](docs/claim-audit.md) records what is supported, overstated, or still unproven in the originating proposal. The [related-work notes](docs/related-work.md) link the primary sources checked on 8 November 2026. There are no Recall Delta performance results yet.

## Status and feedback

Version: **0.1-draft.2**. Every protocol requirement is proposed and open to change. This is an independent proposal hosted by the Skein organization, not an adopted standard. Package names, transports, bundle formats, and licensing remain undecided.

Start with these questions:

1. Would your host benefit from a persistent recall session, or would a stateless retrieval result plus a diff suffice?
2. Are stable candidate IDs, explicit withdrawals, and resumable state sufficient for useful interoperability?
3. Which confidence and provenance fields could your implementation honestly supply?
4. Should observation/feedback be part of the core or separately negotiated profiles?

Please use [GitHub issues](https://github.com/skein-js/recall-delta/issues) or propose an edit. See [CONTRIBUTING.md](CONTRIBUTING.md) for the review format. No invitations or feedback requests are sent automatically.
