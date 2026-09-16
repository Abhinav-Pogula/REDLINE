"use client";

import React, { useState } from "react";
import { Screen } from "../../lib/types";

interface CalendarProps {
  onNavigate: (screen: Screen) => void;
  onShowAlert?: (title: string, message: string) => void;
}

interface CommitmentItem {
  title: string;
  owner: string;
  status: string;
  statusBadge: string;
  meta: string;
  metaColor: string;
}

const calendarCommitmentsData: Record<number, CommitmentItem[]> = {
  2: [
    {
      title: "API Gateway 14-Day Audit Schedule Freeze",
      owner: "SecOps Team Lead",
      status: "On Track",
      statusBadge: "bg-neutral-900 text-white",
      meta: "CONFIRMED TIMELINE LOCK",
      metaColor: "text-neutral-600",
    },
  ],
  8: [
    {
      title: "Perimeter Vulnerability Report Delivery",
      owner: "Marcus T.",
      status: "On Track",
      statusBadge: "bg-neutral-900 text-white",
      meta: "MILESTONE VERIFIED",
      metaColor: "text-neutral-600",
    },
  ],
  12: [
    {
      title: "Product GA Launch Window",
      owner: "Marcus Vance",
      status: "Overdue",
      statusBadge: "bg-red-100 text-brand-red",
      meta: "CONFLICT WITH RULE #104.B",
      metaColor: "text-brand-red font-bold",
    },
  ],
  19: [
    {
      title: "Cryptographic Audit Signoff & Production Ingress",
      owner: "Lead Cryptographer",
      status: "On Track",
      statusBadge: "bg-neutral-900 text-white",
      meta: "14-DAY OBSERVATION CONCLUDES",
      metaColor: "text-neutral-600",
    },
  ],
};

