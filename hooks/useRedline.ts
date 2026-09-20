"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Screen, CaptureStatus, ExtractOutcome } from "../lib/types";
import { Decision, Constraint, Commitment, Conflict, Evidence, TimelineEvent } from "../lib/data";
import { canonicalHeroScenario, compliantScenario, Scenario } from "../lib/demo";
import { evaluateProjectMemory, EngineResult } from "../lib/conflict-engine";
import { loadRedlineState, resetToScenario } from "../lib/storage";
import { ingestTranscript } from "../lib/memory-engine";

export function useRedline() {
  // Navigation screen and capture status are strictly decoupled
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [historyStack, setHistoryStack] = useState<Screen[]>(["dashboard"]);
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("idle");
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("m3");
  const [deckIndex, setDeckIndex] = useState<number>(0);

  // Alert Modal state
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active scenario and memory state. There is no server in this build --
  // extraction and persistence both run entirely on-device (lib/pipeline.ts
  // + lib/memory-engine.ts, localStorage via lib/storage.ts) -- so the
  // engine is always available, unlike the earlier SQLite/API-route build
  // this replaces which could be "offline" if its server wasn't reachable.
  const [activeScenarioId, setActiveScenarioId] = useState<string>("scenario-conflict");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [lastExtracted, setLastExtracted] = useState<{
    decisions: Decision[];
    constraints: Constraint[];
    commitments: Commitment[];
  } | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([...canonicalHeroScenario.decisions]);
  const [constraints, setConstraints] = useState<Constraint[]>([...canonicalHeroScenario.constraints]);
  const [commitments, setCommitments] = useState<Commitment[]>([...canonicalHeroScenario.commitments]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([...canonicalHeroScenario.evidence]);

  // Hydrate from whatever was persisted locally (a prior paste-transcript
  // session), falling back to the seeded hero scenario on first run.
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const persisted = loadRedlineState();
    setDecisions(persisted.decisions);
    setConstraints(persisted.constraints);
    setCommitments(persisted.commitments);
    setEvidenceList(persisted.evidence);
    setActiveScenarioId(persisted.currentScenarioId);
  }, []);

  // Evaluated conflict engine results
  const [engineResult, setEngineResult] = useState<EngineResult>(() =>
    evaluateProjectMemory(canonicalHeroScenario.decisions, canonicalHeroScenario.constraints, canonicalHeroScenario.commitments, canonicalHeroScenario.evidence)
  );

  // Selected conflict for inspection
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(() =>
    engineResult.conflicts.length > 0 ? engineResult.conflicts[0] : null
  );

  // Re-run conflict engine whenever decisions, constraints, commitments or evidence change
  useEffect(() => {
    const result = evaluateProjectMemory(decisions, constraints, commitments, evidenceList);
    setEngineResult(result);
    if (result.conflicts.length > 0) {
      setSelectedConflict(result.conflicts[0]);
    } else {
      setSelectedConflict(null);
    }
  }, [decisions, constraints, commitments, evidenceList]);

  const showToast = useCallback((msg: string, durationMs = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, durationMs);
  }, []);

  const showAlert = useCallback((title: string, message: string) => {
    setAlertModal({ isOpen: true, title, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Screen navigation
  const navigate = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
    setHistoryStack((prev) => [...prev, screen]);
    setDrawerOpen(false);
  }, []);

  const goBack = useCallback(() => {
    setHistoryStack((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen("dashboard");
        return ["dashboard"];
      }
      const newStack = prev.slice(0, -1);
      const last = newStack[newStack.length - 1];
      setCurrentScreen(last);
      return newStack;
    });
  }, []);

  // Paste-transcript -> structured memory, entirely on-device (no network call).
  //
  // Returns an ExtractOutcome (not just void) because the desktop shell
  // (components/desktop/DesktopWindowFrame.tsx) keeps its own tab state
  // completely separate from `currentScreen` here -- that state only drives
  // the mobile view in app/page.tsx. Without a return value, a paste on
  // desktop that superseded a decision or hit an existing (but not new)
  // conflict had zero visible feedback: no navigation, no toast, no alert,
  // since none of those are wired into the desktop tree. Desktop callers use
  // this return value to render their own inline feedback instead.
  const extractTranscript = useCallback(
    async (transcript: string): Promise<ExtractOutcome> => {
      if (!transcript || !transcript.trim()) {
        return { status: "empty", message: "Paste a transcript first." };
      }
      setIsExtracting(true);
      try {
        const beforeConflictIds = new Set(engineResult.conflicts.map((c) => c.id));

        const result = await ingestTranscript({
          text: transcript,
          context: { source: "manual_paste" },
          currentDecisions: decisions,
          currentConstraints: constraints,
          currentCommitments: commitments,
          currentEvidence: evidenceList,
        });

        setDecisions(result.mergedDecisions);
        setConstraints(result.mergedConstraints);
        setCommitments(result.mergedCommitments);
        setEvidenceList(result.mergedEvidence);
        setEngineResult(result.engineResult);
        setLastExtracted({
          decisions: result.newDecisions,
          constraints: result.newConstraints,
          commitments: result.newCommitments,
        });

        const newConflict = result.engineResult.conflicts.find(
          (c) => !beforeConflictIds.has(c.id)
        );

        // A decision that superseded a prior one on the same topic doesn't
        // register as a "conflict" (Rule 2 just tracks it), so without this
        // it merges into memory completely silently -- pasting "we switched
        // to MongoDB instead of Postgres" gave no on-screen confirmation
        // that REDLINE even noticed the earlier Postgres decision existed.
        // Look the prior decision up in `mergedDecisions` (old state + every
        // decision this same paste produced), not just the pre-paste state
        // -- a single transcript can contain both the original decision and
        // the one that supersedes it (as in that exact Postgres/MongoDB
        // example), and the "prior" one only exists in `newDecisions` then.
        const supersededPairs = result.newDecisions
          .filter((d) => d.supersedesDecisionId)
          .map((d) => {
            const prior = result.mergedDecisions.find((p) => p.id === d.supersedesDecisionId);
            return prior ? `${d.topic}: "${prior.value}" → "${d.value}"` : null;
          })
          .filter((s): s is string => Boolean(s));

        if (result.newDecisions.length === 0 && result.newConstraints.length === 0 && result.newCommitments.length === 0) {
          const message =
            "The parser didn't find a decision, constraint, or commitment in that text. Try a sentence like \"We'll launch on October 10\" or \"The security review must be completed before launch.\"";
          showAlert("Nothing extracted", message);
          setCurrentScreen("result");
          return { status: "empty", message };
        }

        if (newConflict) {
          setSelectedConflict(newConflict);
          setCurrentScreen("conflict");
          const message =
            supersededPairs.length > 0
              ? `New conflict identified! Also updated: ${supersededPairs.join("; ")}`
              : "New conflict identified from transcript!";
          showToast(message);
          return { status: "new_conflict", message };
        }

        if (result.engineResult.conflicts.length > 0) {
          setSelectedConflict(result.engineResult.conflicts[0]);
        }
        setCurrentScreen("result");

        if (supersededPairs.length > 0) {
          const message = `Decision updated: ${supersededPairs.join("; ")}`;
          showToast(message);
          return { status: "superseded", message };
        }

        const message = "Transcript processed successfully!";
        showToast(message);
        return { status: "ok", message };
      } catch (err: any) {
        const message = err?.message || "Failed to extract transcript.";
        showAlert("Extraction Error", message);
        return { status: "error", message };
      } finally {
        setIsExtracting(false);
      }
    },
    [decisions, constraints, commitments, evidenceList, engineResult.conflicts, showAlert, showToast]
  );

  // Reset to specified scenario (Hero Contradiction vs Verified Compliant)
  const loadScenario = useCallback(
    (scenarioId: "scenario-conflict" | "scenario-compliant") => {
      setLastExtracted(null);
      const state = resetToScenario(scenarioId);
      setActiveScenarioId(state.currentScenarioId);
      setDecisions(state.decisions);
      setConstraints(state.constraints);
      setCommitments(state.commitments);
      setEvidenceList(state.evidence);
      setEngineResult(state.engineResult);
      setCurrentScreen("dashboard");
      setCaptureStatus("idle");
      setPipelineStep(0);

      showToast(
        scenarioId === "scenario-compliant"
          ? "Switched to Compliant Input: Launch after SecOps approval. Conflict Engine: 0 conflicts."
          : "Reset to Hero Demo Scenario: Contradiction active."
      );
    },
    [showToast]
  );

  // HERO JUDGE DEMO MODE AUTOMATION -- scripted replay, zero dependency on
  // the extraction engine or any network access (PRD Section 10's
  // guaranteed-to-work fallback).
  const runHeroDemo = useCallback(() => {
    setLastExtracted(null);
    // 1. Reset to hero scenario with contradiction
    const scenario = canonicalHeroScenario;
    setActiveScenarioId(scenario.id);
    setDecisions([...scenario.decisions]);
    setConstraints([...scenario.constraints]);
    setCommitments([...scenario.commitments]);
    setEvidenceList([...scenario.evidence]);

    showToast("Judge Demo Mode Initialized: Running Meeting Sequence Replay...");
    setCurrentScreen("capture");
    setCaptureStatus("capturing");
    setPipelineStep(0);

    // 2. Transition to processing
    setTimeout(() => {
      setCaptureStatus("processing");
      // Step through CAPTURE -> STRUCT -> RECALL -> CMPR -> FLAG -> PROVE
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setPipelineStep(step);
        if (step >= 5) {
          clearInterval(interval);
          setCaptureStatus("complete");
          showToast("Forensic extraction complete. Critical contradiction flagged!");
          setCurrentScreen("result");
        }
      }, 600);
    }, 1500);
  }, [showToast]);

  return {
    currentScreen,
    navigate,
    goBack,
    captureStatus,
    setCaptureStatus,
    pipelineStep,
    setPipelineStep,
    drawerOpen,
    setDrawerOpen,
    selectedMeetingId,
    setSelectedMeetingId,
    deckIndex,
    setDeckIndex,
    alertModal,
    showAlert,
    closeAlert,
    toastMessage,
    showToast,
    activeScenarioId,
    // Always true: extraction/persistence are on-device, there's no server to lose connection to.
    isBackendConnected: true,
    isExtracting,
    lastExtracted,
    extractTranscript,
    loadScenario,
    runHeroDemo,
    decisions,
    constraints,
    commitments,
    evidenceList,
    engineResult,
    selectedConflict,
    setSelectedConflict,
  };
}
