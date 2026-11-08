/**
 * Conceptual internal contracts for Recall Delta 0.1-draft.4.
 * These types explain formation, association, reinforcement, evolution,
 * and bounded retention. Maintenance methods only propose effects.
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

/** Durable checkpoint; independent of activation in any recall session. */
export interface RetentionState {
  readonly revision: number;
  readonly evaluatedAt: string;
  readonly accessibility: number;
  readonly lastReinforcedAt: string | null;
  /** Start of low-accessibility grace; reinforcement resets it; null if accessible. */
  readonly dormantSince: string | null;
  readonly phase: "accessible" | "dormant" | "eviction-eligible";
}

export interface Engram {
  readonly id: string;
  readonly scope: MemoryScope;
  readonly kind: "episodic" | "semantic" | "procedural" | "preference";
  readonly cueIds: readonly string[];
  readonly versions: readonly MemoryVersion[];
  readonly salience: number;
  readonly retention: RetentionState;
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

/** Illustrative thresholds, not a universal decay rate or retention policy. */
export interface RetentionPolicy {
  readonly policyId: string;
  readonly revision: string;
  readonly dormantBelow: number;
  readonly graceMs: number;
  readonly maximumEvictionValue: number;
}

/** Includes retained archives and overlays within the declared boundary. */
export interface StorageBudget {
  readonly accountedAt: string;
  readonly hardLimitBytes: number;
  readonly targetBytes: number;
  readonly usedBytes: Readonly<{
    sourceEvidence: number;
    memoryAndOverlays: number;
    associations: number;
    indexesAndCaches: number;
    operational: number;
  }>;
}

export interface RetentionAssessment {
  readonly memoryId: string;
  /** Unknown value blocks decay-based eligibility; it is not zero. */
  readonly retentionValue: number | null;
  /** Net savings after cleanup/markers; excludes still-referenced bytes. */
  readonly reclaimableBytes: number;
  readonly protected: boolean;
  readonly blockingDependency: boolean;
}

/**
 * Maintenance-authorized scope-base view, not a personalized recall view.
 * A reader's private overlay cannot authorize eviction of shared base memory.
 */
export interface RetentionView {
  readonly scope: MemoryScope;
  readonly storeRevision: string;
  readonly engrams: readonly Engram[];
  readonly associations: readonly Association[];
  readonly assessments: readonly RetentionAssessment[];
  readonly budget: StorageBudget;
}

export type MaintenanceEffect =
  | {
      readonly type: "retention.checkpointed";
      readonly memoryId: string;
      readonly expectedRetentionRevision: number;
      readonly current: RetentionState;
    }
  | {
      /** Protected applier must reconcile dependencies, edges, and caches. */
      readonly type: "engram.evicted";
      readonly memoryId: string;
      readonly expectedMemoryRevision: number;
      readonly expectedRetentionRevision: number;
      readonly evictedAt: string;
      /** Null: no timer-based re-encoding; a new qualifying trigger is needed. */
      readonly reconsiderAfter: string | null;
    };

export interface MaintenancePlan {
  readonly eventId: string;
  readonly scope: MemoryScope;
  readonly policyId: string;
  readonly expectedPolicyRevision: string;
  /** Fence memory, reinforcement, protections, dependencies, and accounting. */
  readonly expectedStoreRevision: string;
  readonly outcome:
    | "decay-only"
    | "within-budget"
    | "reclaim-planned"
    | "capacity-exhausted";
  readonly effects: readonly MaintenanceEffect[];
}

/** No destructive operation is implemented; plans need a protected applier. */
export interface MemoryMaintenancePolicy {
  planDecay(input: {
    readonly eventId: string;
    readonly at: string;
    readonly policy: RetentionPolicy;
    readonly view: RetentionView;
  }): Promise<MaintenancePlan>;

  planEviction(input: {
    readonly eventId: string;
    readonly at: string;
    readonly trigger: "capacity-pressure" | "retention-rule";
    readonly policy: RetentionPolicy;
    readonly view: RetentionView;
  }): Promise<MaintenancePlan>;
}
