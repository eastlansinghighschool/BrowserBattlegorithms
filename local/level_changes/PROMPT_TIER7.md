# Tier 7 Prompt — Title Renumbering

You are updating the `title` strings of all level objects in `src/config/levels.js` to reflect the correct sequential numbers after insertions and removals from earlier tiers. This tier contains a single change file with the complete before/after mapping.

## Your task for this session

1. Read `local/level_changes/tier7/01-renumber-titles.md` completely.
2. Confirm its `status` is `PENDING`. If it is `COMPLETE`, stop — this tier is finished.
3. Read `src/config/levels.js`.
4. For each entry in the **Title Map** table in the change file, find the level object with the matching `level-id` and update its `title` string to the new value.
5. After all updates, re-read the `title` field of each modified level to confirm it matches the expected value in the map exactly.
6. In the change file, replace `status: PENDING` with `status: COMPLETE`.
7. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file, listing the count of titles updated.
8. Stop.

## Rules — read these before touching any file

- Only change the `title` field of each level object. Do not touch any other field.
- Use the `level-id` column of the Title Map to locate each level — do not rely on the old title string to find the object, as it may already have been changed by a prior run.
- The new title strings in the map must be used verbatim, including capitalisation and punctuation.
- Do not modify the Optional Lab entry (`id: "optional-random-lab"`) — its title has no level number and does not change.
- Do not reformat or restructure the JavaScript.
- If a level id in the map is not found in the file, stop and report it in the log entry.
