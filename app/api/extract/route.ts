import { NextRequest, NextResponse } from "next/server";
import {
  addEvidence,
  addDecision,
  addConstraint,
  addCommitment,
  getAllDecisions,
  getAllConstraints,
  getAllCommitments,
  getAllEvidence,
} from "../../../lib/db";
import { extractFromTranscript } from "../../../lib/extraction";
import { evaluateProjectMemory } from "../../../lib/conflict-engine";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.transcript || typeof body.transcript !== "string") {
    return NextResponse.json({ error: "Missing 'transcript' string in request body" }, { status: 400 });
  }

  const meetingId = body.meetingId || `manual-${Date.now()}`;
  const meetingTitle = body.meetingTitle || "Pasted Transcript";
  const source = body.source || "demo";
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const evidenceId = `ev-${Date.now()}`;
  addEvidence({ id: evidenceId, meetingId, meetingTitle, source, timestamp, text: body.transcript });

  const result = await extractFromTranscript(body.transcript);

  const existingDecisions = getAllDecisions();

  result.decisions.forEach((d, i) => {
    const topic = (d.topic || "Untitled decision").trim().toLowerCase();

    // Find any prior active decision that matches topic either way (handles "launch" vs "launch date")
    // and hasn't already been superseded by another decision
    const priorActive = [...existingDecisions].reverse().find((ed) => {
      const existingTopic = ed.topic.trim().toLowerCase();
      const isMatch =
        existingTopic === topic ||
        (topic.includes("launch") && existingTopic.includes("launch"));
      const isAlreadySuperseded = existingDecisions.some(
        (o) => o.supersedesDecisionId === ed.id
      );
      return isMatch && !isAlreadySuperseded;
    });

    const newDecision = {
      id: `d-${Date.now()}-${i}`,
      topic: d.topic || "Untitled decision",
      value: d.value || "",
      status: (d.status as any) || "uncertain",
      evidenceId,
      supersedesDecisionId: priorActive?.id,
    };

    addDecision(newDecision);
    existingDecisions.push(newDecision);
  });

  result.constraints.forEach((c, i) => {
    addConstraint({
      id: `c-${Date.now()}-${i}`,
      topic: c.topic || "Untitled constraint",
      rule: c.rule || "",
      status: (c.status as any) || "uncertain",
      evidenceId,
    });
  });

  result.commitments.forEach((c, i) => {
    addCommitment({
      id: `cm-${Date.now()}-${i}`,
      task: c.task || "Untitled task",
      owner: c.owner || "Unassigned",
      due: c.due || "",
      evidenceId,
    });
  });

  const decisions = getAllDecisions();
  const constraints = getAllConstraints();
  const commitments = getAllCommitments();
  const evidence = getAllEvidence();
  const engineResult = evaluateProjectMemory(decisions, constraints, commitments, evidence);

  return NextResponse.json({
    extracted: result,
    evidenceId,
    conflicts: engineResult.conflicts,
    timeline: engineResult.timeline,
  });
}