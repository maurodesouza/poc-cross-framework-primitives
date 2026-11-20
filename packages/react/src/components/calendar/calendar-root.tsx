import type { DateRange, PlainDate } from "@poc/dom";
import { useLayoutEffect, useMemo, useRef } from "react";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarContext } from "./calendar-context.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "./calendar-value.ts";
import { type CalendarStateProps, useCalendar } from "./use-calendar.ts";

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

function CalendarRootBase({
    mode,
    ...allProps
}: RootProps & CalendarStateProps & { mode: CalendarMode }) {
    const stateProps: Record<string, unknown> = {};
    const props: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(allProps)) {
        if ((OPTION_KEYS as readonly string[]).includes(key)) {
            stateProps[key] = value;
        } else {
            props[key] = value;
        }
    }
    const {
        context: state,
        bound,
        focusKey,
    } = useCalendar(mode, stateProps as CalendarStateProps);
    // a calendar in a picker focuses its focused date when it opens (spec/calendar.md, "Focus")
    const focusRequest = useRef(bound);
    const context = useMemo(
        () => ({
            ...state,
            requestFocus: () => {
                focusRequest.current = true;
            },
            focusPending: focusRequest,
        }),
        [state],
    );
    const { cells } = state;
    // after every render while a focus is pending: a cell registers its element one render after
    // it mounts (a new month, a picker opening)
    useLayoutEffect(() => {
        if (!focusRequest.current) {
            return;
        }
        const cell = cells.get(focusKey);
        if (cell) {
            focusRequest.current = false;
            cell.focus({ preventScroll: true });
        }
    });
    const disabled = state.disabled;
    const readOnly = state.readOnly;
    return (
        <CalendarContext.Provider value={context}>
            {renderElement(
                "div",
                props,
                { disabled, readOnly },
                {
                    "data-calendar-part": "root",
                    ...stateAttributes({ disabled, readonly: readOnly }),
                },
            )}
        </CalendarContext.Provider>
    );
}

/** One date (spec/calendar.md). Inside a DatePicker with no value of its own, it binds to it. */
export function CalendarRoot(props: CalendarRootProps) {
    return (
        <CalendarRootBase
            mode="single"
            {...(props as RootProps & CalendarStateProps)}
        />
    );
}

/** A range of dates (spec/calendar.md). Inside a DateRangePicker, it binds to it. */
export function RangeCalendarRoot(props: RangeCalendarRootProps) {
    return (
        <CalendarRootBase
            mode="range"
            {...(props as RootProps & CalendarStateProps)}
        />
    );
}

export type { CalendarValue };
