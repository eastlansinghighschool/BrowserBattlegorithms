import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
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
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
