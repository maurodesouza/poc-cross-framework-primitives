import { describe, expect, it } from "vitest";
import { frameUrl, readState, writeState } from "../src/kit/url-state.ts";
import { SCENARIOS } from "../src/scenarios/scenarios.ts";

const IMPLEMENTATIONS = ["react", "vue", "svelte", "solid", "angular"];

function scenario(path: string) {
    const found = SCENARIOS.find((entry) => entry.path === path);
    if (found === undefined) {
        throw new Error(`no scenario ${path}`);
    }
    return found;
}

describe("the playground's URL state", () => {
    it("falls back to the first scenario, the grid and the first implementation", () => {
        expect(readState("", SCENARIOS, IMPLEMENTATIONS)).toEqual({
            path: "/dialog/basic",
            view: "grid",
            impl: "react",
        });
    });

    it("reads every field", () => {
        expect(
            readState(
                "?path=/menu/submenu&view=single&impl=vue&dir=rtl&locale=de-DE",
                SCENARIOS,
                IMPLEMENTATIONS,
            ),
        ).toEqual({
            path: "/menu/submenu",
            view: "single",
            impl: "vue",
            dir: "rtl",
            locale: "de-DE",
        });
    });

    it("ignores an unknown scenario, implementation, view or dir", () => {
        expect(
            readState(
                "?path=/nope/basic&view=list&impl=qwik&dir=up&locale=",
                SCENARIOS,
                IMPLEMENTATIONS,
            ),
        ).toEqual({ path: "/dialog/basic", view: "grid", impl: "react" });
    });

    it("writes what it reads back", () => {
        for (const search of [
            "?path=%2Ftabs%2Fmanual&view=grid",
            "?path=%2Fcalendar%2Frtl&view=single&impl=angular&dir=ltr&locale=fr-FR",
        ]) {
            const state = readState(search, SCENARIOS, IMPLEMENTATIONS);
            expect(writeState(state)).toBe(search);
        }
    });

    it("leaves the implementation out of the grid's URL", () => {
        expect(
            writeState({ path: "/tabs/manual", view: "grid", impl: "vue" }),
        ).toBe("?path=%2Ftabs%2Fmanual&view=grid");
    });
});

describe("a scenario's frame URL", () => {
    const origin = "http://localhost:5330";

    it("is the route alone when the scenario has no query", () => {
        expect(frameUrl(origin, scenario("/dialog/basic"), {})).toBe(
            "http://localhost:5330/dialog/basic",
        );
    });

    it("carries the scenario's own query", () => {
        expect(frameUrl(origin, scenario("/calendar/rtl"), {})).toBe(
            "http://localhost:5330/calendar/rtl?locale=he-IL&dir=rtl",
        );
        expect(frameUrl(origin, scenario("/popover/rtl"), {})).toBe(
            "http://localhost:5330/popover/rtl?dir=rtl",
        );
    });

    it("lets the controls override it", () => {
        expect(
            frameUrl(origin, scenario("/calendar/rtl"), {
                dir: "ltr",
                locale: "ja-JP",
            }),
        ).toBe("http://localhost:5330/calendar/rtl?locale=ja-JP");
        expect(
            frameUrl(origin, scenario("/menu/submenu"), { dir: "rtl" }),
        ).toBe("http://localhost:5330/menu/submenu?dir=rtl");
        expect(
            frameUrl(origin, scenario("/calendar/locale"), {
                locale: "en-US",
            }),
        ).toBe("http://localhost:5330/calendar/locale");
    });
});
