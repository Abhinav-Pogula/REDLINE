"use client";

import React from "react";

export type DesktopTab = "dashboard" | "devices" | "record" | "calendar" | "timeline" | "conflicts";

interface DesktopSidebarProps {
  currentTab: DesktopTab;
  onSelectTab: (tab: DesktopTab) => void;
  onShowModal: (title: string, message: string) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentTab,
  onSelectTab,
  onShowModal,
}) => {
  return (
    <aside
      className="w-64 border-r border-neutral-200 flex flex-col justify-between bg-white shrink-0 py-5 px-3 select-none"
      data-purpose="navigation-sidebar"
    >
      {/* Top Nav Items & Profile */}
      <div className="flex flex-col gap-5">
        {/* Profile Badge */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border border-neutral-300 font-mono font-bold text-neutral-700 text-sm">
            AR
            <span className="absolute -bottom-0.5 -right-0.5 bg-neutral-900 text-white rounded-full p-0.5">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                  fillRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900 leading-tight">Alex Rivera</span>
            <span className="text-[11px] text-neutral-500 font-medium">SecOps Architect</span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col gap-1 text-xs font-semibold" data-purpose="sidebar-menu">
          {/* Dashboard */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "dashboard"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-900 hover:bg-neutral-100"
            }`}
            id="nav-dashboard"
            onClick={() => onSelectTab("dashboard")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📊</span>
              <span className="tracking-tight">Dashboard</span>
            </div>
            <span className="text-neutral-400 text-xs">›</span>
          </button>

          {/* Device Connection */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "devices"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            id="nav-devices"
            onClick={() => onSelectTab("devices")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📱</span>
              <span className="tracking-tight">Device Connection</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {/* Record */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "record"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            id="nav-record"
            onClick={() => onSelectTab("record")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🎙️</span>
              <span className="tracking-tight">Record</span>
            </div>
            <span className="text-neutral-400 text-xs">›</span>
          </button>

          {/* Calendar */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "calendar"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            id="nav-calendar"
            onClick={() => onSelectTab("calendar")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📅</span>
              <span className="tracking-tight">Calendar</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-redline-red text-white font-mono text-[10px] font-bold">
              3
            </span>
          </button>

          {/* Timeline */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "timeline"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            id="nav-timeline"
            onClick={() => onSelectTab("timeline")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">⏱️</span>
              <span className="tracking-tight">Timeline</span>
            </div>
            <span className="text-neutral-400 text-xs">›</span>
          </button>

          {/* Conflicts */}
          <button
            className={`nav-button flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors w-full text-left ${
              currentTab === "conflicts"
                ? "bg-red-50 border-red-200 text-redline-red"
                : "border-transparent text-neutral-700 hover:bg-neutral-100"
            }`}
            id="nav-conflicts"
            onClick={() => onSelectTab("conflicts")}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">⚠️</span>
              <span className="tracking-tight">Conflicts</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-redline-red font-mono text-[9px] font-bold">
              1 FLAG
            </span>
          </button>

          {/* Separator */}
          <div className="h-px bg-neutral-200 my-2"></div>

          {/* Secondary Links */}
          <div
            onClick={() =>
              onShowModal(
                "Your Data Ledger",
                "Local encrypted memory ledger holding 1.2 GB of acoustic indexes and timeline trees. Zero cloud exfiltration active."
              )
            }
            className="flex items-center justify-between px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💾</span>
              <span className="font-medium text-xs">Your Data</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">1.2 GB</span>
          </div>

          <div
            onClick={() =>
              onShowModal(
                "Laptop Connection",
                "Office Kit Pairing active via local cryptographic handshake (BLE 5.3 + Local Wi-Fi Direct). Synchronized with iQOO handset."
              )
            }
            className="flex items-center justify-between px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💻</span>
              <span className="font-medium text-xs">Laptop Connection</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-redline-red"></span>
          </div>

          <div
            onClick={() =>
              onShowModal(
                "About REDLINE",
                "REDLINE Sovereign Work Memory OS v2.4.1\nEngine: On-Device Neural Prover\nTarget: Defense-Grade Conflict Forensics."
              )
            }
            className="flex items-center justify-between px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">ℹ️</span>
              <span className="font-medium text-xs">About REDLINE</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">v2.4.1</span>
          </div>
        </nav>
      </div>

      {/* Bottom Pinned Memory Status Card */}
      <div className="px-2 pt-3 border-t border-neutral-200" data-purpose="sidebar-footer">
        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-neutral-200 bg-neutral-50 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-redline-red animate-ping"></span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-800 uppercase">
            ● MEMORY ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
};
