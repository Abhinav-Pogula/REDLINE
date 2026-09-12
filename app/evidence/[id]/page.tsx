"use client";

import React, { use } from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BackArrowIcon, FileTextIcon, ChevronRightIcon } from "@/components/ui/Icons";

export default function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const evidenceId = resolvedParams.id;

  const { getEvidenceById, getMeetingById } = useMemory();

  const ev = getEvidenceById(evidenceId);

  if (!ev) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-headline text-lg text-[var(--text-muted)]">Evidence Record Not Found</p>
        <Link href="/evidence">
          <Button variant="outline" size="sm">
            <BackArrowIcon size={16} /> Return to Evidence Vault
          </Button>
        </Link>
      </div>
    );
  }

  const meeting = getMeetingById(ev.meetingId);

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/evidence"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <BackArrowIcon size={18} />
        </Link>
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider block">
            Immutable Audit Evidence
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Evidence Item #{ev.id}
          </h1>
        </div>
      </div>

      <Card highlightBorder className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <span className="font-mono text-xs text-[var(--primary)] font-bold uppercase flex items-center gap-1.5">
            <FileTextIcon size={14} /> Type: {ev.type}
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)] bg-neutral-900 border border-[var(--border)] px-2.5 py-1 rounded-full">
            {ev.timestamp}
          </span>
        </div>

        <div>
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1.5">
            Exact Quoted Transcript Excerpt
          </span>
          <blockquote className="border-l-4 border-[var(--primary)] pl-4 py-3 font-mono text-sm text-[var(--secondary)] italic bg-black/60 rounded-r leading-relaxed">
            &ldquo;{ev.content}&rdquo;
          </blockquote>
        </div>

        {meeting && (
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block">
              Originating Session
            </span>
            <Link href={`/meetings/${meeting.id}`} className="block group">
              <div className="bg-neutral-900 border border-[var(--border)] group-hover:border-[var(--primary)] rounded-xl p-3 flex items-center justify-between transition-colors">
                <div>
                  <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                    {meeting.title}
                  </h3>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {meeting.source} • {new Date(meeting.startedAt).toLocaleDateString()}
                  </span>
                </div>
                <ChevronRightIcon size={16} className="text-[var(--primary)]" />
              </div>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
