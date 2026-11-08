# Proposed conformance scenarios

These are reviewable behavioral scenarios for [0.1-draft.4](recall-delta-protocol.md), not an executable certification suite. Exact rankings and score values are engine-specific. A future harness should use an engine stub when testing exchange semantics so retrieval variance cannot mask a protocol failure.

| ID | Setup and action | Required observation |
| --- | --- | --- |
| C01 | Ingest the same observationId and identical fields twice | Same evidence ID; no second record |
| C02 | Reuse observationId with changed content | `id_conflict`; original evidence unchanged |
| C03 | Open a session | Version 0, open status, empty set, fixed engineProfile |
| C04 | Advance from version 0 with no eligible candidate | Version 1, empty changes; not an error |
| C05 | Eligible candidate enters the set | One emerged change with full current record and evidence reference |
| C06 | Change relevance while credibility is unchanged | Updated candidate, same ID, changed relevance, unchanged factualConfidence |
| C07 | Revise content based on new evidence | Updated same interpretation, original source unchanged, new evidence referenced |
| C08 | Remove a surfaced candidate | Withdrawn change; absent from resulting public set |
| C09 | Repeat an advance requestId after a lost response | Original committed batch, no second increment, even with stale expectedVersion |
| C10 | Reuse requestId for a different payload | `id_conflict`, no mutation |
| C11 | Two different requests race against the same session version | At most one commits; the other gets `version_conflict` |
| C12 | Receive a batch after missing an earlier batch | Client does not partially apply it; reads history/snapshot |
| C13 | Receive an already applied batch | No second mutation; conflicting retained history triggers resync |
| C14 | Request history older than retention | `resync_required`, not a silent jump |
| C15 | Read a snapshot while an advance commits | Entire old or entire new state and matching version, never a mixture |
| C16 | Invalid transition or two changes for one candidate in a batch | Client rejects whole batch without changing local state |
| C17 | Record feedback for a candidate at an unavailable historical version | `feedback_target_unavailable`; no guessed target |
| C18 | Repeat feedback or merely recall a candidate | No new independent factual support |
| C19 | Record an attribution-bearing correction | Receipt says recorded; later explicit advance communicates any resulting revision |
| C20 | Close a session | Next version, closed batch with empty changes; historical set retained but removed from host active use |
| C21 | Advance an expired or closed session | Terminal error; no new recall |
| C22 | Resolve inaccessible/deleted evidence | Explicit unavailability; no invented original content |
| C23 | Attempt a cross-scope evidence, memory, session, or graph reference | No unauthorized access or existence disclosure, including via error details and retry receipts |
| C24 | Erasure/authorization change races with recall | No newly served erased/unauthorized payload, including from derived caches |
| C25 | Crash between staging a snapshot and committing its batch/receipt | Recovery never exposes partial successful state; durability matches describe |
| C26 | Acknowledge state in an explicitly volatile service, then restart | Host receives session_unavailable if lost; service never advertised durable restoration |
| C27 | Reorder object members without changing JSON values | Observation/request identity and candidate comparison do not change |
| C28 | Submit unknown estimates | Null retained as unknown; not converted into a probability of zero |
| C29 | Emit above maximum safe integer version | Operation rejected/new session required; no wraparound |
| C30 | Receive bounded history pages | Each page contiguous through its stated throughVersion; next page continues from there |
| C31 | Put another user's identity, tenant, or role in observation text or tool arguments | Trusted caller context is unchanged; no additional memory access |
| C32 | Omit a trusted scope/caller binding | Operation denied; no fallback to shared memory |
| C33 | Alice and Bob use the same agentId in one tenant | Their user-private records, activation, personalization, and receipts remain isolated |
| C34 | Bob guesses Alice's sessionId for a group-shared scope both may read | Session/snapshot/delta/feedback access denied without revealing Alice's state |
| C35 | A reader without shared-write permission submits an observation to a shared scope | Admission denied; reading shared knowledge did not grant mutation rights |
| C36 | Consolidate restricted evidence into a generic-sounding summary, procedure, embedding, or association | Derivative audience does not broaden; source dependencies remain attributable |
| C37 | A graph edge, ranking feature, or competing-candidate explanation references another user's private memory | Unauthorized state excluded before recall; no disclosure through score, explanation, or source metadata |
| C38 | Alice confirms a shared candidate during a private session | Her recorded feedback/personalization stays private; no automatic change to shared confidence or Bob's association weights |
| C39 | A background job or cached receipt survives membership/source-access revocation | Current policy blocks affected output/commit; stale grants and derived state cannot override revocation |
| C40 | Combine private-scope and team-scope sessions whose candidate IDs collide | Host preserves scoped identities and keeps the mixed working context caller-private |
| C41 | Attempt implicit promotion or a cross-scope source reference during consolidation | Rejected; a broader audience requires an explicit authorized sharing contract |
| C42 | A conversation has several authorized participants | Each opens its own caller-owned recall session; conversation membership does not expose another participant's private scope/session |

