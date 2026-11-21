<script lang="ts">
import {
    focusInitial,
    inertOutside,
    lockScroll,
    openOverlaySession,
    trapFocus,
} from "@poc/dom";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.svelte.ts";

/** The modal dialog (spec/dialog.md): focus trap, inert page, scroll lock, its own layer. */
let {
    child,
    children,
    initialFocus,
    finalFocus,
    ...rest
}: PartProps<{ open: boolean }> & {
    initialFocus?: FocusTarget;
    finalFocus?: FocusTarget;
} = $props();
const context = DialogContext.use("Dialog.Popup");
const ref = elementRef((element) => (context.popup = element));

$effect(() => {
    const popup = context.popup;
    const backdrop = context.backdrop;
    if (!context.open || popup === null) {
        return undefined;
    }
    const doc = popup.ownerDocument;
    const previous =
        doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
    const trigger = context.trigger;
    const session = openOverlaySession(doc, {
        elements: () => [popup],
        dismiss: (reason) => context.setOpen(false, reason),
        returnFocus: {
            reason: () => null,
            to: () => {
                const final = resolveFocusTarget(finalFocus);
                return final === false ? false : (final ?? trigger ?? previous);
            },
        },
    });
    const initial = resolveFocusTarget(initialFocus);
    focusInitial(popup, initial === false ? popup : initial);
    const release = trapFocus(popup, session.elementsAbove);
    const unlock = lockScroll(doc);
    const restoreInert = inertOutside(backdrop ? [popup, backdrop] : [popup]);
    return () => {
        release();
        unlock();
        restoreInert();
        session.end();
    };
});

const partState = $derived({ open: context.open });
const partProps = $derived(
    mergeProps(
        {
            id: context.popupId,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": context.titleId,
            "aria-describedby": context.descriptionId,
            tabindex: -1,
            "data-dialog-part": "popup",
            ...stateAttributes({
                open: context.open,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
