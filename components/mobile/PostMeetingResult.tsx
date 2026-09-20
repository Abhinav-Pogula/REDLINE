"use client";

import React from "react";
import { Screen } from "../../lib/types";

interface PostMeetingResultProps {
  onNavigate: (screen: Screen) => void;
  decisions?: any[];
  constraints?: any[];
  commitments?: any[];
  selectedConflict?: any;
  lastExtracted?: any;
  onShowAlert?: (title: string, message: string) => void;
}

export const PostMeetingResult: React.FC<PostMeetingResultProps> = ({
  onNavigate,
  onShowAlert,
  lastExtracted,
}) => {
  const playAudioEvidence = () => {
    if (onShowAlert) {
      onShowAlert("Audio Moment Playback", "Playing 00:24 audio buffer: Marcus (SecOps Lead) - 'We cannot compress the two-week audit. If launch moves before the 19th, security compliance fails automatically.'");
    }
  };

  const extractedDecisions = lastExtracted?.decisions;
  const extractedConstraints = lastExtracted?.constraints;
  const extractedCommitments = lastExtracted?.commitments;

  return (
    <section id="view-result" className="screen-transition screen-active p-4 space-y-4 pb-28">
      {/* Top Processing Result Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
            <span className="font-bold text-neutral-700">MEETING PROCESSED</span>
            <span>•</span>
            <span>14:02 UTC</span>
          </div>
          <span className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-bold">SESSION #894-F</span>
        </div>
        <h2 className="font-display font-bold text-xl text-neutral-950">SecOps &amp; Core Gateway Sync</h2>
        <p className="text-xs font-mono text-neutral-500 flex items-center gap-2">
          <span>⏱ 42m 18s Duration</span>
          <span>•</span>
          <span className="truncate">SHA-256: 8a7c...39f</span>
        </p>
      </div>

      {/* Transparency Indicator Status Line */}
      {lastExtracted ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-2xs font-mono text-xs">
          {lastExtracted.source === "local" && (
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Extracted on-device</span>
              <span className="text-[10px] text-neutral-400 font-normal ml-auto">(Local Ollama LLM)</span>
            </div>
          )}
          {lastExtracted.escalated && lastExtracted.source === "cloud" && (
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>
                Escalated to cloud model &mdash; {lastExtracted.escalationReason || "Local model fallback"}
              </span>
            </div>
          )}
          {lastExtracted.escalated && lastExtracted.source === "cloud_unavailable" && (
            <div className="flex items-center gap-2 text-neutral-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span>Cloud escalation unavailable &mdash; extraction incomplete</span>
            </div>
          )}
        </div>
      ) : (
        /* Voiceprint Forensics Active Bar */
        <div className="bg-white border border-neutral-200 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-1 h-3 bg-brand-red rounded-full"></span>
              <span className="w-1 h-4 bg-brand-red rounded-full"></span>
              <span className="w-1 h-2 bg-brand-red rounded-full"></span>
              <span className="w-1 h-3 bg-brand-red rounded-full"></span>
            </div>
            <span className="font-mono text-xs font-bold text-neutral-800">VOICEPRINT FORENSICS ACTIVE</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">3 SIGNALS PARSED</span>
        </div>
      )}

      {/* Stacked Result Cards */}
      <div className="space-y-3">
        {/* 1. DECISIONS */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-500 uppercase font-semibold">DECISIONS</span>
            <span className="bg-neutral-900 text-white px-2 py-0.5 rounded-full font-bold text-[9px] tracking-wider">
              {extractedDecisions ? "EXTRACTED" : "CONFIRMED"}
            </span>
          </div>
          {extractedDecisions ? (
            extractedDecisions.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic">No decisions extracted.</p>
            ) : (
              extractedDecisions.map((d: any, idx: number) => (
                <div key={idx} className="space-y-0.5 border-b border-neutral-100 last:border-0 pb-1.5 last:pb-0">
                  <p className="font-sans font-semibold text-sm text-neutral-900 leading-snug">
                    {d.topic}: <span className="text-brand-red font-bold">{d.value}</span>
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500">Status: {d.status}</p>
                </div>
              ))
            )
          ) : (
            <>
              <p className="font-sans font-semibold text-sm text-neutral-900 leading-snug">
                Mandatory 14-day pen-testing freeze window enforced prior to any public production ingress.
              </p>
              <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                <svg className="w-3 h-3 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                SecOps Governance Rule #104.B
              </p>
            </>
          )}
        </div>

        {/* 2. CONSTRAINTS */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-500 uppercase font-semibold">CONSTRAINTS</span>
            <span className="bg-neutral-100 text-neutral-700 border border-neutral-300 px-2 py-0.5 rounded-full font-bold text-[9px]">
              {extractedConstraints ? "RULES" : "STRICT BLOCKER"}
            </span>
          </div>
          {extractedConstraints ? (
            extractedConstraints.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic">No constraints extracted.</p>
            ) : (
              extractedConstraints.map((c: any, idx: number) => (
                <div key={idx} className="space-y-0.5 border-b border-neutral-100 last:border-0 pb-1.5 last:pb-0">
                  <p className="font-sans font-semibold text-sm text-neutral-900 leading-snug">
                    {c.topic}: {c.rule}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500">Status: {c.status}</p>
                </div>
              ))
            )
          ) : (
            <>
              <p className="font-sans font-semibold text-sm text-neutral-900 leading-snug">
                Dependency: Zero external port opening until SecOps cryptographic audit signoff.
              </p>
              <p className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                <span>🔒</span>
                <span>Firewall Ingress / Egress Lockdown active</span>
              </p>
            </>
          )}
        </div>

        {/* 3. COMMITMENTS */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-500 uppercase font-semibold">COMMITMENTS</span>
            <span className="text-brand-red font-bold text-[10px]">
              {extractedCommitments ? "TASKS" : "📅 OCT 08"}
            </span>
          </div>
          {extractedCommitments ? (
            extractedCommitments.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 italic">No commitments extracted.</p>
            ) : (
              extractedCommitments.map((cm: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 border-b border-neutral-100 last:border-0 pb-1.5 last:pb-0">
                  <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {cm.owner ? cm.owner.slice(0, 2).toUpperCase() : "MT"}
                  </span>
                  <div>
                    <p className="font-sans text-xs font-semibold text-neutral-900">{cm.task}</p>
                    <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      Owner: {cm.owner || "Unassigned"} &bull; Due: {cm.due || "TBD"}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                MT
              </span>
              <div>
                <p className="font-sans text-xs font-semibold text-neutral-900">
                  Marcus T. to deliver perimeter vulnerability report by Oct 08.
                </p>
                <p className="text-[10px] font-mono text-neutral-500 mt-0.5">Assigned: SecOps Lead • Priority High</p>
              </div>
            </div>
          )}
        </div>

        {/* 4. CONFLICTS DETECTED (Alert style) */}
        <div
          onClick={() => onNavigate("conflict")}
          className="bg-[#fdeaea] border-2 border-brand-red rounded-2xl p-4 shadow-xs cursor-pointer hover:border-brand-redDark transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-brand-red font-mono text-xs font-bold">
              <span>⚠️</span>
              <span>CONFLICTS DETECTED</span>
            </div>
            <span className="px-2 py-0.5 bg-brand-red text-white rounded-full font-mono text-[9px] font-bold">
              CRITICAL
            </span>
          </div>
          <h3 className="font-display font-bold text-sm text-neutral-900">
            Launch date shift to Oct 12 breaks 14-day compliance rule
          </h3>
          <p className="text-xs text-neutral-700 leading-snug">
            Roadmap target pushes deployment 7 days ahead of required cryptographic freeze cycle. Automated alert triggered across telemetry streams.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-brand-red/20 text-xs font-mono">
            <span className="text-neutral-500 text-[10px]">Origin: Core Gateway Sync Buffer</span>
            <span className="text-brand-red font-bold flex items-center gap-1">RESOLVE &rarr;</span>
          </div>
        </div>

        {/* 5. RAW TRANSCRIPT EVIDENCE */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span className="uppercase font-semibold">RAW TRANSCRIPT EVIDENCE</span>
            <button
              onClick={playAudioEvidence}
              className="text-brand-red font-bold flex items-center gap-1 hover:underline"
            >
              <span>▶</span> AUDIO CLIP (00:24)
            </button>
          </div>
          <blockquote className="bg-white border-l-4 border-neutral-800 p-3 rounded-r-xl font-mono text-xs text-neutral-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>[18:42 UTC - Audio Buffer #04]</span>
              <span>Confidence: 99.4%</span>
            </div>
            <p className="italic">
              &quot;We cannot compress the two-week audit. If launch moves before the 19th, security compliance fails automatically.&quot;
            </p>
            <p className="text-[10px] text-brand-red font-semibold pt-1">● Marcus (SecOps Lead)</p>
          </blockquote>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1">
            <span>Evidence signed via Ledger Key ED25519</span>
            <span>Block #412,981</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={() => onNavigate("dashboard")}
          className="w-full py-3.5 bg-neutral-900 hover:bg-black active:scale-98 text-white rounded-2xl font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>Done — Back to Dashboard</span>
        </button>
      </div>
    </section>
  );
};
