"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  BackArrowIcon,
  AlertIcon,
  FileTextIcon,
  CheckIcon,
  CloseIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

export default function ConflictDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const conflictId = resolvedParams.id;

  const { getConflictById, getEvidenceById, getMeetingById, dismissConflict } = useMemory();

  const conflict = getConflictById(conflictId);

  if (!conflict) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-headline text-lg text-[var(--text-muted)]">Conflict Record Not Found</p>
        <Link href="/conflicts">
          <Button variant="outline" size="sm">
            <BackArrowIcon size={16} /> Back to Conflicts
          </Button>
        </Link>
      </div>
    );
  }

  const newEvidence = getEvidenceById(conflict.newEvidenceId);
  const existingEvidences = conflict.existingEvidenceIds.map((id) => getEvidenceById(id)).filter(Boolean);

  const newMeeting = newEvidence ? getMeetingById(newEvidence.meetingId) : undefined;
  const existingMeeting = existingEvidences[0] ? getMeetingById(existingEvidences[0].meetingId) : undefined;

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/conflicts"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <BackArrowIcon size={18} />
        </Link>
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider block">
            Conflict / Why Proof View
          </span>
          <h1 className="font-headline font-bold text-base text-[var(--secondary)] leading-tight">
            {conflict.title}
          </h1>
        </div>
      </div>

      {/* Overview & Status Banner */}
      <Card highlightBorder={conflict.status === "OPEN"} className={`${conflict.status === "OPEN" ? "bg-red-500/5" : ""} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <AlertIcon size={18} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              {conflict.type} Contradiction
            </span>
          </div>
          <StatusPill status={conflict.status} />
        </div>

        <div>
          <h2 className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
            What Changed
          </h2>
          <p className="font-body text-sm text-[var(--text)] font-semibold">
            {conflict.description}
          </p>
        </div>

        {/* Confidence Score Tag */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-xs font-mono">
          <span className="text-[var(--text-muted)]">Proof Confidence:</span>
          <span className="text-[var(--primary)] font-bold">
            {conflict.confidence ? (conflict.confidence * 100).toFixed(0) : 96}% Matched
          </span>
        </div>
      </Card>

      {/* Evidence Cards Stack (New Decision vs Existing Constraint) */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Timestamped Evidence Proof
        </h2>

        {/* Card 1: New Decision Evidence */}
        <Card className="space-y-2 border-[var(--primary)]/30">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[var(--primary)] font-bold flex items-center gap-1">
              <FileTextIcon size={12} /> NEW DECISION (TRIGGER)
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {newEvidence?.timestamp || "Latest"}
            </span>
          </div>

          <blockquote className="border-l-2 border-[var(--primary)] pl-3 py-1 font-mono text-xs text-[var(--secondary)] italic bg-[var(--border)]/30 rounded-r">
            &ldquo;{newEvidence?.content || "Decision updated"}&rdquo;
          </blockquote>

          <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[var(--text-muted)]">
            <span>Source: {newMeeting?.title || "Meeting 3"} ({newMeeting?.source || "Teams"})</span>
            {newEvidence && (
              <Link href={`/evidence/${newEvidence.id}`} className="text-[var(--primary)] hover:underline">
                Evidence #{newEvidence.id}
              </Link>
            )}
          </div>
        </Card>

        {/* Card 2: Existing Constraint / Prior Commitment Evidence */}
        {existingEvidences.map((ev, idx) => (
          <Card key={ev?.id || idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] font-bold flex items-center gap-1">
                <FileTextIcon size={12} /> REMEMBERED CONSTRAINT #{idx + 1}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {ev?.timestamp}
              </span>
            </div>

            <blockquote className="border-l-2 border-[var(--text-muted)] pl-3 py-1 font-mono text-xs text-[var(--text)] italic bg-[var(--border)]/30 rounded-r">
              &ldquo;{ev?.content}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[var(--text-muted)]">
              <span>
                Source: {existingMeeting?.title || "Meeting 2"} ({existingMeeting?.source || "Zoom"})
              </span>
              <Link href={`/evidence/${ev?.id}`} className="text-[var(--primary)] hover:underline">
                Evidence #{ev?.id}
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Plain Language Reasoning Line */}
      <Card className="border-[var(--border)] space-y-1.5">
        <span className="font-mono text-[10px] text-[var(--primary)] uppercase font-bold block">
          Deterministic Reasoning
        </span>
        <p className="font-body text-xs text-[var(--text)] leading-relaxed">
          {conflict.reasoning ||
            "Launch target shift violates active 2-day lead time constraint while security review remains incomplete."}
        </p>
      </Card>

      {/* Actions */}
      <div className="pt-2 flex gap-3">
        {conflict.status === "OPEN" ? (
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => dismissConflict(conflict.id)}
          >
            <CheckIcon size={16} /> Dismiss Conflict
          </Button>
        ) : (
          <div className="w-full text-center py-2 font-mono text-xs text-[var(--text-muted)] border border-[var(--border)] rounded-full">
            Conflict Dismissed / Resolved
          </div>
        )}
      </div>
    </div>
  );
}
