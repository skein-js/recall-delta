# Related work and reference checks

Checked **8 November 2026** against primary paper landing pages/abstracts and official project documentation. These notes identify overlap and constraints; they do not certify maturity, reproduce results, or establish unique prior art. Descriptions can change after this date.

## Research

| Primary source | Relevant overlap | What it establishes for this proposal |
| --- | --- | --- |
| [Synapse](https://aclanthology.org/2026.findings-acl.1108/) | Associative graph recall, spreading activation, lateral inhibition, temporal decay, hybrid retrieval | Those mechanisms already appear together in published agent-memory research. It does not evaluate this protocol. |
| [HeLa-Mem](https://aclanthology.org/2026.acl-long.625/) | Episodic graphs and Hebbian distillation into semantic knowledge | Prior work on association and consolidation across memory types. |
| [HippoRAG 2](https://arxiv.org/abs/2502.14802) | Associative retrieval and non-parametric continual learning using Personalized PageRank | Relevant retrieval architecture; protocol interchange and task-session deltas need separate analysis. |
| [Hindsight research](https://aclanthology.org/2026.acl-demo.27/) | Typed memory networks, retain/recall/reflect, fact-belief separation, confidence-bearing opinions | Close overlap with separated interpretations and evolving memory; these ideas are not exclusive to Recall Delta. |
| [Executable Agentic Memory for GUI Agent](https://proceedings.mlr.press/v306/qin26m.html) | Structured knowledge graphs and retrieval/execution of GUI routines | Relevant procedural-memory example, with a narrower application domain. |
| [PROJECTMEM](https://arxiv.org/abs/2606.12329) | Append-only text event log, deterministic projections, advisory prechecks for coding agents | Evidence-history and file-native projection precedent. Its feasibility results do not establish that memory prevents repeated failures. |

No numeric benchmark result from these papers is carried over as a Recall Delta result.

## Protocols and libraries

| Primary source | Documented overlap or role | Implication |
| --- | --- | --- |
| [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25) | Tool/resource interoperability and capability negotiation over a defined protocol | A possible binding for Recall Delta operations, not a replacement for recall semantics. |
| [M2MP](https://m2m-protocol.org/) | Proposed transfer of learned associative graphs; site says spec, implementation, and benchmarks are coming soon | Related proposed work. No implemented compatibility bridge is established here. |
| [LangMem](https://langchain-ai.github.io/langmem/) | Extraction, background memory updates, storage-independent primitives, and native LangGraph integration | Correct the original implication that store independence distinguishes Recall Delta from LangMem. |
| [MemoryJS](https://github.com/danielsimonjr/MemoryJS) | TypeScript memory library with sessions, working/episodic/semantic/procedural memory, decay, consolidation, and multiple stores | Significant existing overlap. Session lifecycle and TypeScript/multi-store support alone are not new. |
| [Graphiti](https://github.com/getzep/graphiti) | Temporal facts, source episodes, incremental updates, hybrid retrieval, historical queries | Provenance and evolving facts are established features; a Recall Delta adapter would need an explicit mapping. |
| [Mem0](https://github.com/mem0ai/mem0) | User/session/agent memory and adaptive personalization | A mature comparison target for integration needs; no exhaustive feature-absence claim is made. |
| [Letta](https://docs.letta.com/) | Stateful agents and memory-oriented runtime features | Framework/agent-runtime scope differs from a narrow exchange contract; persistent memory is already central to its design. |
| [Hindsight documentation](https://hindsight.vectorize.io/1.0) | Retain/recall/reflect, evidence-bearing observations, several retrieval paths, self-hosted options | Close architectural comparison. Verify actual API/provenance access before promising an adapter. |
| [Cognee](https://www.cognee.ai/) | Open-source agent-memory platform, graph-oriented memory and agent integrations | Adjacent ingestion/retrieval ecosystem; detailed operation-level compatibility is not audited. |
| [Supermemory](https://supermemory.ai/) | Memory and continual-learning product surface | Adjacent integration target; the homepage alone does not establish semantic compatibility. |
| [Engram](https://engram.so/) | Typed memories, salience/decay, contradiction updates, consolidation, context materialization, multiple model integrations | Several original architectural distinctions overlap; no intentional errors are necessary to distinguish the protocol. |
| [Anamnesis](https://anamnesis.smtry.ai/) | Automatic session capture and cross-tool memory | Product existence and broad capture/recall positioning confirmed. Detailed provenance guarantees from the original table were not established by the inspected page. |
| [brainctl whitepaper](https://www.brainctl.org/whitepaper) | SQLite memory, pattern separation, supersession, a familiarity/no-memory signal | Relevant deterministic alternative to probabilistic activation; abstention and correction are not exclusive to this proposal. |

The naming examples [Kumbuka](https://docs.kumbuka.ai/en/) and [Mnestra](https://github.com/jhizzard/mnestra) also exist in the AI-memory ecosystem. This supports the original caution about those names; it is not a full naming or registry review.

## Claims we can make now

Recall Delta **proposes** a common host/service contract for evolving recall candidates, evidence references, uncertainty, and withdrawal. Existing research supplies plausible algorithms behind that boundary. Whether this contract is sufficiently distinct, useful, and implementable across products is the question for the first review round.

We cannot yet claim better recall, lower token use, less hallucination, equivalent behavior across stores, automatic safety, biological accuracy, or exclusive ownership of the idea.
