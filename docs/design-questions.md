# Questions for protocol reviewers

All decisions below are proposals. Please identify the use case that makes a different choice preferable, or a counterexample where the draft cannot be implemented honestly.

## Core scope

1. **How much should the core own?** The draft includes observe, evidence reads, feedback, and session exchange. Would a smaller recall-only core plus admission/feedback profiles enable more existing products to participate?
2. **Does the session buy enough?** A persistent set and ordered changes can be implemented as a wrapper over stateless retrieval. Which use cases need persistent activation beyond that, and how would we measure the benefit?
3. **Is the terminology understandable?** The exchange uses candidates rather than exposing engrams. Are trace/engram concepts useful only inside engine profiles?

## Meaning and interoperability

4. **What is one candidate?** The draft gives engines ownership of identity across revisions. Can two authors apply that consistently to corrected events, semantic abstractions, merges, and splits?
5. **Which estimates are honest?** Should activation be required if many backends only return relevance? Should ordinal or named estimates replace [0, 1] numbers? How should calibration be declared?
6. **What should provenance promise?** References are required, but support versus context versus contradiction is a fallible classification. Should an extension carry claim-level spans, derivations, or evidence-availability summaries?
7. **How much negative state should be visible?** The draft folds suppression into withdrawal and names the changed scores in an update. Do hosts need a separate suppression state or contradiction relationship?

## Operational semantics

8. **Who advances a session?** Explicit host advancement avoids hidden updates and double-counting. Is an autonomous background-update profile essential for long-running agents?
9. **What must survive restart?** The draft permits advertised volatile sessions. Should durable session/receipt/history recovery become mandatory for a production profile?
10. **How should feedback be attributed?** What source identity and independence metadata are necessary to prevent confirmation loops? Can successful use ever justify factual confidence without additional evidence?
11. **What must deletion mean?** The core enforces declared policy but defers a lifecycle API. Do we need a required erase-and-status contract before calling this deployable memory infrastructure?
12. **What is actually portable?** Should the first portable artifact contain evidence and interpretations only, or also associations and session checkpoints? What losses must import explicitly report?

## Multi-user isolation

The draft now proposes user-private defaults, explicit shared scopes, and separate caller-owned sessions for each scope. These questions concern extensions to those boundaries, not permission to weaken them:

- **How should a sharing profile work?** Which authority may promote a private interpretation, and how can it preserve lineage without exposing restricted source records?
- **Should recall ever span scopes inside the engine?** The core currently lets the host combine results from separate authorized sessions. A federated profile would need rules for identity, graph traversal, mixed-source derivatives, revocation, and the audience of combined state.
- **When can learning be shared?** Private feedback and activation stay caller-specific. What explicitly shared input and policy would justify updates to group-level associations or generalized procedures?
- **What revocation contract can adapters uphold?** How are cached snapshots, derived memories, model state, background jobs, and already delivered host copies handled when source grants change?

## Adoption and evaluation

13. **Which two independent implementations should prove the contract?** A small deterministic engine and an adapter over an existing project would test different assumptions. Which project exposes enough provenance and lifecycle control?
14. **What would falsify the value proposition?** If retrieval-plus-diff gives equal task results and lower complexity, should we keep only the exchange contract and drop the cognitive architecture from the project?
15. **What licensing/governance fits?** The original proposal suggested CC BY 4.0 for the spec and Apache-2.0 for future code. This repository has not adopted those licenses or a formal patent/contributor policy; settle those before treating the draft as a released standard or reusable SDK.

The first review round should focus on definition, boundaries, event semantics, and counterexamples. Transport bindings, npm namespaces, multiple database adapters, and stochastic cognition do not need to be settled to review those ideas.
