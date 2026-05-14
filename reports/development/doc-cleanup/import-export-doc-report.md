## What the docs explain well

There is a solid baseline story in the teaching docs:

- `docs/TeacherGuide.md` and `docs/StudentGuide.md` both tell students that they can export/import programs.
- `docs/GameSpecification.md` still gives the broad “Export AI Program (XML)” / “Import AI Program (XML)” vision.
- `docs/TESTING.md` names malformed XML import feedback and workspace persistence as testable behavior.
- `docs/development/plan-07-private-free-play-program-files.md` clearly states the intent for private Free Play files and the distinction from guided levels.
- `docs/development/plan-04-saveable-usage-file.md` explains the usage export concept and the teacher-side analyzer.

So the docs do cover the big categories. A future agent won’t be completely lost.

## Where the docs are stale or incomplete

The problem is that the code now has **three distinct file pipelines**, and the docs mostly talk as if there are only one or two.

### 1. Normal workspace XML export/import
This is the familiar student program flow.

Code path:
- [src/ui/controls.js](../../../src/ui/controls.js)
- [src/ai/blockly/workspace.js](../../../src/ai/blockly/workspace.js)

Behavior:
- exports the current Blockly workspace as XML
- imports readable XML back into the workspace
- in Guided Levels, the export/import controls are hidden
- in Free Play, the controls are visible

Docs gap:
- the docs mention export/import generally, but they do not clearly say that **Guided Levels now hide program import/export controls** while **Free Play keeps them**
- they also don’t spell out that the XML export/import path is the “readable program” path, not the usage-evidence path

### 2. Private encrypted Free Play program files
This is a separate student-to-student / hot-seat privacy flow.

Code path:
- [src/crypto/privateProgramFile.js](../../../src/crypto/privateProgramFile.js)
- [src/ui/controls.js](../../../src/ui/controls.js)
- [src/ui/blocklyPanel.js](../../../src/ui/blocklyPanel.js)

Behavior:
- Free Play export modal offers a private export option
- encrypted payload is JSON, not XML
- Web Crypto does PBKDF2 + AES-GCM
- import path detects private JSON and prompts for the password
- the same importer can handle both normal XML and private JSON
- this is privacy friction, not strong security

Docs gap:
- the general docs do not clearly say that **private program files are Free Play only**
- they also do not explain that **the private export is a JSON file containing encrypted XML**, not a new gameplay format
- the docs don’t make the “privacy friction, not security boundary” point explicit enough
- there is no clear top-level doc that contrasts this flow with the normal XML flow

### 3. Usage evidence export and teacher analyzer
This is the classroom evidence pipeline, and it is a completely different artifact.

Code path:
- [src/usage/usageTracker.js](../../../src/usage/usageTracker.js)
- [src/usage/usageFormat.js](../../../src/usage/usageFormat.js)
- [src/usage/usageAnalyzer.js](../../../src/usage/usageAnalyzer.js)
- [src/usage/usageAnalyzerBrowser.js](../../../src/usage/usageAnalyzerBrowser.js)
- [src/admin/adminApp.js](../../../src/admin/adminApp.js)

Behavior:
- usage is captured in browser and persisted in IndexedDB
- export prompts for student name
- export produces a usage JSON file with canonical JSON + SHA-256 integrity hash
- the admin analyzer ingests usage JSON, verifies the hash, summarizes sessions, and flags duplicates / similar sequences
- admin review is a teacher-side tool, not a student-facing play feature

Docs gap:
- the docs mention “usage export” and “teacher analyzer,” but they do not clearly separate that from workspace save/export
- they also don’t make it obvious that the usage file is **not a program file** and **not meant to be re-imported into Blockly**
- the teacher-facing role of `admin.html` / the analyzer is under-described in the more general docs
- the integrity story is present in the implementation, but the docs don’t really teach the difference between:
  - a student program export
  - a private program file
  - a usage evidence export

## What docs usually miss

Here are the exact seams I’d call out for future agents.

| Surface | Docs coverage | What is clear | What still needs help |
|---|---|---|---|
| Normal XML export/import | Medium | There is a student program export/import story. | Which modes show the controls, and which artifact it is for. |
| Private Free Play file export/import | Low-medium | Plan 07 explains the intent. | That it is Free Play only, encrypted JSON, password-gated, and distinct from normal XML. |
| Usage evidence export | Medium | Plan 04 and the analyzer docs exist. | That it is student-name-based evidence capture, not program save, and how the integrity hash works. |
| Teacher analyzer | Low-medium | The admin surface exists. | That it is local-dev/teacher review tooling and not part of student gameplay. |
| Workspace save vs usage export | Low | Both exist in code. | They are easy to confuse unless the docs explicitly separate them. |

