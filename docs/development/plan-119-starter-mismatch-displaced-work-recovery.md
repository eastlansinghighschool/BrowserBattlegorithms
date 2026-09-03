---
id: plan-119
title: "Starter Mismatch Displaced-Work Recovery"
status: complete
resolution: "Displaced-work recovery delivered and orchestrator-verified. The Plan 45 stale-replace branch now preserves the student's XML to a bounded bba:displaced-workspace:<levelId> slot with an index, verified by read-back, before any overwrite. Preservation failure returns the stored XML and writes nothing, honoring the rule that the only durable copy is never overwritten when the recovery write fails; the level is marked preservation-blocked in memory so saveWorkspaceToLocalStorage suppresses the version stamp. Fail-safe ordering verified: starter write and read-back precede the version stamp. Restore writes XML, verifies, stamps the current version key, verifies, and only then touches the live workspace, so a reload keeps the restored program instead of re-replacing it. Cap 8, oldest-first by displacedAt, one slot per level, unknown level ids pruned without throwing, orphan slot removed on index-write failure. Gate 4 honored via a restoredAt marker rather than deletion, which keeps the copy while stopping the notice recurring. All four approved strings appear verbatim; notice and storage-blocked banner are mutually exclusive by construction. 584/584 unit tests, clean build, 6/6 browser tests including keyboard restore and post-reload persistence. Subsystem note rewritten; the 'silent by design' paragraph is gone. GAS Stage 2 still owns checkpoint upload suppression per review F1."
depends_on: [plan-118]
gate: "CLEARED 2026-09-01. All five items resolved: non-blocking notice plus restore button; copy uses the app existing term 'starter program'; cap 8, oldest-first, one slot per level; the recovery copy is never explicitly deleted (only superseded or pruned); plain-language failure copy. See the Gate section for exact strings; nothing remains to stop for."
summary: >-
  Stop the Plan 45 stale-starter replacement from being an unrecoverable silent deletion: preserve the displaced workspace XML in a bounded local slot before the starter overwrites it, tell the student, and give them one way to get it back. Keeps the replacement behavior itself, which is correct. Local-only; the cloud-promotion suppression half of the finding is deliberately deferred to GAS Stage 2.
---
# Plan 119: Starter Mismatch Displaced-Work Recovery

## Packet Metadata

- Packet id: `plan-119`
- Packet title: Starter Mismatch Displaced-Work Recovery
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-01
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem note)
- Approval gate: before mutation — owner approves the recovery UX shape, ordinary and
  preservation-failure/restore-failure copy, and retention cap (see Gate below).
- Depends on: `plan-118` (the displaced slot must be written through the exception-safe accessors, and both packets edit `getStoredWorkspaceXmlText`; run them in sequence, not concurrently)
- Blocks: GAS Stage 2 portable-state restore (which cannot safely transport `bba:guided-workspace-version:*` until displaced work is recoverable)
- Expected artifacts:
  - displaced-workspace preservation in the Plan 45 stale-replace branch of `src/ai/blockly/workspace.js`
  - a bounded `bba:displaced-workspace:<levelId>` slot family with a documented cap and pruning rule
  - a student-visible notice and one restore affordance
  - unit tests proving the displaced XML survives and is restorable, plus a cap/pruning test
  - updated `docs/subsystems/blockly-workspace.md` (the "silent by design" paragraph stops being true)
  - progress report
- Progress report folder: `reports/development/plan-119-starter-mismatch-displaced-work-recovery/`
- Progress report file: `reports/development/plan-119-starter-mismatch-displaced-work-recovery/progress.md`

## Packet Summary

Goal: When the authored starter for a guided level changes and the student's stored program is replaced, the student's program is preserved and recoverable instead of destroyed.

Non-goals:
- **Do not remove or weaken the replacement in the normal path.** Replacing a stale workspace
  with the corrected starter is intentional, documented, and right (Plan 45,
  `docs/subsystems/blockly-workspace.md`). The one exception is preservation failure: the app
  must not destroy the sole durable student copy merely to apply the replacement. In that
  exceptional path it keeps and loads the earlier program, leaves its version stamp unchanged,
  and explains that the starter update could not be applied safely.
