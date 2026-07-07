# Test Coverage Scan Prompt

Audit test coverage in the project's shared or pure-logic layer against independently authored behavioral specs, and report gaps and suspect tests. You are producing a triage report for the orchestrator. You do not write, edit, or fix any test or implementation file yourself, and you do not set packet status.

## Work blind first, then diff

Do not read the existing test files before doing the following:

1. Read independently authored behavioral specs for the area under scan: `docs/decision-log.md` if present, plus any packet goals, schema docs, workflow docs, subsystem notes, or level/curriculum docs that describe expected behavior.
2. Read the actual source files under scan, but not their test files.
3. From steps 1-2 alone, write down the behavioral test cases you would expect to exist, in your own words, before looking at what's actually tested.

Only after that list exists, open the real test files and diff your independent list against what's actually asserted.

## What counts as a gap

- A named behavior with no corresponding test at all.
- A test whose name references the right behavior but whose assertions do not actually exercise it.
- An edge case a decision explicitly calls out that the tests never exercise.

## What counts as a suspect test

Flag these even when they pass:

- The assertion can never fail given how the test is constructed.
- The test asserts an internal implementation detail rather than an externally observable input/output pair.
- The test's only real check is "it did not throw" when the decision describes a specific expected output.
- Heavy mocking hides the actual logic under test.

## Output Format

Write a single markdown report with:

1. Coverage table.
2. Suspect-test list.
3. Summary counts.

## Working Rules

- Use `rg` for searches.
- Stay within the scanned layer.
- Do not edit any file in the repository.
- Do not fix anything yourself. Report it, and let the orchestrator decide whether a finding becomes a packet.

