# Plan 06 Gemini Playtest Prompt

Use the app like a student. Read only this prompt, `reports/development/plan-06-guided-playtest-triage/progress.md`, and the current level context file unless blocked. Do not inspect source, tests, fixtures, or reference solutions before attempting the assigned level.

## Job

1. Open `reports/development/plan-06-guided-playtest-triage/progress.md` and find the first unchecked level report in order.
2. Open the matching context file from `reports/development/plan-06-guided-playtest-triage/level-context/`.
3. Launch the app with the canonical dev URL from that context file.
4. Attempt the level up to the maximum attempts listed below.
5. Write one bounded report file for that level in `reports/development/plan-06-guided-playtest-triage/levels/`.
6. Update `progress.md` to mark the level done, blocked, or deferred.
7. Stop after the report is written.

## Maximum Attempts

- Ordinary level: 4 attempts
- Challenge level: 3 attempts
- Project step: 4 attempts
- Project capstone: 5 attempts
- Optional lab: 3 attempts

## Report Template

Use this template for each level report:

```md
# L00 Level Title

- Result: pass / fail / blocked / deferred
- Attempts: 0
- Approximate time: 0 minutes
- Main strategy tried: ...
- Confusing copy or UI: ...
- Toolbox sufficiency: ...
- Badge/project/capstone signal clarity: ...
- Win/loss feedback clarity: ...
- Turn-limit impression: ...
- AP CSA transfer signal observed: ...
- Likely student blocker: ...
- Recommended action: no change / teacher warning / copy tweak / UI tweak / level balance review / project-arc review / canonical/source review / human review required
- Notes: ...
```

## Stop Conditions

Stop and write a blocker note if:

- the app fails to launch
- the browser cannot interact with the level fairly
- the level cannot be attempted without source inspection
- the observed behavior contradicts the packet or subsystem notes in a way that changes scope
- a fix would require changing source, tests, docs, deployment, or gameplay policy

## Current Context File

Read the context file for the selected level only. Do not bulk-read other level contexts unless the owner explicitly asks.

## Reporting Style

Write concise notes, mention only what a student could see, and distinguish student confusion from implementation bugs.
