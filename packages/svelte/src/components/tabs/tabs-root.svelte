<script lang="ts">
import { untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext, TabsState } from "./tabs-context.svelte.ts";

/** spec/tabs.md (`bind:value`) */
let {
    child,
    children,
    value = $bindable(),
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activation = "automatic",
    loop = true,
    ...rest
}: PartProps<{ orientation: string; activation: string }> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, details: ChangeDetails) => void;
    orientation?: "horizontal" | "vertical";
    activation?: "automatic" | "manual";
    loop?: boolean;
} = $props();

const tabs = new TabsState(
    {
        read: () => value,
        write: (next) => (value = next),
        initial: untrack(() => defaultValue),
        onValueChange: () => onValueChange,
    },
    () => orientation,
    () => activation,
    () => loop,
);
TabsContext.provide(tabs);

// no value: the first enabled tab, once the tabs are known
$effect(() => {
    const list = tabs.list;
    tabs.version;
    if (tabs.value !== undefined || list === null) {
        return;
    }
    const first = [...list.querySelectorAll<HTMLElement>('[role="tab"]')]
        .map((element) => tabs.tabs.get(element))
        .find((info) => info !== undefined && !info.disabled);
    if (first) {
        tabs.select(first.value, "none");
    }
});

const partState = $derived({ orientation, activation });
const partProps = $derived(
    mergeProps(
        {
            "data-tabs-part": "root",
            ...stateAttributes({ orientation, activation }),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
