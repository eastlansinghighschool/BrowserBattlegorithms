# Challenge 28 Live Playtest & Film-Review Evidence Protocol

> [!IMPORTANT]
> **Blank Protocol Specification & Operator Guide**: This document is a blank observation template and local operator procedure. It does **not** contain real student data, completed observation rows, classroom telemetry, or personal identity information.

---

## 1. Context & Purpose

Challenge 28 (*Full Team Tactics*, Field Decisions Step 6 of 6 Capstone) pairs one live human runner (controlled via arrow keys / manual input) with one persistent Blockly ally runner (executing the saved `strategy-brain` program developed across Levels 23–27).

Because Challenge 28 requires real-time human interaction (`WAIT_FOR_INPUT`), automated reference solution harnesses correctly classify this level as `not applicable` (`status: not run`). Automated tests verify engine mechanics, but they cannot evaluate whether a student's persistent ally program collaborates effectively with a live human player.

This protocol provides a structured, repeatable, teacher-usable observation tool for evaluating live playtests and post-hoc film reviews without collecting or committing private student data.

---

## 2. Privacy Boundary & Local Workflow Instructions

All completed observation forms, screen recordings, XML exports, and field notes **must** remain strictly local and git-ignored.

### 2.1 Storage Path Standard
Store all completed observation artifacts in a dedicated session subdirectory under the ignored `local/` tree:

```text
local/challenge-28-evidence/<session-id>/
├── observation-worksheet.md
├── program-shape.xml
└── (optional) replay-notes.txt
```

* **`<session-id>`**: A generic, anonymous label (e.g. `capstone-obs-20260723-01`), **never** a student's name, email, or institutional ID.

### 2.2 Preflight Git Ignore Check (MANDATORY)
Before creating any local evidence files, run the following verification command in your shell:

```powershell
git check-ignore local/challenge-28-evidence/test-file.txt
```

* **Expected Result**: Output prints `local/challenge-28-evidence/test-file.txt`.
* **STOP CONDITION**: If `git check-ignore` returns empty output or an error, **STOP IMMEDIATELY**. Do not create or save any files until `.gitignore` is confirmed to ignore `local/`.

### 2.3 Strict Privacy Invariants
1. **No Committed Student Data**: Never commit completed observation forms, raw `.json` usage exports, video recordings, screenshots, or student names to Git tracking or tracked directories (`docs/`, `reports/`, `src/`, `tests/`).
2. **Anonymous Identification**: Use anonymous session labels. Do not record reversible student identifiers.
3. **Institutional Consent**: Screen recordings or audio notes require compliance with your school or institution's existing student privacy and consent policies. This protocol governs local file hygiene only and grants no research consent.

---

## 3. Observation Procedure & Setup Checklist

Designed for a **10–15 minute observation window** during a classroom lab session, student conference, or playtest review.

### 3.1 Observation Paths

- **Fast-Path (Live Classroom Conference, ~5–10 min)**: Real-time observation of 2–3 runs while conferring with the student. Focuses on overall team coordination and primary failure/success triggers.
- **Film-Review Path (Post-Hoc Replay Analysis, ~15 min)**: Turn-by-turn analysis of a recorded run or turn trace log. Focuses on exact condition evaluation, branch firing, and human-ally interaction timing.

### 3.2 Pre-Observation Setup Checklist

- [ ] **Level Verified**: Challenge 28 (`full-team-tactics`, Field Decisions Step 6 of 6 Capstone).
- [ ] **App Version Captured**: Record Vite build version or git commit hash (e.g. `v0.1.0-e4a8b2c`).
- [ ] **Anonymous Session Label Assigned**: (e.g. `session-fd-20260723-a`).
- [ ] **Starting Ally Program Summarized**: Record program hash or coarse shape (e.g. "8 blocks: closest-enemy sensor + freeze branch + move-toward-flag"), not student identity. If the student has exported a schema v2 usage file, the `runVersionHashes` list is a ready-made source for the program hash.
- [ ] **Local Storage Verified**: `git check-ignore local/challenge-28-evidence/` verified.

---

## 4. Blank Observation Worksheet

*Copy this section into `local/challenge-28-evidence/<session-id>/observation-worksheet.md` for each observed session.*

### Session Metadata

| Field | Value |
|---|---|
| **Anonymous Session Label** | `____________________` |
| **Date & Time** | `____________________` |
| **App / Build Version** | `____________________` |
| **Ally Program Hash / Shape** | `____________________` |
| **Observer Role** | `[ ] Teacher  [ ] Peer  [ ] Researcher  [ ] Self-Review` |
| **Observation Mode** | `[ ] Live Fast-Path  [ ] Film-Review Replay` |

---

### Turn-by-Turn Action & Decision Matrix

*Record observed turns during a run. For Live Fast-Path, record key milestone turns (e.g. enemy approach, flag pickup, freeze trigger, collision).*

| Run # | Turn # | Human Action (Keyboard) | Ally Action (Blockly) | Branch Fired / Condition Met | Game Event / Outcome | Observer Notes & Evidence |
|:---:|:---:|---|---|---|---|---|
| 1 | 1 | `MOVE_FORWARD` | `MOVE_FORWARD` | Default / Unconditional | Round Start | Both runners advance |
| 1 | | | | | | |
| 1 | | | | | | |
| 1 | | | | | | |
| 1 | | | | | | |
| 2 | 1 | | | | | |
| 2 | | | | | | |
| 2 | | | | | | |

