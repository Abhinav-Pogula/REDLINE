// ============================================================================
// REDLINE — Extraction pipeline
// Turns raw text (a pasted transcript, or in future a live transcription
// result) into structured Decisions / Constraints / Commitments. Fully
// deterministic and offline — no network calls, no LLM dependency — matching
// the PRD's "on-device by default" guarantee and the demo's "must always
// work" requirement (Section 10).
//
// The ExtractionProvider interface (lib/types.ts) is what keeps this
// pluggable: a future on-device or cloud-escalation model could implement
// the same interface without any caller needing to change.
// ============================================================================

import { Decision, Constraint, Commitment, ExtractionContext, ExtractionProvider, ExtractionResult, ExtractedStatement, TranscriptionProvider } from "./types";
import { parseFlexibleDate, extractLeadTimeDays, toShortLabel, toLongLabel } from "./date-utils";

/**
 * Transparent Demo Adapter for Speech-to-Text.
 * Placeholder for the real Android dual-stream capture pipeline (Section 6
 * of the PRD) — kept so callers can already code against a stable interface.
 */
export class DemoTranscriptionProvider implements TranscriptionProvider {
  async isAvailable(): Promise<boolean> {
    return true;
  }

  async transcribeAudio(_stream: MediaStream | Blob): Promise<{ text: string; confidence: number }> {
    return {
      text: "Let's move the launch to September 28.",
      confidence: 0.994,
    };
  }
}

// ----------------------------------------------------------------------------
// Statement splitting
// ----------------------------------------------------------------------------

const SENTENCE_ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "vs", "etc", "no", "approx",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
]);

