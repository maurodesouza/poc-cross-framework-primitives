/**
 * A calendar date with no time and no time zone (spec/calendar.md, "Dates"). `month` is 1–12.
 * Values are plain, immutable objects: every function returns a new one.
 */
export interface PlainDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;
}

/** A range of dates, `start <= end`. */
export interface DateRange {
    readonly start: PlainDate;
    readonly end: PlainDate;
}

/** Builds a date, normalizing overflow (`{ month: 13 }` is January of the next year). */
export function plainDate(year: number, month: number, day: number): PlainDate {
    const date = new Date(Date.UTC(year, month - 1, day));
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    };
}

/** The local date of `now` (the clock the page sees). */
export function today(now: Date = new Date()): PlainDate {
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    };
}

/** Negative when `a` is before `b`, positive when after, 0 when the same day. */
export function compareDates(a: PlainDate, b: PlainDate): number {
    return a.year - b.year || a.month - b.month || a.day - b.day;
}

export function isSameDate(
    a: PlainDate | null | undefined,
    b: PlainDate | null | undefined,
): boolean {
    return a != null && b != null && compareDates(a, b) === 0;
}

export function isSameMonth(a: PlainDate, b: PlainDate): boolean {
    return a.year === b.year && a.month === b.month;
}

/** `2026-11-20` */
export function toIsoDate(date: PlainDate): string {
    const pad = (value: number, size: number) =>
        String(value).padStart(size, "0");
    return `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`;
}

/** Parses `YYYY-MM-DD`; `null` when the text is not a valid date. */
export function fromIsoDate(text: string): PlainDate | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (match === null) {
        return null;
    }
    const [year, month, day] = [
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
    ];
    const date = plainDate(year, month, day);
    return date.month === month && date.day === day ? date : null;
}

/** A `Date` at local midnight of the day, for `Intl` formatting. */
export function toLocalDate(date: PlainDate): Date {
    return new Date(date.year, date.month - 1, date.day);
}
