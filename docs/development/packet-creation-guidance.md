# Packet Creation Guidance

Use this guidance when creating Browser Battlegorithms development packets for smaller, faster, or cheaper implementation agents.

The goal is to make each packet a clear work order plus a guardrail contract. A packet should tell the implementing agent what to do, what not to decide, where project truth lives, how to validate the result, and when to stop for integration-owner review.

## Packet Location And Naming

- Put implementation packets in `docs/development/`.
- Use sequential names such as `plan-01-guided-level-contract-repair.md`.
- Keep `docs/development/README.md` updated when adding, completing, or superseding a packet; the packet table is generated from packet frontmatter with `node scripts/dev/plan-status.js render`.
- Progress reports should go under `reports/development/<packet-name>/progress.md` unless the packet states otherwise.

<!-- bootstrap:advisor-consultation v1 begin -->
## Every packet inherits advisor-consultation; do not re-scope it per packet

The `advisor-consultation` capability (see the implementer and orchestrator starting prompts)
applies to every packet unconditionally as a **declaration requirement** — every implementer
thread states one of "consultation ran," "not warranted," or "degraded mode" — but whether an
actual consultation runs is a proportionality judgment the thread makes at packet start (a real
behavioral surface — code/script/schema changes, or anything flagged high-risk — requires it;
docs-only, prose-only, or a genuinely trivial mechanical edit does not), not a per-packet or
per-repository adoption choice. When writing a packet:

- Do not add a packet-specific "consult an advisor" requirement, a per-packet opt-out, or a
  `deferred` treatment for it in the packet's own gates or stop conditions — that misreads a
  thread-level property as a repository- or packet-level one.
- Do not pre-classify the packet as "docs-only" to pre-empt the thread's own declaration — the
  thread still states its branch explicitly at packet start, even for a packet the author
  expects to be mechanical.
- If a packet is unusually high-risk and the owner wants a consultation to be non-negotiable
  regardless of the assigned thread's provider, name the **owner-mediated consultation**
  degraded mode explicitly as a requirement for that packet. Do not silently assume a
  consultation will happen just because the capability exists.
<!-- bootstrap:advisor-consultation v1 end -->

<!-- bootstrap:commit-discipline v2 begin -->
## Commit Discipline

- You commit during review — inline repairs, docs corrections, and the closeout commit.
  Stage by explicit path.
- **If a git command fails with `index.lock: File exists`, another agent is mid-commit. Wait and
  retry.** Never delete the lock file: a lock that looks stale may be a live commit, and removing
  it can corrupt someone else's work. Disjoint write-scopes prevent content conflicts, not index
  contention — serializing here is expected, not an error.
- **Confirm the working tree is clean before setting `complete`.** Uncommitted packet
  work at closeout is a defect: invisible to commit-derived tooling, and inherited by
  the next thread as unexplained dirt.
- **A tree containing changes you did not write is a signal to stop and ask — not a staging problem
  to solve.** That is the default. You may resolve it yourself only where the correct resolution is
  unambiguous *and* nothing is discarded: changes plainly belonging to the packet under review may be
  committed with it, and changes plainly belonging to another thread's in-flight work are left
  untouched and named in your report. Anything else — including deciding *whose* work it is — goes to
  the owner. **Never resolve by discarding work**: no `reset --hard`, no `checkout -- .`, no
  stash-and-forget over changes you did not create.
- Push only with explicit owner authorization.
- Branches are for overlapping-scope or abandonable work, not a default; delete them
  when merged.
- **This governs the repository you are working in.** If your packet has you write into
  a *different* repository, that packet states whether and when to commit there — never
  infer it from this rule.

### Concurrency modes

Two variables govern whether shared-tree work is safe: concurrency and scope overlap.

- **Mode A — sequential, any scope.** One agent at a time. Safe regardless of overlap.
  Each agent commits its own work so the next starts from a clean tree.
- **Mode B — concurrent, disjoint write-scopes.** Two or more agents at once, each
  owning files no other touches. Safe; no branches or worktrees needed.
- **Mode C — turn-taking on a shared file.** Two orchestration threads deliberately
  alternating on the same file. Sequential, not concurrent — which is what makes it
  safe despite total scope overlap. Each thread commits its own turn *before handing
  back*; the commit is the handoff signal, not mere hygiene, and skipping it destroys
  the pattern's value.

