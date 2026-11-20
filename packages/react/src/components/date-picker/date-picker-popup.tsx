import { pushLayer, watchFocusOutside } from "@poc/dom";
import { useEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers). */
export function DatePickerPopup(
    props: PartProps<{ open: boolean; side: string; align: string }>,
) {
    const context = useRequiredContext(DatePickerContext, "DatePicker.Popup");
    const { open, popup, positioner, trigger, setOpen, lastReason } = context;

    useEffect(() => {
        if (!open || popup === null) {
            return undefined;
        }
        const doc = popup.ownerDocument;
        const layer = pushLayer(doc, {
            elements: () => [positioner ?? popup],
            ignore: () => [trigger],
            onEscape: () => setOpen(false, "escape-key"),
            onOutsidePress: () => setOpen(false, "outside-press"),
        });
        const stopWatching = watchFocusOutside(
            doc,
            () => [positioner ?? popup, trigger, ...layer.elementsAbove()],
            () => setOpen(false, "focus-out"),
        );
        return () => {
            layer.remove();
            stopWatching();
            if (RETURNS_FOCUS.has(lastReason.current ?? "")) {
                trigger?.focus({ preventScroll: true });
            }
        };
    }, [open, popup, positioner, trigger, setOpen, lastReason]);

    const status = context.presence.status;
    return renderElement(
        "div",
        props,
        { open, ...context.placed },
        {
            id: context.popupId,
            role: "dialog",
            "data-date-picker-part": "popup",
            ...stateAttributes({
                open,
                side: context.placed.side,
                align: context.placed.align,
                "starting-style": status === "starting",
                "ending-style": status === "ending",
            }),
        },
        context.setPopup,
    );
}
