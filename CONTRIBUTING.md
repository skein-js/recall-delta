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

For changes to session semantics, update the [conformance scenarios](spec/conformance.md) and [example transcript](examples/session-evolution.json). Type-check the [conceptual reducer](conceptual/recall-session.ts) if it changes. It does not establish service-level conformance.

Licensing and contributor terms are still under discussion. This initial publication grants no additional license beyond the platform's terms; the original proposal's suggested licenses have not yet been adopted.
