export type DecisionStatus = "proposed" | "confirmed" | "uncertain" | "conflicting" | "superseded";
export type ConstraintStatus = "active" | "satisfied" | "violated" | "uncertain";
export type CommitmentStatus = "pending" | "in_progress" | "completed" | "blocked";
export type ConflictStatus = "open" | "dismissed" | "resolved";
export type ConflictType = "date" | "ownership" | "dependency" | "deadline";
export type EvidenceSourceType = "meeting" | "document" | "image" | "transcript" | "google_meet" | "zoom" | "teams" | "whatsapp_call" | "cellular_call" | "phone_audio" | "demo";

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
}

export interface Commitment {
  id: string;
  task: string;
  owner: string;
  due: string;
  evidenceId: string;
  status?: CommitmentStatus;
  meetingId?: string;
}

export interface Conflict {
  id: string;
  type: ConflictType;
  title: string;
  explanation: string;
  newEvidenceId: string;
  existingEvidenceId: string;
  status: ConflictStatus;
  severity?: "critical" | "warning" | "advisory";
  affectedDecisionIds?: string[];
  affectedConstraintIds?: string[];
  ruleCode?: string;
  cryptographicProof?: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
  kind: "constraint" | "decision" | "status" | "conflict";
  evidenceId?: string;
  metadata?: string;
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

// Extensible Architecture Interfaces for Real Local Processing
export interface TranscriptionProvider {
  isAvailable(): Promise<boolean>;
  transcribeAudio(audioStream: MediaStream | Blob): Promise<{ text: string; confidence: number }>;
}

export interface ExtractionProvider {
  extractEntities(transcript: string): Promise<{
    decisions: Partial<Decision>[];
    constraints: Partial<Constraint>[];
    commitments: Partial<Commitment>[];
  }>;
}

export interface MemoryStore {
  saveEvidence(evidence: Evidence): Promise<void>;
  saveDecision(decision: Decision): Promise<void>;
  saveConstraint(constraint: Constraint): Promise<void>;
  getConflicts(): Promise<Conflict[]>;
}
