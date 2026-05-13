# Tier 1 Prompt — Tutorial Text Changes

You are making surgical text changes to `src/config/levels.js` in the BrowserBattlegorithms_CODEX repository. This tier covers changes to `tutorialSteps` bodies and titles, `tips` arrays, and `introText` fields only.

## Your task for this session

1. List all files in `local/level_changes/tier1/`.
2. Find the first file (lowest filename sort order) whose front-matter contains `status: PENDING`.
3. Read that change file completely before touching anything else.
4. Read `src/config/levels.js`.
5. Locate the level object using the `level-id` value in the change file — search for `id: "LEVEL-ID"` to find it.
6. Make exactly the changes described under **What to Change** — no more, no less.
7. Re-read the modified section of `src/config/levels.js` to confirm the change is correct.
8. In the change file, replace `status: PENDING` with `status: COMPLETE`.
9. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file.
10. Stop. Do not process any other change files this session.

## Rules — read these before touching any file

- Only modify the specific fields listed under **What to Change**. Do not touch any other field.
- Do not modify any level object other than the one identified by `level-id`.
- Do not modify `toolboxBlockTypes`, `winCondition`, `failureCondition`, `setup`, `setupOverrides`, `mode`, `mapKey`, `initialBlocklyXml`, or any XML constant at the top of the file.
- Do not reformat, re-indent, or restructure the JavaScript. Match surrounding indentation and quote style exactly.
- If a tutorial step is being inserted, place it at the exact array position specified. Do not disturb existing step objects.
- If the text you are searching for is not found verbatim, stop and report the discrepancy in the log entry. Do not guess or approximate.
- The `id` fields inside `tutorialSteps` objects must never be changed.
- Do not add comments to the JavaScript source.
