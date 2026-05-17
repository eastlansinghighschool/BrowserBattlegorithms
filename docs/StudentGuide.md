# Student Guide

## Getting Started

- **Guided Levels** teach one idea at a time.
- **Free Play** is the sandbox where you can mix movement, sensing, jump, barriers, freeze, and advanced logic however you want.

## Guided Mode

- Start with the current level's tutorial and tips.
- Build your Blockly program under `On Each Turn`.
- Some guided levels are bug hunts: the starter program is broken on purpose, and your job is to trace the bug and repair it instead of starting from scratch.
- Press **Start Level** to run the level.
- Press **Reset Level** to restore the board without losing your code.

## Free Play

- Choose a mode:
  - `Player vs Player`
  - `Player vs CPU (Easy)`
  - `Player vs CPU (Tactical)`
- Choose a team size from `2` to `6` runners per side.
- Choose a map.

### PvP Controls

- **Team 1 Human:** `W A S D` move, `F` jump, `B` barrier, `X` stay still
- **Team 2 Human:** `O K L ;` move, `M` jump, `I` barrier, `.` stay still

### PvP Blockly Programs

- Use the **Team 1 Program** and **Team 2 Program** tabs to edit each side's code.
- Each side keeps its own saved Blockly XML.
- Export/import works for the program shown in the current tab.

## Blockly Tips

- Only the **first action reached** on a runner's turn happens.
- Beginner levels use simpler statement blocks.
- Advanced levels and free play include:
  - boolean blocks
  - `AND`, `OR`, `NOT`
  - comparisons
  - typed numbers
  - `runner index`
  - `distance to [target]`
- Bug hunts reuse already-learned blocks and ask you to repair a plausible program before the matching challenge.

## Saving and Sharing

- Guided levels save separately by level.
- Free play saves separately from guided mode.
- Use **Export XML** to download your current program.
- Use **Import XML** to load a saved program back into the current context.
- In Free Play, use the **Private Export** option to save your program as a password-protected file — useful for hot-seat play so your opponent cannot read your code.
- Use the **Export Usage** button to save your session record for your teacher to review.