const SPEAKER_PREFIX_RE = /^\s*(?:\[[^\]]{1,40}\]\s*)?[A-Z][\w .'-]{0,40}:\s*/;

function stripSpeakerPrefix(line: string): string {
  return line.replace(SPEAKER_PREFIX_RE, "");
}

/** Splits a single line into sentences, merging back false-splits on known abbreviations. */
function splitSentences(line: string): string[] {
  const rough = line.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  const sentences: string[] = [];
  let buffer = "";
  for (const piece of rough) {
    buffer = buffer ? `${buffer} ${piece}` : piece;
    const lastWord = buffer.trim().replace(/[.!?]+$/, "").split(/\s+/).pop()?.toLowerCase() ?? "";
    if (SENTENCE_ABBREVIATIONS.has(lastWord)) continue; // false split, keep accumulating
    sentences.push(buffer.trim());
    buffer = "";
  }
  if (buffer.trim()) sentences.push(buffer.trim());
  return sentences;
}

const SENTENCE_BOUNDARY_RE = /[.!?]+\s+[A-Z"']/g;

/**
 * Splits a raw pasted transcript into individual statements. Treats each
 * newline-separated line as one statement by default (matching how meeting
 * notes/transcripts are usually pasted — one turn per line), and only
 * sub-splits a line into sentences when it looks like a bundled paragraph
 * (long, or containing multiple sentence boundaries).
 */
export function splitIntoStatements(raw: string): string[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const statements: string[] = [];
  for (const line of lines) {
    const text = stripSpeakerPrefix(line) || line;
    const boundaryCount = (text.match(SENTENCE_BOUNDARY_RE) || []).length;
    if (text.length > 200 || boundaryCount >= 2) {
      statements.push(...splitSentences(text));
    } else {
      statements.push(text);
    }
  }
  return statements.filter((s) => s.length > 3);
}

// ----------------------------------------------------------------------------
// Classification
// ----------------------------------------------------------------------------

const CONSTRAINT_PATTERNS: RegExp[] = [
  /\bmust\b/i,
  /\bcannot\b/i,
  /\bcan't\b/i,
  /\bshall not\b/i,
  /\brequired\b/i,
  /\bmandatory\b/i,
  /\bno later than\b/i,
  /\bunder no circumstances\b/i,
  /\bblocker\b/i,
  /\bneeds? to be (?:completed|finished|done|signed off)\b/i,
  /\bwithout\b.{0,30}\bsign[- ]?off\b/i,
  /\bhas to be\b.*\bbefore\b/i,
];

const COMMITMENT_PATTERNS: RegExp[] = [
  /^[A-Z][a-zA-Z'-]+,?\s+(?:can you|could you|will you|to|please)\b/,
  /\bassign(?:ed)?\s+(?:this\s+)?to\s+[A-Z][a-zA-Z'-]+/i,
  /\b[A-Z][a-zA-Z'-]+\s+(?:will|to)\s+(?:take|own|handle|deliver|lead|complete|finish)\b/i,
  /\bresponsible for\b/i,
];

const DECISION_PATTERNS: RegExp[] = [
  /\bwe'll\b/i,
  /\bwe will\b/i,
  /\blet'?s\b/i,
  /\bdecided to\b/i,
  /\bdecision is\b/i,
  /\bwe're going with\b/i,
  /\bmoving\b.*\bto\b/i,
  /\bmove\b.*\bto\b/i,
  /\bchanged?\b.*\bto\b/i,
  /\bagreed to\b/i,
  /\bconfirm(?:ed)?\b/i,
  /\bwe are launching\b/i,
  /\btarget(?:ing)?\b.*\bfor\b/i,
];

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((p) => p.test(text));
}

type Kind = ExtractedStatement["kind"];

function classify(statement: string): { kind: Kind; confidence: number } {
  // Commitments are the most structurally specific (owner + action), check first.
  if (matchesAny(COMMITMENT_PATTERNS, statement)) {
    const hasDueDate = /\b(by|due)\b/i.test(statement);
    return { kind: "commitment", confidence: hasDueDate ? 0.9 : 0.75 };
  }
  if (matchesAny(CONSTRAINT_PATTERNS, statement)) {
    return { kind: "constraint", confidence: 0.9 };
  }
  if (matchesAny(DECISION_PATTERNS, statement)) {
    return { kind: "decision", confidence: 0.85 };
  }
  return { kind: "unclassified", confidence: 0 };
}

// ----------------------------------------------------------------------------
// Topic extraction
// ----------------------------------------------------------------------------

const TOPIC_VOCAB: { match: RegExp; topic: string }[] = [
  { match: /\blaunch date\b/i, topic: "Launch date" },
  { match: /\blaunch\b/i, topic: "Launch date" },
  { match: /\bgo[- ]live\b/i, topic: "Launch date" },
  { match: /\bgeneral availability\b|\bga\b/i, topic: "Launch date" },
  { match: /\bsecurity (?:review|audit)\b/i, topic: "Security review" },
  { match: /\bpen[- ]?test(?:ing)?\b|\bpenetration test\b/i, topic: "Security review" },
  { match: /\bsecurity\b/i, topic: "Security review" },
  { match: /\bsign[- ]?off\b/i, topic: "Sign-off" },
  { match: /\bbudget\b/i, topic: "Budget" },
  { match: /\bscope\b/i, topic: "Scope" },
  { match: /\bdeployment\b|\bdeploy\b/i, topic: "Deployment" },
  { match: /\bmigration\b/i, topic: "Migration" },
  { match: /\bdesign review\b/i, topic: "Design review" },
  { match: /\bcode freeze\b|\bfreeze window\b/i, topic: "Code freeze" },
  { match: /\bintegration\b/i, topic: "Integration" },
  { match: /\btesting\b|\bqa\b/i, topic: "Testing" },
  { match: /\bcompliance\b/i, topic: "Compliance" },
  { match: /\bonboarding\b/i, topic: "Onboarding" },
  { match: /\brollout\b/i, topic: "Rollout" },
  { match: /\bhiring\b/i, topic: "Hiring" },
  { match: /\bmarketing\b/i, topic: "Marketing" },
];

const STOPWORDS = new Set([
  "the", "a", "an", "we", "will", "let's", "lets", "to", "on", "for", "of", "and", "is", "are",
  "our", "this", "that", "be", "by", "must", "cannot", "can't", "should", "would",
]);

function extractTopic(statement: string): string {
  for (const entry of TOPIC_VOCAB) {
    if (entry.match.test(statement)) return entry.topic;
  }
  // Fallback: first few significant (non-stopword) words, title-cased.
  const words = statement
    .replace(/[^a-zA-Z0-9'\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()));
  const picked = words.slice(0, 3).join(" ") || "General";
  return picked.charAt(0).toUpperCase() + picked.slice(1);
}

// ----------------------------------------------------------------------------
// Field extraction per statement kind
// ----------------------------------------------------------------------------

function extractDecisionValue(statement: string, referenceDate: Date): { value: string; parsedDate?: string } {
  const date = parseFlexibleDate(statement, referenceDate);
  if (date) {
    return { value: toLongLabel(date), parsedDate: date.toISOString().slice(0, 10) };
  }
  const toClause = statement.match(/\bto\s+([^,.!?]+)/i);
  if (toClause) return { value: toClause[1].trim() };
  return { value: statement.replace(/^[A-Za-z' ]*(?:we'll|we will|let'?s|decided to|agreed to|confirmed?)\s*/i, "").trim() || statement };
}

function extractCommitment(statement: string, referenceDate: Date): { owner: string; task: string; due: string; parsedDate?: string } {
  let owner = "Unassigned";

  const leadingName = statement.match(/^([A-Z][a-zA-Z'-]+)[, ]/);
  const assignedTo = statement.match(/\bassign(?:ed)?\s+(?:this\s+)?to\s+([A-Z][a-zA-Z'-]+)/i);
  const willTake = statement.match(/\b([A-Z][a-zA-Z'-]+)\s+(?:will|to)\s+(?:take|own|handle|deliver|lead|complete|finish)\b/i);

  if (assignedTo) owner = assignedTo[1];
  else if (willTake) owner = willTake[1];
  else if (leadingName) owner = leadingName[1];

  // Due date: an explicit "by/due <clause>", or the common quick-verbal-exchange
  // follow-up "...? Let's say <clause>" (e.g. "can you take X? Let's say Friday.").
  const impliedDueMatch = statement.match(/\?\s*(?:let'?s|lets)\s+say\s+([^,.!?]+)/i);
  const dueMatch = statement.match(/\b(?:by|due)\s+([^,.!?]+)/i);
  const dueText = dueMatch?.[1]?.trim() ?? impliedDueMatch?.[1]?.trim();
  const date = (dueText && parseFlexibleDate(dueText, referenceDate)) || parseFlexibleDate(statement, referenceDate);
  const due = dueText ?? (date ? toShortLabel(date) : "Unspecified");

  // Task = the actionable phrase, stripped of owner/filler, any implied-due
  // follow-up clause, and any explicit due-date clause.
  let task = statement
    .replace(/^[A-Z][a-zA-Z'-]+,?\s*/, "")
    .replace(/^(?:will|to)\s+/i, "")
    .replace(/[?.!]+\s*(?:let'?s|lets)\s+say\s+[^,.!?]+[.!?]*\s*$/i, "")
    .replace(/\b(can you|could you|will you|please)\b/gi, "")
    .replace(/\btake\s+(?:the|this|on)?\s*/gi, "")
    .replace(/\bassign(?:ed)?\s+(?:this\s+)?to\s+[A-Z][a-zA-Z'-]+/i, "")
    .replace(/\b(?:by|due)\s+[^,.!?]+/i, "")
    .replace(/[?.!]+\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!task) task = statement;
  task = task.charAt(0).toUpperCase() + task.slice(1);

  return { owner, task, due, parsedDate: date ? date.toISOString().slice(0, 10) : undefined };
}

// ----------------------------------------------------------------------------
// Public extraction provider
// ----------------------------------------------------------------------------

export class RuleBasedExtractionProvider implements ExtractionProvider {
  async extractEntities(transcript: string, context: ExtractionContext = {}): Promise<ExtractionResult> {
    const referenceDate = context.referenceDate ? new Date(context.referenceDate) : new Date();
    const statements = splitIntoStatements(transcript);

    const decisions: (Partial<Decision> & { sourceText: string })[] = [];
    const constraints: (Partial<Constraint> & { sourceText: string })[] = [];
    const commitments: (Partial<Commitment> & { sourceText: string })[] = [];
    const classified: ExtractedStatement[] = [];

    for (const statement of statements) {
      const { kind, confidence } = classify(statement);
      classified.push({ sourceText: statement, kind, confidence });

      if (kind === "constraint") {
        const leadTimeDays = extractLeadTimeDays(statement) ?? undefined;
        constraints.push({
          topic: extractTopic(statement),
          rule: statement.charAt(0).toUpperCase() + statement.slice(1),
          status: "active",
          leadTimeDays,
          confidence,
          sourceText: statement,
        });
      } else if (kind === "decision") {
        const { value, parsedDate } = extractDecisionValue(statement, referenceDate);
        decisions.push({
          topic: extractTopic(statement),
          value,
          status: "confirmed",
          parsedDate,
          confidence,
          sourceText: statement,
        });
      } else if (kind === "commitment") {
        const { owner, task, due, parsedDate } = extractCommitment(statement, referenceDate);
        commitments.push({
          task,
          owner,
          due,
          parsedDate,
          status: "pending",
          confidence,
          sourceText: statement,
        });
      }
    }

    return { decisions, constraints, commitments, statements: classified };
  }
}

export const defaultExtractionProvider = new RuleBasedExtractionProvider();
