# Open Questions

Track only the short list of unresolved choices that future packets or orchestration reviews need to settle.

Refreshed 2026-09-01. The previous three entries (Plan 88 frontmatter migration order, whether to adopt Bootstrap prompts as-is, whether some packet docs stay permanently manual) were all answered by plans 88, 89, 115, and 117 and have been removed. Settled decisions live in `docs/decision-log.md`; deferred work lives in `docs/development/future-directions-analysis/backlog.md`. This file is only for choices that are genuinely still open.

## Awaiting an owner decision

- **`plan-116` counter definitions.** What exactly counts as a collision, and what counts as a wasted resource use? The packet is gate-first and cannot be dispatched until this is answered with event-log evidence.
- **`plan-121` blank-name analyzer wording.** How should the analyzers describe a similarity group whose members are all unnamed, given that the current phrasing claims a name comparison that did not happen? Also the routine confirmation that direct-mode download behavior is unchanged.

## Awaiting a measurement

- **Parent-origin authentication for the GAS shell.** Exact origin pinning, or a server-issued deployment/account-bound bootstrap proof? Deliberately unratified until `plan-120`'s Gate 1 probe reports origin stability across all four reading conditions. This is the single decision that most changes the size of the first Stage 1 protocol packet.
- **Embedded storage under district policy.** Partitioned, unpartitioned, or blocked on a student-OU device? Reclassified from an IT question into a Gate 1 measurement on 2026-09-01.

## Needs a home, or a decision not to give it one

- **`src/integration/`.** Named in a ratified decision (2026-09-01) as the client half of the GAS integration, but created by no packet yet.
- **The fake-parent test harness.** The Claude review's recommended local page that speaks the postMessage protocol against an in-memory fake server. It is the only route to automated coverage for most of Stage 2, and it appears in no packet.
- **The Stage 1 friction baseline.** A lightweight before/after observation of what the current download/submit workflow actually costs: minutes, teacher help interventions, wrong-file submissions, and teacher extraction time. Explicitly not a go/no-go gate, and it measures only Stage 1's friction benefit — not cross-device portability, and not the owner's third goal of learning a reusable GAS-wrapper pattern for other classroom activities.
- **The `star-evaluation-campaign.test.js` degenerate fixture.** Lines 166-276 embed a hand-modified derivative of the advanced-scrimmage solution (support allies idled) with no mechanical link to the fixture it derives from, so a future fixture repair could leave the test passing while proving something weaker than it claims. The repository already has the convention for this: `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml` (plan-100). Small enough to ride along with the next packet touching that area.

## Sequencing not yet chosen

- **After `plan-116`:** the star-3 criteria expansion authoring packet and film review (charter S7) are both queued but unwritten, and their order is not settled.
