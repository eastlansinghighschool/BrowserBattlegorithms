# Plan 51 Repair Addendum

## Recommendation

Plan 51 is not ready for integration yet.

The restructure produced a more readable `docs/GameSpecification.md`, but it did not satisfy the packet's preservation contract. Repair should stay docs-only and focused on preserving current game rules without re-expanding the spec into implementation prose.

## Blocking Findings

### 1. Missing Rule-Preservation Working List

The packet required the progress report to include a checked working list of every original spec rule and its destination. The current progress report summarizes the rewrite but does not include that list.

Repair:

- Rebuild the working list from the pre-restructure spec if available in git history or from the current packet baseline used by the implementer.
- Add it to `reports/development/plan-51-game-specification-restructure/progress.md`.
- Mark every item checked with its destination:
  - `docs/GameSpecification.md`
  - `docs/subsystems/blockly-workspace.md`
  - `docs/development/future-directions-analysis/fun-factor-enhancements.md`
- If any original rule was intentionally removed as obsolete, add a separate "Removed obsolete wording" list with a one-sentence reason.

### 2. Rules Doc Drops Or Blurs Required Board-Game Rules

The new spec is too terse in several places to pass the board-game test. A reader cannot play accurately from the spec alone because some legality rules are missing or collapsed into vague phrases like "cell is valid."

Repair `docs/GameSpecification.md` so it clearly preserves these rules without duplicating subsystem implementation details:

- Movement fails / bounces when the target cell is off-board, a wall, a barrier, or the runner's own home-flag cell while that flag is still at base.
- A target cell occupied by an active friendly runner blocks movement and causes a bounce.
- A target cell occupied by a frozen opposing runner blocks movement and causes a bounce.
- A target cell occupied by an active opposing runner creates an immediate collision.
- Jump Forward uses the same landing-cell legality as movement, ignores the intermediate cell, and consumes the runner's jump resource when attempted.
- Place Barrier can place only in the cell directly forward, only when barrier resource is available, and only if that cell is on-board and not occupied by a wall, barrier, runner, or home flag at base.
- Stay Still removes a barrier directly forward and restores that barrier owner's placement resource.
- A runner picks up the enemy flag when it successfully ends movement on that flag's cell and the flag is not already carried.

Keep these in the new spec's rules sections. The turn-engine subsystem note may remain the implementation authority, but the spec itself must support tabletop play.

### 3. False Jail Rule

`docs/GameSpecification.md` currently says jails "stay open for pathfinding while remaining functionally blocked." Current runtime movement blocks walls and barriers, not jail cells. Jails are visual/designated cells, not functionally blocked movement cells.

Repair:

- Reword the jail line to match the current rule truth, for example: "Jails are visually designated board cells; unless a map also marks a wall or barrier there, they do not add a separate movement rule."
- Or remove the functional claim entirely if the spec does not need jails for the board-game walkthrough.

### 4. Negative Feature Callout Still Present

The packet explicitly says to remove "not in this version" / absent-feature framings and that topics not part of the current game should simply not be in the spec. The new spec still says "Traps are not part of Browser Battlegorithms."

Repair:

- Remove the trap bullet from `docs/GameSpecification.md`.
- If preserving the old Section 3.4 wording is necessary for the working list, document it in the progress report as intentionally removed obsolete/negative-feature wording per Plan 51 Decision 5.

### 5. Future-Directions Move Preserves Placeholder Text, Not Useful Content

`docs/development/future-directions-analysis/fun-factor-enhancements.md` currently contains only `*(This section remains the same.)*`. That preserves the old placeholder literally, but it is not useful as a future-directions note.

Repair options:

- Preferred: replace the placeholder with a one-sentence note that the old spec had only a placeholder and no actionable fun-factor content to preserve.
- Acceptable: keep the file minimal, but make it explicit that no substantive content existed in the source spec.

Do not add new roadmap ideas in this repair.

## Validation

After repair, run:

```powershell
rg "GameSpecification" --no-heading
rg -n "V1\.1|not in this version|largely the same as|see Section [0-9]|Traps are not|functionally blocked|This section remains the same" docs/GameSpecification.md docs/subsystems/blockly-workspace.md docs/development/future-directions-analysis/fun-factor-enhancements.md reports/development/plan-51-game-specification-restructure/progress.md
```

Also report line counts for:

```powershell
(Get-Content docs/GameSpecification.md).Count
(Get-Content docs/subsystems/blockly-workspace.md).Count
(Get-Content docs/development/future-directions-analysis/fun-factor-enhancements.md).Count
```

No source or test command is required unless the repair touches non-doc files, which it should not.

## Ready Criteria

- The progress report contains the checked preservation working list.
- The board-game walkthrough is still present and names the movement, collision, flag pickup, scoring, and reset rules it used.
- The spec remains under the 250-line hard cap.
- The spec no longer contains negative-feature trap wording.
- The jail wording matches runtime truth.
- The Actions and Turn Structure sections include enough legality detail for a paper/tabletop game.
- No files outside `docs/` and `reports/development/plan-51-game-specification-restructure/` are touched.
