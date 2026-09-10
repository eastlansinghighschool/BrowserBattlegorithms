# Open Questions

Track only the short list of unresolved choices that future packets or orchestration reviews need to settle.

Refreshed 2026-09-10. The two prior owner-decision entries (`plan-116` counter definitions, `plan-121` blank-name analyzer wording) were answered on 2026-09-01 and their packets are complete; the sequencing question about what follows `plan-116` was answered by writing `plan-124`. Settled decisions live in `docs/decision-log.md`; deferred work lives in `docs/development/future-directions-analysis/backlog.md`. This file is only for choices that are genuinely still open.

## Awaiting an owner decision

- **`plan-125` prompt shape.** How should the worksheet-checkpoint prompt appear: the marker on the level-result surface, whether the per-level reminder is dismissible, the parameter name, and the copy for the unknown-id notice. The packet recommends all four and is gate-blocked until they are ruled on. Cheap to answer and expensive to get wrong once a worksheet is printed on paper.

## Awaiting a measurement

- **Parent-origin authentication for the GAS shell.** Exact origin pinning, or a server-issued deployment/account-bound bootstrap proof? Deliberately unratified until `plan-120`'s Gate 1 probe reports origin stability across all four reading conditions (reload, second signed-in user, new version of the same deployment, new deployment). One reading exists; it decides nothing on its own. This is the single decision that most changes the size of the first Stage 1 protocol packet.
- **Embedded storage under district policy.** Partitioned, unpartitioned, or blocked on a student-OU device? Reclassified from an IT question into a Gate 1 measurement on 2026-09-01.
- **Usable viewport under the GAS shell.** The first probe run reported an inner viewport of 1066x620 on the owner's own display; the target is a 1366x768 managed Chromebook, where it will be smaller. 620px of height already has to hold the Blockly panel and the p5 canvas, which compete for space in direct mode today. Promoted from a review risk (F13) to an open question because the first reading suggests it may outrank the API questions.

## Deferred to a Stage 1 packet that does not exist yet

- **Child-facing querystring parameter forwarding through the GAS shell.** Under the shell, the parent Apps Script page composes the child iframe `src`, so a parameter on the parent `/exec` URL does not reach the child unless the shell forwards it. `plan-125`'s `worksheetAt` is the first parameter to need this, and it will work against a plain Pages URL while silently doing nothing against a GAS URL. One design constraint is already settled: **the requirement is generic, not worksheet-specific** — forward an allowlisted set of child-facing parameters, not this one by name (which repeats the conversation for every future parameter) and not an unbounded passthrough (which is an injection surface into the child URL). Stage 1 proper is unwritten and blocked on the two gates above, so there is nothing to amend; this is recorded so it is not rediscovered late.

## Needs a home, or a decision not to give it one

- **`src/integration/`.** Named in a ratified decision (2026-09-01) as the client half of the GAS integration, but created by no packet yet.
- **The fake-parent test harness.** The Claude review's recommended local page that speaks the postMessage protocol against an in-memory fake server. It is the only route to automated coverage for most of Stage 2, and it appears in no packet.
- **The Stage 1 friction baseline.** A lightweight before/after observation of what the current download/submit workflow actually costs: minutes, teacher help interventions, wrong-file submissions, and teacher extraction time. Explicitly not a go/no-go gate, and it measures only Stage 1's friction benefit — not cross-device portability, and not the owner's third goal of learning a reusable GAS-wrapper pattern for other classroom activities.
- **The `star-evaluation-campaign.test.js` degenerate fixture.** Lines 166-276 embed a hand-modified derivative of the advanced-scrimmage solution (support allies idled) with no mechanical link to the fixture it derives from, so a future fixture repair could leave the test passing while proving something weaker than it claims. The repository already has the convention for this: `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` (plan-100). Small enough to ride along with the next packet touching that area.
- **Film review (charter S7).** Queued and unwritten since before the GAS work; no date claimed on it.

## Sequencing not yet chosen

- **The `plan-123` downstream slate.** P1 (canvas palette extraction) is decision-independent and is the natural first packet, but none of P1-P4 is written and their order against `plan-125` and the Stage 1 work is not settled. P5 (sprites) remains gated by the charter.
