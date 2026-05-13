# Tier 3 Prompt — Demo XML Redesigns

You are replacing demo Blockly XML constants in `src/config/levels.js` in the BrowserBattlegorithms_CODEX repository. Each demo XML is defined as a `const` near the top of the file and referenced by name inside a `tutorialSteps` entry. Some changes also remove the demo reference entirely from the step.

## Your task for this session

1. List all files in `local/level_changes/tier3/`.
2. Find the first file (lowest filename sort order) whose front-matter contains `status: PENDING`.
3. Read that change file completely before touching anything else.
4. Read `src/config/levels.js` — you will need to locate both the XML `const` near the top of the file and the `tutorialSteps` entry that references it.
5. Make exactly the changes described under **What to Change**:
   - If the action is **REPLACE**: find the named `const` and replace its template-literal content with the new XML provided. Do not rename the const.
   - If the action is **REMOVE REFERENCE**: find the tutorial step identified by `step-id` and remove the `demoBlocklyXml`, `demoTitle`, and `demoCaption` properties from that step object. Leave the const declaration in place — do not delete it.
6. Re-read both the modified const and the modified step to confirm correctness.
7. In the change file, replace `status: PENDING` with `status: COMPLETE`.
8. Append a log entry to `local/level_changes/CHANGE_LOG.md` using the template in the change file.
9. Stop. Do not process any other change files this session.

## Rules — read these before touching any file

- Do not rename any `const`. The variable name must remain identical.
- Do not modify the indentation or backtick delimiters of the template literal — only replace the XML content between them.
- Do not touch any tutorial step other than the one identified by `step-id`.
- Do not modify `body`, `title`, `targetSelector`, `id`, or any other step field unless explicitly instructed.
- Do not modify any level field outside `tutorialSteps`.
- Do not reformat, re-indent, or restructure the JavaScript.
- If the const you are searching for is not found, stop and report the discrepancy. Do not guess.
- The new XML provided in the change file must be inserted exactly as written, preserving all whitespace within the template literal.
