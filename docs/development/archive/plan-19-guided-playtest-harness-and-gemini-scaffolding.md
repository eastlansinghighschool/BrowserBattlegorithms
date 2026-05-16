# Plan 19: Guided Playtest Harness And Gemini Scaffolding

## Packet Metadata

- Packet id: plan-19
- Packet title: Guided Playtest Harness And Gemini Scaffolding
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-13
- Packet type: implementation / testing / generated-local / docs
- Mutation level: source-code / tests / generated-local
- Approval gate: none
- Expected artifacts:
  - dev-only guided-level deep-link support
  - focused tests proving dev-only deep-link behavior and safe invalid-id handling
  - reusable Gemini playtest prompt for Plan 06
  - compact per-level context files for Plan 06
  - Plan 06 report folder scaffold
  - progress report
- Progress report folder: `reports/development/plan-19-guided-playtest-harness-and-gemini-scaffolding/`
- Progress report file: `reports/development/plan-19-guided-playtest-harness-and-gemini-scaffolding/progress.md`

## Packet Summary

Goal: Prepare a lightweight local-dev playtest harness so Plan 06 can be run level-by-level by Gemini or another browser-capable playtester without repeatedly unlocking levels and navigating the level picker.

Non-goals:

- Do not change production or static GitHub Pages behavior.
- Do not change guided progression, unlock logic, localStorage progress, level definitions, Blockly semantics, or game rules.
- Do not add a public student-facing shortcut, feature flag UI, or help-page mention.
- Do not run the Plan 06 playtest in this packet.
- Do not implement tournament mode, replay, turn trace, Java preview, or new assessment features.
- Do not install dependencies.
- Do not deploy.

Depends on:

- Plans 01-18 complete.
- Plan 06 revised to consume the artifacts created here.

Blocks:

- Efficient repeated Plan 06 browser playtesting.
- Resumable Gemini campaign triage with small per-level contexts and per-level reports.

Why this packet exists:

Plan 06 needs to test the revised guided campaign as a student experience, but repeated browser-agent navigation through locked progression and the level picker wastes context and time. A dev-only deep link plus reusable playtest scaffolding lets Gemini start directly at the next target level, write a bounded report, and resume later without bloating context. The shortcut is intentionally local-dev-only so classroom deployment and student progression remain untouched.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
  - `docs/development/plan-06-guided-playtest-triage.md`
  - `docs/development/project-sequence-decisions.md`
  - `docs/development/project-level-map.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `vite.config.js`
  - `playwright.config.js`
  - `src/`
  - `tests/`
- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/ui-mode-contract.md`
  - `docs/subsystems/turn-engine.md`
  - `docs/subsystems/file-pipelines.md`
  - `docs/subsystems/usage-and-admin.md`

Required product contracts:

- The app remains a static Vite deployment.
- The deep link is available only in local dev mode.
- Production builds must ignore the deep-link parameter or fragment.
- The shortcut must not mutate guided unlock progress or pretend a student earned access.
- Guided mode still uses the required `On Each Turn` block and one-action-per-turn behavior.
- Plan 06 scaffolding should help a playtester understand what came before without exposing exact solutions.

Do not redefine:

- Guided level order, IDs, project membership, or project names.
- Guided unlock progression.
- Student-facing navigation, tutorial, or help copy.
- Usage export schema or admin analyzer behavior.
- Any subsystem runtime contract.

## Required Reading

Read these first:

- `docs/development/plan-06-guided-playtest-triage.md`
- `docs/packet-creation-guidance.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/development/project-level-map.md`
- `docs/development/project-sequence-decisions.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/subsystems/blockly-workspace.md`
- `src/config/levels/index.js`
- `src/config/levels/manifest.js`
- `src/core/levels.js`
- `src/ui/levels.js`
- `src/main.js`
- `tests/browser/helpers.js`
- `tests/browser/guided-ui.spec.js`
- `tests/unit/guided-level-contracts.test.js`

Use `rg "UNLOCK_ALL|guided level|level picker|currentGuided|selectLevel|startLevel|GUIDED_LEVEL"` from the repository root if names have moved.

Optional/contextual:

- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/usage-and-admin.md`
- `tests/browser/guided-play.spec.js`

## Scope

### In scope

- Add a dev-only guided-level URL shortcut.
- Prefer canonical query parameter `?devGuidedLevel=<levelId>`.
- Also support `#devGuidedLevel=<levelId>` if it can be done cleanly with the same parser.
- Select Guided Levels mode and load the requested guided level when the shortcut is valid.
- Allow the shortcut to bypass lock UI for the current local-dev session only.
- Do not write guided progress/unlock state to localStorage as part of the shortcut.
- Add tests for valid id, invalid id, and dev-only gating.
- Create Plan 06 scaffolding files under `reports/development/plan-06-guided-playtest-triage/`.
- Create compact context files for each guided level from current level metadata/docs.
- Create a reusable Gemini prompt that tells Gemini how to find the next level report to write.

### Files and areas likely touched

- `src/main.js` or a small helper imported by it
- `src/ui/levels.js` or the local level-selection path it already owns
- Optional new helper such as `src/ui/devGuidedLevelLink.js`
- `tests/unit/` for parser/gating tests if a pure helper is added
- `tests/browser/` for the dev deep-link smoke test
- `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`
- `reports/development/plan-06-guided-playtest-triage/progress.md`
- `reports/development/plan-06-guided-playtest-triage/level-context/*.md`
- `reports/development/plan-06-guided-playtest-triage/levels/.gitkeep` or equivalent placeholder if needed
- `reports/development/plan-06-guided-playtest-triage/project-arcs/.gitkeep` or equivalent placeholder if needed
- `reports/development/plan-19-guided-playtest-harness-and-gemini-scaffolding/progress.md`

### Out of scope

- Production deep-link support.
- Public student URL routing.
- Changes to authored levels, project metadata, toolboxes, maps, or reference solutions.
- Changes to localStorage guided progress.
- Changes to usage export/import.
- Changes to Free Play setup.
- New dependencies.
- Deployment or GitHub configuration changes.
- Running the full Plan 06 campaign playtest.

## Implementation Requirements

### Requirement 1: Dev-only guided-level shortcut

Required behavior:

- In local dev mode, `http://localhost:<port>/?devGuidedLevel=<levelId>` opens the app in Guided Levels mode with the matching guided level selected.
- If implemented, `http://localhost:<port>/#devGuidedLevel=<levelId>` behaves the same way.
- The shortcut must work even if the selected level would normally be locked.
- The shortcut must not mark the selected level or prior levels as passed/unlocked in persisted progress.

Constraints:

- Gate the behavior behind Vite dev mode, e.g. `import.meta.env.DEV`.
- Keep the parser small and deterministic.
- Avoid broad rewrites of mode selection or guided progression.
- Do not expose a visible UI control for this shortcut.
- Do not rely on `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING`.

Edge cases:

- Missing parameter: normal app behavior.
- Unknown level id: normal app behavior plus a dev-only console warning or non-blocking diagnostic.
- Valid optional lab id: may load if it is part of guided definitions; document behavior.
- Production build: parameter is ignored and normal app behavior occurs.

Expected artifact or code change:

- Small source change plus focused tests.

### Requirement 2: Focused validation for shortcut behavior

Required behavior:

- Add tests that prove the parser/gate accepts valid `devGuidedLevel` values and rejects missing/invalid values safely.
- Add a browser smoke test or equivalent integration test that starts local dev with a valid level id and observes the selected guided level title/id.
- Add a production-gating assertion. This may be a pure unit test around the helper or a build-time check, depending on local patterns.

Constraints:

- Keep tests focused on the shortcut. Do not retest the whole level picker.
- Do not add this shortcut to student-facing browser journeys.
- Do not make tests depend on all guided levels being unlocked.

Edge cases:

- If current browser test helpers cannot observe selected level cleanly, add the smallest reasonable test hook or assertion target, and document why.
- If proving production-gating through Playwright is too expensive, use a unit-level helper test plus `npm run build`.

Expected artifact or code change:

- Updated or new tests, and validation commands recorded in the progress report.

### Requirement 3: Reusable Gemini prompt for Plan 06

Required behavior:

Create `reports/development/plan-06-guided-playtest-triage/gemini-prompt.md`.

The prompt must tell Gemini to:

- Use the app like a student.
- Read only the reusable prompt, `progress.md`, and the current level context unless blocked.
- Determine the next level by finding the first missing per-level report in level order.
- Open the level through the dev deep-link URL.
- Attempt the level up to the specified maximum attempts.
- Avoid source, tests, fixtures, and reference solutions before attempting.
- Write one bounded report file for the level.
- Update `progress.md` after writing the report.
- Stop on the packet's stop conditions.

Constraints:

- Keep the prompt reusable across many invocations.
- Do not paste large docs into the prompt.
- Point to context files instead of expanding all campaign context inline.
- Include the exact report template Gemini should fill.

Edge cases:

