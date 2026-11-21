<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.svelte.ts";
import { MenuItemBehaviour } from "./menu-item-behaviour.svelte.ts";

/**
 * An action. Enter, Space and clicks fire its `click` (`onclick`), then close every level
 * (spec/menu.md). A disabled item stays focusable but is never activated.
 */
let {
    child,
    children,
    disabled = false,
    label,
    closeOnClick = true,
    onclick,
    ...rest
}: PartProps<{ highlighted: boolean; disabled: boolean }> & {
    disabled?: boolean;
    label?: string;
    closeOnClick?: boolean;
    onclick?: (event: MouseEvent) => void;
} = $props();
const context = MenuContext.use("Menu.Item");
const item = new MenuItemBehaviour(context, () => label, false);
const ref = elementRef((element) => (item.element = element));
const state = $derived({ highlighted: item.highlighted, disabled });
const partProps = $derived(
    mergeProps(
        {
            role: "menuitem",
            tabindex: -1,
            "aria-disabled": disabled ? "true" : undefined,
            "data-menu-part": "item",
            ...stateAttributes({ highlighted: item.highlighted, disabled }),
            ...item.handlers,
            onclick: () => {
                if (!disabled && closeOnClick) {
                    context.closeAll("item-press");
                }
            },
            ...ref,
        },
        disabled ? rest : { ...rest, onclick },
    ),
);
</script>

{#if child}{@render child({ props: partProps, state })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
