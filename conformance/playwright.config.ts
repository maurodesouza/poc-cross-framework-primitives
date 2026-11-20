import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { IMPLEMENTATIONS, selectedProjects } from "./src/implementations.ts";

const root = join(import.meta.dirname, "..");
const selected = selectedProjects(process.argv);
// only the fixtures of the selected projects are built and served
const served = IMPLEMENTATIONS.filter(
    (implementation) =>
        selected.length === 0 || selected.includes(implementation.name),
);

export default defineConfig({
    testDir: "tests",
    testMatch: "**/*.test.ts",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    // the JSON results feed the metrics script (Epic B)
    reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
    // One golden set for every implementation: the path leaves out the project name, so Vue,
    // Svelte, ... compare against the screenshots React made (AGENTS.md rule 4).
    snapshotPathTemplate: "{testDir}/../snapshots/{testFileDir}/{arg}{ext}",
    expect: {
        toHaveScreenshot: { animations: "disabled", caret: "hide" },
    },
    use: {
        trace: "retain-on-failure",
    },
    projects: IMPLEMENTATIONS.map((implementation) => ({
        name: implementation.name,
        testMatch: implementation.layers.map((layer) => `**/${layer}.test.ts`),
        use: {
            ...devices["Desktop Chrome"],
            baseURL: `http://localhost:${implementation.port}`,
        },
    })),
    webServer: served.map((implementation) => ({
        command: `pnpm --filter ${implementation.fixture} build && pnpm --filter ${implementation.fixture} preview --port ${implementation.port} --strictPort`,
        cwd: root,
        url: `http://localhost:${implementation.port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    })),
});
