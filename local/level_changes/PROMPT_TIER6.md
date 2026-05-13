# Tier 6 Prompt — Synthesis Level Insertions

You are inserting new level objects into the `LEVEL_DEFINITIONS` array in `src/config/levels.js`. This tier contains one change file covering all three insertions. Process them in the order listed in the change file — do not reorder them.

## Your task for this session

1. Read `local/level_changes/tier6/01-synthesis-level-insertions.md` completely.
2. Confirm its `status` is `PENDING`. If it is `COMPLETE`, stop — this tier is finished.
3. Read `src/config/levels.js`.
4. For each insertion described in the change file (in order):
   a. Locate the anchor level using its `anchor-after-id` value — find `id: "ANCHOR-ID"` in the array.
   b. Insert the new level object immediately after the closing `},` of that anchor level.
   c. Ensure the inserted object is properly comma-separated from its neighbours.
5. After all three insertions, re-read the affected sections of the array to confirm all level objects are well-formed and properly separated.
6. In the change file, replace `status: PENDING` with `status: COMPLETE`.
7. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file, listing all three inserted level ids.
8. Stop.

## Rules — read these before touching any file

- Insert each new level object exactly as written in the change file. Do not modify the provided JavaScript.
- Use the `anchor-after-id` field to locate the insertion point — not a line number or title string.
- Do not modify any existing level object.
- The title strings in the new level objects contain placeholder numbers (e.g., "Level XX"). Tier 7 will assign correct numbers — do not attempt to number them here.
- After all insertions, the `LEVEL_DEFINITIONS` array must still be valid JavaScript. Verify brace matching and comma placement.
- Do not reformat or restructure any surrounding code.
- The `id` values on the new levels (`dodge-and-deliver`, `show-what-you-know`, `full-team-tactics`) must be preserved exactly as written.
