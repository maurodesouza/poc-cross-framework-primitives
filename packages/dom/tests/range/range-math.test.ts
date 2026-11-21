import { describe, expect, it } from "vitest";
import {
    fractionAlong,
    moveThumb,
    nearestThumb,
    snapToStep,
    thumbBounds,
    valueAtFraction,
    valueToPercent,
} from "../../src/range/range-math.ts";

const range = { min: 0, max: 100, step: 1 };

describe("snapToStep", () => {
    it("snaps to min + n × step and clamps", () => {
        expect(snapToStep(42.4, range)).toBe(42);
        expect(snapToStep(42.5, range)).toBe(43);
        expect(snapToStep(-3, range)).toBe(0);
        expect(snapToStep(130, range)).toBe(100);
        expect(snapToStep(17, { min: 5, max: 50, step: 10 })).toBe(15);
    });

    it("removes floating-point noise", () => {
        expect(
            snapToStep(0.30000000000000004, { min: 0, max: 1, step: 0.1 }),
        ).toBe(0.3);
        expect(snapToStep(0.7, { min: 0, max: 1, step: 0.1 })).toBe(0.7);
    });
});

describe("valueToPercent and valueAtFraction", () => {
    it("map a value to a percent and back", () => {
        expect(valueToPercent(25, 0, 200)).toBe(12.5);
        expect(valueToPercent(5, 5, 5)).toBe(0);
        expect(valueAtFraction(0.3, range)).toBe(30);
        expect(valueAtFraction(1.4, range)).toBe(100);
        expect(valueAtFraction(-1, range)).toBe(0);
    });
});

describe("fractionAlong", () => {
    const rect = { left: 24, top: 100, width: 200, height: 200 };
    it("runs from the inline start, or from the bottom", () => {
        expect(fractionAlong(rect, { x: 84, y: 0 }, "horizontal", false)).toBe(
            0.3,
        );
        expect(fractionAlong(rect, { x: 84, y: 0 }, "horizontal", true)).toBe(
            0.7,
        );
        expect(fractionAlong(rect, { x: 0, y: 150 }, "vertical", false)).toBe(
            0.75,
        );
        expect(
            fractionAlong(
                { ...rect, width: 0 },
                { x: 1, y: 1 },
                "horizontal",
                false,
            ),
        ).toBe(0);
    });
});

describe("thumbBounds and moveThumb", () => {
    const options = { ...range, minStepsBetweenValues: 10 };
    it("keep the minimum distance between thumbs", () => {
        expect(thumbBounds([20, 80], 0, options)).toEqual({ min: 0, max: 70 });
        expect(thumbBounds([20, 80], 1, options)).toEqual({
            min: 30,
            max: 100,
        });
        expect(thumbBounds([50], 0, options)).toEqual({ min: 0, max: 100 });
        expect(moveThumb([20, 80], 0, 95, options)).toEqual([70, 80]);
        expect(moveThumb([20, 80], 1, 3, options)).toEqual([20, 30]);
        expect(moveThumb([20, 80], 1, 95.4, options)).toEqual([20, 95]);
    });
});

describe("nearestThumb", () => {
    it("is the closest thumb; on a tie, the side the press is on", () => {
        expect(nearestThumb([20, 80], 95)).toBe(1);
        expect(nearestThumb([20, 80], 5)).toBe(0);
        expect(nearestThumb([50, 50], 60)).toBe(1);
        expect(nearestThumb([50, 50], 40)).toBe(0);
        expect(nearestThumb([50], 0)).toBe(0);
    });
});
