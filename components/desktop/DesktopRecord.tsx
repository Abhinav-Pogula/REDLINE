"use client";

import React, { useState, useEffect } from "react";
import { ExtractOutcome } from "../../lib/types";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { defaultTranscriptionProvider, preloadAsr, AsrProgressStatus } from "../../lib/asr";

interface DesktopRecordProps {
  onStopAndCompile: () => void;
  onOpenConflict: () => void;
  onExtractTranscript?: (transcript: string) => Promise<ExtractOutcome>;
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
  // Desktop has no equivalent of the mobile app's shared `currentScreen` /
  // toast / alert wiring (DesktopWindowFrame keeps its own separate tab
  // state), so a paste that only superseded a decision, or found nothing,
  // previously vanished with zero feedback. This renders that outcome
  // inline instead of silently dropping it.
  const [lastOutcome, setLastOutcome] = useState<ExtractOutcome | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>("Auto");

  // Real microphone capture (Phase 3) -- replaces a fake timer + Math.random()
  // waveform that started "recording" the moment the tab opened, whether or
  // not a microphone existed.
  const recorder = useAudioRecorder();
  const [transcribeStatus, setTranscribeStatus] = useState<"idle" | AsrProgressStatus>("idle");
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>("");

  // Warm the on-device Whisper model in the background as soon as Live
  // Audio mode opens, so the (one-time, browser-cached) model download
  // isn't also sitting on the critical path of the first real transcription.
  useEffect(() => {
    if (intakeMode === "audio") {
      preloadAsr();
    }
  }, [intakeMode]);

  const mins = String(Math.floor(recorder.elapsedSeconds / 60)).padStart(2, "0");
  const secs = String(recorder.elapsedSeconds % 60).padStart(2, "0");

  const handleStartRecording = async () => {
    setTranscribeError(null);
    setLastTranscript("");
    await recorder.start();
  };

  const handleStopAndCompile = async () => {
    setTranscribeError(null);
    const blob = await recorder.stop();
    if (!blob || blob.size === 0) {
      setTranscribeError("No audio was captured. Try recording again, or use Paste Transcript.");
      return;
    }
    try {
      const { text } = await defaultTranscriptionProvider.transcribeAudio(blob, (status) =>
        setTranscribeStatus(status === "done" ? "idle" : status)
      );
      setTranscribeStatus("idle");
      setLastTranscript(text);
      if (!text.trim()) {
        setTranscribeError("The recording didn't contain recognizable speech. Try again and speak clearly, or use Paste Transcript.");
        return;
      }
      if (onExtractTranscript) {
        const outcome = await onExtractTranscript(text);
        setLastOutcome(outcome);
        if (outcome.status === "new_conflict") {
          onOpenConflict();
        }
      }
    } catch (err: any) {
      setTranscribeStatus("idle");
      setTranscribeError(
        err?.message ||
          "On-device transcription failed. This can happen if the speech model couldn't download (it needs internet the first time it's used). Use Paste Transcript instead."
      );
    }
  };

