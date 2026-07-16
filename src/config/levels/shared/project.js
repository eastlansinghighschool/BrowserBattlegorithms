export const STRATEGY_BRAIN_PROJECT = {
  id: "strategy-brain",
  label: "Field Decisions",
  totalSteps: 6,
  indicatorBody: "One saved ally program. Revise it as the field changes.",
  startCalloutBody: "Your blocks carry forward. Revise the same ally program as the field changes.",
  workspaceCalloutBody: "Your blocks carry forward through Field Decisions. Revise the same ally program as the field changes."
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
    totalSteps: project.totalSteps || null,
    indicatorBody: project.indicatorBody || null,
    startCalloutBody: project.startCalloutBody || null,
    workspaceCalloutBody: project.workspaceCalloutBody || null,
    isStart,
    isCapstone
  };
}
