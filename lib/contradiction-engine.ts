import { Decision, Constraint, Commitment, Conflict, Evidence, MemoryStatus } from "@/types";

/**
 * PURE DETERMINISTIC CONTRADICTION ENGINE
 * Implements exact logic for memory evaluation and conflict detection.
 */

export interface ContradictionResult {
  updatedDecisions: Decision[];
  updatedConstraints: Constraint[];
  updatedCommitments: Commitment[];
  newConflicts: Conflict[];
}

/**
 * Rule 1: Dependency/date conflict
 * Checks if a decision date change violates an active constraint whose dependency is unsatisfied.
 */
export function checkRule1DependencyDateConflict(
  newDecision: Decision,
  existingDecisions: Decision[],
  activeConstraints: Constraint[],
  commitments: Commitment[],
  newEvidence: Evidence
): Conflict | null {
  if (newDecision.subject.toLowerCase() !== "launch") return null;

  // Find active constraint targeting launch
  const launchConstraint = activeConstraints.find(
    (c) => c.targetSubject.toLowerCase() === "launch" && c.status === "ACTIVE"
  );

  if (!launchConstraint) return null;

  // Check if dependent commitment/task is unsatisfied (OPEN)
  const openSecurityCommitment = commitments.find(
    (com) => com.task.toLowerCase().includes("security") && com.status === "OPEN"
  );

  if (launchConstraint && openSecurityCommitment) {
    return {
      id: `conf-${Date.now()}`,
      type: "date",
      title: `Launch Date Shift Violates ${launchConstraint.subject.toUpperCase()} Lead Time`,
      description: `New launch target (${newDecision.value}) requires ${launchConstraint.subject} completion ${launchConstraint.offsetDays || 2} days prior. Outstanding commitment for ${openSecurityCommitment.owner} is still OPEN.`,
      newEvidenceId: newEvidence.id,
      existingEvidenceIds: [launchConstraint.evidenceId, openSecurityCommitment.evidenceId],
      status: "OPEN",
      reasoning: `Rule 1 Triggered: Date shift on subject '${newDecision.subject}' to ${newDecision.value} collides with active constraint requiring ${launchConstraint.offsetDays || 2}-day lead time while commitment '${openSecurityCommitment.task}' remains incomplete.`,
      confidence: Math.min(newDecision.confidence, launchConstraint.confidence),
      createdAt: new Date().toISOString(),
      implicatedMeetingIds: [newEvidence.meetingId],
    };
  }

  return null;
}

/**
 * Rule 2: Decision change & Versioning
 * Returns updated decisions array where older decisions on the same subject are marked SUPERSEDED.
 */
export function processRule2DecisionChange(
  newDecision: Decision,
  existingDecisions: Decision[]
): { updatedDecisions: Decision[]; supersededDecision: Decision | null } {
  let supersededDecision: Decision | null = null;

  const updatedDecisions = existingDecisions.map((dec) => {
    if (
      dec.subject.toLowerCase() === newDecision.subject.toLowerCase() &&
      dec.status === "CONFIRMED"
    ) {
      supersededDecision = dec;
      return {
        ...dec,
        status: "SUPERSEDED" as MemoryStatus,
      };
    }
    return dec;
  });

  const finalNewDecision: Decision = {
    ...newDecision,
    supersedesId: supersededDecision ? (supersededDecision as Decision).id : undefined,
  };

  return {
    updatedDecisions: [...updatedDecisions, finalNewDecision],
    supersededDecision,
  };
}

/**
 * Rule 3: Ownership conflict
 * Checks if an active commitment's owner differs from a newly stated owner for the same task.
 */
export function checkRule3OwnershipConflict(
  newCommitment: Commitment,
  existingCommitments: Commitment[],
  newEvidence: Evidence
): Conflict | null {
  const matchingTask = existingCommitments.find(
    (c) =>
      c.task.toLowerCase().trim() === newCommitment.task.toLowerCase().trim() &&
      c.owner.toLowerCase().trim() !== newCommitment.owner.toLowerCase().trim() &&
      c.status === "OPEN"
  );

  if (matchingTask) {
    return {
      id: `conf-own-${Date.now()}`,
      type: "ownership",
      title: `Ownership Contradiction on "${newCommitment.task}"`,
      description: `Task was previously assigned to ${matchingTask.owner}, but newly claimed by ${newCommitment.owner}.`,
      newEvidenceId: newEvidence.id,
      existingEvidenceIds: [matchingTask.evidenceId],
      status: "OPEN",
      reasoning: `Rule 3 Triggered: Task '${newCommitment.task}' owner mismatch (${matchingTask.owner} vs ${newCommitment.owner}).`,
      confidence: 0.95,
      createdAt: new Date().toISOString(),
      implicatedMeetingIds: [matchingTask.meetingId, newEvidence.meetingId],
    };
  }

  return null;
}

