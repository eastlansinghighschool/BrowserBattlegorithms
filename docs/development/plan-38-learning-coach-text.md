# Plan 38: Learning Coach Text

## Packet Metadata

- Packet id: plan-38
- Packet title: Learning Coach Text
- Status: draft — blocked on Plan 37 landing and on Open Decisions about cadence, gating, and delivery surface
- Owner/model: implementation agent, after Plan 37 lands and Open Decisions resolve
- Date: 2026-05-17
- Packet type: implementation / pedagogy / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before mutation — Open Decisions must be resolved
- Expected artifacts (preview):
  - prose templater per LearningMoment kind
  - cadence/cooldown policy implementation
  - toolbox/campaign-order gating so coaching doesn't reveal not-yet-introduced concepts
  - delivery surface (separate from Plan 36 aria-live? same surface with a "coaching" mode? — see Open Decisions)
  - settings toggle (default off in pilot)
  - unit and Playwright tests
  - progress report

## Packet Summary

Goal: Turn Plan 37's structured `LearningMoment` records into short, opt-in coaching messages that fire on teachable moments with disciplined cadence and curriculum-aware gating. Coaching messages are *interpretive* (they read student intent and suggest a programming move), so this packet is held to higher ethics than Plan 36 (factual narration): coaching must respect student agency, must not reveal solutions, must not suggest concepts the campaign hasn't yet introduced, and must not become wallpaper.

Non-goals:

- No new event kinds, no changes to the Plan 35 event log.
- No changes to the Plan 37 classifier's `LearningMoment` shape.
- No voice synthesis (Plan 39).
- No automatic level-skipping or progression changes based on coach output.
- No teacher dashboard surface (future work, separate packet).

Depends on:

- Plan 37 complete: `classifyTurn` emits `LearningMoment[]` per turn.
- Plan 36's narration delivery surface (or a sibling surface — see Open Decision 2).
- Toolbox-availability data per level (already in level configs).

Blocks:

- Classroom rollout of coaching mode.
- Future formative assessment tools that consume coach signals.

Why this packet exists:

Coaching narration is where the pedagogical leverage of the narration sequence cashes out. Plan 25b made the trace visible; Plan 36 made the state audible; this packet makes student-programming-failure-modes legible at the moment they happen. Codex's caution about interpretive narration is well-placed and gives this packet its shape: be sparse, be gated, be opt-in, never reveal solutions.

## Open Decisions

This packet cannot move to `ready` until the integration owner resolves:

### Decision 1: Cadence policy per moment kind

For each LearningMoment kind from Plan 37, the cadence policy decides when the coach actually speaks. Proposed defaults (owner confirms or amends):

| Moment kind | Cadence |
|---|---|
| `bounced` | First time per level attempt, then summarized at 3rd recurrence ("your ally has bounced 3 times this attempt") |
| `resource_no_readiness_guard` | Every time (this is a real error worth surfacing each occurrence) |
| `no_action_selected` | Every time *during slow-trace mode*, never during normal speed |
| `ignored_blocks_below_action` | First time per workspace edit (not per turn — this is a structural code shape, not a per-turn behavior) |
| `recurring_pattern` | Coach fires the summary once when the pattern crosses a threshold (3 occurrences) |
| `runner_index_unhandled` | First time per level attempt only |

### Decision 2: Delivery surface

Three options:

- **A:** Same aria-live region as Plan 36, with coach messages distinguished by a prefix ("Tip: ..."). Simple, one DOM surface. Risk: screen-reader users hear both factual and coaching as a single stream; can't suppress one without the other.
- **B:** Sibling aria-live region (separate id, `aria-live="polite"`, lower verbosity) plus a sibling visible strip below the factual one. Two DOM surfaces. Cleaner ethics separation.
- **C:** Visible-only delivery — a discreet tooltip near the workspace or board when a moment fires, no aria-live. Risk: invisible to screen-reader users; defeats accessibility-as-learning-aid argument.

Recommendation: B. Two surfaces, two settings toggles, screen-reader users can opt out of one without losing the other.

