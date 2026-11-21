import { getTabbables, nextTabbableAfter, openOverlaySession } from "@poc/dom";
import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerKey } from "./date-picker-context.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers). */
export const DatePickerPopup = defineComponent({
    name: "DatePickerPopup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(DatePickerKey, "DatePicker.Popup");
        const setPopup = elementSetter(context.popup);
        const onKeydown = (event: KeyboardEvent) => {
            const popup = context.popup.value;
            if (
                event.key !== "Tab" ||
                popup === null ||
                event.defaultPrevented
            ) {
                return;
            }
            // in the tab order, the popup's content comes right after the trigger (as popover.md)
            const tabbables = getTabbables(popup);
            const active = popup.ownerDocument.activeElement;
            const first = tabbables[0] ?? popup;
            const last = tabbables.at(-1) ?? popup;
            const trigger = context.trigger.value;
            if (event.shiftKey && (active === first || active === popup)) {
                event.preventDefault();
                context.setOpen(false, "focus-out");
                trigger?.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                const next = trigger
                    ? nextTabbableAfter(trigger, [
                          context.positioner.value,
                          popup,
                      ])
                    : null;
                context.setOpen(false, "focus-out");
                next?.focus();
            }
        };
        watch(
            () =>
                [
                    context.open.value,
                    context.popup.value,
                    context.positioner.value,
                ] as const,
            ([open, popup, positioner], _, onCleanup) => {
                if (!open || popup === null) {
                    return;
                }
                const trigger = context.trigger.value;
                const session = openOverlaySession(popup.ownerDocument, {
                    elements: () => [positioner ?? popup],
                    ignore: () => [trigger],
                    dismiss: (reason) => context.setOpen(false, reason),
                    focusOut: () => [trigger],
                    returnFocus: {
                        when: RETURNS_FOCUS,
                        reason: () => context.lastReason.current,
                        to: () => trigger,
                    },
                });
                // a native listener: Vue's own skips an event whose timestamp is not later than the
                // listener's, which a fixed clock (the tests' "today") makes equal once a child's
                // Vue listener (the calendar cell's keydown) has seen the event
                popup.addEventListener("keydown", onKeydown);
                onCleanup(() => {
                    popup.removeEventListener("keydown", onKeydown);
                    session.end();
                });
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const open = context.open.value;
            const status = context.presence.status.value;
            const placed = context.placed.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, ...placed },
                {
                    id: context.popupId,
                    role: "dialog",
                    "data-date-picker-part": "popup",
                    ...stateAttributes({
                        open,
                        side: placed.side,
                        align: placed.align,
                        "starting-style": status === "starting",
                        "ending-style": status === "ending",
                    }),
                    ref: setPopup,
                },
            );
        };
    },
});