*Key Action Codes*:
- **Human**: `MOVE_FORWARD`, `MOVE_BACKWARD`, `MOVE_UP_SCREEN`, `MOVE_DOWN_SCREEN`, `JUMP_FORWARD`, `PAUSE`, `WAIT`
- **Ally**: `MOVE_FORWARD`, `MOVE_BACKWARD`, `MOVE_UP_SCREEN`, `MOVE_DOWN_SCREEN`, `JUMP_FORWARD`, `FREEZE_OPPONENTS`, `PLACE_BARRIER_FORWARD`, `STAY_STILL`
- **Events**: `FLAG_PICKUP`, `FLAG_RETURN`, `RUNNER_COLLISION`, `FREEZE_APPLIED`, `TURN_LIMIT_TIMEOUT`, `LEVEL_PASSED`, `LEVEL_FAILED`, `RESET`

---

### Summary Run Outcomes

| Run # | Human Tactical Role | Ally Tactical Role | Result (`PASS` / `FAIL` / `RESET`) | Turns Elapsed | Primary Success or Failure Trigger |
|:---:|---|---|:---:|:---:|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

## 5. Separation of Objective Evidence vs. Subjective Interpretation

To preserve evidence integrity, observers must strictly separate **what was observed** from **what it might mean**.

### 5.1 Objective Observations (Factual)
- Exactly which keys the human pressed on turn $T$.
- Exactly which Blockly block/branch executed on turn $T$.
- Game state changes: runner coordinates, freeze status, flag carrier changes, turn count.

### 5.2 Subjective Interpretations (Inferred)
- Student's intended strategy (e.g. "Human intended to act as bait while Ally capped").
- Student's conceptual understanding of boolean logic or role separation.
- Whether a failure was caused by misreading board state vs. keyboard miskey.

### 5.3 Observer Confidence & Source Tagging

For each major interpretation or summary conclusion, tag the confidence level and evidence source:

- **Observer Confidence**:
  - `[ ] High Confidence`: Corroborated by turn-trace log, screen recording, and student explanation.
  - `[ ] Medium Confidence`: Observed directly during live play, but without turn-by-turn trace verification.
  - `[ ] Low Confidence`: Inferred purely from end-of-level pass/fail screen.

- **Evidence Source**:
  - `[ ] Direct Visual Observation`
  - `[ ] Screen Video Replay`
  - `[ ] Turn Engine Trace / Event Log`
  - `[ ] Student Verbal Explanation / Conference`

---

## 6. Rival Explanations & Falsification Framework

A passing run on Challenge 28 does **not** automatically prove that the student mastered decentralized ally strategy or that the Field Decisions progression successfully prepared them. Observers must evaluate rival explanations and falsification criteria.

### 6.1 Rival Explanations Checklist

When evaluating why a run succeeded or failed, check for these competing factors:

- [ ] **Rival 1: Human Dexterity Compensation**: Did the level pass primarily because the human player expertly dodged enemies and scored, making up for a passive, broken, or non-functional ally script?
- [ ] **Rival 2: Enemy Pathing / Board RNG**: Did favorable enemy movement or random pathing allow the ally to pass without its condition branches ever being tested?
- [ ] **Rival 3: Hardcoded Sequence**: Did the ally succeed by executing a rigid sequence of moves that happened to work on this layout, rather than evaluating local sensing logic?
- [ ] **Rival 4: Real-time Human Adaptation**: Did the student dynamically change their human runner tactics midway through the run to cover an unhandled edge case in their ally's program?

### 6.2 Falsification Prompts

What observations would **falsify** the hypothesis that *"The Field Decisions progression (Levels 23–27) prepares students to author effective ally logic for Challenge 28"*?

1. **Falsification Indicator A (Unused Concepts)**: The ally program completely omits or ignores the sensing concepts taught in Levels 23–27 (the levels `closest-threat`, `two-conditions-at-once`, and `this-or-that`), relying solely on Level 1-style unconditional movement.
2. **Falsification Indicator B (State Breakdown under Pressure)**: The ally program executes correctly in single-enemy levels (Levels 23–27), but experiences unhandled boolean evaluation failures or freeze loops when encountering Challenge 28's multi-runner board.
3. **Falsification Indicator C (Decoy Abandonment)**: The student intentionally stops updating the ally program and treats the ally as a stationary decoy, executing a solo human run to bypass the capstone's cooperative intent.

---

## 7. Interpretation Cautions & Limitations

1. **Qualitative Formative Evidence**: Completed worksheets provide qualitative insights for instruction and curriculum refinement. They are **not** standardized test scores, formal grades, or statistically validated learning metrics.
2. **No Single-Run Mastery Claims**: A single passing run does not prove conceptual mastery. Conversely, a single failed run caused by a keyboard slip does not prove a lack of understanding.
3. **No Automated Equivalence**: Manual protocol evidence cannot be directly merged into automated benchmark suites (`npm test` / behavior evidence summaries). It represents a distinct, qualitative evidence tier.

---

## 8. Summary & Storage Protocol Hand-Off

Once an observation session is complete:
1. Verify the file is saved in `local/challenge-28-evidence/<session-id>/observation-worksheet.md`.
2. Re-verify `git status --short` to ensure no files under `local/` are staged or tracked.
3. Use findings solely for qualitative feedback, teacher guide refinements, or instructional coaching.