- Do not drop `bba:guided-workspace-version:*` from storage, and do not relax the Plan 45 grace-stamp branch. Both would reintroduce the bug Plan 45 fixed.
- Do not add merge, diff, or three-way reconciliation UI. One preserved copy, one restore action.
- Do not build the cloud-side half of review finding F1 (a `displacedByStarterUpdate` flag that suppresses checkpoint upload). There is no cloud checkpoint to suppress yet; that requirement belongs to GAS Stage 2 and is recorded there, not here.
- Do not extend versioning to project shared workspaces or Free Play workspaces (still exempt per Plan 45 Decision 3).

Depends on: `plan-118`.

Blocks: GAS Stage 2 portable-state restore.

Why this packet exists:
`getStoredWorkspaceXmlText()` is a read accessor that performs a destructive write. On a starter-hash mismatch it executes `window.localStorage.setItem(storageKey, fallbackXml)` (`src/ai/blockly/workspace.js:983`), discarding the student's stored XML. Today the loss is bounded to one device and the student sees a genuinely corrected level, which is why Plan 45 chose it — and `docs/subsystems/blockly-workspace.md` says so explicitly under "Replace-on-mismatch (silent by design)."

Two things have changed since that judgment. First, this repository has already shipped a starter-XML authoring fix mid-semester once (subsystem note, 2026-05-17, bughunt-22); on such a day every student who had work on that level lost it with no notice and no recovery. Second, the GAS integration review (`review-claude.md` finding F1, ratified in `review-synthesis.md` section 3) showed that if portable state ever transports both the workspace XML and the version key, this local, bounded, one-device loss becomes an unbounded loss that then *uploads the starter as the student's work through a valid revision lineage* — no user chose anything, and both copies are gone.

Making the displaced copy recoverable fixes the classroom problem that exists today and removes the precondition for the cloud catastrophe. It is worth doing whether or not the GAS integration ever ships.

## Authority And Contracts

Required reading:

- `docs/subsystems/blockly-workspace.md` — the whole Plan 45 section: two-key shape, replace-on-mismatch, the grace stamp (Decision 5), and the exemptions (Decision 3).
- `src/ai/blockly/workspace.js:943-1017` — `getStoredWorkspaceXmlText` (the stale-replace branch at `:975-990`) and `saveWorkspaceToLocalStorage`.
- `src/ai/blockly/starterVersioning.js` — the hash is computed at module-load time from the build's `initialBlocklyXml`, so it is a property of the build, not of the student.
- `src/platform/safeStorage.js` — delivered by `plan-118`; all storage access in this packet goes through it.
- `reports/orchestration/gas-integration-commentary/review-claude.md` finding F1 (mechanism, evidence, falsification test).
- `docs/CopyVoiceContract.md` — any student-facing string added here is in scope for the voice contract.

Contracts to preserve:

- After a recoverable displaced copy is written and verified, replace-on-mismatch still replaces
  and the corrected starter is what the student sees. Preservation failure is the explicit safety
  exception: retain/load the earlier program rather than destroy the only durable copy.
- The grace-stamp branch (missing version key) still lets in-flight pre-Plan-45 work survive, and still stamps.
- Free Play and project shared workspaces stay exempt from versioning.
- Storage key naming stays in the existing `bba:` namespace.
- One-action-per-turn semantics, game rules, and level content are untouched.
- Static Vite build, no server dependency.

## Gate (before mutation) — CLEARED 2026-09-01

All five items resolved by the owner. Use these strings and rules verbatim; do not reword them. If
an approved string will not fit its surface, **stop and ask** rather than trimming it.

### 1. Recovery UX shape — RESOLVED: non-blocking notice plus restore button

