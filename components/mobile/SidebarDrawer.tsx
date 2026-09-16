"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onShowAlert: (title: string, message: string) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  onShowAlert,
}) => {
  const selectScreen = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <div
      id="navDrawerContainer"
      className={`absolute inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none hidden"
      }`}
    >
      {/* Backdrop */}
      <div
        id="navDrawerBackdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* White Sidebar Panel */}
      <aside
        id="navDrawerPanel"
        className={`absolute inset-y-0 left-0 w-[300px] bg-white border-r border-brand-border shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-4 overflow-y-auto hide-scrollbar flex-1">
          {/* Top: Avatar, name, role */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center font-display font-black text-sm text-neutral-800 tracking-wider shadow-2xs">
                  AR
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center border border-white text-[8px]">
                  🛡️
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-neutral-950 leading-tight">Alex Rivera</h3>
                <p className="text-[10px] font-sans text-neutral-500">Lead Infrastructure Architect • SecOps</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Drawer"
              className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => selectScreen("dashboard")}
              id="drawerLink-dashboard"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "dashboard"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">⚡</span>
                <span className="text-neutral-950 font-bold font-sans">Dashboard</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 2. Record */}
            <button
              onClick={() => selectScreen("capture")}
              id="drawerLink-capture"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "capture"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🎙️</span>
                <span className="text-neutral-950 font-bold font-sans">Record</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 3. Calendar */}
            <button
              onClick={() => selectScreen("calendar")}
              id="drawerLink-calendar"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "calendar"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">📅</span>
                <span className="text-neutral-950 font-bold font-sans">Calendar</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 4. Timeline */}
            <button
              onClick={() => selectScreen("timeline")}
              id="drawerLink-timeline"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "timeline"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">⏱️</span>
                <span className="text-neutral-950 font-bold font-sans">Timeline</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 5. Conflicts */}
            <button
              onClick={() => selectScreen("conflict")}
              id="drawerLink-audit"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "conflict"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">⚠️</span>
                <span className="text-neutral-950 font-bold font-sans">Conflicts</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* Divider */}
            <div className="pt-2 pb-1 border-t border-neutral-200 my-2"></div>

            {/* 6. Your Data */}
            <button
              onClick={() => {
                selectScreen("profile");
                onShowAlert(
                  "Your Data Ledger",
                  "Local encrypted memory ledger holding 1.2 GB of acoustic indexes and timeline trees. Zero cloud exfiltration."
                );
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">🗄️</span>
                <span className="text-neutral-950 font-bold font-sans">Your Data</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 7. Laptop Connection */}
            <button
              onClick={() => {
                selectScreen("profile");
                onShowAlert(
                  "Laptop Connection",
                  "Office Kit Pairing active via local cryptographic handshake (BLE + Local Wi-Fi). Instant handover to Desktop Companion."
                );
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">💻</span>
                <span className="text-neutral-950 font-bold font-sans">Laptop Connection</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>

            {/* 8. About REDLINE */}
            <button
              onClick={() => selectScreen("profile")}
              id="drawerLink-profile"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition ${
                currentScreen === "profile"
                  ? "font-bold text-brand-red bg-[#fdeaea] border border-brand-red/30"
                  : "font-medium text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">ℹ️</span>
                <span className="text-neutral-950 font-bold font-sans">About REDLINE</span>
              </div>
              <span className="text-neutral-400 font-mono text-sm">&gt;</span>
            </button>
          </nav>
        </div>

        {/* Bottom of Drawer: MEMORY ACTIVE status pill */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-brand-border shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            <div>
              <p className="font-mono text-[10px] font-bold text-neutral-900 tracking-wider">● MEMORY ACTIVE</p>
              <p className="text-[9px] font-mono text-neutral-500">ZERO-INGRESS HARDWARE ENCLAVE</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
