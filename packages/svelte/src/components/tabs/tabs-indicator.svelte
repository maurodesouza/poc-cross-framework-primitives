<script lang="ts">
import { getDirection } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.svelte.ts";

/** Follows the selected tab through CSS variables measured from the list (spec/tabs.md). */
let { child, children, ...rest }: PartProps<{ orientation: string }> = $props();
const context = TabsContext.use("Tabs.Indicator");
let box = $state<string | null>(null);
$effect(() => {
    const list = context.list;
    const value = context.value;
    context.version;
    if (list === null || value === undefined) {
        box = null;
        return undefined;
    }
    const measure = () => {
        const tab = list.ownerDocument.getElementById(context.tabId(value));
        if (tab === null) {
            box = null;
            return;
        }
        const listRect = list.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const inlineStart =
            getDirection(list) === "rtl"
                ? listRect.right - tabRect.right
                : tabRect.left - listRect.left;
        box = [
            `--tabs-indicator-inset-inline-start: ${inlineStart}px`,
            `--tabs-indicator-inset-block-start: ${tabRect.top - listRect.top}px`,
            `--tabs-indicator-inline-size: ${tabRect.width}px`,
            `--tabs-indicator-block-size: ${tabRect.height}px`,
        ].join("; ");
    };
    measure();
    const view = list.ownerDocument.defaultView;
    const observer = view?.ResizeObserver
        ? new view.ResizeObserver(measure)
        : null;
    observer?.observe(list);
    return () => observer?.disconnect();
});
const partState = $derived({ orientation: context.orientation() });
const partProps = $derived(
    mergeProps(
        {
            "aria-hidden": "true",
            "data-tabs-part": "indicator",
            ...stateAttributes({ orientation: context.orientation() }),
            style: box ?? undefined,
        },
        rest,
    ),
);
</script>

{#if box !== null}{#if child}{@render child({ props: partProps, state: partState })}{:else}<span {...partProps}>{@render children?.()}</span>{/if}{/if}
