import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

const packageJson = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: process.env.BASE_PATH || "/",
    resolve: {
      alias: {
        "node:fs/promises": resolve(__dirname, "src/shims/nodeFsPromises.js"),
        "node:path": resolve(__dirname, "src/shims/nodePath.js"),
        "node:url": resolve(__dirname, "src/shims/nodeUrl.js")
      }
    },
    define: {
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version)
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          help: resolve(__dirname, "help.html"),
        },
      },
    },
    server: {
      host: "127.0.0.1",
      port: Number(env.DEV_PORT) || 5173
    },
    preview: {
      host: "127.0.0.1",
      port: 4173
    }
  };
});
