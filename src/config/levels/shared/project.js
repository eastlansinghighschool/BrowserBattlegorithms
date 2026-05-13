export const STRATEGY_BRAIN_PROJECT = {
  id: "strategy-brain",
  label: "Strategy Brain"
};

export const TEAM_STRATEGY_SCRIPT_PROJECT = {
  id: "team-strategy-script",
  label: "Team Strategy Script"
};

export function createProjectMetadata(project, step, { isStart = false, isCapstone = false } = {}) {
  return {
    id: project.id,
    label: project.label,
    step,
    isStart,
    isCapstone
  };
}
