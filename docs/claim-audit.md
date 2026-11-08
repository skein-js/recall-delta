# Audit of the originating Recall Delta proposal

Audited **8 November 2026**. Scope: all 319 blocks of the originating **Draft proposal 0.1**, including its data contracts, storage design, comparative tables, roadmap, and references. The [source Page](https://chatgpt.com/space/page_04ca5291a3208191931d2a3bc7c57ddb) has separate access controls. This repository develops a revised discussion draft; it does not silently edit that Page.

## Overall assessment

The proposal is worth discussing as an interoperability contract for evolving recall. Its clearest contribution could be a host-visible session that reports emerging, revised, and withdrawn candidates with evidence and separate confidence dimensions. This is a design opportunity, not an established novelty or performance result.

The original is more an architecture proposal than a protocol specification. It names useful operations but leaves the behavior between independent implementations underspecified. The revised Part I makes concrete proposals for those semantics; they still need external review and independent implementations.

The originating session was also inspected and matched to the exact Page creation/update calls. It confirms that fallible, cue-dependent recall and remembering across short/long horizons are intentional research goals, and compaction is secondary. Keeping these out of mandatory core algorithms is an audit recommendation, not a claim that the user never requested them. See the [design-context summary](design-context.md).

## Claim ledger

| Original claim or implication | Assessment | Reason / required qualification |
| --- | --- | --- |
| Most memory systems are essentially stateless nearest-item lookup | Overgeneralized | The cited ecosystem already includes temporal graphs, stateful memory, consolidation, and evolving interpretations. No market survey supports “most.” |
| Spreading activation, inhibition, decay, and episodic/semantic consolidation have prior work | Supported at the cited mechanism level | Synapse, HeLa-Mem, and HippoRAG 2 are relevant primary references; their results are not results for Recall Delta. |
| Evidence should be separate from learned interpretations | Sound design principle, not exclusive novelty | Graphiti preserves episode provenance; PROJECTMEM uses event history and projections; Hindsight distinguishes memory categories and evolving observations. |
| Recall sessions and deltas are the distinctive combination | Plausible design focus; uniqueness unestablished | Existing systems already have sessions, versions, and changing memory. The value and distinctiveness of this particular contract remain hypotheses. |
| LangMem is contrasted with a storage-neutral Recall Delta | Misleading distinction | LangMem explicitly documents functional primitives and a core memory API that work with any storage system. It also has native LangGraph integration. |
| M2MP is an existing bridge opportunity | Conceptually related; implementation maturity unverified | Its site describes associative-memory transfer but says the specification, implementation, and benchmarks are coming soon. A concrete compatible bridge cannot yet be asserted from that material. |
| Incorrect recall is a valid outcome | Reasonable failure model | A protocol can represent errors and uncertainty without requiring deliberate factual errors. |
| Controlled fallibility is an advantage over other systems | Unproven | The draft has no ablation showing that induced misses or mistakes improve host outcomes. Keep optional stochastic research separate from baseline correctness. |
| Activation is distinct from truth | Strong conceptual distinction | High retrieval salience does not certify content. Numeric factual-confidence estimates need defined meaning and calibration limits. |
| All source evidence is immutable/recoverable | Conditional | Retention, deletion, permissions, external source loss, and provenance availability must be explicit. An immutable record can faithfully preserve a false source statement. |
| Repeated retrieval must not reinforce truth confidence | Useful rule, underspecified enforcement | Accessibility changes may create more future exposure; source independence, replayed feedback, and “successful use” need separate treatment. |
| One recall mechanism covers short and long horizons | Feasible architecture, not protocol necessity | Types/dynamics are not shown to require one algorithm. A wire contract can unify outputs while allowing different internal mechanisms. |
| Engrams are distributed memory representations | Descriptive aspiration | The reference Engram interface is a record with content and references; it does not establish a distributed representation or cognitive fidelity. |
| Portable records enable portable memory | Partially true | Data can move; equal behavior does not follow. Engine versions, scoring, embeddings, time, and admission decisions can change results. |
| Operation logs allow replay with a different algorithm | Qualified | Replaying recorded weight mutations reproduces those mutations, not the counterfactual decisions a different algorithm would have made. Raw observations and the complete decision context would also be needed. |
| Indexes are disposable | Conditional design invariant | They are disposable only if all semantically necessary records/features survive elsewhere. Rebuilding requires pinned models/configuration to reproduce behavior. |
| Context reconstruction reduces compaction dependence or cost | Plausible but unmeasured | Compare task results, cost, and latency at equal budgets against strong summary and retrieval baselines. |
| A deterministic boundary makes operational use safe | Necessary boundary, insufficient guarantee | The host must actually verify evidence and authoritative state. Adding evidenceIds or a verification flag does not enforce correct agent behavior. |
| A deterministic seed makes stochastic failures reproducible | Incomplete | Also pin model outputs, search/index state, versions, timestamps, order, and execution behavior; some systems remain nondeterministic. |
| Adapter capabilities can make all backends interchangeable | Conditional | Unsupported transactions and unsafe concurrency cannot be papered over with a capability flag when the operation promises atomicity. |
| Recall Delta has no obvious naming conflict | Limited negative search, not clearance | A limited exact-name web search found no clear AI-memory match; it cannot establish exclusivity, registry availability, or legal rights. |

## Material gaps in the original protocol sketch

### 1. Session and delta delivery have no shared state machine — high impact

The original `RecallDelta` has optional previous/current values but no session ID, sequence/version, candidate identity independent of an engram, cursor, replay rule, or transition validity. Two hosts could interpret suppression, weakening, and withdrawal differently. A missed withdrawal could leave a stale recollection active indefinitely.

**Proposed direction:** a minimal emerged/updated/withdrawn vocabulary, stable candidate IDs, atomic versioned batches, complete snapshots, retry windows, terminal states, and explicit resynchronization. The expanded states and reason codes can be discussed as extensions.

### 2. Observe and recall can both advance the same session — high impact

The original recommends that observe advances active sessions and recall starts or advances sessions. There is no rule preventing the same observation from being counted twice, or deciding whether background consolidation changes already emitted state.

**Proposed direction:** ingest evidence separately from explicit session advancement. Make autonomous updates a future profile. Version conflicts and idempotence must be part of the observable contract.

### 3. Evidence/tenant semantics cannot wait until a later infrastructure phase — high impact

The reference records have no scope, revision, unavailable-source status, or feedback attribution contract. The roadmap defers multi-tenant deployment, but any service supporting more than one authorized memory boundary needs isolation from its first exposed operation. Corrections and erasure also affect derived memories, sessions, caches, and receipts.

**Proposed direction:** allow a simple single scope while making authorization, evidence availability, and declared retention mandatory. Treat erasure completion as a separately specified lifecycle operation rather than equating it with decay or suppression.

### 4. Confidence fields have names but no interoperable meaning — medium impact

The original does not define ranges, unknown values, calibration, or what `confidenceDelta` measures when activation, relevance, and factual confidence differ. A score of 0.9 from two engines need not represent the same thing. Global “successful use” feedback cannot establish every recalled factual detail.

**Proposed direction:** named independent estimates, explicit nulls, engine-profile identity, no assumed cross-engine calibration, and attributable feedback. The draft uses complete updated records instead of an ambiguous scalar confidenceDelta.

### 5. The illustrative recurrence does not establish the claimed decay — medium impact

In the original equation, zero cues/associations/baseline/noise still produce `sigma(-delta × activation)`. With a logistic sigmoid and zero activation this is 0.5, so activation does not decay toward zero by default. Timestep units, normalization, recurrent retention, stability bounds, and emission thresholds are unspecified. Bounded noise alone does not bound semantic fabrication.

**Proposed direction:** keep the algorithm informative. Specify an actual retention term and no-input behavior for an experimental engine, then measure it. Protocol conformance should not require this equation or noise.

### 6. The phase-one surface is too large for a semantics experiment — medium impact

The original first phase includes a log, traces, engrams, associations, sessions, deltas, three adapters, bundles, scoring, and an SDK. The portable format appears again in a later phase. Implementing all of that would encode many unsettled decisions before proving the interface.

**Proposed direction:** review the protocol, run small session/conformance experiments, and test one host with two engines. Follow with bindings, bundles, adapters, and SDKs only where the experiment justifies them.

## Source verification

The six research/protocol-paper URLs in the comparative tables resolve to matching titles: Synapse, HeLa-Mem, HippoRAG 2, Hindsight, Executable Agentic Memory, and PROJECTMEM. Their abstracts support the broad descriptions used here. This audit checked primary landing pages/abstracts and project documentation; it did not reproduce experiments, exhaustively inspect codebases, or verify every statement within the papers.

The strongest corrections to the comparison are supported directly by [LangMem's storage-independent API description](https://langchain-ai.github.io/langmem/), [MemoryJS's session and memory-system documentation](https://github.com/danielsimonjr/MemoryJS), [Graphiti's provenance and temporal model](https://github.com/getzep/graphiti), and [M2MP's stated publication status](https://m2m-protocol.org/). The related-work file provides the remaining primary links and their limits.

Project marketing statements are treated as descriptions of intended/documented functionality, not independent quality evidence. No conclusion here establishes absence of competing work, patent freedom, benchmark superiority, psychological accuracy, or security of an implementation.

## What I would keep

- Evidence, interpretation, and task-local recall as separate concepts.
- Activation, relevance, and factual credibility as separate estimates.
- Explicit correction and withdrawal instead of silently accumulating context.
- A host-owned boundary around approvals and authoritative operational state.
- Storage/model/framework independence as a design constraint, with precise limits.

The clearest positioning is: **a proposed common contract for how recollection changes during an agent task**. Cognitive architecture can motivate it; the contract must stand on its own.
