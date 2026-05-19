# Cross-Doc Drift Scan — 2026-05-18

## Scan metadata
- Scope: full sweep
- Files read: 21
- Findings: 1 total — 1/0/0
- Run by: cross-doc drift scanner agent
- Scan duration: ~35 minutes

## Doc inventory
| File | Declared purpose | Length |
| --- | --- | --- |
| `docs/packet-creation-guidance.md` | Packet-writing guidance and guardrails | 192 lines |
| `docs/development/README.md` | Active packet index and packet-state source of truth | 108 lines |
| `docs/GameSpecification.md` | Foundational game rules handout | 226 lines |
| `docs/ARCHITECTURE.md` | Architecture overview and subsystem index | 70 lines |
| `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` | Canonical guided-level inventory and concept map | 59 lines |
| `docs/StudentGuide.md` | Student-facing setup, free play, and Blockly tips | 58 lines |
| `docs/TeacherGuide.md` | Teacher-facing pacing and validation guidance | 52 lines |
| `docs/TeacherFacilitationKit.md` | Classroom pacing, prompts, and curriculum support notes | 250 lines |
| `docs/subsystems/blockly-workspace.md` | Blockly workspace lifecycle and execution-model contract | 165 lines |
| `docs/subsystems/file-pipelines.md` | Workspace XML, private program, and usage export flows | 96 lines |
| `docs/subsystems/learning-moments.md` | Learning-moment classifier contract | 91 lines |
| `docs/subsystems/npc-and-cpu.md` | Teaching NPC vs free-play CPU behavior split | 131 lines |
| `docs/subsystems/p5-surface-map.md` | p5 rendering and canvas/DOM ownership map | 115 lines |
| `docs/subsystems/turn-engine.md` | Turn order, collision, scoring, and reset contract | 126 lines |
| `docs/subsystems/ui-mode-contract.md` | Mode variables, control visibility, and project signals | 118 lines |
| `docs/subsystems/usage-and-admin.md` | Usage tracking, export, and admin analyzer contract | 117 lines |
| `docs/development/00-cross-doc-drift-scanner-agent-starting-prompt.md` | Scan-only starting prompt | 263 lines |
| `docs/development/00-level-editing-agent-starting-prompt.md` | Guided-level editing starting prompt | 306 lines |
| `docs/development/00-mini-packet-agent-starting-prompt.md` | Lower-cost implementation starting prompt | 101 lines |
| `docs/development/00-orchestrator-thread-starting-prompt.md` | Orchestration starting prompt | 104 lines |
| `docs/development/plan-41-keyboard-gemini-guided-playthrough.md` | Active scan-only Plan 41 packet | 300 lines |

## Findings

### Finding 1 — Project arc ranges are renumbered in the facilitation kit
- **Category:** 5
- **Severity:** high
- **Topic:** Project arc level ranges
- **Source A:** `docs/TeacherFacilitationKit.md` line(s) 172-174
  > `### Strategy Brain Project (L25-L31)`
- **Source A:** `docs/TeacherFacilitationKit.md` line(s) 210-212
  > `### Team Strategy Script Project (L32-L41)`
- **Source B:** `docs/subsystems/blockly-workspace.md` line(s) 56-56
  > `**Project-shared workspaces**: Levels inside a project arc (\`strategy-brain\` L23-L28, \`team-strategy-script\` L29-L37) share one workspace key per project id.`
- **Source B:** `docs/subsystems/ui-mode-contract.md` line(s) 97-101
  > `On project levels (L23-L28 \`strategy-brain\`, L29-L37 \`team-strategy-script\`), additional UI appears:`
- **Observation:** The facilitation kit consistently shifts both project arcs later on the calendar than the canonical curriculum docs do. The canonical sources agree that Strategy Brain is L23-L28 and Team Strategy Script is L29-L37, while the facilitation kit describes them as L25-L31 and L32-L41.
- **Likely canonical:** `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` plus the subsystem notes, because they agree on the authored project ranges and the shared-workspace contract.
- **Notes for resolver:** The facilitation kit looks like it may be counting inserted bug-hunt/prediction steps when it labels the arc ranges, but the other active docs keep the authored project arcs fixed.

## Topics with no drift (sampled)
- One-action-per-turn execution: `docs/GameSpecification.md`, `docs/StudentGuide.md`, `docs/subsystems/blockly-workspace.md`, and `docs/subsystems/turn-engine.md` all agree that only the first reachable action under `On Each Turn` executes.
- Area Freeze timing: `docs/GameSpecification.md`, `docs/subsystems/turn-engine.md`, and `docs/subsystems/ui-mode-contract.md` all agree that Area Freeze is team-wide, readiness-gated, and shown with cooldown state in the UI.
- File export/import split: `docs/StudentGuide.md`, `docs/subsystems/file-pipelines.md`, and `docs/subsystems/ui-mode-contract.md` all agree that workspace XML export/import is Free Play only, while usage export is available in both Guided Levels and Free Play.
- Free Play mode labels and controls: `docs/StudentGuide.md`, `docs/TeacherGuide.md`, and `docs/subsystems/ui-mode-contract.md` agree on the three Free Play sub-modes and the presence of separate Team 1 / Team 2 Blockly tabs only in PvP.

## Scope ambiguities
- `docs/TeacherFacilitationKit.md` is explicitly a prediction-based facilitation companion rather than a rules spec, so its line-number claims are advisory by intent even though they still conflict with the canonical arc docs.
- `docs/subsystems/learning-moments.md` is in scope per the scan prompt, but it is not listed in the `ARCHITECTURE.md` subsystem map; I treated it as an active subsystem note because the scan instructions explicitly included every file under `docs/subsystems/`.

## Out-of-scope reads
- None.

## Ready for resolver
- Path to this report: `reports/development/cross-doc-drift-scans/2026-05-18/report.md`
- Suggested resolver model: stronger model with doc-authority judgment
- Suggested resolver scope: prioritize the project-arc numbering drift first, then re-check whether any other facilitation-copy level references should be folded into the same canonical-counting rule
