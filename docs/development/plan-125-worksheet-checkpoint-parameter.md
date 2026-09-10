---
id: plan-125
title: "Worksheet Checkpoint Querystring Parameter"
status: ready
depends_on: []
gate: "before mutation: owner approves the prompt shape (non-blocking marker on the level-result surface plus a per-level dismissible reminder), the parameter name, and the teacher-facing failure surface for unknown ids. See the Gate section."
superseded_by: null
resolution: null
summary: >-
  Add a querystring parameter that marks guided levels where the app should tell the student to look at their paper worksheet. Accepted from an incoming CourseVGD proposal, with three corrections: this is the first production querystring parameter in the app rather than an extension of an existing one, the reader must consume location.search only because the GAS Stage 1 design reserves the URL fragment for a channel nonce, and unknown ids must fail loudly to the teacher without becoming a student-facing failure. BB never learns what the worksheet says.
---
# Plan 125: Worksheet Checkpoint Querystring Parameter

## Packet Metadata

- Packet id: `plan-125`
- Packet title: Worksheet Checkpoint Querystring Parameter
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-10
- Packet type: implementation (feature)
- Mutation level: source-code (new UI module, level-result surface), tests, docs
- Approval gate: before mutation — see Gate below.
- Depends on: nothing. Deliberately independent of the GAS work.
- Blocks: nothing.
- Expected artifacts:
  - a new querystring reader module under `src/ui/`
  - a worksheet marker on the level-result surface and a per-level reminder
  - a teacher-facing load-time notice listing any unknown ids
  - unit tests for parsing, id resolution, and the unknown-id path
  - a new section in `docs/subsystems/ui-mode-contract.md`
  - progress report
- Progress report folder: `reports/development/plan-125-worksheet-checkpoint-parameter/`
- Progress report file: `reports/development/plan-125-worksheet-checkpoint-parameter/progress.md`

## Packet Summary

Goal: a teacher composes a URL naming the guided levels their paper worksheet asks about, and the app tells the student to look at the paper when they finish one of those levels.

Non-goals — these are requirements, not omissions:
- **BB never learns what the worksheet contains.** No question text, no answers, no rubric.
- **BB collects nothing.** No answer capture, no new usage event, no export field, no identity.
- **No coupling to any course.** No CourseVGD-specific behaviour, no course id, no teacher id.
- No change to level content, star criteria, progression, or turn semantics.
- No GAS work. See "The GAS coupling" below for what is deferred and why.

## Provenance

This packet originates in an incoming proposal from the CourseVGD repository, dated 2026-09-10:
`C:\AI\CourseVGD\reports\orchestration\outgoing-proposal-bb-worksheet-checkpoint-param.md`.
CourseVGD is the requester, not the implementer, and explicitly framed the note as something this
repository may adopt, refuse, or reshape. The orchestrator response is
`reports/orchestration/coursevgd-worksheet-checkpoint-response.md`.

## Why this is worth building

The argument is the requester's and it is the right one. The CourseVGD worksheet currently tells
students to pause at each named checkpoint when they finish that level. That asks a student to
track which level they are on and remember to stop — while they are learning a new programming
environment. **The software is in a much better position to know that than the student is.** The
feature removes a coordination task from the person least able to carry it.

The second reason is architectural and is the requester's too: the zero-coupling property makes BB
**an educational tool that can be attached to any piece of paper**. A different course targets
different levels; a teacher outside this fleet writes their own sheet and composes their own URL
without BB knowing anything about it. The constraint is load-bearing: **if BB ever needs to know
what the worksheet says, the design has gone wrong.**

## Findings from verification — read these before designing

The proposal offered three findings and asked BB to verify rather than trust them. All three were
checked against source. Two hold; one is wrong in a way that changes the packet.

### F1 — "The mechanism already exists" is only half true, and the other half matters

`src/ui/devGuidedLevelLink.js` does read a querystring parameter. But it is loaded and called
inside `if (import.meta.env.DEV)` at `src/main.js:217-220`, so **it does not exist in production
builds at all**. A repository-wide search for `URLSearchParams`, `location.search`, and
`location.hash` finds that one file and nothing else.

