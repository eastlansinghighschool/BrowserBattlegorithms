# Gate 0 — District IT Questions

**Date written:** 2026-09-01
**Status:** largely closed 2026-09-01. Q1, Q3, Q4 answered by the owner from existing district
knowledge. Q2 was reclassified from a policy question into a measurement taken by the Gate 1
probe. One open request remains: synthetic domain accounts for Gate 2.
**Why this exists:** `review-synthesis.md` "Gate 0: district permission and policy." Two of these
four answers could have invalidated the Google Apps Script iframe architecture before any code was
written, and two could have invalidated it after the code worked. The questions and their framing
are kept below because the reasoning behind each still explains why the answers matter — but the
Answers section, not the questions, is the live part of this file.

Questions 1 and 2 were the ones to ask first, because either could invalidate probe work that
requires scheduling. In the event, Q1 was already known and Q2 turned out to be better answered by
measurement than by asking — see the Answers section, which is now the live part of this file.

---

## The four questions, in plain language

### Q1 — May a teacher publish an Apps Script web app for students?

*What we are really asking:* whether a staff member can deploy a Google Apps Script web app with
access set to "anyone in the domain," and whether that requires admin approval, an allowlist, or an
internal-app review. Also whether students would hit an unverified-app OAuth consent screen.

*If the answer is no:* the entire architecture dies here. The GAS shell is the only thing supplying
server-derived account identity; without it there is no account-attributed cloud mode, and the
project stays on the current download/submit workflow. This is the cheapest possible place to find
that out.

### Q2 — Is third-party cookie or site-data access blocked by policy on student Chromebooks?

**Reclassified 2026-09-01: not an IT question. Measured by the Gate 1 nested-frame probe
(`plan-120`), run on a representative student-OU device. Held in reserve as an IT question only
if the probe measures *blocked*: at that point the ask becomes "can this domain be allowlisted
for students?", which is a different and much more specific request.**

*What we are really asking:* whether Chrome enterprise policy on managed student devices blocks
site data for embedded (cross-site) content — for example `BlockThirdPartyCookies`, a restrictive
`DefaultCookiesSetting`, or third-party storage partitioning set to block rather than partition.
And, if it is blocked, whether the game's own domain could be allowlisted for student devices.

*If the answer is "blocked, no allowlist":* the game inside the frame cannot save anything to the
browser. Students would play in a memory-only mode where work is lost on tab close. That does not
kill account-attributed evidence submission outright, but it makes the framed experience much worse
than the current direct site, and it would need to be weighed honestly before a pilot.

*Note:* this question is worth asking even if the GAS work is abandoned. The answer tells us how
many students are already hitting storage-blocked conditions on the direct site today, which is the
frequency question behind `plan-118`.

### Q3 — May student learning records live in a teacher's district Google Drive?

*What we are really asking:* whether the district's student-data privacy agreement permits student
learning records — the programs students write and their per-level progress — to be stored in a
staff member's district Google Drive, or whether such records must live only in a district-approved
system of record.

*If the answer is no:* the technical design could work perfectly and still be unusable. Drive is
where the evidence would live. There is no fallback storage location inside the "no new cloud
platform" constraint.

### Q4 — What retention, deletion, and grading-appeal schedule applies?

*What we are really asking:* how long student coursework and learning records must be kept, how
long a grading appeal window stays open, and whether there is a required deletion deadline (end of
year, end of term, N days after the appeal window closes).

*If the answer differs from our defaults:* the district rule wins. The proposal's numbers — 30 days
of resume state and 90 days of evidence after a cohort ends — are placeholders chosen in the
absence of this answer, and no production retention number should be ratified until it arrives.

---

## The one remaining ask

Everything else is settled. The only outstanding request is the synthetic accounts Gate 2 needs:

> Hi — for a classroom programming tool I'm extending with an optional Google Workspace front end,
> I need two or three synthetic accounts in our domain for testing sign-in behavior — accounts that
> belong to no real student. Can those be created, and by whom? No real student account or student
> data will be used in any of this testing.
>
> Thanks —

