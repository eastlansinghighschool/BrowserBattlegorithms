import test from "node:test";
import assert from "node:assert/strict";
import { formatTurnNarration } from "../../src/ui/narration.js";

function makeTurnLog(events) {
  return events.map((event) => ({
    turn: event.turn ?? 5,
    kind: event.kind,
    payload: event.payload ? { ...event.payload } : {}
  }));
}

test("formatTurnNarration returns an empty string for an empty log", () => {
  assert.equal(formatTurnNarration([]), "");
});

test("formatTurnNarration summarizes a move to a final cell", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "moved",
        targetCell: { x: 3, y: 2 }
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 moved to row 3, column 4.");
});

test("formatTurnNarration summarizes a bounce against a barrier", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "stayed"
      }
    },
    {
      kind: "runner.blockedOrBounced",
      payload: {
        attemptedCell: { x: 4, y: 2 },
        reason: "barrier"
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 bounced off a barrier at row 3, column 5.");
});

test("formatTurnNarration summarizes a freeze result", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "FREEZE_OPPONENTS",
        outcome: "freeze_applied"
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 froze opponents.");
});

test("formatTurnNarration appends a flag pickup to the action sentence", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "moved",
        targetCell: { x: 3, y: 2 }
      }
    },
    {
      kind: "flag.pickedUp",
      payload: {}
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 moved to row 3, column 4 and picked up the enemy flag.");
});

test("formatTurnNarration describes a dropped flag cell", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "STAY_STILL",
        outcome: "stayed"
      }
    },
    {
      kind: "flag.dropped",
      payload: {
        cell: { x: 2, y: 1 }
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 stayed still. The enemy flag dropped at row 2, column 3.");
});

test("formatTurnNarration summarizes scoring and level completion", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "MOVE_FORWARD",
        outcome: "moved",
        targetCell: { x: 3, y: 2 }
      }
    },
    {
      kind: "team.scored",
      payload: {
        scoringTeam: 1,
        newScore: 1,
        otherScore: 0
      }
    },
    {
      kind: "level.result",
      payload: {
        result: "PASSED"
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 moved to row 3, column 4. Ally 0 returned the enemy flag to base. Team 1 scored. Score 1 to 0. Level passed.");
});

test("formatTurnNarration summarizes a frozen skip", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "STAY_STILL",
        outcome: "skipped_frozen"
      }
    }
  ]));

  assert.equal(text, "Turn 5. Ally 0 is frozen and skipped a turn.");
});

test("formatTurnNarration summarizes an unavailable resource", () => {
  const text = formatTurnNarration(makeTurnLog([
    {
      kind: "turn.started",
      payload: {
        runnerId: "runner_ally_0",
        runnerLabel: "Ally 0"
      }
    },
    {
      kind: "runner.actionResolved",
      payload: {
        actionType: "FREEZE_OPPONENTS",
        outcome: "stayed"
      }
    },
      {
        kind: "resource.unavailable",
        payload: {
          actionType: "FREEZE_OPPONENTS",
          reason: "freeze_on_cooldown"
        }
      }
    ]));

  assert.equal(text, "Turn 5. Ally 0 tried to freeze opponents, but Area Freeze was still cooling down. Ally 0 stayed still.");
});
