import { describe, expect, it } from "vitest";
import { IMPLEMENTATIONS } from "../conformance/src/implementations.ts";
import {
    PLAYGROUND_PORT,
    parseArgs,
    prefixLines,
    selectImplementations,
    serversOf,
} from "../scripts/playground.ts";

const names = (list: readonly { name: string }[]) =>
    list.map((entry) => entry.name);

// `pnpm playground` runs scripts/playground.ts.
describe("the playground launcher", () => {
    it("starts every framework, without the baseline, by default", () => {
        expect(
            names(selectImplementations(IMPLEMENTATIONS, parseArgs([]))),
        ).toEqual(["react", "vue", "svelte", "solid", "angular"]);
    });

    it("starts only the named frameworks", () => {
        for (const argv of [
            ["--framework", "vue,solid"],
            ["--framework=solid,vue"],
            ["--framework", "vue", "--framework", "solid"],
            ["--", "--framework", "vue, solid"],
        ]) {
            expect(
                names(selectImplementations(IMPLEMENTATIONS, parseArgs(argv))),
                argv.join(" "),
            ).toEqual(["vue", "solid"]);
        }
    });

    it("adds the baseline with --baseline", () => {
        expect(
            names(
                selectImplementations(
                    IMPLEMENTATIONS,
                    parseArgs(["--baseline", "--framework", "react"]),
                ),
            ),
        ).toEqual(["baseline", "react"]);
    });

    it("refuses an unknown framework or argument", () => {
        expect(() =>
            selectImplementations(
                IMPLEMENTATIONS,
                parseArgs(["--framework", "qwik"]),
            ),
        ).toThrow("unknown framework: qwik");
        expect(() =>
            selectImplementations(
                IMPLEMENTATIONS,
                parseArgs(["--framework", "baseline"]),
            ),
        ).toThrow("unknown framework: baseline");
        expect(() => parseArgs(["--framework"])).toThrow("needs a name");
        expect(() => parseArgs(["--port", "1"])).toThrow("unknown argument");
    });

    it("serves each fixture's dev server on its suite port, then the playground", () => {
        const selected = selectImplementations(
            IMPLEMENTATIONS,
            parseArgs(["--framework", "vue,angular"]),
        );
        expect(serversOf(selected)).toEqual([
            {
                name: "vue",
                args: [
                    "--filter",
                    "fixture-vue",
                    "dev",
                    "--port",
                    "5330",
                    "--strictPort",
                ],
                env: {},
            },
            {
                name: "angular",
                args: [
                    "--filter",
                    "fixture-angular",
                    "dev",
                    "--port",
                    "5360",
                    "--strictPort",
                ],
                env: {},
            },
            {
                name: "playground",
                args: [
                    "--filter",
                    "playground",
                    "dev",
                    "--port",
                    String(PLAYGROUND_PORT),
                    "--strictPort",
                ],
                env: { VITE_PLAYGROUND_IMPLEMENTATIONS: "vue,angular" },
            },
        ]);
    });

    it("prefixes each complete line and keeps the rest for the next chunk", () => {
        const first = prefixLines("vue", "", "VITE ready\n  Local: htt");
        expect(first).toEqual({
            text: "[vue] VITE ready\n",
            rest: "  Local: htt",
        });
        const second = prefixLines(
            "vue",
            first.rest,
            "p://localhost:5330/\r\n",
        );
        expect(second).toEqual({
            text: "[vue]   Local: http://localhost:5330/\n",
            rest: "",
        });
    });
});
