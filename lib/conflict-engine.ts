import { Decision, Constraint, Commitment, Conflict, Evidence, TimelineEvent } from "./types";
import { toShortLabel } from "./date-utils";

export interface EngineResult {
  conflicts: Conflict[];
  supersededDecisions: Decision[];
  activeDecisions: Decision[];
  timeline: TimelineEvent[];
  rulesChecked: {
    ruleCode: string;
    name: string;
    triggered: boolean;
    reason: string;
  }[];
}

/** Strips generic filler words ("date", "review") off a topic so cross-topic references can be matched by their core noun, e.g. "Launch date" -> "launch". */
function coreKeyword(topic: string): string {
  const cleaned = topic
    .toLowerCase()
    .replace(/\bdate\b/g, "")
    .replace(/\breview\b/g, "")
    .trim();
  return (cleaned.split(/\s+/)[0] || topic.toLowerCase()).trim();
}

function findEvidence(evidence: Evidence[], id: string): Evidence | undefined {
  return evidence.find((e) => e.id === id);
}

/**
 * Deterministic Rule-based Conflict Verification Engine for REDLINE
 * Evaluates decisions, constraints, and commitments against forensic rules.
 * No rule here is topic-specific ("launch", "security", ...) — every check
 * works off whatever topics/keywords the extraction engine (lib/pipeline.ts)
 * happened to pull out of the transcript, so pasting an entirely different
 * kind of meeting (budget, hiring, a design review) still gets evaluated.
 */
