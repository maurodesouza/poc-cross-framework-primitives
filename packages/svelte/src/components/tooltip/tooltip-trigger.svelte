<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TooltipContext } from "./tooltip-context.svelte.ts";

function isFocusVisible(element: Element): boolean {
    try {
        return element.matches(":focus-visible");
    } catch {
        return true;
    }
}

/** The described control and the anchor (spec/tooltip.md). */
let {
    child,
    children,
    "aria-describedby": describedBy,
    ...rest
}: PartProps<{ open: boolean }> & { "aria-describedby"?: string } = $props();
const context = TooltipContext.use("Tooltip.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const partState = $derived({ open: context.open });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            "aria-describedby":
                [describedBy, context.open ? context.popupId : undefined]
                    .filter(Boolean)
                    .join(" ") || undefined,
            "data-tooltip-part": "trigger",
            ...stateAttributes({ open: context.open }),
            onpointerenter: (event: PointerEvent) => {
                // a tap never opens a tooltip
                if (event.pointerType !== "touch") {
                    context.hoverStart();
                }
            },
            onpointerleave: (event: PointerEvent) => {
                if (event.pointerType !== "touch") {
                    context.hoverEnd();
                }
            },
            onpointerdown: () => context.press(),
            onfocus: (event: FocusEvent) => {
                if (
                    !context.disabled &&
                    isFocusVisible(event.currentTarget as Element)
                ) {
                    context.show("trigger-focus", true);
                }
            },
            onblur: () => {
                if (context.open) {
                    context.hide("trigger-focus");
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
