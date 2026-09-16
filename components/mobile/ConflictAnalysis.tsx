"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface ConflictAnalysisProps {
  onNavigate: (screen: Screen) => void;
  selectedConflict?: any;
  evidenceList?: any[];
  onShowAlert?: (title: string, message: string) => void;
  onHandoffToDesktop?: () => void;
}

export const ConflictAnalysis: React.FC<ConflictAnalysisProps> = ({
  onNavigate,
  onShowAlert,
}) => {
  const playClip = (clipName: "A" | "B") => {
    if (onShowAlert) {
      if (clipName === "A") {
        onShowAlert("Audio Moment [09:12]", "Product Roadmap Sync (Google Meet): 'Team agreed to advance the general availability launch to October 12th.' - Head of Product");
      } else {
        onShowAlert("Audio Moment [24:45]", "SecOps Audit Review (Zoom): 'Under no circumstances may we launch before the complete 14-day security observation concludes on Oct 19.' - Lead Cryptographer");
      }
    }
  };

  const handleResolve = () => {
    if (onShowAlert) {
      onShowAlert("Resolution Flagged", "Conflict marked as under executive review. Discrepancy logged to cryptographic evidence chain.");
    }
  };

  return (
    <section id="view-audit" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Top Sub-Nav Telemetry Tag */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="px-2 py-0.5 rounded-full bg-red-100 text-brand-red font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          CRITICAL DESYNC
        </span>
        <span className="text-neutral-500">REF: #RL-9041-C</span>
        <span className="text-neutral-400 font-mono">HASH: 7F4A...B991</span>
      </div>

      {/* Contradiction Alert Card */}
      <div className="bg-[#fdeaea] border-2 border-brand-red rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-brand-red font-mono text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">!</span>
            <span>CONTRADICTION DETECTED</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-600 font-bold">CONFIDENCE: 98.4%</span>
        </div>
        <h2 className="font-display font-bold text-lg text-neutral-950 leading-snug">
          Launch Date Shift Violates Security Buffer
        </h2>
        <p className="text-xs text-neutral-700 font-sans mt-1.5 leading-relaxed">
          Autonomous memory inspection flagged an irreconcilable scheduling paradox between live tactical roadmaps and cryptographically locked security thresholds.
        </p>
      </div>

      {/* TEMPORAL DRIFT DELTA COMPONENT */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-neutral-500 font-bold">TEMPORAL DRIFT DELTA</span>
          <span className="text-brand-red font-bold text-sm bg-red-50 px-2 py-0.5 rounded">-7 CALENDAR DAYS</span>
        </div>
        <div className="relative py-2">
          <div className="h-2 bg-neutral-100 rounded-full w-full relative overflow-hidden">
            <div className="absolute left-1/4 right-1/4 h-full bg-brand-red"></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2">
            <div>
              <span className="block text-brand-red font-bold">OCT 12 (REQ)</span>
              <span>GA Commit Window</span>
            </div>
            <div className="text-center font-bold text-brand-red">
              Collision Window (168 Hours)
            </div>
            <div className="text-right">
              <span className="block text-neutral-900 font-bold">OCT 19 (MIN SEC)</span>
              <span>SecOps Lock End</span>
            </div>
          </div>
        </div>
      </div>

      {/* FORMAL LOGIC AUDIT FORMULA */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-neutral-100 pb-1.5">
          <span className="font-bold flex items-center gap-1">
            <span>🧮</span> FORMAL LOGIC AUDIT
          </span>
          <span>KERNEL // PROVER-04</span>
        </div>
        <div className="bg-neutral-50 p-3 rounded-xl space-y-1.5 text-[11px]">
          <div className="text-neutral-700 flex justify-between">
            <span className="text-brand-red font-bold">[New Decision: Launch Oct 12]</span>
            <span className="text-neutral-400">T_0</span>
          </div>
          <div className="text-neutral-700 flex justify-between">
            <span>+ [Existing Constraint: 14-Day Audit through Oct 19]</span>
            <span className="text-neutral-400">C_sec</span>
          </div>
          <div className="text-neutral-700 flex justify-between">
            <span>+ [Current Status: Buffer Deficit = -7 Days]</span>
            <span className="text-brand-red font-bold">&Delta;T &lt; 0</span>
          </div>
          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-bold text-brand-red">
            <span>🛡 = DIRECT CONTRADICTION</span>
            <span className="bg-red-100 text-brand-red px-1.5 py-0.5 rounded text-[10px]">FAIL_FAST</span>
          </div>
        </div>
      </div>

      {/* COLLIDING TELEMETRY STREAMS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span className="font-bold uppercase">COLLIDING TELEMETRY STREAMS</span>
          <span>2 NODES IDENTIFIED</span>
        </div>
        {/* Node A */}
        <div className="bg-white border border-neutral-200 border-l-4 border-l-brand-red rounded-xl p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1 text-brand-red font-bold">
              <span>NEW EVIDENCE</span>
              <span>•</span>
              <span>TODAY 14:15</span>
            </div>
            <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">TRANSCRIPT_TX8</span>
          </div>
          <p className="text-xs font-mono text-neutral-500">Product Roadmap Sync (Google Meet)</p>
          <blockquote className="bg-neutral-50 p-2.5 rounded-lg text-xs font-mono italic text-neutral-800">
            &quot;Team agreed to advance the general availability launch to October 12th.&quot;
          </blockquote>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <button
              onClick={() => playClip("A")}
              className="text-brand-red font-bold flex items-center gap-1 hover:underline"
            >
              <span>▶</span> View audio moment [09:12]
            </button>
            <span className="text-neutral-500">Speaker: Head of Product</span>
          </div>
        </div>
        {/* Node B */}
        <div className="bg-white border border-neutral-200 border-l-4 border-l-neutral-800 rounded-xl p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1 text-neutral-800 font-bold">
              <span>EXISTING CONSTRAINT</span>
              <span>•</span>
              <span>SEP 15</span>
            </div>
            <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">IMMUTABLE_SRC</span>
          </div>
          <p className="text-xs font-mono text-neutral-500">SecOps Audit Review (Zoom)</p>
          <blockquote className="bg-neutral-50 p-2.5 rounded-lg text-xs font-mono italic text-neutral-800">
            &quot;Under no circumstances may we launch before the complete 14-day security observation concludes on Oct 19.&quot;
          </blockquote>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <button
              onClick={() => playClip("B")}
              className="text-neutral-800 font-bold flex items-center gap-1 hover:underline"
            >
              <span>▶</span> View audio moment [24:45]
            </button>
            <span className="text-neutral-500">Speaker: Lead Cryptographer</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onNavigate("timeline")}
          className="py-3 px-3 bg-white border border-neutral-800 hover:bg-neutral-50 text-neutral-900 rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
          </svg>
          <span>View Timeline</span>
        </button>
        <button
          onClick={handleResolve}
          className="py-3 px-3 bg-neutral-900 hover:bg-black text-white rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition"
        >
          <span>✓</span>
          <span>Mark Resolved</span>
        </button>
      </div>
    </section>
  );
};
