"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { BackArrowIcon, SettingsIcon, RefreshIcon } from "@/components/ui/Icons";
import { useMemory } from "@/context/memory-context";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { resetToSeed } = useMemory();
  const [backgroundListen, setBackgroundListen] = useState(true);
  const [localOnly, setLocalOnly] = useState(true);
  const [proactiveAlerts, setProactiveAlerts] = useState(true);

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
            System Preferences
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)]">
            Settings & Memory Rules
          </h1>
        </div>
      </div>

      {/* Toggles Group */}
      <div className="space-y-3">
        <Card className="space-y-4">
          <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <SettingsIcon size={14} className="text-[var(--primary)]" />
            Capture & Memory Privacy
          </h2>

          <div className="flex items-center justify-between pt-1">
            <div>
              <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                Background Audio Monitoring
              </h3>
              <p className="font-body text-[11px] text-[var(--text-muted)]">
                Listen silently for meeting audio streams
              </p>
            </div>
            <button
              onClick={() => setBackgroundListen(!backgroundListen)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                backgroundListen ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  backgroundListen ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div>
              <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                100% On-Device Local Storage
              </h3>
              <p className="font-body text-[11px] text-[var(--text-muted)]">
                Keep transcripts & structured memory in offline local store
              </p>
            </div>
            <button
              onClick={() => setLocalOnly(!localOnly)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                localOnly ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  localOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div>
              <h3 className="font-headline font-bold text-xs text-[var(--text)]">
                Proactive Contradiction Alerts
              </h3>
              <p className="font-body text-[11px] text-[var(--text-muted)]">
                Flag date/ownership collisions automatically
              </p>
            </div>
            <button
              onClick={() => setProactiveAlerts(!proactiveAlerts)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                proactiveAlerts ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  proactiveAlerts ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Reset Store Action */}
        <Card className="space-y-3 border-[var(--border)]">
          <div>
            <h3 className="font-headline font-bold text-xs text-[var(--text)]">
              Developer & Judge Reset
            </h3>
            <p className="font-body text-[11px] text-[var(--text-muted)] mt-0.5">
              Reset memory store to initial deterministic hackathon seed dataset.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetToSeed} className="w-full">
            <RefreshIcon size={14} /> Restore Initial Seed State
          </Button>
        </Card>
      </div>
    </div>
  );
}
