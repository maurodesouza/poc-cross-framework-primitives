import { describe, expect, it } from "vitest";
import { fromPlacement, toPlacement } from "../../src/positioning/placement.ts";

describe("logical placement", () => {
    it("maps logical sides to physical ones by direction", () => {
        expect(toPlacement("bottom", "center", "ltr")).toBe("bottom");
        expect(toPlacement("end", "center", "ltr")).toBe("right");
        expect(toPlacement("end", "center", "rtl")).toBe("left");
        expect(toPlacement("start", "start", "ltr")).toBe("left-start");
        expect(toPlacement("bottom", "start", "ltr")).toBe("bottom-start");
        expect(toPlacement("bottom", "start", "rtl")).toBe("bottom-end");
    });

    it("maps a resolved placement back to logical terms", () => {
        expect(fromPlacement("top", "ltr")).toEqual({
            side: "top",
            align: "center",
        });
        expect(fromPlacement("left", "rtl")).toEqual({
            side: "end",
            align: "center",
        });
        expect(fromPlacement("bottom-end", "rtl")).toEqual({
            side: "bottom",
            align: "start",
        });
        expect(fromPlacement("right-start", "ltr")).toEqual({
            side: "end",
            align: "start",
        });
    });
});
