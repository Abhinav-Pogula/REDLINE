"use client";

import React from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { BackArrowIcon, FileTextIcon, ChevronRightIcon } from "@/components/ui/Icons";

export default function EvidenceListPage() {
  const { evidence, getMeetingById } = useMemory();

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
            Memory Vault Index
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Timestamped Evidence ({evidence.length})
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {evidence.map((ev) => {
          const meeting = getMeetingById(ev.meetingId);

          return (
            <Link key={ev.id} href={`/evidence/${ev.id}`} className="block group">
              <Card className="hover:border-[var(--primary)] transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[var(--primary)] font-bold flex items-center gap-1">
                    <FileTextIcon size={12} /> EVIDENCE #{ev.id} • {ev.type}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {ev.timestamp}
                  </span>
                </div>

                <blockquote className="border-l-2 border-[var(--border)] group-hover:border-[var(--primary)] pl-3 py-1 font-mono text-xs text-[var(--text)] italic bg-black/40 rounded-r transition-colors">
                  &ldquo;{ev.content}&rdquo;
                </blockquote>

                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
                  <span>Meeting: {meeting?.title || ev.meetingId}</span>
                  <span className="text-[var(--primary)] group-hover:underline flex items-center gap-0.5">
                    View <ChevronRightIcon size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
