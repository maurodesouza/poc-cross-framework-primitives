import type { DateRange, PlainDate } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarContext } from "./calendar-context.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "./calendar-value.ts";
import { type CalendarStateProps, createCalendar } from "./create-calendar.ts";

interface RootProps
    extends PartProps<{ disabled: boolean; readOnly: boolean }>,
        CalendarOptions {
    disabled?: boolean;
    readOnly?: boolean;
}

export interface CalendarRootProps extends RootProps {
    value?: PlainDate | null;
    defaultValue?: PlainDate | null;
    onValueChange?: (value: PlainDate | null, details: ChangeDetails) => void;
}

export interface RangeCalendarRootProps extends RootProps {
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    onValueChange?: (value: DateRange | null, details: ChangeDetails) => void;
}

const OPTION_KEYS = [
    "value",
    "defaultValue",
    "onValueChange",
    "min",
    "max",
    "isDateUnavailable",
    "locale",
    "firstDayOfWeek",
    "visibleMonths",
    "disabled",
    "readOnly",
] as const;

function renderRoot(
    mode: CalendarMode,
    props: RootProps & CalendarStateProps,
): JSX.Element {
    const context = createCalendar(mode, props);
    const state = () => ({
        disabled: context.disabled(),
        readOnly: context.readOnly(),
    });
    return (
        <CalendarContext value={context}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    "data-calendar-part": "root",
                    ...stateAttributes({
                        disabled: context.disabled(),
                        readonly: context.readOnly(),
                    }),
                }),
                { omit: OPTION_KEYS },
            )}
        </CalendarContext>
    );
}

/** One date (spec/calendar.md). Inside a DatePicker with no value of its own, it binds to it. */
export function CalendarRoot(props: CalendarRootProps) {
    return renderRoot("single", props as RootProps & CalendarStateProps);
}

/** A range of dates (spec/calendar.md). Inside a DateRangePicker, it binds to it. */
export function RangeCalendarRoot(props: RangeCalendarRootProps) {
    return renderRoot("range", props as RootProps & CalendarStateProps);
}

export type { CalendarValue };