/**
 * STUB: Extract structured memory items from raw transcript text.
 * // TODO: Replace this pure function stub with real LLM extraction (e.g. Gemini 1.5/2.0 API call)
 */
export async function extractMemoryFromTranscript(
  transcript: string,
  meetingId: string
): Promise<{
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  evidence: Evidence[];
}> {
  // Pure deterministic stub for demo replay
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const evId = `ev-${Date.now()}`;
  
  const extractedEvidence: Evidence = {
    id: evId,
    meetingId,
    type: "TRANSCRIPT",
    content: transcript,
    timestamp: `${timeStr} (00:01:00)`,
  };

  const lower = transcript.toLowerCase();
  const decisions: Decision[] = [];
  const constraints: Constraint[] = [];
  const commitments: Commitment[] = [];

  if (lower.includes("launch")) {
    const dateMatch = transcript.match(/(september|october|november|december|january|february|march|april|may|june|july|august)\s+\d{1,2}/i);
    const dateVal = dateMatch ? dateMatch[0] : "New Target Date";
    decisions.push({
      id: `dec-${Date.now()}`,
      subject: "launch",
      value: dateVal,
      status: "CONFIRMED",
      confidence: 0.95,
      reason: "Extracted from meeting audio transcript",
      evidenceId: evId,
      createdAt: new Date().toISOString(),
      meetingId,
    });
  }

  if (lower.includes("security")) {
    constraints.push({
      id: `const-${Date.now()}`,
      subject: "security_review",
      relation: "must_complete_before",
      targetSubject: "launch",
      offsetDays: 2,
      status: "ACTIVE",
      confidence: 0.94,
      evidenceId: evId,
      meetingId,
    });
  }

  return {
    decisions,
    constraints,
    commitments,
    evidence: [extractedEvidence],
  };
}

/**
 * Master contradiction check algorithm running all pure rules.
 * // TODO: Replace or wrap with LLM rules engine when scaling beyond deterministic constraints.
 */
export function runContradictionEngine(
  decisions: Decision[],
  constraints: Constraint[],
  commitments: Commitment[],
  evidenceList: Evidence[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Group decisions by subject
  const subjectGroups: { [key: string]: Decision[] } = {};
  decisions.forEach((d) => {
    const subj = d.subject.toLowerCase();
    if (!subjectGroups[subj]) subjectGroups[subj] = [];
    subjectGroups[subj].push(d);
  });

  // Evaluate launch date changes vs constraints (Rule 1)
  const launchDecisions = subjectGroups["launch"] || [];
  if (launchDecisions.length > 1) {
    const latestLaunch = launchDecisions[launchDecisions.length - 1];
    const latestEvidence = evidenceList.find((e) => e.id === latestLaunch.evidenceId) || {
      id: latestLaunch.evidenceId,
      meetingId: latestLaunch.meetingId || "m-3",
      type: "TRANSCRIPT",
      content: latestLaunch.value,
      timestamp: "11:45:00 AM",
    };

    const conflict1 = checkRule1DependencyDateConflict(
      latestLaunch,
      launchDecisions.slice(0, -1),
      constraints,
      commitments,
      latestEvidence
    );

    if (conflict1) {
      conflicts.push(conflict1);
    }
  }

  // Check ownership conflicts (Rule 3)
  for (let i = 0; i < commitments.length; i++) {
    for (let j = i + 1; j < commitments.length; j++) {
      const c1 = commitments[i];
      const c2 = commitments[j];
      if (c1.task.toLowerCase() === c2.task.toLowerCase() && c1.owner.toLowerCase() !== c2.owner.toLowerCase()) {
        const ev = evidenceList.find((e) => e.id === c2.evidenceId) || {
          id: c2.evidenceId,
          meetingId: c2.meetingId,
          type: "TRANSCRIPT",
          content: c2.task,
          timestamp: "00:00:00",
        };
        const ownConflict = checkRule3OwnershipConflict(c2, [c1], ev);
        if (ownConflict) conflicts.push(ownConflict);
      }
    }
  }

  return conflicts;
}