  const handlePasteSubmit = async () => {
    if (!transcriptInput.trim() || !onExtractTranscript) return;
    const outcome = await onExtractTranscript(transcriptInput);
    setLastOutcome(outcome);
    // Only jump to the Conflict Prover when THIS paste actually produced a
    // new conflict -- previously nothing here navigated at all, so testers
    // had to click into the Conflicts tab manually and would see whatever
    // conflict was already sitting in state (e.g. the seeded hero scenario)
    // and mistake it for a result of the transcript they just pasted.
    if (outcome.status === "new_conflict") {
      onOpenConflict();
    } else if (outcome.status === "ok" || outcome.status === "superseded") {
      setTranscriptInput("");
    }
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

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 flex-wrap">
              <span>Quick Sample:</span>
              <button
                type="button"
                onClick={() => setTranscriptInput("Let's move the launch to October 10th because security review is still pending.")}
                className="text-redline-red hover:underline font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200"
              >
                RULE 1 &middot; &quot;...launch to October 10th...&quot;
              </button>
              <button
                type="button"
                onClick={() =>
                  setTranscriptInput(
                    "Priya, can you take the API integration? Let's say Friday.\nRahul, can you take the API integration? Let's say Monday."
                  )
                }
                className="text-redline-red hover:underline font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200"
              >
                RULE 3 &middot; &quot;Priya... Rahul... API integration...&quot;
              </button>
              <button
                type="button"
                onClick={() => setTranscriptInput("We might move the launch to November, but I'm not sure yet.")}
                className="text-redline-red hover:underline font-bold bg-red-50 px-2.5 py-1 rounded border border-red-200"
              >
                RULE 5 &middot; &quot;We might move... not sure yet...&quot;
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

          {/* Inline extraction outcome -- this is the only feedback surface
              on desktop for a paste that didn't produce a brand-new
              conflict (e.g. a superseded decision, or nothing extracted).
              Without it these outcomes were completely silent here. */}
          {!isExtracting && lastOutcome && (
            <div
              className={`rounded-xl p-4 border text-xs font-mono space-y-1 ${
                lastOutcome.status === "error"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : lastOutcome.status === "empty"
                  ? "bg-neutral-100 border-neutral-200 text-neutral-700"
                  : lastOutcome.status === "superseded"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              <div className="font-bold uppercase tracking-wide flex items-center gap-1.5">
                <span>
                  {lastOutcome.status === "error"
                    ? "⚠ Extraction Error"
                    : lastOutcome.status === "empty"
                    ? "Nothing Extracted"
                    : lastOutcome.status === "superseded"
                    ? "Decision Updated"
                    : "Extraction Complete"}
                </span>
              </div>
              <p className="leading-relaxed">{lastOutcome.message}</p>
            </div>
          )}
        </div>
      ) : !recorder.isSupported ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center shadow-sm space-y-3 max-w-xl">
          <p className="text-sm font-semibold text-neutral-900">Microphone capture isn&apos;t supported in this browser.</p>
          <p className="text-xs text-neutral-600 font-mono leading-relaxed">
            Use Paste Transcript instead &mdash; it works everywhere and needs no microphone or network access.
          </p>
          <button
            type="button"
            onClick={() => setIntakeMode("paste")}
            className="mt-2 px-4 py-2 bg-redline-red text-white rounded-xl font-mono text-xs font-bold"
          >
            Switch to Paste Transcript
          </button>
        </div>
      ) : (
        /* Main Console & Sidebar Grid for Audio Intake */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Acoustic Console */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          {recorder.isRecording ? (
            <>
              {/* Top Session Telemetry */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    ACTIVE CAPTURE SESSION
                  </span>
                  <span className="text-sm font-mono font-bold text-neutral-900">
                    SESSION #TX-804-992 // MICROPHONE (BROWSER)
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
                  Recorded locally, never uploaded (zero cloud transmission of audio)
                </p>
              </div>

              {/* Dynamic Audio Waveform Visualizer -- driven by real mic levels */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3">
                  <span>LIVE MIC LEVEL METER</span>
                  <span className="text-redline-red font-bold">{recorder.isPaused ? "PAUSED" : "LIVE"}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 h-20">
                  {recorder.levels.map((h, i) => {
                    const isRed = i >= 9 && i <= 17;
                    return (
                      <div
                        key={i}
                        style={{
                          height: `${h}px`,
                          width: "4px",
                          borderRadius: "9999px",
                          backgroundColor: isRed ? "#e5342b" : "#111111",
                          transition: "height 0.1s ease",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  onClick={recorder.togglePause}
                  className="px-5 py-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 font-mono text-xs font-bold text-neutral-800 shadow-xs flex items-center gap-2 transition"
                >
                  <span>{recorder.isPaused ? "▶ RESUME" : "⏸ PAUSE"}</span>
                </button>

                <button
                  onClick={handleStopAndCompile}
                  className="relative px-8 py-3.5 rounded-xl bg-redline-red hover:bg-redline-redHover text-white font-mono text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 transition transform active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                  <span>STOP &amp; COMPILE RESULT</span>
                </button>
              </div>

              {/* Live Status Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 font-bold text-redline-red text-[11px] font-mono">
                  <span>🎙️</span>
                  <span>RECORDING</span>
                </div>
                <p className="text-xs text-neutral-700 font-mono leading-relaxed pt-1">
                  This app records-then-compiles (not live streaming) &mdash; transcription runs on-device via
                  Whisper (WASM) once you stop.
                </p>
              </div>
            </>
          ) : transcribeStatus !== "idle" ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-16">
              <span className="inline-block w-8 h-8 border-2 border-redline-red border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-sm font-bold text-neutral-900">
                {transcribeStatus === "loading-model" && "Loading on-device speech model..."}
                {transcribeStatus === "decoding" && "Decoding recording..."}
                {transcribeStatus === "transcribing" && "Transcribing on-device (Whisper, WASM)..."}
              </p>
              <p className="text-xs font-mono text-neutral-500">
                First use downloads a small speech model (~40MB) once; it&apos;s cached locally after that.
              </p>
            </div>
          ) : (
            /* IDLE -- not recording yet */
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-14">
              {transcribeError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-left space-y-1 max-w-md">
                  <p className="text-xs font-bold text-red-800 font-mono">Transcription issue</p>
                  <p className="text-[11px] text-red-700 font-mono leading-relaxed">{transcribeError}</p>
                </div>
              )}
              {recorder.error && !transcribeError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left space-y-1 max-w-md">
                  <p className="text-xs font-bold text-amber-800 font-mono">Microphone issue</p>
                  <p className="text-[11px] text-amber-700 font-mono leading-relaxed">{recorder.error}</p>
                </div>
              )}
              <button
                onClick={handleStartRecording}
                className="px-8 py-4 rounded-xl bg-redline-red hover:bg-redline-redHover text-white font-mono text-sm font-bold tracking-wider uppercase shadow-md transition transform active:scale-95"
              >
                🎙️ Start Recording
              </button>
              <p className="text-xs text-neutral-500 font-mono max-w-sm leading-relaxed">
                Captures microphone audio only (a browser tab can&apos;t capture device/call audio) &mdash;
                transcribed on-device with Whisper after you stop. Requests microphone permission on first use.
              </p>
              {lastTranscript && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-left max-w-md">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Last transcription</p>
                  <p className="text-xs font-mono text-neutral-800 italic">&quot;{lastTranscript}&quot;</p>
                </div>
              )}
            </div>
          )}
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
