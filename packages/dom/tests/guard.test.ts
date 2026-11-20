import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..");

function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? files(path) : [path];
    });
}

// AGENTS.md rule 2: @poc/dom never imports a framework, and depends on @floating-ui/dom only.
describe("the @poc/dom boundary", () => {
    it("imports no framework", () => {
        const offenders = files(join(root, "src")).filter((file) =>
            /from\s+["'](react|react-dom|vue|@angular\/[^"']+|svelte|solid-js)(\/[^"']*)?["']/.test(
                readFileSync(file, "utf8"),
            ),
        );
        expect(offenders).toEqual([]);
    });

    it("has @floating-ui/dom as its only runtime dependency", () => {
        const manifest = JSON.parse(
            readFileSync(join(root, "package.json"), "utf8"),
        ) as {
            dependencies?: Record<string, string>;
            peerDependencies?: Record<string, string>;
        };
        expect(Object.keys(manifest.dependencies ?? {})).toEqual([
            "@floating-ui/dom",
        ]);
        expect(manifest.peerDependencies).toBeUndefined();
    });
});