A dismissible notice appears in the Blockly panel **only** when a displaced copy exists for the
current level, with the restore action beside it. It never gates play, never steals focus, and
never appears as a modal. Load-time modal choice and silent-preservation-without-notice were both
considered and rejected — the former interrupts at the worst moment and asks a beginner a systems
question, the latter leaves the actual classroom failure ("I opened the level and my program was
gone") unaddressed.

### 2. Notice and button copy — RESOLVED

- Notice: **"This level's starter program was updated, so your earlier program was set aside."**
- Restore button: **"Restore earlier program"**

**Terminology is the point here.** The implementer proposed "starting blocks." The app already
calls this a *starter program* — see the reset control's `aria-label`, "Reset workspace to the
starter program" (`index.html:133`). Using one term keeps the two features reading as the same
concept instead of teaching a student two names for one thing.

### 3. Retention cap and pruning — RESOLVED as recommended

Cap of **8** displaced entries across all levels, pruned oldest-first by `displacedAt`, **one slot
maximum per level** (a second displacement on a level replaces the first — by then the older copy
is two starter generations stale). Entries for level ids no longer present in the build are pruned
without throwing. This matched both the packet's original recommendation and the implementer's
proposal, so it was accepted without being put to the owner as a contested choice.

### 4. Reversibility of restore — RESOLVED: never explicitly deleted

After a successful restore, the displaced copy is kept until it is **superseded** by a newer
displacement on that level or **pruned** by the cap. It is *not* cleared when the student edits.

This overrides the implementer's proposal to clear on first edit. Two reasons: it is strictly
safer, and "edit" is a noisier signal than it sounds — the Blockly change event fires on cosmetic
drags (GAS review finding F14), so a student who restored and then nudged a block would silently
lose the recovery copy. Do **not** wire a change-event hook for this.

### 5. Failure copy — RESOLVED

- Preservation failure (a recovery copy could not be written and verified):
  **"Could not save a recovery copy, so your earlier program was kept and this level's starter
  program was not updated."**
- Restore failure (the restore write could not be verified):
  **"Could not restore your program right now. Your saved copy is still safe and your current
  blocks were not changed."**

Both state what happened and what survived, and neither blames the student. These replace the
implementer's Alt 1 with the jargon removed ("the starter update was not applied").

### Voice note

All four strings are systems messages, not coaching. `docs/CopyVoiceContract.md`'s in-world
scout/coach speaker governs student *guidance*; honest failure and state reporting is plain second
person, consistent with the precedent set by `plan-118`'s storage banner. None of these strings may
appear in the lesson or coaching channel students read for strategy help.

## Additional review requirements (added 2026-09-01 at preflight review)

These are not owner decisions; they close gaps in the preflight plan.

### A browser spec is required, not optional

The preflight plan lists browser verification as manual only. This packet's behavior is
student-visible and there is direct precedent both ways: `plan-118` shipped
`tests/browser/storage-resilience.spec.js`, and `tests/browser/workspace-starter-versioning.spec.js`
**already pre-seeds a stale version key** via `addInitScript` with a deliberately unmatched hash
(`"deadbeef"`, lines 50-52) — which is exactly the fixture this packet needs. Extend that spec or
add a sibling proving, in a real browser: the notice appears with the approved copy, the restore
button is keyboard reachable and restores the program, and a reload afterwards still shows the
restored program rather than the starter. The reload assertion is the one most likely to be got
wrong, because it is what proves the version key was re-stamped.

### Confirm the notice surfaces cannot stack badly

`#blockly-region` already holds `#storage-status`, `#workspace-import-status`, and
`#usage-export-status` between the program summary and the toolbar. This packet adds a fourth.
All are `hidden` by default, so the normal case costs no vertical space — but confirm and state in
the progress report that (a) the displaced notice and the storage-blocked notice are mutually
exclusive (they should be: displaced notices are never offered in memory-only mode, which is the
only condition that shows the storage banner), and (b) with the displaced notice visible, the
Blockly toolbar and workspace remain usable at 1366x768, the managed-Chromebook class the GAS
probe targets.

## Scope

In scope:
- The stale-replace branch of `getStoredWorkspaceXmlText` in `src/ai/blockly/workspace.js`.
- A `bba:displaced-workspace:<levelId>` slot family with a bounded index and pruning.
- A restore path that writes the displaced XML back into the workspace and re-stamps the version key.
- The notice and action surface chosen at the gate.
- Unit tests.
- `docs/subsystems/blockly-workspace.md` update.

Out of scope:
- Any cloud, sync, outbox, upload-suppression, or GAS surface.
- Project shared workspaces and Free Play workspaces.
- Changing the hash computation, the version-key format, or the grace-stamp rule.
- A general undo/version-history feature for workspaces.
- Migrating already-lost work (it is already gone; nothing can recover it).

Files and areas likely touched: `src/ai/blockly/workspace.js`, one UI notice/action surface (the same one `plan-118` used, if suitable), `tests/unit/blockly-workspace.test.js`, `package.json` if a new test file is added, `docs/subsystems/blockly-workspace.md`.

## Concurrency note (added 2026-09-01 at dispatch)

`plan-121` is running concurrently. Write-scopes are disjoint: it owns `src/usage/`, `src/admin/`,
`scripts/`, `docs/subsystems/usage-and-admin.md`, and `docs/CohortUsageDataDictionary.md`; this
packet owns `src/ai/blockly/`, `src/platform/` consumers, the notice surface, and
`docs/subsystems/blockly-workspace.md`.

**You own `package.json`.** `plan-118` released it on completion and `plan-121` is explicitly
barred from touching it, so register any new test file yourself.

**Your targeted tests are your authoritative validation.** `npm test` reads the whole worktree, so
a concurrent packet's in-flight edits can surface as failures in your full-suite run. If the full
suite fails, attribute each failure by file with `git status` before describing it — never call a
failure "pre-existing" without checking whether another live packet is mid-edit on that file. That
mistake was made once already on 2026-09-01 and is recorded in the decision log.

## Work Plan

1. Confirm `plan-118` has landed and `src/platform/safeStorage.js` exists. If it has not, **stop** — do not hand-roll guarded storage access here.
2. Reproduce the loss: write the falsification test first. Seed `bba:guided-workspace:<L>` with a distinctive program and `bba:guided-workspace-version:<L>` with a deliberately wrong hash, load the level, assert the stored XML is gone. Record that this test passes against pre-packet code (i.e. the loss is real).
3. Present the gate items. **Stop for owner approval.**
4. Implement preservation, then the index/cap, then restore, then the notice.
5. Update the subsystem note.
6. Run validation; write the progress report.

## Implementation Requirements

### R1 — Preserve before replace

Required behavior: in the stale-replace branch, before `fallbackXml` is written over the stored workspace, persist the displaced content.

Slot shape (JSON, one per level):

```json
{
  "levelId": "<levelId>",
  "xml": "<the displaced workspace XML>",
  "displacedAt": "<ISO 8601>",
  "storedVersion": "<hash the student's copy carried>",
  "currentVersion": "<hash the current build computes>"
}
```

Constraints:
- Write and read back the displaced slot **and** its index entry before overwriting the original.
  A successful method return without a readable indexed copy is not enough.
- If either preservation write or read-back verification fails, do **not** overwrite the original
  workspace or its version key. Load the earlier stored XML for this page and show the
  gate-approved preservation-failure notice. This preserves the only durable copy and retries the
  starter comparison on a later load. Best-effort removal of any partial orphan is allowed, but
  failure to clean it up must not risk the original.
- Mark that level in memory as preservation-blocked for the page lifetime. If the student edits
  and the ordinary save path writes their updated XML, it must **not** stamp the current starter
  version while that flag is set; doing so would silently bless the stale workspace and prevent a
  later recovery attempt. The next page load must still see the mismatch and retry preservation.
- After preservation succeeds, replace in fail-safe order: write and read back the corrected
  starter XML **before** stamping the current version key, then read the version back. Never stamp
  the current version if the starter write was not verified. If the starter succeeds but the
  version stamp fails, retain the displaced entry; on the next load the stored XML is identical to
  the starter, so the no-op rule below must prevent that starter from replacing the real displaced
  copy before the version stamp is retried.
- All storage access via `src/platform/safeStorage.js`.
- Do not write a displaced slot when the displaced XML is empty, or when it is byte-identical to the incoming starter (nothing was lost).
- The grace-stamp branch (`storedVersion === null`) does not displace anything and must be left alone.

Edge cases: the same level displaced twice; a displaced slot for a level that no longer exists in the build (prune it, do not crash); a corrupt/unparseable slot (discard it and behave as though no displaced copy exists — never throw during level load).

### R2 — Bounded retention

Required behavior: the number of displaced slots is capped at the owner-approved number, pruned oldest-first by `displacedAt`, one slot per level.

Constraints:
- Pruning happens on write, not on a timer.
- The cap is a named constant with a comment citing this packet, not a magic number at the call site.
- Displaced XML is bounded by the same practical size as a workspace; do not add compression.

### R3 — Restore

Required behavior: the student can put the displaced program back into the workspace for that level.

Constraints:
- Restore loads the displaced XML into the live Blockly workspace **and** writes it to the workspace storage key **and** stamps the current version key — otherwise the very next load replaces it again, which would be a worse bug than the one being fixed. Test this loop explicitly.
- Persist the workspace first, then the current version key, and read both back before reporting
  restore success or replacing the live Blockly contents. If either write/read-back fails, retain
  the displaced entry, leave the current live starter in place, and show an honest restore-failed
  message. Never clear the recovery entry or claim success on a partial write.
- Restore is a deliberate student action. Never automatic.
- Per the gate item 4 decision, keep or clear the displaced entry after restore.
- Restore is unavailable in `plan-118`'s memory-only path. That path skips the persisted starter
  comparison and cannot establish a durable displaced slot, so offering recovery would be false.
  Do not show a displaced-copy action there; `plan-118`'s storage-unavailable notice is the honest
  explanation.

### R4 — Notice

Required behavior: two non-blocking variants using the owner-approved copy:

1. **Recoverable copy:** shown only when a displaced copy exists and is readable; includes the
   restore action.
2. **Preservation failure:** shown when no verified recovery copy could be made; explains that the
   earlier program was kept and the starter update was not applied; has no restore action and must
   not imply a recovery copy exists.

Constraints:
- Non-blocking, does not steal focus, does not gate play.
- Reuse the existing notice surface. Do not add a modal.
- Keyboard reachable; the restore action is a real focusable control with an accessible name.
- The recoverable-copy notice appears only when a displaced copy actually exists and is readable.
  The preservation-failure variant is the sole exception and never exposes a restore control.

Pedagogy check: this message is about the app changing, not about the student being wrong. It must not read as an error the student caused, and must not imply their earlier program was bad. It belongs outside the coaching/lesson voice channel students read for strategy guidance.

### R5 — Tests

- **Falsification/regression pair:** the seeded-mismatch test from work-plan step 2 must show the XML lost before the packet and preserved after. Record both results in the progress report.
- Restore round-trip: displace, restore, then reload the level and assert the restored program is still there (this is the re-stamp test — it is the one most likely to be got wrong).
- Restore partial failures: fail the workspace write, the version write, and each read-back in
  separate cases; assert no success is reported, the displaced entry remains, and the live starter
  is not replaced by an unconfirmed restore.
- Cap and pruning: displace more levels than the cap, assert the oldest are gone and the newest survive.
- One-per-level: displace the same level twice, assert one slot with the newer content.
- No-op cases: empty stored XML, stored XML identical to the starter, grace-stamp branch — assert no slot is written.
- Corrupt slot: assert level load succeeds and no displaced copy is offered.
- Storage-unavailable from page start: assert level load succeeds through the memory-only path,
  the current fallback is shown without a persistent overwrite, and no notice claims a
  recoverable displaced copy.
- Preservation failure: make the displaced-slot write or index write fail, then assert the
  original workspace and version key remain unchanged, the earlier program loads, and the
  preservation-failure notice does not claim a recovery copy exists.
- Preservation failure followed by a student edit/save: assert the current-version key is still
  not stamped and a reload retries the mismatch path rather than blessing the stale workspace.
- Replacement partial failures: fail the starter write/read-back and then the version
  write/read-back in separate cases. Assert the current version is never stamped ahead of a
  verified starter, the original displaced copy survives, and a retry cannot replace that copy
  with starter XML.

## Commands

```powershell
node --test tests/unit/blockly-workspace.test.js
```

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Pre-packet loss reproduced and post-packet preservation proven, both recorded in the progress report.
- [ ] Restore round-trip survives a reload (version key re-stamped).
- [ ] Cap, one-per-level, and no-op cases all covered by tests.
- [ ] Normal replacement behavior is unchanged: after a verified recovery copy exists, a stale
  workspace yields the corrected starter on load.
- [ ] Preservation-write/index/read-back failure leaves the original workspace and version key
  intact, loads the earlier program, and shows only the approved failure notice.
- [ ] Grace-stamp branch behavior unchanged.
- [ ] Free Play and project shared workspaces unaffected.
- [ ] `npm test` and `npm run build` pass.
- [ ] `npm run test:browser:smoke` passes.
- [ ] `docs/subsystems/blockly-workspace.md` no longer says the replacement is silent, and describes the displaced slot, the cap, and the restore path.
- [ ] Student-facing copy matches the owner-approved text and the Copy Voice Contract.
- [ ] No unrelated files changed.

## Stop Conditions

Stop and ask for review if:

- `plan-118` has not landed;
- the restore path cannot re-stamp the version key without touching Plan 45's compare logic in a way that changes replacement semantics;
- keeping the original workspace intact after preservation failure cannot be done without a
  broader workspace-lifecycle change;
- the notice cannot be placed without new UI structure;
- the pre-packet test does **not** show the loss — that would mean F1's mechanism is wrong and the packet's premise needs owner review;
- the work starts pulling in cloud, sync, or upload-suppression concerns (that is Stage 2 by design; note it and stop).