Concurrent work with overlapping scopes is unsafe regardless of care — the working tree
is shared state. Serialize it (mode A or C), or isolate it on a branch or worktree.

**Single-live-orchestrator assumption.** The bounded authority above assumes you are
the only orchestrator thread acting on this tree at a time. Under mode C turn-taking,
do not apply that authority to the other thread's in-flight turn — wait for its handoff
commit before touching the shared file, and commit your own turn before handing back.
<!-- bootstrap:commit-discipline v2 end -->

## Orchestrator review and repair flow

After implementation, the orchestrator decides between:

- **Accept the work as ready for owner review** — set `status: delivered` in frontmatter. This is the no-issues path. The orchestrator should not quietly accept work that hasn't been independently verified.
- **Handle repairs according to the three response tiers:**

<!-- bootstrap:review-response-tiers v1 begin -->
Use three response tiers when review finds issues:

1. **Inline orchestration edits:** For docs-only fixes, report corrections, wording cleanup, prompt/template edits, or other low-risk changes that do not require tests or further iteration, make the edits directly during review. This keeps the loop precise and avoids wasting an implementer pass on changes the orchestrator can see clearly.
2. **Implementer repair prompt:** For small-scale repairs that may require testing, iteration, generated outputs, external probes, or source changes, return a concise prompt the owner can hand back to the implementer. Include the exact files, acceptance checks, and stop conditions.
3. **Durable repair note:** For larger repairs that need multi-step coordination, substantial judgment, or should live beside the implementation evidence, write a repair note under `reports/development/<packet>/` (for example `repair-NN.md`) and summarize how it should be used.

Do not quietly make changes that require owner policy decisions, external behavior, source-material revisions, generated-output regeneration, or broad implementation testing. Route those through tier 2 or tier 3.
<!-- bootstrap:review-response-tiers v1 end -->

For investigation or conclusion-bearing packets, apply the **falsification check** (see *For investigation packets: design for falsification* above) before accepting any conclusion — the same discipline, enforced at review time.-name>/progress.md` unless the packet states otherwise.

## Packet Metadata

Every packet should start with metadata in YAML frontmatter, then repeat the human-readable packet metadata block in the body if needed:

- Packet id:
- Packet title:
- Status: draft / ready / in-progress / delivered / complete / superseded / parked
- Owner/model:
- Date:
- Packet type: implementation / scan-only / docs / testing / frontend / integration / deployment / other
- Mutation level: none / docs-only / source-code / tests / generated-local / GitHub config / production
- Approval gate: none / before mutation / before generated output / before dependency install / before deploy / before production action
- Expected artifacts:
- Progress report folder:
- Progress report file:

## Packet Summary

Include:

- Goal:
- Non-goals:
- Depends on:
- Blocks:
- Why this packet exists:

Make the "why" concrete. For this project, that usually means explaining the student learning outcome, AP CSA bridge, guided campaign coherence, strategy/agent-coordination payoff, rule correctness, accessibility, static deployment risk, or test confidence the packet resolves.

## Authority And Contracts

Name the sources of truth the implementing agent must obey.

Common Browser Battlegorithms references:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
   - `docs/development/README.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `vite.config.js`
  - `playwright.config.js`
  - `src/`
  - `tests/`
- Subsystem runtime contracts:
  - `docs/subsystems/` — each note is the authoritative source of truth for the runtime contract it covers. Code, tests, and other docs that disagree with a subsystem note are bugs.
- Current packet tracking:
  - `docs/development/README.md`

Also list decisions the packet must not redefine. Project-level decisions:

