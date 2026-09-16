import { Decision, Constraint, Commitment, Evidence, timeline, decisions, constraints, commitments, evidence } from "./data";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  evidence: Evidence[];
}

/**
 * Scenario A: The Canonical Hero Contradiction Scenario
 * Launch date moved to September 28, but Security Review constraint is violated (incomplete).
 * Result: CONFLICT FLAG TRIGGERED.
 */
export const canonicalHeroScenario: Scenario = {
  id: "scenario-conflict",
  name: "Hero Demo: Launch Shift vs. Security Buffer",
  description: "Product moves launch to Sept 28, violating incomplete SecOps 2-day prerequisite.",
  decisions: [...decisions],
  constraints: [...constraints],
  commitments: [...commitments],
  evidence: [...evidence],
};

/**
 * Scenario B: Verified & Compliant Scenario (Proving the conflict engine is rule-based)
 * Security review is marked satisfied and launch date moved to October 15.
 * Result: ZERO CONFLICTS DETECTED.
 */
export const compliantScenario: Scenario = {
  id: "scenario-compliant",
  name: "Alternate Input: Compliant & Verified Launch",
  description: "Security sign-off satisfied; launch set to October 15. Engine detects NO conflicts.",
  decisions: [
    { id: "d-01", topic: "Launch date", value: "September 25", status: "confirmed", evidenceId: "ev-01" },
    { id: "d-02", topic: "Launch date", value: "October 15", status: "confirmed", evidenceId: "ev-03-safe", supersedesDecisionId: "d-01" },
  ],
  constraints: [
    { id: "c-01", topic: "Security review", rule: "Must be completed 2 days before launch", status: "satisfied", evidenceId: "ev-02-safe" },
  ],
  commitments: [
    { id: "cm-01", task: "API integration", owner: "Rahul", due: "Friday", evidenceId: "ev-04" },
  ],
  evidence: [
    { id: "ev-01", meetingId: "m1", meetingTitle: "Meeting 01", source: "google_meet", timestamp: "10:12 AM", text: "We'll launch the product on September 25." },
    { id: "ev-02-safe", meetingId: "m2", meetingTitle: "Meeting 02", source: "zoom", timestamp: "2:18 PM", text: "Security review completed and signed off by SecOps lead on Sept 26." },
    { id: "ev-03-safe", meetingId: "m3", meetingTitle: "Meeting 03", source: "teams", timestamp: "4:42 PM", text: "Let's align launch with the verified security clearance for October 15." },
    { id: "ev-04", meetingId: "m1", meetingTitle: "Meeting 01", source: "google_meet", timestamp: "10:19 AM", text: "Rahul, can you take the API integration? Let's say Friday." },
  ],
};
