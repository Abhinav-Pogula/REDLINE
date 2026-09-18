"use client";

import { useState, useEffect, useCallback } from "react";
import { Screen, CaptureStatus } from "../lib/types";
import { Decision, Constraint, Commitment, Conflict, Evidence, TimelineEvent } from "../lib/data";
import { canonicalHeroScenario, compliantScenario, Scenario } from "../lib/demo";
import { evaluateProjectMemory, EngineResult } from "../lib/conflict-engine";
import { loadRedlineState, saveRedlineState, RedlineState } from "../lib/storage";

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

  // Active scenario, backend status, and memory state
  const [activeScenarioId, setActiveScenarioId] = useState<string>("scenario-conflict");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [decisions, setDecisions] = useState<Decision[]>([...canonicalHeroScenario.decisions]);
  const [constraints, setConstraints] = useState<Constraint[]>([...canonicalHeroScenario.constraints]);
  const [commitments, setCommitments] = useState<Commitment[]>([...canonicalHeroScenario.commitments]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([...canonicalHeroScenario.evidence]);

  // Fetch initial memory state from GET /api/dashboard with fallback to client-side scenario
  const loadFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (
        Array.isArray(data.decisions) &&
        Array.isArray(data.constraints) &&
        Array.isArray(data.commitments) &&
        Array.isArray(data.evidence)
      ) {
        setDecisions(data.decisions);
        setConstraints(data.constraints);
        setCommitments(data.commitments);
        setEvidenceList(data.evidence);
        setIsBackendConnected(true);
        return true;
      }
      throw new Error("Invalid payload format");
    } catch (_err) {
      setIsBackendConnected(false);
      setDecisions([...canonicalHeroScenario.decisions]);
      setConstraints([...canonicalHeroScenario.constraints]);
      setCommitments([...canonicalHeroScenario.commitments]);
      setEvidenceList([...canonicalHeroScenario.evidence]);
      return false;
    }
  }, []);

  useEffect(() => {
    loadFromServer();
  }, [loadFromServer]);

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

  // Reset to specified scenario (Hero Contradiction vs Verified Compliant)
  const loadScenario = useCallback(
    async (scenarioId: "scenario-conflict" | "scenario-compliant") => {
      const scenario = scenarioId === "scenario-compliant" ? compliantScenario : canonicalHeroScenario;
      setActiveScenarioId(scenario.id);
      setCurrentScreen("dashboard");
      setCaptureStatus("idle");
      setPipelineStep(0);

      let backendSuccess = false;
      try {
        const res = await fetch("/api/demo/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId }),
        });
        if (res.ok) {
          backendSuccess = await loadFromServer();
        }
      } catch (_err) {
        // Ignore network errors and rely on local state fallback below
      }

      if (!backendSuccess) {
        setDecisions([...scenario.decisions]);
        setConstraints([...scenario.constraints]);
        setCommitments([...scenario.commitments]);
        setEvidenceList([...scenario.evidence]);
      }

      showToast(
        scenarioId === "scenario-compliant"
          ? "Switched to Compliant Input: Launch after SecOps approval. Conflict Engine: 0 conflicts."
          : "Reset to Hero Demo Scenario: Contradiction active."
      );
    },
    [loadFromServer, showToast]
  );

  // HERO JUDGE DEMO MODE AUTOMATION
  const runHeroDemo = useCallback(() => {
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
    isBackendConnected,
    loadFromServer,
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
