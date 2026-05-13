# Packet Creation Guidance

Use this guidance when creating Browser Battlegorithms development packets for smaller, faster, or cheaper implementation agents.

The goal is to make each packet a clear work order plus a guardrail contract. A packet should tell the implementing agent what to do, what not to decide, where project truth lives, how to validate the result, and when to stop for integration-owner review.

## Packet Location And Naming

- Put implementation packets in `docs/development/`.
- Use sequential names such as `plan-01-guided-level-contract-repair.md`.
- Keep `docs/development/README.md` updated when adding, completing, or superseding a packet.
- Use `docs/development/00-mini-packet-agent-starting-prompt.md` when starting a lower-cost implementation thread.
- Progress reports should go under `reports/development/<packet-name>/progress.md` unless the packet states otherwise.

## Packet Metadata

Every packet should start with metadata:

- Packet id:
- Packet title:
- Status: draft / ready / in-progress / complete / superseded
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
