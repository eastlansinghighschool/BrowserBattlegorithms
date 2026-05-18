# Plan 48: Area Freeze Cooldown And Status Chip

## Packet Metadata

- Packet id: plan-48
- Packet title: Area Freeze Cooldown And Status Chip
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: implementation / rules / UI / docs / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing freeze radius, frozen duration, scoring/round reset, Blockly block availability, NPC behavior strategy beyond readiness checks, or broad guided-level balance
- Expected artifacts:
  - configurable area-freeze cooldown constant
  - core readiness helper used by Blockly, turn engine, and CPU logic
  - team-level cooldown state that makes freeze available again after the configured turn interval
  - compact DOM status chip using a blue-white snowflake icon instead of the word "Freeze" as the primary label
  - updated block/tooltips/copy/docs/tests
  - progress report
- Progress report folder: `reports/development/plan-48-area-freeze-cooldown-and-status-chip/`
- Progress report file: `reports/development/plan-48-area-freeze-cooldown-and-status-chip/progress.md`

## Packet Summary

Goal: Change Area Freeze from a once-per-round team resource into a cooldown resource. Freeze starts ready, using it on round turn `T` makes it unavailable until turn `T + AREA_FREEZE_COOLDOWN_TURNS`, and it becomes ready again starting on that turn. Add a compact UI status chip so students can see whether the team freeze is ready or how many turns remain.

Non-goals:

- Do not change the freeze effect radius.
- Do not change how long runners stay frozen.
- Do not add the board pulse/flash/frozen-runner badge visuals; Plan 49 owns those.
- Do not redesign guided levels in this packet. If guided balance changes are discovered, report them as follow-up.
- Do not change one-action-per-turn Blockly semantics.
- Do not deploy.

Depends on:

- Current area-freeze implementation in `src/core/turnEngine.js`.
- Current readiness conditions in `src/core/conditions.js`.
- Current UI mode and scoreboard/control surfaces.

Blocks:

- Plan 49 board-level freeze effect visualization.
- Any late guided level that wants multiple timed freeze opportunities.

Why this packet exists:

The current one-shot freeze rule is legible, but it makes late-game or Free Play strategy less dynamic. A cooldown keeps the readiness-check lesson while giving students a richer timing problem: "Is freeze ready now, or should my strategy wait/support until it recharges?" The compact chip makes the invisible resource state visible without crowding the board or Blockly workspace.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/constants.js`
- `src/core/turnEngine.js`
- `src/core/setup.js`
- `src/core/conditions.js`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/blockly/blocks.js`
- `src/ui/scoreboard.js`
- `src/ui/controls.js`
- `src/ui/gameStateUI.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/conditions.test.js`
- `tests/unit/narration-event-log.test.js`

Do not redefine:

