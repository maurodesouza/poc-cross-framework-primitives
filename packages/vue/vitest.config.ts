import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "vue",
        environment: "jsdom",
        include: ["tests/**/*.test.ts"],
    },
});
