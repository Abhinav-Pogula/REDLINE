// ============================================================================
// REDLINE — Seed/demo data + backward-compatible type re-exports.
// lib/types.ts is the canonical schema; this file re-exports the entity
// types from there (so existing `import { Decision } from "./data"` call
// sites keep working) and holds the hardcoded hero-scenario seed records.
// ============================================================================

export type {
  DecisionStatus,
  ConstraintStatus,
  Evidence,
  Decision,
  Constraint,
  Commitment,
  Conflict,
  TimelineEvent,
} from "./types";

import { Evidence, Decision, Constraint, Commitment, TimelineEvent } from "./types";

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
  { id: "c-01", topic: "Security review", rule: "Must be completed 2 days before launch", status: "violated", evidenceId: "ev-02", leadTimeDays: 2 },
];

export const commitments: Commitment[] = [
  { id: "cm-01", task: "API integration", owner: "Rahul", due: "Friday", evidenceId: "ev-04" },
];

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
