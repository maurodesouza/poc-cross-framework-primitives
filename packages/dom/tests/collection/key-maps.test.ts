import { describe, expect, it } from "vitest";
import {
    menuKeyTarget,
    submenuKeys,
    tabsKeyTarget,
} from "../../src/collection/key-maps.ts";

describe("tabsKeyTarget", () => {
    const horizontal = {
        orientation: "horizontal" as const,
        rtl: false,
        loop: true,
    };
    it("moves along the orientation, mirrored in RTL, and wraps", () => {
        expect(tabsKeyTarget("ArrowRight", 0, 4, horizontal)).toBe(1);
        expect(tabsKeyTarget("ArrowRight", 3, 4, horizontal)).toBe(0);
        expect(
            tabsKeyTarget("ArrowLeft", 0, 4, { ...horizontal, rtl: true }),
        ).toBe(1);
        expect(
            tabsKeyTarget("ArrowDown", 0, 4, {
                ...horizontal,
                orientation: "vertical",
            }),
        ).toBe(1);
        expect(
            tabsKeyTarget("ArrowRight", 0, 4, {
                ...horizontal,
                orientation: "vertical",
            }),
        ).toBeNull();
        expect(tabsKeyTarget("End", 0, 4, horizontal)).toBe(3);
        expect(tabsKeyTarget("Enter", 0, 4, horizontal)).toBeNull();
    });
});

describe("menuKeyTarget and submenuKeys", () => {
    it("moves through items and knows the submenu keys", () => {
        expect(menuKeyTarget("ArrowDown", -1, 3, { loop: true })).toBe(0);
        expect(menuKeyTarget("ArrowUp", 0, 3, { loop: true })).toBe(2);
        expect(menuKeyTarget("ArrowUp", 0, 3, { loop: false })).toBe(0);
        expect(menuKeyTarget("Home", 2, 3, { loop: true })).toBe(0);
        expect(menuKeyTarget("x", 0, 3, { loop: true })).toBeNull();
        expect(submenuKeys(false)).toEqual({
            open: "ArrowRight",
            close: "ArrowLeft",
        });
        expect(submenuKeys(true)).toEqual({
            open: "ArrowLeft",
            close: "ArrowRight",
        });
    });
});
