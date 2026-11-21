<script lang="ts">
import { getTabbables } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { PopoverContext } from "./popover-context.svelte.ts";

/** Toggles the popover and anchors it. While open, Tab from it enters the popup (spec/popover.md). */
let {
    child,
    children,
    disabled = false,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean }> & {
    disabled?: boolean;
} = $props();
const context = PopoverContext.use("Popover.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const partState = $derived({ open: context.open, disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.open ? context.popupId : undefined,
            "data-popover-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onclick: () => context.setOpen(!context.open, "trigger-press"),
            onkeydown: (event: KeyboardEvent) => {
                const popup = context.popup;
                if (
                    event.key === "Tab" &&
                    !event.shiftKey &&
                    context.open &&
                    popup
                ) {
                    event.preventDefault();
                    (getTabbables(popup)[0] ?? popup).focus();
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
