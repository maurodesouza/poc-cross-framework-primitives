import { pushLayer, watchFocusOutside } from "@poc/dom";
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
                const doc = popup.ownerDocument;
                const trigger = context.trigger.value;
                const layer = pushLayer(doc, {
                    elements: () => [positioner ?? popup],
                    ignore: () => [trigger],
                    onEscape: () => context.setOpen(false, "escape-key"),
                    onOutsidePress: () =>
                        context.setOpen(false, "outside-press"),
                });
                const stopWatching = watchFocusOutside(
                    doc,
                    () => [
                        positioner ?? popup,
                        trigger,
                        ...layer.elementsAbove(),
                    ],
                    () => context.setOpen(false, "focus-out"),
                );
                onCleanup(() => {
                    layer.remove();
                    stopWatching();
                    if (RETURNS_FOCUS.has(context.lastReason.current ?? "")) {
                        trigger?.focus({ preventScroll: true });
                    }
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
