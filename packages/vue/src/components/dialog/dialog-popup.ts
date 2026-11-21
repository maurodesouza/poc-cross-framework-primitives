import {
    focusInitial,
    inertOutside,
    lockScroll,
    openOverlaySession,
    trapFocus,
} from "@poc/dom";
import { defineComponent, type PropType, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogKey } from "./dialog-context.ts";

/** The modal dialog (spec/dialog.md): focus trap, inert page, scroll lock, its own layer. */
export const DialogPopup = defineComponent({
    name: "DialogPopup",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** Focused on open (default: the first tabbable element, else the popup). */
        initialFocus: {
            type: [Object, Boolean, Function] as PropType<FocusTarget>,
            default: undefined,
        },
        /** Focused on close (default: the trigger, else the element focused before opening). */
        finalFocus: {
            type: [Object, Boolean, Function] as PropType<FocusTarget>,
            default: undefined,
        },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(DialogKey, "Dialog.Popup");
        const setPopup = elementSetter(context.popup);
        watch(
            () =>
                [
                    context.open.value,
                    context.popup.value,
                    context.backdrop.value,
                ] as const,
            ([open, popup, backdrop], _, onCleanup) => {
                if (!open || popup === null) {
                    return;
                }
                const doc = popup.ownerDocument;
                const previous =
                    doc.activeElement instanceof HTMLElement
                        ? doc.activeElement
                        : null;
                const trigger = context.trigger.value;
                const session = openOverlaySession(doc, {
                    elements: () => [popup],
                    dismiss: (reason) => context.setOpen(false, reason),
                    returnFocus: {
                        reason: () => null,
                        to: () => {
                            const final = resolveFocusTarget(props.finalFocus);
                            return final === false
                                ? false
                                : (final ?? trigger ?? previous);
                        },
                    },
                });
                const initial = resolveFocusTarget(props.initialFocus);
                focusInitial(popup, initial === false ? popup : initial);
                const release = trapFocus(popup, session.elementsAbove);
                const unlock = lockScroll(doc);
                const restoreInert = inertOutside(
                    backdrop ? [popup, backdrop] : [popup],
                );
                onCleanup(() => {
                    release();
                    unlock();
                    restoreInert();
                    session.end();
                });
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const open = context.open.value;
            const status = context.presence.status.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open },
                {
                    id: context.popupId,
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": context.titleId.value,
                    "aria-describedby": context.descriptionId.value,
                    tabindex: -1,
                    "data-dialog-part": "popup",
                    ...stateAttributes({
                        open,
                        "starting-style": status === "starting",
                        "ending-style": status === "ending",
                    }),
                    ref: setPopup,
                },
            );
        };
    },
});
