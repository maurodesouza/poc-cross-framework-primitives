import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "styles",
        environment: "node",
        include: ["tests/**/*.test.ts"],
    },
});
