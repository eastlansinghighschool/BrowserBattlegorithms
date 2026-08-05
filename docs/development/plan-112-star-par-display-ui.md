---
id: plan-112
title: "Star/Par Display UI"
status: in-progress
depends_on: [plan-111]
gate: "before mutation: owner sign-off on star presentation copy and placement mockup (described in the preflight plan)"
summary: >-
  Surface the plan-111 star outcomes to students: per-level stars in the guided level picker and a result-banner star/par summary, with mastery-not-grades copy and accessibility-first presentation. Supersedes the UI slice of plan-96.
---
# Plan 112: Star/Par Display UI

## Packet Metadata

- Packet id: `plan-112`
- Packet title: Star/Par Display UI
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-07-22
- Packet type: implementation / frontend
- Mutation level: source-code, tests, docs
- Approval gate: before mutation — owner sign-off on star presentation copy and placement (described in the preflight plan; no pixel-perfect mockup required, but copy is quoted verbatim for approval).
- Depends on: plan-111 (star evaluation + ledger population)
- Blocks: nothing downstream; pairs with plan-113 (authoring) which may land before or after
- Supersedes: the UI slice of `plan-96`
- Expected artifacts:
  - per-level star display in the guided level picker
  - result-banner star/par outcome summary
  - mastery-not-grades copy (owner-approved)
  - unit + browser tests
  - progress report
- Progress report folder: `reports/development/plan-112-star-par-display-ui/`
- Progress report file: `reports/development/plan-112-star-par-display-ui/progress.md`

## Packet Summary

