# Discussing the draft

This repository is for protocol design and conceptual implementation review. A requirement in the draft is proposed, not a decision already accepted by the Skein organization or any external standards body.

Open an issue or pull request with:

1. The section or operation being discussed.
2. A concrete host/engine use case or counterexample.
3. The observable behavior you propose.
4. Compatibility, provenance, and retry implications where relevant.
5. A primary source for factual comparisons or prior-art claims.

Use the [review questions](docs/design-questions.md) as starting points. Small wording corrections are welcome. Avoid benchmark or novelty claims without inspectable evidence and clear limits.

The protocol is language-neutral. Keep the conceptual TypeScript section aligned with the protocol rather than turning TypeScript or a storage choice into a protocol requirement. Runtime code, SDK releases, package scaffolding, and transport bindings should follow explicit design decisions.

For changes to session semantics, update the [conformance scenarios](spec/conformance.md) and [example transcript](examples/session-evolution.json). Changes to formation, reinforcement, or temporal evolution should also align with the [memory-evolution example](examples/memory-evolution.json) and [memory-model contracts](conceptual/memory-model.ts). Changes to decay, retention, or eviction should align with the [decay/eviction cases](examples/decay-eviction.json), maintenance contracts, and corresponding conformance scenarios. Type-check changed conceptual TypeScript files. The sketches do not establish service-level conformance.

## Contribution licensing

By intentionally submitting a contribution for inclusion in this repository, you offer it under the license applicable to that material in [LICENSE.md](LICENSE.md): CC BY 4.0 for protocol/documentation prose and illustrations, or Apache-2.0 for code, configuration, and machine-readable examples. Implementation snippets embedded in documentation use Apache-2.0; Mermaid illustrations use CC BY 4.0.

Submit only material you have the right to contribute under those terms, and preserve applicable third-party notices. Contributors retain their copyright; no copyright assignment is required. This repository does not require a separate contributor license agreement or sign-off process. A separate protocol patent policy and formal governance remain open design questions.