- The app is a browser-based, Blockly-driven capture-the-flag strategy game.
- Students should learn event-driven programs, one-action-per-turn execution, conditionals, sensing, resource checks, and strategic decomposition.
- AP Computer Science A is a priority audience, so the block experience should prepare students for Java-style boolean reasoning, comparisons, and role-based control flow.
- The end goal is more detailed strategic thinking: students should design ally programs that coordinate through shared rules, local sensing, role assignment, and state checks instead of central command.
- Core rule outcomes belong in `src/core/`; rendering belongs in `src/render/`; DOM/UI state belongs in `src/ui/`; Blockly belongs in `src/ai/blockly/`; NPC logic belongs in `src/ai/npc/`.
- Guided mode should teach one primary concept at a time, with synthesis levels clearly marked as "no new tools" challenge moments.
- Demo Blockly should show structure, not reveal the exact solution to the current puzzle.
- Tests must stay aligned with authored level count, level order, toolbox restrictions, and reference solutions.
- The app should remain deployable as static Vite output.

If an implementing agent discovers that a contract appears wrong, the packet should stop and report rather than quietly changing product direction.

## Required Reading

Keep required reading short but sufficient.

- Required reading is for files that define the contract or will likely be edited.
- Optional/contextual reading is for supporting docs or neighboring modules.
- Use `rg` instructions when filenames or symbols may have changed.

## Scope

Split scope into:

- In scope
- Out of scope
- Files and areas likely touched

Be explicit about dependency installs, generated output, GitHub workflow edits, and deployment. If a packet does not authorize production deployment, say so.

## Work Plan

Use a small numbered plan:

1. Inspect current state and confirm assumptions.
2. Implement only the bounded changes in scope.
3. Add or update focused tests.
4. Run targeted validation.
5. Run broader validation required by the packet.
6. Report results, risks, and follow-ups clearly.

For scan-only or approval-gated packets, say exactly where the implementing agent must stop.

## Implementation Requirements

Break work into narrow requirement sections. Each requirement should include:

- Required behavior
- Constraints
- Edge cases
- Expected artifact or code change

Include pedagogy checks when UI, feedback, levels, copy, Blockly, or visible game state changes:

- Does this help students understand the one-action-per-turn execution model?
- Does it help students reason about `if`, `else`, `AND`, `OR`, `NOT`, comparison, resource readiness, and runner index?
- Does it connect block logic to AP CSA-style strategic boolean thinking?
- Does it support decentralized ally behavior through local sensing, roles, and state instead of central command?
- Does it encourage prediction, debugging, and iteration rather than copying a revealed solution?
- Is it usable on classroom projectors, student laptops, and narrow screens?
- Are keyboard, color contrast, sound, motion, and screen reader basics preserved?

If the packet changes runtime behavior covered by a subsystem note (`docs/subsystems/`), it must either include the matching note update in the same patch, or stop and surface the conflict for owner review. Silent divergence from a subsystem note is not allowed.

## Copy Voice Contract (Charter S5, Plan 94)

Student-facing text (`description`, `introText`, `tips`, `tutorialSteps[].body`) has an in-world scout/coach speaker, not a curriculum designer's voice. Full contract, examples, and the phrase/length lint rules that enforce it: `docs/CopyVoiceContract.md`.

- `npm run lint:levels` warns (never fails) on banned meta phrases (`"this level teaches"`, `"beginner-friendly"`, `"this is a good level for"`), solution-spoiler phrasing, and pre-play prose over ~35 words.
- These warnings are non-blocking by design — do not rewrite unrelated existing copy just to silence one while working on an unrelated packet; that's Plan 95's scoped, owner-gated job.
- New or edited student-facing copy in your own packet's scope should still follow the contract even though the lint won't fail the build over it.

## Degenerate-Solution Test Standard (Charter S8)

Any packet that raises a guided level's required complexity — making a previously-optional concept load-bearing for that level's win condition — must include a test proving the **old, degenerate solution shape now fails**, not only that the new reference solution passes. A reference-solution test alone can't tell a genuine uplift from an untested regression; the paired failing case is the falsifiable claim.

