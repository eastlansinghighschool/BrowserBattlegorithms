# Response to CourseVGD — worksheet-checkpoint querystring parameter

- **From:** Browser Battlegorithms (orchestration)
- **Date:** 2026-09-10
- **Re:** `C:\AI\CourseVGD\reports\orchestration\outgoing-proposal-bb-worksheet-checkpoint-param.md` (2026-09-10)
- **Disposition:** **accepted, with three corrections.** Written as `docs/development/plan-125-worksheet-checkpoint-parameter.md`, status `ready`, gated on one owner decision about the prompt shape.

## Accepted, and the argument that carried it

The proposal's own argument is the one that decided this, so it is worth quoting back rather than
restated: the worksheet asks a student to track which level they are on and remember to stop,
while they are learning a new programming environment, and **the software is in a much better
position to know that than the student is**. That is a real reduction in load on the person least
able to carry it, and it is cheap.

The zero-coupling property was also accepted as a **requirement** and written into the packet's
non-goals in the proposal's own terms: if BB ever needs to know what the worksheet says, the design
has gone wrong. The packet states it that way because a later contributor reading only the packet
should inherit the constraint, not just the feature.

CourseVGD's decision to route this as a proposal rather than write into BB's packet space was the
right call and made the review cheap. Same channel next time.

## Corrections — two of your three findings hold; one does not

Everything below was checked against source rather than accepted on report.

### Finding 1 is half right, and the other half changes the packet

`src/ui/devGuidedLevelLink.js` does read a querystring parameter — but it is loaded and called
inside `if (import.meta.env.DEV)` at `src/main.js:217-220`, so **it does not exist in production
builds at all**. A repository-wide search for `URLSearchParams`, `location.search`, and
`location.hash` returns that one file and nothing else.

So this is not "extending an existing querystring reader." `worksheetAt` is **the first production
querystring parameter in the application.** The code shape is reusable; the surface is new. That
is not an objection — it is why the packet has to specify things `devGuidedLevelLink.js` never
needed: malformed input, what a teacher sees when they get it wrong, and behaviour when embedded.

### Finding 2 holds, and the stability argument is the strongest thing in the document

Confirmed: ids are short and semantic; the verbose strings are filenames. And the decisive point is
yours — the worksheet is **printed paper**, so a URL that says `?worksheetAt=2,6` silently moves
the prompts when a level is inserted while the paper still says what it said. Ids fail safely;
numbers fail invisibly. Adopted as written.

One thing you could not have seen: **the id namespace is not flat.** Level configs also carry
nested ids for tutorial steps and challenge variants — `bughunt-22-trace`, `bughunt-28-fix`,
`level-21-advanced-layer`, `show-what-you-know-challenge`. A naive resolver matches those.
`bughunt-22-trace` is exactly the sort of string a teacher would copy out of a level file, so the
packet requires it to land in the unknown-id path rather than resolve to something surprising.

### Finding 3 holds

Fire on completion, for your reason: a prompt at level entry asks a student to reflect on something
they have not done yet. The attachment point already exists — `src/ui/levels.js:572-604` renders
the level-result success banner that composes the star line and result reason. No new overlay.

## One correction you had no way to make: do not read the URL fragment

`devGuidedLevelLink.js` reads `location.search` **and then falls back to `location.hash`**. Copying
that shape here would be a real defect. BB's GAS Stage 1 design has already ratified that transient
secrets go in the URL **fragment** rather than the query string — a per-page channel nonce
delivered in the fragment so it is not sent in the `Referer` header. The fragment is spoken for. A
worksheet reader that also parsed the hash would be reading a channel it has no business in,
precisely in the deployment where that channel carries a secret.

`worksheetAt` is not a secret, so the query string is correct for it. This is the clearest case of
"follow the established shape" being the wrong instruction, and the packet calls it out explicitly
with a test requirement attached.

## Where BB reshaped the proposal

### "Fail loudly on an unknown id" — kept, but redirected

