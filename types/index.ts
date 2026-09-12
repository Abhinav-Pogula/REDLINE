export type MemoryStatus = "PROPOSED" | "CONFIRMED" | "UNCERTAIN" | "CONFLICTING" | "SUPERSEDED";

export interface Meeting {
  id: string;
  title: string;
  source: "google_meet" | "zoom" | "teams" | "whatsapp_call" | "cellular_call" | "phone_audio" | "demo";
  startedAt: string;
  transcript: string;
  summary?: string;
  isConflicting?: boolean;
}

export interface Evidence {
  id: string;
  meetingId: string;
  type: "TRANSCRIPT" | "AUDIO" | "IMAGE" | "DOCUMENT";
  content: string;
  timestamp: string;
}

export interface Decision {
  id: string;
  subject: string;
  value: string;
  status: MemoryStatus;
  confidence: number;
  reason?: string;
  evidenceId: string;
  supersedesId?: string;
  createdAt?: string;
  meetingId?: string;
}

export interface Constraint {
  id: string;
  subject: string;
  relation: string;
  targetSubject: string;
  offsetDays?: number;
  status: "ACTIVE" | "SATISFIED" | "VIOLATED";
  confidence: number;
  evidenceId: string;
  meetingId?: string;
}

export interface Commitment {
  id: string;
  meetingId: string;
  owner: string;
  task: string;
  dueDate: string;
  status: "OPEN" | "DONE";
  evidenceId: string;
}

export interface Conflict {
  id: string;
  type: "date" | "ownership" | "dependency";
  title: string;
  description: string;
  newEvidenceId: string;
  existingEvidenceIds: string[];
  status: "OPEN" | "DISMISSED";
  reasoning?: string;
  confidence?: number;
  createdAt?: string;
  implicatedMeetingIds?: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "redline";
  text: string;
  timestamp: string;
  referencedEvidenceId?: string;
}