- Identify the specific old/naive solution shape the uplift is meant to defeat (e.g., a program that ignores the sensor concept the level is meant to teach).
- Add a test asserting that shape now fails the level (via the harness in `tests/unit/helpers/testHarness.js`, or an equivalent simulation), alongside the existing reference-solution-passes test.
- Record in the packet's progress report what the old shape was and why it used to succeed (frozen/inert threat, no real consequence for skipping the concept, etc.) versus why it now fails (real capture, timeout, or other concrete consequence).
- This standard was established by Plan 92 (`enemy-nearby`'s Guard uplift) as the first packet to raise a guided level's required complexity under the Plan 85 charter.
- **Linter hook (Plan 100):** the S8 degenerate fixture is also a first-class input to the `win-condition-requires-named-mechanic` lint rule (`src/dev/levelLintCore.js`). A `runner_reaches_cell`-style win condition can't statically encode "or a live enemy captures you," so the rule would otherwise warn forever on every living-board uplift level. If your uplift makes a mechanic mandatory *dynamically* rather than structurally, put the S8 degenerate program in a discoverable fixture file at `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` (not inline in a test) and set `mechanicNecessity: "dynamic"` (from `MECHANIC_NECESSITY` in `src/config/constants.js`) on the level. The rule accepts the claim only when both the annotation and the fixture are present — an annotation without a fixture is a lint **error**, not a silent pass.

<!-- bootstrap:falsification-check v3 begin -->
## Falsification Check

When a packet or review delivers a conclusion rather than code, ask what would make the claim wrong before accepting it.

- For each rival hypothesis, name the observation that would have falsified it.
- Watch for confounded designs where the candidate causes always agree, or where one dimension never varied.
- Watch for aggregate reporting that hides tails or edge cases.
- Prefer cheap discriminating experiments over broad assertion.
- Where possible, anchor the check to a concrete incident from this project's own history.

Useful repo-specific examples:

- "Tests pass" but the level no longer requires the claimed block.
- "The generated report is complete" but a subsystem note is stale.
- "Usage counts look healthy" but the sequence story is missing.
- "The private data path is safe" but a tracked path slipped in.

A conclusion that survives this check is worth recording. One that does not is worth exactly one more cheap experiment.
<!-- bootstrap:falsification-check v3 end -->

## Model-Specific Instructions

When targeting a lower-cost model:

- Ask it to summarize the job before editing.
- Give exact files and commands.
- Keep the write scope small.
- Tell it not to broaden into redesigns or unrelated refactors.
- Tell it to stop on low-confidence pedagogy, Blockly semantics, accessibility, collision/game-rule behavior, or deployment decisions.
- Prefer small patches with tests over sweeping rewrites.

## Commands

List commands from the repository root. Use only the commands relevant to the packet.

```powershell
npm install
npm test
npm run build
npm run test:browser
```

Only include deployment commands when the packet explicitly allows them.

## Validation Checklist

Every packet should include a checklist. Use relevant items:

- [ ] Required files or artifacts exist.
- [ ] Targeted unit or integration tests pass.
- [ ] `npm test` passes when source or tests changed.
- [ ] `npm run build` passes when frontend changed.
- [ ] `npm run test:browser` passes when workflows or layouts changed.
- [ ] Packets that touch guided levels run `npm run lint:levels` and either resolve any new errors or surface them for owner review.
- [ ] Guided level count, order, and documentation agree.
- [ ] Toolbox restrictions match the intended curriculum path.
- [ ] Reference solutions still solve authored non-human guided levels.
- [ ] Demo Blockly illustrates structure without giving away the exact solution.
- [ ] Level win conditions require the mechanic the lesson claims to teach.
- [ ] Free-play setup still supports PvP, PvCPU Easy, PvCPU Tactical, team-size selection, and map selection.
- [ ] Accessibility expectations are covered or documented.
- [ ] Static Vite build behavior is preserved.
- [ ] No unrelated files were changed.
- [ ] If the packet changed behavior described in a subsystem note, the note still reads true post-change (or the conflict was surfaced and approved).
- [ ] Final report lists commands run and any remaining risks.

## Stop Conditions

Packets should tell the implementing agent to stop and ask for review if:

- the work requires changing the canonical learning model or one-action-per-turn execution contract
- docs and source disagree in a way that changes scope
- a level fix requires broad campaign redesign beyond the named levels
- the only fix requires broad unrelated churn
- validation fails in a way that changes the packet scope
- a dependency, workflow, or deployment choice has meaningful tradeoffs not covered by the packet
- a UI or Blockly change could mislead students about game rules or boolean semantics
- production deployment or repository settings changes are needed
- the packet change invalidates a statement in a `docs/subsystems/*.md` note and the corrected wording requires pedagogy, architecture, or contract judgment beyond the packet scope
