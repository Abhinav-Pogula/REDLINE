"use client";

import React, { useState } from "react";
import { DesktopSidebar, DesktopTab } from "./DesktopSidebar";
import { DesktopDashboard } from "./DesktopDashboard";
import { DeviceConnection } from "./DeviceConnection";
import { DesktopConflicts } from "./DesktopConflicts";
import { DesktopCalendar } from "./DesktopCalendar";
import { DesktopRecord } from "./DesktopRecord";
import { DesktopTimeline } from "./DesktopTimeline";
import { Conflict, Decision, Constraint, Commitment, Evidence } from "../../lib/data";

interface DesktopWindowFrameProps {
  conflicts: Conflict[];
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  evidenceList: Evidence[];
  onSwitchToMobile?: () => void;
  initialTab?: DesktopTab;
  isBackendConnected?: boolean;
  onExtractTranscript?: (transcript: string) => Promise<void>;
  isExtracting?: boolean;
}

export const DesktopWindowFrame: React.FC<DesktopWindowFrameProps> = ({
  conflicts,
  decisions,
  constraints,
  commitments,
  evidenceList,
  initialTab = "dashboard",
  isBackendConnected = false,
  onExtractTranscript,
  isExtracting = false,
}) => {
  const [currentTab, setCurrentTab] = useState<DesktopTab>(initialTab);
  const [modalData, setModalData] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showModal = (title: string, message: string) => {
    setModalData({ isOpen: true, title, message });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: "", message: "" });
  };

  return (
    <div
      className="w-full max-w-[1440px] h-[920px] bg-white rounded-2xl shadow-2xl border border-neutral-300 flex flex-col overflow-hidden relative text-slate-800"
      data-purpose="desktop-window"
    >
      {/* Top Window Titlebar */}
      <header
        className="h-10 bg-white border-b border-neutral-200 px-4 flex items-center justify-between select-none shrink-0"
        data-purpose="window-titlebar"
      >
        {/* Left: Mac/Windows styled subtle controls */}
        <div className="flex items-center gap-2 w-28">
          <span
            onClick={() => setCurrentTab("dashboard")}
            title="Dashboard"
            className="w-3 h-3 rounded-full bg-neutral-300 hover:bg-red-400 transition-colors cursor-pointer inline-block"
          />
          <span
            onClick={() => setCurrentTab("record")}
            title="Record Intake"
            className="w-3 h-3 rounded-full bg-neutral-300 hover:bg-yellow-400 transition-colors cursor-pointer inline-block"
          />
          <span
            onClick={() => setCurrentTab("devices")}
            title="Device Connection"
            className="w-3 h-3 rounded-full bg-neutral-300 hover:bg-green-400 transition-colors cursor-pointer inline-block"
          />
        </div>

        {/* Center: Tracked Brand Wordmark and Client Node Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-extrabold tracking-[0.25em] text-neutral-900 font-mono">REDLINE</span>
          <span className="text-neutral-400">|</span>
          <span className="font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
            OFFICE KIT CLIENT // ON-DEVICE NODE
          </span>
        </div>

        {/* Right: Link Pill and Status */}
        <div className="flex items-center justify-end gap-2 w-64">
          <div
            id="desktopBackendStatusPill"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-medium text-neutral-600"
            title={isBackendConnected ? "Backend: Connected (SQLite)" : "Backend: Offline (local demo)"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`}></span>
            <span>{isBackendConnected ? "Backend: Connected" : "Backend: Offline"}</span>
          </div>
          <div
            onClick={() => setCurrentTab("devices")}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-mono font-medium text-neutral-600 cursor-pointer hover:bg-neutral-200 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LINK: 5.2GHz</span>
          </div>
        </div>
      </header>

      {/* Main Window Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-white">
        {/* Left Persistent Sidebar */}
        <DesktopSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onShowModal={showModal}
        />

        {/* Right Main Scrollable View Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#fafafa] overflow-y-auto" data-purpose="main-viewport">
          {currentTab === "dashboard" && (
            <DesktopDashboard
              conflicts={conflicts}
              decisions={decisions}
              constraints={constraints}
              commitments={commitments}
              onOpenConflict={() => setCurrentTab("conflicts")}
              onOpenCalendar={() => setCurrentTab("calendar")}
              onOpenRecord={() => setCurrentTab("record")}
              onOpenDevices={() => setCurrentTab("devices")}
              onOpenTimeline={() => setCurrentTab("timeline")}
            />
          )}

          {currentTab === "devices" && <DeviceConnection />}

          {currentTab === "record" && (
            <DesktopRecord
              onStopAndCompile={() => setCurrentTab("conflicts")}
              onOpenConflict={() => setCurrentTab("conflicts")}
              onExtractTranscript={onExtractTranscript}
              isExtracting={isExtracting}
            />
          )}

          {currentTab === "calendar" && (
            <DesktopCalendar onOpenConflict={() => setCurrentTab("conflicts")} />
          )}

          {currentTab === "timeline" && (
            <DesktopTimeline
              onOpenConflict={() => setCurrentTab("conflicts")}
              onShowModal={showModal}
            />
          )}

          {currentTab === "conflicts" && (
            <DesktopConflicts
              conflicts={conflicts}
              evidenceList={evidenceList}
              onOpenCalendar={() => setCurrentTab("calendar")}
            />
          )}
        </main>
      </div>

      {/* Desktop Modal Dialog */}
      {modalData.isOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-neutral-300 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-redline-red animate-ping" />
                <h3 className="font-display font-bold text-base text-neutral-900">{modalData.title}</h3>
              </div>
              <button
                onClick={closeModal}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-sm font-bold transition"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed whitespace-pre-line">
              {modalData.message}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-mono text-xs font-bold rounded-xl transition shadow-xs"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
