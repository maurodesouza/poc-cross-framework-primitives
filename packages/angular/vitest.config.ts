import { defineConfig } from "vitest/config";

// The package's pure internals; the directives themselves are covered by the conformance suite.
export default defineConfig({
    test: {
        name: "angular",
        environment: "jsdom",
        include: ["tests/**/*.test.ts"],
    },
});
