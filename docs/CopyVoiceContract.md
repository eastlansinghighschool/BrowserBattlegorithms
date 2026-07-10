# Copy Voice Contract

Charter S5 (`docs/development/plan-85-campaign-rewrite-charter.md`). This is the durable authoring contract for student-facing text — `description`, `introText`, `tips`, and tutorial step `body` fields on a guided level. It governs *voice*, not curriculum content: what a level teaches doesn't change here, only how it talks to the student.

This packet (Plan 94) converts the contract below into lint warnings (`src/dev/levelLintCore.js`) — see "Lint enforcement" below. It does **not** rewrite existing level copy; Plan 95 owns per-phase rewrites, gated per-phase by the owner.

## The voice

Student-facing text has an in-world speaker: a scout or coach standing next to the player, not a curriculum designer explaining a lesson plan. Rules:

1. **Every sentence contains only what a player inside the game could know.** The speaker can see the board, the runners, the flags. They cannot see a lesson plan, a concept matrix, or a future level.
2. **Never state the solution before play.** No naming the exact winning sequence of actions or blocks.
3. **Name specific board features, never abstractions.** "the wall on your right," "the frozen runner near the flag" — not "an obstacle" or "a challenge."
4. **Banned phrases** (these break the in-world voice by talking about the level as a lesson rather than a place): `"this level teaches"`, `"beginner-friendly"`, `"this is a good level for"`.
5. **Fragments are allowed; uniform rhythm is discouraged.** A scout doesn't talk in complete, evenly-paced sentences — clipped, urgent phrasing is fine and often better.
6. **Pre-play prose has a hard cap of ~35 words** per field (`description`, `introText`). A scout gives a quick briefing, not a lecture.
7. **Demo Blockly stays structural — no solution reveal** (unchanged project contract; see `docs/subsystems/blockly-workspace.md`).

Pedagogy — *why* a level exists, what AP CSA concept it maps to, how to facilitate it in a classroom — belongs in `docs/TeacherGuide.md`, not in student-facing fields. Teacher docs may be as explicit as needed.

## Examples

**Unacceptable** (designer's-chair voice, breaks rules 1/3/4):
> "This level teaches territory conditions. This is a good level for combining sensing with movement, and it's beginner-friendly for students new to conditionals."

**Acceptable** (in-world scout voice):
> "Your side and their side play by different rules out here. Watch which half you're standing on."

**Unacceptable** (spoiler, breaks rule 2):
> "The solution is: move forward three times, then check if you have the flag."

**Acceptable** (names the feature, not the solution):
> "That frozen runner by the flag isn't going anywhere yet. Figure out what changes once you're carrying something."

## Lint enforcement

Three warning-severity lint rules in `src/dev/levelLintCore.js`, wired into `runLevelLint()` and surfaced by `npm run lint:levels` / `npm run level:readiness`:

| Contract | Rule | Fields checked |
|---|---|---|
| `copy-voice-banned-phrase` | Flags the three banned phrases above (case-insensitive substring match). | `description`, `introText`, each `tips[]` entry, each `tutorialSteps[].body` |
| `copy-voice-spoiler-phrase` | Flags a short deterministic list of solution-reveal phrases (`"the solution is"`, `"the answer is"`, `"the correct order is"`, `"the correct sequence is"`, `"the trick is to"`). | same as above |
| `copy-voice-prose-length` | Flags a field over ~35 words. | `description`, `introText` only |

All three are **warnings, not errors** — they never fail `npm run lint:levels` (exit code is driven only by `error`-severity diagnostics) or block CI. This is deliberate: existing level copy predates this contract and is not rewritten by this packet (see the progress report at `reports/development/plan-94-copy-voice-contract-lint-warnings/progress.md` for the specific copy debt these warnings surface). A future packet may promote these to errors, but only with explicit owner authorization for a breaking lint mode — do not flip severities unilaterally.

These are deliberately simple phrase/length checks, not NLP. They will miss violations that don't use the listed phrases, and can in principle false-positive on a phrase used in an unrelated sense — that tradeoff is intentional (transparent and predictable over clever and opaque). Expanding a phrase list is a small, low-risk change; do not replace this mechanism with a scoring/heuristic model without an explicit owner decision, since that reintroduces exactly the subjective-judgment risk this contract exists to avoid.

## What this contract does not cover

- It does not decide which levels get copy rewrites, or when (Plan 95, per-phase, owner-gated).
- It does not touch teacher-facing docs, tutorial mechanics, or demo Blockly behavior.
- It does not implement earned hints (a separate, deferred piece of charter S4).
