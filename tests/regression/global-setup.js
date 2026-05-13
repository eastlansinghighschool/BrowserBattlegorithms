import { mkdir, rm } from "node:fs/promises";
import {
  REGRESSION_OUTPUT_DIR,
  REGRESSION_SCREENSHOT_DIR,
  assertRegressionProfileFixturesAreSound
} from "./student-profiles.js";

export default async function globalSetup() {
  await assertRegressionProfileFixturesAreSound();
  await rm(REGRESSION_OUTPUT_DIR, { recursive: true, force: true });
  await rm(REGRESSION_SCREENSHOT_DIR, { recursive: true, force: true });
  await mkdir(REGRESSION_OUTPUT_DIR, { recursive: true });
  await mkdir(REGRESSION_SCREENSHOT_DIR, { recursive: true });
}
