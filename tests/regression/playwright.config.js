import { defineConfig } from "@playwright/test";

export default defineConfig({
  workers: 5,
  testDir: "./",
  timeout: 120000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true
  },
  globalSetup: "./global-setup.js",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120000
  }
});
