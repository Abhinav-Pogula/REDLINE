"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemory } from "@/context/memory-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  BackArrowIcon,
  AlertIcon,
  SendIcon,
  ChevronRightIcon,
  FileTextIcon,
  UserCheckIcon,
  TimelineIcon,
} from "@/components/ui/Icons";
import { ChatMessage } from "@/types";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id;

  const {
    getMeetingById,
    decisions,
    constraints,
    commitments,
    conflicts,
    evidence,
    queryMeetingChat,
  } = useMemory();

  const meeting = getMeetingById(meetingId);

  // Chat panel state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "redline",
      text: `REDLINE memory agent initialized for "${meeting?.title || "this meeting"}". Ask any query regarding decisions, constraints, or commitments made here.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!meeting) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="font-headline text-lg text-[var(--text-muted)]">Meeting Not Found</p>
        <Link href="/">
          <Button variant="outline" size="sm">
            <BackArrowIcon size={16} /> Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // Filter items specific to THIS meeting
  const meetingDecisions = decisions.filter((d) => d.meetingId === meeting.id);
  const meetingConstraints = constraints.filter((c) => c.meetingId === meeting.id);
  const meetingCommitments = commitments.filter((c) => c.meetingId === meeting.id);
  const meetingEvidence = evidence.filter((e) => e.meetingId === meeting.id);

  // Implicated conflict (if any)
  const relatedConflict = conflicts.find(
    (c) => c.status === "OPEN" && c.implicatedMeetingIds?.includes(meeting.id)
  );

  const formatSource = (src: string) => {
    switch (src) {
      case "google_meet":
        return "Google Meet";
      case "zoom":
        return "Zoom";
      case "teams":
        return "MS Teams";
      case "whatsapp_call":
        return "WhatsApp Call";
      default:
        return "Phone Audio";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput;
    setChatInput("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Call memory retrieval stub
    const replyMsg = await queryMeetingChat(meeting.id, userText);
    setIsTyping(false);
    setChatMessages((prev) => [...prev, replyMsg]);
  };

  return (
    <div className="space-y-5">
      {/* Top Bar with Back Arrow */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Back"
        >
          <BackArrowIcon size={18} />
        </Link>
        <div>
          <span className="font-mono text-[10px] text-[var(--primary)] uppercase tracking-wider block">
            Meeting Memory Record
          </span>
          <h1 className="font-headline font-bold text-lg text-[var(--secondary)] leading-tight">
            {meeting.title}
          </h1>
        </div>
      </div>

      {/* Source Badge & Date/Time */}
      <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)]">
            {formatSource(meeting.source)}
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {new Date(meeting.startedAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Section 1: Summary */}
      <Card className="space-y-2">
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
          <FileTextIcon size={14} className="text-[var(--primary)]" />
          Auto-Generated Recap
        </h2>
        <p className="font-body text-sm text-[var(--text)] leading-relaxed">
          {meeting.summary || "Transcript captured and parsed into Redline memory store."}
        </p>
      </Card>

      {/* Section 2: Related Conflict Callout (Slim Primary Bordered) */}
      {relatedConflict && (
        <Card highlightBorder className="bg-red-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[var(--primary)] font-headline font-bold text-xs">
              <AlertIcon size={16} />
              <span>IMPLICATED IN ACTIVE CONFLICT</span>
            </div>
            <StatusPill status="CONFLICTING" />
          </div>

          <p className="font-body text-xs text-[var(--text)] font-semibold">
            {relatedConflict.title}
          </p>

          <Link
            href={`/conflicts/${relatedConflict.id}`}
            className="inline-flex items-center gap-1 text-xs font-mono text-[var(--primary)] font-bold hover:underline pt-1"
          >
            Review Evidence & Why View <ChevronRightIcon size={14} />
          </Link>
        </Card>
      )}

      {/* Section 3: Decisions & Constraints */}
      <Card className="space-y-3">
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
          <TimelineIcon size={14} className="text-[var(--primary)]" />
          Decisions & Constraints
        </h2>

        {meetingDecisions.length === 0 && meetingConstraints.length === 0 ? (
          <p className="font-body text-xs text-[var(--text-muted)] italic">
            No direct decisions or constraint rules established in this meeting.
          </p>
        ) : (
          <div className="space-y-2.5">
            {meetingDecisions.map((d) => (
              <div
                key={d.id}
                className="bg-[var(--border)]/20 border border-[var(--border)] rounded-lg p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                    Decision • {d.subject}
                  </span>
                  <StatusPill status={d.status} />
                </div>
                <p className="font-body text-sm font-bold text-[var(--secondary)]">
                  {d.value}
                </p>
                {d.reason && (
                  <p className="font-body text-xs text-[var(--text-muted)]">
                    Reason: {d.reason}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/50">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    Confidence: {(d.confidence * 100).toFixed(0)}%
                  </span>
                  <Link
                    href={`/evidence/${d.evidenceId}`}
                    className="font-mono text-[10px] text-[var(--primary)] hover:underline"
                  >
                    Evidence #{d.evidenceId}
                  </Link>
                </div>
              </div>
            ))}

            {meetingConstraints.map((c) => (
              <div
                key={c.id}
                className="bg-[var(--border)]/20 border border-[var(--border)] rounded-lg p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                    Constraint Rule
                  </span>
                  <StatusPill status={c.status} />
                </div>
                <p className="font-body text-sm font-bold text-[var(--secondary)]">
                  {c.subject} must complete {c.offsetDays || 2} days before {c.targetSubject}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/50">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    Confidence: {(c.confidence * 100).toFixed(0)}%
                  </span>
                  <Link
                    href={`/evidence/${c.evidenceId}`}
                    className="font-mono text-[10px] text-[var(--primary)] hover:underline"
                  >
                    Evidence #{c.evidenceId}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Section 4: Dates & Commitments */}
      <Card className="space-y-3">
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
          <UserCheckIcon size={14} className="text-[var(--primary)]" />
          Dates & Commitments (This Meeting Only)
        </h2>

        {meetingCommitments.length === 0 ? (
          <p className="font-body text-xs text-[var(--text-muted)] italic">
            No action commitments assigned during this session.
          </p>
        ) : (
          <div className="space-y-2">
            {meetingCommitments.map((com) => (
              <div
                key={com.id}
                className="flex items-center justify-between bg-[var(--border)]/20 border border-[var(--border)] rounded-lg p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-xs text-[var(--text)]">
                      {com.owner}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      Due {com.dueDate}
                    </span>
                  </div>
                  <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
                    {com.task}
                  </p>
                </div>
                <StatusPill status={com.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Section 5: Scoped Meeting Chat Panel */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <h2 className="font-headline font-bold text-sm text-[var(--secondary)]">
            Ask About This Meeting
          </h2>
          <span className="font-mono text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded">
            Scoped Memory Retrieval
          </span>
        </div>

        {/* Message Thread */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs font-body ${
                  msg.sender === "user"
                    ? "bg-[var(--primary)] text-[var(--primary-ink)] font-semibold"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
                }`}
              >
                {msg.text}
              </div>
              <span className="font-mono text-[9px] text-[var(--text-muted)] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--text-muted)] animate-pulse">
                Querying transcript memory index...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[var(--border)]">
          <input
            type="text"
            placeholder="Ask about this meeting..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2 text-xs font-body text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
          <Button type="submit" variant="primary" size="sm" disabled={!chatInput.trim() || isTyping}>
            <SendIcon size={14} />
          </Button>
        </form>
        <span className="font-mono text-[9px] text-[var(--text-muted)] block text-center">
          {`// TODO: replace with real LLM RAG retrieval`}
        </span>
      </Card>
    </div>
  );
}
