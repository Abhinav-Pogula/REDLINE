"use client";

import React from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  AlertIcon,
  ChevronRightIcon,
  PlayIcon,
  FileTextIcon,
  TimelineIcon,
  UserCheckIcon,
} from "@/components/ui/Icons";

export default function Dashboard() {
  const { meetings, conflicts, decisions, commitments, runDemoSequence, isDemoRunning, demoStep } =
    useMemory();

  const [activeMeetingIndex, setActiveMeetingIndex] = React.useState(0);
  const meetingsScrollRef = React.useRef<HTMLDivElement>(null);

  const handleMeetingsScroll = () => {
    if (meetingsScrollRef.current) {
      const { scrollLeft, offsetWidth } = meetingsScrollRef.current;
      if (offsetWidth > 0) {
        const index = Math.round(scrollLeft / offsetWidth);
        setActiveMeetingIndex(Math.min(Math.max(0, index), Math.max(0, meetings.length - 1)));
      }
    }
  };

  const scrollToMeeting = (index: number) => {
    if (meetingsScrollRef.current) {
      meetingsScrollRef.current.scrollTo({
        left: index * meetingsScrollRef.current.offsetWidth,
        behavior: "smooth",
      });
      setActiveMeetingIndex(index);
    }
  };

  const openConflicts = conflicts.filter((c) => c.status === "OPEN");
  const activeCommitments = commitments.filter((c) => c.status === "OPEN");

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "google_meet":
        return "Google Meet";
      case "zoom":
        return "Zoom";
      case "teams":
        return "MS Teams";
      case "whatsapp_call":
        return "WhatsApp";
      default:
        return "Call Audio";
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Controller Banner if Demo is Running */}
      {isDemoRunning && (
        <Card highlightBorder className="bg-[var(--primary)]/10 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-ping" />
              <span className="font-mono text-xs font-bold text-[var(--primary)] uppercase">
                Replaying Demo Step {demoStep}/3
              </span>
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {demoStep === 1 && "Meeting 1: Launch Date Set"}
              {demoStep === 2 && "Meeting 2: Security Lead-Time Set"}
              {demoStep === 3 && "Meeting 3: Launch Shifted -> CONFLICT!"}
            </span>
          </div>
        </Card>
      )}

      {/* 1. Horizontal Scrollable Meeting Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Monitored Meetings
          </h2>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {meetings.length} Total
          </span>
        </div>

        <div
          ref={meetingsScrollRef}
          onScroll={handleMeetingsScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {meetings.map((m) => {
            const hasConflict = openConflicts.some((c) =>
              c.implicatedMeetingIds?.includes(m.id)
            );
            const dateFormatted = new Date(m.startedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={m.id}
                className="w-full min-w-full flex-shrink-0 snap-center"
                style={{ scrollSnapAlign: "center" }}
              >
                <Link
                  href={`/meetings/${m.id}`}
                  className="block w-full group transition-all"
                >
                  <Card
                    highlightBorder={hasConflict}
                    className={`h-full flex flex-col justify-between hover:border-[var(--primary)]/60 relative ${
                      hasConflict ? "bg-red-500/5" : ""
                    }`}
                  >
                    {/* Conflict Dot Badge */}
                    {hasConflict && (
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                      </div>
                    )}

                    <div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                        {getSourceBadge(m.source)} • {dateFormatted}
                      </span>
                      <h3 className="font-headline font-bold text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {m.title}
                      </h3>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                      <span className="font-mono text-[10px]">Detail →</span>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Meeting Carousel Dot Indicators */}
        {meetings.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {meetings.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMeeting(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeMeetingIndex === idx
                    ? "w-5 bg-[var(--primary)]"
                    : "w-1.5 bg-[var(--border)] hover:bg-[var(--text-muted)]"
                }`}
                aria-label={`Go to meeting ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Idle-State Monitoring Note */}
        <p className="font-mono text-[11px] text-[var(--text-muted)] text-center mt-2.5 flex items-center justify-center gap-1.5 bg-[var(--surface)]/50 py-1.5 rounded-lg border border-[var(--border)]/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          Redline is monitoring in the background...
        </p>
      </div>

      {/* 2. Active Conflict Banner / Callout */}
      {openConflicts.length > 0 ? (
        <Card highlightBorder className="bg-red-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertIcon className="text-[var(--primary)]" size={18} />
              <span className="font-headline font-bold text-sm text-[var(--primary)] uppercase tracking-wide">
                Contradiction Detected
              </span>
            </div>
            <StatusPill status="CONFLICTING" />
          </div>

          <div>
            <h3 className="font-headline font-bold text-base text-[var(--secondary)]">
              {openConflicts[0].title}
            </h3>
            <p className="font-body text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
              {openConflicts[0].description}
            </p>
          </div>

          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
              Rule 1 • Date Shift vs Constraint
            </span>
            <Link
              href={`/conflicts/${openConflicts[0].id}`}
              className="text-xs font-body font-semibold text-[var(--primary)] flex items-center gap-1 hover:underline"
            >
              View Timestamped Evidence <ChevronRightIcon size={14} />
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-5">
          <span className="font-mono text-xs text-emerald-400 block mb-1">
            ✓ MEMORY CONSISTENT
          </span>
          <p className="font-body text-xs text-[var(--text-muted)]">
            No contradictory decisions or broken constraints detected in recorded history.
          </p>
        </Card>
      )}

      {/* 3. Replay Demo Quick Action Card */}
      <Card className="border-[var(--border)] flex items-center justify-between p-4">
        <div className="space-y-0.5">
          <h3 className="font-headline font-bold text-sm text-[var(--text)]">
            Judge Demo Mode
          </h3>
          <p className="font-body text-xs text-[var(--text-muted)]">
            1-Tap sequence reset: Meeting 1 → 2 → 3 conflict replay.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={runDemoSequence}
          disabled={isDemoRunning}
        >
          <PlayIcon size={14} />
          <span>Run Demo</span>
        </Button>
      </Card>

      {/* 4. Quick Memory Snapshots Stack */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Memory Ledger
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/decisions">
            <Card className="hover:border-[var(--text-muted)] transition-all h-full">
              <div className="flex items-center gap-2 mb-2">
                <TimelineIcon size={16} className="text-[var(--primary)]" />
                <span className="font-headline font-bold text-xs">Decisions</span>
              </div>
              <p className="font-headline font-bold text-xl text-[var(--secondary)]">
                {decisions.length}
              </p>
              <span className="font-mono text-[10px] text-[var(--text-muted)] block mt-1">
                Latest: Launch Target
              </span>
            </Card>
          </Link>

          <Link href="/commitments">
            <Card className="hover:border-[var(--text-muted)] transition-all h-full">
              <div className="flex items-center gap-2 mb-2">
                <UserCheckIcon size={16} className="text-[var(--primary)]" />
                <span className="font-headline font-bold text-xs">Commitments</span>
              </div>
              <p className="font-headline font-bold text-xl text-[var(--secondary)]">
                {activeCommitments.length} <span className="text-xs text-[var(--text-muted)] font-normal">Open</span>
              </p>
              <span className="font-mono text-[10px] text-[var(--text-muted)] block mt-1">
                Alex Chen • Security
              </span>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
