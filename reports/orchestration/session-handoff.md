# Orchestration Session Handoff

**Date:** 2026-09-01 (machine date)
**Latest commit before this handoff update:** `d0fbd13` — `Update orchestration handoff for GAS review`
(this handoff update is committed with the Stage 0 packet slate described below)

This is the one living orchestrator pointer for the next thread. It intentionally does not
repeat packet status, implementation details, validation logs, or project contracts already
recorded in the packet index, Plan 117, its progress report, and `AGENTS.md`.

## Live owner direction

- The owner explicitly deferred investigation of the prior GitHub Pages/publishing failure.
  Do not resume that work merely because it was discussed; it needs a fresh owner request and,
  if necessary, the specific GitHub Actions failure evidence.
- Two orchestrator threads have been in play: a kimi thread (plans through plan-115 closeout)
  and a temporary Codex orchestrator (plan-117 author, first writer of this handoff). The owner
  mediates both; treat this file as the bridge between threads, not a new backlog or a
  replacement for the packet index.
- The owner said they would explain the reasoning behind plan-117 "in a bit"; that explanation
  had not yet arrived in the kimi thread at handoff time. Expect it, and reconcile the plan-115
  / plan-117 adoption baselines via `.bootstrap-adoption.json` rather than by assumption.

## Current orchestration focus: GAS classroom integration (2026-09-01)

The owner opened a design investigation into wrapping Browser Battlegorithms in a
domain-restricted Google Apps Script web app. The intended value is account-attributed,
cloud-hosted classroom evidence and eventually portable progress without adding Firestore,
GCP, or Google Classroom integration. No implementation packet is authorized yet.

The durable architecture record is
`reports/orchestration/google-apps-script-cloud-integration-proposal.md`. Four adversarial
reviews are under `reports/orchestration/gas-integration-commentary/`, and their adjudicated
summary is `reports/orchestration/gas-integration-commentary/review-synthesis.md`. Start with
the synthesis rather than reconstructing consensus from the four long reviews, but consult the
individual reviews when revisiting a disputed remedy or its evidence.

All four reviewers kept the basic architecture alive but judged the original proposal not
ready for packets. The current recommended shape is staged:

1. Stage 1 is an account-attributed evidence relay and teacher extraction workflow. It removes
   manual submission friction while leaving gameplay local-first. It does not restore gameplay
   state.
2. Stage 2 adds cross-device continuity only after separate account-isolation, atomic-restore,
   startup-ordering, recovery, migration, and conflict contracts are proven.

The Claude review records eight owner decisions made during reviewer dialogue: stage the pilot;
use separate evidence and portable-state Drive artifacts; require a signed-in-account gate on
every page load; archive evidence on a schedule plus explicit Submit; never block play on a
cloud conflict; sync PvCPU Free Play but not the two PvP team workspaces; retain an unlabeled
star column in the class view; and carry authenticated attribution in the teacher-download
filename rather than changing the hashed v2 payload. The synthesis treats those as current
owner direction. If that provenance is ever in doubt, ask the owner rather than silently
reopening or reversing the decisions.

The most important unresolved gates are external, not packet-writing tasks:

- Ask district IT whether teacher-deployed domain-restricted GAS apps are permitted, whether
  third-party site data is blocked on managed Chromebooks, whether teacher-Drive storage is
  covered by district privacy agreements, and what records/appeal schedule controls retention.
- Run the minimal real-GAS nested-frame capability probe before roster or implementation work.
  It must cover actual origins, sandbox behavior, download/modals/speech, embedded storage,
  keyboard accessibility, and Chromebook viewport.
- Run the tenant identity probe with synthetic domain accounts, including multi-login and
  account switching. Blank or ambiguous server-derived identity is a hard stop for cloud mode.
- Only after those gates should the proposal be revised and a Stage 1 packet slate considered.

Two findings are useful even if GAS integration is later abandoned: embedded mode exposes
unguarded browser-storage access, and current starter-version mismatch handling can
destructively replace a stored workspace. Both now have written packets (`plan-118`, `plan-119`;
see the Stage 0 section below), still awaiting owner dispatch — the review analysis itself
authorized no source changes.

The main unresolved reviewer disagreement concerns how the child authenticates a GAS parent if
the HtmlService origin changes. Do not choose a broad `googleusercontent.com` suffix check or
hard-code an exact origin by assumption. Measure stability first; prefer exact pinning when
stable, and otherwise design a server-issued deployment/account-bound proof. Other settled
dispositions: keep server-side Drive filenames opaque, make file/package migration the reliable
Stage 2 baseline, and treat popup migration as optional convenience.

The owner expects that another, possibly cheaper, orchestrator may oversee later proposal and
packet work. Future threads should therefore preserve the explicit Stage 1/Stage 2 boundary and
should update durable files rather than depend on this thread's conversational context.

### Stage 0 slate written 2026-09-01 (claude orchestrator thread, second writer of this file)

A second orchestrator thread converted the gate-independent part of Stage 1 into four packets:
`plan-118` (exception-safe storage, review F7), `plan-119` (starter-mismatch displaced-work
recovery, review F1), `plan-120` (probe kit for Gates 1 and 2, plus the `integrations/`
repository surface), `plan-121` (cloud evidence builder, identity policy, analyzer blank-name
repair, review F6 and owner decision 8). All four are `ready` with owner gates inside them; none
are dispatched. The framing amendment behind the split, and the two new code surfaces
(`src/platform/`, `integrations/google-apps-script/`), are recorded under "Proposed but not yet
accepted" in `docs/decision-log.md` and are **not owner-ratified**.