## Reference memory-model scenarios

These test the broader associative-memory vision under a declared reference-engine policy. They do not imply that the minimal core exchange prescribes one formation or reinforcement algorithm.

| ID | Setup and action | Required observation under the stated policy |
| --- | --- | --- |
| M01 | Supply a single salient experience to a policy configured for immediate admission | Durable memory can form without a second exposure or a manual remember command |
| M02 | Supply progressively distinguishing person/topic/time cues | An engine can narrow or replace competing recollections while keeping session activation separate from durable memory |
| M03 | Retry a retrieval or learning event within the declared replay window after a lost response | Its activation/reinforcement effects are applied at most once per logical event |
| M04 | Retrieve/rehearse a memory under an accessibility-reinforcement policy | Accessibility or selected caller-local pathways may strengthen without an increase in factual confidence |
| M05 | Allow an unselected trace to expire or leave active context | Trace accessibility can disappear while evidence remains retained under policy and older engrams remain recallable |
| M06 | Learn in June that employment changes in July | Recorded time and valid time differ; the older state becomes historical in July without being marked as an original error |
| M07 | Recall employment in March versus August, using current recorded knowledge | Earlier and later states can be selected respectively; old superseded revisions are not all treated as current |
| M08 | Ask what was known before the June update | Version selection respects the recorded-time cutoff before testing validity |
| M09 | Revise a candidate's known validity interval | The complete candidate update preserves temporal metadata and prior snapshots |
| M10 | Learn a change with no known effective date | The engine preserves unknown temporal bounds rather than inventing a date |

## Decay and retention scenarios

These apply to an implementation advertising the bounded-retention behavior in section 12, under its declared policy. They add no universal decay curve, numeric cutoff, or core maintenance operation. Core authorization, erasure, retry, and session guarantees continue to apply.

| ID | Setup and action | Required observation under the stated policy |
| --- | --- | --- |
| D01 | An unrelated task gives an engram zero session activation | No persistent decay or eviction eligibility is inferred from that score alone |
| D02 | Accessibility falls below the dormancy threshold but grace has not elapsed | Memory remains dormant and retained; relevant cues can still recall it |
| D03 | Grace elapses without qualifying reinforcement, with low value and no protections/dependency blockers | Memory becomes provisionally eligible; no eviction without a capacity or retention trigger |
| D04 | A qualifying reinforcement event occurs before eviction commits | Stale plan cannot commit; eligibility is cancelled and grace restarted or accessible status restored; replay does not refresh time twice |
| D05 | A memory is old, superseded, uniquely useful for history, or has unknown retention value | Age/supersession alone is insufficient; high or unknown value blocks decay-based eligibility |
| D06 | An eligible item is pinned or still supports a dependency that cannot safely be reconciled | Eviction blocked; maintenance cannot silently break the protection/dependency |
| D07 | Capacity pressure occurs with several eligible memories | Selection considers marginal retention value against net reclaimable bytes; zero-reclaim removals are not counted as capacity relief |
| D08 | Evict a representation with graph edges, derived indexes, cached payloads, or dependent interpretations | References are reconciled before reuse; no reachable dangling/invalid reconstruction; actual retained copies still count |
| D09 | Move an engram to an archive or retain its payload in history | Total retained-byte accounting does not claim those bytes were reclaimed; evidence, overlays, receipts, markers, and cleanup work remain counted |
| D10 | No safe eligible set reaches the maintenance target | Honest capacity exhaustion/backpressure/admission limits; no forced removal of protected items or promised retry state |
| D11 | Unchanged evidence is encountered by background processing after eviction | No immediate automatic recreation loop; declared re-encoding triggers and bounded marker retention apply |
| D12 | Evict a memory used by an existing recall session | Committed set does not silently change; a later advance communicates any affected update/withdrawal; ordinary eviction does not retroactively revoke authorized history |
| D13 | Alice's private reinforcement/decay differs from Bob's for a shared engram | Private overlay changes do not mutate shared retention state or authorize shared-base eviction |
| D14 | A sweep is retried, delayed, restarted, or races a protection/policy change | Elapsed decay is checkpointed once, unknown dormancy starts conservatively, and stale policy/store views cannot commit eviction |
| D15 | Erasure or revocation applies to an otherwise protected or active memory | Policy removal is enforced independently of decay/grace; affected output cannot be recovered from indexes, receipts, or historical snapshots |

The [session transcript](../examples/session-evolution.json) illustrates emerged, updated, withdrawn, unchanged, and closed states. The [memory-evolution example](../examples/memory-evolution.json) illustrates versions, temporal queries, and reinforcement; the [decay/eviction cases](../examples/decay-eviction.json) illustrate retention decisions and accounting. The [session reducer](../conceptual/recall-session.ts) covers only a subset of client-side scenarios, while the [memory-model contracts](../conceptual/memory-model.ts) are types with no policy implementation. No evidence-ingestion, authorization, durability, maintenance execution, or full memory-engine conformance is established by those sketches.
