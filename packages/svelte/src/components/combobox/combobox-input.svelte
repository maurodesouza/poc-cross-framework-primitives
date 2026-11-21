<script lang="ts">
import { chipArrows, getDirection, stepThroughNone } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxContext,
    type PendingHighlight,
} from "./combobox-context.svelte.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
let { child, ...rest }: PartProps<{ open: boolean; disabled: boolean }> =
    $props();
const context = ComboboxContext.use("Combobox.Input");
const ref = elementRef((element) => (context.trigger = element));

const openWith = (highlight: PendingHighlight) => {
    context.pendingHighlight.current = highlight;
    context.setOpen(true, "list-navigation");
};
const move = (delta: 1 | -1) => {
    // past an end, the visual focus goes back to the input; from the input, to the near end
    const items = context.orderedItems();
    const index = items.findIndex((item) => item.id === context.highlighted);
    context.highlighted =
        items[stepThroughNone(items.length, index, delta)]?.id ?? null;
};

const onkeydown = (event: KeyboardEvent) => {
    const input = event.currentTarget as HTMLInputElement;
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
            move(event.key === "ArrowDown" ? 1 : -1);
            return;
        }
        case "Enter":
            if (open) {
                event.preventDefault();
                const active = context
                    .orderedItems()
                    .find((item) => item.id === context.highlighted);
                if (active !== undefined && !active.disabled) {
                    context.choose(active.value);
                }
            }
            return;
        case "Escape":
            // the open list's layer takes Escape first; here the list is closed
            if (
                !open &&
                (context.inputValue !== "" || context.values.length > 0)
            ) {
                event.preventDefault();
                context.clear("escape-key");
            }
            return;
        case "Tab":
            if (open) {
                context.setOpen(false, "focus-out");
            }
            return;
        case "Backspace":
            if (
                context.multiple &&
                input.value === "" &&
                context.values.length > 0
            ) {
                context.removeAt(context.values.length - 1, "none");
            }
            return;
        default: {
            const chips = context.chipElements();
            if (
                context.multiple &&
                event.key ===
                    chipArrows(getDirection(input) === "rtl").previous &&
                input.selectionStart === 0 &&
                input.selectionEnd === 0 &&
                chips.length > 0
            ) {
                event.preventDefault();
                chips.at(-1)?.focus();
            }
        }
    }
};

const active = $derived(
    context.orderedItems().find((item) => item.id === context.highlighted),
);
const partState = $derived({ open: context.open, disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "text",
            id: context.triggerId,
            role: "combobox",
            autocomplete: "off",
            disabled: context.disabled,
            value: context.inputValue,
            "aria-autocomplete": "list",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.listId,
            "aria-activedescendant":
                context.open && active ? active.id : undefined,
            ...context.field.aria,
            "data-combobox-part": "input",
            ...context.field.attributes,
            ...stateAttributes({
                open: context.open,
                disabled: context.disabled,
            }),
            oninput: (event: Event) => {
                const element = event.currentTarget as HTMLInputElement;
                context.setInputValue(element.value, "input-change");
                // a bound inputValue the consumer kept changes no state, so the input is not
                // updated: re-assert it (spec/README.md, "A controlled value the consumer
                // rejects")
                if (element.value !== context.inputValue) {
                    element.value = context.inputValue;
                }
                context.highlighted = null;
                context.typed = true;
                // typing never highlights: drop what an earlier key asked for
                context.pendingHighlight.current = null;
                if (!context.open) {
                    context.setOpen(true, "input-change");
                }
            },
            onclick: () => context.openOnPress(),
            onkeydown,
            onfocus: context.field.onfocus,
            onblur: context.field.onblur,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<input {...partProps} />{/if}
