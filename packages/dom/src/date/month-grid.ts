import { addDays, startOfWeek } from "./date-math.ts";
import type { PlainDate } from "./plain-date.ts";

/**
 * The 6 weeks shown for a month (spec/calendar.md: always 6 rows, so the grid never changes
 * height), starting on the locale's first day of the week.
 */
export function monthGrid(
    year: number,
    month: number,
    firstDayOfWeek: number,
): PlainDate[][] {
    let cursor = startOfWeek({ year, month, day: 1 }, firstDayOfWeek);
    const weeks: PlainDate[][] = [];
    for (let week = 0; week < 6; week++) {
        const days: PlainDate[] = [];
        for (let day = 0; day < 7; day++) {
            days.push(cursor);
            cursor = addDays(cursor, 1);
        }
        weeks.push(days);
    }
    return weeks;
}
