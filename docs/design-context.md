# Design context

The originating discussion and the proposal Page were both read before preparing this draft. This is a summary of project intent, not a transcript or evidence that a proposed mechanism works.

The guiding definition is: **Recall Delta is an evolving associative memory system: experiences form memories and connections; context activates relevant recollections; reinforcement and new experiences reshape what can be recalled over time.**

The motivating question was how an independent memory library could find relevant experiences from incomplete cues, carry activation across a task, and refine those recollections as context accumulates. No recall and an initially wrong recall were explicitly acceptable outcomes. Imperfection should have understandable causes such as cue ambiguity and interference, rather than arbitrary fabrication.

Remembering is also part of the intended system. New observations can create temporary short-term traces. An encoding/consolidation process may promote useful experiences into durable episodic, semantic, procedural, or preference memories. Both horizons participate in contextual recall; recalling a long-term memory does not turn its durable record into a temporary trace.

The later clarification makes finding and evolving memories the primary objective. The host supplies observations rather than deciding every remember/forget action. Salience can justify formation after one experience; repetition, retrieval practice, and useful outcomes can reinforce accessibility, stability, or associations. Reinforcement is not limited to confirming factual truth, and factual-confidence metadata is secondary to the purpose of recall.

Memory evolution also includes genuine changes in circumstances. Learning that a person changed jobs updates current associations while preserving earlier employment as useful history. That is distinct from correcting an originally mistaken interpretation. The draft therefore distinguishes recorded time from described validity and adds temporal versions to the conceptual implementation.

The following constraints were explicit in that discussion:

- Remain usable independently of Skein or any other agent framework.
- Separate original reports from interpretations and current activation.
- Keep activation distinct from factual credibility and uncertainty.
- Revisit recall as meaningful task context changes.
- Treat context reconstruction/compaction as an optional downstream benefit.
- Support different stores, including files, SQLite, and PostgreSQL through adapters.

The current repository makes additional **proposals**, rather than treating them as previously approved decisions: separate ingestion from advancement, reduce public changes to emerged/updated/withdrawn, use versioned atomic batches, and leave exact engine algorithms and richer lifecycle exchanges replaceable. The memory lifecycle remains the system's central vision even where the minimal core exchange leaves detailed processing receipts to future profiles.

The subsequent multi-user discussion adds a privacy requirement: one agent may serve many people while keeping user-specific memories segregated. The current proposal therefore makes trusted caller context, user-private defaults, explicit shared scopes, caller-owned sessions, and permission-preserving learning part of the design. Authorization remains deterministic even when recall is uncertain. Cross-scope federation and a portable sharing operation remain open design work.

That split keeps the protocol reviewable while preserving the original memory-engine research goal. A stateless retrieval-plus-diff implementation is an important baseline; it is not the whole intended conceptual engine. Whether persistent activation, consolidation, or controlled variability produces a useful improvement remains an empirical question.

GitHub hosting under `skein-js` follows the current request. It does not introduce a Skein runtime dependency. npm ownership, an independent organization, stewardship, and licensing remain open; the earlier Garatropic package namespace was a placeholder, not an accepted constraint.
