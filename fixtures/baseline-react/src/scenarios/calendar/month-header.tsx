import { Button, Heading } from "react-aria-components";

/** Previous month, the heading, next month (spec/calendar.md). */
export function MonthHeader() {
    return (
        <header>
            <Button slot="previous" aria-label="Previous month">
                ‹
            </Button>
            <Heading />
            <Button slot="next" aria-label="Next month">
                ›
            </Button>
        </header>
    );
}
