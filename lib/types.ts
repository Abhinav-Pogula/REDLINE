// ============================================================================
// REDLINE — Canonical Data Model
// This file is the single source of truth for every entity shape used across
// the extraction engine, conflict engine, memory store, and UI. lib/data.ts
// re-exports these types (plus seed/demo data) so existing imports keep working.
// ============================================================================

export type DecisionStatus = "proposed" | "confirmed" | "uncertain" | "conflicting" | "superseded";
export type ConstraintStatus = "active" | "satisfied" | "violated" | "uncertain";
export type CommitmentStatus = "pending" | "in_progress" | "completed" | "blocked";
export type ConflictStatus = "open" | "dismissed" | "resolved";
export type ConflictType = "date" | "ownership" | "dependency" | "deadline" | "uncertainty";
export type ConflictSeverity = "critical" | "warning" | "advisory";
export type EvidenceSourceType =
  | "meeting"
  | "document"
  | "image"
  | "transcript"
  | "google_meet"
  | "zoom"
  | "teams"
  | "whatsapp_call"
  | "cellular_call"
  | "phone_audio"
  | "manual_paste"
  | "demo";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "completed" | "archived";
}

export interface Meeting {
  id: string;
  title: string;
  source: EvidenceSourceType;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  summary?: string;
}

export interface Evidence {
  id: string;
  meetingId: string;
  meetingTitle: string;
  source: EvidenceSourceType;
  timestamp: string;
  text: string;
  sourceType?: EvidenceSourceType;
  sourceName?: string;
  confidence?: number;
  hash?: string;
  /** ISO date this piece of evidence was spoken/recorded, when known/parseable. Used for chronological ordering. */
  occurredAt?: string;
}

export interface Decision {
  id: string;
  topic: string;
  value: string;
  status: DecisionStatus;
  evidenceId: string;
  supersedesDecisionId?: string;
  title?: string;
  description?: string;
  projectId?: string;
  createdAt?: string;
  evidenceIds?: string[];
  /** Normalized ISO date parsed from `value`, when the decision encodes a date (e.g. a launch date). */
  parsedDate?: string;
  /** Extraction confidence 0-1, set by an ExtractionProvider. */
  confidence?: number;
}

export interface Constraint {
  id: string;
  topic: string;
  rule: string;
  status: ConstraintStatus;
  evidenceId: string;
  description?: string;
  type?: string;
  dueDate?: string;
  relatedDecisionIds?: string[];
  evidenceIds?: string[];
  /** Days of required lead time this constraint demands relative to a related decision's date, when parseable (e.g. "must be completed 2 days before launch" -> 2). */
  leadTimeDays?: number;
  /** Normalized ISO date parsed from `rule`/`dueDate`, when the constraint encodes a hard date. */
  parsedDate?: string;
  confidence?: number;
}

export interface Commitment {
  id: string;
  task: string;
  owner: string;
  due: string;
  evidenceId: string;
  status?: CommitmentStatus;
  meetingId?: string;
  /** Normalized ISO date parsed from `due`, when parseable. */
  parsedDate?: string;
  confidence?: number;
}

export interface Conflict {
  id: string;
  type: ConflictType;
  title: string;
  explanation: string;
  newEvidenceId: string;
  existingEvidenceId: string;
  status: ConflictStatus;
  severity?: ConflictSeverity;
  affectedDecisionIds?: string[];
  affectedConstraintIds?: string[];
  ruleCode?: string;
  cryptographicProof?: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
  kind: "constraint" | "decision" | "status" | "conflict" | "commitment";
  evidenceId?: string;
  metadata?: string;
  /** ISO date used to sort events chronologically; falls back to `date` string ordering when absent. */
  sortKey?: string;
}

export type Screen =
  | "dashboard"
  | "capture"
  | "result"
  | "conflict"
  | "timeline"
  | "calendar"
  | "profile";

export type CaptureStatus =
  | "idle"
  | "capturing"
  | "processing"
  | "complete"
  | "error";

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  state: "pending" | "active" | "completed";
}

// ============================================================================
// Extensible Architecture Interfaces for Real Local Processing
// ============================================================================

export interface TranscriptionProvider {
  isAvailable(): Promise<boolean>;
  transcribeAudio(audioStream: MediaStream | Blob): Promise<{ text: string; confidence: number }>;
}

/** Context passed alongside a raw transcript so extracted evidence can be attributed correctly. */
export interface ExtractionContext {
  meetingId?: string;
  meetingTitle?: string;
  source?: EvidenceSourceType;
  /** Wall-clock timestamp label shown in the UI, e.g. "2:18 PM". Defaults to "now" if omitted. */
  timestamp?: string;
  /** ISO date this transcript was captured on; used for date-relative parsing ("in 2 weeks", "Friday"). Defaults to now. */
  referenceDate?: string;
}

export interface ExtractedStatement {
  /** The verbatim sentence/fragment this fact was extracted from. */
  sourceText: string;
  kind: "decision" | "constraint" | "commitment" | "unclassified";
  confidence: number;
}

export interface ExtractionResult {
  /** Each entry also carries the verbatim statement it was extracted from, so the ingest pipeline can turn it into Evidence. */
  decisions: (Partial<Decision> & { sourceText: string })[];
  constraints: (Partial<Constraint> & { sourceText: string })[];
  commitments: (Partial<Commitment> & { sourceText: string })[];
  /** Every statement considered, including ones that didn't classify as anything actionable — useful for debugging/telemetry. */
  statements: ExtractedStatement[];
}

export interface ExtractionProvider {
  extractEntities(transcript: string, context?: ExtractionContext): Promise<ExtractionResult>;
}

export interface MemoryStore {
  saveEvidence(evidence: Evidence): Promise<void>;
  saveDecision(decision: Decision): Promise<void>;
  saveConstraint(constraint: Constraint): Promise<void>;
  saveCommitment(commitment: Commitment): Promise<void>;
  getEvidence(): Promise<Evidence[]>;
  getDecisions(): Promise<Decision[]>;
  getConstraints(): Promise<Constraint[]>;
  getCommitments(): Promise<Commitment[]>;
  getConflicts(): Promise<Conflict[]>;
  clear(): Promise<void>;
}

// ============================================================================
// Ingest pipeline result — what you get back from feeding a transcript through
// the full extraction -> merge -> conflict-detection pipeline in one call.
// ============================================================================

// ============================================================================
// Result handed back from a paste-transcript submission (hooks/useRedline.ts
// extractTranscript) so each surface (mobile auto-navigates + toasts; desktop
// has no shared navigation state with the mobile Screen type, so it needs
// this to know what actually happened and render its own feedback) can react
// without silently dropping what the extraction produced.
// ============================================================================
export type ExtractOutcomeStatus = "empty" | "new_conflict" | "superseded" | "ok" | "error";

export interface ExtractOutcome {
  status: ExtractOutcomeStatus;
  message: string;
}

export interface IngestResult {
  newEvidence: Evidence[];
  newDecisions: Decision[];
  newConstraints: Constraint[];
  newCommitments: Commitment[];
  /** Full memory state after merging the new facts in. */
  mergedDecisions: Decision[];
  mergedConstraints: Constraint[];
  mergedCommitments: Commitment[];
  mergedEvidence: Evidence[];
  /** Conflict engine output evaluated against the merged state. */
  engineResult: import("./conflict-engine").EngineResult;
  /** Raw statement-level breakdown from the extraction provider, for debugging/UI transparency. */
  statements: ExtractedStatement[];
}
