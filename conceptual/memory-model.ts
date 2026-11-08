/**
 * Conceptual internal contracts for Recall Delta 0.1-draft.3.
 * These types explain formation, association, reinforcement, and evolution.
 * They are not a storage schema, transport binding, policy implementation,
 * or authorization mechanism. Callers must already have a verified scope.
 */
import type { Candidate, Json } from "./recall-session";

export interface MemoryScope {
  readonly tenantId: string;
  readonly scopeId: string;
}

export interface ValidTime {
  /** Inclusive; null means the start is unknown. */
  readonly from: string | null;
  /** Exclusive; null means no end has been recorded. */
  readonly until: string | null;
}

export interface Experience {
  readonly scope: MemoryScope;
  readonly evidenceId: string;
  readonly observedAt: string;
  readonly recordedAt: string;
  readonly content: Json;
}

export interface MemoryTrace {
  readonly id: string;
  readonly scope: MemoryScope;
  readonly evidenceIds: readonly string[];
  readonly cueIds: readonly string[];
  readonly salience: number;
  readonly accessibility: number;
  readonly expiresAt: string | null;
}

export interface MemoryVersion {
  readonly revision: number;
  readonly recordedAt: string;
  readonly content: Json;
  readonly evidenceIds: readonly string[];
  readonly validTime: ValidTime | null;
  readonly cause: "formed" | "reinterpretation" | "world-change" | "correction";
}

export interface Engram {
  readonly id: string;
  readonly scope: MemoryScope;
  readonly kind: "episodic" | "semantic" | "procedural" | "preference";
  readonly cueIds: readonly string[];
  readonly versions: readonly MemoryVersion[];
  readonly salience: number;
  readonly accessibility: number;
  readonly stability: number;
  /** Source policies must still be enforced on every derivative/read. */
  readonly sourcePolicyRefs: readonly string[];
}

export interface Association {
  readonly id: string;
  readonly scope: MemoryScope;
  readonly fromMemoryId: string;
  readonly toMemoryId: string;
  readonly relation: string;
  readonly weight: number;
  readonly validTime: ValidTime | null;
  readonly sourcePolicyRefs: readonly string[];
}

export interface EngineSessionState {
  readonly scope: MemoryScope;
  readonly principalId: string;
  readonly sessionId: string;
  readonly activationByMemoryId: Readonly<Record<string, number>>;
  readonly lastAdvancedAt: string;
}

export interface LearningEvent {
  readonly eventId: string;
  readonly scope: MemoryScope;
  readonly principalId: string;
  readonly kind:
    | "retrieved"
    | "rehearsed"
    | "repeated-experience"
    | "useful-outcome"
    | "rejected";
  readonly occurredAt: string;
  readonly memoryIds: readonly string[];
  readonly evidenceIds: readonly string[];
}

export type MemoryEffect =
  | { readonly type: "trace.retained"; readonly trace: MemoryTrace }
  | { readonly type: "trace.expired"; readonly traceId: string }
  | { readonly type: "engram.formed"; readonly engram: Engram }
  | {
      readonly type: "engram.versioned";
      readonly engramId: string;
      readonly expectedRevision: number;
      readonly version: MemoryVersion;
    }
  | {
      readonly type: "pathway.adjusted";
      readonly memoryId: string;
      readonly accessibilityDelta: number;
      readonly stabilityDelta: number;
    }
  | { readonly type: "association.updated"; readonly association: Association };

export interface LearningPlan {
  readonly eventId: string;
  readonly scope: MemoryScope;
  readonly principalId: string;
  /** Private effects use a caller overlay; shared base writes need authorization. */
  readonly audience: "caller-private" | "authorized-shared";
  readonly effects: readonly MemoryEffect[];
}

export interface AuthorizedMemoryView {
  readonly scope: MemoryScope;
  readonly principalId: string;
  readonly traces: readonly MemoryTrace[];
  readonly engrams: readonly Engram[];
  readonly associations: readonly Association[];
}

/** Engine-owned decisions; the host does not label every item remember/forget. */
export interface AutomaticMemoryPolicy {
  planObservation(input: {
    readonly experience: Experience;
    readonly view: AuthorizedMemoryView;
  }): Promise<LearningPlan>;

  planReinforcement(input: {
    readonly event: LearningEvent;
    readonly view: AuthorizedMemoryView;
  }): Promise<LearningPlan>;

  planConsolidation(input: {
    readonly eventId: string;
    readonly at: string;
    readonly view: AuthorizedMemoryView;
  }): Promise<LearningPlan>;
}

/** Internal query hints; the core has no standardized temporal-query binding. */
export interface RecallPolicy {
  planRecall(input: {
    readonly cues: readonly Json[];
    readonly at: string;
    readonly validAt?: string;
    readonly knownAt?: string;
    readonly state: EngineSessionState;
    readonly view: AuthorizedMemoryView;
  }): Promise<{
    readonly state: EngineSessionState;
    readonly candidates: readonly Candidate[];
    readonly reinforcement: LearningPlan | null;
  }>;
}
