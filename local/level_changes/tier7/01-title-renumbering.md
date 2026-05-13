---
status: COMPLETE
tier: 7
level-id: [all levels from jump-if-ready to advanced-scrimmage]
level-title: "Title Renumbering"
change-type: title string updates (19 levels)
target-file: src/config/levels.js
---

## Summary
After Tier 5 (removal of `enemy-side-decision-making`) and Tier 6 (insertion of three synthesis levels), all existing levels from `jump-if-ready` onward need their title number updated. This file contains the complete find/replace map for all 19 affected `title:` fields.

**Apply this file LAST — after all Tier 1–6 changes are COMPLETE.**

The three synthesis level titles were already set correctly in Tier 6 (`"Challenge 15: Dodge and Deliver"`, `"Challenge 22: Show What You Know"`, `"Challenge 28: Full Team Tactics"`). Do not change those.

## Final level numbering after all changes
| id | old title | new title |
|----|-----------|-----------|
| jump-the-gap | Level 14: Jump the Gap | Level 14 (unchanged) |
| **dodge-and-deliver** | *(new)* | Challenge 15: Dodge and Deliver |
| jump-if-ready | Level 15: Jump If Ready | **Level 16: Jump If Ready** |
| build-the-barrier | Level 16: Build the Barrier | **Level 17: Build the Barrier** |
| stay-still-can-do-something | Level 17: Stay Still Can Do Something | **Level 18: Stay Still Can Do Something** |
| relay-race | Level 18: Relay Race | **Level 19: Relay Race** |
| my-side-their-side | Level 19: My Side, Their Side | **Level 20: My Side, Their Side** |
| freeze-the-lane | Level 20: Freeze the Lane | **Level 21: Freeze the Lane** |
| **show-what-you-know** | *(new)* | Challenge 22: Show What You Know |
| closest-threat | Level 21: Closest Threat | **Level 23: Closest Threat** |
| how-far-away | Level 22: How Far Away? | **Level 24: How Far Away?** |
| two-conditions-at-once | Level 23: Two Conditions At Once | **Level 25: Two Conditions At Once** |
| this-or-that | Level 24: This Or That | **Level 26: This Or That** |
| flip-the-answer | Level 25: Flip The Answer | **Level 27: Flip The Answer** |
| enemy-side-decision-making | *(removed)* | *(removed)* |
| **full-team-tactics** | *(new)* | Challenge 28: Full Team Tactics |
| one-program-two-allies | Level 27: One Program, Two Allies | **Level 29: One Program, Two Allies** |
| index-jobs | Level 28: Index Jobs | **Level 30: Index Jobs** |
| first-two-defend | Level 29: First Two Defend | **Level 31: First Two Defend** |
| escort-the-carrier | Level 30: Escort The Carrier | **Level 32: Escort The Carrier** |
| closest-enemy-defender | Level 31: Closest Enemy Defender | **Level 33: Closest Enemy Defender** |
| freeze-support | Level 32: Freeze Support | **Level 34: Freeze Support** |
| barrier-specialist | Level 33: Barrier Specialist | **Level 35: Barrier Specialist** |
| jump-team | Level 34: Jump Team | **Level 36: Jump Team** |
| advanced-scrimmage | Level 35: Advanced Scrimmage | **Level 37: Advanced Scrimmage** |

## What to Read
- `src/config/levels.js` — each level object listed above. Use the `id` field to locate each object, then find its `title` field.

## What to Change
For each level below, find the `title:` line by first locating the level by its `id`, then apply the exact find/replace on the `title:` line only.

---

### 1. jump-if-ready
Find: `    title: "Level 15: Jump If Ready",`
Replace: `    title: "Level 16: Jump If Ready",`

### 2. build-the-barrier
Find: `    title: "Level 16: Build the Barrier",`
Replace: `    title: "Level 17: Build the Barrier",`

### 3. stay-still-can-do-something
Find: `    title: "Level 17: Stay Still Can Do Something",`
Replace: `    title: "Level 18: Stay Still Can Do Something",`

### 4. relay-race
Find: `    title: "Level 18: Relay Race",`
Replace: `    title: "Level 19: Relay Race",`