export function evaluateProjectMemory(
  currentDecisions: Decision[],
  currentConstraints: Constraint[],
  currentCommitments: Commitment[],
  allEvidence: Evidence[]
): EngineResult {
  const conflicts: Conflict[] = [];
  const rulesChecked: EngineResult["rulesChecked"] = [];

  // ----------------------------------------------------------------------
  // Active vs superseded decisions (a later decision on the same topic
  // supersedes an earlier one via `supersedesDecisionId`).
  // ----------------------------------------------------------------------
  const supersededDecisions: Decision[] = [];
  currentDecisions.forEach((dec) => {
    if (dec.supersedesDecisionId) {
      const priorDecision = currentDecisions.find((d) => d.id === dec.supersedesDecisionId);
      if (priorDecision) {
        supersededDecisions.push({ ...priorDecision, status: "superseded" });
      }
    }
  });
  const activeDecisions: Decision[] = currentDecisions.filter(
    (dec) => !currentDecisions.some((d) => d.supersedesDecisionId === dec.id)
  );

  // ----------------------------------------------------------------------
  // RULE 1 — Dependency Conflict: an active decision depends on a
  // constraint (the constraint's own rule text names the decision's topic,
  // e.g. "...before launch") that hasn't been satisfied.
  // ----------------------------------------------------------------------
  let rule1Triggered = false;
  let rule1Reason = "All decision dependencies are satisfied.";

  activeDecisions.forEach((decision) => {
    const decisionKeyword = coreKeyword(decision.topic);
    if (!decisionKeyword) return;

    currentConstraints.forEach((constraint) => {
      if (constraint.status === "satisfied") return;
      const mentionsDecision =
        constraint.rule.toLowerCase().includes(decisionKeyword) ||
        constraint.topic.toLowerCase().includes(decisionKeyword);
      if (!mentionsDecision) return;

      rule1Triggered = true;

      let explanation =
        `The current decision (${decision.topic}: ${decision.value}) directly conflicts with the prerequisite constraint: "${constraint.rule}". ` +
        `Its status remains ${constraint.status}.`;

      // Enrich with real calendar math when both a lead-time requirement and a parsed decision date exist.
      if (constraint.leadTimeDays != null && decision.parsedDate) {
        const decisionDate = new Date(decision.parsedDate);
        const requiredBy = new Date(decisionDate);
        requiredBy.setDate(requiredBy.getDate() - constraint.leadTimeDays);
        explanation =
          `"${constraint.rule}" requires this to be done by ${toShortLabel(requiredBy)} (${constraint.leadTimeDays} day(s) before ${decision.topic.toLowerCase()} on ${toShortLabel(decisionDate)}), ` +
          `but its status is still ${constraint.status}.`;
      }

      rule1Reason = `Decision "${decision.topic}" (${decision.value}) depends on constraint "${constraint.rule}", which remains ${constraint.status}.`;

      conflicts.push({
        id: `conf-dep-${decision.id}-${constraint.id}`,
        type: "dependency",
        title: `${decision.topic} violates a mandatory dependency`,
        explanation,
        newEvidenceId: decision.evidenceId,
        existingEvidenceId: constraint.evidenceId,
        status: "open",
        severity: "critical",
        affectedDecisionIds: [decision.id],
        affectedConstraintIds: [constraint.id],
        ruleCode: "RULE_1_DEPENDENCY",
      });
    });
  });

  rulesChecked.push({
    ruleCode: "RULE_1_DEPENDENCY",
    name: "Dependency Invariant Check",
    triggered: rule1Triggered,
    reason: rule1Reason,
  });

  // ----------------------------------------------------------------------
  // RULE 2 — Decision Change / Superseding (informational, always runs;
  // captured above via activeDecisions/supersededDecisions).
  // ----------------------------------------------------------------------
  rulesChecked.push({
    ruleCode: "RULE_2_SUPERSEDE",
    name: "Decision Supersede Tracking",
    triggered: supersededDecisions.length > 0,
    reason:
      supersededDecisions.length > 0
        ? `${supersededDecisions.length} decision(s) were superseded by a later decision on the same topic.`
        : "No decisions have been superseded.",
  });

  // ----------------------------------------------------------------------
  // RULE 3 — Assignment Conflict: the same task assigned to multiple owners.
  // ----------------------------------------------------------------------
  const taskMap = new Map<string, Commitment[]>();
  currentCommitments.forEach((c) => {
    const key = c.task.toLowerCase().trim();
    if (!taskMap.has(key)) taskMap.set(key, []);
    taskMap.get(key)!.push(c);
  });

  let rule3Triggered = false;
  let rule3Reason = "No duplicate task assignments detected.";

  taskMap.forEach((commits, task) => {
    const owners = Array.from(new Set(commits.map((c) => c.owner.toLowerCase())));
    if (owners.length > 1) {
      rule3Triggered = true;
      rule3Reason = `Task "${task}" is assigned to multiple distinct owners: ${commits.map((c) => c.owner).join(", ")}.`;
      conflicts.push({
        id: `conf-assign-${commits[0].id}-${commits[1].id}`,
        type: "ownership",
        title: `Conflicting task assignment for "${commits[0].task}"`,
        explanation: `Task "${commits[0].task}" was assigned to ${commits[0].owner} and later assigned to ${commits[1].owner} without explicit reassignment agreement.`,
        newEvidenceId: commits[1].evidenceId,
        existingEvidenceId: commits[0].evidenceId,
        status: "open",
        severity: "warning",
        ruleCode: "RULE_3_ASSIGNMENT",
      });
    }
  });

  rulesChecked.push({
    ruleCode: "RULE_3_ASSIGNMENT",
    name: "Task Assignment Invariant",
    triggered: rule3Triggered,
    reason: rule3Reason,
  });

  // ----------------------------------------------------------------------
  // RULE 4 — Deadline Conflict: a commitment whose task references a
  // decision's topic is due AFTER that decision's own date (the work
  // can't land in time to matter).
  // ----------------------------------------------------------------------
  let rule4Triggered = false;
  let rule4Reason = "No task deadlines collide with a related decision's date.";

  currentCommitments.forEach((commit) => {
    if (!commit.parsedDate) return;
    const commitDate = new Date(commit.parsedDate);

    activeDecisions.forEach((decision) => {
      if (!decision.parsedDate) return;
      const decisionKeyword = coreKeyword(decision.topic);
      if (!decisionKeyword || !commit.task.toLowerCase().includes(decisionKeyword)) return;

      const decisionDate = new Date(decision.parsedDate);
      if (commitDate.getTime() > decisionDate.getTime()) {
        rule4Triggered = true;
        rule4Reason = `Commitment "${commit.task}" (due ${toShortLabel(commitDate)}) lands after the related decision "${decision.topic}" (${toShortLabel(decisionDate)}).`;
        conflicts.push({
          id: `conf-deadline-${commit.id}-${decision.id}`,
          type: "deadline",
          title: `"${commit.task}" is due after ${decision.topic.toLowerCase()}`,
          explanation: `${commit.owner} committed to "${commit.task}" by ${toShortLabel(commitDate)}, which is after the ${decision.topic.toLowerCase()} of ${toShortLabel(decisionDate)} it needs to support.`,
          newEvidenceId: commit.evidenceId,
          existingEvidenceId: decision.evidenceId,
          status: "open",
          severity: "warning",
          affectedDecisionIds: [decision.id],
          ruleCode: "RULE_4_DEADLINE",
        });
      }
    });
  });

  rulesChecked.push({
    ruleCode: "RULE_4_DEADLINE",
    name: "Milestone Deadline Consistency",
    triggered: rule4Triggered,
    reason: rule4Reason,
  });

  // ----------------------------------------------------------------------
  // RULE 5 — Uncertainty Check: extracted facts that need human review.
  // Unlike Rules 1/3/4, there's no second, contradicting piece of evidence
  // here -- a single hedged statement ("we might...", "not sure yet...")
  // is the whole problem. Still pushed into `conflicts` (not just
  // `rulesChecked`) so it actually surfaces in the Conflict Prover and
  // trips the same "new_conflict" UI path the other rules do, instead of
  // silently vanishing into a field nothing renders.
  // ----------------------------------------------------------------------
  let rule5Triggered = false;
  let rule5Reason = "Confidence metric > 98% across all extracted facts.";

  const uncertainDecisions = activeDecisions.filter((d) => d.status === "uncertain");
  uncertainDecisions.forEach((decision) => {
    rule5Triggered = true;
    const confidencePct = decision.confidence != null ? `${Math.round(decision.confidence * 100)}%` : "low";
    rule5Reason = `${uncertainDecisions.length} extracted statement(s) require human review before memory commit.`;

    conflicts.push({
      id: `conf-uncertain-${decision.id}`,
      type: "uncertainty",
      title: `${decision.topic} needs human confirmation before it's treated as decided`,
      explanation:
        `The statement behind "${decision.topic}: ${decision.value}" reads as a decision but carries hedge language ` +
        `("might", "not sure", "maybe", ...), giving it only ${confidencePct} extraction confidence -- below the ` +
        `98% floor REDLINE requires before committing a fact to memory as confirmed. Review the source evidence and ` +
        `confirm or discard it before other rules treat it as settled.`,
      newEvidenceId: decision.evidenceId,
      existingEvidenceId: decision.evidenceId,
      status: "open",
      severity: "advisory",
      affectedDecisionIds: [decision.id],
      ruleCode: "RULE_5_UNCERTAINTY",
    });
  });

  rulesChecked.push({
    ruleCode: "RULE_5_UNCERTAINTY",
    name: "Confidence & Ambiguity Floor",
    triggered: rule5Triggered,
    reason: rule5Reason,
  });

  const timeline = buildTimeline(currentDecisions, currentConstraints, currentCommitments, allEvidence, conflicts);

  return {
    conflicts,
    supersededDecisions,
    activeDecisions,
    timeline,
    rulesChecked,
  };
}

