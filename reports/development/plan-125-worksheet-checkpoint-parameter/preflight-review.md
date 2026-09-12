# Plan 125 — Preflight Review

**Date:** 2026-09-12
**Reviewer:** orchestrator
**Verdict:** **approved to proceed, with one design decision the plan did not make and three smaller corrections.**
**Packet status:** stays `in-progress`.

## Summary

The plan is well-shaped and reads the packet accurately. Module boundaries are right, the pure
parse/resolve split matches `devGuidedLevelLink.js`, the three traps (search-only, `app.state.levels`
only, partial success) are all named and carry tests, and the zero-cost-when-absent requirement is
treated as a negative control rather than an afterthought.

The one real gap is the **reminder's lifetime**, which the plan places but never conditions. That is
the decision that determines whether the reminder does the job it exists for. Everything else below
is small.

## R1 — The reminder needs a completion condition, and it is not `activeLevelResult`

The plan says the reminder renders "in the student lesson card below `resultMessage`." That is a
*position*, not a *condition*, and the two behave very differently here.

`renderResultBannerMessage` is already gated — it returns `""` unless
`activeLevelResult === PASSED` (`src/ui/levels.js:570-575`), so **the marker is correct by
construction and needs nothing**. The surrounding lesson card is not gated. A reminder rendered
there without its own condition appears the moment the student *enters* a checkpoint level, which
breaks F4, the packet's whole reason for firing on completion rather than entry.

**But the obvious fix is also wrong.** Gating the reminder on `activeLevelResult === PASSED` gives
it exactly the same lifetime as the marker, which makes it redundant — and worse, `activeLevelResult`
is reset to `NONE` on level reset (`src/core/levels.js:226`, `:332`, `:377`, `:407`). So a student
who passes a checkpoint level and immediately hits reset to chase a second star **loses the
reminder**, which is precisely the student the reminder exists for. The requester's stated concern
was the student who looked away; the second-attempt student is the same case.

**Required:** gate the reminder on *"this level has been passed at least once in this tab session"* —
a fresh in-memory set (`worksheetCheckpointsReached` or similar), added when a checkpoint level
reaches `PASSED`, surviving reset, and cleared only by the tab ending.

**Do not use `state.levelProgress[levelId] === PASSED` for this.** That is durable progress persisted
to `localStorage`, so it would surface a reminder for a level the student passed last week under a
worksheet that is no longer on their desk. That is D1's stale-configuration failure arriving through
a different door, and D1 is the position this packet argued hardest for.

So there are three session-scoped structures, and they should be kept distinct rather than collapsed:
the parsed checkpoint set, the reached set, and the dismissed set.

## R2 — The reminder must not borrow `.lesson-project-indicator`

The plan says the reminder reuses `.lesson-project-indicator`, and *also* that
`.lesson-worksheet-reminder` gets scoped styles. Settle it in the second direction.

"Reuse the existing patterns rather than inventing a third notice idiom" meant the **interaction
shape** — a persistent card with a dismiss control — not the identity class. Sharing the class has
two concrete costs. Project levels L23-L28 and L29-L37 already render
`.lesson-project-indicator`, so a project level that is also a worksheet checkpoint would show two
visually identical cards meaning different things. And any future restyle of the project indicator
would silently restyle the worksheet reminder, with nothing to catch it.

Give the reminder its own class. Sharing a base style or a CSS custom property is fine; sharing the
identity is not.

## R3 — Drop "paper" from the marker copy

The proposed marker reads *"Check your paper worksheet!"*. The packet's load-bearing constraint is
that **BB never learns anything about the worksheet** — and the medium is part of that. CourseVGD's
sheet is paper; a different teacher's might be a doc, a slide, or a whiteboard, and the parameter is
explicitly designed so that teacher can use it without BB knowing.

"Check your worksheet" costs nothing and keeps the promise. The packet's own prose says "paper"
throughout because it is describing CourseVGD's case; the *product copy* should not.

The rest of the copy is fine, and the exclamation mark matches the existing banner voice
("Level passed! ★☆ — …").

## R4 — State fields belong in `createApp`, not assigned lazily

`initializeWorksheetCheckpoints` populating `app.state.worksheetCheckpoints` and friends is right,
but the fields should also be **declared in `createApp` with empty defaults** so the state shape is
the same whether or not the parameter is present. A field that exists only on some loads is a shape
that every reader has to guard against, and this packet's most common path by far is the one where
the parameter is absent.

This does not weaken R2's zero-cost rule — empty state fields are not reserved DOM.

## Accepted as proposed — do not change these

- The module boundary and the pure `parse` / `resolve` split. Matching `getDevGuidedLevelIdFromLocation`'s
  injectable shape is right and makes the tests cheap.
- Mounting the unknown-id notice in `#blockly-region` alongside `plan-118`'s `#storage-status`, and
  reusing the `.storage-status-dismiss` control. That *is* pattern reuse of the correct kind — the
  dismiss affordance is a shared control, not an identity.
- Creating the notice element only when there is something to say, rather than reserving DOM.
- Calling `initializeWorksheetCheckpoints` immediately after `initializeLevelState(app)`; the level
  list is populated by then.
- The unknown-id copy as ruled.
- Branch C advisor posture.
- Respecting `plan-126`'s in-flight scope and owning the `package.json` registration this round.
  (`plan-126` has since completed without touching `package.json`, so that conflict never
  materialised — proceed as planned.)

## One thing to decide and state rather than let fall out

The unknown-id notice mounts in `#blockly-region`, which is visible in Free Play, while D3 scopes
the feature to guided levels. Showing a malformed-link notice in Free Play is defensible — the link
is malformed regardless of mode — but D3 says the parameter "must not alter" Free Play. Pick one,
say which in the docs, and test it. Either answer is acceptable; an unstated one is not.

## Required tests, beyond what the plan lists

The plan's test list is right in outline but too coarse in one place. Add explicitly:

- **The reminder does not appear on entry to a checkpoint level**, and does appear after it is
  passed. This is R1's condition and is the single most valuable test in the packet.
- **The reminder survives a level reset** and is still present for a second attempt.
- The marker does **not** appear on completion of a non-checkpoint level.
- No new field reaches the usage export (`D4`) — a cheap assertion against the export payload, not
  an eyeball.

## Acceptance for the next review

- The reminder is gated on session-scoped completion, not on `activeLevelResult` and not on
  `levelProgress`.
- The reminder has its own CSS class.
- Marker copy does not name the medium.
- Worksheet state fields are declared in `createApp`.
- The Free Play disposition is stated and tested.
- The four tests above exist, plus everything the packet already required.
- `npm test` passes with the new file registered; `npm run build` passes; `git status` clean.
- Packet returns to `delivered`.

## Stop conditions, unchanged from the packet, plus one

- If gating the reminder on session completion turns out to need a new hook in `src/core/levels.js`
  rather than a read of existing state, **stop and report before adding it.** A UI feature reaching
  into the turn/level core is a bigger change than this packet authorizes, and there may be an
  existing signal that does the job.
