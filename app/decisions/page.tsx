"use client";

import React from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { BackArrowIcon, TimelineIcon, ChevronRightIcon, FileTextIcon } from "@/components/ui/Icons";

export default function DecisionsTimelinePage() {
  const { decisions, getMeetingById } = useMemory();

  // Sort newest first for display (or top to bottom)
  const sortedDecisions = [...decisions].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <BackArrowIcon size={18} />
        </Link>
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider block">
            Memory Evolution Ledger
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Decision Timeline
          </h1>
        </div>
      </div>

      {/* Vertical Dot-and-Line Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[var(--border)]">
        {sortedDecisions.map((dec, idx) => {
          const meeting = dec.meetingId ? getMeetingById(dec.meetingId) : undefined;
          const isLatest = idx === 0;

          return (
            <div key={dec.id} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isLatest
                    ? "bg-[var(--primary)] border-[var(--primary-ink)] shadow-md shadow-[var(--primary)]/40 scale-110"
                    : "bg-[var(--surface)] border-[var(--border)]"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLatest ? "bg-[var(--primary-ink)]" : "bg-[var(--text-muted)]"
                  }`}
                />
              </div>

              {/* Decision Card */}
              <Card
                highlightBorder={isLatest}
                className={`transition-all hover:border-[var(--primary)]/60 ${
                  isLatest ? "bg-red-500/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
                    Subject: {dec.subject} {isLatest && "• CURRENT"}
                  </span>
                  <StatusPill status={dec.status} />
                </div>

                <Link href={`/decisions/${dec.id}`} className="block group-hover:underline">
                  <h2 className="font-headline font-bold text-base text-[var(--secondary)]">
                    {dec.value}
                  </h2>
                </Link>

                {dec.reason && (
                  <p className="font-body text-xs text-[var(--text-muted)] mt-1">
                    Reasoning: {dec.reason}
                  </p>
                )}

                {dec.supersedesId && (
                  <span className="inline-block mt-2 font-mono text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)] px-2 py-0.5 rounded">
                    ↩ Supersedes Decision #{dec.supersedesId}
                  </span>
                )}

                {/* Evidence & Meeting Footer */}
                <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
                  <span>
                    Source: {meeting ? meeting.title : "Meeting"}
                  </span>
                  <Link
                    href={`/evidence/${dec.evidenceId}`}
                    className="text-[var(--primary)] hover:underline flex items-center gap-0.5"
                  >
                    <FileTextIcon size={12} /> Evidence #{dec.evidenceId}
                  </Link>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
