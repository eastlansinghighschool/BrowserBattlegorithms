---
id: plan-105
title: "Challenge 28 Live Capstone Evidence Protocol"
status: complete
resolution: "Blank Challenge 28 live-evidence protocol delivered: privacy boundary with mandatory check-ignore preflight, dual observation paths, human/ally decision matrix, objective-vs-interpretation separation with confidence tagging, rival-explanations falsification framework. Generated-evidence hand edit reverted at acceptance (generator-artifact purity); runVersionHashes pointer and level-id wording tidied. Owner gate: review the blank protocol before any classroom evidence is collected."
depends_on: [plan-104]
gate: "owner review of the blank protocol before any classroom evidence is collected"
summary: >-
  Define a privacy-safe teacher/manual playtest and film-review protocol for Challenge 28, whose human-plus-ally play cannot be simulated by the automated behavior-evidence harness, without collecting or committing student data in this packet.
---
# Plan 105: Challenge 28 Live Capstone Evidence Protocol

## Packet Metadata

- Packet id: `plan-105`
- Packet title: Challenge 28 Live Capstone Evidence Protocol
- Status: (see frontmatter)
- Owner/model: curriculum/evidence implementer
- Date: 2026-07-16
- Packet type: docs / evidence protocol
- Mutation level: docs-only
- Approval gate: owner review of the blank protocol before any classroom evidence is collected
- Depends on: Plan 104 complete
- Expected artifacts:
  - blank Challenge 28 observation protocol
  - local-only operator directions and privacy boundary
  - progress report

## Goal

Create a repeatable, teacher-usable protocol for evaluating Challenge 28's human-plus-ally capstone. The protocol should reveal whether the carried-forward Field Decisions program reacts usefully during live play, while clearly separating observed evidence from interpretation. This packet creates the blank protocol only; it does not collect or analyze classroom evidence.

## Non-goals

- Do not modify Challenge 28, runtime logging, usage tracking, or admin tooling.
- Do not automate human input or force Challenge 28 into the behavior-evidence harness.
- Do not collect student names, raw exports, identity maps, recordings, or completed observation rows.
- Do not claim that the protocol validates learning effectiveness.
- Do not build the broader Plan 85 film-review feature.

## Why This Packet Exists

Challenge 28 uses `WAIT_FOR_INPUT`: the student drives the human runner while one Blockly ally runs the persistent project program. Plan 74/86 correctly classify automated behavior evidence as not applicable. A manual protocol is needed before the project makes durable claims about how the capstone performs in live play.

## Authority And Contracts

Required reading:

- `AGENTS.md`
- Plan 98 decision report and progress report
- Plan 104 progress report and final Field Decisions UI/copy contract
- `src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js`
- `reports/development/guided-level-complexity-audit/behavior-evidence/33-full-team-tactics.md`
- `reports/development/guided-level-complexity-audit/level-dossiers/33-full-team-tactics.md`
- `docs/development/plan-85-campaign-rewrite-charter.md` film-review direction
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/usage-and-admin.md`
- `docs/CohortUsageAnalysis.md`

Contracts to preserve:

- Automated evidence remains honestly `not applicable` for this live-human capstone.
- Raw or row-level classroom evidence stays under ignored `local/` paths and is never committed.
- The tracked protocol contains no real student data or small-cohort results.
- Observation distinguishes the human runner's decisions from the Blockly ally's local-rule behavior.

## Scope

### In Scope

- Create `docs/Challenge28LiveEvidenceProtocol.md` as a blank operator protocol.
- Define a short setup checklist, observation procedure, event/decision worksheet, interpretation cautions, and stop conditions.
- Explicitly direct completed forms and any recordings/exports to an ignored path such as `local/challenge-28-evidence/<session-id>/`.
- Include a preflight `git check-ignore` command and a “stop if not ignored” instruction.
- Include fields that capture, without identity data:
  - app/build identifier and level version;
  - anonymous session label;
  - starting program hash or coarse program-shape description, not raw student identity;
  - human action and ally action kept in separate columns;
  - which local condition/branch appeared to fire when observable;
  - flag pickup/return, collision/freeze, timeout, score, reset, or halt outcome;
  - moments where the saved rulebook helped, failed, or was revised;
  - observer confidence and whether evidence came from direct observation, event log, or student explanation.
- Define a small falsification section: what observations would contradict the claim that Field Decisions prepares students for the capstone.
- Explain that a completed protocol is directional evidence, not a grade or causal learning study.

### Out Of Scope

- Any populated evidence artifact in tracked docs or reports.
- Exact cohort counts, rates, percentages, student quotes, screenshots, or recordings.
- Database/schema work, code changes, browser automation, or deployment.
- A conclusion about whether Challenge 28 should be redesigned.

## Implementation Requirements

### 1. Teacher-Usable Procedure

- Target a 10-15 minute observation that can be used during a playtest or classroom conference.
- Use plain language and checkboxes/tables where useful.
- Separate “what happened” from “what it might mean.”
- Include a minimum viable observation path for a busy teacher and an optional deeper film-review path.

### 2. Privacy-Safe Local Workflow

- Provide exact folder setup and ignore-verification directions.
- Never ask the teacher to paste raw evidence into a tracked report.
- Use anonymous session labels that cannot be reversed from the tracked protocol.
- State that recordings require the school's existing consent/privacy process; this packet grants no consent.

### 3. Evidence Honesty

- Preserve the automated harness's `not applicable` classification.
- Mark inference and observer uncertainty explicitly.
- Include rival explanations such as human-runner skill, prior familiarity, copied programs, or random NPC movement.
- Do not convert block count, completion, or one successful run into a mastery claim.

### 4. Documentation Tail

- Add a short link from the Plan 98 progress report or relevant evidence documentation to the protocol if useful.
- Update a subsystem note only if this packet establishes a durable workflow contract there; do not turn runtime docs into a teaching handbook.

## Validation Checklist

- [ ] `node scripts/dev/plan-status.js check plan-105` passes before work.
- [ ] Blank protocol is complete and contains no student or cohort data.
- [ ] Local path and `git check-ignore` instructions are explicit.
- [ ] Human and ally behavior are recorded separately.
- [ ] Observation and interpretation are separate.
- [ ] Falsification/rival-explanation prompts are present.
- [ ] `rg -n "studentName|sessionId|C:\\Users\\|/Users/" docs/Challenge28LiveEvidenceProtocol.md reports/development/plan-105-challenge-28-live-capstone-evidence-protocol` finds no leaked identity/path material.
- [ ] `git diff --check` passes.
- [ ] Progress report exists at `reports/development/plan-105-challenge-28-live-capstone-evidence-protocol/progress.md`.

## Stop Conditions

Stop and report if:

- The protocol would require runtime instrumentation or usage-schema changes.
- The proposed output location is not ignored by Git.
- Real classroom data, screenshots, recordings, names, or reversible identifiers appear in the workspace.
- The protocol starts making a redesign or learning-effectiveness decision from hypothetical evidence.

## Progress Report

`reports/development/plan-105-challenge-28-live-capstone-evidence-protocol/progress.md`

