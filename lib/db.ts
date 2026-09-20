import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import {
  Evidence,
  Decision,
  Constraint,
  Commitment,
  evidence as seedEvidence,
  decisions as seedDecisions,
  constraints as seedConstraints,
  commitments as seedCommitments,
} from "./data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "redline.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    meetingId TEXT NOT NULL,
    meetingTitle TEXT NOT NULL,
    source TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    text TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    value TEXT NOT NULL,
    status TEXT NOT NULL,
    evidenceId TEXT NOT NULL,
    supersedesDecisionId TEXT
  );

  CREATE TABLE IF NOT EXISTS constraints (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    rule TEXT NOT NULL,
    status TEXT NOT NULL,
    evidenceId TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS commitments (
    id TEXT PRIMARY KEY,
    task TEXT NOT NULL,
    owner TEXT NOT NULL,
    due TEXT NOT NULL,
    evidenceId TEXT NOT NULL
  );
`);

function seedIfEmpty() {
  const row = db.prepare("SELECT COUNT(*) as count FROM evidence").get() as { count: number };
  if (row.count > 0) return;

  const insertEvidence = db.prepare(
    `INSERT INTO evidence (id, meetingId, meetingTitle, source, timestamp, text) VALUES (@id, @meetingId, @meetingTitle, @source, @timestamp, @text)`
  );
  const insertDecision = db.prepare(
    `INSERT INTO decisions (id, topic, value, status, evidenceId, supersedesDecisionId) VALUES (@id, @topic, @value, @status, @evidenceId, @supersedesDecisionId)`
  );
  const insertConstraint = db.prepare(
    `INSERT INTO constraints (id, topic, rule, status, evidenceId) VALUES (@id, @topic, @rule, @status, @evidenceId)`
  );
  const insertCommitment = db.prepare(
    `INSERT INTO commitments (id, task, owner, due, evidenceId) VALUES (@id, @task, @owner, @due, @evidenceId)`
  );

  const seedAll = db.transaction(() => {
    seedEvidence.forEach((e) => insertEvidence.run(e));
    seedDecisions.forEach((d) =>
      insertDecision.run({ ...d, supersedesDecisionId: d.supersedesDecisionId ?? null })
    );
    seedConstraints.forEach((c) => insertConstraint.run(c));
    seedCommitments.forEach((c) => insertCommitment.run(c));
  });
  seedAll();
}

seedIfEmpty();

export function getAllEvidence(): Evidence[] {
  return db.prepare("SELECT * FROM evidence").all() as Evidence[];
}

export function getAllDecisions(): Decision[] {
  const rows = db.prepare("SELECT * FROM decisions").all() as any[];
  return rows.map((r) => ({ ...r, supersedesDecisionId: r.supersedesDecisionId ?? undefined }));
}

export function getAllConstraints(): Constraint[] {
  return db.prepare("SELECT * FROM constraints").all() as Constraint[];
}

export function getAllCommitments(): Commitment[] {
  return db.prepare("SELECT * FROM commitments").all() as Commitment[];
}

export function getEvidenceById(id: string): Evidence | undefined {
  return db.prepare("SELECT * FROM evidence WHERE id = ?").get(id) as Evidence | undefined;
}

export function resetToSeed(scenario: {
  decisions: Decision[];
  constraints: Constraint[];
  commitments: Commitment[];
  evidence: Evidence[];
}) {
  const clearAndInsert = db.transaction(() => {
    db.exec(
      "DELETE FROM evidence; DELETE FROM decisions; DELETE FROM constraints; DELETE FROM commitments;"
    );
    const insertEvidence = db.prepare(
      `INSERT INTO evidence (id, meetingId, meetingTitle, source, timestamp, text) VALUES (@id, @meetingId, @meetingTitle, @source, @timestamp, @text)`
    );
    const insertDecision = db.prepare(
      `INSERT INTO decisions (id, topic, value, status, evidenceId, supersedesDecisionId) VALUES (@id, @topic, @value, @status, @evidenceId, @supersedesDecisionId)`
    );
    const insertConstraint = db.prepare(
      `INSERT INTO constraints (id, topic, rule, status, evidenceId) VALUES (@id, @topic, @rule, @status, @evidenceId)`
    );
    const insertCommitment = db.prepare(
      `INSERT INTO commitments (id, task, owner, due, evidenceId) VALUES (@id, @task, @owner, @due, @evidenceId)`
    );
    scenario.evidence.forEach((e) => insertEvidence.run(e));
    scenario.decisions.forEach((d) =>
      insertDecision.run({ ...d, supersedesDecisionId: d.supersedesDecisionId ?? null })
    );
    scenario.constraints.forEach((c) => insertConstraint.run(c));
    scenario.commitments.forEach((c) => insertCommitment.run(c));
  });
  clearAndInsert();
}

export function addEvidence(e: Evidence) {
  db.prepare(
    `INSERT INTO evidence (id, meetingId, meetingTitle, source, timestamp, text) VALUES (@id, @meetingId, @meetingTitle, @source, @timestamp, @text)`
  ).run(e);
}

export function addDecision(d: Decision) {
  db.prepare(
    `INSERT INTO decisions (id, topic, value, status, evidenceId, supersedesDecisionId) VALUES (@id, @topic, @value, @status, @evidenceId, @supersedesDecisionId)`
  ).run({ ...d, supersedesDecisionId: d.supersedesDecisionId ?? null });
}

export function addConstraint(c: Constraint) {
  db.prepare(
    `INSERT INTO constraints (id, topic, rule, status, evidenceId) VALUES (@id, @topic, @rule, @status, @evidenceId)`
  ).run(c);
}

export function addCommitment(c: Commitment) {
  db.prepare(
    `INSERT INTO commitments (id, task, owner, due, evidenceId) VALUES (@id, @task, @owner, @due, @evidenceId)`
  ).run(c);
}

export default db;