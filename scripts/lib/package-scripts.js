const { spawnSync } = require("node:child_process");

/**
 * Builds a platform-aware invocation object for a package script.
 * On Windows, spawns via cmd.exe /d /s /c to avoid EINVAL issues.
 * On non-Windows, spawns npm run directly.
 * 
 * @param {string} script The npm script name (e.g. "test")
 * @param {string[]} args Additional command arguments
 * @param {string} [overridePlatform] Test override for process.platform
 * @returns {{command: string, args: string[], options: object, displayString: string}}
 */
function buildPackageScriptInvocation(script, args = [], overridePlatform) {
  const platform = overridePlatform || process.platform;
  const isWindows = platform === "win32";

  if (isWindows) {
    const command = "cmd.exe";
    const runString = args.length > 0
      ? `npm run ${script} -- ${args.join(" ")}`
      : `npm run ${script}`;
    return {
      command,
      args: ["/d", "/s", "/c", runString],
      options: { shell: false },
      displayString: `npm run ${script}${args.length > 0 ? " -- " + args.join(" ") : ""}`
    };
  } else {
    const command = "npm";
    const spawnArgs = ["run", script];
    if (args.length > 0) {
      spawnArgs.push("--", ...args);
    }
    return {
      command,
      args: spawnArgs,
      options: { shell: false },
      displayString: `npm run ${script}${args.length > 0 ? " -- " + args.join(" ") : ""}`
    };
  }
}

/**
 * Spawns a package script process using the invocation object.
 * Surfaces launch errors distinctly from process exit status.
 * 
 * @param {object} invocation The invocation object built by buildPackageScriptInvocation
 * @param {object} [overrideOptions] Custom spawnSync function or custom spawn options
 * @returns {{success: boolean, error: Error|null, status: number|null, isLaunchError: boolean}}
 */
function spawnPackageScript(invocation, overrideOptions = {}) {
  const spawnFn = overrideOptions.spawnSync || spawnSync;
  
  const options = {
    ...invocation.options,
    stdio: "inherit",
    ...overrideOptions
  };
  // Prevent custom spawnSync from leaking into child_process options
  delete options.spawnSync;

  try {
    const result = spawnFn(invocation.command, invocation.args, options);
    if (!result) {
      throw new Error("No result returned from spawn function");
    }
    if (result.error) {
      return {
        success: false,
        error: result.error,
        status: null,
        isLaunchError: true
      };
    }
    return {
      success: result.status === 0,
      error: null,
      status: result.status,
      isLaunchError: false
    };
  } catch (e) {
    return {
      success: false,
      error: e,
      status: null,
      isLaunchError: true
    };
  }
}

module.exports = {
  buildPackageScriptInvocation,
  spawnPackageScript
};
