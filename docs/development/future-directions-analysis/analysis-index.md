# Future Directions Analysis Index

This page consolidates the three archived model-perspective files into one current status map.
Read the originals in [archive/](archive/) if you want the full rationale and wording.
Status values are limited to `shipped`, `out of scope`, `queued — A`, `queued — B`, `queued — C`, and `deferred`.

## Consolidated Index

| Title | Source | Status | Notes/Link |
| --- | --- | --- | --- |
| Turn trace debugger / execution highlighting | multiple | shipped | Implemented across [Plan 25a](../archive/plan-25a-blockly-trace-collection.md), [Plan 25b](../archive/plan-25b-blockly-trace-playback.md), and [Plan 29](../archive/plan-29-trace-visual-refinement.md). |
| Accessibility board narration / classroom display pass | multiple | queued — A | The current queue prioritizes narrated board state first; keyboard-only and contrast layers follow later. |
| Level authoring contract linter | codex | queued — A | Developer-side curriculum linter; see Plan 34 in the packet index. |
| Local level readiness workbench / editor roadmap | codex | queued — A | MVP packet sequence is Plans 60-64; deferred editor work is summarized in [level-workbench-deferred-editor-roadmap.md](level-workbench-deferred-editor-roadmap.md). |
| State tracking and variables pathway | codex | queued — B | Bounded recent-state sensors first, then possible time-since counters, remembered positions, goal-relative progress sensors, and eventually variables. See [state-tracking-and-variables-pathway.md](state-tracking-and-variables-pathway.md). |
| Teacher playtest / classroom timing kit | codex | queued — A | Teacher-facing pacing, intervention prompts, and AP CSA discussion themes; see Plan 33 in the packet index. |
| AP CSA bridge / Java preview cards | multiple | queued — B | Read-only Java-style preview of the current Blockly logic for AP CSA transfer. |
| Prediction-first checkpoints | multiple | queued — B | Ask the student to predict before running; the packet number is not assigned yet. |
| Classroom tournament mode | multiple | queued — C | Tournament-in-a-box depends on the seedable RNG decision first. |
| Deterministic replay / permalink system | multiple | queued — C | Seedable replay descriptor first; replay viewer UI stays deferred separately. |
| Embedded formative assessment checkpoints | multiple | deferred | Same family as prediction-first work; revisit after prediction lands. |
| Guided misconception detectors | codex | deferred | Hold until classroom feedback names specific stuck points. |
| Progressive free-play challenges / daily puzzles | multiple | deferred | Keep the idea as scenario cards only if classroom feedback asks for it. |
| Strategy reflection export | codex | deferred | Wait until usage evidence shows whether export would help teachers. |
| Strategy comparison view | multiple | out of scope | Persistent side-by-side comparison adds screen-space pain; the demo overlay already exists. |
| Map editor for teacher-authored challenges | multiple | out of scope | Teacher-authoring tool with its own validation surface. |

## Notes

- This index intentionally records only the three archived model files.
- Packet tracking still lives in [`../README.md`](../README.md).
- The backlog keeps the short active queue and a smaller list of loose ideas; this page is the full suggestion catalog from the archived models.
