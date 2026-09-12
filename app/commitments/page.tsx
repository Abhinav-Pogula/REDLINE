"use client";

import React from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { BackArrowIcon, UserCheckIcon, FileTextIcon } from "@/components/ui/Icons";

export default function CommitmentsPage() {
  const { commitments, getMeetingById } = useMemory();

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
            Memory Task Registry
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Commitments Ledger ({commitments.length})
          </h1>
        </div>
      </div>

      {/* Flat List */}
      <div className="space-y-3">
        {commitments.map((com) => {
          const meeting = getMeetingById(com.meetingId);

          return (
            <Card key={com.id} className="space-y-2 hover:border-[var(--text-muted)] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheckIcon size={16} className="text-[var(--primary)]" />
                  <span className="font-headline font-bold text-sm text-[var(--secondary)]">
                    {com.owner}
                  </span>
                </div>
                <StatusPill status={com.status} />
              </div>

              <p className="font-body text-xs text-[var(--text)] font-semibold">
                {com.task}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
                <span>Due Date: {com.dueDate}</span>
                {meeting && (
                  <Link href={`/meetings/${meeting.id}`} className="hover:underline">
                    From: {meeting.title}
                  </Link>
                )}
                <Link href={`/evidence/${com.evidenceId}`} className="text-[var(--primary)] hover:underline flex items-center gap-0.5">
                  <FileTextIcon size={12} /> Evidence #{com.evidenceId}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
