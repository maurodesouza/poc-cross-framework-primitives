<script lang="ts">
import { getDirection, tabsKeyTarget } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.svelte.ts";

/** The tablist: one tab stop, arrows move between tabs (spec/tabs.md, "Keyboard"). */
let { child, children, ...rest }: PartProps<{ orientation: string }> = $props();
const context = TabsContext.use("Tabs.List");
const ref = elementRef((element) => (context.list = element));
const onkeydown = (event: KeyboardEvent) => {
    const list = context.list;
    if (list === null) {
        return;
    }
    const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
    const active = list.ownerDocument.activeElement as HTMLElement | null;
    const current = active ? tabs.indexOf(active) : -1;
    if (current === -1) {
        return;
    }
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const info = context.tabs.get(tabs[current] as HTMLElement);
        if (info && !info.disabled) {
            context.select(info.value, "trigger-press");
        }
        return;
    }
    const index = tabsKeyTarget(event.key, current, tabs.length, {
        orientation: context.orientation(),
        rtl: getDirection(list) === "rtl",
        loop: context.loop(),
    });
    const target = index === null ? undefined : tabs[index];
    if (target === undefined) {
        return;
    }
    event.preventDefault();
    target.focus();
    const info = context.tabs.get(target);
    if (context.activation() === "automatic" && info && !info.disabled) {
        context.select(info.value, "list-navigation");
    }
};
const partState = $derived({ orientation: context.orientation() });
const partProps = $derived(
    mergeProps(
        {
            role: "tablist",
            "aria-orientation": context.orientation(),
            "data-tabs-part": "list",
            ...stateAttributes({ orientation: context.orientation() }),
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
