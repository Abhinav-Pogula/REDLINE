import { NextResponse } from "next/server";
import { getAllDecisions, getAllConstraints, getAllCommitments, getAllEvidence } from "@/lib/db";
import { evaluateProjectMemory } from "@/lib/conflict-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const decisions = getAllDecisions();
  const constraints = getAllConstraints();
  const commitments = getAllCommitments();
  const evidence = getAllEvidence();
  const engineResult = evaluateProjectMemory(decisions, constraints, commitments, evidence);

  return NextResponse.json({
    conflicts: engineResult.conflicts,
    timeline: engineResult.timeline,
    rulesChecked: engineResult.rulesChecked,
  });
}