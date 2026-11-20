import { defineConfig } from "vitest/config";

// The repository's own tests (scripts, CI guards) run as the "repo" project; every workspace
// that has tests brings its own vitest config, picked up by the globs.
export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: "repo",
                    include: ["tests/**/*.test.ts"],
                    environment: "node",
                },
            },
            "packages/*",
            "fixtures/*",
        ],
    },
});
