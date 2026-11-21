<script lang="ts">
import { openOverlaySession } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerContext } from "./date-picker-context.svelte.ts";

const RETURNS_FOCUS = new Set(["escape-key", "item-press", "trigger-press"]);

/** The non-modal dialog holding the bound calendar (spec/calendar.md, pickers). */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> = $props();
const context = DatePickerContext.use("DatePicker.Popup");
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
            to: () => trigger,
        },
    });
    return session.end;
});
const partState = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            id: context.popupId,
            role: "dialog",
            "data-date-picker-part": "popup",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
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
