# Gate 0 — District IT Questions

**Date written:** 2026-09-01
**Status:** awaiting answers; record them in the "Answers" section below as they arrive
**Why this exists:** `review-synthesis.md` "Gate 0: district permission and policy." Two of these four
answers can invalidate the Google Apps Script iframe architecture before any code is written, and
two can invalidate it after the code works. They cost one email; the probes cost real scheduling.

Questions 1 and 2 should go first. The Claude review's recommendation was explicit: ask them
**before** running the tenant identity probe, because either answer can invalidate probe work that
requires scheduling synthetic accounts.

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

## One practical request to fold into the same conversation

For Gate 2 (the tenant identity probe) we need **two or three synthetic domain accounts** — test
accounts in the school domain that belong to no real student. Worth asking in the same message:
can those be created, and by whom? No real student account will be used for any probe.

---

## A sendable version

> Hi — I'm scoping an optional Google Workspace front end for a classroom programming tool I use
> with my CS students, and I have four policy questions before I build anything. Short answers are
> fine; a "no" on any of them saves me the work.
>
> 1. Can a teacher publish a Google Apps Script web app with access set to anyone in our domain, or
>    does that need admin approval or an allowlist? Would students see an unverified-app consent
>    screen?
> 2. On managed student Chromebooks, does Chrome policy block third-party cookies or site data for
>    embedded content? If it does, can a specific site be allowlisted for students?
> 3. Under our student-data privacy agreements, may student learning records — the code they write
>    and their progress through the lessons — be stored in a teacher's district Google Drive, or do
>    they have to live in a district-approved system?
> 4. What retention and deletion schedule applies to student coursework and learning records, and
>    how long is the grading-appeal window? I'd rather match district policy than invent my own.
>
> One request as well: for testing I'd like two or three synthetic accounts in our domain that
> belong to no real student. Can those be created? No real student account or student data will be
> used in any of this testing.
>
> Thanks —

---

## What each answer unblocks

| Answer | Unblocks / blocks |
| --- | --- |
| Q1 yes | Gate 1 and Gate 2 probes are worth running; `plan-120` artifacts become deployable |
| Q1 no | Stop. Stage 0 client hardening (`plan-118`, `plan-119`, `plan-121`) still stands on its own merits |
| Q2 not blocked | The framed app can persist normally; embedded mode is viable |
| Q2 blocked | Reframe the pilot honestly, or reconsider the shell entirely; `plan-118`'s memory-only path becomes the real student experience, not an edge case |
| Q3 yes | Drive evidence storage is permitted; Stage 1 can proceed after Gates 1–2 |
| Q3 no | Stop. No amount of correct code makes this compliant |
| Q4 any | Sets the real retention defaults; replaces the proposal's placeholder 30/90-day windows |

---

## Answers

*Record answers here as they arrive, with the date and who gave them. Do not paraphrase a "yes"
out of a "probably" — an ambiguous answer is an unanswered question, and the whole point of this
gate is to avoid discovering the real policy during a class period.*

- **Q1:** _pending_
- **Q2:** _pending_
- **Q3:** _pending_
- **Q4:** _pending_
- **Synthetic accounts:** _pending_
