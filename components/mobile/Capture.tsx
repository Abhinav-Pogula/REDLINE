"use client";

import React, { useState, useEffect } from "react";
import { Screen, CaptureStatus, ExtractOutcome } from "../../lib/types";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";
import { defaultTranscriptionProvider, preloadAsr, AsrProgressStatus } from "../../lib/asr";

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

  // Real microphone capture (Phase 3) -- replaces a fake timer + Math.random()
  // waveform that ran regardless of whether a microphone existed.
  const recorder = useAudioRecorder();
  const [transcribeStatus, setTranscribeStatus] = useState<"idle" | AsrProgressStatus>("idle");
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>("");

  // Warm the on-device Whisper model in the background as soon as Audio
  // Intake opens, so the model download (one-time, browser-cached after)
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
        onShowAlert?.(
          "Nothing heard",
          "The recording didn't contain recognizable speech. Try again and speak clearly, or use Paste Transcript."
        );
        return;
      }
      if (onExtractTranscript) {
        await onExtractTranscript(text);
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
              actually fire on screen instead of only existing internally.
              The Rule 5 sample deliberately talks about the design review,
              NOT the launch date -- the seeded hero scenario already has an
              open Rule 1 (launch vs. security review) conflict, so a hedged
              decision on that same topic would also re-trigger Rule 1 and,
              since only the first newly-triggered conflict is shown,
              silently mask the Rule 5 result this button is meant to
              demonstrate. */}
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
              onClick={() => setTranscriptInput("We might move the design review to next month, but I'm not sure yet.")}
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
          {!recorder.isSupported ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 text-center shadow-sm space-y-3">
              <p className="text-sm font-semibold text-neutral-900">Microphone capture isn&apos;t supported in this browser.</p>
              <p className="text-xs text-neutral-600 font-mono leading-relaxed">
                Use Paste Transcript instead &mdash; it works everywhere and needs no microphone or network access.
              </p>
              <button
                type="button"
                onClick={() => setIntakeMode("paste")}
                className="mt-2 px-4 py-2 bg-brand-red text-white rounded-xl font-mono text-xs font-bold"
              >
                Switch to Paste Transcript
              </button>
            </div>
          ) : recorder.isRecording ? (
            <>
              {/* Capture Mode State Bar */}
              <div className="bg-[#fdeaea] border-l-4 border-brand-red rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-display font-bold text-sm text-neutral-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping"></span>
                    <span>REDLINE IS CAPTURING</span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    MICROPHONE (BROWSER) &mdash; device-audio capture is Android-only, future work
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-white border border-brand-red/30 rounded text-[9px] font-mono font-bold text-brand-red">
                    {recorder.isPaused ? "PAUSED" : "STATE A // LIVE"}
                  </span>
                  <p className="text-[9px] font-mono text-neutral-500 mt-1">LIVE MIC LEVEL METER</p>
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
                  Recorded locally, never uploaded &mdash; transcribed on-device after you stop
                </p>

                {/* Dynamic Waveform Bars -- driven by real microphone input levels */}
                <div className="flex items-center justify-center gap-1.5 h-16 my-5" id="waveformContainer">
                  {recorder.levels.map((h, i) => {
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
                          transition: "height 0.1s ease",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Mic Action Trigger -- tap to stop while recording */}
                <div className="relative inline-flex items-center justify-center my-2">
                  <div className="absolute w-24 h-24 rounded-full bg-brand-red/15 animate-ping pointer-events-none"></div>
                  <button
                    id="mainMicTrigger"
                    onClick={handleStopAndCompile}
                    title="Stop and compile"
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

                <div className="bg-brand-bg rounded-xl p-2.5 mt-4 border border-neutral-200 text-left">
                  <p className="text-[11px] font-mono text-neutral-600 leading-relaxed">
                    🎙 Recording microphone audio. This app records-then-compiles (not live streaming) &mdash; transcription
                    runs on-device via Whisper (WASM) once you stop.
                  </p>
                </div>
              </div>

              {/* Meeting Source Tag */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span>MEETING SOURCE TAG</span>
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

              {/* Privacy Guarantee Note */}
              <div className="bg-neutral-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-600">
                <svg className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="leading-relaxed">
                  REDLINE listens with your permission and transcribes locally on this device. No microphone audio is ever uploaded.
                </p>
              </div>

              {/* Capture Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={recorder.togglePause}
                  id="pauseBtn"
                  className="py-3 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition"
                >
                  <span>{recorder.isPaused ? "▶" : "⏸"}</span>
                  <span id="pauseBtnLabel">{recorder.isPaused ? "RESUME" : "PAUSE"}</span>
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
          ) : transcribeStatus !== "idle" ? (
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm space-y-3">
              <span className="inline-block w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-sm font-bold text-neutral-900">
                {transcribeStatus === "loading-model" && "Loading on-device speech model..."}
                {transcribeStatus === "decoding" && "Decoding recording..."}
                {transcribeStatus === "transcribing" && "Transcribing on-device (Whisper, WASM)..."}
              </p>
              <p className="text-[11px] font-mono text-neutral-500">
                First use downloads a small speech model (~40MB) once; it&apos;s cached locally after that.
              </p>
            </div>
          ) : (
            /* IDLE -- not recording yet */
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm space-y-4">
              {transcribeError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-left space-y-1">
                  <p className="text-xs font-bold text-red-800 font-mono">Transcription issue</p>
                  <p className="text-[11px] text-red-700 font-mono leading-relaxed">{transcribeError}</p>
                </div>
              )}
              {recorder.error && !transcribeError && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left space-y-1">
                  <p className="text-xs font-bold text-amber-800 font-mono">Microphone issue</p>
                  <p className="text-[11px] text-amber-700 font-mono leading-relaxed">{recorder.error}</p>
                </div>
              )}
              <div className="relative inline-flex items-center justify-center">
                <button
                  onClick={handleStartRecording}
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
              <p className="font-mono text-xs font-bold text-neutral-900">TAP TO START RECORDING</p>
              <p className="text-[11px] text-neutral-500 font-mono leading-relaxed max-w-xs mx-auto">
                Captures microphone audio only (a browser tab can&apos;t capture device/call audio) &mdash;
                transcribed on-device with Whisper after you stop. Requests microphone permission on first use.
              </p>
              {lastTranscript && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-left">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase mb-1">Last transcription</p>
                  <p className="text-xs font-mono text-neutral-800 italic">&quot;{lastTranscript}&quot;</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
</section>
  );
};
