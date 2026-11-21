import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "playground",
        environment: "node",
        include: ["tests/**/*.test.ts"],
    },
});
