<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.svelte.ts";

/** A tab. A disabled tab stays focusable and is never selected (spec/tabs.md). */
let {
    child,
    children,
    value,
    disabled = false,
    ...rest
}: PartProps<{ selected: boolean; disabled: boolean; orientation: string }> & {
    value: string;
    disabled?: boolean;
} = $props();
const context = TabsContext.use("Tabs.Tab");
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
$effect(() => {
    const node = element;
    if (node === null) {
        return undefined;
    }
    context.tabs.set(node, { value, disabled });
    context.version += 1;
    return () => {
        context.tabs.delete(node);
    };
});
const selected = $derived(context.value === value);
const holdsTabStop = $derived.by(() => {
    context.version;
    if (context.value !== undefined) {
        return selected;
    }
    return (
        element !== null &&
        context.list?.querySelector('[role="tab"]') === element
    );
});
const partState = $derived({
    selected,
    disabled,
    orientation: context.orientation(),
});
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            role: "tab",
            id: context.tabId(value),
            "aria-selected": selected ? "true" : "false",
            "aria-controls": context.panelId(value),
            "aria-disabled": disabled ? "true" : undefined,
            tabindex: holdsTabStop ? 0 : -1,
            "data-tabs-part": "tab",
            ...stateAttributes({
                selected,
                disabled,
                orientation: context.orientation(),
            }),
            onclick: () => {
                if (!disabled) {
                    context.select(value, "trigger-press");
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
