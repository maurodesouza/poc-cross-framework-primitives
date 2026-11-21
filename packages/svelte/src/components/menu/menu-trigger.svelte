<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { MenuContext } from "./menu-context.svelte.ts";

/** Opens the root menu (spec/menu.md, "Keyboard": on the Trigger). */
let {
    child,
    children,
    disabled = false,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean }> & {
    disabled?: boolean;
} = $props();
const context = MenuContext.use("Menu.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const openWith = (
    highlight: "first" | "last",
    reason: "trigger-press" | "list-navigation",
) => {
    context.pendingHighlight.current = highlight;
    context.setOpen(true, reason);
};
const partState = $derived({ open: context.open, disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "menu",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.open ? context.popupId : undefined,
            "data-menu-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onclick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!context.open, "trigger-press");
            },
            onkeydown: (event: KeyboardEvent) => {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    openWith("first", "list-navigation");
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    openWith("last", "list-navigation");
                } else if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openWith("first", "trigger-press");
                }
            },
            onkeyup: (event: KeyboardEvent) => {
                if (event.key === " ") {
                    event.preventDefault();
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
