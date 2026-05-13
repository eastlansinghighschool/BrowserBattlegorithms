---
status: COMPLETE
tier: 1
level-id: index-jobs
level-title: "Level 28: Index Jobs"
change-type: tutorial-text
target-file: src/config/levels.js
---

## Summary
Tutorial step 2 assigns specific roles to each ally ("take the flag route", "peels upward into a support lane"), removing the reasoning task from the student. The body must be rewritten to prompt the student to think about role assignment without naming the roles.

## What to Read
- `src/config/levels.js` — find the object with `id: "index-jobs"`, then find the tutorial step with `id: "level-28-jobs"`.

## What to Change
Find this exact `body` string inside the step with `id: "level-28-jobs"`:

```
One ally should take the flag route while the other peels upward into a support lane.
```

Replace it with:

```
Each index value can be assigned a different role. Think about which ally is better positioned for the scoring job, and what the other should do to stay out of the way.
```

No other field in this step changes.

## What NOT to Change
- The `title` of step `level-28-jobs`.
- Any other tutorial step in this level.
- Any other level object.

## Verification
Re-read the `level-28-jobs` step body and confirm it matches exactly.

## Log Entry Template
```
## tier1/11-index-jobs.md — [DATE]
- Level: Level 28: Index Jobs
- Step id: level-28-jobs
- Field changed: body
- Status: COMPLETE
```
