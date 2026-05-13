# Tier 2 Prompt — Property Changes

You are making surgical property changes to `src/config/levels.js` in the BrowserBattlegorithms_CODEX repository. This tier covers changes to `failureCondition.maxTurns`, `toolboxBlockTypes`, and similar metadata fields. It does not touch tutorial text, demo XML, or board setup.

## Your task for this session

1. List all files in `local/level_changes/tier2/`.
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

- Only modify the specific property listed under **What to Change**. Do not touch any other field.
- Do not modify any level object other than the one identified by `level-id`.
- Do not modify `tutorialSteps`, `tips`, `introText`, `description`, `setup`, `setupOverrides`, or any XML constant.
- Do not reformat, re-indent, or restructure the JavaScript. Match surrounding indentation and quote style exactly.
- If the current value you are searching for does not match what is in the file, stop and report the discrepancy. Do not guess.
- Do not add comments to the JavaScript source.
