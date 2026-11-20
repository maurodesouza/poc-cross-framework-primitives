import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "react",
        environment: "jsdom",
        include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"],
    },
});