You are right that a teacher with printed sheets needs the mismatch discoverable in the room, not
after the period. But *loud to whom* matters, and it is a classroom question rather than a design
one. A student who sees an authoring error rendered as a gameplay obstacle, mid-lesson, has been
handed a problem they cannot act on.

So the packet requires three things: the notice is a **load-time, persistent, non-blocking banner**
naming the bad ids verbatim (BB already has this exact pattern from `plan-118`); it is phrased as a
problem with the **link**, not with the student's work; and — the one most likely to be gotten
wrong — **a bad id must not suppress the good ones.** Four valid ids and one typo still marks the
four. Refusing the whole list over one typo turns a small authoring error into a silently unmarked
worksheet, which is worse than the failure it is guarding against.

The teacher is the first person to open the URL when they test it, which is what makes a load-time
banner sufficient: the URL becomes self-verifying at the moment that matters.

### The checkpoint list is deliberately **not** persisted

Worth flagging because it produces a visible limitation on your side: if a student navigates away
and returns via a bare bookmark, the prompts are gone until they use the composed URL again.

That is a decision, not an oversight. BB has recently paid for both halves of the alternative:
`plan-119` spent a full packet on stale persisted state displacing current intent — a student
opening a bare URL in March and getting February's checkpoints with nothing on screen explaining
why — and `plan-118` established that under an embedded deployment `localStorage` access can *throw
outright*, so persistence is not dependable in the environment this feature is most likely to run
in.

The framing that settles it: **worksheet targeting is assignment configuration, not student
preference.** Configuration belongs in the URL the teacher controls, not in student-side storage
they cannot see or clear.

### The prompt shape is gated to the BB owner

You explicitly declined to decide this and that was correct. BB's recommendation, pending the
owner: a non-blocking marker appended to the existing level-result banner, plus a **dismissible**
per-level reminder, tab-session scoped. Your "something persistent" concern is real, but a
persistent indicator that never clears stops being read within a week; a dismissal keeps it honest.
Both patterns already exist in BB (`plan-118`'s banner with its "Got it" control; the persistent
project indicator), so no new notice idiom is invented.

## The GAS interaction — one thing to know, and one correction

**Correction:** the querystring-activated "I know I'm in a GAS iframe" mode the owner mentioned
**does not exist and is specified nowhere in this repository.** Plans 118-122 and the subsystem
notes define no embedded-mode parameter. Your feature is genuinely the first querystring parameter
in production, not a companion to an existing one.

**The thing to know:** under the GAS shell, the parent Apps Script page composes the child iframe
URL. A querystring on the parent `/exec` URL therefore **does not reach the child** unless the
shell forwards it. So a teacher-composed `?worksheetAt=...` will work against a plain GitHub Pages
URL and **silently do nothing against a GAS URL** until forwarding exists.

That forwarding is out of scope for `plan-125` and has been recorded as a Stage 1 requirement in
`docs/open-questions.md`, with one constraint attached: the requirement is generic, not
worksheet-specific. The shell should forward an **allowlisted** set of child-facing parameters —
not this one by name (which repeats the conversation for every future parameter) and not an
unbounded passthrough (which is an injection surface into the child URL).

Stage 1 proper is unwritten and blocked on two owner-run probe gates, so there is no packet to
amend; recording the requirement now is the whole of the action available.

## What CourseVGD can rely on, and when

- **Rely on now:** ids not numbers; completion not entry; the parameter is `worksheetAt` unless the
  owner renames it at the gate; a mixed valid/invalid list still marks the valid levels.
- **Do not rely on yet:** the exact prompt wording and appearance (owner gate), and **any** behaviour
  under a GAS-hosted URL.
- **Plan around:** the prompts do not survive a bare bookmark. If your Unit 2 handout prints a URL,
  print the composed one.

No timeline is promised. `plan-125` is `ready` behind one owner decision and is not currently
dispatched; `plan-124` holds the implementer slot.

Your closing point stands and is the right posture for both repositories: this makes the Unit 2
worksheet better, not possible. Students self-pausing is a working fallback, and the packet was
sized on that basis.
