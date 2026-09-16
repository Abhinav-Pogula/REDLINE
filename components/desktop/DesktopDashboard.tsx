"use client";

import React from "react";
import { Conflict, Decision, Constraint, Commitment } from "../../lib/data";

interface DesktopDashboardProps {
  conflicts?: Conflict[];
  decisions?: Decision[];
  constraints?: Constraint[];
  commitments?: Commitment[];
  onOpenConflict: () => void;
  onOpenCalendar: () => void;
  onOpenRecord?: () => void;
  onOpenDevices?: () => void;
  onOpenTimeline?: () => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  onOpenConflict,
  onOpenCalendar,
  onOpenRecord,
  onOpenDevices,
  onOpenTimeline,
}) => {
  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-dashboard">
      {/* Section: Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" data-purpose="dashboard-header">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-redline-red"></span>
            <span>FORENSIC OPERATING CONSOLE</span>
            <span>•</span>
            <span>DESKTOP DECK</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            Executive Workspace Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Office Kit Link Active Pill */}
          <div
            onClick={onOpenDevices}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white shadow-xs cursor-pointer hover:bg-neutral-50 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-neutral-800">Office Kit Link Active</span>
          </div>
          {/* New Recording CTA */}
          <button
            onClick={onOpenRecord}
            className="flex items-center gap-2 bg-redline-red hover:bg-redline-redHover text-white px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider shadow-xs uppercase transition-all transform active:scale-95"
          >
            <span>🎙️</span>
            <span>NEW RECORDING</span>
          </button>
        </div>
      </div>

      {/* Section: KPI Metric Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-grid">
        {/* Metric 1: Total Verified Decisions */}
        <div
          onClick={onOpenTimeline}
          className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
              TOTAL VERIFIED DECISIONS
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-neutral-950 font-display">14</span>
              <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md text-[11px] font-medium text-neutral-600">
                4 Meetings
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100 font-mono text-[11px]">
            100% cryptographic ledger proof
          </p>
        </div>

        {/* Metric 2: Scheduled Commitments */}
        <div
          onClick={onOpenCalendar}
          className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
              SCHEDULED COMMITMENTS
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-redline-red font-display">5</span>
              <span className="px-2 py-0.5 bg-red-100 text-redline-red border border-red-200 rounded-md text-[11px] font-bold font-mono">
                1 Overdue
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
            Action items tracked across teams
          </p>
        </div>

        {/* Metric 3: Monitored Meetings */}
        <div
          onClick={onOpenTimeline}
          className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
              MONITORED MEETINGS
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-neutral-950 font-display">4</span>
              <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md text-[10px] font-mono text-neutral-600">
                Google / Zoom / Teams
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
            Synced wirelessly from Phone
          </p>
        </div>

        {/* Metric 4: Enclave Integrity */}
        <div
          onClick={onOpenDevices}
          className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
              ENCLAVE INTEGRITY
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-emerald-600 font-mono tracking-tight">AIR-GAPPED</span>
              <span className="text-neutral-400">🛡️</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-100">
            Zero external telemetry ingress
          </p>
        </div>
      </div>

      {/* Section: Critical Contradiction Alert Card */}
      <div
        className="bg-[#fdeaea] border-2 border-red-500 rounded-xl p-5 shadow-xs relative overflow-hidden"
        data-purpose="contradiction-alert-banner"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold">
                !
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-red-700 uppercase">
                CONTRADICTION DETECTED IN ACTIVE STREAMS
              </span>
            </div>
            <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full font-mono text-[10px] font-bold tracking-widest uppercase">
              ● CRITICAL CONFLICT
            </span>
          </div>
          {/* Contradiction Content */}
          <h2 className="text-lg font-bold text-neutral-950 tracking-tight mt-1">
            Launch Date Shift Violates Security Buffer
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed max-w-4xl">
            Product moved launch to <span className="font-bold text-neutral-900">Oct 12</span>, but SecOps mandatory
            14-day penetration audit buffer remains scheduled through{" "}
            <span className="font-bold text-neutral-900">Oct 19</span>. Collision produces a 7-day deficit.
          </p>
          {/* Action Link */}
          <div className="pt-2">
            <button
              className="text-xs font-mono font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1 group"
              onClick={onOpenConflict}
            >
              <span>Inspect Side-by-Side Proof</span>
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section: Two-Column Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="workspace-columns">
        {/* Left Column: Monitored Meetings (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-redline-red text-white text-xs font-bold">
                  3
                </span>
                <h3 className="text-base font-bold text-neutral-950 font-display">Monitored Meetings</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">4 Synced Archives</span>
            </div>
            {/* Meetings Feed List */}
            <div className="divide-y divide-neutral-100">
              {/* Row 1 */}
              <div className="py-3.5 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 font-mono text-[9px] font-bold text-neutral-600 rounded">
                      GOOGLE MEET
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">Q4 Infrastructure Security Review</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Sep 18 • 42 min • 4 Key Decisions • Attendee: AK, MR +2
                  </p>
                </div>
                <button
                  className="shrink-0 text-xs font-mono font-bold text-redline-red hover:underline pt-1"
                  onClick={onOpenConflict}
                >
                  Inspect &rarr;
                </button>
              </div>
              {/* Row 2 */}
              <div className="py-3.5 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 font-mono text-[9px] font-bold text-neutral-600 rounded">
                      ZOOM // SECSYNC
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">API Gateway 14-Day Audit Schedule</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Oct 02 • 28 min • Immutable compliance freeze locked
                  </p>
                </div>
                <button
                  className="shrink-0 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 pt-1"
                  onClick={onOpenTimeline}
                >
                  Inspect &rarr;
                </button>
              </div>
              {/* Row 3 */}
              <div className="py-3.5 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 font-mono text-[9px] font-bold text-neutral-600 rounded">
                      SLACK HUDDLE
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">Pen-testing Verification Milestone</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Oct 08 • 15 min • Zero blocker verified by Lead Cryptographer
                  </p>
                </div>
                <button
                  className="shrink-0 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 pt-1"
                  onClick={onOpenTimeline}
                >
                  Inspect &rarr;
                </button>
              </div>
              {/* Row 4 */}
              <div className="py-3.5 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-neutral-100 font-mono text-[9px] font-bold text-neutral-600 rounded">
                      ZOOM AUDIT
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">Perimeter Vulnerability Baseline Review</h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Oct 10 • 35 min • Scope finalized for pen-testing
                  </p>
                </div>
                <button
                  className="shrink-0 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-900 pt-1"
                  onClick={onOpenCalendar}
                >
                  Inspect &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Commitments (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-950 font-display">Active Commitments</h3>
              <span className="text-xs font-mono text-neutral-400">Sorted by Urgency</span>
            </div>
            {/* Commitments Cards Stack */}
            <div className="flex flex-col gap-3 mt-4">
              {/* Commitment 1: Overdue Alert Card */}
              <div
                onClick={onOpenConflict}
                className="border border-red-300 rounded-lg p-3 bg-red-50/40 flex flex-col gap-2 cursor-pointer hover:border-red-500 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900">Product GA Launch Window</h4>
                  <span className="px-1.5 py-0.5 bg-red-100 text-redline-red border border-red-200 font-mono text-[9px] font-bold uppercase rounded">
                    OVERDUE
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500">Owner: Marcus Vance • Due: Oct 12, 2024</p>
                <div className="pt-1 border-t border-red-200">
                  <span className="text-[10px] font-mono font-bold text-red-600 tracking-wider">
                    CONFLICT WITH RULE #104.B &rarr;
                  </span>
                </div>
              </div>
              {/* Commitment 2: On Track Card */}
              <div
                onClick={onOpenCalendar}
                className="border border-neutral-200 rounded-lg p-3 bg-white flex flex-col gap-2 shadow-2xs cursor-pointer hover:border-neutral-400 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900">Perimeter Vulnerability Report</h4>
                  <span className="px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[9px] font-bold rounded">
                    ON TRACK
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500">Owner: Marcus T. • Due: Oct 08, 2024</p>
                <div className="pt-1 border-t border-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-500">Milestone locked and signed</span>
                </div>
              </div>
              {/* Commitment 3: On Track Card */}
              <div
                onClick={onOpenCalendar}
                className="border border-neutral-200 rounded-lg p-3 bg-white flex flex-col gap-2 shadow-2xs cursor-pointer hover:border-neutral-400 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900">Cryptographic Audit Signoff</h4>
                  <span className="px-1.5 py-0.5 bg-neutral-900 text-white font-mono text-[9px] font-bold rounded">
                    ON TRACK
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-500">Owner: Lead Cryptographer • Due: Oct 19, 2024</p>
                <div className="pt-1 border-t border-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-500">14-day mandatory observation cycle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
