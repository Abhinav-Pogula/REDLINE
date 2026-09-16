# REDLINE — Demo PRD (Consolidated, Current State)

*Supersedes VAULT_DEMO_PRD.md and VAULT_Prototype_PRD_v1_1.md where they conflict with decisions made since. Product renamed VAULT → REDLINE; core architecture and demo logic from those two documents still stand except where noted below.*

---

## 1. One-line pitch

REDLINE is a private, on-device AI work memory. It listens to meetings, remembers every decision and constraint, and — its defining feature — actively flags the moment a new decision contradicts something already remembered, with the exact evidence to prove it. Nothing leaves the phone by default.

## 2. What it is NOT

- Not another meeting transcription/summary app. Transcription is the entry point, not the product.
- Not dependent on Google Meet / Zoom / Teams APIs. Capture works at the OS audio layer, platform-agnostic (see Section 6).
- Not a cloud AI product. On-device by default, one narrow opt-in exception (Section 9).

## 3. ⚠ OPEN DECISION — resolve before continuing build

**Platform target is not yet confirmed.** This determines what "next" means for the whole team:

- **Option A — Native Android from the start.** Required if real dual-stream audio capture (`AudioPlaybackCapture` + mic) is part of the live demo itself, not just described. Slower to a first working screen; real capture works standalone.
- **Option B — Web-first (Next.js) for the UI/demo-mode flow, native capture as a later add-on.** Faster to a working, judge-safe seeded demo (Meeting 1→2→3→conflict). Real capture becomes a stretch goal, not the primary flow, since browsers cannot access system audio playback.

**This PRD assumes Option A (native Android) going forward**, since the team has committed to real dual-stream capture as a core feature (Section 6). If the team instead chooses Option B for time reasons, Sections 6, 9, and 12 shift to "Phase 3 / stretch," and Section 11 becomes the actual Day 1 priority. Confirm before allocating build hours.

## 4. Core loop

```
MIC + DEVICE PLAYBACK AUDIO ──► CAPTURE ──► STRUCTURE ──► REMEMBER
                                                              │
                                                    COMPARE against memory
                                                              │
                                                     FLAG contradictions
                                                              │
                                                    PROVE with evidence
                                                              │
                                                  Office Kit → laptop
```

## 5. Data model

| Entity | Fields |
|---|---|
| **Evidence** | id, meetingId, meetingTitle, source, timestamp, text (the quoted transcript fragment) |
| **Decision** | id, topic, value, status (proposed / confirmed / uncertain / conflicting), evidenceId, supersedesDecisionId (optional) |
| **Constraint** | id, topic, rule, status (active / satisfied / violated / uncertain), evidenceId |
| **Commitment** | id, task, owner, due, evidenceId |
| **Conflict** | id, type (date / ownership / dependency), title, explanation, newEvidenceId, existingEvidenceId, status (open / dismissed / resolved) |
| **TimelineEvent** | date, label, detail, kind (constraint / decision / status / conflict) |

This model is already implemented (TypeScript) and working against the seed scenario below — see Section 13.

## 6. Capture layer

**Approach: OS-level dual-stream capture, not per-platform API integration.**

- **Microphone** — standard `RECORD_AUDIO`, captures the user's own voice / anyone near the phone.
- **Device playback audio** — Android's `AudioPlaybackCapture` API (Android 10+, via `MediaProjection`), captures whatever audio the phone is *playing out* — i.e., the other participant's voice in a Meet/Zoom/Teams/WhatsApp call — regardless of which app is running. This is what avoids needing five separate meeting-platform SDKs.
- The two streams are mixed into one audio feed and fed into the same transcription + memory pipeline.

**Known, honest constraints — do not overclaim these in the pitch or demo script:**
- `MediaProjection` requires a visible system permission prompt every time capture starts — show this openly as an expected step, don't try to hide or rush it.
- Some apps set `ALLOW_CAPTURE=false` and can block playback capture. Framing: "capability-based, not guaranteed for every application" — most meeting apps allow it, but don't promise universal coverage.
- **Regular cellular calls are a real gap** — carrier call audio is walled off by Android's telephony stack. Only the user's own mic side is capturable via speakerphone; the other party's voice is not. Treat this as best-effort/import only, never a core promise.
- Background capture requires a **foreground service with a persistent notification** — this is an Android requirement, not a design choice, and it conveniently satisfies the "capture state must always be visible" requirement for free.

## 7. Screens (mobile — status: UI complete via Stitch)

