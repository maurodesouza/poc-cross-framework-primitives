import {
    formatDayNumber,
    formatFullDate,
    type PlainDate,
    toIsoDate,
} from "@poc/dom";
import {
    defineComponent,
    inject,
    mergeProps,
    type PropType,
    shallowRef,
    watch,
} from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarGridKey, CalendarKey } from "./calendar-context.ts";

/** One date. Its name and content come from `Intl` (spec/calendar.md, the locale exception). */
export const CalendarCell = defineComponent({
    name: "CalendarCell",
    inheritAttrs: false,
    props: {
        ...asProp,
        date: { type: Object as PropType<PlainDate>, required: true },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(CalendarKey, "Calendar.Cell");
        const month = inject(CalendarGridKey, null);
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        const state = () =>
            context.cellState(
                props.date,
                month?.value ?? context.visibleStart.value,
            );
        watch(
            () =>
                [
                    element.value,
                    toIsoDate(props.date),
                    state().outsideMonth,
                    state().focused,
                ] as const,
            ([node, key, outsideMonth, focused], _, onCleanup) => {
                if (node === null || outsideMonth) {
                    return;
                }
                context.cells.set(key, node);
                // a cell of a month just shown mounts after the keyboard moved the focus to it
                if (context.focusPending.current && focused) {
                    context.focusPending.current = false;
                    node.focus({ preventScroll: true });
                }
                onCleanup(() => {
                    if (context.cells.get(key) === node) {
                        context.cells.delete(key);
                    }
                });
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const cell = state();
            const locale = context.locale();
            const consumer = mergeProps(
                { "aria-label": formatFullDate(locale, props.date) },
                attrs,
            );
            return renderPart(
                "td",
                { attrs: consumer, slots },
                props.as,
                cell,
                {
                    role: "gridcell",
                    tabindex: cell.outsideMonth
                        ? undefined
                        : cell.focused
                          ? 0
                          : -1,
                    "aria-selected": cell.selected ? "true" : undefined,
                    "aria-disabled":
                        cell.disabled || cell.unavailable || cell.outsideMonth
                            ? "true"
                            : undefined,
                    "aria-current": cell.today ? "date" : undefined,
                    "data-calendar-part": "cell",
                    ...stateAttributes({
                        today: cell.today,
                        selected: cell.selected,
                        disabled: cell.disabled,
                        unavailable: cell.unavailable,
                        "outside-month": cell.outsideMonth,
                        "range-start": cell.rangeStart,
                        "range-end": cell.rangeEnd,
                        "in-range": cell.inRange,
                        "range-preview": cell.rangePreview,
                    }),
                    onClick: () => {
                        if (!cell.outsideMonth && !cell.disabled) {
                            context.select(props.date);
                            context.requestFocus();
                        }
                    },
                    onPointerenter: () => {
                        if (
                            context.anchor.value !== null &&
                            !cell.outsideMonth
                        ) {
                            context.setHovered(props.date);
                        }
                    },
                    onFocus: () => {
                        if (!cell.outsideMonth && !cell.focused) {
                            context.moveFocus(props.date);
                        }
                    },
                    ref: setElement,
                },
                () =>
                    slots.default?.({ state: cell }) ??
                    formatDayNumber(locale, props.date),
            );
        };
    },
});
