import { describe, expect, it } from "vitest";
import { monthGrid } from "../../src/date/month-grid.ts";
import { toIsoDate } from "../../src/date/plain-date.ts";

describe("monthGrid", () => {
    it("always has 6 weeks of 7 days starting on the first day of the week", () => {
        const sunday = monthGrid(2026, 11, 0);
        expect(sunday).toHaveLength(6);
        expect(sunday.every((week) => week.length === 7)).toBe(true);
        expect(toIsoDate(sunday[0]?.[0] as never)).toBe("2026-11-01");
        expect(toIsoDate(sunday[5]?.[6] as never)).toBe("2026-12-12");
        const monday = monthGrid(2026, 11, 1);
        expect(toIsoDate(monday[0]?.[0] as never)).toBe("2026-10-26");
    });
});