### 5. my-side-their-side
Find: `    title: "Level 19: My Side, Their Side",`
Replace: `    title: "Level 20: My Side, Their Side",`

### 6. freeze-the-lane
Find: `    title: "Level 20: Freeze the Lane",`
Replace: `    title: "Level 21: Freeze the Lane",`

### 7. closest-threat
Find: `    title: "Level 21: Closest Threat",`
Replace: `    title: "Level 23: Closest Threat",`

### 8. how-far-away
Find: `    title: "Level 22: How Far Away?",`
Replace: `    title: "Level 24: How Far Away?",`

### 9. two-conditions-at-once
Find: `    title: "Level 23: Two Conditions At Once",`
Replace: `    title: "Level 25: Two Conditions At Once",`

### 10. this-or-that
Find: `    title: "Level 24: This Or That",`
Replace: `    title: "Level 26: This Or That",`

### 11. flip-the-answer
Find: `    title: "Level 25: Flip The Answer",`
Replace: `    title: "Level 27: Flip The Answer",`

### 12. one-program-two-allies
Find: `    title: "Level 27: One Program, Two Allies",`
Replace: `    title: "Level 29: One Program, Two Allies",`

### 13. index-jobs
Find: `    title: "Level 28: Index Jobs",`
Replace: `    title: "Level 30: Index Jobs",`

### 14. first-two-defend
Find: `    title: "Level 29: First Two Defend",`
Replace: `    title: "Level 31: First Two Defend",`

### 15. escort-the-carrier
Find: `    title: "Level 30: Escort The Carrier",`
Replace: `    title: "Level 32: Escort The Carrier",`

### 16. closest-enemy-defender
Find: `    title: "Level 31: Closest Enemy Defender",`
Replace: `    title: "Level 33: Closest Enemy Defender",`

### 17. freeze-support
Find: `    title: "Level 32: Freeze Support",`
Replace: `    title: "Level 34: Freeze Support",`

### 18. barrier-specialist
Find: `    title: "Level 33: Barrier Specialist",`
Replace: `    title: "Level 35: Barrier Specialist",`

### 19. jump-team
Find: `    title: "Level 34: Jump Team",`
Replace: `    title: "Level 36: Jump Team",`

### 20. advanced-scrimmage
Find: `    title: "Level 35: Advanced Scrimmage",`
Replace: `    title: "Level 37: Advanced Scrimmage",`

---

## What NOT to Change
- The `id` field of any level — never change level ids.
- Level titles for levels 1–14 — these are unchanged.
- The titles of `dodge-and-deliver`, `show-what-you-know`, `full-team-tactics` — set correctly in Tier 6.
- The title of `optional-random-lab` — this is an optional level outside the main sequence, not numbered.
- Any `description`, `introText`, `tutorialSteps`, or other field.

## Verification
After all 20 replacements:
1. Search for `"Level 15:"` — should find only `dodge-and-deliver` (Challenge 15).
2. Search for `"Level 22:"` — should find only `show-what-you-know` (Challenge 22).
3. Search for `"Level 26:"` — should not appear (enemy-side-decision-making was removed; Level 26 is now `this-or-that`).
4. Search for `"Level 28:"` — should find only `full-team-tactics` (Challenge 28).
5. Search for `"Level 37:"` — should find `advanced-scrimmage`.

## Log Entry Template
```
## tier7/01-title-renumbering.md — [DATE]
- Levels renamed: 20 title strings updated
- jump-if-ready: 15 → 16
- build-the-barrier: 16 → 17
- stay-still-can-do-something: 17 → 18
- relay-race: 18 → 19
- my-side-their-side: 19 → 20
- freeze-the-lane: 20 → 21
- closest-threat: 21 → 23
- how-far-away: 22 → 24
- two-conditions-at-once: 23 → 25
- this-or-that: 24 → 26
- flip-the-answer: 25 → 27
- one-program-two-allies: 27 → 29
- index-jobs: 28 → 30
- first-two-defend: 29 → 31
- escort-the-carrier: 30 → 32
- closest-enemy-defender: 31 → 33
- freeze-support: 32 → 34
- barrier-specialist: 33 → 35
- jump-team: 34 → 36
- advanced-scrimmage: 35 → 37
- Status: COMPLETE
```