### Decision 3: Curriculum gating

Coaching messages may suggest specific Blockly blocks ("guard this with `Area Freeze Is Ready`"). The suggested block must already be in the current level's toolbox (or already mastered per the concept matrix). Options:

- **A:** Hard gate — if the suggested block isn't in the current level's toolbox, suppress the message entirely.
- **B:** Soft gate — fall back to a generic phrasing ("guard your freeze action with a readiness check") without naming the specific block.
- **C:** Tiered phrasing — every coach message has two phrasings: one that names the block (used when block is in toolbox) and one generic (used when not).

Recommendation: C. Two phrasings per message is a small authoring cost and gives the right student experience at every campaign stage.

### Decision 4: Settings model

Coaching mode default state across modes:

- Guided mode: default off (pilot baseline); teacher toggles on per session.
- Free play: default off; student toggles on if desired.
- Tournament mode (Plan 40 if ever built): forced off.

Owner confirms or amends.

## Authority And Contracts (preview)

- Plan 37's `LearningMoment[]` shape.
- Plan 36's narration delivery surface (or sibling per Decision 2).
- Per-level toolbox data from `src/config/levels/`.
- Concept matrix for "has this block been introduced yet?" lookups.

### Required product contracts:

- Coaching messages never reveal a reference solution.
- Coaching messages never suggest a block that hasn't yet appeared in the campaign for the current level.
- Coaching is opt-in. Default off in guided mode. Toggle in controls.
- Coaching surface is separable from accessibility narration (per Decision 2 recommendation).
- Coaching prose is questions or short observations, not imperatives where possible ("Did you mean to check `Area Freeze Is Ready` first?" not "Add `Area Freeze Is Ready`.").

## Implementation Requirements (preview)

### Requirement 1: Templater per moment kind

- For each LearningMoment kind in v1, two prose templates: one block-named (when toolbox allows), one generic.
- Templates are short (≤ 25 words).
- Templates are interpolated with kind-specific metadata (runner identifier, resource name, etc.).

### Requirement 2: Cadence/cooldown enforcement

- Per-level-attempt and per-match counters tracking moment-kind occurrences.
- Suppression based on the Decision 1 policy.
- Reset on level reset, level switch, mode switch.

### Requirement 3: Curriculum gate

- Per-message lookup of suggested block against the current level's toolbox.
- Fallback to generic phrasing when block is not yet introduced.

### Requirement 4: Delivery wiring

- Per Decision 2 recommendation: sibling aria-live region plus optional visible strip below the factual one.
- Single call site analogous to Plan 36's `announceLastTurn` — let's call it `announceCoachingMoments(app)`.
- Fires after Plan 37's classifier runs per turn.

### Requirement 5: Tests

- Unit tests per template (block-named and generic variants).
- Unit tests per cadence rule (firing and suppression cases).
- Unit tests per curriculum gate (in-toolbox and not-in-toolbox cases).
- Playwright assertions on coaching aria-live content after specific student-program-failure scenarios.

### Requirement 6: Settings

- New toggle in controls: "Coaching Mode" with description copy explaining what it does.
- Persisted to localStorage.
- Default off.

## Stop Conditions

- Plan 37 hasn't shipped.
- Open Decisions unresolved.
- A prose template would require interpretive claims the classifier can't substantiate.
- Cadence policy can't be implemented without persisting counters across non-trivial state transitions (e.g. level reset doesn't reset attempt counts somehow).

## Notes For Future Self

When promoting this packet to `ready`:

1. Resolve all four Open Decisions inline.
2. Lock the prose templates per moment kind (owner reviews phrasing for ethics, not just correctness).
3. Confirm Decision 2's surface choice is compatible with Plan 36's actual implementation.
4. Add `recurrenceState` storage decision: in `app.state` or in a module-level object? Plan 37 left this open; Plan 38 decides where it lives.

The prose authoring is the dominant cost in this packet. Build the structural plumbing first, then iterate on phrasing with classroom feedback.
