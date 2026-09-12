"use client";

import React, { use } from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { BackArrowIcon, FileTextIcon, TimelineIcon } from "@/components/ui/Icons";

export default function DecisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const decisionId = resolvedParams.id;

  const { decisions, getMeetingById, getEvidenceById } = useMemory();

  const decision = decisions.find((d) => d.id === decisionId);

  if (!decision) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-headline text-lg text-[var(--text-muted)]">Decision Entry Not Found</p>
        <Link href="/decisions">
          <Button variant="outline" size="sm">
            <BackArrowIcon size={16} /> Return to Timeline
          </Button>
        </Link>
      </div>
    );
  }

  const meeting = decision.meetingId ? getMeetingById(decision.meetingId) : undefined;
  const evidence = getEvidenceById(decision.evidenceId);

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/decisions"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <BackArrowIcon size={18} />
        </Link>
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider block">
            Decision Entry #{decision.id}
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            {decision.subject.toUpperCase()} Target
          </h1>
        </div>
      </div>

      <Card highlightBorder className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-[var(--text-muted)]">
            Status
          </span>
          <StatusPill status={decision.status} />
        </div>

        <div>
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
            Recorded Decision Value
          </span>
          <h2 className="font-headline font-bold text-xl text-[var(--secondary)]">
            {decision.value}
          </h2>
        </div>

        {decision.reason && (
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase block mb-1">
              Context & Rationale
            </span>
            <p className="font-body text-xs text-[var(--text)]">{decision.reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] font-mono text-xs text-[var(--text-muted)]">
          <span>Confidence: {(decision.confidence * 100).toFixed(0)}%</span>
          <span>Created: {new Date(decision.createdAt || "").toLocaleDateString()}</span>
        </div>
      </Card>

      {/* Linked Evidence Card */}
      <Card className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 text-[var(--primary)] uppercase font-bold">
            <FileTextIcon size={14} /> Timestamped Evidence
          </span>
          <span>{evidence?.timestamp}</span>
        </div>

        <blockquote className="border-l-2 border-[var(--primary)] pl-3 py-1 font-mono text-xs text-[var(--secondary)] italic bg-black/40 rounded-r">
          &ldquo;{evidence?.content || "No quote content available"}&rdquo;
        </blockquote>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            Source: {meeting?.title} ({meeting?.source})
          </span>
          <Link href={`/evidence/${decision.evidenceId}`} className="font-mono text-[10px] text-[var(--primary)] hover:underline">
            View Full Evidence →
          </Link>
        </div>
      </Card>
    </div>
  );
}
