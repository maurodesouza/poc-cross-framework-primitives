import { describe, expect, it } from "vitest";
import { chipKeyTarget } from "../../src/collection/chip-keys.ts";

describe("chipKeyTarget", () => {
    it("moves between chips, and back to the input past either end", () => {
        expect(chipKeyTarget("ArrowLeft", 1, 3, false)).toEqual({ focus: 0 });
        expect(chipKeyTarget("ArrowLeft", 0, 3, false)).toEqual({
            focus: "input",
        });
        expect(chipKeyTarget("ArrowRight", 1, 3, false)).toEqual({ focus: 2 });
        expect(chipKeyTarget("ArrowRight", 2, 3, false)).toEqual({
            focus: "input",
        });
        expect(chipKeyTarget("ArrowRight", 1, 3, true)).toEqual({ focus: 0 });
    });

    it("removes a chip and focuses the one at its place, or the previous one", () => {
        expect(chipKeyTarget("Backspace", 0, 3, false)).toEqual({
            focus: 0,
            remove: true,
        });
        expect(chipKeyTarget("Delete", 2, 3, false)).toEqual({
            focus: 1,
            remove: true,
        });
        expect(chipKeyTarget("Backspace", 0, 1, false)).toEqual({
            focus: "input",
            remove: true,
        });
    });

    it("hands the other keys to the input", () => {
        expect(chipKeyTarget("Enter", 0, 2, false)).toEqual({ focus: "input" });
        expect(chipKeyTarget("ArrowDown", 0, 2, false)).toEqual({
            focus: "input",
            open: true,
        });
        expect(chipKeyTarget("a", 0, 2, false)).toEqual({ focus: "input" });
        expect(chipKeyTarget("Tab", 0, 2, false)).toBeNull();
    });
});
