import { describe, expect, it } from "vitest";
import { countLoc } from "../scripts/metrics/loc.ts";
import { renderTables } from "../scripts/metrics/report.ts";

describe("countLoc", () => {
    it("counts code lines, not blanks or comments", () => {
        const text = [
            "// a comment",
            "import { x } from 'y';",
            "",
            "/* a block",
            "   still a comment */",
            "const a = 1; // trailing comment counts as code",
            "/** one-line doc */",
            "{/* a JSX comment */}",
            "<!-- an HTML comment -->",
            "<div />",
        ].join("\n");
        expect(countLoc(text)).toBe(3);
    });
});

describe("renderTables", () => {
    it("renders the shares, sizes and conformance counts", () => {
        const tables = renderTables({
            framework: "react",
            generatedAt: "2026-11-20T00:00:00.000Z",
            loc: {
                components: [
                    {
                        component: "dialog",
                        framework: 75,
                        dom: 25,
                        domModules: [],
                    },
                ],
                shared: 10,
                domTotal: 400,
            },
            sizes: [
                {
                    component: "dialog",
                    ours: { entry: "", minified: 4000, gzip: 2048 },
                    baseline: { entry: "", minified: 9000, gzip: 4096 },
                },
            ],
            conformance: {
                react: {
                    behaviour: {
                        passed: 3,
                        failed: 0,
                        skipped: 0,
                        expectedFailures: 0,
                    },
                },
            },
            effort: { dialog: { commits: 2, first: "a", last: "b" } },
        });
        expect(tables).toContain("| dialog | 75 | 25 | 25% |");
        expect(tables).toContain("| dialog | 2.0 kB | 4.0 kB |");
        expect(tables).toContain("| react | behaviour | 3 | 0 | 0 | 0 |");
    });
});
