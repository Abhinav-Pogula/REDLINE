export interface RawExtractionResult {
  decisions: { topic?: string; value?: string; status?: string }[];
  constraints: { topic?: string; rule?: string; status?: string }[];
  commitments: { task?: string; owner?: string; due?: string }[];
  source: "local" | "cloud" | "cloud_unavailable";
  escalated: boolean;
  escalationReason?: string;
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

const SYSTEM_PROMPT = `You are REDLINE's structured memory extraction engine.
Extract only information explicitly supported by the transcript. Do not invent decisions.
A decision is "confirmed" only if the transcript shows clear agreement; otherwise use "proposed" or "uncertain".
Return ONLY valid JSON, no prose, matching exactly this shape:
{
  "decisions": [{"topic": string, "value": string, "status": "proposed"|"confirmed"|"uncertain"}],
  "constraints": [{"topic": string, "rule": string, "status": "active"|"satisfied"|"violated"|"uncertain"}],
  "commitments": [{"task": string, "owner": string, "due": string}]
}
If the transcript contains none of these, return empty arrays for each.`;

function safeParseJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalize(raw: any): Pick<RawExtractionResult, "decisions" | "constraints" | "commitments"> {
  const decisions = Array.isArray(raw?.decisions)
    ? raw.decisions.filter((d: any) => d && (d.topic || d.value)).map((d: any) => ({
        topic: String(d.topic || "").slice(0, 200),
        value: String(d.value || "").slice(0, 200),
        status: ["proposed", "confirmed", "uncertain"].includes(d.status) ? d.status : "uncertain",
      }))
    : [];
  const constraints = Array.isArray(raw?.constraints)
    ? raw.constraints.filter((c: any) => c && (c.topic || c.rule)).map((c: any) => ({
        topic: String(c.topic || "").slice(0, 200),
        rule: String(c.rule || "").slice(0, 300),
        status: ["active", "satisfied", "violated", "uncertain"].includes(c.status) ? c.status : "uncertain",
      }))
    : [];
  const commitments = Array.isArray(raw?.commitments)
    ? raw.commitments.filter((c: any) => c && c.task).map((c: any) => ({
        task: String(c.task || "").slice(0, 200),
        owner: String(c.owner || "Unassigned").slice(0, 100),
        due: String(c.due || "").slice(0, 100),
      }))
    : [];
  return { decisions, constraints, commitments };
}

async function callLocalModel(transcript: string): Promise<RawExtractionResult> {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: `${SYSTEM_PROMPT}\n\nTranscript:\n"""${transcript}"""\n\nJSON:`,
      format: "json",
      stream: false,
    }),
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok) {
    throw new Error(`Ollama responded ${response.status}`);
  }

  const payload = await response.json();
  const parsed = safeParseJson(payload.response ?? "");
  if (!parsed) {
    throw new Error("Local model returned unparseable JSON");
  }

  const normalized = normalize(parsed);
  const totalItems = normalized.decisions.length + normalized.constraints.length + normalized.commitments.length;
  if (totalItems === 0 && transcript.trim().length > 15) {
    throw new Error("Local model returned no structured items for a non-trivial transcript");
  }

  return { ...normalized, source: "local", escalated: false };
}

async function callCloudModel(transcript: string, reason: string): Promise<RawExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(`[REDLINE escalation] ${new Date().toISOString()} — would escalate to cloud (reason: ${reason}), but no GEMINI_API_KEY is configured.`);
    return { decisions: [], constraints: [], commitments: [], source: "cloud_unavailable", escalated: true, escalationReason: reason };
  }

  console.log(`[REDLINE escalation] ${new Date().toISOString()} — escalating to cloud model (reason: ${reason})`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nTranscript:\n"""${transcript}"""\n\nJSON:` }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Cloud model responded ${response.status}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const parsed = safeParseJson(text);
  const normalized = normalize(parsed ?? {});

  return { ...normalized, source: "cloud", escalated: true, escalationReason: reason };
}

export async function extractFromTranscript(transcript: string): Promise<RawExtractionResult> {
  try {
    return await callLocalModel(transcript);
  } catch (err: any) {
    const reason = err?.message || "local_extraction_failed";
    try {
      return await callCloudModel(transcript, reason);
    } catch (cloudErr: any) {
      console.error("[REDLINE] Both local and cloud extraction failed:", cloudErr?.message);
      return {
        decisions: [],
        constraints: [],
        commitments: [],
        source: "cloud_unavailable",
        escalated: true,
        escalationReason: `local failed (${reason}); cloud also failed (${cloudErr?.message})`,
      };
    }
  }
}