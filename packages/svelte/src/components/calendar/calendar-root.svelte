<script lang="ts">
import { type PlainDate, toIsoDate } from "@poc/dom";
import { tick, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "../date-picker/date-picker-context.svelte.ts";
import { CalendarContext, CalendarState } from "./calendar-context.svelte.ts";
import type { CalendarMode, CalendarValue } from "./calendar-value.ts";

/** A Calendar or RangeCalendar root (`bind:value`); inside a picker with no value, it binds to it. */
let {
    child,
    children,
    mode = "single",
    value = $bindable(),
    defaultValue,
    onValueChange,
    min,
    max,
    isDateUnavailable,
    locale,
    firstDayOfWeek,
    visibleMonths,
    disabled,
    readOnly,
    ...rest
}: PartProps<{ disabled: boolean; readOnly: boolean }> & {
    mode?: CalendarMode;
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    onValueChange?: (value: CalendarValue, details: ChangeDetails) => void;
    min?: PlainDate | null;
    max?: PlainDate | null;
    isDateUnavailable?: (date: PlainDate) => boolean;
    locale?: string;
    firstDayOfWeek?: number;
    visibleMonths?: number;
    disabled?: boolean;
    readOnly?: boolean;
} = $props();

const calendar = new CalendarState(
    untrack(() => mode),
    () => ({
        value,
        min,
        max,
        isDateUnavailable,
        locale,
        firstDayOfWeek,
        visibleMonths,
        disabled,
        readOnly,
    }),
    (next) => (value = next),
    () => onValueChange,
    DatePickerContext.maybe() ?? null,
    untrack(() => value),
    untrack(() => defaultValue),
);
CalendarContext.provide(calendar);

// after a render while a focus is pending (a cell that mounts later takes it itself)
$effect(() => {
    const key = toIsoDate(calendar.focusedDate);
    calendar.visibleStart;
    void tick().then(() => {
        if (!calendar.focusPending.current) {
            return;
        }
        const cell = calendar.cells.get(key);
        if (cell) {
            calendar.focusPending.current = false;
            cell.focus({ preventScroll: true });
        }
    });
});

const partState = $derived({
    disabled: calendar.disabled,
    readOnly: calendar.readOnly,
});
const partProps = $derived(
    mergeProps(
        {
            "data-calendar-part": "root",
            ...stateAttributes({
                disabled: calendar.disabled,
                readonly: calendar.readOnly,
            }),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