A reserve question is held in the Q2 section above, to be sent only if the Gate 1 probe measures
storage as *blocked* on student devices.

The original four-question draft is preserved in this file's git history (commit `6dd18b4`) should
a future cohort, district, or records officer require the conversation to be reopened.

---

## What each answer unblocks

| Answer | Unblocks / blocks |
| --- | --- |
| Q1 yes — **answered** | Gate 1 and Gate 2 probes are worth running; `plan-120` artifacts become deployable |
| Q1 no | Stop. Stage 0 client hardening (`plan-118`, `plan-119`, `plan-121`) still stands on its own merits |
| Q2 partitioned — *to be measured* | Expected case. Embedded mode is viable; the direct-site bucket is separate, which is the Stage 2 migration problem, not a blocker |
| Q2 blocked — *to be measured* | Reframe the pilot honestly, or reconsider the shell entirely; `plan-118`'s memory-only path becomes the real student experience, not an edge case. Reserve IT ask: domain allowlisting |
| Q3 yes — **answered** | Drive evidence storage is permitted; Stage 1 can proceed after Gates 1–2 |
| Q3 no | Stop. No amount of correct code makes this compliant |
| Q4 unbounded — **answered** | Purge becomes a convenience, not a deadline; finding 9 largely dissolves; per-cohort keys retained for classroom-hygiene reasons |

---

## Answers

*Record answers here as they arrive, with the date and who gave them. Do not paraphrase a "yes"
out of a "probably" — an ambiguous answer is an unanswered question, and the whole point of this
gate is to avoid discovering the real policy during a class period.*

- **Q1 — Apps Script publishing: YES** (owner, 2026-09-01, from prior direct experience deploying
  domain-scoped Apps Script web apps in this district). Gate 0's hardest blocker is clear.
- **Q2 — Third-party site data: RECLASSIFIED, not asked.** Converted into a measurement taken by
  the Gate 1 nested-frame probe rather than a policy question. Two outcomes must be reported
  distinctly and must not be collapsed into one pass/fail:
  - **Partitioned** — the expected, normal case, and *not* a failure. The embedded app reads and
    writes its own bucket, separate from the direct site's. A probe showing an empty-but-working
    bucket is this, and it is the reason a Stage 2 migration path exists at all.
  - **Blocked** — the failure case. Property access on `window.localStorage` throws rather than
    returning null, which is precisely why the app's current presence-check guard does not guard
    (review F7, `plan-118`).
  Must be run on a **representative student-OU device**, not a teacher device: Chrome policy is
  applied per organizational unit and teacher and student OUs commonly differ. No students need to
  be present and the probe collects and transmits nothing. If the result is *blocked*, the reserve
  IT question is domain allowlisting for students.
- **Q3 — Student learning records in teacher Drive: YES** (owner, 2026-09-01). Permitted under
  district agreements provided the data stays within district Drive control.
- **Q4 — Retention: UNBOUNDED PERMITTED** (owner, 2026-09-01). The district has no objection to
  indefinite retention of student data held within district Drive control. Consequences:
  - The synthesis's finding 9 largely dissolves. Stage 1 no longer needs the Advanced Drive
    Service as a *compliance* dependency, and the proposal's placeholder 30-day / 90-day windows
    are superseded rather than merely unconfirmed.
  - This is a permission, not an obligation. Teacher-triggered purge stays worth building as a
    convenience and for mistakes; it simply stops being a compliance deadline.
  - **Per-cohort record keys should still be kept.** The retention rationale for them is gone, but
    the surviving reason is independent: a returning student in a new class should start a fresh
    record rather than inherit the previous year's. Classroom hygiene, not compliance.
  - If this answer is informal rather than documented, get it in writing before a pilot spans a
    school year. A retention posture is exactly the kind of thing that changes when a new person
    holds the records role.
- **Synthetic accounts:** _pending — still needed for Gate 2, and now the only outstanding ask._