- Area Freeze remains a team resource.
- The readiness block should read current game state; it should not inspect Blockly state.
- Freeze action still consumes the runner's one action for that turn.
- Round reset and level/match reset make the resource ready.
- Static Vite deployment must remain unchanged.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/GameSpecification.md` sections 2.3, 4.1, and 4.2
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/constants.js`
- `src/core/turnEngine.js`
- `src/core/setup.js`
- `src/core/conditions.js`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/blockly/blocks.js`
- `src/ui/scoreboard.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/conditions.test.js`

Use `rg "teamAreaFreezeUsed|FREEZE_OPPONENTS|IF_AREA_FREEZE_READY|BOOLEAN_AREA_FREEZE_READY|freeze_already_used|Freeze:" src tests docs` before editing.

## Scope

### In Scope

- Add a configurable cooldown constant, initially `AREA_FREEZE_COOLDOWN_TURNS = 10`.
- Replace or augment the boolean `teamAreaFreezeUsed` model with state that can answer "ready now?" and "turns remaining?"
- Use the existing global round `currentTurnNumber` for cooldown timing:
  - used on turn 10 => ready again starting on turn 20
  - ready when `currentTurnNumber >= nextAvailableTurn`
- Add a shared readiness helper so Blockly conditions, turn-engine execution, CPU decisions, and UI all agree.
- Update unavailable-resource event reason/prose from one-shot wording to cooldown wording where needed.
- Add a compact snowflake status chip near existing board/game status controls.
- Update docs and tests.

### Out Of Scope

- Board pulse/flash/frozen badges.
- Changes to freeze radius or frozen duration.
- New Blockly blocks.
- New NPC behavior families.
- Guided level redesign.
- Deployment.

### Files And Areas Likely Touched

- `src/config/constants.js`
- `src/core/state.js`
- `src/core/setup.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/blockly/blocks.js`
- `src/ui/scoreboard.js` or adjacent status/control UI module
- `src/assets/styles/`
- `src/ui/narration.js`
- `src/ui/coachingNarration.js`
- `src/ai/learningMoments.js` if reason names change
- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- relevant unit/browser tests
- `reports/development/plan-48-area-freeze-cooldown-and-status-chip/progress.md`

## Product Decisions

### Decision 1: Cooldown Timing Uses Round Turn Number

Use `state.currentTurnNumber`, not individual runner turns or frame time.

Required behavior:

- If a team uses freeze on turn `T`, set its next available turn to `T + AREA_FREEZE_COOLDOWN_TURNS`.
- The team can use freeze again when `state.currentTurnNumber >= nextAvailableTurn`.
- With the default cooldown of 10, use on turn 10 means ready on turn 20.

Rationale:

Students already see turn number in the UI. Tying cooldown to that number gives a clear mental model and avoids hidden per-runner accounting.

### Decision 2: Snowflake Chip, Not Word Label

The visible chip should use a blue-white snowflake icon as the compact primary label, not the word "Freeze." The icon can be the Unicode snowflake `❄` if it renders cleanly across the HTML surface. If testing shows poor rendering or accessibility issues, use a simple CSS/text fallback while keeping the accessible name.

Required behavior:

- Ready state: snowflake icon plus `Ready`.
- Cooling state: snowflake icon plus remaining turns, e.g. `7 turns`.
- The accessible label must include the word "Area Freeze":
  - `Team 1 Area Freeze is ready`
  - `Team 1 Area Freeze available in 7 turns`
- Do not rely on icon/color alone.

Rationale:

Horizontal space is scarce. The icon aligns with the later frozen-runner board badge while the accessible label preserves clarity.

### Decision 3: Visibility Is Contextual

Show the chip only when Area Freeze matters.

Required behavior:

- Guided levels: show when the current guided level toolbox includes `FREEZE_OPPONENTS`, an Area Freeze readiness block, or the advanced boolean Area Freeze readiness value.
- Free Play: show because freeze is available in the Free Play toolbox.
- PvP: show both teams' chips.
- PvCPU: show the player team's chip; optionally show CPU team's chip only if it is already natural in the current scoreboard layout and does not add clutter.

If the implementer finds a simpler consistent display rule that is less brittle, stop and report before choosing it.

## Implementation Requirements

### Requirement 1: Core Cooldown State

Required behavior:

- Add state that tracks each team's next Area Freeze available turn.
- Freeze starts ready at match, display setup, level start, and round reset.
- A successful freeze use sets next available turn to `currentTurnNumber + AREA_FREEZE_COOLDOWN_TURNS`.
- An unavailable freeze attempt does not extend or reset the cooldown.
- Failed/blocked movement, scoring, and collision behavior are unchanged.

Constraints:

- Prefer adding helper functions over duplicating cooldown math:
  - `isAreaFreezeReady(state, teamId)`
  - `getAreaFreezeTurnsRemaining(state, teamId)`
  - `markAreaFreezeUsed(state, teamId)`
- Keep compatibility with any existing consumers of `teamAreaFreezeUsed` only if it meaningfully reduces churn. Otherwise migrate the state clearly and update tests/docs.

### Requirement 2: Runtime Consumers Agree

Required behavior:

- `If Area Freeze Is Ready` and the boolean Area Freeze readiness block use the shared helper.
- `Freeze Opponents` action uses the shared helper before applying the effect.
- Free Play Easy/Tactical CPU only chooses freeze when the shared helper says ready.
- Resource-unavailable event fires when a runner tries freeze during cooldown.

Constraints:

- Do not let CPU logic use stale boolean checks.
- Do not let Blockly readiness and action execution disagree on boundary turns.

### Requirement 3: Compact Status Chip

Required behavior:

- Add a compact DOM status chip near the existing board status / turn controls.
- The chip renders ready vs cooldown state for the applicable team(s).
- It updates after freeze use, turn advancement, round reset, level reset, and mode switch.
- It is keyboard/screen-reader understandable through text/ARIA, not only visual styling.
- The visual label uses the snowflake icon plus short state text, not `Freeze:`.

Recommended examples:

```text
❄ Ready
❄ 7 turns
T1 ❄ Ready
T2 ❄ 4 turns
```

Constraints:

- Keep the chip small enough not to worsen Chromebook-width layouts.
- Do not place it inside Blockly.
- Do not add a modal or toast.

### Requirement 4: Copy And Docs

Required updates:

- Update block tooltips from "once per team each round" to cooldown language.
- Update narration/coaching strings that say "already used" if the new reason is cooldown-based.
- Update `docs/GameSpecification.md`.
- Update `docs/subsystems/turn-engine.md`.
- Update `docs/subsystems/ui-mode-contract.md` to mention the new resource chip.
- Review `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`, `docs/TeacherGuide.md`, and `docs/TeacherFacilitationKit.md` for "one-shot" or "one-time" freeze language. Update if now false.

Constraints:

- Do not over-explain cooldown in early guided copy unless the level uses freeze.
- Preserve AP CSA framing around resource-readiness checks.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js tests/unit/narration-event-log.test.js tests/unit/narration-templater.test.js tests/unit/learning-moments.test.js tests/unit/coaching-narration.test.js
npm run lint:levels
npm test
npm run build
npx playwright test tests/browser/guided-ui.spec.js --reporter=line
npm run test:browser
```

