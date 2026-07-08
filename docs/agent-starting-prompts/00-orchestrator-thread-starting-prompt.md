# Orchestrator Thread Starting Prompt Compatibility Entry

Canonical prompt: [orchestrator-thread-starting-prompt.md](orchestrator-thread-starting-prompt.md)

Use the canonical prompt above when starting an orchestration thread. This compatibility entry is retained for Bootstrap audit compatibility and older handoff references.

## Falsification Check

<!-- bootstrap:falsification-check v3 begin -->
When a deliverable is a conclusion rather than code, apply this check before accepting it:

- For each rival hypothesis, ask what observation would falsify it, and whether any experiment actually gave that observation a chance to occur.
- Watch for confounded designs where the candidate causes always agree, or where one is silent because the test matrix never varied the relevant dimension.
- Watch for aggregate reporting that hides tails or edge cases.
- Prefer cheap discriminating experiments over broad assertion.
- Where possible, anchor the check to a concrete incident from this project's own history.

A conclusion that survives this check is worth recording. One that does not is worth exactly one more cheap experiment.
<!-- bootstrap:falsification-check v3 end -->
