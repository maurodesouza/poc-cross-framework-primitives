import { openOverlaySession } from "@poc/dom";
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
                onCleanup(session.end);
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
