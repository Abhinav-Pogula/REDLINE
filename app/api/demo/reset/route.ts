import { NextRequest, NextResponse } from "next/server";
import { resetToSeed } from "@/lib/db";
import { canonicalHeroScenario, compliantScenario } from "@/lib/demo";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const scenarioId = body.scenarioId === "scenario-compliant" ? "scenario-compliant" : "scenario-conflict";
    const scenario = scenarioId === "scenario-compliant" ? compliantScenario : canonicalHeroScenario;

    resetToSeed({
        decisions: scenario.decisions,
        constraints: scenario.constraints,
        commitments: scenario.commitments,
        evidence: scenario.evidence,
    });

    return NextResponse.json({ ok: true, scenarioId });
}