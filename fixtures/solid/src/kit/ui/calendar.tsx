import {
    Calendar as Primitive,
    RangeCalendar as RangePrimitive,
} from "@poc/solid";
import { calendar } from "@poc/styles";
import type { ComponentProps } from "solid-js";

const parts = {
    Heading: (props: ComponentProps<typeof Primitive.Heading>) => (
        <Primitive.Heading class={calendar.heading} {...props} />
    ),
    PrevButton: (props: ComponentProps<typeof Primitive.PrevButton>) => (
        <Primitive.PrevButton class={calendar["prev-button"]} {...props} />
    ),
    NextButton: (props: ComponentProps<typeof Primitive.NextButton>) => (
        <Primitive.NextButton class={calendar["next-button"]} {...props} />
    ),
    Grid: (props: ComponentProps<typeof Primitive.Grid>) => (
        <Primitive.Grid class={calendar.grid} {...props} />
    ),
    GridHeader: (props: ComponentProps<typeof Primitive.GridHeader>) => (
        <Primitive.GridHeader {...props}>
            {(weekday) => (
                <Primitive.HeaderCell
                    weekday={weekday}
                    class={calendar["header-cell"]}
                />
            )}
        </Primitive.GridHeader>
    ),
    GridBody: (props: ComponentProps<typeof Primitive.GridBody>) => (
        <Primitive.GridBody {...props}>
            {(week) => (
                <Primitive.Row week={week}>
                    {(date) => (
                        <Primitive.Cell date={date} class={calendar.cell} />
                    )}
                </Primitive.Row>
            )}
        </Primitive.GridBody>
    ),
};

/** The month header and one grid, as every calendar scenario shows them. */
function MonthHeader(props: { offset?: number; withButtons?: boolean }) {
    const withButtons = () => props.withButtons ?? true;
    return (
        <div class="flex items-center justify-between gap-2">
            {withButtons() ? (
                <parts.PrevButton aria-label="Previous month">
                    ‹
                </parts.PrevButton>
            ) : (
                <span class="size-8" />
            )}
            <parts.Heading offset={props.offset ?? 0} />
            {withButtons() ? (
                <parts.NextButton aria-label="Next month">›</parts.NextButton>
            ) : (
                <span class="size-8" />
            )}
        </div>
    );
}

export function MonthView(props: { offset?: number; withButtons?: boolean }) {
    return (
        <div class="flex flex-col gap-2">
            <MonthHeader
                offset={props.offset ?? 0}
                withButtons={props.withButtons ?? true}
            />
            <parts.Grid offset={props.offset ?? 0}>
                <parts.GridHeader />
                <parts.GridBody />
            </parts.Grid>
        </div>
    );
}

export const Calendar = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root class={calendar.root} {...props} />
    ),
};

export const RangeCalendar = {
    Root: (props: ComponentProps<typeof RangePrimitive.Root>) => (
        <RangePrimitive.Root class={calendar.root} {...props} />
    ),
};