## Important interactions with other surfaces

This area only makes sense if an agent sees the neighboring systems too.

### Blockly workspace persistence
The Blockly workspace layer is where normal XML save/load actually happens.

Relevant file:
- [src/ai/blockly/workspace.js](../../../src/ai/blockly/workspace.js)

It handles:
- localStorage workspace persistence
- Guided Level vs Free Play keying
- PvP team-tab-specific storage
- XML import/export hooks
- workspace snapshots that also feed usage tracking

That means import/export is not just a button on top of Blockly. It is tied into persistence, usage capture, and mode behavior.

### Free Play mode vs Guided Levels
This matters because the controls are mode-sensitive.

Relevant files:
- [src/ui/controls.js](../../../src/ui/controls.js)
- [src/ui/blocklyPanel.js](../../../src/ui/blocklyPanel.js)

Behavior:
- Guided Levels hide program file controls
- Free Play shows them
- PvP uses one visible editor with two team tabs
- PvCPU uses one player program
- import/export availability depends on mode

The docs mention Free Play generally, but they don’t really state this UI contract in one place.

### Usage export vs workspace export
This is the biggest conceptual trap.

- **Workspace export** = student’s current Blockly program
- **Usage export** = session evidence file for teacher analysis
- **Private export** = encrypted student program file for Free Play privacy

These three flows are easy to blend together unless the docs explicitly separate them. Right now, the implementation does, but the docs mostly don’t.

### Integrity / trust model
There are now two different integrity stories:

- private program files use encryption, with the password protecting the XML
- usage files use a canonical JSON hash for modest tamper detection

That’s a nice design, but it is not obvious from the top-level docs. A future agent could easily assume one integrity model applies to all export types when it doesn’t.

## What is well documented versus what needs help

### Well documented
- students can export and import program files
- Free Play has a broader file-sharing story than Guided Levels
- usage files exist for teacher review
- admin review is local-only
- exported files are local downloads, not server uploads

### Needs more doc help
- the distinction between normal XML, private encrypted JSON, and usage evidence JSON
- which modes show which controls
- which flows are student-facing versus teacher-facing
- how integrity checking differs between private files and usage files
- the difference between “save my current workspace” and “export my classroom evidence”

## One stale documentation thread to fix eventually

`docs/ARCHITECTURE.md` and `docs/GameSpecification.md` still speak about export/import in a much simpler “XML save/load” frame. That was true early on, but it’s now incomplete because the codebase has grown three separate file pipelines with different audiences and trust models.

## My practical recommendation

If we want future agents to move faster here, we should add a short internal note that says:

1. **Normal workspace XML** is for student program portability.
2. **Private program files** are Free Play only, encrypted JSON, and meant for privacy friction.
3. **Usage exports** are evidence files for teachers and admin review.
4. **Blockly workspace persistence** is separate from both file export paths.
5. **Guided Levels hide program file controls; Free Play shows them.**

That would save a lot of confusion.

## Evidence I used

- [src/ui/controls.js](../../../src/ui/controls.js)
- [src/crypto/privateProgramFile.js](../../../src/crypto/privateProgramFile.js)
- [src/usage/usageTracker.js](../../../src/usage/usageTracker.js)
- [src/usage/usageFormat.js](../../../src/usage/usageFormat.js)
- [src/admin/adminApp.js](../../../src/admin/adminApp.js)
- [src/ai/blockly/workspace.js](../../../src/ai/blockly/workspace.js)
- [docs/TeacherGuide.md](../../../docs/TeacherGuide.md)
- [docs/StudentGuide.md](../../../docs/StudentGuide.md)
- [docs/GameSpecification.md](../../../docs/GameSpecification.md)
- [docs/TESTING.md](../../../docs/TESTING.md)
- [docs/development/plan-04-saveable-usage-file.md](../../../docs/development/plan-04-saveable-usage-file.md)
- [docs/development/plan-07-private-free-play-program-files.md](../../../docs/development/plan-07-private-free-play-program-files.md)
