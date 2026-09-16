import { Decision, Constraint, Commitment, Evidence } from "./data";
import { TranscriptionProvider, ExtractionProvider } from "./types";

/**
 * Transparent Demo Adapter for Speech-to-Text
 * Distinguishes simulated demo ingest from future native OS audio stream.
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

/**
 * Transparent Extraction Provider
 * Extracts structured Decisions, Constraints, and Commitments from input text.
 */
export class DemoExtractionProvider implements ExtractionProvider {
  async extractEntities(transcript: string): Promise<{
    decisions: Partial<Decision>[];
    constraints: Partial<Constraint>[];
    commitments: Partial<Commitment>[];
  }> {
    if (transcript.toLowerCase().includes("september 28")) {
      return {
        decisions: [
          {
            id: "d-02",
            topic: "Launch date",
            value: "September 28",
            status: "confirmed",
            evidenceId: "ev-03",
            supersedesDecisionId: "d-01",
          },
        ],
        constraints: [],
        commitments: [],
      };
    }

    return { decisions: [], constraints: [], commitments: [] };
  }
}
