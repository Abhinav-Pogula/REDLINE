"use client";

import React, { useState, useEffect } from "react";

interface DesktopRecordProps {
  onStopAndCompile: () => void;
  onOpenConflict: () => void;
  onExtractTranscript?: (transcript: string) => Promise<void>;
  isExtracting?: boolean;
}

export const DesktopRecord: React.FC<DesktopRecordProps> = ({
  onStopAndCompile,
  onOpenConflict,
  onExtractTranscript,
  isExtracting = false,
}) => {
  const [intakeMode, setIntakeMode] = useState<"audio" | "paste">("paste");
  const [transcriptInput, setTranscriptInput] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(260); // 00:04:20
  const [selectedSource, setSelectedSource] = useState<string>("Auto");
  const [waveHeights, setWaveHeights] = useState<number[]>([
    18, 32, 45, 24, 52, 38, 48, 20, 36, 56, 18, 42, 30, 50, 26, 38, 22, 44, 52, 28, 40, 22, 34, 48, 16, 30
  ]);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const timerInterval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const waveInterval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 48) + 10)
      );
    }, 150);

    return () => {
      clearInterval(timerInterval);
      clearInterval(waveInterval);
    };
  }, [isRecording, isPaused]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      onStopAndCompile();
    } else {
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!transcriptInput.trim() || !onExtractTranscript) return;
    await onExtractTranscript(transcriptInput);
  };

  return (
    <div className="flex flex-col p-8 gap-6 max-w-7xl mx-auto w-full" id="view-desktop-record">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
            <span className="w-2 h-2 rounded-full bg-redline-red animate-ping"></span>
            <span>FORENSIC OPERATING CONSOLE</span>
            <span>•</span>
            <span>STRUCTURED MEMORY INTAKE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-neutral-950 tracking-tight font-display">
            On-Device Memory Intake &amp; Extraction
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-300">
            <button
              type="button"
              onClick={() => setIntakeMode("audio")}
              className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition ${
                intakeMode === "audio"
                  ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              🎙️ Live Audio
            </button>
            <button
              type="button"
              onClick={() => setIntakeMode("paste")}
              className={`px-3 py-1.5 font-mono text-xs font-bold rounded-lg transition ${
                intakeMode === "paste"
                  ? "bg-redline-red text-white shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              📝 Paste Transcript
            </button>
          </div>

          <button
            onClick={onOpenConflict}
            className="flex items-center gap-2 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors"
          >
            <span>⚠️</span>
            <span>OPEN CONFLICT PROVER</span>
          </button>
        </div>
      </div>

      {intakeMode === "paste" ? (
        /* DESKTOP PASTE TRANSCRIPT FORM */
        <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                PASTE TRANSCRIPT FALLBACK PATH (P0 REQUIREMENT)
              </span>
              <span className="text-base font-mono font-bold text-neutral-900">
                Unstructured Transcript &rarr; Forensic Memory Extractor
              </span>
            </div>
            <span className="px-3 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-xs font-bold text-neutral-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ON-DEVICE PARSER ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-neutral-700 uppercase">
              Meeting Transcript Content:
            </label>
            <textarea
              value={transcriptInput}
              onChange={(e) => setTranscriptInput(e.target.value)}
              placeholder="Paste meeting transcript text here...&#10;e.g. 'Let\'s move the launch to October 10th because security review is still pending.'"
              rows={7}
              disabled={isExtracting}
              className="w-full p-4 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-redline-red bg-neutral-50 text-neutral-900 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span>Quick Sample:</span>
              <button
                type="button"
                onClick={() => setTranscriptInput("Let's move the launch to October 10th because security review is still pending.")}
                className="text-redline-red hover:underline font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200"
              >
                &quot;Let&apos;s move the launch to October 10th...&quot;
              </button>
            </div>

            <button
              type="button"
              onClick={handlePasteSubmit}
              disabled={isExtracting || !transcriptInput.trim()}
              className={`px-8 py-3.5 rounded-xl font-mono text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 transition ${
                isExtracting || !transcriptInput.trim()
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : "bg-redline-red hover:bg-redline-redHover text-white active:scale-95"
              }`}
            >
              {isExtracting ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Extract Structured Memory</span>
                </>
              )}
            </button>
          </div>

          {isExtracting && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-1">
              <div className="font-mono text-xs text-amber-800 font-bold flex items-center justify-center gap-2">
                <span className="animate-spin text-sm">⚙️</span>
                <span>Running the on-device parser...</span>
              </div>
              <p className="text-xs text-amber-700 font-mono">
                Deterministic, offline extraction &mdash; no model call, no network round trip.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Main Console & Sidebar Grid for Audio Intake */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Acoustic Console */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          {/* Top Session Telemetry */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                ACTIVE CAPTURE SESSION
              </span>
              <span className="text-sm font-mono font-bold text-neutral-900">
                SESSION #TX-804-992 // ON-DEVICE BUFFER
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-neutral-100 border border-neutral-200 font-mono text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-redline-red fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                </svg>
                AIR-GAPPED
              </span>
            </div>
          </div>

          {/* Big Monospace Timer HUD */}
          <div className="text-center py-4 space-y-2">
            <div className="text-6xl font-extrabold font-mono tracking-tight text-neutral-950">
              00:{mins}:{secs}
            </div>
            <p className="font-mono text-xs text-neutral-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-redline-red"></span>
              BUFFER IN-RAM: <span className="text-neutral-800 font-bold">3.4 MB (ZERO CLOUD TRANSMISSION)</span>
            </p>
          </div>

          {/* Dynamic Audio Waveform Visualizer */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3">
              <span>REAL-TIME SPECTRAL DENSITY // PCM STREAM</span>
              <span className="text-redline-red font-bold">SAMPLING: 48,000 Hz</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 h-20">
              {waveHeights.map((h, i) => {
                const isRed = i >= 9 && i <= 17;
                return (
                  <div
                    key={i}
                    style={{
                      height: `${isPaused ? 8 : h}px`,
                      width: "4px",
                      borderRadius: "9999px",
                      backgroundColor: isRed ? "#e5342b" : "#111111",
                      transition: "height 0.15s ease",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-5 py-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 font-mono text-xs font-bold text-neutral-800 shadow-xs flex items-center gap-2 transition"
            >
              <span>{isPaused ? "▶ RESUME" : "⏸ PAUSE"}</span>
            </button>

            <button
              onClick={handleToggleRecord}
              className="relative px-8 py-3.5 rounded-xl bg-redline-red hover:bg-redline-redHover text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 transition transform active:scale-95"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>STOP &amp; COMPILE RESULT</span>
            </button>
          </div>

          {/* Live Synthesis Box */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1.5 font-bold text-redline-red">
                <span>🎙️</span>
                <span>ON-DEVICE SYNTHESIS ENGINE</span>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                99.4% CONFIDENCE
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-800 italic leading-relaxed pt-1">
              &quot;...confirming non-compression of 14-day security observation schedule through October 19. Team agrees to lock perimeter verification...&quot;
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Pipeline Vector & Hardware Settings */}
        <div className="lg:col-span-4 space-y-5">
          {/* Forensic Pipeline Step Tracker */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-500 font-bold uppercase">FORENSIC PIPELINE VECTOR</span>
              <span className="text-redline-red font-bold">ACTIVE STEP 4/6</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold">
              <div className="p-2 rounded bg-redline-red text-white flex items-center justify-between">
                <span>1. CAPTURE</span>
                <span>✓</span>
              </div>
              <div className="p-2 rounded bg-redline-red text-white flex items-center justify-between">
                <span>2. STRUCT</span>
                <span>✓</span>
              </div>
              <div className="p-2 rounded bg-redline-red text-white flex items-center justify-between">
                <span>3. RECALL</span>
                <span>✓</span>
              </div>
              <div className="p-2 rounded bg-redline-red text-white flex items-center justify-between animate-pulse">
                <span>4. CMPR</span>
                <span>●</span>
              </div>
              <div className="p-2 rounded bg-neutral-100 text-neutral-500 flex items-center justify-between">
                <span>5. FLAG</span>
                <span>⏳</span>
              </div>
              <div className="p-2 rounded bg-neutral-100 text-neutral-500 flex items-center justify-between">
                <span>6. PROVE</span>
                <span>⏳</span>
              </div>
            </div>
          </div>

          {/* Meeting Source Intake */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="font-bold uppercase">INTAKE SOURCE SELECTOR</span>
              <span className="text-xs">SYS ID: CAP-01</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Auto", "Google Meet", "Zoom", "Teams", "Slack Huddle", "WhatsApp"].map((src) => {
                const isActive = selectedSource === src;
                return (
                  <button
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className={`px-3 py-2 rounded-lg font-mono text-xs transition text-left flex items-center justify-between ${
                      isActive
                        ? "bg-redline-red text-white font-bold shadow-xs"
                        : "bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-redline-red"
                    }`}
                  >
                    <span>{src}</span>
                    {isActive && <span>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Hardware Security Guarantee */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 font-display">
              <span className="text-base">🛡️</span>
              <span>Hardware Enclave Assurance</span>
            </div>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              Audio is processed completely in volatile RAM on the sovereign hardware enclave. No external network transmission occurs without your cryptographic signature.
            </p>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>ZERO INGRESS VERIFIED</span>
              <span className="text-emerald-600 font-bold">● ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
