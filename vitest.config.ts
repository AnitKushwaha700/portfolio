import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Use Node environment for server-side code (API routes, lib/)
    environment: "node",
    // Include all test files under __tests__/
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
    // Global test setup
    globals: true,
    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**", "utils/**", "constants/**", "hooks/**"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "node_modules/**"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
