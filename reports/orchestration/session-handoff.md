# Orchestration Session Handoff

**Date:** 2026-09-01 (machine date)
**Latest commit before this handoff update:** `293bdfc` — `Confirm GAS source location; re-tier Gate 2 off the synthetic-account block`
**Immediate purpose of this revision:** the owner is handing the Stage 0 packet slate to the Codex
orchestrator for a pre-implementation review pass. Read "Stage 0 slate" below first; it says what
is settled, what is genuinely open, and where the authoring thread most wants a second opinion.

This is the one living orchestrator pointer for the next thread. It intentionally does not
repeat packet status, implementation details, validation logs, or project contracts already
recorded in the packet index, Plan 117, its progress report, and `AGENTS.md`.

## Live owner direction

- The owner explicitly deferred investigation of the prior GitHub Pages/publishing failure.
  Do not resume that work merely because it was discussed; it needs a fresh owner request and,
  if necessary, the specific GitHub Actions failure evidence. **One live interaction to be aware
  of:** the owner ratified shipping a probe child page in `public/`, which only becomes useful
  once a build reaches the live site. That is not authorization to reopen the publishing
  investigation. `plan-120` carries a stop condition telling the implementer to surface a broken
  pipeline rather than repair it; keep that boundary.
- Three orchestrator threads have been in play: a kimi thread (plans through plan-115 closeout),
  a temporary Codex orchestrator (plan-117 author, first writer of this handoff), and a claude
  thread (Stage 0 slate author, second writer). The owner mediates all of them; treat this file
  as the bridge between threads, not a new backlog or a replacement for the packet index. As of
  2026-09-01 the owner is routing the Stage 0 slate back to the Codex orchestrator for a
  pre-implementation review pass — that is mode C turn-taking on this file, so commit your turn
  before handing back.
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

- **Gate 0 is closed as of 2026-09-01** (owner answered from existing district knowledge):
  Apps Script publishing permitted, teacher-Drive student records permitted, retention
  unbounded-permitted. The third-party-storage question was reclassified into a Gate 1
  measurement rather than an IT ask. Record and reasoning:
  `reports/orchestration/gas-integration-commentary/district-it-questions.md`. Only outstanding
  item is synthetic domain accounts for Gate 2, which do not block Gate 1. Do not re-ask these
  of the owner; if a future thread needs them reopened, the original four-question draft is in
  that file's git history at `6dd18b4`. The synthetic-account request was re-tiered on the same
  day and is **not** a blocker: Gate 2's only architecture-deciding condition needs one
  non-teacher domain account, which a real student satisfies under the conditions recorded in
  `plan-120` R2. Do not let a future thread reintroduce it as a gate.
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

### Stage 0 slate — written 2026-09-01 by the claude orchestrator thread (second writer of this file)

Four packets convert the gate-independent part of Stage 1 into work orders. All are `ready`; none
are dispatched. Commits `516323c`, `6dd18b4`, `8713af4`, `293bdfc`.

| Packet | Covers | Origin |
| --- | --- | --- |
| `plan-118` | Exception-safe storage adapter (`src/platform/`), guided in-memory fallback, one banner | review F7 |
| `plan-119` | Preserve + restore work displaced by a starter-hash mismatch | review F1 |
| `plan-120` | Nested-frame and tenant-identity probe kits; the `integrations/` surface | Gates 1 and 2 |
| `plan-121` | Identity-stripped evidence builder, filename attribution, analyzer blank-name repair | review F6 + owner decision 8 |

Sequencing: `plan-118` before `plan-119` (both edit `getStoredWorkspaceXmlText`, and 119 writes its
recovery slot through 118's accessors). `plan-120` and `plan-121` are write-scope-disjoint from
those and from each other (mode B).

#### Settled — do not spend a review pass reopening these

All are owner-ratified in the accepted section of `docs/decision-log.md`, dated 2026-09-01:

- the Stage 0 / Stage 1 split itself;
- `src/platform/` and `integrations/google-apps-script/` as code surfaces, with the client half at
  `src/integration/` talking to the shell only over `postMessage`;
- the standing rule that the protocol/evidence schema has exactly one source file and the Apps
  Script copy is *generated* with a staleness test — no hand-maintained parallel copies;
- `public/integration-probe/nested-frame-child.html` shipping as an unlisted `noindex` diagnostic
  page on the live site;
- Gate 0's four answers, and the reclassification of the third-party-storage question into a Gate 1
  measurement;
- Gate 2's tiering, and specifically that synthetic accounts are **not** a blocker.

The eight owner decisions recorded during the Claude review are also still current direction. If
provenance is ever in doubt, ask the owner rather than silently reopening.

#### Why Stage 1 proper is unwritten

Writing the protocol, server, Drive layout, or retention packets now would require choosing the
parent-origin authentication design, which the synthesis explicitly forbids ratifying before origin
stability is measured. `plan-120` exists to make that measurement one owner action away. A reviewer
who believes part of S1-B is pre-writable should say so — that judgment is worth testing, not
defending.

#### Where the authoring thread most wants a second opinion

Named honestly, in rough order of how much they would cost if wrong:

1. **A gap the slate does not cover at all.** The Claude review observed that nobody has measured
   how many class minutes the current download/submit workflow actually consumes — "the entire
   project is justified against it." That measurement is cheap, gate-independent, and has no
   packet. It is the strongest pre-implementation addition candidate.
2. **`plan-121` deliberately ships a module with no caller.** The cloud evidence builder is dead
   code until Stage 1 exists. The authoring thread judged the analyzer blank-name repair worth
   doing now on its own merits and the builder cheap to write alongside it. A reviewer could
   reasonably argue for splitting the analyzer repair out and holding the builder for Stage 1.
3. **`plan-118` is the largest of the four** — adapter plus eight call-site migrations plus the
   guided fallback plus a banner. It could split cleanly at the fallback/banner seam. Not split,
   because both halves need the same gate answer and splitting would serialize two packets against
   the same file.
4. **`plan-119` leaves one product question to the implementer**: whether restore is available in
   `plan-118`'s memory-only mode, "decide and document which." That is arguably a gate item the
   authoring thread should have owned rather than delegated.
5. **`plan-120`'s hygiene test has one vague requirement** — "no long opaque-id-looking literal."
   That is the flakiest assertion in the slate and may want a concrete pattern or removal.
6. **Two loose ends with no home yet, both deliberate.** `src/integration/` is named in ratified
   decisions but created by no packet. And the review's recommended fake-parent test harness — the
   only route to automated coverage for most of Stage 2 — is not in any packet.

#### One finding got sharper on re-verification

Review F6 said the CLI analyzer degrades to `submission-N` on blank names. It is worse and
narrower than that. `compareUsageSummaries` is duplicated in `src/usage/usageAnalyzer.js` and
`src/usage/usageAnalyzerBrowser.js`; in both copies an all-blank-name similarity group has
trivially unique `submission-N` labels, so the "identical attempt sequence under **different
names**" flag fires on records that have no names at all — a false academic-integrity signal
shown to a teacher, in exactly the condition cloud mode creates. Meanwhile
`scripts/analyze-usage-files.js` already falls back to the filename for two of the three flag
families, so the gap F6 described is not quite the gap that exists. `plan-121` carries the repair.
Worth noting as a general caution: the review corpus is strong but its code claims were written
against a read, not a re-run. Re-verify before building on one.

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
