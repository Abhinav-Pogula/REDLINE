"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface BreadcrumbProps {
  currentScreen: Screen;
  onNextFlow: () => void;
}

const SCREEN_LABELS: Record<Screen, string> = {
  dashboard: "1. DASHBOARD DECK",
  capture: "2. ACOUSTIC INTAKE",
  result: "3. STRUCTURED MEMORY",
  conflict: "4. CONTRADICTION AUDIT",
  timeline: "5. FORENSIC TIMELINE",
  calendar: "6. SCHEDULE MATRIX",
  profile: "7. SOVEREIGN ENCLAVE",
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentScreen, onNextFlow }) => {
  return (
    <div className="bg-neutral-100/90 border-b border-brand-border px-4 py-1.5 flex items-center justify-between text-[10px] font-mono shrink-0">
      <div className="flex items-center gap-1.5 text-neutral-500 overflow-x-auto hide-scrollbar">
        <span className="text-brand-red font-bold">SEGMENT:</span>
        <span
          id="currentScreenBreadcrumb"
          className="text-neutral-900 font-semibold uppercase bg-white px-2 py-0.5 rounded border border-neutral-200 whitespace-nowrap"
        >
          {SCREEN_LABELS[currentScreen] || currentScreen.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onNextFlow}
          title="Step to next scenario"
          className="px-2 py-0.5 bg-neutral-900 text-white rounded font-mono text-[9px] hover:bg-brand-red transition flex items-center gap-1"
        >
          <span>NEXT FLOW</span>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
