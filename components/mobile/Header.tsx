"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface HeaderProps {
  currentScreen: Screen;
  onOpenDrawer: () => void;
  onGoBack: () => void;
  onNavigate: (screen: Screen) => void;
  isBackendConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onOpenDrawer,
  onGoBack,
  onNavigate,
  isBackendConnected = false,
}) => {
  const isDashboard = currentScreen === "dashboard";

  return (
    <header className="w-full bg-brand-bg/95 backdrop-blur-md pt-3 pb-2 px-5 border-b border-brand-border/60 z-40 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {/* Hamburger Menu Button */}
        <button
          onClick={onOpenDrawer}
          id="headerMenuBtn"
          aria-label="Open Navigation Menu"
          className="p-1.5 -ml-1.5 text-neutral-800 hover:text-brand-red transition relative"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>

        {/* Contextual Back Button */}
        {!isDashboard && (
          <button
            onClick={onGoBack}
            id="headerBackBtn"
            className="flex items-center gap-1 text-xs font-mono tracking-wider font-semibold text-neutral-600 hover:text-neutral-900 transition"
          >
            <svg className="w-4 h-4 text-brand-red stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span id="headerBackLabel">RETURN</span>
          </button>
        )}
      </div>

      {/* Center Wordmark / Screen Title */}
      <div className="text-center cursor-pointer" onClick={() => onNavigate("dashboard")}>
        <h1 className="font-display font-black tracking-[0.24em] text-sm text-neutral-900 leading-none">REDLINE</h1>
        <p id="topSubStatus" className="font-mono text-[9px] tracking-widest text-neutral-400 mt-0.5 uppercase">
          ON-DEVICE // ZERO INGRESS
        </p>
      </div>

      {/* Top-Right Action: Backend Status & Profile */}
      <div className="flex items-center gap-2">
        <div
          id="backendStatusPill"
          className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-brand-border rounded-full shadow-xs"
          title={isBackendConnected ? "Backend: Connected (SQLite)" : "Backend: Offline (local demo)"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`}></span>
          <span className="font-mono text-[9px] font-semibold text-neutral-600">
            {isBackendConnected ? "Backend: Connected" : "Backend: Offline"}
          </span>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          aria-label="Profile"
          className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-display font-bold text-xs tracking-wider ring-2 ring-brand-red/20 shadow-xs hover:scale-105 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
