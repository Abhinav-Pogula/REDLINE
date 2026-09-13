"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  BackArrowIcon,
  PlayIcon,
  AlertIcon,
  CheckIcon,
  ChevronRightIcon,
  RefreshIcon,
  FileTextIcon,
} from "@/components/ui/Icons";

export default function DemoPage() {
  const { runDemoSequence, isDemoRunning, demoStep, conflicts, meetings, decisions, resetToSeed } =
    useMemory();

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
            Failure-Safe Judge Mode
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Interactive Seed Replay
          </h1>
        </div>
      </div>

      {/* Hero Controller Card */}
      <Card highlightBorder className="bg-red-500/5 space-y-4">
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase font-bold block mb-1">
            Deterministic Contradiction Proof
          </span>
          <h2 className="font-headline font-bold text-base text-[var(--secondary)]">
            Replay Meeting Sequence (1 → 2 → 3)
          </h2>
          <p className="font-body text-xs text-[var(--text-muted)] mt-1">
            Runs 100% offline. Simulates live memory capture, constraint registration, and real-time contradiction flagging.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={runDemoSequence}
            disabled={isDemoRunning}
            className="flex-1"
          >
            <PlayIcon size={16} />
            {isDemoRunning ? "Replaying Sequence..." : "Start Replay Demo"}
          </Button>

          <Button variant="outline" size="md" onClick={resetToSeed}>
            <RefreshIcon size={14} /> Reset
          </Button>
        </div>
      </Card>

      {/* Step Visualizer Progress */}
      <div className="space-y-3">
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
          Replay Step Progression
        </h2>

        {/* Step 1 */}
        <Card
          className={`space-y-2 transition-all ${
            demoStep >= 1 ? "border-[var(--primary)]/60 bg-[var(--surface)]" : "opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  demoStep === 1
                    ? "bg-[var(--primary)] text-[var(--primary-ink)] animate-pulse"
                    : demoStep > 1
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-neutral-800 text-[var(--text-muted)]"
                }`}
              >
                1
              </span>
              <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                Meeting 1: Product Launch Planning
              </h3>
            </div>
            {demoStep > 1 && <span className="font-mono text-[10px] text-emerald-400">✓ Parsed</span>}
          </div>
          <p className="font-body text-xs text-[var(--text-muted)] pl-8">
            Transcript: &ldquo;We&apos;ll launch the product on September 25.&rdquo;
          </p>
          <div className="pl-8 pt-1 flex items-center gap-2 font-mono text-[10px]">
            <StatusPill status="CONFIRMED" />
            <span className="text-[var(--text-muted)]">Target: Sept 25, 2024</span>
          </div>
        </Card>

        {/* Step 2 */}
        <Card
          className={`space-y-2 transition-all ${
            demoStep >= 2 ? "border-[var(--primary)]/60 bg-[var(--surface)]" : "opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  demoStep === 2
                    ? "bg-[var(--primary)] text-[var(--primary-ink)] animate-pulse"
                    : demoStep > 2
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-neutral-800 text-[var(--text-muted)]"
                }`}
              >
                2
              </span>
              <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                Meeting 2: Security Planning
              </h3>
            </div>
            {demoStep > 2 && <span className="font-mono text-[10px] text-emerald-400">✓ Parsed</span>}
          </div>
          <p className="font-body text-xs text-[var(--text-muted)] pl-8">
            Transcript: &ldquo;Security review must be completed at least two days before launch.&rdquo;
          </p>
          <div className="pl-8 pt-1 flex items-center gap-2 font-mono text-[10px]">
            <StatusPill status="ACTIVE" />
            <span className="text-[var(--text-muted)]">Constraint: 2-Day Buffer Required</span>
          </div>
        </Card>

        {/* Step 3 */}
        <Card
          highlightBorder={demoStep === 3 || conflicts.length > 0}
          className={`space-y-2 transition-all ${
            demoStep >= 3 || conflicts.length > 0
              ? "border-[var(--primary)] bg-red-500/5"
              : "opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                  demoStep === 3 || conflicts.length > 0
                    ? "bg-[var(--primary)] text-[var(--primary-ink)] animate-ping"
                    : "bg-[var(--border)] text-[var(--text-muted)]"
                }`}
              >
                3
              </span>
              <h3 className="font-headline font-bold text-xs text-[var(--primary)]">
                Meeting 3: Launch Adjustment (CONFLICT TRIGGER)
              </h3>
            </div>
            {(demoStep >= 3 || conflicts.length > 0) && (
              <StatusPill status="CONFLICTING" />
            )}
          </div>
          <p className="font-body text-xs text-[var(--text-muted)] pl-8">
            Transcript: &ldquo;Let&apos;s move the launch to September 28.&rdquo;
          </p>

          {(demoStep >= 3 || conflicts.length > 0) && (
            <div className="ml-8 mt-2 p-3 bg-[var(--surface)] border border-[var(--primary)]/40 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[var(--primary)] font-headline font-bold text-xs">
                <AlertIcon size={16} />
                <span>Rule 1 Triggered: Launch Date vs Security Buffer</span>
              </div>
              <p className="font-body text-xs text-[var(--text)]">
                Moving launch to Sept 28 pushes required Security Review deadline to Sept 26. Alex Chen&apos;s Security Review sign-off commitment is OPEN.
              </p>
              <Link
                href="/conflicts/conf-1"
                className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--primary)] font-bold hover:underline"
              >
                Inspect Timestamped Evidence Proof <ChevronRightIcon size={12} />
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
