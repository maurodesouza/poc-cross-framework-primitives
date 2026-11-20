import { compareDates, type PlainDate, plainDate } from "./plain-date.ts";

export function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(date: PlainDate, days: number): PlainDate {
    return plainDate(date.year, date.month, date.day + days);
}

/** The same day `months` later, clamped to the target month's last day (Jan 31 + 1 = Feb 28). */
export function addMonths(date: PlainDate, months: number): PlainDate {
    const first = plainDate(date.year, date.month + months, 1);
    return {
        ...first,
        day: Math.min(date.day, daysInMonth(first.year, first.month)),
    };
}

export function addYears(date: PlainDate, years: number): PlainDate {
    return addMonths(date, years * 12);
}

export function startOfMonth(date: PlainDate): PlainDate {
    return { year: date.year, month: date.month, day: 1 };
}

export function endOfMonth(date: PlainDate): PlainDate {
    return {
        year: date.year,
        month: date.month,
        day: daysInMonth(date.year, date.month),
    };
}

/** 0 = Sunday … 6 = Saturday. */
export function dayOfWeek(date: PlainDate): number {
    return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/** The first day of the date's week, given the locale's first day (0 = Sunday). */
export function startOfWeek(
    date: PlainDate,
    firstDayOfWeek: number,
): PlainDate {
    return addDays(date, -((dayOfWeek(date) - firstDayOfWeek + 7) % 7));
}

export function endOfWeek(date: PlainDate, firstDayOfWeek: number): PlainDate {
    return addDays(startOfWeek(date, firstDayOfWeek), 6);
}

/** Whether `date` is inside `[min, max]` (each bound optional). */
export function isWithinBounds(
    date: PlainDate,
    min?: PlainDate | null,
    max?: PlainDate | null,
): boolean {
    return (
        (min == null || compareDates(date, min) >= 0) &&
        (max == null || compareDates(date, max) <= 0)
    );
}

/** `date` moved into `[min, max]`. */
export function clampDate(
    date: PlainDate,
    min?: PlainDate | null,
    max?: PlainDate | null,
): PlainDate {
    if (min != null && compareDates(date, min) < 0) {
        return min;
    }
    if (max != null && compareDates(date, max) > 0) {
        return max;
    }
    return date;
}

/** Whether `date` is in `[a, b]`, whatever the order of `a` and `b`. */
export function isBetween(
    date: PlainDate,
    a: PlainDate,
    b: PlainDate,
): boolean {
    const [low, high] = compareDates(a, b) <= 0 ? [a, b] : [b, a];
    return compareDates(date, low) >= 0 && compareDates(date, high) <= 0;
}

/** The difference in whole months from `a`'s month to `b`'s month. */
export function monthsBetween(a: PlainDate, b: PlainDate): number {
    return (b.year - a.year) * 12 + (b.month - a.month);
}
