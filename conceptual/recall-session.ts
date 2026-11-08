/**
 * Explanatory session-state sketch for Recall Delta 0.1-draft.3.
 * Not an SDK or a memory engine. Inputs must already pass record-shape,
 * authorization, evidence-policy, and numeric-range validation.
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | readonly Json[]
  | { readonly [key: string]: Json };

export type Estimate = number | null;
export type ReasonCode =
  | "cue_match"
  | "cue_changed"
  | "evidence_changed"
  | "feedback_applied"
  | "memory_formed"
  | "association_changed"
  | "reinforced"
  | "memory_revised"
  | "state_changed"
  | "temporal_context"
  | "policy_removed"
  | "budget_evicted"
  | "source_unavailable"
  | `x-${string}`;

export interface Candidate {
  readonly candidateId: string;
  readonly memoryRefs: readonly string[];
  readonly content: Json;
  readonly activation: number;
  readonly relevance: Estimate;
  readonly validTime?: {
    readonly from: string | null;
    readonly until: string | null;
  } | null;
  readonly factualConfidence: Estimate;
  readonly uncertainty: {
    readonly ambiguity: Estimate;
    readonly contradiction: Estimate;
    readonly sourceDoubt: Estimate;
    readonly missingContext: Estimate;
  };
  readonly evidenceRefs: readonly {
    readonly evidenceId: string;
    readonly role: "supports" | "contradicts" | "context";
  }[];
  readonly verification: "required" | "unspecified";
}

interface ChangeBase {
  readonly candidateId: string;
  readonly reasonCodes: readonly [ReasonCode, ...ReasonCode[]];
}

export type Change =
  | (ChangeBase & {
      readonly type: "candidate.emerged" | "candidate.updated";
      readonly current: Candidate;
    })
  | (ChangeBase & {
      readonly type: "candidate.withdrawn";
    });

export interface Batch {
  readonly sessionId: string;
  readonly engineProfile: string;
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly status: "open" | "closed";
  readonly changes: readonly Change[];
}

export interface Snapshot {
  readonly sessionId: string;
  readonly engineProfile: string;
  readonly version: number;
  readonly status: "open" | "closed" | "expired";
  readonly candidates: readonly Candidate[];
}

export type ApplyResult =
  | { readonly kind: "applied"; readonly snapshot: Snapshot }
  | { readonly kind: "duplicate"; readonly snapshot: Snapshot }
  | { readonly kind: "resync"; readonly reason: string };

/** Commit to a new local value only after validating the whole batch. */
export function applyBatch(snapshot: Snapshot, batch: Batch): ApplyResult {
  const resync = (reason: string): ApplyResult => ({ kind: "resync", reason });
  if (
    batch.sessionId !== snapshot.sessionId ||
    batch.engineProfile !== snapshot.engineProfile
  ) {
    return resync("Session or engine profile differs");
  }
  if (
    !Number.isSafeInteger(batch.fromVersion) ||
    batch.fromVersion < 0 ||
    !Number.isSafeInteger(batch.toVersion) ||
    batch.toVersion !== batch.fromVersion + 1
  ) {
    return resync("Invalid version range");
  }
  if (batch.toVersion <= snapshot.version) {
    // Historical conflicts require a separate retained batch hash/receipt.
    return { kind: "duplicate", snapshot };
  }
  if (snapshot.status !== "open" || batch.fromVersion !== snapshot.version) {
    return resync("Terminal session or missing history");
  }
  if (batch.status === "closed" && batch.changes.length !== 0) {
    return resync("Closing must preserve the historical candidate set");
  }

  const next = new Map(snapshot.candidates.map((item) => [item.candidateId, item]));
  const changed = new Set<string>();
  for (const change of batch.changes) {
    if (changed.has(change.candidateId)) return resync("Repeated candidate change");
    changed.add(change.candidateId);
    const present = next.has(change.candidateId);
    if (change.type === "candidate.emerged" ? present : !present) {
      return resync("Invalid candidate transition");
    }
    if (change.type === "candidate.withdrawn") {
      next.delete(change.candidateId);
    } else {
      if (change.current.candidateId !== change.candidateId) {
        return resync("Candidate identity differs");
      }
      next.set(change.candidateId, change.current);
    }
  }

  return {
    kind: "applied",
    snapshot: {
      ...snapshot,
      version: batch.toVersion,
      status: batch.status,
      candidates: [...next.values()],
    },
  };
}

/** JSON object order is irrelevant; array order remains significant. */
function equalJson(left: Json, right: Json): boolean {
  if (left === right) return true;
  if (left === null || right === null || typeof left !== typeof right) return false;
  if (typeof left !== "object" || typeof right !== "object") return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((item, index) => equalJson(item, right[index]))
    );
  }
  const l = left as { readonly [key: string]: Json };
  const r = right as { readonly [key: string]: Json };
  const keys = Object.keys(l);
  return (
    keys.length === Object.keys(r).length &&
    keys.every((key) => Object.hasOwn(r, key) && equalJson(l[key], r[key]))
  );
}

/**
 * Engine-side diff of two already validated public sets.
 * Candidate IDs must be unique in each set. No thresholding happens here.
 */
export function diffCandidates(
  previous: readonly Candidate[],
  current: readonly Candidate[],
  reasonCodes: readonly [ReasonCode, ...ReasonCode[]],
): readonly Change[] {
  const before = new Map(previous.map((item) => [item.candidateId, item]));
  const after = new Map(current.map((item) => [item.candidateId, item]));
  const ids = [...new Set([...before.keys(), ...after.keys()])].sort();
  const changes: Change[] = [];
  for (const candidateId of ids) {
    const oldValue = before.get(candidateId);
    const newValue = after.get(candidateId);
    if (!newValue) {
      changes.push({ type: "candidate.withdrawn", candidateId, reasonCodes });
    } else if (!oldValue) {
      changes.push({ type: "candidate.emerged", candidateId, current: newValue, reasonCodes });
    } else if (!equalJson(oldValue as unknown as Json, newValue as unknown as Json)) {
      changes.push({ type: "candidate.updated", candidateId, current: newValue, reasonCodes });
    }
  }
  return changes;
}
