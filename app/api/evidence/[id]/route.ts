import { NextRequest, NextResponse } from "next/server";
import { getEvidenceById } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const evidence = getEvidenceById(id);
    if (!evidence) {
        return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }
    return NextResponse.json(evidence);
}