import { describe, expect, it } from "vitest";
import {
    firstDayOfWeek,
    formatFullDate,
    formatMonthYear,
    weekdays,
} from "../../src/date/locale-data.ts";

describe("locale data", () => {
    it("reads the first day of the week", () => {
        expect(firstDayOfWeek("en-US")).toBe(0);
        expect(firstDayOfWeek("de-DE")).toBe(1);
        expect(firstDayOfWeek("he-IL")).toBe(0);
    });

    it("orders the weekdays from the first day", () => {
        expect(weekdays("en-US", 0).map((day) => day.short)).toEqual([
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ]);
        const german = weekdays("de-DE", 1);
        expect(german[0]).toEqual({ index: 1, short: "Mo", long: "Montag" });
    });

    it("formats headings and full dates", () => {
        const date = { year: 2026, month: 11, day: 20 };
        expect(formatMonthYear("en-US", date)).toBe("November 2026");
        expect(formatFullDate("en-US", date)).toBe("Friday, November 20, 2026");
        expect(formatFullDate("de-DE", date)).toBe(
            "Freitag, 20. November 2026",
        );
    });
});
