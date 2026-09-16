export type DecisionStatus = "proposed" | "confirmed" | "uncertain" | "conflicting";
export type ConstraintStatus = "active" | "satisfied" | "violated" | "uncertain";

export interface Evidence {
  id: string;
  meetingId: string;
  meetingTitle: string;
  source: "google_meet" | "zoom" | "teams" | "whatsapp_call" | "cellular_call" | "phone_audio" | "demo";
  timestamp: string;
  text: string;
}

export interface Decision {
  id: string;
  topic: string;
  value: string;
  status: DecisionStatus;
  evidenceId: string;
  supersedesDecisionId?: string;
}

export interface Constraint {
  id: string;
  topic: string;
  rule: string;
  status: ConstraintStatus;
  evidenceId: string;
}

export interface Commitment {
  id: string;
  task: string;
  owner: string;
  due: string;
  evidenceId: string;
}

export interface Conflict {
  id: string;
  type: "date" | "ownership" | "dependency";
  title: string;
  explanation: string;
  newEvidenceId: string;
  existingEvidenceId: string;
  status: "open" | "dismissed" | "resolved";
}

export interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
  kind: "constraint" | "decision" | "status" | "conflict";
}

export const evidence: Evidence[] = [
  { id: "ev-01", meetingId: "m1", meetingTitle: "Meeting 01", source: "google_meet", timestamp: "10:12 AM", text: "We'll launch the product on September 25." },
  { id: "ev-02", meetingId: "m2", meetingTitle: "Meeting 02", source: "zoom", timestamp: "2:18 PM", text: "The security review must be completed two days before launch." },
  { id: "ev-03", meetingId: "m3", meetingTitle: "Meeting 03", source: "teams", timestamp: "4:42 PM", text: "Let's move the launch to September 28." },
  { id: "ev-04", meetingId: "m1", meetingTitle: "Meeting 01", source: "google_meet", timestamp: "10:19 AM", text: "Rahul, can you take the API integration? Let's say Friday." },
];

export const decisions: Decision[] = [
  { id: "d-01", topic: "Launch date", value: "September 25", status: "confirmed", evidenceId: "ev-01" },
  { id: "d-02", topic: "Launch date", value: "September 28", status: "confirmed", evidenceId: "ev-03", supersedesDecisionId: "d-01" },
];

export const constraints: Constraint[] = [
  { id: "c-01", topic: "Security review", rule: "Must be completed 2 days before launch", status: "violated", evidenceId: "ev-02" },
];

export const commitments: Commitment[] = [
  { id: "cm-01", task: "API integration", owner: "Rahul", due: "Friday", evidenceId: "ev-04" },
];

export function runConflictEngine(): Conflict[] {
  const conflicts: Conflict[] = [];
  const latestLaunch = decisions.find(
    (d) => d.topic === "Launch date" && !decisions.some((o) => o.supersedesDecisionId === d.id)
  );
  const securityConstraint = constraints.find((c) => c.topic === "Security review");

  if (latestLaunch && securityConstraint && securityConstraint.status !== "satisfied") {
    conflicts.push({
      id: "conf-01",
      type: "dependency",
      title: "Launch may conflict with security dependency",
      explanation:
        "The current launch date depends on a security review that is still incomplete. " +
        "Security review must be completed before launch, but its current status is incomplete.",
      newEvidenceId: latestLaunch.evidenceId,
      existingEvidenceId: securityConstraint.evidenceId,
      status: "open",
    });
  }
  return conflicts;
}

export const timeline: TimelineEvent[] = [
  { date: "SEP 20", label: "Security review", detail: "must be completed before launch.", kind: "constraint" },
  { date: "SEP 22", label: "Launch confirmed", detail: "for September 25.", kind: "decision" },
  { date: "SEP 24", label: "Security review", detail: "still incomplete.", kind: "status" },
  { date: "SEP 24", label: "Launch changed", detail: "to September 28.", kind: "decision" },
  { date: "NOW", label: "REDLINE", detail: "Potential dependency conflict detected.", kind: "conflict" },
];

export function getEvidence(id: string): Evidence | undefined {
  return evidence.find((e) => e.id === id);
}

// Canonical meetings list for dashboard deck & UI displays
export interface MonitoredMeetingCard {
  id: string;
  source: string;
  sourceLabel: string;
  date: string;
  title: string;
  description: string;
  unreviewedCount: number;
  tags: string[];
}

export const monitoredMeetings: MonitoredMeetingCard[] = [
  {
    id: "m3",
    source: "teams",
    sourceLabel: "TEAMS // PRODSYNC",
    date: "SEP 28",
    title: "Launch Timeline Shift & Go-To-Market",
    description: "Product team proposed moving launch date to September 28.",
    unreviewedCount: 1,
    tags: ["Launch", "GTM", "Timeline"],
  },
  {
    id: "m2",
    source: "zoom",
    sourceLabel: "ZOOM // SECSYNC",
    date: "SEP 24",
    title: "Security Review & Audit Constraint",
    description: "SecOps team confirms mandatory security review must complete 2 days before launch.",
    unreviewedCount: 0,
    tags: ["SecOps", "Audit", "Mandatory"],
  },
  {
    id: "m1",
    source: "google_meet",
    sourceLabel: "GOOGLE MEET // DEV SYNC",
    date: "SEP 22",
    title: "API Integration & Initial Target Date",
    description: "Engineering confirmed September 25 target and assigned API integration to Rahul.",
    unreviewedCount: 0,
    tags: ["Engineering", "Sprint 42", "API"],
  },
];
