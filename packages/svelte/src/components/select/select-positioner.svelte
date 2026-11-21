<script lang="ts">
import { type Align, openOverlaySession, type Side } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { usePositioner } from "../../utils/positioner.svelte.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.svelte.ts";

/**
 * Places the list below the trigger (spec/select.md, "Item alignment"); the open list is a layer
 * (Escape, outside press).
 */
let {
    child,
    children,
    side,
    align,
    sideOffset = 4,
    alignOffset,
    collisionPadding,
    anchor,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> & {
    side?: Side;
    align?: Align;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    anchor?: Element | null;
} = $props();
const context = SelectContext.use("Select.Positioner");
const ref = elementRef((element) => (context.positioner = element));
usePositioner(
    () => ({ side, align, sideOffset, alignOffset, collisionPadding, anchor }),
    { side: "bottom", align: "start" },
    () => context.trigger,
    () => context.positioner,
    () => null,
    (placed) => {
        context.placed = placed;
    },
);
$effect(() => {
    const positioner = context.positioner;
    const trigger = context.trigger;
    if (!context.open || positioner === null) {
        return undefined;
    }
    const session = openOverlaySession(positioner.ownerDocument, {
        elements: () => [positioner],
        ignore: () => [trigger],
        dismiss: (reason) => context.setOpen(false, reason),
    });
    return session.end;
});
const partState = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            role: "presentation",
            "data-select-part": "positioner",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
