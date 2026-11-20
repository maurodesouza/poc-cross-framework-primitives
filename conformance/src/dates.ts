/** The full date name of a calendar cell (spec/calendar.md: `Intl` `dateStyle: "full"`). */
export function fullDate(
    locale: string,
    year: number,
    month: number,
    day: number,
): string {
    return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
        new Date(year, month - 1, day),
    );
}

/** A month heading (`Intl` `month: "long", year: "numeric"`). */
export function monthHeading(
    locale: string,
    year: number,
    month: number,
): string {
    return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, 1));
}

/** A weekday's short name (`Intl` `weekday: "short"`), from any date on that weekday. */
export function shortWeekday(
    locale: string,
    year: number,
    month: number,
    day: number,
): string {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        new Date(year, month - 1, day),
    );
}
