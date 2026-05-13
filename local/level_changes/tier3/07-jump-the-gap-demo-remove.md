---
status: COMPLETE
tier: 3
level-id: jump-the-gap
level-title: "Level 14: Jump the Gap"
change-type: demo XML reference removal
target-file: src/config/levels.js
---

## Summary
`JUMP_THE_GAP_DEMO_XML` shows a single `jump_forward` block — literally the complete solution to Level 14, which is a one-block puzzle. There is no way to show the structural pattern without revealing the answer. The demo reference should be removed from the tutorialSteps entry entirely. Do not delete the `JUMP_THE_GAP_DEMO_XML` constant itself.

## What to Read
- `src/config/levels.js` — find the object with `id: "jump-the-gap"`, then find the tutorialSteps step with `id: "level-14-jump"`.

## What to Change

### Remove demo fields from the step object
Find this exact step in the `jump-the-gap` level's `tutorialSteps` array:

```
      {
        id: "level-14-jump",
        title: "Jump Is A One-Time Leap",
        body: "Jump Forward moves two cells ahead and ignores the space in between, but you only get one jump each round. For this lesson, a single jump block is enough.",
        targetSelector: "#blockly-region",
        demoBlocklyXml: JUMP_THE_GAP_DEMO_XML,
        demoTitle: "Example one-jump solution",
        demoCaption: "This lesson is intentionally simple: one Jump Forward clears the wall and reaches the goal side."
      },
```

Replace it with (removing the three demo fields):

```
      {
        id: "level-14-jump",
        title: "Jump Is A One-Time Leap",
        body: "Jump Forward moves two cells ahead and ignores the space in between, but you only get one jump each round. For this lesson, a single jump block is enough.",
        targetSelector: "#blockly-region"
      },
```

## What NOT to Change
- The `const JUMP_THE_GAP_DEMO_XML` declaration at the top of the file — leave it in place even though no level will reference it.
- The other step in `jump-the-gap` (`level-14-no-backward-jump`) — unchanged.
- Any other level object.

## Verification
Re-read the `level-14-jump` step and confirm it has no `demoBlocklyXml`, `demoTitle`, or `demoCaption` fields. Confirm `const JUMP_THE_GAP_DEMO_XML` still exists in the file.

## Log Entry Template
```
## tier3/07-jump-the-gap-demo-remove.md — [DATE]
- Level: Level 14: Jump the Gap
- Action: Removed demoBlocklyXml, demoTitle, demoCaption from step level-14-jump
- Constant JUMP_THE_GAP_DEMO_XML: still present in file (unused)
- Status: COMPLETE
```