Use targeted tests first while iterating. Run the broader commands before final report because this packet changes core rules and visible UI.

## Validation Checklist

- [ ] Freeze starts ready.
- [ ] Use on turn `T` makes the resource unavailable through turn `T + cooldown - 1`.
- [ ] Freeze is ready again starting on turn `T + cooldown`.
- [ ] A second successful use advances the next available turn again.
- [ ] Unavailable attempts do not extend cooldown.
- [ ] Round reset makes freeze ready immediately.
- [ ] Level/match reset makes freeze ready immediately.
- [ ] Blockly readiness blocks agree with action execution.
- [ ] CPU logic does not choose freeze while cooling down.
- [ ] Status chip shows ready/cooldown and updates after turns/resets/mode switches.
- [ ] Snowflake chip has an accessible name containing "Area Freeze."
- [ ] Relevant docs no longer describe freeze as once per round unless explicitly discussing old behavior.
- [ ] Targeted unit tests pass.
- [ ] `npm run lint:levels` passes or only reports documented pre-existing warnings.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Browser tests pass or any unrelated flakes are documented with focused reruns.
- [ ] Progress report lists gameplay/balance risks for freeze-heavy guided levels.

## Stop Conditions

Stop and report for owner review if:

- Cooldown timing cannot be made clear with existing `currentTurnNumber`.
- Existing guided levels become materially easier/harder and require redesign.
- The compact chip causes obvious responsive layout regressions.
- The snowflake icon renders poorly enough that a fallback decision is needed.
- Any subsystem note besides `turn-engine.md` and `ui-mode-contract.md` becomes untrue.
- Tests reveal hidden assumptions that freeze is permanently spent for a whole round.
