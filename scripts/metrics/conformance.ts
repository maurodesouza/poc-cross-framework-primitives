import { existsSync, readFileSync } from "node:fs";

export interface LayerResult {
    passed: number;
    failed: number;
    skipped: number;
    /** Expected failures (baseline deviations). */
    expectedFailures: number;
}

interface JsonSpec {
    file: string;
    tests: {
        projectName: string;
        expectedStatus: string;
        results: { status: string }[];
    }[];
}

interface JsonSuite {
    specs?: JsonSpec[];
    suites?: JsonSuite[];
    file?: string;
}

function walk(suite: JsonSuite, out: JsonSpec[]): void {
    for (const spec of suite.specs ?? []) {
        out.push(spec);
    }
    for (const child of suite.suites ?? []) {
        walk(child, out);
    }
}

/** Pass counts per project and layer, from Playwright's JSON report (`conformance/test-results/results.json`). */
export function conformanceResults(
    path: string,
): Record<string, Record<string, LayerResult>> {
    if (!existsSync(path)) {
        return {};
    }
    const report = JSON.parse(readFileSync(path, "utf8")) as {
        suites: JsonSuite[];
    };
    const specs: JsonSpec[] = [];
    for (const suite of report.suites) {
        walk(suite, specs);
    }
    const results: Record<string, Record<string, LayerResult>> = {};
    for (const spec of specs) {
        const layer =
            /(behaviour|contract|visual)\.test\.ts$/.exec(spec.file)?.[1] ??
            "other";
        for (const test of spec.tests) {
            const project = results[test.projectName] ?? {};
            results[test.projectName] = project;
            const counts = project[layer] ?? {
                passed: 0,
                failed: 0,
                skipped: 0,
                expectedFailures: 0,
            };
            project[layer] = counts;
            const status = test.results.at(-1)?.status ?? "skipped";
            if (status === "skipped") {
                counts.skipped += 1;
            } else if (
                test.expectedStatus === "failed" &&
                status === "failed"
            ) {
                counts.expectedFailures += 1;
            } else if (status === "passed") {
                counts.passed += 1;
            } else {
                counts.failed += 1;
            }
        }
    }
    return results;
}
