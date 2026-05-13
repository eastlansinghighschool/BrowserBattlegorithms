# Tier 5 Prompt — Level Removal

You are removing one level object from the `LEVEL_DEFINITIONS` array in `src/config/levels.js`. This tier contains a single change file.

## Your task for this session

1. Read `local/level_changes/tier5/01-remove-enemy-side-decision-making.md` completely.
2. Confirm its `status` is `PENDING`. If it is `COMPLETE`, stop — this tier is finished.
3. Read `src/config/levels.js`.
4. Locate the level object with the `id` specified in the change file.
5. Remove the entire level object from the `LEVEL_DEFINITIONS` array, including the surrounding braces and the trailing comma (or leading comma if it is the last element). The array must remain syntactically valid JavaScript after the removal.
6. Re-read the surrounding array elements to confirm the array is well-formed (no double commas, no missing commas, no orphaned braces).
7. In the change file, replace `status: PENDING` with `status: COMPLETE`.
8. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file.
9. Stop.

## Rules — read these before touching any file

- Remove exactly the level object specified. Do not touch any other level object.
- Do not remove the XML const associated with any demo that was in the removed level — leave all const declarations intact.
- Do not modify `toolboxBlockTypes`, `winCondition`, or any field of any remaining level.
- After removal, the `LEVEL_DEFINITIONS` array must still be valid JavaScript. Verify comma placement.
- Do not reformat or restructure any remaining code.
- Tier 7 (title renumbering) will correct title strings after all insertions and removals are complete. Do not attempt to renumber titles in this tier.
