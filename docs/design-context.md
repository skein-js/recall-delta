# Design context

The originating discussion and the proposal Page were both read before preparing this draft. This is a summary of project intent, not a transcript or evidence that a proposed mechanism works.

The motivating question was how an independent memory library could form plausible recollections from incomplete cues, carry activation across a task, and improve or correct those recollections as context accumulates. No recall and an initially wrong recall were explicitly acceptable outcomes. Imperfection should have understandable causes such as cue ambiguity and interference, rather than arbitrary fabrication.

Remembering is also part of the intended system. New observations can create temporary short-term traces. An encoding/consolidation process may promote useful experiences into durable episodic, semantic, procedural, or preference memories. Both horizons participate in contextual recall; recalling a long-term memory does not turn its durable record into a temporary trace.

The following constraints were explicit in that discussion:

- Remain usable independently of Skein or any other agent framework.
- Separate original reports from interpretations and current activation.
- Keep activation distinct from factual credibility and uncertainty.
- Revisit recall as meaningful task context changes.
- Treat context reconstruction/compaction as an optional downstream benefit.
- Support different stores, including files, SQLite, and PostgreSQL through adapters.

The current repository makes additional **proposals**, rather than treating them as previously approved decisions: separate ingestion from advancement, reduce public changes to emerged/updated/withdrawn, use versioned atomic batches, and put engine algorithms into optional profiles.

That split keeps the protocol reviewable while preserving the original memory-engine research goal. A stateless retrieval-plus-diff implementation is an important baseline; it is not the whole intended conceptual engine. Whether persistent activation, consolidation, or controlled variability produces a useful improvement remains an empirical question.

GitHub hosting under `skein-js` follows the current request. It does not introduce a Skein runtime dependency. npm ownership, an independent organization, stewardship, and licensing remain open; the earlier Garatropic package namespace was a placeholder, not an accepted constraint.
