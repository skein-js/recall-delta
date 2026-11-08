# Recall Delta

**An evolving associative memory system for agents, expressed through a framework-neutral protocol.**

Experiences form memories and connections. Current context activates relevant recollections. Reinforcement and new experiences reshape what can be recalled over time. Recall Delta Protocol defines the exchange between a host and a memory engine that supports this lifecycle.

The host supplies observations rather than deciding which individual experiences to save or discard. The engine's policies determine which traces fade, which become durable memories, how associations strengthen or weaken, and how interpretations change as circumstances evolve.

The proposed contract separates three things:

1. **Experience and evidence:** observations and the retained source record from which memories form.
2. **Associative memory:** temporary traces, durable representations, and connections that evolve through learning.
3. **Recall:** the context-dependent activation and reconstruction of relevant memories during a task.

The protocol is independent of programming language, model, agent framework, storage engine, and retrieval algorithm. It standardizes observable exchange semantics while leaving formation, activation, and consolidation algorithms replaceable. A simple retrieval-plus-diff engine remains a useful experimental baseline; it does not demonstrate the full associative-memory vision by itself.

The central design goal is **finding memories and letting memory evolve**. Recall can be absent, incomplete, or initially wrong and become more specific as useful cues accumulate. A salient experience may form a durable memory after one encounter; rehearsal, retrieval, and useful outcomes may reinforce later accessibility. New experiences can revise an interpretation or change which fact is current. An earlier memory can remain useful for historical recall even after circumstances change.

Memory also needs **decay and bounded retention**. Persistent accessibility can decline until a memory becomes dormant. Sustained dormancy, elapsed grace, low retention value, and protection/dependency checks can make it eviction-eligible. Capacity pressure or an explicit retention rule then governs eviction. Reinforcement can reverse that progression. Absence from the current task or a newer fact alone does not make a memory disposable, and eviction does not erase source evidence.

The [illustrated memory model](spec/recall-delta-protocol.md#1-definition-and-memory-model) covers formation, associative recall, reinforcement, evolution, and decay. The [retention policy](spec/recall-delta-protocol.md#12-retention-provenance-availability-and-privacy) distinguishes dormancy, consolidation, archival, eviction, and erasure, with accounting across retained storage tiers. The human analogy motivates the design; the proposal does not claim to reproduce a brain. Context compaction and credibility metadata are supporting concerns. See the [design context](docs/design-context.md).

**Private by default.** An agent serving multiple people binds memory operations to an authenticated caller and an authorized tenant/scope. Personal and shared memories have separate permissions; recall sessions and private feedback remain caller-specific even when using shared knowledge. Derived memories preserve source restrictions. See [identity and memory isolation](spec/recall-delta-protocol.md#4-actors-identity-and-boundaries).

## Part I — The protocol

Read the [Recall Delta Protocol draft](spec/recall-delta-protocol.md) first. It explains the memory lifecycle before proposing the exchange vocabulary, operation semantics, session lifecycle, delta ordering, provenance, and extension boundaries.

For example, one recall session might evolve like this:

| New context | Change reported to the host |
| --- | --- |
| “There is a stock discrepancy.” | No candidate clears the engine's relevance policy. |
| “The ERP balance did not change after dispatch.” | A previous dispatch incident emerges. |
| “This was warehouse B, not warehouse A.” | The first candidate is withdrawn; a different incident emerges. |
| A source corrects the incident explanation. | The current candidate is revised with the new evidence reference. |

These are illustrative outcomes, not prescribed rankings. Engines may recall different candidates while obeying the same exchange semantics.

- [Example session transcript](examples/session-evolution.json)
- [Memory reinforcement and changing-fact example](examples/memory-evolution.json)
- [Decay and eviction policy cases](examples/decay-eviction.json)
- [Conformance scenarios](spec/conformance.md)
- [Questions for reviewers](docs/design-questions.md)

## Part II — A conceptual TypeScript implementation

Read the [TypeScript implementation concept](docs/conceptual-typescript.md) after the protocol. It maps the lifecycle to [memory-model types](conceptual/memory-model.ts), automatic formation policies, reinforcement, versioned temporal memory, separate decay/eviction plans, and the existing [session reducer](conceptual/recall-session.ts).

The TypeScript is an explanatory sketch. There is no SDK, memory engine, service, database adapter, or production implementation in this repository.

## Why explore this?

The design hypothesis is that an evolving associative memory model, exposed through a common contract, can help agents find useful experiences as tasks unfold. Temporal memory, associative retrieval, reinforcement, and consolidation all have substantial prior work. We do not claim to have invented them, or to have established that this protocol composition is novel.

The [claim audit](docs/claim-audit.md) records what is supported, overstated, or still unproven in the originating proposal. The [related-work notes](docs/related-work.md) link the primary sources checked on 8 November 2026. There are no Recall Delta performance results yet.

## Status and feedback

Version: **0.1-draft.4**. Every protocol requirement is proposed and open to change. This is an independent proposal hosted by the Skein organization, not an adopted standard. Package names, transports, and bundle formats remain undecided.

Start with these questions:

1. Would your host benefit from a persistent recall session, or would a stateless retrieval result plus a diff suffice?
2. Are stable candidate IDs, explicit withdrawals, and resumable state sufficient for useful interoperability?
3. Which confidence and provenance fields could your implementation honestly supply?
4. Should observation/feedback be part of the core or separately negotiated profiles?

Please use [GitHub issues](https://github.com/skein-js/recall-delta/issues) or propose an edit. See [CONTRIBUTING.md](CONTRIBUTING.md) for the review format. No invitations or feedback requests are sent automatically.

## License

The protocol, documentation, and original illustrations are licensed under [CC BY 4.0](LICENSE-CC-BY). Code and machine-readable examples, including implementation snippets in the documentation, are licensed under [Apache-2.0](LICENSE-APACHE). See [LICENSE.md](LICENSE.md) for the exact scope and attribution guidance.
