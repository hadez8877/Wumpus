import { defineConfig } from "vitest/config";
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 20000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src/'),
      "@db/": path.resolve(__dirname, './db/')
    },
  }
});