- If Gemini cannot access the browser or the app fails to launch, the prompt should tell it to write a blocker note rather than improvising source inspection.

Expected artifact or code change:

- `gemini-prompt.md`.

### Requirement 4: Compact per-level context files

Required behavior:

Create one context file per guided level under `reports/development/plan-06-guided-playtest-triage/level-context/`.

Each file should include:

- level number
- level id
- level title
- level type: ordinary / challenge / project step / project capstone / optional
- primary learning goal
- new concept or "no new tool"
- assumed prior concepts
- project id and project position when applicable
- what Gemini should watch for
- canonical local-dev URL using `?devGuidedLevel=<levelId>`
- expected report path under `reports/development/plan-06-guided-playtest-triage/levels/`

Constraints:

- Keep each file compact. Aim for 150-250 words, not a full level design document.
- Do not include exact reference solutions.
- Do not reveal source-only implementation details that a student would not know.
- Use current level metadata/docs as source truth.

Edge cases:

- If a level's metadata and docs disagree, create the context from current source metadata, then flag the disagreement in the Plan 19 progress report.

Expected artifact or code change:

- Level context files for all guided levels, including the optional random lab if currently listed as a guided optional level.

### Requirement 5: Plan 06 report scaffold

Required behavior:

Create or update the Plan 06 working folder with:

- `progress.md` — tracks overall Plan 06 status and tells Gemini how to find the next missing level report.
- `levels/` — per-level report folder.
- `project-arcs/` — project arc report folder.
- `usage-smoke/` — optional usage/admin smoke evidence folder if generated evidence is retained.

`progress.md` should include:

- ordered level checklist with report paths
- current run status
- instructions for marking a level done, blocked, or deferred
- space for a pilot decision memo once all reports are complete

Constraints:

- Do not pre-fill playtest findings.
- Use placeholders/checklists only.
- Keep generated evidence out of source directories.

Edge cases:

- If the progress folder already exists with human notes, preserve them and append/update carefully instead of overwriting.

Expected artifact or code change:

- Plan 06 working folder scaffold.

### Requirement 6: Documentation and handoff report

Required behavior:

- Write the Plan 19 progress report.
- List files changed/created.
- List commands run.
- Note the exact dev deep-link format.
- Note whether hash fragment support was implemented.
- Note any known limitations for Plan 06.

Constraints:

- Do not claim Plan 06 has been run.
- Do not mark levels as playtested.

Expected artifact or code change:

- Plan 19 progress report.

## Work Plan

1. Inspect current level selection, guided progression, and browser test helper patterns.
2. Implement the smallest dev-only guided-level shortcut.
3. Add focused tests for parser/gating and browser-level loading.
4. Run targeted tests, then broader validation.
5. Generate Plan 06 Gemini prompt, level-context files, and report scaffold.
6. Write the Plan 19 progress report with commands, artifacts, and risks.

## Commands

Run from the repository root:

```powershell
npm test
npm run build
npm run test:browser
```

Targeted test commands may be run first if useful, but the final report should list the full validation actually completed.

## Validation Checklist

- [ ] Dev deep link works locally for a valid guided level id.
- [ ] Dev deep link selects Guided Levels mode and the requested level.
- [ ] Dev deep link can bypass locked UI without mutating persisted guided progress.
- [ ] Invalid level id does not crash the app.
- [ ] Production build ignores the shortcut or compiles it out.
- [ ] Tests cover parser/gating and at least one browser-level valid-id path.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser` passes, or any failure is documented with owner review.
- [ ] `gemini-prompt.md` exists and is reusable.
- [ ] Each guided level has a compact context file.
- [ ] Context files do not include exact reference solutions.
- [ ] Plan 06 `progress.md` exists and includes an ordered report checklist.
- [ ] `levels/`, `project-arcs/`, and `usage-smoke/` folders or placeholders exist as needed.
- [ ] No production deployment or GitHub configuration changes were made.
- [ ] No unrelated files were changed.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report if:

- Implementing the shortcut requires broad rewrites of guided progression or mode state.
- The only viable implementation mutates guided unlock progress or localStorage.
- Production gating cannot be made reliable.
- The shortcut would be visible to students in a production/static build.
- Current docs and source disagree about level order, ids, or project membership in a way that affects context-file generation.
- Browser tests cannot observe selected guided level state without adding broad test hooks.
- Validation fails in a way that changes the packet scope.
- A dependency, deployment, or GitHub workflow choice appears necessary.
- A subsystem note would become false and the correction needs owner judgment.
