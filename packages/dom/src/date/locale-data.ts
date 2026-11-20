import { addDays, startOfWeek } from "./date-math.ts";
import { type PlainDate, toLocalDate } from "./plain-date.ts";

export interface Weekday {
    /** 0 = Sunday … 6 = Saturday. */
    readonly index: number;
    /** `Intl` `weekday: "short"`. */
    readonly short: string;
    /** `Intl` `weekday: "long"`. */
    readonly long: string;
}

// Regions whose week starts on Sunday or Saturday (CLDR), for engines without Intl week info.
const SUNDAY_REGIONS = new Set(
    "AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(
        " ",
    ),
);
const SATURDAY_REGIONS = new Set(
    "AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "),
);

interface LocaleWithWeekInfo extends Intl.Locale {
    getWeekInfo?: () => { firstDay: number };
    weekInfo?: { firstDay: number };
}

/** The locale's first day of the week, 0 = Sunday (spec/calendar.md, `firstDayOfWeek`). */
export function firstDayOfWeek(locale: string): number {
    const intlLocale = new Intl.Locale(locale) as LocaleWithWeekInfo;
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    if (info !== undefined) {
        return info.firstDay % 7;
    }
    const region = intlLocale.maximize().region ?? "";
    if (SUNDAY_REGIONS.has(region)) {
        return 0;
    }
    return SATURDAY_REGIONS.has(region) ? 6 : 1;
}

/** The seven weekdays in the locale's order. */
export function weekdays(locale: string, firstDay: number): Weekday[] {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 2026-11-01 is a Sunday: any week works, the names only depend on the weekday
    const start = startOfWeek({ year: 2026, month: 11, day: 1 }, firstDay);
    return Array.from({ length: 7 }, (_, offset) => {
        const date = addDays(start, offset);
        const local = toLocalDate(date);
        return {
            index: local.getDay(),
            short: short.format(local),
            long: long.format(local),
        };
    });
}

/** "November 2026" (`Intl` `month: "long", year: "numeric"`). */
export function formatMonthYear(locale: string, date: PlainDate): string {
    return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
    }).format(toLocalDate(date));
}

/** "Friday, November 20, 2026" (`Intl` `dateStyle: "full"`). */
export function formatFullDate(locale: string, date: PlainDate): string {
    return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
        toLocalDate(date),
    );
}

/** "20" (`Intl` `day: "numeric"`). */
export function formatDayNumber(locale: string, date: PlainDate): string {
    return new Intl.DateTimeFormat(locale, { day: "numeric" }).format(
        toLocalDate(date),
    );
}
