"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WAVEFORM_BAR_COUNT = 24;
const MIN_BAR_HEIGHT = 4;

export interface AudioRecorderState {
  /** False on the server, and on browsers without getUserMedia/MediaRecorder. */
  isSupported: boolean;
  isRecording: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  /** Rolling window of real audio-level samples, for driving a live waveform. */
  levels: number[];
  error: string | null;
  permissionDenied: boolean;
}

export interface AudioRecorderControls extends AudioRecorderState {
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  togglePause: () => void;
  reset: () => void;
}

/**
 * Real microphone capture: getUserMedia + MediaRecorder for the recording
 * itself, plus a Web Audio AnalyserNode driving a live level meter. This
 * replaces UI that previously only animated `Math.random()` bars on a
 * timer and never touched an actual microphone (Phase 3 of the post-UI
 * build checklist).
 *
 * Web-first, mic-only by design: capturing the OTHER side of a call --
 * audio already playing out of the device's own speakers -- needs a native
 * platform API (Android's AudioPlaybackCapture / MediaProjection) that a
 * browser tab has no access to. That's out of scope here, not a bug in
 * this hook.
 */
export function useAudioRecorder(): AudioRecorderControls {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => new Array(WAVEFORM_BAR_COUNT).fill(MIN_BAR_HEIGHT));
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopResolverRef = useRef<((blob: Blob | null) => void) | null>(null);

  useEffect(() => {
    setIsSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof window !== "undefined" &&
        typeof (window as any).MediaRecorder !== "undefined"
    );
  }, []);

  const tickLevels = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(data);
    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / data.length);
    // Mapped to roughly the same visual range (a handful to ~56px) the
    // previous fake bars used, so this drops into the existing UI cleanly.
    const height = Math.min(56, MIN_BAR_HEIGHT + rms * 220);
    setLevels((prev) => [...prev.slice(1), height]);
    rafRef.current = requestAnimationFrame(tickLevels);
  }, []);

  const cleanupAudioGraph = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setPermissionDenied(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx: AudioContext = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      chunksRef.current = [];
      const preferredMime = "audio/webm";
      const mimeType =
        typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(preferredMime)
          ? preferredMime
          : undefined;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        stopResolverRef.current?.(blob);
        stopResolverRef.current = null;
      };
      recorder.start();
      recorderRef.current = recorder;

      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
      rafRef.current = requestAnimationFrame(tickLevels);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err: any) {
      cleanupAudioGraph();
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        setPermissionDenied(true);
        setError("Microphone permission was denied. Allow microphone access and try again, or use Paste Transcript instead.");
      } else if (err?.name === "NotFoundError") {
        setError("No microphone found on this device. Use Paste Transcript instead.");
      } else {
        setError(err?.message || "Couldn't start microphone capture. Use Paste Transcript instead.");
      }
      setIsRecording(false);
    }
  }, [cleanupAudioGraph, tickLevels]);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        cleanupAudioGraph();
        setIsRecording(false);
        resolve(null);
        return;
      }
      stopResolverRef.current = resolve;
      recorder.stop();
      cleanupAudioGraph();
      setIsRecording(false);
      setIsPaused(false);
    });
  }, [cleanupAudioGraph]);

  const togglePause = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
  }, []);

  const reset = useCallback(() => {
    cleanupAudioGraph();
    setIsRecording(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setLevels(new Array(WAVEFORM_BAR_COUNT).fill(MIN_BAR_HEIGHT));
    setError(null);
    setPermissionDenied(false);
  }, [cleanupAudioGraph]);

  useEffect(() => () => cleanupAudioGraph(), [cleanupAudioGraph]);

  return {
    isSupported,
    isRecording,
    isPaused,
    elapsedSeconds,
    levels,
    error,
    permissionDenied,
    start,
    stop,
    togglePause,
    reset,
  };
}