So this is not "extending an existing querystring reader." **`worksheetAt` would be the first
production querystring parameter in the application.** The code shape is reusable; the surface is
new. That is not a reason to refuse — it is the reason this packet has to define behaviour that
`devGuidedLevelLink.js` never needed: what happens on malformed input, what a teacher sees when
they get it wrong, and what happens when the app is embedded.

### F2 — Ids, not numbers: confirmed, and the stability argument is the strongest point in the proposal

Level ids are short and semantic (`move-to-target`, `reach-enemy-flag`, `barrier-detour`,
`sensor-barrier-branch`, `freeze-support`); the verbose strings are filenames. The decisive
argument is the requester's: **the worksheet is printed paper.** If a level is inserted next
semester and the URL says `?worksheetAt=2,6`, the prompts silently move to the wrong levels and the
paper still says what it said. Ids fail safely; numbers fail invisibly. Adopted.

**But the id namespace is not flat, and this is the implementation trap.** Level configs contain
nested ids for tutorial steps and challenge variants — `bughunt-22-trace`, `bughunt-28-fix`,
`level-21-advanced-layer`, `show-what-you-know-challenge`, `full-team-tactics-next`. A resolver
that searches for any object with a matching `id` will match these. `devGuidedLevelLink.js` avoids
it by searching `app.state.levels` specifically; do the same. And note that `bughunt-22-trace` is
exactly the kind of string a teacher would plausibly copy out of a level file, so it must land in
the unknown-id path rather than resolving to something unexpected.

### F3 — Read `location.search` only. Do **not** copy the hash fallback.

`devGuidedLevelLink.js` reads `location.search` and then falls back to `location.hash`. Copying
that shape here would be wrong. The GAS Stage 1 design has already ratified that **transient
secrets go in the URL fragment rather than the query string** — a per-page channel nonce delivered
in the fragment so it is not sent in the `Referer` header
(`reports/orchestration/gas-integration-commentary/review-claude.md:644`,
`review-synthesis.md:194`). The fragment is spoken for. A worksheet reader that also parsed the
hash would be reading a channel it has no business in, and would do so in exactly the deployment
where the fragment is carrying a secret.

`worksheetAt` is not a secret, so the query string is correct for it. Read `search`, and only
`search`.

### F4 — Fire on completion: confirmed, and the attachment point already exists

Confirmed for the requester's reason: the worksheet asks about what just happened, so a prompt at
level *entry* asks a student to reflect on something they have not done yet.

The surface already exists. `src/core/levels.js:466-500` sets `state.activeLevelResult` and
`mainGameState = LEVEL_RESULT`, and `src/ui/levels.js:572-604` renders the
`.level-result success` banner that already composes the star line and the humanized result reason.
That banner is the attachment point. **Do not build a new overlay.**

## Design positions

These are settled by this packet unless the gate rules otherwise.

### D1 — Do not persist the checkpoint list

The parsed list lives for the page session and is re-read from the URL on every load. It is not
written to `localStorage` and does not ride portable state.

Two reasons, both learned the hard way in this repository. `plan-119` spent an entire packet on the
cost of stale persisted state displacing current intent, and a worksheet configuration that
outlives its assignment is precisely that failure: a student opens a bare URL in March and gets
February's checkpoints, with nothing on screen explaining why. And `plan-118` established that
under an embedded deployment `window.localStorage` access may *throw* outright, so persistence is
not dependable in the environment this feature is most likely to be used in.

The framing that settles it: **worksheet targeting is assignment configuration, not student
preference.** Configuration belongs in the URL the teacher controls, not in student-side storage
they cannot see or clear. This is the same boundary `plan-123` V5 draws for skin choice, from the
other direction.

The accepted cost is that the prompt is lost if a student navigates away and returns via a bare
bookmark. State it in the docs; do not engineer around it.

### D2 — Unknown ids fail loudly to the teacher, never as a student-facing failure

