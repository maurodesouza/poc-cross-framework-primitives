<script lang="ts">
import { chipKeyTarget, getDirection } from "@poc/dom";
import { flushSync } from "svelte";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
} from "./combobox-context.svelte.ts";

/** One value of a `multiple` combobox; the arrows move between chips (spec/combobox.md). */
let { child, children, ...rest }: PartProps<{ disabled: boolean }> = $props();
const context = ComboboxContext.use("Combobox.Chip");
let element: HTMLElement | null = null;
const ref = elementRef((node) => {
    element = node;
});
ComboboxChipContext.provide({ element: () => element });

const onkeydown = (event: KeyboardEvent) => {
    if (context.disabled || event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }
    const chip = event.currentTarget as HTMLElement;
    const chips = context.chipElements();
    const index = chips.indexOf(chip);
    const action = chipKeyTarget(
        event.key,
        index,
        chips.length,
        getDirection(chip) === "rtl",
    );
    if (action === null) {
        return;
    }
    // a printable character goes on to the input, focused below
    if (event.key.length !== 1 || event.key === " ") {
        event.preventDefault();
    }
    if (action.remove) {
        context.removeAt(index, "none");
        // the chips that are left must be in the DOM before focus moves to one
        flushSync();
    }
    if (action.open) {
        context.setOpen(true, "list-navigation");
    }
    const target =
        action.focus === "input"
            ? context.trigger
            : context.chipElements()[action.focus];
    target?.focus();
};

const partState = $derived({ disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            tabindex: -1,
            "aria-disabled": context.disabled ? "true" : undefined,
            "data-combobox-part": "chip",
            ...stateAttributes({ disabled: context.disabled }),
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