export const Calendar: React.FC<CalendarProps> = ({ onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState<number>(12);

  const commitments = calendarCommitmentsData[selectedDay] || [];

  return (
    <section id="view-calendar" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Standard REDLINE Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span className="flex items-center gap-1 text-brand-red font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            SOVEREIGN DEADLINES
          </span>
          <span className="bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-bold uppercase">
            OCTOBER 2024
          </span>
        </div>
        <h2 className="font-display font-bold text-xl text-neutral-950 leading-tight">Calendar</h2>
        <p className="text-xs text-neutral-500 font-sans">What&apos;s due, and when.</p>
      </div>

      {/* Standard Month-View Grid Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between font-mono text-xs text-neutral-700 pb-2 border-b border-neutral-100">
          <span className="font-bold text-neutral-900">OCTOBER 2024</span>
          <div className="flex items-center gap-1 text-neutral-400">
            <button aria-label="Previous Month" className="p-1 hover:text-neutral-900">
              ‹
            </button>
            <button aria-label="Next Month" className="p-1 hover:text-neutral-900">
              ›
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 text-center font-mono text-[10px] text-neutral-400 font-semibold">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center font-mono text-xs" id="calendarDaysGrid">
          <span className="text-neutral-300 py-1">30</span>

          {/* 1 */}
          <button
            onClick={() => setSelectedDay(1)}
            className={`cal-day-cell py-1 text-neutral-700 rounded-lg hover:bg-neutral-100 flex flex-col items-center ${
              selectedDay === 1 ? "bg-neutral-100 font-bold" : ""
            }`}
          >
            1
          </button>

          {/* 2: On track commitment */}
          <button
            onClick={() => setSelectedDay(2)}
            className={`cal-day-cell py-1 text-neutral-700 rounded-lg hover:bg-neutral-100 flex flex-col items-center relative ${
              selectedDay === 2 ? "bg-neutral-100 font-bold" : ""
            }`}
          >
            2<span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-0.5"></span>
          </button>

          {/* 3 - 7 */}
          {[3, 4, 5, 6, 7].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`cal-day-cell py-1 rounded-lg hover:bg-neutral-100 flex flex-col items-center ${
                d === 5 || d === 6 ? "text-neutral-400" : "text-neutral-700"
              } ${selectedDay === d ? "bg-neutral-100 font-bold" : ""}`}
            >
              {d}
            </button>
          ))}

          {/* 8: On track commitment */}
          <button
            onClick={() => setSelectedDay(8)}
            className={`cal-day-cell py-1 text-neutral-700 rounded-lg hover:bg-neutral-100 flex flex-col items-center relative ${
              selectedDay === 8 ? "bg-neutral-100 font-bold" : ""
            }`}
          >
            8<span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-0.5"></span>
          </button>

          {/* 9 - 11 */}
          {[9, 10, 11].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`cal-day-cell py-1 text-neutral-700 rounded-lg hover:bg-neutral-100 flex flex-col items-center ${
                selectedDay === d ? "bg-neutral-100 font-bold" : ""
              }`}
            >
              {d}
            </button>
          ))}

          {/* 12: Overdue / Conflicting commitment (Red dot) */}
          <button
            onClick={() => setSelectedDay(12)}
            className={`cal-day-cell py-1 text-brand-red font-bold rounded-lg bg-red-50 flex flex-col items-center relative ring-1 ring-brand-red/30 ${
              selectedDay === 12 ? "ring-2 ring-brand-red" : ""
            }`}
          >
            12<span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-0.5"></span>
          </button>

          {/* 13 - 18 */}
          {[13, 14, 15, 16, 17, 18].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`cal-day-cell py-1 rounded-lg hover:bg-neutral-100 flex flex-col items-center ${
                d === 13 ? "text-neutral-400" : "text-neutral-700"
              } ${selectedDay === d ? "bg-neutral-100 font-bold" : ""}`}
            >
              {d}
            </button>
          ))}

          {/* 19: On track commitment (Black dot) */}
          <button
            onClick={() => setSelectedDay(19)}
            className={`cal-day-cell py-1 text-neutral-950 font-bold rounded-lg hover:bg-neutral-100 flex flex-col items-center relative ${
              selectedDay === 19 ? "bg-neutral-100" : ""
            }`}
          >
            19<span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-0.5"></span>
          </button>

          {/* 20 - 31 */}
          {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`cal-day-cell py-1 rounded-lg hover:bg-neutral-100 flex flex-col items-center ${
                d === 20 || d === 26 || d === 27 ? "text-neutral-400" : "text-neutral-700"
              } ${selectedDay === d ? "bg-neutral-100 font-bold" : ""}`}
            >
              {d}
            </button>
          ))}

          <span className="text-neutral-300 py-1">1</span>
          <span className="text-neutral-300 py-1">2</span>
          <span className="text-neutral-300 py-1">3</span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            <span className="text-neutral-500">Overdue / Conflicting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
            <span className="text-neutral-500">On Track</span>
          </div>
        </div>
      </div>

      {/* Commitments Section Beneath Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 uppercase font-semibold">
          <span id="calSelectedDayHeader">OCTOBER {selectedDay} COMMITMENTS</span>
          <span id="calSelectedDayCount">
            {commitments.length === 1 ? "1 DUE" : `${commitments.length} DUE`}
          </span>
        </div>

        {/* Commitments list container dynamically populated on tapping dates */}
        <div className="space-y-2.5" id="calCommitmentsList">
          {commitments.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 text-center shadow-2xs">
              <p className="font-mono text-xs text-neutral-400">
                No scheduled commitments for October {selectedDay}, 2024.
              </p>
            </div>
          ) : (
            commitments.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-2xs space-y-2 cursor-pointer hover:border-brand-red/40 transition"
                onClick={() => {
                  if (item.status === "Overdue") {
                    onNavigate("conflict");
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-neutral-950 leading-snug">
                      {item.title}
                    </h4>
                    <p className="font-mono text-xs text-neutral-400 mt-0.5">Owner: {item.owner}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full ${item.statusBadge} font-mono text-[9px] font-bold tracking-wider uppercase shrink-0`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500">
                  <span>DUE: OCT {selectedDay}, 2024</span>
                  <span className={item.metaColor}>{item.meta}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
