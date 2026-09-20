"use client";

import React from "react";
import { useRedline } from "../../hooks/useRedline";
import { DesktopWindowFrame } from "../../components/desktop/DesktopWindowFrame";
import Link from "next/link";

export default function DesktopPage() {
  const redline = useRedline();

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-6 lg:p-10 select-none">
      <div className="w-full max-w-[1440px] mb-2 flex items-center justify-between text-xs font-mono text-neutral-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
          <span>REDLINE DESKTOP COMPANION // OFFICE KIT LIVE NODE</span>
        </div>
        <Link
          href="/"
          className="text-white hover:text-brand-red underline flex items-center gap-1 font-bold"
        >
          <span>&larr;</span>
          <span>Switch to Phone Frame</span>
        </Link>
      </div>

      <DesktopWindowFrame
        conflicts={redline.engineResult.conflicts}
        decisions={redline.decisions}
        constraints={redline.constraints}
        commitments={redline.commitments}
        evidenceList={redline.evidenceList}
        initialTab="dashboard"
        isBackendConnected={redline.isBackendConnected}
        onExtractTranscript={redline.extractTranscript}
        isExtracting={redline.isExtracting}
        selectedConflict={redline.selectedConflict}
      />
    </div>
  );
}
