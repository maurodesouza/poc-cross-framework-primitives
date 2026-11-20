import { describe, expect, it } from "vitest";
import {
    addDays,
    addMonths,
    addYears,
    clampDate,
    dayOfWeek,
    daysInMonth,
    endOfWeek,
    isBetween,
    isWithinBounds,
    monthsBetween,
    startOfWeek,
} from "../../src/date/date-math.ts";
import {
    compareDates,
    fromIsoDate,
    plainDate,
    toIsoDate,
} from "../../src/date/plain-date.ts";

const d = (iso: string) =>
    fromIsoDate(iso) ??
    (() => {
        throw new Error(iso);
    })();

describe("plain dates", () => {
    it("normalizes overflow and round-trips ISO strings", () => {
        expect(plainDate(2026, 13, 1)).toEqual({
            year: 2027,
            month: 1,
            day: 1,
        });
        expect(plainDate(2026, 3, 0)).toEqual({
            year: 2026,
            month: 2,
            day: 28,
        });
        expect(toIsoDate(d("2026-11-20"))).toBe("2026-11-20");
        expect(fromIsoDate("2026-02-30")).toBeNull();
        expect(fromIsoDate("nope")).toBeNull();
    });

    it("compares by year, month, then day", () => {
        expect(compareDates(d("2026-11-20"), d("2026-11-21"))).toBeLessThan(0);
        expect(compareDates(d("2027-01-01"), d("2026-12-31"))).toBeGreaterThan(
            0,
        );
        expect(compareDates(d("2026-11-20"), d("2026-11-20"))).toBe(0);
    });
});

describe("date math", () => {
    it("knows leap years", () => {
        expect(daysInMonth(2024, 2)).toBe(29);
        expect(daysInMonth(2026, 2)).toBe(28);
        expect(daysInMonth(2026, 11)).toBe(30);
    });

    it("adds days across months and years", () => {
        expect(toIsoDate(addDays(d("2026-11-30"), 1))).toBe("2026-12-01");
        expect(toIsoDate(addDays(d("2026-12-31"), 1))).toBe("2027-01-01");
        expect(toIsoDate(addDays(d("2026-03-01"), -1))).toBe("2026-02-28");
    });

    it("clamps the day when adding months and years", () => {
        expect(toIsoDate(addMonths(d("2026-01-31"), 1))).toBe("2026-02-28");
        expect(toIsoDate(addMonths(d("2026-11-28"), 1))).toBe("2026-12-28");
        expect(toIsoDate(addMonths(d("2026-01-15"), -1))).toBe("2025-12-15");
        expect(toIsoDate(addYears(d("2024-02-29"), 1))).toBe("2025-02-28");
    });

    it("finds weeks by the locale's first day", () => {
        // 2026-11-20 is a Friday
        expect(dayOfWeek(d("2026-11-20"))).toBe(5);
        expect(toIsoDate(startOfWeek(d("2026-11-20"), 0))).toBe("2026-11-15");
        expect(toIsoDate(startOfWeek(d("2026-11-20"), 1))).toBe("2026-11-16");
        expect(toIsoDate(endOfWeek(d("2026-11-20"), 1))).toBe("2026-11-22");
        expect(toIsoDate(startOfWeek(d("2026-11-21"), 6))).toBe("2026-11-21");
    });

    it("checks and clamps bounds", () => {
        const min = d("2026-11-10");
        const max = d("2026-12-05");
        expect(isWithinBounds(d("2026-11-09"), min, max)).toBe(false);
        expect(isWithinBounds(d("2026-11-10"), min, max)).toBe(true);
        expect(isWithinBounds(d("2026-12-06"), min, null)).toBe(true);
        expect(toIsoDate(clampDate(d("2026-11-01"), min, max))).toBe(
            "2026-11-10",
        );
        expect(toIsoDate(clampDate(d("2027-01-01"), min, max))).toBe(
            "2026-12-05",
        );
    });

    it("tests ranges in either order and counts months", () => {
        expect(
            isBetween(d("2026-11-12"), d("2026-11-15"), d("2026-11-10")),
        ).toBe(true);
        expect(
            isBetween(d("2026-11-16"), d("2026-11-10"), d("2026-11-15")),
        ).toBe(false);
        expect(monthsBetween(d("2026-11-20"), d("2027-02-01"))).toBe(3);
    });
});
