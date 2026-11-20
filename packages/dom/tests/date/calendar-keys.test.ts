import { describe, expect, it } from "vitest";
import { calendarKeyTarget } from "../../src/date/calendar-keys.ts";
import { toIsoDate } from "../../src/date/plain-date.ts";

const friday = { year: 2026, month: 11, day: 20 };
const target = (key: string, rtl = false, shiftKey = false) => {
    const date = calendarKeyTarget(key, friday, {
        rtl,
        firstDayOfWeek: 0,
        shiftKey,
    });
    return date === null ? null : toIsoDate(date);
};

describe("calendarKeyTarget", () => {
    it("follows the APG date grid", () => {
        expect(target("ArrowRight")).toBe("2026-11-21");
        expect(target("ArrowRight", true)).toBe("2026-11-19");
        expect(target("ArrowLeft", true)).toBe("2026-11-21");
        expect(target("ArrowDown")).toBe("2026-11-27");
        expect(target("Home")).toBe("2026-11-15");
        expect(target("End")).toBe("2026-11-21");
        expect(target("PageDown")).toBe("2026-12-20");
        expect(target("PageUp", false, true)).toBe("2025-11-20");
        expect(target("Enter")).toBeNull();
    });
});
