"use client";

import React, { useState, useEffect } from "react";
import { Screen, CaptureStatus, ExtractOutcome } from "../../lib/types";

interface CaptureProps {
  onNavigate: (screen: Screen) => void;
  captureStatus?: CaptureStatus;
  setCaptureStatus?: (status: CaptureStatus) => void;
  pipelineStep?: number;
  setPipelineStep?: (step: number) => void;
  onShowAlert?: (title: string, message: string) => void;
  onExtractTranscript?: (transcript: string) => Promise<ExtractOutcome>;
  isExtracting?: boolean;
}

export const Capture: React.FC<CaptureProps> = ({
  onNavigate,
  onShowAlert,
  onExtractTranscript,
  isExtracting = false,
}) => {
  const [intakeMode, setIntakeMode] = useState<"audio" | "paste">("paste");
  const [transcriptInput, setTranscriptInput] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("Auto");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(260); // 00:04:20
  const [waveHeights, setWaveHeights] = useState<number[]>([
    18, 26, 40, 22, 48, 30, 44, 20, 36, 46, 16, 38, 28, 42, 24, 32, 20, 36, 48, 22, 34, 18
  ]);

  useEffect(() => {
    if (isPaused) return;

    const timerInterval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const waveInterval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 42) + 8)
      );
    }, 160);

    return () => {
      clearInterval(timerInterval);
      clearInterval(waveInterval);
    };
  }, [isPaused]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStopAndCompile = () => {
    onNavigate("result");
  };

  const handlePasteSubmit = async () => {
    if (!transcriptInput.trim() || !onExtractTranscript) return;
    await onExtractTranscript(transcriptInput);
  };

  return (
    <section id="view-capture" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Mode Selector Header */}
      <div className="flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
        <button
          type="button"
          onClick={() => setIntakeMode("audio")}
          className={`flex-1 py-2 font-mono text-xs font-bold rounded-xl transition ${
            intakeMode === "audio"
              ? "bg-white text-neutral-900 shadow-2xs border border-neutral-200"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          🎙️ Audio Intake
        </button>
        <button
          type="button"
          onClick={() => setIntakeMode("paste")}
          className={`flex-1 py-2 font-mono text-xs font-bold rounded-xl transition ${
            intakeMode === "paste"
              ? "bg-brand-red text-white shadow-2xs"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          📝 Paste Transcript
        </button>
      </div>

      {intakeMode === "paste" ? (
        /* PASTE TRANSCRIPT INPUT MODE */
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span className="font-bold text-neutral-900">PASTE TRANSCRIPT FALLBACK</span>
            <span className="px-2 py-0.5 bg-brand-red/10 border border-brand-red/30 rounded text-[9px] font-mono font-bold text-brand-red">
              P0 INTAKE
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Paste unstructured meeting transcripts here. REDLINE extracts decisions, constraints, and commitments instantly, entirely on-device &mdash; no network call, ever.
          </p>
          <textarea
            value={transcriptInput}
            onChange={(e) => setTranscriptInput(e.target.value)}
            placeholder="Paste transcript text here...&#10;e.g. 'Let\'s move the launch to October 10th because security review is still pending.'"
            rows={5}
            disabled={isExtracting}
            className="w-full p-3 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-brand-red bg-neutral-50 text-neutral-900 resize-none"
          />

          {/* Quick sample shortcuts -- one per conflict rule, so every rule in
              the engine (lib/conflict-engine.ts) has a one-click path to
              actually fire on screen instead of only existing internally. */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-neutral-400">QUICK SAMPLE:</span>
            <button
              type="button"
              onClick={() => setTranscriptInput("Let's move the launch to October 10th because security review is still pending.")}
              className="block text-left text-[11px] font-mono text-brand-red hover:underline bg-red-50 p-2 rounded-lg border border-red-100 w-full"
            >
              <span className="text-neutral-400 mr-1">[RULE 1 · DEPENDENCY]</span>
              &quot;Let&apos;s move the launch to October 10th because security review is still pending.&quot;
            </button>
            <button
              type="button"
              onClick={() =>
                setTranscriptInput(
                  "Priya, can you take the API integration? Let's say Friday.\nRahul, can you take the API integration? Let's say Monday."
                )
              }
              className="block text-left text-[11px] font-mono text-brand-red hover:underline bg-red-50 p-2 rounded-lg border border-red-100 w-full"
            >
              <span className="text-neutral-400 mr-1">[RULE 3 · OWNERSHIP]</span>
              &quot;Priya, can you take the API integration?... Rahul, can you take the API integration?...&quot;
            </button>
            <button
              type="button"
              onClick={() => setTranscriptInput("We might move the launch to November, but I'm not sure yet.")}
              className="block text-left text-[11px] font-mono text-brand-red hover:underline bg-red-50 p-2 rounded-lg border border-red-100 w-full"
            >
              <span className="text-neutral-400 mr-1">[RULE 5 · UNCERTAINTY]</span>
              &quot;We might move the launch to November, but I&apos;m not sure yet.&quot;
            </button>
          </div>

          <button
            type="button"
            onClick={handlePasteSubmit}
            disabled={isExtracting || !transcriptInput.trim()}
            className={`w-full py-3.5 rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm transition ${
              isExtracting || !transcriptInput.trim()
                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                : "bg-brand-red hover:bg-brand-redDark text-white active:scale-98"
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
                <span>EXTRACT STRUCTURED MEMORY</span>
              </>
            )}
          </button>

          {isExtracting && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center space-y-1">
              <div className="font-mono text-xs text-amber-800 font-bold flex items-center justify-center gap-2">
                <span className="animate-spin text-sm">⚙️</span>
                <span>Running the on-device parser...</span>
              </div>
              <p className="text-[11px] text-amber-700 font-mono">
                Deterministic, offline extraction &mdash; no model call, no network round trip.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* AUDIO INTAKE MODE */
        <>
          {/* Capture Mode State Bar */}
          <div className="bg-[#fdeaea] border-l-4 border-brand-red rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-display font-bold text-sm text-neutral-900">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping"></span>
                <span>REDLINE IS CAPTURING</span>
              </div>
              <p className="text-[11px] font-mono text-neutral-500 mt-0.5">DEVICE AUDIO + MICROPHONE</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 bg-white border border-brand-red/30 rounded text-[9px] font-mono font-bold text-brand-red">
                STATE A // LIVE
              </span>
              <p className="text-[9px] font-mono text-neutral-500 mt-1">48kHz • RAW PCM</p>
            </div>
          </div>

      {/* Center Acoustic Intake Console */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
          <span>SESSION: TX-804-992</span>
          <span className="flex items-center gap-1 text-neutral-700 font-bold">
            <svg className="w-3.5 h-3.5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
            </svg>
            AIR-GAPPED
          </span>
        </div>
        <div className="font-mono text-4xl font-bold tracking-tight text-neutral-900 my-1" id="captureTimer">
          00:{mins}:{secs}
        </div>
        <p className="font-mono text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          BUFFER IN-RAM: <span id="bufferSize" className="text-neutral-700 font-bold">3.4 MB</span>
        </p>

        {/* Dynamic Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-16 my-5" id="waveformContainer">
          {waveHeights.map((h, i) => {
            const isRed = i >= 8 && i <= 14;
            return (
              <div
                key={i}
                className={`wf-bar ${isRed ? "red" : ""}`}
                style={{
                  height: `${h}px`,
                  backgroundColor: isRed ? "#e5342b" : "#111111",
                  width: "3px",
                  borderRadius: "9999px",
                  transition: "height 0.15s ease",
                }}
              />
            );
          })}
        </div>

        {/* Mic Action Trigger */}
        <div className="relative inline-flex items-center justify-center my-2">
          <div className="absolute w-24 h-24 rounded-full bg-brand-red/15 animate-ping pointer-events-none"></div>
          <button
            id="mainMicTrigger"
            onClick={handleStopAndCompile}
            className="relative w-20 h-20 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V4.5a3 3 0 116 0V12a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>

        {/* Live Synthesis preview */}
        <div className="bg-brand-bg rounded-xl p-2.5 mt-4 border border-neutral-200 text-left">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
            <span className="flex items-center gap-1 text-brand-red font-bold">
              <span>🎙</span>
              <span>SYNTHESIS:</span>
            </span>
            <span className="text-neutral-700 font-bold">99.4% CONF</span>
          </div>
          <p id="liveSynthesisText" className="text-xs font-mono text-neutral-800 italic">
            &quot;...confirming non-compression of 14-day security observation schedule...&quot;
          </p>
        </div>
      </div>

      {/* Acoustic Intake Source Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <span>ACOUSTIC INTAKE SOURCE</span>
          <span>SYS ID: CAP-01</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
          {["Auto", "Meet", "Zoom", "Teams", "WhatsApp"].map((src) => {
            const isActive = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`source-chip px-3 py-1.5 rounded-full font-mono text-xs shrink-0 transition flex items-center gap-1 ${
                  isActive
                    ? "bg-brand-red text-white font-bold shadow-xs"
                    : "bg-white border border-neutral-300 text-neutral-700 hover:border-brand-red"
                }`}
              >
                {src === "Auto" && <span>✨</span>}
                <span>{src}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FORENSIC PIPELINE STEP TRACKER */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-neutral-500 font-bold uppercase">FORENSIC PIPELINE VECTOR</span>
          <span id="pipelineStepLabel" className="text-brand-red font-bold">
            ACTIVE STEP 4/6
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1 text-center text-[8px] font-mono font-bold">
          <div className="p-1 rounded bg-brand-red text-white">CAPTURE</div>
          <div className="p-1 rounded bg-brand-red text-white">STRUCT</div>
          <div className="p-1 rounded bg-brand-red text-white">RECALL</div>
          <div className="p-1 rounded bg-brand-red text-white animate-pulse">CMPR •</div>
          <div className="p-1 rounded bg-neutral-200 text-neutral-500">FLAG</div>
          <div className="p-1 rounded bg-neutral-200 text-neutral-500">PROVE</div>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="bg-neutral-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-600">
        <svg className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="leading-relaxed">
          REDLINE listens with your permission and processes everything locally on this device. No raw audio is streamed externally.
        </p>
      </div>

      {/* Capture Controls */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={togglePause}
          id="pauseBtn"
          className="py-3 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition"
        >
          <span>{isPaused ? "▶" : "⏸"}</span>
          <span id="pauseBtnLabel">{isPaused ? "RESUME" : "PAUSE"}</span>
        </button>
        <button
          onClick={handleStopAndCompile}
          className="py-3 px-4 bg-brand-red hover:bg-brand-redDark active:scale-95 text-white rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
        >
          <span>⏹</span>
          <span>STOP &amp; COMPILE</span>
        </button>
      </div>
    </>
  )}
</section>
  );
};
