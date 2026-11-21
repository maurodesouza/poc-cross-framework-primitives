<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.svelte.ts";

let {
    child,
    children,
    value,
    keepMounted = false,
    ...rest
}: PartProps<{ selected: boolean; orientation: string }> & {
    value: string;
    keepMounted?: boolean;
} = $props();
const context = TabsContext.use("Tabs.Panel");
const selected = $derived(context.value === value);
const partState = $derived({ selected, orientation: context.orientation() });
const partProps = $derived(
    mergeProps(
        {
            role: "tabpanel",
            id: context.panelId(value),
            "aria-labelledby": context.tabId(value),
            tabindex: 0,
            hidden: !selected,
            "data-tabs-part": "panel",
            ...stateAttributes({
                selected,
                orientation: context.orientation(),
            }),
        },
        rest,
    ),
);
</script>

{#if selected || keepMounted}{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}{/if}
