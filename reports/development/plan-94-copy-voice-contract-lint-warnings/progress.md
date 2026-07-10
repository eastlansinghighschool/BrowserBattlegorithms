# Progress Report - Plan 94: Copy Voice Contract And Lint Warnings

## Status

**Implemented.** Plan 85's charter is complete (S4/S5 accepted 2026-07-07), so this packet's gate ("do not run until Plan 85 voice contract is accepted") is cleared. Delivered exactly what the packet scoped: durable docs for the voice contract, three non-blocking lint warnings enforcing it, and focused tests — no level copy was rewritten. Status left for orchestration to set.

## What I built

### 1. Voice contract documentation

New [`docs/CopyVoiceContract.md`](../../../docs/CopyVoiceContract.md): the durable in-world scout/coach voice contract from charter S5 — the seven rules (in-world knowledge only, no solution reveals, name specifics not abstractions, banned phrases, fragments allowed, ~35-word pre-play cap, demo Blockly stays structural), generic acceptable/unacceptable examples (not tied to any specific level, per the packet's constraint), a table mapping each rule to its enforcing lint contract, and an explicit "what this contract does not cover" section (no rewrite scheduling, no teacher docs, no earned hints).

Added pointers, not new pedagogy, to two existing docs per the packet's "changing teacher docs beyond pointing to the new contract" boundary:
- [`docs/packet-creation-guidance.md`](../../../docs/packet-creation-guidance.md) — new "Copy Voice Contract (Charter S5, Plan 94)" section, styled after the existing S8 section, pointing future packet authors at the contract and lint rules.
- [`docs/TeacherGuide.md`](../../../docs/TeacherGuide.md) — one-sentence pointer distinguishing student-facing voice (in `CopyVoiceContract.md`) from teacher-facing pedagogy (this guide).

### 2. Lint warnings

Three new rules in `src/dev/levelLintCore.js`, wired into `runLevelLint()`:

| Contract | Checks | Fields | Severity |
|---|---|---|---|
| `copy-voice-banned-phrase` | Case-insensitive substring match against the three phrases named in S5: `"this level teaches"`, `"beginner-friendly"`, `"this is a good level for"`. | `description`, `introText`, each `tips[]` entry, each `tutorialSteps[].body` | warning |
| `copy-voice-spoiler-phrase` | Same field set, against a short deterministic phrase list (`"the solution is"`, `"the answer is"`, `"the correct order is"`, `"the correct sequence is"`, `"the trick is to"`). | same | warning |
| `copy-voice-prose-length` | Word count over 35 (S4's "~35 words" pre-play cap), checked per-field. | `description`, `introText` only | warning |

All three are transparent phrase/length checks, matching the packet's "avoid brittle NLP" constraint — no scoring, no heuristics, no partial matches.

**Design decisions:**
- **Field scope.** `description` and `introText` are the two fields rendered in the persistent student-lesson-card panel (`src/ui/levels.js:613-624`) — the actual "pre-play" surface — so those two get the length cap. `tips[]` and `tutorialSteps[].body` are also clearly student-facing prose (a real `"this level teaches"` hit was sitting in a `tutorialSteps[1].body` on `jump-if-ready`, and no packet author would expect that to be exempt just because it's an onboarding overlay instead of the lesson card), so they're included in the banned-phrase and spoiler-phrase scans, but not the length cap — a tutorial step is allowed more room to walk a student through a mechanic than a one-line mission briefing is.
- **Length cap is per-field, not combined.** S4 says "pre-play prose hard cap: ~35 words" without specifying whether `description` + `introText` are summed. Per-field is simpler, more actionable (a level can fail on `introText` specifically, which is what the warning message reports), and avoids a level being flagged for two short-but-combined-long fields that are each individually fine.
- **Spoiler-phrase list kept deliberately narrow.** I considered a broader/fuzzier "sequenced action words" detector (e.g., flagging any copy that names two or more block action names in order) but rejected it — that crosses into exactly the "requires subjective curriculum judgment" territory the packet's own Stop Conditions warn about (is naming one action a spoiler? two? in what order?). The five literal phrases are unambiguous solution-reveal language and don't need judgment calls to apply.
- **No breaking mode added.** The packet's non-goal is explicit ("do not fail CI on existing copy unless the owner explicitly authorizes a breaking lint mode") and doesn't ask for a flag/toggle to be built preemptively — `npm run lint:levels`'s exit code is already driven only by `error`-severity diagnostics (`scripts/lint-levels.js:48`), so these three warning-severity rules are non-blocking by construction with zero new plumbing. A future packet can promote specific contracts to `error` with owner sign-off; I did not build speculative infrastructure for that.

### 3. Tests

Nine new tests in `tests/unit/level-lint.test.js`: banned-phrase detection + level id/field identification, tutorial-step-body scanning (case-insensitive), spoiler-phrase detection, length-cap warning (including confirming `tips[]` is correctly *excluded* from the length check), a clean multi-field example producing zero warnings from all three rules, a custom-word-cap parameter test, and an integration test confirming the three rules are wired into `runLevelLint()` and stay warning-severity there.

## Real copy debt surfaced (existing levels, not touched)

Running `npm run lint:levels` against the live campaign surfaced real, pre-existing violations — recorded here per the validation checklist, not fixed (out of scope; Plan 95's job):

**Banned meta phrases (5 hits):**
- `mirror-forward` — `tips[2]`: `"this level teaches"` (this is a **fully protected** level per charter S12 — voice rewrite only, no dynamics/arc changes, so this is squarely Plan 95's future target, not a blocker here)
- `watch-the-wall` — `tips[0]`: `"beginner-friendly"`
- `jump-if-ready` — `tutorialSteps[1].body`: `"this level teaches"`
- `stay-still-can-do-something` — `tips[2]`: `"this is a good level for"`
- `my-side-their-side` — `introText`: `"this level teaches"` (this is the level Plan 103 just touched in this session — Plan 103 explicitly reviewed this tip's neighbor lines for now-false content but correctly left this one alone, since it's a voice issue, not a factual one, and voice rewrites are out of that packet's scope too)

**Pre-play prose over the ~35-word cap (6 hits, all `introText`):**
- `how-far-away` (39 words), `flip-the-answer` (45), `one-program-two-allies` (50), `barrier-specialist` (47), `jump-team` (36), `optional-double-carrier-showdown` (55)

**Solution-spoiler phrasing:** zero hits. None of the five listed phrases currently appear anywhere in shipped copy.

`npm run lint:levels` exit code remains `0` with these 11 new warnings present (51 pre-existing `board-dynamics-tier` warnings for untiered levels were already there, unrelated to this packet) — confirming the non-blocking behavior works as required.

## Files touched

- `docs/CopyVoiceContract.md` (new)
- `docs/packet-creation-guidance.md` (new section, pointer only)
- `docs/TeacherGuide.md` (one-sentence pointer)
- `src/dev/levelLintCore.js` (three new exported check functions + wiring into `runLevelLint`)
- `tests/unit/level-lint.test.js` (imports + 9 new tests)
- `reports/development/plan-94-copy-voice-contract-lint-warnings/progress.md` (this file)

No `src/config/levels/**` file was touched by this packet (the one level-20 diff visible in `git status` is Plan 103's prior, already-reviewed change, not this packet's).

## Validation

```
node --test --test-isolation=none tests/unit/level-lint.test.js   → 49/49 passing (9 new)
npm run lint:levels                                                → exit 0; 11 new copy-voice warnings (documented above),
                                                                       zero copy-voice errors, zero spoiler-phrase hits
npm test                                                           → 476/476 passing
npm run build                                                      → succeeds (pre-existing chunk-size warnings only, unrelated)
```

## Problems encountered

None. No stop condition was triggered: Plan 85's voice contract was already accepted, the existing lint tooling supported adding phrase/length rules with no structural changes needed, and none of the three rules required subjective curriculum judgment (all are literal phrase or word-count checks).

## Next step

None from my side. Plan 95 (per-phase copy rewrites) can now use these warnings to find real targets, starting with the 11 hits above. Status left for orchestration.
