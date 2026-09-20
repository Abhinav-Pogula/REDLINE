"use client";

import React from "react";
import { Conflict, Evidence, getEvidence } from "../../lib/data";

interface DesktopConflictsProps {
  conflicts: Conflict[];
  evidenceList: Evidence[];
  onOpenCalendar: () => void;
}

// Maps every rule the conflict engine (lib/conflict-engine.ts) can actually
// trigger to a display label -- this used to be a hardcoded "RULE 1 •
// DEPENDENCY CONFLICT" badge regardless of which rule fired, which was
// wrong for an ownership (RULE_3) or deadline (RULE_4) conflict.
const RULE_LABELS: Record<string, string> = {
  RULE_1_DEPENDENCY: "RULE 1 • DEPENDENCY CONFLICT",
  RULE_3_ASSIGNMENT: "RULE 3 • OWNERSHIP CONFLICT",
  RULE_4_DEADLINE: "RULE 4 • DEADLINE CONFLICT",
};

function formatConfidence(confidence?: number): string {
  if (confidence == null) return "N/A (not reported)";
  return `${(confidence * 100).toFixed(1)}%`;
}

export const DesktopConflicts: React.FC<DesktopConflictsProps> = ({
  conflicts,
  evidenceList,
  onOpenCalendar,
}) => {
  const activeConflict = conflicts.length > 0 ? conflicts[0] : null;

  if (!activeConflict) {
    return (
      <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-conflicts">
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold font-display text-neutral-900">
            Zero Contradictions Detected
          </h2>
          <p className="text-sm text-neutral-600 font-sans max-w-md mx-auto leading-relaxed">
            All current commitments and decisions have been verified against active constraints. The local memory ledger is in a compliant state.
          </p>
        </div>
      </div>
    );
  }

  const newEvidence = evidenceList.find((e) => e.id === activeConflict.newEvidenceId) || getEvidence(activeConflict.newEvidenceId);
  const existingEvidence = evidenceList.find((e) => e.id === activeConflict.existingEvidenceId) || getEvidence(activeConflict.existingEvidenceId);

  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-conflicts">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-redline-red"></span>
            <span>FORENSIC CONFLICT PROVER</span>
            <span>//</span>
            <span>ON-DEVICE VERIFICATION ENGINE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            Decision Contradiction Analysis
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-red-100 text-redline-red font-mono text-xs font-bold">
            {RULE_LABELS[activeConflict.ruleCode ?? ""] ?? `${activeConflict.type.toUpperCase()} CONFLICT`}
          </span>
        </div>
      </div>

      {/* Primary Explanation Box */}
      <div className="bg-[#fdeaea] border-2 border-redline-red rounded-2xl p-6 shadow-sm space-y-2">
        <h2 className="text-xl font-bold font-display text-neutral-900 leading-snug">
          {activeConflict.title}
        </h2>
        <div className="bg-white/80 rounded-xl p-4 border border-redline-red/20 font-sans text-sm text-neutral-800 leading-relaxed">
          <span className="font-mono text-xs font-bold text-redline-red uppercase block mb-1">
            INVARIANT VIOLATION PROOF:
          </span>
          {activeConflict.explanation}
        </div>
      </div>

      {/* WIDE SIDE-BY-SIDE EVIDENCE PROOF STACK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: NEW EVIDENCE */}
        <div className="bg-white rounded-2xl border-2 border-redline-red/70 p-6 shadow-xs space-y-4 relative">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-redline-red bg-red-100 px-2.5 py-1 rounded">
              NEW EVIDENCE • NODE B
            </span>
            <span className="text-neutral-500">{newEvidence?.timestamp || "4:42 PM"}</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-neutral-400 block uppercase">ORIGIN SESSION</span>
            <p className="text-base font-bold font-display text-neutral-900">
              {newEvidence?.meetingTitle || "Meeting 03"} ({newEvidence?.source?.toUpperCase() || "TEAMS"})
            </p>
          </div>
          <blockquote className="border-l-4 border-redline-red pl-4 py-2 font-mono text-sm text-neutral-800 italic bg-neutral-50 rounded-r">
            &ldquo;{newEvidence?.text || "Let's move the launch to September 28."}&rdquo;
          </blockquote>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">RULE TRIGGERED:</span>
              <span className="font-bold text-neutral-900">{activeConflict.ruleCode ?? activeConflict.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">CONFIDENCE:</span>
              <span className="font-bold text-emerald-600">{formatConfidence(newEvidence?.confidence)} (Air-Gapped)</span>
            </div>
          </div>
        </div>

        {/* Column 2: EXISTING CONFLICTING MEMORY */}
        <div className="bg-white rounded-2xl border border-neutral-300 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-neutral-700 bg-neutral-200 px-2.5 py-1 rounded">
              EXISTING MEMORY • NODE A
            </span>
            <span className="text-neutral-500">{existingEvidence?.timestamp || "2:18 PM"}</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-neutral-400 block uppercase">ORIGIN SESSION</span>
            <p className="text-base font-bold font-display text-neutral-900">
              {existingEvidence?.meetingTitle || "Meeting 02"} ({existingEvidence?.source?.toUpperCase() || "ZOOM"})
            </p>
          </div>
          <blockquote className="border-l-4 border-neutral-400 pl-4 py-2 font-mono text-sm text-neutral-800 italic bg-neutral-50 rounded-r">
            &ldquo;{existingEvidence?.text || "The security review must be completed two days before launch."}&rdquo;
          </blockquote>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">CONFLICT STATUS:</span>
              <span className="font-bold text-redline-red">{activeConflict.status.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">SEVERITY:</span>
              <span className="font-bold text-neutral-900">{(activeConflict.severity ?? "unspecified").toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold rounded-xl transition">
            EXPORT EVIDENCE PACKAGE (.ZIP)
          </button>
          <button className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-mono text-xs font-bold rounded-xl transition">
            FLAG UNDER EXECUTIVE REVIEW
          </button>
        </div>
        <button
          onClick={onOpenCalendar}
          className="px-4 py-2 bg-redline-red hover:bg-redline-redHover text-white font-mono text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span>VIEW IN CALENDAR MATRIX</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};
