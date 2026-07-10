# Teacher Guide

For pacing, intervention prompts, and discussion questions while running a session, see [Teacher Facilitation Kit](TeacherFacilitationKit.md).

Student-facing level text (mission briefings, tips) intentionally stays in a short in-world scout/coach voice and does not explain *why* a level exists pedagogically — that explanation belongs here. See [Copy Voice Contract](CopyVoiceContract.md) for the student-facing voice rules, and this guide's own sections above for the pedagogical framing.

## Recommended Flow

1. Start students in **Guided Levels** so they learn the one-action-per-turn Blockly model.
2. Use the beginner campaign to introduce movement, scoring, sensing, helper actions, jump, barriers, and freeze timing.
3. Pause for the prediction checkpoints before the matching bug hunts and challenges so students have to commit to a traced answer before they run.
4. Use the bug hunt checkpoints before the challenge levels to practice tracing and repairing a broken program with already-learned tools.
5. Move into the advanced levels for logic, comparisons, runner index, and multi-ally shared programs.
6. Use **Free Play** for open-ended experimentation, competition, and strategy discussions.

## Free Play Modes

- **Player vs Player**
  - two students can share one keyboard
  - each side has its own human runner and Blockly program
- **Player vs CPU (Easy)**
  - best for fast sandbox experimentation
  - CPU behaves legally but not strategically
- **Player vs CPU (Tactical)**
  - better for discussing attacker/defender roles, barriers, freeze cooldown timing, and flag pressure

## Suggested Uses

- Use team size `2` or `3` for first sandbox play.
- Use larger team sizes to discuss:
  - role division
  - runner index logic
  - offense vs defense
  - emergent strategy
- Compare maps to discuss how walls and choke points change good Blockly strategies.

## Operational Notes

- Guided workspaces save by level.
- Free-play programs persist separately from guided mode.
- PvP keeps separate Team 1 and Team 2 Blockly programs through editor tabs.
- `Reset Level` restores the board but keeps the current Blockly code.

## Validation Before Classroom Use

- Run:
  - `npm test`
  - `npm run build`
  - `npm run test:browser`
- Do a quick manual smoke pass for:
  - first guided level
  - advanced shared-program level
  - PvP free play
  - PvCPU Tactical free play
