<script lang="ts">
import {
    focusInitial,
    getTabbables,
    nextTabbableAfter,
    openOverlaySession,
} from "@poc/dom";
import {
    type FocusTarget,
    resolveFocusTarget,
} from "../../utils/change-details.ts";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.svelte.ts";

// Closing by these returns focus to the trigger; an outside press or focus leaving does not.
const RETURNS_FOCUS = new Set(["escape-key", "close-press", "trigger-press"]);

/** The non-modal popover (spec/popover.md). */
let {
    child,
    children,
    initialFocus,
    finalFocus,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> & {
    initialFocus?: FocusTarget;
    finalFocus?: FocusTarget;
} = $props();
const context = PopoverContext.use("Popover.Popup");
const ref = elementRef((element) => (context.popup = element));

$effect(() => {
    const popup = context.popup;
    const positioner = context.positioner;
    if (!context.open || popup === null) {
        return undefined;
    }
    const trigger = context.trigger;
    const session = openOverlaySession(popup.ownerDocument, {
        elements: () => [positioner ?? popup],
        ignore: () => [trigger],
        dismiss: (reason) => context.setOpen(false, reason),
        focusOut: () => [trigger],
        returnFocus: {
            when: RETURNS_FOCUS,
            reason: () => context.lastReason.current,
            to: () => {
                const final = resolveFocusTarget(finalFocus);
                return final === false ? false : (final ?? trigger);
            },
        },
    });
    const initial = resolveFocusTarget(initialFocus);
    if (initial !== false) {
        focusInitial(popup, initial ?? popup);
    }
    return session.end;
});

const onkeydown = (event: KeyboardEvent) => {
    const popup = context.popup;
    if (event.key !== "Tab" || popup === null || event.defaultPrevented) {
        return;
    }
    // in the tab order, the popup's content comes right after the trigger
    const tabbables = getTabbables(popup);
    const active = popup.ownerDocument.activeElement;
    const first = tabbables[0] ?? popup;
    const last = tabbables.at(-1) ?? popup;
    const trigger = context.trigger;
    if (event.shiftKey && (active === first || active === popup)) {
        event.preventDefault();
        context.setOpen(false, "focus-out");
        trigger?.focus();
    } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        const next = trigger
            ? nextTabbableAfter(trigger, [context.positioner, popup])
            : null;
        context.setOpen(false, "focus-out");
        next?.focus();
    }
};

const partState = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            id: context.popupId,
            role: "dialog",
            "aria-labelledby": context.titleId,
            "aria-describedby": context.descriptionId,
            tabindex: -1,
            "data-popover-part": "popup",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