Stage 1 proper was deliberately left unwritten. Writing the protocol, server, Drive layout, or
retention packets now would require choosing the parent-origin authentication design, which the
synthesis explicitly forbids ratifying before origin stability is measured. `plan-120` exists to
make that measurement one owner action away.

Two live judgments from that thread that exist nowhere else:

- **Sequencing.** `plan-118` must precede `plan-119` — both edit `getStoredWorkspaceXmlText`, and
  119's recovery slot should be written through 118's safe accessors. `plan-120` and `plan-121`
  have write-scopes disjoint from those two and from each other (mode B).
- **One finding got sharper on re-verification.** Review F6 said the CLI analyzer degrades to
  `submission-N` on blank names. It is worse than that: `compareUsageSummaries` is duplicated in
  `src/usage/usageAnalyzer.js` and `src/usage/usageAnalyzerBrowser.js`, and in both copies an
  all-blank-name similarity group has trivially unique `submission-N` labels, so the "identical
  attempt sequence under **different names**" flag fires on records that have no names at all —
  a false academic-integrity signal, in exactly the condition cloud mode creates. `plan-121`
  carries the repair. The CLI script itself already falls back to the filename for two of the
  three flag families; the gap is narrower and nastier than F6 described.

## Thread-only caution

- The Bootstrap capability catch-up exposed a real path mismatch: Browser Battlegorithms now
  has exactly one canonical packet-guidance document at
  `docs/development/packet-creation-guidance.md`; the root-path document is only a
  compatibility redirect. Do not restore copied guidance text to the redirect stub.
- Future Bootstrap work must start with a fresh full audit of the live ledger. The completed
  Plan 117 result is evidence for its 2026-08-23 audit, not a promise that later upstream
  versions remain current.

## State from the kimi thread (through plan-115 closeout, 2026-08-23)

Board posture and near-term queue:

- **plan-116 (collision/waste event tracking) is `ready` and deliberately held** — the owner
  chose "close 115, hold 116" on 2026-08-23. When dispatched, it is gate-first: the
  counter-definition questions must go to the owner as structured multiple-choice before any
  implementation. After 116, the queued follow-ons are the star-3 criteria expansion authoring
  packet and film review (charter S7).
- Validation baselines re-verified against commit `538d03b` on 2026-08-23: `npm test` 554/554
  (node --test), `npm run build` clean (vite 7.3.1), `plan-status.js lint` OK,
  `lint:levels` exit 0 (warnings only, including the two expected optional-lab untiered ones).
- Open minor items, neither urgent: a manual browser spot-check of the inversion lab's
  intentionally empty toolbox (plan-97), and a recorded durability nit —
  `tests/unit/star-evaluation-campaign.test.js` embeds a 122-line XML copy of the
  advanced-scrimmage `final.xml` fixture instead of referencing it.

Operating lessons this thread learned the hard way (owner-corrected; some now codified in the
adopted Bootstrap prose, but the incidents explain the rules):

- **Repair send-back = status flip.** When a review sends a plan back, set it to `in-progress`
  immediately; implementers are blocked from acting while a plan sits at `delivered`. The
  owner had to correct this once (plan-97). Durable repair work orders live at
  `reports/development/<packet>/repair-NN.md` and are committed before dispatch.
- **Never `git add -A` while an implementer is in flight.** This thread once swept unreviewed
  implementer work into an orchestrator commit; it was split after the fact (`cec4302` /
  `7ae533c`). Stage by explicit path; leave other agents' uncommitted files (e.g. the Codex
  orchestrator's plan-117 artifacts at the time) alone unless the owner says otherwise.
- **Datestamp from the machine, never from conversation recency.** This is an async session
  with multi-day gaps; a batch of entries dated 07-22 was really 08-05/06/10. Run `date` and
  check commit timestamps. The reverse-flow proposal was filed upstream at
  `C:\AI\Bootstrap\docs\bootstrap-dev\incoming\2026-08-10-browser-battlegorithms-date-stamping-from-environment.md`;
  plan-117's progress report says the date-stamping rule is now merged into the prompts, so
  treat the upstream note as likely processed before re-proposing.
- **Re-run validation claims locally before accepting them.** Plan-115's first progress report
  pasted upstream Bootstrap's vitest numbers as if local. Separately, compacted memory claimed
  vite 5.4.19 while repo truth was 7.3.1 — trust `package.json` and fresh command output over
  any summary, including this one.
- Reviews in this session were delegated to a resumed explore-type subagent (agent-4) holding
  context from every prior review; that context does not survive into a new thread, so write
  full cold-start review briefs. The owner gives final approvals through structured
  multiple-choice questions; session interruptions from usage limits mid-cycle are normal —
  re-establish state from the repo, not from memory.

## Transfer check

Before taking any new action, inspect `git status --short`, read the current packet index, and
run the named packet's `plan-status check`. Those durable surfaces—not this handoff—are the
source of truth for work selection and lifecycle state.
