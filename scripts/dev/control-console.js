const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { buildPackageScriptInvocation, spawnPackageScript } = require("../lib/package-scripts.js");

const commandRegistry = {
  devLifecycle: {
    label: "Local Dev Lifecycle",
    actions: [
      { id: "dev", label: "Start Vite dev server", script: "dev", confirm: false },
      { id: "preview", label: "Preview production build", script: "preview", confirm: false }
    ]
  },
  testsBuilds: {
    label: "Tests and Builds",
    actions: [
      { id: "test", label: "Run all unit tests", script: "test", confirm: false },
      { id: "build", label: "Build production assets", script: "build", confirm: false },
      { id: "test:browser:smoke", label: "Run browser smoke tests", script: "test:browser:smoke", confirm: false },
      { id: "test:browser:tooling", label: "Run browser tooling tests", script: "test:browser:tooling", confirm: false }
    ]
  },
  packetStatus: {
    label: "Packet Status",
    actions: [
      { id: "plan:list", label: "List active plans/packets", script: "plan:list", confirm: false },
      { id: "plan:check", label: "Check plan dependencies", script: "plan:check", confirm: false, promptArgs: [{ label: "Plan ID" }] },
      { id: "plan:lint", label: "Lint packet frontmatter", script: "plan:lint", confirm: false },
      { id: "plan:render", label: "Re-render plan index (README)", script: "plan:render", confirm: true },
      { id: "plan:set", label: "Set plan status", script: "plan:set", confirm: true, promptArgs: [{ label: "Plan ID" }, { label: "New Status" }], orchestratorWarning: true }
    ]
  },
  guidedLevel: {
    label: "Guided-Level Tooling",
    actions: [
      { id: "lint:levels", label: "Lint level definitions", script: "lint:levels", confirm: false },
      { id: "level:readiness", label: "Verify level readiness", script: "level:readiness", confirm: false, promptArgs: [{ label: "Level ID", flag: "--level" }] },
      { id: "level:dossiers", label: "Generate level dossiers", script: "level:dossiers", confirm: true },
      { id: "level:behavior-evidence", label: "Generate level behavior evidence", script: "level:behavior-evidence", confirm: true }
    ]
  },
  usageAdmin: {
    label: "Usage / Admin Tooling",
    actions: [
      { id: "analyze:usage", label: "Analyze exported usage logs", script: "analyze:usage", confirm: false },
      { id: "usage:cohort", label: "Anonymize cohort usage folder", script: "usage:cohort", confirm: true, promptArgs: [{ label: "Cohort ID", flag: "--cohort" }], cohortReminder: true }
    ]
  }
};

function buildActionArgs(action, answers = []) {
  const args = [];
  if (!action.promptArgs) {
    return args;
  }
  action.promptArgs.forEach((promptObj, index) => {
    const isObject = typeof promptObj === "object" && promptObj !== null;
    const flag = isObject ? promptObj.flag : null;
    const answer = answers[index];
    if (answer !== undefined) {
      if (flag) {
        args.push(flag);
      }
      args.push(answer);
    }
  });
  return args;
}

async function executeAction(rl, action) {
  const answers = [];
  if (action.promptArgs) {
    for (const promptObj of action.promptArgs) {
      const label = typeof promptObj === "object" && promptObj !== null ? promptObj.label : promptObj;
      const response = await rl.question(`Enter ${label}: `);
      const val = response.trim();
      if (!val) {
        console.log("Error: Input cannot be empty.");
        await rl.question("\nPress Enter to continue...");
        return;
      }
      answers.push(val);
    }
  }

  const args = buildActionArgs(action, answers);
  const invocation = buildPackageScriptInvocation(action.script, args);

  if (action.confirm) {
    console.log("\n========================================");
    console.log("  WARNING: CONFIRMATION REQUIRED");
    console.log("========================================");
    if (action.orchestratorWarning) {
      console.log("[WARNING] plan:set is normally an orchestrator-only command.");
      console.log("Improper state changes may violate dependency tracks.");
    }
    if (action.cohortReminder) {
      console.log("[REMINDER] Real cohort files reside in the git-ignored local/usage-cohorts/ folder.");
    }
    console.log(`Proposed Command: ${invocation.displayString}`);
    console.log("========================================");

    const answer = await rl.question("Are you sure you want to run this? (y/N): ");
    if (answer.trim().toLowerCase() !== "y") {
      console.log("\nCommand cancelled. Returning to menu.");
      await rl.question("\nPress Enter to continue...");
      return;
    }
  }

  console.log(`\nExecuting: ${invocation.displayString}\n`);
  
  const result = spawnPackageScript(invocation);

  console.log("\n----------------------------------------");
  if (result.isLaunchError) {
    console.error(`[LAUNCH ERROR] Failed to start command: ${result.error?.message || result.error}`);
  } else if (!result.success) {
    console.error(`[ERROR] Command failed with exit code: ${result.status}`);
  } else {
    console.log("[SUCCESS] Command completed successfully.");
  }
  console.log("----------------------------------------");

  await rl.question("\nPress Enter to continue...");
}

async function mainLoop() {
  const rl = readline.createInterface({ input, output });

  try {
    const keys = Object.keys(commandRegistry);
    while (true) {
      console.clear();
      console.log("==================================================");
      console.log("     Browser Battlegorithms Developer Console     ");
      console.log("==================================================");
      keys.forEach((key, index) => {
        console.log(`  ${index + 1}) ${commandRegistry[key].label}`);
      });
      console.log("  0) Exit");
      console.log("==================================================");

      const choiceInput = await rl.question("Select a category: ");
      const choice = choiceInput.trim();

      if (choice === "0") {
        console.log("\nExiting developer console. Goodbye!\n");
        break;
      }

      const num = parseInt(choice, 10);
      if (isNaN(num) || num < 1 || num > keys.length) {
        console.log("\nInvalid selection. Press Enter to retry...");
        await rl.question("");
        continue;
      }

      const selectedKey = keys[num - 1];
      const group = commandRegistry[selectedKey];

      while (true) {
        console.clear();
        console.log("==================================================");
        console.log(`  Submenu: ${group.label}`);
        console.log("==================================================");
        group.actions.forEach((act, index) => {
          console.log(`  ${index + 1}) ${act.label} (${act.script})`);
        });
        console.log("  0) Back to Main Menu");
        console.log("==================================================");

        const subChoiceInput = await rl.question("Select an action: ");
        const subChoice = subChoiceInput.trim();

        if (subChoice === "0") {
          break;
        }

        const subNum = parseInt(subChoice, 10);
        if (isNaN(subNum) || subNum < 1 || subNum > group.actions.length) {
          console.log("\nInvalid selection. Press Enter to retry...");
          await rl.question("");
          continue;
        }

        const action = group.actions[subNum - 1];
        await executeAction(rl, action);
      }
    }
  } finally {
    rl.close();
  }
}

module.exports = {
  commandRegistry,
  mainLoop,
  buildActionArgs
};

// Run if called directly
const isMain = process.argv[1] && (
  require.main === module ||
  process.argv[1].endsWith("control-console.js")
);

if (isMain) {
  mainLoop().catch((err) => {
    console.error("Fatal error inside control console:", err);
    process.exit(1);
  });
}
