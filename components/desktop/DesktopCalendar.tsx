"use client";

import React, { useState } from "react";

interface DesktopCalendarProps {
  onOpenConflict: () => void;
}

type RangePreset = "freeze" | "conflict" | "full";

export const DesktopCalendar: React.FC<DesktopCalendarProps> = ({ onOpenConflict }) => {
  const [activePreset, setActivePreset] = useState<RangePreset>("freeze");
  const [selectedDate, setSelectedDate] = useState<number>(12);

  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-calendar">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-redline-red"></span>
            <span>TEMPORAL LEDGER</span>
            <span>•</span>
            <span>OCTOBER 2024</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            SecOps Commitment Calendar &amp; Range Auditor
          </h1>
        </div>

        {/* Quick Range Selector Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-mono font-medium">
            <button
              onClick={() => setActivePreset("freeze")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activePreset === "freeze"
                  ? "bg-white font-bold text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              id="preset-freeze-range"
            >
              14-Day Freeze Window
            </button>
            <button
              onClick={() => setActivePreset("conflict")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activePreset === "conflict"
                  ? "bg-white font-bold text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              id="preset-conflict-window"
            >
              Collision Zone (Oct 12-19)
            </button>
            <button
              onClick={() => setActivePreset("full")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activePreset === "full"
                  ? "bg-white font-bold text-neutral-900 shadow-xs border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              id="preset-full-month"
            >
              Full Month
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-mono font-bold text-neutral-700 shadow-xs transition-colors">
            <span>📥</span> Export Range
          </button>
        </div>
      </div>

      {/* Active Range & Collision Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Selected Range */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
              SELECTED DATE RANGE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white font-mono text-[9px] font-bold uppercase">
              ACTIVE FILTER
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-neutral-950">
              {activePreset === "freeze"
                ? "Oct 05 — Oct 19"
                : activePreset === "conflict"
                ? "Oct 12 — Oct 19"
                : "Oct 01 — Oct 31"}
            </span>
            <span className="text-xs font-mono font-medium text-neutral-500">
              {activePreset === "freeze" ? "(14 Days)" : activePreset === "conflict" ? "(7 Days)" : "(31 Days)"}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 font-mono">
            {activePreset === "freeze"
              ? "14-Day Mandatory Cryptographic Audit Freeze Window"
              : activePreset === "conflict"
              ? "Critical Invariant Deficit Period"
              : "Complete October 2024 Audit Timeline"}
          </p>
        </div>

        {/* Card 2: Filled Milestone Days */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
              FILLED MILESTONES
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[9px] font-bold">
              4 LOGGED
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px] text-neutral-700 font-semibold">
              Oct 02
            </span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px] text-neutral-700 font-semibold">
              Oct 08
            </span>
            <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-mono text-[10px] font-bold">
              Oct 12 ⚠️
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
              Oct 19 ✓
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 font-mono">
            2 immutable freeze proofs, 1 conflict, 1 audit signoff
          </p>
        </div>

        {/* Card 3: Overlap & Conflict Alert */}
        <div className="bg-[#fdeaea] rounded-xl border-2 border-red-500 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700">
              OVERLAP CONFLICT ALERT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold uppercase">
              -7D DEFICIT
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-mono text-red-700">Oct 12 → Oct 19</span>
            <span className="text-xs font-mono font-bold text-red-600">Violation</span>
          </div>
          <p className="text-xs text-neutral-700 mt-1 font-mono text-[11px]">
            Product GA Launch collides with required verification buffer.
          </p>
        </div>
      </div>

      {/* Interactive Calendar Range Component */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
        {/* Month Header & Legend */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-100 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-neutral-950 font-display">October 2024</span>
            <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded font-mono text-xs text-neutral-600 font-semibold">
              UTC+00:00 (On-Device Local)
            </span>
          </div>

          {/* Range Indicator Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-900 inline-block"></span>
              <span>Range Start / End</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-100 border border-neutral-300 inline-block"></span>
              <span>Selected Range</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#fdeaea] border border-red-500 inline-block"></span>
              <span className="text-red-600 font-semibold">Collision Overlap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-redline-red inline-block"></span>
              <span>Filled Milestone</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden text-xs select-none">
          {/* Weekday Labels */}
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">MON</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">TUE</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">WED</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">THU</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">FRI</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">SAT</div>
          <div className="bg-neutral-50 py-2.5 text-center font-mono font-bold text-neutral-500 text-[11px]">SUN</div>

          {/* Row 1: 30 Sep, 01 - 06 Oct */}
          <div className="bg-neutral-50/50 h-24 p-2 text-left font-mono text-neutral-300">30</div>

          <div
            onClick={() => setSelectedDate(1)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">01</span>
          </div>

          {/* Oct 02 (Filled Milestone) */}
          <div
            onClick={() => setSelectedDate(2)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">02</span>
              <span className="w-1.5 h-1.5 rounded-full bg-redline-red"></span>
            </div>
            <div className="mt-1 p-1 bg-neutral-100 border border-neutral-200 rounded text-[9px] font-sans truncate font-semibold text-neutral-700">
              SecSync Audit
            </div>
          </div>

          <div
            onClick={() => setSelectedDate(3)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">03</span>
          </div>

          <div
            onClick={() => setSelectedDate(4)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">04</span>
          </div>

          {/* Oct 05 (RANGE START) */}
          <div
            onClick={() => setSelectedDate(5)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono relative border-2 border-neutral-900 transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-bold text-[11px]">05</span>
              <span className="text-[9px] font-bold text-neutral-900 font-mono tracking-wider uppercase">RANGE START</span>
            </div>
            <div className="mt-1 p-1 bg-white border border-neutral-300 rounded text-[9px] font-sans font-semibold text-neutral-800 shadow-xs">
              🔒 Freeze Window Opens
            </div>
          </div>

          {/* Oct 06 (RANGE MIDDLE) */}
          <div
            onClick={() => setSelectedDate(6)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">06</span>
              <span className="text-[8px] text-neutral-400 font-mono">D-02</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-neutral-400">Buffer Active</div>
          </div>

          {/* Row 2: 07 - 13 Oct */}
          <div
            onClick={() => setSelectedDate(7)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">07</span>
              <span className="text-[8px] text-neutral-400 font-mono">D-03</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-neutral-400">Buffer Active</div>
          </div>

          {/* Oct 08 (RANGE MIDDLE + FILLED MILESTONE) */}
          <div
            onClick={() => setSelectedDate(8)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-900 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-950">08</span>
              <span className="w-1.5 h-1.5 rounded-full bg-redline-red"></span>
            </div>
            <div className="mt-1 p-1 bg-neutral-900 text-white rounded text-[9px] font-sans truncate font-bold shadow-xs">
              ✓ Perimeter Locked
            </div>
          </div>

          {/* Oct 09 */}
          <div
            onClick={() => setSelectedDate(9)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">09</span>
              <span className="text-[8px] text-neutral-400 font-mono">D-05</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-neutral-400">Audit Progressing</div>
          </div>

          {/* Oct 10 */}
          <div
            onClick={() => setSelectedDate(10)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">10</span>
              <span className="text-[8px] text-neutral-400 font-mono">D-06</span>
            </div>
            <div className="mt-1 p-1 bg-white border border-neutral-200 rounded text-[9px] font-sans truncate font-medium text-neutral-700">
              Perimeter Baseline
            </div>
          </div>

          {/* Oct 11 */}
          <div
            onClick={() => setSelectedDate(11)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-200/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">11</span>
              <span className="text-[8px] text-neutral-400 font-mono">D-07</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-neutral-400">Pre-Release QA</div>
          </div>

          {/* Oct 12 (COLLISION OVERLAP START + CONFLICT MILESTONE) */}
          <div
            onClick={() => {
              setSelectedDate(12);
              onOpenConflict();
            }}
            className="bg-[#fdeaea] h-24 p-2 text-left font-mono relative border-2 border-red-500 shadow-sm cursor-pointer hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[11px]">12</span>
              <span className="text-[9px] font-bold text-red-700 font-mono">OVERLAP</span>
            </div>
            <div className="mt-1 p-1 bg-red-600 text-white rounded text-[9px] font-sans truncate font-extrabold shadow-xs">
              ⚠️ GA Launch Collision
            </div>
          </div>

          {/* Oct 13 */}
          <div
            onClick={() => setSelectedDate(13)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">13</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+1d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Quarantine Breach</div>
          </div>

          {/* Row 3: 14 - 20 Oct */}
          <div
            onClick={() => setSelectedDate(14)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">14</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+2d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Deficit Active</div>
          </div>

          <div
            onClick={() => setSelectedDate(15)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">15</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+3d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Deficit Active</div>
          </div>

          <div
            onClick={() => setSelectedDate(16)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">16</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+4d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Deficit Active</div>
          </div>

          <div
            onClick={() => setSelectedDate(17)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">17</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+5d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Deficit Active</div>
          </div>

          <div
            onClick={() => setSelectedDate(18)}
            className="bg-red-50/70 h-24 p-2 text-left font-mono text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">18</span>
              <span className="text-[8px] text-red-500 font-bold font-mono">+6d deficit</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-red-600">Deficit Active</div>
          </div>

          {/* Oct 19 (RANGE END + FILLED MILESTONE) */}
          <div
            onClick={() => setSelectedDate(19)}
            className="bg-neutral-100 h-24 p-2 text-left font-mono relative border-2 border-neutral-900 transition-colors cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-bold text-[11px]">19</span>
              <span className="text-[9px] font-bold text-neutral-900 font-mono tracking-wider uppercase">RANGE END</span>
            </div>
            <div className="mt-1 p-1 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded text-[9px] font-sans truncate font-bold">
              🛡️ SecOps Signoff Locked
            </div>
          </div>

          {/* Oct 20 */}
          <div
            onClick={() => setSelectedDate(20)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">20</span>
          </div>

          {/* Row 4: 21 - 27 Oct */}
          <div
            onClick={() => setSelectedDate(21)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">21</span>
          </div>
          <div
            onClick={() => setSelectedDate(22)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">22</span>
          </div>
          <div
            onClick={() => setSelectedDate(23)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">23</span>
          </div>
          <div
            onClick={() => setSelectedDate(24)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">24</span>
          </div>
          <div
            onClick={() => setSelectedDate(25)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">25</span>
          </div>
          <div
            onClick={() => setSelectedDate(26)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">26</span>
          </div>
          <div
            onClick={() => setSelectedDate(27)}
            className="bg-white h-24 p-2 text-left font-mono text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span className="font-medium">27</span>
          </div>
        </div>

        {/* Bottom Inspector Details of Selected Range */}
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
              {selectedDate}d
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 font-display">
                Cryptographic Audit Freeze Interval
              </p>
              <p className="text-[11px] font-mono text-neutral-500">
                Span: 2024-10-05T00:00:00Z to 2024-10-19T23:59:59Z • Invariant check status:{" "}
                <span className="text-red-600 font-bold">FAIL (Rule #104.B)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-mono font-bold transition-colors"
              onClick={onOpenConflict}
            >
              Open Conflict Prover →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