| # | Screen | Status |
|---|---|---|
| 1 | Dashboard | ✅ Built — monitored meetings, ambient monitoring pill, contradiction card, Judge Demo Mode |
| 2 | Capture (idle + recording states) | ✅ Built — source chips, waveform, pipeline step tracker |
| 3 | Post-Meeting Result | ✅ Built — Decisions / Constraints / Commitments / Conflicts / Evidence |
| 4 | Conflict / "Why" | ✅ Built — new vs. existing evidence cards, reasoning block |
| 5 | Timeline | ✅ Built |
| 6 | Calendar | ✅ Speced — month grid, per-day commitment dots, tap-to-expand day list |
| 7 | Sidebar / nav drawer | ✅ Speced — full section list, active-state highlighting, Memory Active pill |
| 8 | Profile | ✅ Speced — privacy status card, cloud-exception toggle, connected sources |

**Design system, locked:** white background, red as dominant accent (not just for warnings), black primary text, grey secondary text. Headers in Space Grotesk Bold / Archivo Black, body in Inter / IBM Plex Sans, meta tags/timestamps in IBM Plex Mono. **Plain-language-first rule applies everywhere:** every card's primary text must be large, bold, and instantly understandable to a first-time viewer; any technical/forensic-flavored terminology is demoted to small secondary caption text, never the main label (see the full copy-edit pass already delivered for exact before/after wording).

## 8. Desktop / laptop companion app

**Purpose:** the receiving end of the Office Kit handoff — not a second version of the phone app, a separate lightweight local app.

- Persistent left sidebar (not a slide-in drawer), same sections as mobile, same visual system.
- **New screen unique to desktop: Device Connection** — connection status (Connected / Waiting for Phone / Sync Failed), device name + last-sync timestamp, list of recently received meetings.
- Wider layouts where space helps — Conflict screen shows new/existing evidence side by side instead of stacked.
- Build as Electron or a simple native app — whichever the team can ship fastest; this is explicitly lower priority than the phone app (see Section 11).

## 9. Privacy / cloud-escalation rule (non-negotiable framing)

On-device by default, always. One narrow, visible, opt-in exception: if the on-device model genuinely can't resolve something with confidence, and only if the user has explicitly opted in, a single anonymized text fragment (never audio, never a photo, never a full document) may be checked against a cloud model. Every escalation is logged and shown to the user. If asked live "does it ever leave the device?" — the honest answer is exactly this sentence, not a blanket "never."

## 10. Demo mode (guaranteed-to-work fallback — build this first, regardless of Section 3's outcome)

**Seed scenario, already coded (Section 13):**
- Meeting 1: "We'll launch the product on September 25." → Decision confirmed.
- Meeting 2: "Security review must be completed two days before launch." → Constraint, status incomplete.
- Meeting 3: "Let's move the launch to September 28." → New decision supersedes Meeting 1's.
- **Conflict Engine (deterministic, not LLM-dependent for the demo):** detects that the current launch decision depends on a constraint still marked incomplete → generates a Conflict object referencing both evidence sources.

**"Judge Demo Mode" / "Run Demo" button:** one tap replays Meeting 1 → 2 → 3 → conflict, end to end, in under a few seconds, with zero dependency on live AI, live audio, or network access. This is the demo's insurance policy — it must work even if nothing else does.

## 11. Build priority — in order

1. **Wire the built UI screens to real navigation and state** (not just static mockups) — Dashboard ↔ Capture ↔ Result ↔ Conflict ↔ Timeline, driven by the seed data and conflict engine already coded.
2. **Confirm Section 3's platform decision** — this gates whether real capture work starts now or later.
3. Get the seeded "Run Demo" flow fully clickable end-to-end — this is the non-negotiable safety net.
4. Deploy/build to something with a real URL or installable file — needed for the application form's Prototype URL field.
5. Record the video walkthrough + finish remaining application form fields.
6. Layer in real capture (Section 6) — only after Step 3 is solid.
7. Build the desktop companion app (Section 8) and the real Office Kit handoff.
8. Rehearse the full demo script against the *real* build, not the mockups — timing changes once things are actually clickable.

## 12. Judging alignment (for reference while prioritizing)

Product quality 30% · Novelty & impact 20% · Creative phone use 15% · Technical depth 15% · Office Kit usage 10% · Demo/presentation 10%. The seeded demo flow (Section 10) is what protects Product quality and Demo/presentation even under time pressure — prioritize accordingly if the clock gets tight.

## 13. Reference — conflict engine logic (already implemented)

```
Rule A — dependency conflict:
  latestLaunch = most recent, non-superseded "Launch date" decision
  securityConstraint = constraint with topic "Security review"

  IF latestLaunch exists
     AND securityConstraint exists
     AND securityConstraint.status != "satisfied"
  THEN generate Conflict:
     type: "dependency"
     newEvidence: latestLaunch.evidenceId
     existingEvidence: securityConstraint.evidenceId
```

Fully deterministic — the demo's contradiction detection never depends on a live model call succeeding at the wrong moment on stage.
