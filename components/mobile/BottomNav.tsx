"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const isDashboard = currentScreen === "dashboard";
  const isCapture = currentScreen === "capture";
  const isAudit = currentScreen === "conflict" || currentScreen === "result";

  return (
    <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-6 py-2 z-40 flex items-center justify-between">
      {/* Tab 1: STREAM (Dashboard) */}
      <button
        onClick={() => onNavigate("dashboard")}
        id="navStream"
        className={`flex flex-col items-center gap-1 transition group py-1 ${
          isDashboard ? "text-brand-red" : "text-neutral-400 hover:text-neutral-900"
        }`}
      >
        <svg
          className="w-5 h-5 transition group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <span className="font-mono text-[10px] font-bold tracking-wider">STREAM</span>
      </button>

      {/* Tab 2: RECORD (Dominant Raised Mic Action Button) */}
      <div className="relative -top-5 flex flex-col items-center">
        <button
          onClick={() => onNavigate("capture")}
          id="navCapture"
          aria-label="Capture Audio"
          className="w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg ring-4 ring-brand-bg hover:scale-105 active:scale-95 transition"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V4.5a3 3 0 116 0V12a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <span className="font-mono text-[9px] font-bold tracking-wider text-brand-red mt-1">CAPTURE</span>
      </div>

      {/* Tab 3: AUDIT (Conflict / Inspection) */}
      <button
        onClick={() => onNavigate("conflict")}
        id="navAudit"
        className={`flex flex-col items-center gap-1 transition group py-1 ${
          isAudit ? "text-brand-red" : "text-neutral-400 hover:text-neutral-900"
        }`}
      >
        <svg
          className="w-5 h-5 transition group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span className="font-mono text-[10px] font-bold tracking-wider">AUDIT</span>
      </button>
    </nav>
  );
};
