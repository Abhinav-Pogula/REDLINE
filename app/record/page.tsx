"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { BackArrowIcon, MicIcon, CheckIcon, CloseIcon } from "@/components/ui/Icons";

export default function RecordPage() {
  const router = useRouter();
  const { addMeeting, meetings } = useMemory();

  const [selectedSource, setSelectedSource] = useState<string>("Auto");
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(142); // Seed timer for realistic feel
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const sources = [
    "Auto",
    "Google Meet",
    "Zoom",
    "Teams",
    "WhatsApp",
    "Call",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused && !isProcessing) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, isProcessing]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate real-time audio parsing & memory extraction transition
    setTimeout(() => {
      // Add mock captured meeting (Meeting 4 or customized live capture)
      const meetingId = `m-${Date.now()}`;
      const evId = `ev-${Date.now()}`;

      addMeeting(
        {
          id: meetingId,
          title: "Ad-hoc Sync Call",
          source: selectedSource.toLowerCase().includes("meet")
            ? "google_meet"
            : selectedSource.toLowerCase().includes("zoom")
            ? "zoom"
            : selectedSource.toLowerCase().includes("teams")
            ? "teams"
            : "cellular_call",
          startedAt: new Date().toISOString(),
          transcript: "Team agreed to confirm Alex Chen as lead on security sign-off before Friday.",
          summary: "Real-time captured audio parsed and indexed into Redline memory store.",
        },
        [],
        [],
        [],
        [
          {
            id: evId,
            meetingId,
            type: "AUDIO",
            content: "Team agreed to confirm Alex Chen as lead on security sign-off before Friday.",
            timestamp: "Just now",
          },
        ]
      );

      setIsProcessing(false);
      router.push(`/meetings/${meetingId}`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <BackArrowIcon size={18} />
        </Link>
        <span className="font-headline font-bold text-base text-[var(--secondary)]">
          Live Audio Memory Capture
        </span>
        <div className="w-8" />
      </div>

      {/* Source Selector Row (Pills) */}
      <div className="space-y-2">
        <label className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">
          Audio Input Source
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sources.map((src) => {
            const isSelected = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all flex-shrink-0 ${
                  isSelected
                    ? "bg-[var(--primary)] text-[var(--primary-ink)] font-bold border-[var(--primary)]"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>

      {/* Capture State Card */}
      {isProcessing ? (
        <Card highlightBorder className="py-12 text-center space-y-4 bg-red-500/5">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin mx-auto" />
          <div>
            <h2 className="font-headline font-bold text-base text-[var(--primary)]">
              Extracting Structured Memory...
            </h2>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Checking decisions, constraints, & contradiction rules
            </p>
          </div>
        </Card>
      ) : (
        <Card highlightBorder className="py-10 text-center space-y-6">
          {/* Pulsing Primary Dot */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[var(--primary)]/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-[var(--primary)] text-[var(--primary-ink)] flex items-center justify-center shadow-2xl">
              <MicIcon size={38} className={isPaused ? "" : "animate-pulse"} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[var(--primary)] tracking-widest uppercase">
                {isPaused ? "CAPTURE PAUSED" : "REDLINE IS CAPTURING"}
              </span>
            </div>
            <p className="font-mono text-3xl font-bold tracking-widest text-[var(--secondary)] pt-1">
              {formatTimer(seconds)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleStopRecording}
            >
              <CheckIcon size={16} /> Stop & Parse Memory
            </Button>
          </div>

          <p className="font-mono text-[10px] text-[var(--text-muted)]">
            Listening locally. Audio remains on-device.
          </p>
        </Card>
      )}

      {/* Memory Guard Note */}
      <Card className="bg-[var(--surface)] border-[var(--border)] text-xs text-[var(--text-muted)] space-y-1">
        <span className="font-mono text-[10px] text-[var(--primary)] uppercase font-bold block">
          Proactive Contradiction Prevention
        </span>
        <p>
          Redline parses commitments & decisions in real time. If a statement conflicts with prior security windows or launch dates, an alert will be flagged immediately.
        </p>
      </Card>
    </div>
  );
}