/**
 * Builds a chronological timeline from the actual memory state, instead of
 * a hardcoded script. Ordering prefers each entity's parsed date; falls back
 * to insertion order (evidence is assumed appended chronologically as it's
 * ingested) when no date could be parsed.
 */
function buildTimeline(
  decisions: Decision[],
  constraints: Constraint[],
  commitments: Commitment[],
  evidence: Evidence[],
  conflicts: Conflict[]
): TimelineEvent[] {
  const evidenceIndex = new Map(evidence.map((e, i) => [e.id, i]));

  const sortKeyFor = (parsedDate: string | undefined, evidenceId: string): string => {
    if (parsedDate) return `0-${parsedDate}`;
    const idx = evidenceIndex.get(evidenceId);
    return `1-${String(idx ?? 999).padStart(6, "0")}`;
  };

  const dateLabelFor = (parsedDate: string | undefined, evidenceId: string): string => {
    if (parsedDate) return toShortLabel(new Date(parsedDate));
    return findEvidence(evidence, evidenceId)?.timestamp ?? "—";
  };

  const events: TimelineEvent[] = [];

  constraints.forEach((c) => {
    events.push({
      date: dateLabelFor(c.parsedDate, c.evidenceId),
      label: c.topic,
      detail: c.rule,
      kind: "constraint",
      evidenceId: c.evidenceId,
      sortKey: sortKeyFor(c.parsedDate, c.evidenceId),
    });
  });

  decisions.forEach((d) => {
    events.push({
      date: dateLabelFor(d.parsedDate, d.evidenceId),
      label: `${d.topic} ${d.status === "superseded" ? "superseded" : "confirmed"}`,
      detail: `${d.status === "superseded" ? "was" : "set to"} ${d.value}.`,
      kind: "decision",
      evidenceId: d.evidenceId,
      sortKey: sortKeyFor(d.parsedDate, d.evidenceId),
    });
  });

  commitments.forEach((cm) => {
    events.push({
      date: dateLabelFor(cm.parsedDate, cm.evidenceId),
      label: `${cm.task}`,
      detail: `Assigned to ${cm.owner}, due ${cm.due}.`,
      kind: "commitment",
      evidenceId: cm.evidenceId,
      sortKey: sortKeyFor(cm.parsedDate, cm.evidenceId),
    });
  });

  events.sort((a, b) => (a.sortKey ?? "").localeCompare(b.sortKey ?? ""));

  if (conflicts.length > 0) {
    events.push({
      date: "NOW",
      label: "REDLINE",
      detail: conflicts[0].title,
      kind: "conflict",
      sortKey: "9-now",
    });
  }

  return events;
}
