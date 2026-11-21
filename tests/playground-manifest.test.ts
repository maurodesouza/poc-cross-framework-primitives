import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
    IMPLEMENTATIONS,
    type Implementation,
} from "../conformance/src/implementations.ts";
import {
    isAvailable,
    SCENARIOS,
    type Scenario,
} from "../playground/src/scenarios/scenarios.ts";

const root = join(import.meta.dirname, "..");

/** The routes a fixture's `src/app/routes.*` declares: every `"/<component>/<scenario>"` string. */
function routesOf(source: string): string[] {
    return [...source.matchAll(/"(\/[a-z0-9-]+\/[a-z0-9-]+)"/g)].map(
        (match) => match[1] as string,
    );
}

/**
 * What differs between the manifest and each fixture's routes, as messages. A fixture serves
 * exactly the manifest's scenarios available in its implementation: none of a pending component
 * (it would be untested), every other one.
 */
function mismatches(
    scenarios: readonly Scenario[],
    fixtures: Record<string, readonly string[]>,
    implementations: readonly Implementation[] = IMPLEMENTATIONS,
): string[] {
    const problems: string[] = [];
    for (const [fixture, routes] of Object.entries(fixtures)) {
        const implementation = implementations.find(
            (entry) => entry.fixture === fixture,
        );
        for (const route of routes) {
            const entry = scenarios.find(
                (candidate) => candidate.path === route,
            );
            if (entry === undefined) {
                problems.push(
                    `${fixture} serves ${route}, the manifest lacks it`,
                );
            } else if (
                implementation !== undefined &&
                !isAvailable(implementation, entry)
            ) {
                problems.push(
                    `${fixture} serves ${route}, but ${entry.component} is pending there`,
                );
            }
        }
        for (const entry of scenarios) {
            const expected =
                implementation === undefined ||
                isAvailable(implementation, entry);
            if (expected && !routes.includes(entry.path)) {
                problems.push(
                    `the manifest has ${entry.path}, ${fixture} lacks it`,
                );
            }
        }
    }
    return problems;
}

/** Every implementation's fixture folder, found by its package name. */
function fixtureRoutes(): Record<string, string[]> {
    const folders = new Map<string, string>();
    for (const folder of readdirSync(join(root, "fixtures"))) {
        const pkg = JSON.parse(
            readFileSync(
                join(root, "fixtures", folder, "package.json"),
                "utf8",
            ),
        ) as { name: string };
        folders.set(pkg.name, folder);
    }
    const routes: Record<string, string[]> = {};
    for (const implementation of IMPLEMENTATIONS) {
        const folder = folders.get(implementation.fixture);
        if (folder === undefined) {
            throw new Error(`no fixture folder for ${implementation.fixture}`);
        }
        const app = join(root, "fixtures", folder, "src", "app");
        const file = readdirSync(app).find((name) =>
            /^routes\.tsx?$/.test(name),
        );
        if (file === undefined) {
            throw new Error(`fixtures/${folder}/src/app has no routes file`);
        }
        routes[implementation.fixture] = routesOf(
            readFileSync(join(app, file), "utf8"),
        );
    }
    return routes;
}

const manifest = SCENARIOS.map((entry) => entry.path);

// The playground's manifest (playground/src/scenarios/scenarios.ts) lists every fixture's routes.
describe("the playground's scenario manifest", () => {
    it("matches every fixture's routes", () => {
        const fixtures = fixtureRoutes();
        expect(Object.keys(fixtures)).toHaveLength(IMPLEMENTATIONS.length);
        expect(mismatches(SCENARIOS, fixtures)).toEqual([]);
    });

    it("has each route once, at /<component>/<scenario>", () => {
        expect(new Set(manifest).size).toBe(manifest.length);
        for (const entry of SCENARIOS) {
            expect(entry.path).toBe(`/${entry.component}/${entry.scenario}`);
        }
    });

    it("reads the routes of every fixture's syntax", () => {
        expect(
            routesOf(`import X from "../scenarios/dialog/dialog-basic.vue";
export const routes = { "/dialog/basic": X, "/date-picker/range": Y };`),
        ).toEqual(["/dialog/basic", "/date-picker/range"]);
        expect(
            routesOf(
                `export const ROUTES = ["/tabs/manual", "/calendar/two-months"] as const;`,
            ),
        ).toEqual(["/tabs/manual", "/calendar/two-months"]);
    });

    it("fails when a route is added to one fixture only", () => {
        const fixtures = fixtureRoutes();
        const added = {
            ...fixtures,
            "fixture-vue": [...(fixtures["fixture-vue"] ?? []), "/dialog/new"],
        };
        expect(mismatches(SCENARIOS, added)).toEqual([
            "fixture-vue serves /dialog/new, the manifest lacks it",
        ]);
    });

    it("marks a pending component's scenarios unavailable, and only there", () => {
        const fixtures = fixtureRoutes();
        const real = IMPLEMENTATIONS.find((entry) => entry.name === "vue");
        expect(real).toBeDefined();
        // Vue with Tabs pending too, besides what it really has pending
        const implementation: Implementation = {
            ...(real as Implementation),
            pending: [...(real?.pending ?? []), "tabs"],
        };
        const others = IMPLEMENTATIONS.filter((entry) => entry.name !== "vue");
        const vue = fixtures["fixture-vue"] ?? [];
        // serving a pending component's scenario is an error
        expect(
            mismatches(SCENARIOS, { "fixture-vue": vue }, [
                ...others,
                implementation,
            ]),
        ).toEqual([
            "fixture-vue serves /tabs/automatic, but tabs is pending there",
            "fixture-vue serves /tabs/manual, but tabs is pending there",
            "fixture-vue serves /tabs/vertical, but tabs is pending there",
        ]);
        // not serving it is what the manifest expects
        expect(
            mismatches(
                SCENARIOS,
                {
                    "fixture-vue": vue.filter(
                        (route) => !route.startsWith("/tabs/"),
                    ),
                },
                [...others, implementation],
            ),
        ).toEqual([]);
    });

    it("fails when a fixture drops a route", () => {
        const fixtures = fixtureRoutes();
        const dropped = {
            ...fixtures,
            "fixture-solid": (fixtures["fixture-solid"] ?? []).filter(
                (route) => route !== "/menu/groups",
            ),
        };
        expect(mismatches(SCENARIOS, dropped)).toEqual([
            "the manifest has /menu/groups, fixture-solid lacks it",
        ]);
    });
});
