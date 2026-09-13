"use client";

import React from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { BackArrowIcon, AlertIcon, ChevronRightIcon } from "@/components/ui/Icons";

export default function ConflictsListPage() {
  const { conflicts } = useMemory();

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
            Memory Contradiction Log
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Detected Conflicts ({conflicts.length})
          </h1>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="space-y-3">
        {conflicts.length === 0 ? (
          <Card className="text-center py-8 space-y-2">
            <span className="font-mono text-sm text-emerald-400 font-bold block">
              NO ACTIVE CONFLICTS
            </span>
            <p className="font-body text-xs text-[var(--text-muted)]">
              All extracted decisions align cleanly with registered constraints.
            </p>
          </Card>
        ) : (
          conflicts.map((conf) => (
            <Link key={conf.id} href={`/conflicts/${conf.id}`} className="block group">
              <Card
                highlightBorder={conf.status === "OPEN"}
                className={`transition-all hover:border-[var(--primary)] ${
                  conf.status === "OPEN" ? "bg-red-500/5" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertIcon className="text-[var(--primary)]" size={16} />
                    <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                      {conf.type} conflict
                    </span>
                  </div>
                  <StatusPill status={conf.status} />
                </div>

                <h2 className="font-headline font-bold text-sm text-[var(--secondary)] group-hover:text-[var(--primary)] transition-colors">
                  {conf.title}
                </h2>
                <p className="font-body text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                  {conf.description}
                </p>

                <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    Confidence: {conf.confidence ? (conf.confidence * 100).toFixed(0) : 96}%
                  </span>
                  <span className="font-mono text-[10px] text-[var(--primary)] flex items-center gap-1">
                    Why & Proof →
                  </span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
