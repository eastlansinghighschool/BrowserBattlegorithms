# Plan 14: Project Version History Design

## Recommendation

Do **not** implement project version history before the classroom rollout.

The current product already has the minimum recovery layer needed for a first guided-project release:

- shared latest workspace per project
- `Reset Level` preserves project code
- Blockly undo/redo for local edit mistakes
- usage export for evidence collection

Version history is a useful next recovery feature, but it is not required for the first classroom deployment. It adds real product value, yet it also introduces new storage, UI, retention, and migration questions that are better answered after the project arcs have been playtested in class.

## What Version History Should Be

Version history should be a **project-scoped recovery interface**, not a replay system and not a second undo stack.

It should let a student recover an earlier saved project state for `strategy-brain` or `team-strategy-script` without changing the project membership model or the shared-latest-code contract from Plan 09.

Restoring a version should create a new latest version. The historical record should remain intact.

## What Creates A Version

The best starting policy is a small set of meaningful checkpoints rather than every tiny edit.

Recommended version triggers:

- manual save
- level start inside a project
- level pass inside a project
- explicit reset or import before overwrite
- a debounced meaningful Blockly edit after the workspace settles

Not recommended as primary triggers:

- every animation frame
- every turn
- every raw Blockly event

This keeps the history useful without turning it into a replay log.

## Storage Model

Use `IndexedDB` for the version store.

Why IndexedDB:

- project XML snapshots can be large
- history is discrete and append-heavy
- it survives refresh and browser close
- it fits the existing app direction from Plan 04
- it avoids synchronous localStorage churn

Recommended stores:

### `project_versions`

Keyed by `versionId`.

Fields:

- `versionId`
- `projectId`
- `createdAt`
- `createdByTrigger`
- `levelId`
- `levelStep`
- `workspaceXml`
- `blockCounts`
- `note` or `label`
- `sourceSessionId`
- `sourceTurnNumber`

### `project_version_heads`

Keyed by `projectId`.

Fields:

- `projectId`
- `latestVersionId`
- `updatedAt`

This keeps the “shared latest workspace per project” contract clear while still allowing the history list to grow independently.

## Retention Policy

Recommended default:

- keep the most recent 30 versions per project
- keep at least one seed version per project
- prune oldest non-pinned versions first
- optionally prune versions older than 30 days if the store grows large

That keeps the feature useful for classroom recovery without bloating the local browser store.

## UI Scope

Keep the UI small and project-specific.

Recommended UI:

- a compact `History` control on project levels only
- a right-side drawer or modal listing project versions
- each version row shows:
  - timestamp
  - project step or level
  - block count
  - short preview text
  - optional student note
- a `Restore` action on each row

Recommended copy:

- “Restore a previous project save”
- “Restoring creates a new latest version”

Do not build a full timeline editor, diff viewer, or replay player in this packet. Those are different products.

## Version Metadata

The UI should expose enough information for a student to recognize the save they want without overwhelming them.

Good metadata:

- timestamp
- project step
- block count
- compact preview text from the top-level Blockly structure
- optional note/label

Nice-to-have but not required for the first version:

- save reason
- turn number
- export link to a usage file
- pass/fail state

## Restore Behavior

Restoring should:

- load the selected version into the current project workspace
- preserve the project id and shared-latest behavior
- create a new latest version entry from the restored state
- leave the original version immutable

This is important: restoration should be a new head, not a destructive overwrite of the old history item.

## How This Differs From Undo/Redo

Undo/redo and version history solve different problems.

Undo/redo:

- local editing convenience
- immediate workspace-only history
- short-lived Blockly edit stack
- not meant to cross sessions

Version history:

- deliberate recovery points
- persists across sessions
- project-scoped
- intended for recovering a known-good project state
- should survive refresh and browser close

Version history should not replace undo/redo.

## Interaction With Usage Export

Plan 04 usage export should stay the evidence file.

Version history should add **events or summary counts** to usage export, but it should not turn usage export into a full recovery archive by default.

Recommended export treatment:

- include version-history action events such as create, restore, prune
- include summary counts for versions created and restored
- do not export every historical version blob unless a later packet explicitly wants that

That keeps the evidence file focused on classroom activity while still letting the teacher see that version recovery was used.

## Migration Behavior

No destructive migration is needed.

Recommended launch behavior:

- leave the shared latest project workspace stores from Plan 09 untouched
- initialize version history lazily when a project is first entered after the feature ships
- create an initial seed snapshot from the current shared latest workspace

That gives the student a starting recovery point without trying to reconstruct a history that never existed.

## Decision On Classroom Rollout

Recommendation: **do not block the classroom rollout on version history**.

The feature is valuable, but it is a later recovery affordance, not a prerequisite for the first project release. The current app already has:

- shared latest project workspace persistence
- undo/redo
- project signifiers
- project-level reference coverage
- usage export

That is enough to start classroom use while version history remains a later enhancement.

## Proposed Future Packet

If we decide to implement this later, the follow-up packet should be:

`plan-15-project-version-history-implementation.md`

Suggested scope:

- exact UI: compact project history drawer/modal on project levels
- storage schema: IndexedDB `project_versions` + `project_version_heads`
- retention: 30 versions per project, prune oldest non-pinned first
- restore policy: restore creates a new latest version
- tests:
  - create history entries on meaningful events
  - restore a previous version
  - verify project-level isolation
  - verify usage export includes version-history events
  - verify no cross-project leakage
- migration behavior:
  - lazy seed snapshot on first project entry
  - no destructive rewrite of existing project workspace storage

## Bottom Line

Project version history should come after the classroom rollout, not before it.

When it does land, it should be a project-scoped IndexedDB recovery layer with small UI affordances and restore-as-new-head semantics, not a replay system and not a duplicate of undo/redo.