The requester asked for loud failure on unknown ids and the request is right — a teacher with
printed sheets needs the mismatch discoverable in the room, not after the period. But *where* it
lands matters, and the requester did not have the classroom context to settle it.

Three requirements:

1. **The notice is a load-time, persistent, non-blocking banner** — the shape `plan-118`
   established for `#storage-status`. It names the unknown ids verbatim.
2. **It must not read as a student-facing failure.** A student handed a teacher's authoring error
   as a gameplay obstacle, mid-lesson, has been given a problem they cannot act on. Phrase it as a
   configuration notice about the link, not as something wrong with their work.
3. **A bad id must not suppress the good ones.** A URL with four valid ids and one typo still marks
   the four. Partial success is the correct behaviour; refusing the whole list because of one typo
   would convert a small authoring error into a silently unmarked worksheet.

The teacher is the first person to open the URL when they test it, which is what makes a load-time
banner sufficient — the URL becomes self-verifying at the moment it matters.

### D3 — Guided levels only

Worksheets target guided levels. The parameter has no meaning in Free Play and must not alter it.

### D4 — Collects nothing, and no new usage event

No event, no export field, no analyzer path, no fingerprint contribution. Note also that a
checkpoint-reached event would be **duplicate data**: `level.result` already records which levels a
student completed, so a teacher who wants that already has it. There is nothing to add and a clear
reason not to add it.

A per-level dismissal (see the Gate) is a UI acknowledgement that the student saw the reminder. It
is not an answer, not evidence, and is not recorded anywhere durable.

## The GAS coupling — deferred, and here is exactly what is deferred

The proposal noted the owner had mentioned a querystring-activated GAS embedded mode. **No such
mode exists or is specified anywhere in this repository** — plans 118-122 and the subsystem notes
define no embedded-mode parameter. This packet is genuinely the first.

The real coupling is different, and worth stating so a future thread does not rediscover it late.
Under the GAS shell the parent Apps Script page composes the child iframe URL (`Shell.html` sets
`frame.src`). A querystring on the parent `/exec` URL therefore **does not reach the child** unless
the shell forwards it. So a teacher-composed `?worksheetAt=...` will work against a plain Pages URL
and silently do nothing against a GAS URL until the shell forwards it.

That forwarding is a Stage 1 protocol concern and is **out of scope here**. It is recorded in
`docs/open-questions.md` with one design constraint attached: the requirement is generic, not
worksheet-specific. The shell should forward an **allowlisted set** of child-facing parameters —
not this one by name, and not an unbounded passthrough. The first repeats this conversation for
every future parameter; the second is an injection surface into the child URL.

Stage 1 proper is unwritten and blocked on Gates 1 and 2, so there is no packet to amend.
Recording the requirement now is the whole of the action available.

## Gate (before mutation)

Present to the owner and stop. All three are cheap to answer and expensive to get wrong once paper
is printed.

### 1. The prompt shape

Recommendation: **a non-blocking marker appended to the existing `.level-result success` banner,
plus a dismissible per-level reminder that persists until dismissed or the student leaves the
level.**

Not a blocking modal — the requester is right that a student mid-solve dismisses it without
reading. The reminder answers their concern about a student who looked away, and the dismissal
keeps it from becoming wallpaper: a persistent indicator that never clears stops being read within
a week. Tab-session scoped, following `state.storageNoticeDismissed` from `plan-118`; a reload
brings it back, which is the safe direction for something a student may still owe.

Both patterns already exist in this codebase — `plan-118`'s `#storage-status` banner with its
"Got it" control, and the persistent project indicator in `src/ui/projectSignifiers.js`. Reuse them
rather than inventing a third notice idiom.

### 2. The parameter name

Recommendation: **`worksheetAt`**, as proposed. Comma-separated level ids. It is descriptive,
matches the existing camelCase `devGuidedLevel`, and does not claim more than it does.

### 3. The unknown-id notice wording

D2 fixes the mechanics; the copy is an owner call because a student may read it. Recommendation:
name the ids verbatim and attribute the problem to the link, not the student — something in the
shape of *"This link lists worksheet checkpoints that do not match any level: <ids>. The other
checkpoints still work."*

