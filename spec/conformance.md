# Proposed conformance scenarios

These are reviewable behavioral scenarios for [0.1-draft.1](recall-delta-protocol.md), not an executable certification suite. Exact rankings and score values are engine-specific. A future harness should use an engine stub when testing exchange semantics so retrieval variance cannot mask a protocol failure.

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

The [worked transcript](../examples/session-evolution.json) illustrates emerged, updated, withdrawn, unchanged, and closed states. The [TypeScript sketch](../conceptual/recall-session.ts) covers only a subset of client-side scenarios. No evidence-ingestion, authorization, durability, or real engine conformance is established by that sketch.
