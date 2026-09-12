import { Meeting, Evidence, Decision, Constraint, Commitment, Conflict } from "@/types";

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "m-1",
    title: "Product Launch Planning",
    source: "google_meet",
    startedAt: "2024-09-18T10:23:00Z",
    transcript: "We'll launch the product on September 25.",
    summary: "The team established the initial target product launch date for September 25, 2024.",
    isConflicting: false,
  },
  {
    id: "m-2",
    title: "Security Planning",
    source: "zoom",
    startedAt: "2024-09-20T15:15:00Z",
    transcript: "Security review must be completed at least two days before launch.",
    summary: "Security protocols were set. Mandatory rule: Security review sign-off must occur at least 2 days prior to launch.",
    isConflicting: true,
  },
  {
    id: "m-3",
    title: "Launch Adjustment",
    source: "teams",
    startedAt: "2024-09-22T11:42:00Z",
    transcript: "The API integration is taking longer than expected. Okay, everyone agrees. Let's move the launch to September 28.",
    summary: "API integration delays forced a launch reschedule to September 28. Proactively flagged for security review conflict.",
    isConflicting: true,
  },
];

export const INITIAL_EVIDENCE: Evidence[] = [
  {
    id: "ev-1",
    meetingId: "m-1",
    type: "TRANSCRIPT",
    content: "We'll launch the product on September 25.",
    timestamp: "10:24:12 AM (00:01:12)",
  },
  {
    id: "ev-2",
    meetingId: "m-2",
    type: "TRANSCRIPT",
    content: "Security review must be completed at least two days before launch.",
    timestamp: "03:18:45 PM (00:03:45)",
  },
  {
    id: "ev-2b",
    meetingId: "m-2",
    type: "TRANSCRIPT",
    content: "Alex Chen will handle the security review sign-off before the release window.",
    timestamp: "03:22:10 PM (00:07:10)",
  },
  {
    id: "ev-2c",
    meetingId: "m-2",
    type: "TRANSCRIPT",
    content: "Sarah Miller will complete API Gateway routing configuration.",
    timestamp: "03:25:30 PM (00:10:30)",
  },
  {
    id: "ev-3",
    meetingId: "m-3",
    type: "TRANSCRIPT",
    content: "The API integration is taking longer than expected. Okay, everyone agrees. Let's move the launch to September 28.",
    timestamp: "11:45:02 AM (00:03:02)",
  },
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: "dec-1",
    subject: "launch",
    value: "September 25, 2024",
    status: "SUPERSEDED",
    confidence: 0.96,
    evidenceId: "ev-1",
    createdAt: "2024-09-18T10:24:12Z",
    meetingId: "m-1",
  },
  {
    id: "dec-2",
    subject: "launch",
    value: "September 28, 2024",
    status: "CONFIRMED",
    confidence: 0.96,
    reason: "API integration requires additional time",
    evidenceId: "ev-3",
    supersedesId: "dec-1",
    createdAt: "2024-09-22T11:45:02Z",
    meetingId: "m-3",
  },
];

export const INITIAL_CONSTRAINTS: Constraint[] = [
  {
    id: "const-1",
    subject: "security_review",
    relation: "must_complete_before",
    targetSubject: "launch",
    offsetDays: 2,
    status: "ACTIVE",
    confidence: 0.94,
    evidenceId: "ev-2",
    meetingId: "m-2",
  },
];

export const INITIAL_COMMITMENTS: Commitment[] = [
  {
    id: "com-1",
    meetingId: "m-2",
    owner: "Alex Chen",
    task: "Security Review sign-off",
    dueDate: "September 26, 2024",
    status: "OPEN",
    evidenceId: "ev-2b",
  },
  {
    id: "com-2",
    meetingId: "m-2",
    owner: "Sarah Miller",
    task: "API Gateway routing",
    dueDate: "September 24, 2024",
    status: "DONE",
    evidenceId: "ev-2c",
  },
];

export const INITIAL_CONFLICTS: Conflict[] = [
  {
    id: "conf-1",
    type: "date",
    title: "Launch Date Shift Violates Security Buffer",
    description: "New launch date (Sept 28) requires security review completion by Sept 26 (2-day buffer), but Security Review sign-off is incomplete and open.",
    newEvidenceId: "ev-3",
    existingEvidenceIds: ["ev-2", "ev-2b"],
    status: "OPEN",
    reasoning: "Moving product launch to Sept 28 shifts the required security review completion deadline to Sept 26. Active constraint requiring 2 days offset is at risk because Security Review sign-off remains OPEN.",
    confidence: 0.96,
    createdAt: "2024-09-22T11:45:02Z",
    implicatedMeetingIds: ["m-2", "m-3"],
  },
];
