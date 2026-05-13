---
status: COMPLETE
tier: 1
level-id: my-side-their-side
level-title: "Level 19: My Side, Their Side"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 2 specifies which block variant to use ("with else") and describes the exact two-branch structure — directive phrasing that removes the decision from the student.

## What to Read
- `src/config/levels.js` — find the object with `id: "my-side-their-side"`, then find the tutorial step with `id: "level-19-switch-sides"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-19-switch-sides"`:

```
Use a territory block with else to do one move on your side and a different move on the enemy side.
```

Replace it with:

```
The territory blocks let a program make different decisions depending on which half of the field the ally is in. Think about what move makes sense on your side, and what might make more sense once the ally crosses over.
```

No other field in this step changes.

## What NOT to Change
- Any other tutorial step in this level.
- The `toolboxBlockTypes` field (that is changed in Tier 2).
- Any other level object.

## Verification
Re-read the `level-19-switch-sides` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/05-my-side-their-side.md — [DATE]
- Level: Level 19: My Side, Their Side
- Step id: level-19-switch-sides
- Field changed: body
- Status: COMPLETE
```
