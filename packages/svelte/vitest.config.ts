import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "svelte",
        environment: "node",
        include: ["tests/**/*.test.ts"],
    },
});