## Authority And Contracts

Required reading:

- `src/ui/devGuidedLevelLink.js` — the parse shape to follow, and the hash fallback **not** to follow (F3).
- `src/main.js:217-220` — the dev gate that makes this the first production parameter.
- `src/ui/levels.js:560-610` — the level-result surface this attaches to.
- `docs/subsystems/ui-mode-contract.md` — the contract this must extend; the "Storage blocked status notice (Plan 118)" section is the model for the new one.
- `src/ui/projectSignifiers.js` — the persistent-indicator pattern.
- The incoming proposal and the orchestrator response named under Provenance.

Contracts to preserve:

- No usage, export, analyzer, or fingerprint change of any kind.
- Level content, star criteria, `turnPar`, progression, and turn semantics untouched.
- Free Play behaviour unchanged.
- The app must behave identically to today when the parameter is absent, which is the overwhelming
  majority of loads. **Absence is the default path and must cost nothing** — no banner, no marker,
  no reserved DOM.

## Work Plan

1. New module under `src/ui/` that parses `location.search` for the parameter and returns a resolved list plus a list of unknown ids. Pure and injectable, in the shape of `getDevGuidedLevelIdFromLocation`.
2. Resolve ids against `app.state.levels` only (F2).
3. Wire the load-time notice for unknown ids (D2).
4. Wire the completion marker into the existing level-result banner (F4) and the per-level reminder.
5. Tests (see below).
6. Add a `## Worksheet checkpoints (Plan 125)` section to `docs/subsystems/ui-mode-contract.md`, including the D1 non-persistence decision and its consequence, and the GAS forwarding gap.
7. Validation and progress report.

## Implementation Requirements

### R1 — Parsing and resolution

- Read `location.search` only. **A test must assert that a value supplied in `location.hash` is ignored** — this is the F3 requirement and the one most likely to be lost to copy-paste.
- Trim entries, ignore empties, tolerate duplicates and trailing commas.
- Resolve against the level list; anything unresolved goes to the unknown list, including nested step ids such as `bughunt-22-trace`.
- Never throw. A malformed parameter degrades to "no checkpoints" plus the notice, never to a broken load.

### R2 — Absent-parameter default

With no parameter present, no notice renders, no marker renders, and no behaviour changes. Test this explicitly as a negative control.

### R3 — Tests

- Parsing: valid list, whitespace, duplicates, empty entries, absent parameter, malformed value.
- Hash is ignored (R1).
- Resolution: valid ids resolve; a nested step id lands in the unknown list; a mixed list produces both a resolved set and an unknown set, and the resolved set is still marked (D2 item 3).
- The marker appears on completion of a checkpoint level and not on completion of a non-checkpoint level.
- Register any new test file in `package.json` (explicit list, not a glob).

### R4 — Docs

`docs/subsystems/ui-mode-contract.md` gains the new section. It must state the parameter name, that the list is not persisted and why, that unknown ids are surfaced without suppressing valid ones, and that the parameter does not currently survive the GAS shell.

## Commands

```powershell
npm test
```

```powershell
npm run build
```

## Validation Checklist

- [ ] `location.hash` is not read, and a test proves it.
- [ ] Absent parameter is a true no-op, tested.
- [ ] Nested step ids resolve to unknown, not to a level.
- [ ] A mixed valid/invalid list still marks the valid levels.
- [ ] No usage event, export field, or analyzer path added.
- [ ] Free Play unchanged.
- [ ] `npm test` passes; new test files registered.
- [ ] `npm run build` passes.
- [ ] `ui-mode-contract.md` reads true post-change and records the GAS forwarding gap.

## Stop Conditions

Stop and report if:

- the marker cannot be added to the existing level-result banner without restructuring it — that is a bigger change than this packet authorizes;
- implementing the reminder appears to need persistence, contradicting D1 — report rather than adding storage;
- any part of the design appears to require BB to know something about the worksheet's content, which is the design failure the packet exists to prevent;
- the parameter turns out to interact with the dev `devGuidedLevel` shortcut in a way not anticipated here.
