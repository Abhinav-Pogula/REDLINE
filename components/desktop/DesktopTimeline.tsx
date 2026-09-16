"use client";

import React, { useState } from "react";

interface DesktopTimelineProps {
  onOpenConflict: () => void;
  onShowModal?: (title: string, message: string) => void;
}

export const DesktopTimeline: React.FC<DesktopTimelineProps> = ({
  onOpenConflict,
  onShowModal,
}) => {
  const [selectedNode, setSelectedNode] = useState<number>(4);

  const playAudio = (moment: string, quote: string) => {
    if (onShowModal) {
      onShowModal(`Audio Moment Playback [${moment}]`, quote);
    }
  };

  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-desktop-timeline">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-redline-red"></span>
            <span>SYNCHRONIZED AUDIT TRAIL</span>
            <span>•</span>
            <span>TEMPORAL EVOLUTION</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            How this decision changed over time.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 bg-white shadow-xs font-mono text-xs text-neutral-700">
            <span>AUDIT REF: #TL-9041-C</span>
            <span>•</span>
            <span className="text-redline-red font-bold">4 SYNCHRONIZED NODES</span>
          </div>
          <button
            onClick={onOpenConflict}
            className="flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors"
          >
            <span>⚖️</span>
            <span>INSPECT CONFLICT PROVER &rarr;</span>
          </button>
        </div>
      </div>

      {/* Grid: Timeline Tree + Detailed Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Vertical Synchronized Audit Trail */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-display font-bold text-base text-neutral-950">
              Chronological Memory Chain
            </h3>
            <span className="text-xs font-mono text-neutral-400">Topic: GA Launch Date &amp; SecOps Buffer</span>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
            {/* Node 1 */}
            <div
              onClick={() => setSelectedNode(1)}
              className={`relative space-y-1.5 cursor-pointer p-3 rounded-xl transition ${
                selectedNode === 1 ? "bg-neutral-50 border border-neutral-300" : "hover:bg-neutral-50/60"
              }`}
            >
              <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-neutral-400 ring-4 ring-white" />
              <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                <span>SEP 15, 2024 • 11:30 UTC // ZOOM</span>
                <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-600">SOURCE: IMMUTABLE_SRC</span>
              </div>
              <h4 className="font-display font-bold text-sm text-neutral-900">
                Two-week security test freeze locked in
              </h4>
              <p className="text-xs text-neutral-600 font-sans">
                SecOps confirmed that all code must freeze for 14 days prior to public launch.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <span>🔒</span>
                <span>RULE: 14-DAY COMPLIANCE BUFFER [SEC-104.B]</span>
              </div>
            </div>

            {/* Node 2 */}
            <div
              onClick={() => setSelectedNode(2)}
              className={`relative space-y-1.5 cursor-pointer p-3 rounded-xl transition ${
                selectedNode === 2 ? "bg-neutral-50 border border-neutral-300" : "hover:bg-neutral-50/60"
              }`}
            >
              <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-neutral-900 ring-4 ring-white" />
              <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                <span>OCT 02, 2024 • 09:15 UTC // SLACK HUDDLE</span>
                <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-600">SOURCE: SECSYNC</span>
              </div>
              <h4 className="font-display font-bold text-sm text-neutral-900">
                Security review scheduled through October 19
              </h4>
              <p className="text-xs text-neutral-600 font-sans">
                Auditors booked formal penetration testing window ending Oct 19.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <span>📅</span>
                <span>STATUS: IMMUTABLE AUDIT SCHEDULE</span>
              </div>
            </div>

            {/* Node 3 */}
            <div
              onClick={() => setSelectedNode(3)}
              className={`relative space-y-1.5 cursor-pointer p-3 rounded-xl transition ${
                selectedNode === 3 ? "bg-neutral-50 border border-neutral-300" : "hover:bg-neutral-50/60"
              }`}
            >
              <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-neutral-900 ring-4 ring-white" />
              <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                <span>OCT 08, 2024 • 14:00 UTC // MEET</span>
                <span className="bg-neutral-100 px-1.5 py-0.5 rounded font-bold text-neutral-600">SOURCE: VERIFIED_LEAD</span>
              </div>
              <h4 className="font-display font-bold text-sm text-neutral-900">
                Penetration tests confirmed on track
              </h4>
              <p className="text-xs text-neutral-600 font-sans">
                Lead cryptographer noted zero blockers if Oct 19 date holds.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                <span>✓</span>
                <span>VERIFIED BY: MARCUS T. (SECOPS LEAD)</span>
              </div>
            </div>

            {/* Node 4 (Critical Contradiction) */}
            <div
              onClick={() => setSelectedNode(4)}
              className="relative space-y-2 cursor-pointer p-4 rounded-xl bg-[#fdeaea] border-2 border-redline-red shadow-xs transition"
            >
              <div className="absolute -left-[30px] top-5 w-4 h-4 rounded-full bg-redline-red ring-4 ring-red-200 animate-pulse" />
              <div className="text-[10px] font-mono text-redline-red font-bold flex items-center justify-between">
                <span>● TODAY • 14:15 UTC // GOOGLE MEET [LATEST DIVERGENCE]</span>
                <span className="px-2 py-0.5 rounded bg-redline-red text-white text-[9px] uppercase font-bold">
                  ⚠️ COLLISION
                </span>
              </div>
              <h4 className="font-display font-bold text-base text-neutral-950">
                New launch date was moved up to October 12
              </h4>
              <p className="text-xs text-neutral-800 font-sans leading-relaxed">
                Moving launch to Oct 12 cuts into the required 14-day security window by 7 full days.
              </p>
              <div className="p-2.5 rounded-lg bg-white/80 border border-red-300 flex items-center justify-between text-xs font-mono text-redline-red font-bold">
                <span>DIRECT CONTRADICTION FLAGGED</span>
                <span>BUFFER DEFICIT: -7 DAYS</span>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio("09:12", "Head of Product: 'Let's pull GA to the 12th to announce at Keynote.'");
                  }}
                  className="text-xs font-mono font-bold text-redline-red flex items-center gap-1.5 hover:underline"
                >
                  <span className="w-5 h-5 rounded-full bg-redline-red text-white flex items-center justify-center text-[10px]">
                    ▶
                  </span>
                  <span>View Audio Moment [09:12]</span>
                </button>
                <span className="text-[10px] font-mono text-neutral-500">09:12 / 18:40 UTC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Inspection Details & Formal Logic */}
        <div className="lg:col-span-5 space-y-5">
          {/* Temporal Drift Visualizer */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-neutral-500 font-bold uppercase">TEMPORAL DRIFT DELTA</span>
              <span className="text-redline-red font-bold text-sm bg-red-50 px-2 py-0.5 rounded">
                -7 CALENDAR DAYS
              </span>
            </div>
            <div className="relative py-2">
              <div className="h-2.5 bg-neutral-100 rounded-full w-full relative overflow-hidden">
                <div className="absolute left-1/4 right-1/4 h-full bg-redline-red"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2">
                <div>
                  <span className="block text-redline-red font-bold">OCT 12 (REQ)</span>
                  <span>GA Commit</span>
                </div>
                <div className="text-center font-bold text-redline-red">
                  168 Hr Collision
                </div>
                <div className="text-right">
                  <span className="block text-neutral-900 font-bold">OCT 19 (SEC)</span>
                  <span>Audit Signoff</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formal Logic Proof Box */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-100 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>🧮</span> FORMAL LOGIC PROVER
              </span>
              <span>KERNEL // PROVER-04</span>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-lg space-y-2 text-[11px]">
              <div className="text-neutral-700 flex justify-between">
                <span className="text-redline-red font-bold">[New Decision: Launch Oct 12]</span>
                <span className="text-neutral-400">T_0</span>
              </div>
              <div className="text-neutral-700 flex justify-between">
                <span>+ [Existing Constraint: 14-Day Audit through Oct 19]</span>
                <span className="text-neutral-400">C_sec</span>
              </div>
              <div className="text-neutral-700 flex justify-between">
                <span>+ [Current Status: Buffer Deficit = -7 Days]</span>
                <span className="text-redline-red font-bold">&Delta;T &lt; 0</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-bold text-redline-red">
                <span>🛡 = DIRECT CONTRADICTION</span>
                <span className="bg-red-100 text-redline-red px-1.5 py-0.5 rounded text-[10px]">
                  FAIL_FAST
                </span>
              </div>
            </div>
          </div>

          {/* Executive Corroborating Quote */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="font-bold uppercase">CORROBORATING TELEMETRY</span>
              <span className="text-redline-red font-bold text-[9px] bg-red-50 px-2 py-0.5 rounded">UNRESOLVED</span>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <span className="w-8 h-8 rounded-full bg-neutral-200 font-mono text-xs font-bold flex items-center justify-center text-neutral-800 shrink-0">
                MV
              </span>
              <div>
                <p className="text-xs font-bold text-neutral-900 font-sans">Marcus Vance (Product VP)</p>
                <p className="text-xs font-sans italic text-neutral-700 mt-1 leading-relaxed">
                  &quot;Let&apos;s pull GA to the 12th to announce at Keynote. We have market momentum.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
