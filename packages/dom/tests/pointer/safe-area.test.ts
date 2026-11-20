import { describe, expect, it } from "vitest";
import { isInSafeArea } from "../../src/pointer/safe-area.ts";

function submenuAt(
    left: number,
    top: number,
    width: number,
    height: number,
): Element {
    return {
        getBoundingClientRect: () => ({
            left,
            top,
            right: left + width,
            bottom: top + height,
        }),
    } as Element;
}

describe("isInSafeArea", () => {
    const submenu = submenuAt(200, 100, 150, 120);
    const from = { x: 190, y: 130 };

    it("accepts points heading to the submenu, to the right or the left", () => {
        expect(isInSafeArea({ x: 195, y: 150 }, from, submenu)).toBe(true);
        expect(isInSafeArea({ x: 198, y: 115 }, from, submenu)).toBe(true);
        expect(
            isInSafeArea(
                { x: 160, y: 130 },
                { x: 170, y: 130 },
                submenuAt(0, 100, 150, 120),
            ),
        ).toBe(true);
    });

    it("refuses points leaving the triangle", () => {
        expect(isInSafeArea({ x: 180, y: 160 }, from, submenu)).toBe(false);
        expect(isInSafeArea({ x: 195, y: 300 }, from, submenu)).toBe(false);
    });
});
