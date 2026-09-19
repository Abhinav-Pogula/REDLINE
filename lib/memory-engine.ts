// ============================================================================
// REDLINE — Memory ingest orchestrator
// The single entry point the (future) UI wiring calls: hand it raw pasted
// text plus the current in-memory state, get back new Evidence/Decisions/
// Constraints/Commitments, the merged state, and a freshly evaluated
// conflict-engine result — all in one deterministic, offline call.
// ============================================================================

import {
  Decision,
  Constraint,
  Commitment,
  Evidence,
  ExtractionContext,
  ExtractionProvider,
  IngestResult,
} from "./types";
import { defaultExtractionProvider } from "./pipeline";
import { evaluateProjectMemory } from "./conflict-engine";

export interface IngestInput {
  /** Raw pasted transcript / meeting notes text. */
  text: string;
  context?: ExtractionContext;
  currentDecisions: Decision[];
  currentConstraints: Constraint[];
  currentCommitments: Commitment[];
  currentEvidence: Evidence[];
  /** Swap in a different ExtractionProvider (e.g. a future LLM-backed one) without touching call sites. */
  extractionProvider?: ExtractionProvider;
  /** Injectable for deterministic tests; defaults to a real time+counter based generator. */
  idGenerator?: () => string;
}

function makeIdGenerator(): () => string {
  let counter = 0;
  return () => {
    counter += 1;
    return `${Date.now().toString(36)}${counter}`;
  };
}

function defaultTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/**
 * Runs a pasted transcript through extraction, merges the results into the
 * existing memory (handling decision supersede-by-topic along the way), and
 * re-evaluates the conflict engine against the merged state.
 *
 * Pure function apart from the extraction provider call and id/time
 * generation (both injectable) — safe to unit test and safe to call
 * repeatedly without side effects on its inputs.
 */
export async function ingestTranscript(input: IngestInput): Promise<IngestResult> {
  const {
    text,
    context = {},
    currentDecisions,
    currentConstraints,
    currentCommitments,
    currentEvidence,
    extractionProvider = defaultExtractionProvider,
  } = input;

  const nextId = input.idGenerator ?? makeIdGenerator();

  const extraction = await extractionProvider.extractEntities(text, context);

  const meetingId = context.meetingId ?? `manual-${nextId()}`;
  const meetingTitle = context.meetingTitle ?? "Pasted Transcript";
  const source = context.source ?? "manual_paste";
  const timestamp = context.timestamp ?? defaultTimestamp();

  const newEvidence: Evidence[] = [];
  const newDecisions: Decision[] = [];
  const newConstraints: Constraint[] = [];
  const newCommitments: Commitment[] = [];

  const mergedDecisions: Decision[] = [...currentDecisions];
  const mergedConstraints: Constraint[] = [...currentConstraints];

  function makeEvidence(sourceText: string, confidence?: number): Evidence {
    const ev: Evidence = {
      id: `ev-${nextId()}`,
      meetingId,
      meetingTitle,
      source,
      timestamp,
      text: sourceText,
      confidence,
    };
    newEvidence.push(ev);
    return ev;
  }

  extraction.decisions.forEach((partial) => {
    const { sourceText, confidence, ...rest } = partial;
    const ev = makeEvidence(sourceText, confidence);
    const topic = rest.topic ?? "General";
    const priorActive = mergedDecisions.find(
      (d) =>
        d.topic.toLowerCase() === topic.toLowerCase() &&
        !mergedDecisions.some((o) => o.supersedesDecisionId === d.id)
    );
    const decision: Decision = {
      id: `d-${nextId()}`,
      topic,
      value: rest.value ?? sourceText,
      status: "confirmed",
      evidenceId: ev.id,
      supersedesDecisionId: priorActive?.id,
      parsedDate: rest.parsedDate,
      confidence,
    };
    newDecisions.push(decision);
    mergedDecisions.push(decision);
  });

  extraction.constraints.forEach((partial) => {
    const { sourceText, confidence, ...rest } = partial;
    const ev = makeEvidence(sourceText, confidence);
    const constraint: Constraint = {
      id: `c-${nextId()}`,
      topic: rest.topic ?? "General",
      rule: rest.rule ?? sourceText,
      status: rest.status ?? "active",
      evidenceId: ev.id,
      leadTimeDays: rest.leadTimeDays,
      confidence,
    };
    newConstraints.push(constraint);
    mergedConstraints.push(constraint);
  });

  extraction.commitments.forEach((partial) => {
    const { sourceText, confidence, ...rest } = partial;
    const ev = makeEvidence(sourceText, confidence);
    const commitment: Commitment = {
      id: `cm-${nextId()}`,
      task: rest.task ?? sourceText,
      owner: rest.owner ?? "Unassigned",
      due: rest.due ?? "Unspecified",
      evidenceId: ev.id,
      status: "pending",
      parsedDate: rest.parsedDate,
      confidence,
    };
    newCommitments.push(commitment);
  });

  const mergedCommitments: Commitment[] = [...currentCommitments, ...newCommitments];
  const mergedEvidence: Evidence[] = [...currentEvidence, ...newEvidence];

  const engineResult = evaluateProjectMemory(mergedDecisions, mergedConstraints, mergedCommitments, mergedEvidence);

  return {
    newEvidence,
    newDecisions,
    newConstraints,
    newCommitments,
    mergedDecisions,
    mergedConstraints,
    mergedCommitments,
    mergedEvidence,
    engineResult,
    statements: extraction.statements,
  };
}
