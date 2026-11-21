import { describe, expect, it } from "vitest";
import { sliderKeyTarget } from "../../src/range/slider-keys.ts";

const options = {
    step: 1,
    largeStep: 10,
    min: 0,
    max: 100,
    orientation: "horizontal" as const,
    rtl: false,
};

describe("sliderKeyTarget", () => {
    it("moves by step, largeStep and to the bounds", () => {
        expect(sliderKeyTarget("ArrowRight", false, 50, options)).toBe(51);
        expect(sliderKeyTarget("ArrowUp", false, 50, options)).toBe(51);
        expect(sliderKeyTarget("ArrowLeft", false, 50, options)).toBe(49);
        expect(sliderKeyTarget("ArrowDown", false, 50, options)).toBe(49);
        expect(sliderKeyTarget("PageUp", false, 50, options)).toBe(60);
        expect(sliderKeyTarget("PageDown", false, 50, options)).toBe(40);
        expect(sliderKeyTarget("ArrowRight", true, 50, options)).toBe(60);
        expect(
            sliderKeyTarget("Home", false, 50, { ...options, min: 30 }),
        ).toBe(30);
        expect(sliderKeyTarget("End", false, 50, { ...options, max: 70 })).toBe(
            70,
        );
        expect(sliderKeyTarget("a", false, 50, options)).toBeNull();
    });

    it("swaps the horizontal arrows in RTL", () => {
        const rtl = { ...options, rtl: true };
        expect(sliderKeyTarget("ArrowRight", false, 50, rtl)).toBe(49);
        expect(sliderKeyTarget("ArrowLeft", false, 50, rtl)).toBe(51);
        expect(sliderKeyTarget("ArrowUp", false, 50, rtl)).toBe(51);
    });
});
