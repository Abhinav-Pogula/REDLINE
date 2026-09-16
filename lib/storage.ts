import { Decision, Constraint, Commitment, Conflict, Evidence, TimelineEvent } from "./data";
import { canonicalHeroScenario, compliantScenario, Scenario } from "./demo";
import { evaluateProjectMemory, EngineResult } from "./conflict-engine";

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