Goal: Show students their star outcomes where they naturally look: the level picker (progress at a glance) and the level result banner (this run's outcome). Stars must read as mastery and iteration goals — "can you beat par? can you meet the mastery challenge?" — never as grades.

Non-goals:
- Do not change the star evaluator, ledger fields, or level metadata (plan-111 owns them; if they look wrong, stop and surface).
- Do not add star metadata to levels (plan-113).
- Do not build film review, teacher-side star views, or cohort surfaces.
- Do not use shame-y copy, numeric scores, letter grades, or locked-content pressure.
- Do not make color the only channel for star state (accessibility).

Depends on:
- plan-111 complete.

Blocks:
- Nothing; plan-113 is independent once plan-111 lands.

Why this packet exists:
S6's pedagogy is that stars reward efficient, intentional, concept-centered solutions without blocking first success. That only works if the presentation says so: a student seeing three empty stars on level 2 should read "optional mastery challenge," not "you failed to get a perfect score." Presentation IS the pedagogy here, so copy is owner-gated and the packet is deliberately separate from the evaluation core. This is also the packet where plan-96's "stars are not grades" non-goal is enforced in visible text.

## Authority And Contracts

Required reading:

- `docs/development/plan-85-campaign-rewrite-charter.md` — S6 (star meaning), S12 (protected levels show pass star only).
- `docs/development/plan-111-star-par-evaluation-core.md` and its progress report — the landed evaluator, metadata shape, and fail-case semantics.
- `docs/CopyVoiceContract.md` — student-facing copy rules (in-world scout/coach voice; `npm run lint:levels` voice warnings apply to any copy you add to level data — banner/picker chrome copy is not linted but must follow the same voice).
- `src/ui/levels.js` — level picker items (meta line ~362), result banner (~581–588), status pill/labels (~138, ~206).
- `docs/subsystems/ui-mode-contract.md` — control visibility rules if you touch mode-dependent display.
- `docs/TeacherGuide.md` / `docs/StudentGuide.md` — add a short stars paragraph to the Student Guide if the presentation warrants it (judge at preflight; propose, don't decide alone).

Contracts to preserve:

- Stars are mastery/iteration feedback, never grades or semester targets.
- First success is always fully celebrated: a 1-star pass must never look like failure.
- Protected/pass-star-only levels show at most the pass star — no empty star slots pressuring onboarding levels (S12).
- Levels with no star metadata show nothing new (absent = clean).
- Accessibility: star state must not be color-only; screen-reader text for star states; respect reduced-motion for any animation; usable on classroom projectors and narrow screens.

## Scope

### In Scope

- Level picker: per-level star display driven by the student's ledger state (earned stars; unearned stars shown only when the level has that metadata — no phantom star slots on pass-only levels).
- Result banner: this run's star outcome with a short par comparison when applicable (e.g. "Passed in 14 turns — par is 12. Try again to beat par!"-style; final copy owner-approved).
- A brief, honest explanation surface for what stars mean (inline hint or one-line help affordance — keep tiny).
- Reading star state from the durable ledger/progress state (read path only; plan-111 owns writes). If a clean read path doesn't exist, add a minimal one and document it.
- Unit tests for display logic; browser smoke coverage for picker + banner.
- Student Guide paragraph (if preflight judges it warranted).

### Out of Scope

- Evaluator, ledger schema, level metadata, criterion logic.
- Teacher/admin star views.
- Animations beyond simple, reduced-motion-respecting affordances.
- Free Play (stars are guided-campaign only per S6).

### Files And Areas Likely Touched

- `src/ui/levels.js` (picker, banner, labels).
- Possibly `src/ui/` helpers for star-state reads; `src/core/levels.js` read path only if no clean accessor exists (minimal diff).
- `tests/unit/` (new file; register in `test:unit`), `tests/browser/` smoke spec.
- `docs/StudentGuide.md` (optional paragraph), `docs/subsystems/ui-mode-contract.md` (only if display rules change).

## Work Plan

1. Inspect plan-111's landed read paths and the picker/banner components.
2. **Preflight plan summary (gate):** present placement, exact copy (quoted), empty-state behavior per level kind (metadata level / pass-only level / no-metadata level), and accessibility approach. WAIT for owner go-ahead.
3. Implement picker + banner + copy.
4. Add unit and browser tests.
5. Run targeted tests, `npm test`, `npm run build`, `npm run test:browser:smoke`.
6. Progress report with the gate approval recorded.

## Implementation Requirements

### 1. Level picker stars

- Required behavior: earned stars visible per level from the student's ledger; unearned star slots shown only for levels whose metadata offers them; pass-only levels show at most the single pass star; no-metadata levels unchanged.
- Edge cases: student with v1 history (no star data — show nothing new, no empty slots); level passed pre-stars (pass star shown; stars 2–3 unearned but offered if metadata exists — retry is the path, copy must not shame).

### 2. Result banner

- Required behavior: on pass, banner shows stars earned this run and, when the level has par, a one-line par comparison; on fail, no star content (plan-111 semantics).
- Constraint: first pass at 1 star reads as full success plus optional challenge, e.g. structure "Level passed! ⭐ — Beat par (12 turns) to earn a second star." (Final wording owner-approved at the gate.)

### 3. Copy and voice

- All new student-facing copy follows `docs/CopyVoiceContract.md` voice; no grading language ("score", "grade", "perfect", "S rank"); no pressure mechanics.

### 4. Accessibility

- Star states have text equivalents (aria-labels / visually hidden text); not color-only; reduced-motion honored; keyboard reachability preserved; check on narrow viewport.

## Commands

```powershell
npm test
npm run build
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Preflight gate: owner approved placement + verbatim copy.
- [ ] Picker and banner behave per the level-kind matrix (metadata / pass-only / no-metadata).
- [ ] v1-history students see no new empty-star pressure.
- [ ] 1-star pass presentation is celebratory, not deficient (owner-approved copy).
- [ ] Accessibility items verified (text equivalents, not color-only, reduced motion, narrow viewport).
- [ ] `npm test`, `npm run build`, `npm run test:browser:smoke` pass; new test file registered.
- [ ] Copy follows CopyVoiceContract; no new `lint:levels` voice errors from added copy.
- [ ] Progress report records gate approval, commands, remaining risks.

## Stop Conditions

Stop and ask for owner review if:

- The ledger read path requires writes or evaluator changes (plan-111's surface is wrong — surface, don't patch around).
- Presentation choices drift toward grading, ranking, or comparison-between-students.
- The banner/picker changes would alter mode-visibility rules in `ui-mode-contract.md` beyond a same-patch note update.
- Any copy decision feels like pedagogy judgment beyond the approved gate text — surface it.
