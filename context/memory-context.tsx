"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Meeting,
  Decision,
  Constraint,
  Commitment,
  Conflict,
  Evidence,
  ChatMessage,
} from "@/types";
import {
  INITIAL_MEETINGS,
  INITIAL_DECISIONS,
  INITIAL_CONSTRAINTS,
  INITIAL_COMMITMENTS,
  INITIAL_CONFLICTS,
  INITIAL_EVIDENCE,
} from "@/lib/seed-data";
import { runContradictionEngine, processRule2DecisionChange } from "@/lib/contradiction-engine";

interface MemoryContextType {
  meetings: Meeting[];
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  conflicts: Conflict[];
  evidence: Evidence[];
  isDemoRunning: boolean;
  demoStep: number;
  getMeetings: () => Meeting[];
  getConflicts: () => Conflict[];
  getDecisions: () => Decision[];
  getConstraints: () => Constraint[];
  getCommitments: () => Commitment[];
  getEvidence: () => Evidence[];
  getMeetingById: (id: string) => Meeting | undefined;
  getConflictById: (id: string) => Conflict | undefined;
  getDecisionTimeline: (subject?: string) => Decision[];
  getEvidenceById: (id: string) => Evidence | undefined;
  addMeeting: (
    meeting: Meeting,
    newDecisions: Decision[],
    newConstraints: Constraint[],
    newCommitments: Commitment[],
    newEvidence: Evidence[]
  ) => void;
  resetToSeed: () => void;
  dismissConflict: (id: string) => void;
  queryMeetingChat: (meetingId: string, question: string) => Promise<ChatMessage>;
  searchMemory: (query: string) => {
    decisions: Decision[];
    constraints: Constraint[];
    commitments: Commitment[];
    meetings: Meeting[];
  };
  runDemoSequence: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [constraints, setConstraints] = useState<Constraint[]>(INITIAL_CONSTRAINTS);
  const [commitments, setCommitments] = useState<Commitment[]>(INITIAL_COMMITMENTS);
  const [conflicts, setConflicts] = useState<Conflict[]>(INITIAL_CONFLICTS);
  const [evidence, setEvidence] = useState<Evidence[]>(INITIAL_EVIDENCE);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Persistence to localStorage for smooth offline refresh
  useEffect(() => {
    const savedState = localStorage.getItem("redline_memory_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.meetings) setMeetings(parsed.meetings);
        if (parsed.decisions) setDecisions(parsed.decisions);
        if (parsed.constraints) setConstraints(parsed.constraints);
        if (parsed.commitments) setCommitments(parsed.commitments);
        if (parsed.conflicts) setConflicts(parsed.conflicts);
        if (parsed.evidence) setEvidence(parsed.evidence);
      } catch {
        // Fall back to initial seed data
      }
    }
  }, []);

  const persistState = (
    m = meetings,
    d = decisions,
    c = constraints,
    com = commitments,
    conf = conflicts,
    ev = evidence
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "redline_memory_state",
        JSON.stringify({
          meetings: m,
          decisions: d,
          constraints: c,
          commitments: com,
          conflicts: conf,
          evidence: ev,
        })
      );
    }
  };

  const getMeetings = () => meetings;
  const getConflicts = () => conflicts;
  const getDecisions = () => decisions;
  const getConstraints = () => constraints;
  const getCommitments = () => commitments;
  const getEvidence = () => evidence;

  const getMeetingById = (id: string) => meetings.find((m) => m.id === id);
  const getConflictById = (id: string) => conflicts.find((c) => c.id === id);
  const getEvidenceById = (id: string) => evidence.find((e) => e.id === id);

  const getDecisionTimeline = (subject = "launch") => {
    return decisions
      .filter((d) => d.subject.toLowerCase() === subject.toLowerCase())
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  };

  const resetToSeed = () => {
    setMeetings(INITIAL_MEETINGS);
    setDecisions(INITIAL_DECISIONS);
    setConstraints(INITIAL_CONSTRAINTS);
    setCommitments(INITIAL_COMMITMENTS);
    setConflicts(INITIAL_CONFLICTS);
    setEvidence(INITIAL_EVIDENCE);
    setIsDemoRunning(false);
    setDemoStep(0);
    persistState(
      INITIAL_MEETINGS,
      INITIAL_DECISIONS,
      INITIAL_CONSTRAINTS,
      INITIAL_COMMITMENTS,
      INITIAL_CONFLICTS,
      INITIAL_EVIDENCE
    );
  };

  const dismissConflict = (id: string) => {
    const updated = conflicts.map((c) => (c.id === id ? { ...c, status: "DISMISSED" as const } : c));
    setConflicts(updated);
    persistState(meetings, decisions, constraints, commitments, updated, evidence);
  };

  const addMeeting = (
    newMeeting: Meeting,
    newDecisionsList: Decision[],
    newConstraintsList: Constraint[],
    newCommitmentsList: Commitment[],
    newEvidenceList: Evidence[]
  ) => {
    const nextMeetings = [...meetings, newMeeting];
    const nextEvidence = [...evidence, ...newEvidenceList];

    // Process decision changes (Rule 2)
    let currentDecisions = [...decisions];
    newDecisionsList.forEach((nd) => {
      const { updatedDecisions } = processRule2DecisionChange(nd, currentDecisions);
      currentDecisions = updatedDecisions;
    });

    const nextConstraints = [...constraints, ...newConstraintsList];
    const nextCommitments = [...commitments, ...newCommitmentsList];

    // Run Contradiction Engine
    const detectedConflicts = runContradictionEngine(
      currentDecisions,
      nextConstraints,
      nextCommitments,
      nextEvidence
    );

    // Merge conflicts
    const nextConflicts = [...conflicts];
    detectedConflicts.forEach((dc) => {
      if (!nextConflicts.some((c) => c.description === dc.description && c.status === "OPEN")) {
        nextConflicts.push(dc);
      }
    });

    // Mark meetings as conflicting if implicated
    const updatedMeetings = nextMeetings.map((m) => {
      const isImplicated = nextConflicts.some(
        (c) => c.status === "OPEN" && c.implicatedMeetingIds?.includes(m.id)
      );
      return { ...m, isConflicting: isImplicated };
    });

    setMeetings(updatedMeetings);
    setDecisions(currentDecisions);
    setConstraints(nextConstraints);
    setCommitments(nextCommitments);
    setConflicts(nextConflicts);
    setEvidence(nextEvidence);

    persistState(
      updatedMeetings,
      currentDecisions,
      nextConstraints,
      nextCommitments,
      nextConflicts,
      nextEvidence
    );
  };

  /**
   * Scoped meeting chat lookup function stub.
   * // TODO: replace with real retrieval & LLM chat API
   */
  const queryMeetingChat = async (meetingId: string, question: string): Promise<ChatMessage> => {
    const meeting = getMeetingById(meetingId);
    const q = question.toLowerCase();

    let text = `Searching memory for "${meeting?.title}"... `;

    if (q.includes("launch") || q.includes("date") || q.includes("when")) {
      const mDecisions = decisions.filter((d) => d.meetingId === meetingId);
      if (mDecisions.length > 0) {
        text += `In this meeting, the launch was set to "${mDecisions[0].value}".`;
        if (mDecisions[0].supersedesId) {
          text += ` Note: This decision superseded an earlier launch target.`;
        }
      } else {
        text += `No direct launch date decision was modified during this meeting.`;
      }
    } else if (q.includes("security") || q.includes("review") || q.includes("constraint")) {
      const mConstraints = constraints.filter((c) => c.meetingId === meetingId);
      if (mConstraints.length > 0) {
        text += `Extracted constraint: ${mConstraints[0].subject} ${mConstraints[0].relation} ${mConstraints[0].targetSubject} (${mConstraints[0].offsetDays} days buffer required).`;
      } else {
        text += `No security constraints were defined in this specific meeting.`;
      }
    } else if (q.includes("who") || q.includes("commit") || q.includes("task") || q.includes("owner")) {
      const mCommitments = commitments.filter((c) => c.meetingId === meetingId);
      if (mCommitments.length > 0) {
        text += `Commitments assigned: ` + mCommitments.map((c) => `${c.owner} -> ${c.task} (due ${c.dueDate})`).join("; ");
      } else {
        text += `No active commitments recorded in this meeting.`;
      }
    } else {
      text += `Based on the transcript transcript snippet "${meeting?.transcript.substring(0, 50)}...", no contradictory statements were detected for your query.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: "redline",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const searchMemory = (query: string) => {
    const q = query.toLowerCase();
    return {
      decisions: decisions.filter(
        (d) => d.subject.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
      ),
      constraints: constraints.filter(
        (c) => c.subject.toLowerCase().includes(q) || c.targetSubject.toLowerCase().includes(q)
      ),
      commitments: commitments.filter(
        (com) => com.owner.toLowerCase().includes(q) || com.task.toLowerCase().includes(q)
      ),
      meetings: meetings.filter(
        (m) => m.title.toLowerCase().includes(q) || m.transcript.toLowerCase().includes(q)
      ),
    };
  };

  /**
   * Deterministic "Run Demo" step-by-step playback controller
   */
  const runDemoSequence = () => {
    setIsDemoRunning(true);
    setDemoStep(1);

    // Step 1: Seed Meeting 1 (Product Launch Planning)
    setMeetings([INITIAL_MEETINGS[0]]);
    setDecisions([INITIAL_DECISIONS[0]]);
    setConstraints([]);
    setCommitments([]);
    setConflicts([]);
    setEvidence([INITIAL_EVIDENCE[0]]);

    // Step 2: Seed Meeting 2 (Security Planning) after 2 seconds
    setTimeout(() => {
      setDemoStep(2);
      setMeetings([INITIAL_MEETINGS[0], INITIAL_MEETINGS[1]]);
      setConstraints([INITIAL_CONSTRAINTS[0]]);
      setCommitments([INITIAL_COMMITMENTS[0], INITIAL_COMMITMENTS[1]]);
      setEvidence([
        INITIAL_EVIDENCE[0],
        INITIAL_EVIDENCE[1],
        INITIAL_EVIDENCE[2],
        INITIAL_EVIDENCE[3],
      ]);
    }, 2500);

    // Step 3: Seed Meeting 3 (Launch Adjustment) -> Trigger Conflict after 5 seconds
    setTimeout(() => {
      setDemoStep(3);
      setMeetings(INITIAL_MEETINGS);
      setDecisions(INITIAL_DECISIONS);
      setEvidence(INITIAL_EVIDENCE);
      setConflicts(INITIAL_CONFLICTS);
      setIsDemoRunning(false);
      persistState(
        INITIAL_MEETINGS,
        INITIAL_DECISIONS,
        INITIAL_CONSTRAINTS,
        INITIAL_COMMITMENTS,
        INITIAL_CONFLICTS,
        INITIAL_EVIDENCE
      );
    }, 5500);
  };

  return (
    <MemoryContext.Provider
      value={{
        meetings,
        decisions,
        constraints,
        commitments,
        conflicts,
        evidence,
        isDemoRunning,
        demoStep,
        getMeetings,
        getConflicts,
        getDecisions,
        getConstraints,
        getCommitments,
        getEvidence,
        getMeetingById,
        getConflictById,
        getDecisionTimeline,
        getEvidenceById,
        addMeeting,
        resetToSeed,
        dismissConflict,
        queryMeetingChat,
        searchMemory,
        runDemoSequence,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};
