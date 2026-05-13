# Tier 4 Prompt — Board Redesigns

You are modifying `setup` or `setupOverrides` blocks in `src/config/levels.js` to change runner starting positions, flag positions, and enemy freeze states. These are coordinate and state changes only — tutorial text, toolboxes, and win conditions are not touched in this tier.

## Your task for this session

1. List all files in `local/level_changes/tier4/`.
2. Find the first file (lowest filename sort order) whose front-matter contains `status: PENDING`.
3. Read that change file completely before touching anything else.
4. Read `src/config/levels.js` and `docs/GameSpecification.md` (for grid dimensions and flag default positions if needed).
5. Locate the level object using the `level-id` value in the change file.
6. Make exactly the changes described under **What to Change**. The change file specifies which runner slots, flag keys, or barrier entries to modify and their new values.
7. Re-read the modified `setup` or `setupOverrides` block to confirm all coordinate values are correct.
8. In the change file, replace `status: PENDING` with `status: COMPLETE`.
9. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file, including the old and new coordinate values.
10. Stop. Do not process any other change files this session.

## Rules — read these before touching any file

- Only modify the properties listed under **What to Change** in the `setup` or `setupOverrides` block.
- Do not touch `tutorialSteps`, `tips`, `introText`, `toolboxBlockTypes`, `winCondition`, `failureCondition`, or any XML const.
- Do not modify any runner slot, flag, or barrier not listed in the change file.
- Grid coordinates are zero-indexed. Column 0 is the left edge; row 0 is the top edge. The grid is 12 columns wide and 8 rows tall.
- A runner's `gridX` and `gridY` must place it within the playable area (columns 0–11, rows 0–7). Verify this before writing.
- Do not add or remove runner slots — only change coordinate and state values of existing slots.
- Do not reformat or restructure the JavaScript.
- If a change file notes a design dependency (e.g., NPC AI behavior must be verified), log this dependency in the CHANGE_LOG entry and apply the change as specified. Flag verification steps for the developer.
