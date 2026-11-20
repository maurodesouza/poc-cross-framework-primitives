import {
    Calendar as Primitive,
    RangeCalendar as RangePrimitive,
} from "@poc/react";
import { calendar } from "@poc/styles";
import type { ComponentProps } from "react";

const parts = {
    Heading: (props: ComponentProps<typeof Primitive.Heading>) => (
        <Primitive.Heading className={calendar.heading} {...props} />
    ),
    PrevButton: (props: ComponentProps<typeof Primitive.PrevButton>) => (
        <Primitive.PrevButton className={calendar["prev-button"]} {...props} />
    ),
    NextButton: (props: ComponentProps<typeof Primitive.NextButton>) => (
        <Primitive.NextButton className={calendar["next-button"]} {...props} />
    ),
    Grid: (props: ComponentProps<typeof Primitive.Grid>) => (
        <Primitive.Grid className={calendar.grid} {...props} />
    ),
    GridHeader: (props: ComponentProps<typeof Primitive.GridHeader>) => (
        <Primitive.GridHeader {...props}>
            {(weekday) => (
                <Primitive.HeaderCell
                    key={weekday.index}
                    weekday={weekday}
                    className={calendar["header-cell"]}
                />
            )}
        </Primitive.GridHeader>
    ),
    GridBody: (props: ComponentProps<typeof Primitive.GridBody>) => (
        <Primitive.GridBody {...props}>
            {(week) => (
                <Primitive.Row
                    key={`${week[0]?.year}-${week[0]?.month}-${week[0]?.day}`}
                    week={week}
                >
                    {(date) => (
                        <Primitive.Cell
                            key={`${date.year}-${date.month}-${date.day}`}
                            date={date}
                            className={calendar.cell}
                        />
                    )}
                </Primitive.Row>
            )}
        </Primitive.GridBody>
    ),
};

/** The month header and one grid, as every calendar scenario shows them. */
function MonthHeader({
    offset = 0,
    withButtons = true,
}: {
    offset?: number;
    withButtons?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-2">
            {withButtons ? (
                <parts.PrevButton aria-label="Previous month">
                    ‹
                </parts.PrevButton>
            ) : (
                <span className="size-8" />
            )}
            <parts.Heading offset={offset} />
            {withButtons ? (
                <parts.NextButton aria-label="Next month">›</parts.NextButton>
            ) : (
                <span className="size-8" />
            )}
        </div>
    );
}

export function MonthView({
    offset = 0,
    withButtons = true,
}: {
    offset?: number;
    withButtons?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2">
            <MonthHeader offset={offset} withButtons={withButtons} />
            <parts.Grid offset={offset}>
                <parts.GridHeader />
                <parts.GridBody />
            </parts.Grid>
        </div>
    );
}

export const Calendar = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root className={calendar.root} {...props} />
    ),
};

export const RangeCalendar = {
    Root: (props: ComponentProps<typeof RangePrimitive.Root>) => (
        <RangePrimitive.Root className={calendar.root} {...props} />
    ),
};
