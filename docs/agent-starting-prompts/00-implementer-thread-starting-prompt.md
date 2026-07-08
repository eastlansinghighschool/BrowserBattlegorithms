# Implementer Thread Starting Prompt Compatibility Entry

Canonical prompt: [implementer-thread-starting-prompt.md](implementer-thread-starting-prompt.md)

Use the canonical prompt above when starting a lower-cost implementation thread. This compatibility entry is retained for Bootstrap audit compatibility and older handoff references.

Key guardrails preserved here:

- Before beginning an assigned packet, run `node scripts/dev/plan-status.js check <packet-id>` and stop if it reports the packet is not runnable.
- Never run `node scripts/dev/plan-status.js set`, `npm run plan:set`, or otherwise set packet status yourself; status closeout belongs to the integration owner or orchestration reviewer.
