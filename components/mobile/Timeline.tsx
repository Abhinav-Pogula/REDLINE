"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface TimelineProps {
  onNavigate: (screen: Screen) => void;
  timeline?: any[];
  onShowAlert?: (title: string, message: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  onNavigate,
  onShowAlert,
}) => {
  const playClip = () => {
    if (onShowAlert) {
      onShowAlert("Audio Moment [09:12]", "Product Roadmap Sync: 'Team agreed to advance the general availability launch to October 12th.' - Marcus Vance (Product VP)");
    }
  };

  return (
    <section id="view-timeline" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Screen Header with Plain English Focus */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span className="flex items-center gap-1 text-brand-red font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            SYNCHRONIZED AUDIT TRAIL
          </span>
          <span className="bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-bold">4 KEY EVENTS</span>
        </div>
        <h2 className="font-display font-bold text-xl text-neutral-950 leading-tight">
          How this decision changed over time.
        </h2>
        <p className="text-xs text-neutral-600 font-sans leading-relaxed">
          Tracing commitments across meetings, chats, and automated transcripts to identify critical divergence points.
        </p>
      </div>

      {/* Scope Pill */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-brand-red font-bold">AUDIT REF: #TL-9041-C</span>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-700">TOPIC: GA LAUNCH DATE</span>
        </div>
        <span className="text-[10px] text-neutral-400">EVOLUTION</span>
      </div>

      {/* VERTICAL TIMELINE CONTAINER */}
      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
        {/* Timeline Node 1 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-neutral-400 ring-4 ring-brand-bg"></div>
          <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
            <span>SEP 15, 2024 • 11:30 UTC // ZOOM</span>
            <span className="text-neutral-400">📹</span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs space-y-1">
            <h3 className="font-display font-bold text-sm text-neutral-900 leading-snug">
              Two-week security test freeze locked in
            </h3>
            <p className="text-xs text-neutral-600 font-sans">
              SecOps confirmed that all code must freeze for 14 days prior to public launch.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span>🔒</span>
              <span>RULE: 14-DAY COMPLIANCE BUFFER [SEC-104.B]</span>
            </div>
          </div>
        </div>

        {/* Timeline Node 2 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-neutral-900 ring-4 ring-brand-bg"></div>
          <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
            <span>OCT 02, 2024 • 09:15 UTC // SLACK HUDDLE</span>
            <span className="text-neutral-400">🎧</span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs space-y-1">
            <h3 className="font-display font-bold text-sm text-neutral-900 leading-snug">
              Security review scheduled through October 19
            </h3>
            <p className="text-xs text-neutral-600 font-sans">
              Auditors booked formal penetration testing window ending Oct 19.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span>📅</span>
              <span>STATUS: IMMUTABLE AUDIT SCHEDULE</span>
            </div>
          </div>
        </div>

        {/* Timeline Node 3 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-neutral-900 ring-4 ring-brand-bg"></div>
          <div className="text-[10px] font-mono text-neutral-500 flex items-center justify-between">
            <span>OCT 08, 2024 • 14:00 UTC // MEET</span>
            <span className="text-neutral-400">👥</span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-2xs space-y-1">
            <h3 className="font-display font-bold text-sm text-neutral-900 leading-snug">
              Penetration tests confirmed on track
            </h3>
            <p className="text-xs text-neutral-600 font-sans">
              Lead cryptographer noted no blockers if Oct 19 date holds.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <span>✓</span>
              <span>VERIFIED BY: MARCUS T. (SECOPS LEAD)</span>
            </div>
          </div>
        </div>

        {/* Timeline Node 4 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-brand-red ring-4 ring-red-200 shadow-md shadow-brand-red/50 animate-pulse"></div>
          <div className="text-[10px] font-mono text-brand-red font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span>●</span> TODAY • 14:15 UTC // GOOGLE MEET [LATEST]
            </span>
            <span>⚠️</span>
          </div>
          <div className="bg-[#fdeaea] border-2 border-brand-red rounded-2xl p-4 shadow-sm space-y-2">
            <h3 className="font-display font-bold text-base text-neutral-950 leading-snug">
              New launch date was moved up to October 12
            </h3>
            <p className="text-xs text-neutral-800 font-sans leading-relaxed">
              Moving launch to Oct 12 cuts into the required 14-day security window by 7 full days.
            </p>
            <div className="p-2 rounded-xl bg-white/80 border border-brand-red/30 flex items-center justify-between text-[11px] font-mono text-brand-red font-bold">
              <span>DIRECT CONTRADICTION</span>
              <span>BUFFER DEFICIT: -7 DAYS</span>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={playClip}
                className="text-xs font-mono font-bold text-brand-red flex items-center gap-1.5 hover:underline"
              >
                <span className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">
                  ▶
                </span>
                <span>View Audio Moment [09:12]</span>
              </button>
              <span className="text-[10px] font-mono text-neutral-500">09:12 / 18:40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corroborating Telemetry Quote */}
      <div className="bg-neutral-100 rounded-2xl p-3.5 flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-neutral-300 font-mono text-xs font-bold flex items-center justify-center text-neutral-800 shrink-0">
          MT
        </span>
        <div className="space-y-0.5">
          <p className="text-[11px] font-mono text-neutral-500">Marcus Vance (Product VP)</p>
          <p className="text-xs font-sans italic text-neutral-800">
            &quot;Let&apos;s pull GA to the 12th to announce at Keynote.&quot;
          </p>
        </div>
        <span className="ml-auto font-mono text-[9px] text-brand-red font-bold bg-red-100 px-1.5 py-0.5 rounded">
          UNRESOLVED
        </span>
      </div>

      {/* Action Footer */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onNavigate("conflict")}
          className="py-3 px-3 bg-white border border-neutral-300 text-neutral-800 rounded-2xl font-mono text-xs font-bold tracking-wider hover:bg-neutral-50 transition shadow-2xs"
        >
          🔍 COMPARE TRANSCRIPTS
        </button>
        <button
          onClick={() => onNavigate("conflict")}
          className="py-3 px-3 bg-neutral-900 text-white rounded-2xl font-mono text-xs font-bold tracking-wider hover:bg-black transition shadow-2xs"
        >
          📋 REVIEW RESOLUTION
        </button>
      </div>
    </section>
  );
};
