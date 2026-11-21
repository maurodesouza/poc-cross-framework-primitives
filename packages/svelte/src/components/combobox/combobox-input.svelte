<script lang="ts">
import { stepThroughNone } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
let { child, ...rest }: PartProps<{ open: boolean; disabled: boolean }> =
    $props();
const context = ComboboxContext.use("Combobox.Input");
const ref = elementRef((element) => (context.trigger = element));
const openWith = (highlight: "first" | "last" | null) => {
    context.pendingHighlight.current = highlight;
    context.setOpen(true, "list-navigation");
};
const onkeydown = (event: KeyboardEvent) => {
    const open = context.open;
    switch (event.key) {
        case "ArrowDown":
        case "ArrowUp": {
            event.preventDefault();
            if (event.altKey) {
                if (event.key === "ArrowDown" && !open) {
                    openWith(null);
                } else if (event.key === "ArrowUp" && open) {
                    context.setOpen(false, "list-navigation");
                }
                return;
            }
            if (!open) {
                openWith(event.key === "ArrowDown" ? "first" : "last");
                return;
            }
            const items = context.orderedItems();
            const index = items.findIndex(
                (item) => item.value === context.highlighted,
            );
            context.highlighted =
                items[
                    stepThroughNone(
                        items.length,
                        index,
                        event.key === "ArrowDown" ? 1 : -1,
                    )
                ]?.value ?? null;
            return;
        }
        case "Enter":
            if (open) {
                event.preventDefault();
                if (context.highlighted !== null) {
                    context.choose(context.highlighted);
                }
            }
            return;
        case "Escape":
            // the open list's layer takes Escape first; here the list is closed
            if (
                !open &&
                (context.inputValue !== "" || context.value !== null)
            ) {
                event.preventDefault();
                context.clear();
            }
            return;
        case "Tab":
            if (open) {
                context.setOpen(false, "focus-out");
            }
            return;
        default:
    }
};
const active = $derived(
    context.orderedItems().find((item) => item.value === context.highlighted),
);
const partState = $derived({
    open: context.open,
    disabled: context.disabled(),
});
const partProps = $derived(
    mergeProps(
        {
            type: "text",
            role: "combobox",
            autocomplete: "off",
            disabled: context.disabled(),
            value: context.inputValue,
            "aria-autocomplete": "list",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.listId,
            "aria-activedescendant":
                context.open && active ? active.id : undefined,
            "data-combobox-part": "input",
            ...stateAttributes({
                open: context.open,
                disabled: context.disabled(),
            }),
            oninput: (event: Event) => {
                context.setInputValue(
                    (event.target as HTMLInputElement).value,
                    "input-change",
                );
                context.highlighted = null;
                if (!context.open) {
                    context.pendingHighlight.current = null;
                    context.setOpen(true, "input-change");
                }
            },
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<input {...partProps} />{/if}
