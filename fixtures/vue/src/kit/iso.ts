import type { DateRange, PlainDate } from "@poc/vue";

const pad = (value: number, size: number) => String(value).padStart(size, "0");

/** `2026-11-20`, as the scenarios print dates (spec/calendar.md, "Dates"). */
export function iso(date: PlainDate | null | undefined): string | undefined {
    return date
        ? `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`
        : undefined;
}

/** `2026-11-10..2026-11-15` */
export function isoRange(
    range: DateRange | null | undefined,
): string | undefined {
    return range ? `${iso(range.start)}..${iso(range.end)}` : undefined;
}
