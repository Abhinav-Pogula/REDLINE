"use client";

import React, { useState } from "react";
import { Screen } from "../../lib/types";

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  onRunDemo: () => void;
  selectedConflict?: any;
  activeScenarioId?: string;
  onSwitchScenario?: (scenario: "scenario-conflict" | "scenario-compliant") => void;
  onShowAlert?: (title: string, message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onRunDemo,
}) => {
  const [deckCard, setDeckCard] = useState<number>(0);

  const prevCard = () => setDeckCard((prev) => (prev > 0 ? prev - 1 : 2));
  const nextCard = () => setDeckCard((prev) => (prev < 2 ? prev + 1 : 0));

  return (
    <section id="view-dashboard" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Telemetry Sub-header */}
      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
          <span className="font-bold tracking-wider text-neutral-900">STREAM FEED</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-brand-border px-2 py-0.5 rounded-full shadow-xs">
          <svg className="w-3 h-3 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          <span className="text-[10px] font-bold text-neutral-700">ZERO-TRUST SECURED</span>
        </div>
      </div>

      {/* MONITORED MEETINGS: INTERACTIVE STACKED CAROUSEL DECK */}
      <div className="space-y-2">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Top-left stacked-cards icon with small red circular notification badge showing unreviewed items count */}
              <div className="relative inline-flex items-center">
                <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-15 0A2.25 2.25 0 003 12v6a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-6a2.25 2.25 0 00-1.5-2.122"
                  />
                </svg>
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-brand-red text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                  3
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase">
                MONITORED MEETINGS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-400">
                Card <span id="deckCounter" className="text-neutral-900 font-bold">{deckCard + 1}</span> of 3
              </span>
              <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">
                4 TOTAL
              </span>
            </div>
          </div>

          {/* SUMMARY ROW directly beneath MONITORED MEETINGS: Decisions count & Commitments count */}
          <div className="grid grid-cols-2 gap-3 bg-white border border-neutral-200 rounded-2xl p-3 shadow-2xs">
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-neutral-950 leading-none">14</span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase mt-1 font-semibold">
                Decisions
              </span>
            </div>
            <div className="flex flex-col border-l border-neutral-100 pl-3">
              <span className="font-display font-bold text-2xl text-brand-red leading-none">5</span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase mt-1 font-semibold">
                Commitments
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Stack Container */}
        <div className="relative h-[152px] w-full" id="meetingStackDeck">
          {/* Card 1 (Active Top) */}
          <div
            id="deckCard0"
            onClick={() => onNavigate("result")}
            className={`absolute inset-0 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-300 hover:border-brand-red/50 ${
              deckCard === 0 ? "stack-card-0 z-30 opacity-100" : deckCard === 1 ? "stack-card-2 z-10 opacity-65" : "stack-card-1 z-20 opacity-88"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-red-50 text-brand-red">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
                    />
                  </svg>
                </span>
                <span className="font-bold text-neutral-800">GOOGLE MEET</span>
                <span>•</span>
                <span>SEP 18</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            </div>
            <h3 className="font-display font-bold text-base text-neutral-950 leading-snug">
              Q4 Infrastructure Security Review
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-1 flex items-center gap-2">
              <span>⏱ 42 min</span>
              <span>•</span>
              <span className="text-neutral-900 font-semibold">4 Key Decisions</span>
            </p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center -space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-neutral-200 border border-white text-[9px] font-mono font-bold flex items-center justify-center text-neutral-700">
                  AK
                </span>
                <span className="w-5 h-5 rounded-full bg-neutral-300 border border-white text-[9px] font-mono font-bold flex items-center justify-center text-neutral-700">
                  MR
                </span>
                <span className="w-5 h-5 rounded-full bg-red-100 border border-white text-[8px] font-mono font-bold flex items-center justify-center text-brand-red">
                  +2
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-brand-red flex items-center gap-1 group-hover:translate-x-0.5 transition">
                Inspect Result <span className="text-base leading-none">&rarr;</span>
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            id="deckCard1"
            onClick={() => onNavigate("result")}
            className={`absolute inset-0 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-300 ${
              deckCard === 1 ? "stack-card-0 z-30 opacity-100" : deckCard === 2 ? "stack-card-2 z-10 opacity-65" : "stack-card-1 z-20 opacity-88"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
              <span className="font-bold text-neutral-700">ZOOM // SECSYNC</span>
              <span>OCT 02</span>
            </div>
            <h3 className="font-display font-bold text-sm text-neutral-900">
              API Gateway 14-Day Audit Schedule
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              SecOps team confirms immutable compliance freeze.
            </p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
              <span className="text-[10px] font-mono text-neutral-400">IMMUTABLE FREEZE</span>
              <span className="text-xs font-mono font-bold text-brand-red flex items-center gap-1">
                Inspect Result <span className="text-base leading-none">&rarr;</span>
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            id="deckCard2"
            onClick={() => onNavigate("result")}
            className={`absolute inset-0 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm cursor-pointer transition-all duration-300 ${
              deckCard === 2 ? "stack-card-0 z-30 opacity-100" : deckCard === 0 ? "stack-card-2 z-10 opacity-65" : "stack-card-1 z-20 opacity-88"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
              <span className="font-bold text-neutral-700">SLACK HUDDLE</span>
              <span>OCT 08</span>
            </div>
            <h3 className="font-display font-bold text-sm text-neutral-900">
              Pen-testing Verification Milestone
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              Zero blocker verified by Lead Cryptographer.
            </p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
              <span className="text-[10px] font-mono text-emerald-600 font-bold">VERIFIED</span>
              <span className="text-xs font-mono font-bold text-brand-red flex items-center gap-1">
                Inspect Result <span className="text-base leading-none">&rarr;</span>
              </span>
            </div>
          </div>
        </div>

        {/* Carousel / Deck Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevCard}
              aria-label="Previous meeting"
              className="w-7 h-7 rounded-full bg-white border border-brand-border text-neutral-700 hover:bg-neutral-50 active:scale-95 flex items-center justify-center transition shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button
              onClick={nextCard}
              aria-label="Next meeting"
              className="w-7 h-7 rounded-full bg-white border border-brand-border text-neutral-700 hover:bg-neutral-50 active:scale-95 flex items-center justify-center transition shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <span className="text-[10px] font-mono text-neutral-400 ml-1">Swipe or click arrows</span>
          </div>
          {/* Pagination dots */}
          <div className="flex items-center gap-1.5" id="deckDots">
            <span
              className={`h-1.5 rounded-full transition-all ${
                deckCard === 0 ? "w-4 bg-brand-red" : "w-1.5 bg-neutral-300"
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all ${
                deckCard === 1 ? "w-4 bg-brand-red" : "w-1.5 bg-neutral-300"
              }`}
            />
            <span
              className={`h-1.5 rounded-full transition-all ${
                deckCard === 2 ? "w-4 bg-brand-red" : "w-1.5 bg-neutral-300"
              }`}
            />
          </div>
        </div>
      </div>

      {/* AMBIENT STATUS PILL */}
      <div className="w-full bg-white border border-brand-border/80 rounded-full px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse shrink-0"></span>
          <p className="text-xs text-neutral-600 italic font-mono truncate">
            REDLINE is monitoring in the background...
          </p>
        </div>
        <button
          onClick={() => onNavigate("capture")}
          className="font-mono text-[10px] text-brand-red font-bold hover:underline shrink-0 pl-2"
        >
          CAPTURE NOW &rarr;
        </button>
      </div>

      {/* CENTERPIECE: HIGH PRIORITY CONTRADICTION ALERT CARD */}
      <div
        onClick={() => onNavigate("conflict")}
        className="bg-[#fdeaea] border-2 border-brand-red rounded-2xl p-4 shadow-md cursor-pointer transition hover:scale-[1.01] relative overflow-hidden group"
      >
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-brand-red/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-brand-red font-mono text-xs font-bold tracking-wider">
            <svg className="w-4 h-4 fill-brand-red text-white" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>CONTRADICTION DETECTED</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-brand-red text-white font-mono text-[9px] font-bold tracking-widest uppercase shadow-xs">
            ● CONFLICTING
          </span>
        </div>
        <h2 className="font-display font-bold text-base text-neutral-900 leading-snug">
          Launch Date Shift Violates Security Buffer
        </h2>
        <p className="text-xs text-neutral-700 font-sans mt-1.5 leading-relaxed">
          Product moved launch to <span className="font-semibold text-neutral-950">Oct 12</span>, but SecOps mandatory
          14-day penetration audit buffer remains scheduled through <span className="font-semibold text-neutral-950">Oct 19</span>.
        </p>
        <div className="my-3 space-y-1.5 bg-white/70 backdrop-blur-xs rounded-xl p-2.5 border border-brand-red/20 font-mono text-[11px]">
          <div className="flex items-center justify-between text-neutral-700">
            <span className="font-bold text-neutral-500 bg-neutral-200/70 px-1.5 py-0.5 rounded text-[9px]">CALL A</span>
            <span className="truncate ml-2">ProdSync: &quot;Target release set to Oct 12.&quot;</span>
          </div>
          <div className="flex items-center justify-between text-brand-red font-medium">
            <span className="font-bold text-brand-red bg-red-100 px-1.5 py-0.5 rounded text-[9px]">CALL B</span>
            <span className="truncate ml-2 font-bold">SecSync: &quot;Sign-off blocked until Oct 19.&quot;</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-brand-red/20 text-xs font-mono">
          <span className="text-neutral-500 text-[10px] tracking-wider uppercase font-semibold">
            RULE 1 • DATE SHIFT VS CONSTRAINT
          </span>
          <span className="text-brand-red font-bold flex items-center gap-1 group-hover:underline">
            View Evidence <span className="text-base leading-none">&rarr;</span>
          </span>
        </div>
      </div>

      {/* JUDGE DEMO MODE CARD */}
      <div className="bg-white border-2 border-dashed border-neutral-300 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-display font-bold text-sm text-neutral-900">
              <span className="text-base">🧰</span>
              <span>Judge Demo Mode</span>
            </div>
            <p className="text-xs text-neutral-500 leading-tight">
              1-Tap sequence reset: Meeting 1 &rarr; 2 &rarr; 3 &rarr; conflict replay.
            </p>
          </div>
          <button
            onClick={onRunDemo}
            className="px-3 py-2 bg-brand-red hover:bg-brand-redDark active:scale-95 text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <span>▶</span>
            <span>Run Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
