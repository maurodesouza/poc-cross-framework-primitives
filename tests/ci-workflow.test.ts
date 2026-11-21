import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { IMPLEMENTATIONS } from "../conformance/src/implementations.ts";

const root = join(import.meta.dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

/** The manifests of the workspace: the root, `conformance` and every package and fixture. */
function manifests(): string[] {
    const dirs = ["."];
    for (const group of ["packages", "fixtures"]) {
        try {
            for (const entry of readdirSync(join(root, group), {
                withFileTypes: true,
            })) {
                if (entry.isDirectory()) {
                    dirs.push(`${group}/${entry.name}`);
                }
            }
        } catch {
            // the group does not exist yet
        }
    }
    dirs.push("conformance");
    return dirs.flatMap((dir) => {
        try {
            return [read(`${dir}/package.json`)];
        } catch {
            return [];
        }
    });
}

function pinnedPlaywright(): Set<string> {
    const versions = new Set<string>();
    for (const manifest of manifests()) {
        const json = JSON.parse(manifest) as {
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
        };
        const version =
            json.devDependencies?.["@playwright/test"] ??
            json.dependencies?.["@playwright/test"];
        if (version !== undefined) {
            versions.add(version);
        }
    }
    return versions;
}

// The E2E jobs run in Playwright's image instead of installing the browsers (Fragiola guidelines,
// repository.md#ci): its browsers are the ones of its version, so the tag follows @playwright/test.
describe("the CI workflow", () => {
    it("runs the Playwright jobs in the image of the Playwright the suites pin", () => {
        const versions = pinnedPlaywright();
        expect(versions.size).toBeLessThanOrEqual(1);
        const images = [
            ...read(".github/workflows/ci.yml").matchAll(
                /mcr\.microsoft\.com\/playwright:v([\d.]+)-noble/g,
            ),
        ].map((match) => match[1]);
        if (versions.size === 1) {
            expect(images.length).toBeGreaterThan(0);
        }
        expect(new Set(images)).toEqual(versions);
    });

    it("pins @playwright/test to an exact version", () => {
        for (const version of pinnedPlaywright()) {
            expect(version).toMatch(/^\d+\.\d+\.\d+$/);
        }
    });

    it("installs no browser", () => {
        expect(read(".github/workflows/ci.yml")).not.toContain(
            "playwright install",
        );
    });

    it("runs one E2E job per registered implementation", () => {
        const matrix = read(".github/workflows/ci.yml").match(
            /^\s+project: \[([^\]]*)\]$/m,
        );
        expect(matrix).not.toBeNull();
        const projects = (matrix?.[1] ?? "")
            .split(",")
            .map((name) => name.trim());
        expect(projects.sort()).toEqual(
            IMPLEMENTATIONS.map((implementation) => implementation.name).sort(),
        );
    });
});
