function getSemanticRoleForTeamId(teamId) {
  return Number(teamId) === 1 ? "player" : "opponent";
}

function getDefaultPlayDirectionForRole(role) {
  return role === "player" ? 1 : -1;
}

function deriveRunnerSlotFromId(runnerId) {
  if (runnerId.includes("HumanP")) {
    return "human";
  }
  if (runnerId.includes("AI_AllyP") && runnerId.endsWith("_3")) {
    return "ally3";
  }
  if (runnerId.includes("AI_AllyP") && runnerId.endsWith("_2")) {
    return "ally2";
  }
  if (runnerId.includes("AI_Ally")) {
    return "ally";
  }
  if (runnerId.includes("Npc1")) {
    return "npc1";
  }
  if (runnerId.includes("Npc2")) {
    return "npc2";
  }
  if (runnerId.includes("Npc3")) {
    return "npc3";
  }
  throw new Error(`Unsupported runner id in level setup: ${runnerId}`);
}

export function normalizeLegacyLevelSetup(setupOverrides = {}) {
  if (setupOverrides.teams) {
    const normalizedTeams = structuredClone(setupOverrides.teams);
    const playerDirection = normalizedTeams.player?.playDirection ?? getDefaultPlayDirectionForRole("player");
    const opponentDirection = normalizedTeams.opponent?.playDirection ?? getDefaultPlayDirectionForRole("opponent");

    if (playerDirection === opponentDirection) {
      throw new Error("Level setup requires player and opponent teams to use different playDirection values.");
    }

    return {
      pointsToWin: setupOverrides.pointsToWin || 1,
      autoStayHumanRunnerIds: [...(setupOverrides.autoStayHumanRunnerIds || [])],
      teams: {
        player: {
          playDirection: playerDirection,
          runners: structuredClone(normalizedTeams.player?.runners || [])
        },
        opponent: {
          playDirection: opponentDirection,
          runners: structuredClone(normalizedTeams.opponent?.runners || [])
        }
      },
      flags: structuredClone(setupOverrides.flags || {}),
      barriers: structuredClone(setupOverrides.barriers || [])
    };
  }

  const teams = {
    player: {
      playDirection: getDefaultPlayDirectionForRole("player"),
      runners: []
    },
    opponent: {
      playDirection: getDefaultPlayDirectionForRole("opponent"),
      runners: []
    }
  };

  for (const [runnerId, override] of Object.entries(setupOverrides.runnerOverrides || {})) {
    const teamId = Number(runnerId.split("_")[1]);
    const role = getSemanticRoleForTeamId(teamId);
    const playDirection = override.playDirection ?? teams[role].playDirection;
    if (teams[role].runners.length > 0 && teams[role].playDirection !== playDirection) {
      throw new Error(`Level setup mixes playDirection values within ${role} team.`);
    }
    teams[role].playDirection = playDirection;
    teams[role].runners.push({
      slot: deriveRunnerSlotFromId(runnerId),
      ...override
    });
  }

  const flags = Object.fromEntries(
    Object.entries(setupOverrides.flagOverrides || {}).map(([teamId, override]) => [
      getSemanticRoleForTeamId(teamId),
      { ...override }
    ])
  );

  return {
    pointsToWin: setupOverrides.pointsToWin || 1,
    autoStayHumanRunnerIds: [...(setupOverrides.autoStayHumanRunnerIds || [])],
    teams,
    flags,
    barriers: structuredClone(setupOverrides.barriers || [])
  };
}
