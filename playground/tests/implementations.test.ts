import { describe, expect, it } from "vitest";
import { IMPLEMENTATIONS } from "../../conformance/src/implementations.ts";
import {
    defaultImplementations,
    shownImplementations,
} from "../src/kit/implementations.ts";
import { isRunning } from "../src/kit/probe.ts";

const names = (list: readonly { name: string }[]) =>
    list.map((implementation) => implementation.name);

describe("the implementations the playground shows", () => {
    it("are every framework, without the baseline, by default", () => {
        expect(names(defaultImplementations(IMPLEMENTATIONS))).toEqual([
            "react",
            "vue",
            "svelte",
            "solid",
            "angular",
        ]);
        expect(names(shownImplementations(IMPLEMENTATIONS, undefined))).toEqual(
            names(defaultImplementations(IMPLEMENTATIONS)),
        );
    });

    it("are the launched ones, in the suite's order", () => {
        expect(
            names(shownImplementations(IMPLEMENTATIONS, "solid, vue,qwik")),
        ).toEqual(["vue", "solid"]);
        expect(
            names(shownImplementations(IMPLEMENTATIONS, "react,baseline")),
        ).toEqual(["baseline", "react"]);
    });
});

describe("the dev server probe", () => {
    it("is running when the request resolves", async () => {
        const fetcher = (async () => new Response()) as typeof fetch;
        expect(await isRunning("http://localhost:1", fetcher)).toBe(true);
    });

    it("is stopped when the request rejects", async () => {
        const fetcher = (async () => {
            throw new TypeError("Failed to fetch");
        }) as typeof fetch;
        expect(await isRunning("http://localhost:1", fetcher)).toBe(false);
    });
});
