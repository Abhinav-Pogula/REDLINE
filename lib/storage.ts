import { Decision, Constraint, Commitment, Conflict, Evidence, TimelineEvent } from "./data";
import { canonicalHeroScenario, compliantScenario, Scenario } from "./demo";
import { evaluateProjectMemory, EngineResult } from "./conflict-engine";
import { IngestResult } from "./types";

export interface RedlineState {
  currentScenarioId: string;
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  evidence: Evidence[];
  engineResult: EngineResult;
  selectedConflictId: string | null;
  lastUpdated: string;
}

const STORAGE_KEY = "redline_work_memory_v1";

export function getInitialRedlineState(): RedlineState {
  const scenario = canonicalHeroScenario;
  const engineResult = evaluateProjectMemory(
    scenario.decisions,
    scenario.constraints,
    scenario.commitments,
    scenario.evidence
  );

  return {
    currentScenarioId: scenario.id,
    decisions: scenario.decisions,
    constraints: scenario.constraints,
    commitments: scenario.commitments,
    evidence: scenario.evidence,
    engineResult,
    selectedConflictId: engineResult.conflicts.length > 0 ? engineResult.conflicts[0].id : null,
    lastUpdated: new Date().toISOString(),
  };
}

export function loadRedlineState(): RedlineState {
  if (typeof window === "undefined") return getInitialRedlineState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Re-evaluate to ensure consistency
      const engineResult = evaluateProjectMemory(
        parsed.decisions,
        parsed.constraints,
        parsed.commitments,
        parsed.evidence
      );
      return { ...parsed, engineResult };
    }
  } catch (e) {
    console.warn("Could not load from localStorage, using initial memory state.", e);
  }
  return getInitialRedlineState();
}

export function saveRedlineState(state: RedlineState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not write to localStorage", e);
  }
}

/**
 * Folds a memory-engine ingest result into an existing RedlineState — the
 * one call the UI wiring phase will need after a user pastes a transcript.
 * Not wired up to the hook/components yet by design (backend-first, per
 * plan); kept here so wiring is a one-line call rather than another
 * merge implementation.
 */
export function mergeIngestResultIntoState(state: RedlineState, ingest: IngestResult): RedlineState {
  const newState: RedlineState = {
    ...state,
    decisions: ingest.mergedDecisions,
    constraints: ingest.mergedConstraints,
    commitments: ingest.mergedCommitments,
    evidence: ingest.mergedEvidence,
    engineResult: ingest.engineResult,
    selectedConflictId: ingest.engineResult.conflicts.length > 0 ? ingest.engineResult.conflicts[0].id : null,
    lastUpdated: new Date().toISOString(),
  };
  saveRedlineState(newState);
  return newState;
}

export function resetToScenario(scenarioId: "scenario-conflict" | "scenario-compliant"): RedlineState {
  const scenario = scenarioId === "scenario-compliant" ? compliantScenario : canonicalHeroScenario;
  const engineResult = evaluateProjectMemory(
    scenario.decisions,
    scenario.constraints,
    scenario.commitments,
    scenario.evidence
  );
  const newState: RedlineState = {
    currentScenarioId: scenario.id,
    decisions: [...scenario.decisions],
    constraints: [...scenario.constraints],
    commitments: [...scenario.commitments],
    evidence: [...scenario.evidence],
    engineResult,
    selectedConflictId: engineResult.conflicts.length > 0 ? engineResult.conflicts[0].id : null,
    lastUpdated: new Date().toISOString(),
  };
  saveRedlineState(newState);
  return newState;
}
