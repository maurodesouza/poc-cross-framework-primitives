<script lang="ts">
import { createTypeahead, menuKeyTarget } from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { initialHighlight, SelectContext } from "./select-context.svelte.ts";

// Within this time after a typed character, Space continues the typeahead instead of choosing.
const TYPEAHEAD_SPACE = 500;

/**
 * The select-only `combobox`: keeps DOM focus while the list is open; the highlighted item is
 * announced with `aria-activedescendant` (spec/select.md, "Keyboard").
 */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean; placeholder: boolean }> =
    $props();
const context = SelectContext.use("Select.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const typeahead = createTypeahead();
let lastTyped = 0;

const typeTo = (key: string) => {
    const { items, open } = context;
    const from = items.findIndex(
        (item) => item.value === (open ? context.highlighted : context.value),
    );
    const match = typeahead.match(
        key,
        items.map((item) => item.label),
        from,
    );
    lastTyped = Date.now();
    const target = items[match]?.value;
    if (target === undefined) {
        return;
    }
    if (open) {
        context.highlighted = target;
    } else {
        context.openOn(target, "list-navigation");
    }
};

const onkeydown = (event: KeyboardEvent) => {
    if (context.disabled) {
        return;
    }
    const { items, open, highlighted, value } = context;
    const typing =
        event.key === " " && Date.now() - lastTyped < TYPEAHEAD_SPACE;
    if ((event.key.length === 1 && event.key !== " ") || typing) {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        event.preventDefault();
        typeTo(event.key);
        return;
    }
    if (!open) {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp":
            case "Enter":
            case " ":
                event.preventDefault();
                context.openOn(
                    initialHighlight(items, value),
                    "list-navigation",
                );
                return;
            case "Home":
            case "End":
                event.preventDefault();
                context.openOn(
                    (event.key === "Home" ? items[0] : items.at(-1))?.value ??
                        null,
                    "list-navigation",
                );
                return;
            default:
                return;
        }
    }
    const index = items.findIndex((item) => item.value === highlighted);
    switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Home":
        case "End": {
            event.preventDefault();
            const next = menuKeyTarget(event.key, index, items.length, {
                loop: false,
            });
            const target = next === null ? undefined : items[next];
            if (target !== undefined) {
                context.highlighted = target.value;
            }
            return;
        }
        case "Enter":
        case " ":
            event.preventDefault();
            if (highlighted !== null) {
                context.choose(highlighted, "item-press");
            }
            return;
        case "Tab": {
            // APG: Tab chooses the highlighted option, then focus moves on
            const item = items[index];
            if (item !== undefined && !item.disabled) {
                context.choose(item.value, "focus-out");
            } else {
                context.setOpen(false, "focus-out");
            }
            return;
        }
        default:
    }
};

const placeholder = $derived(context.value === null);
const partState = $derived({
    open: context.open,
    disabled: context.disabled,
    placeholder,
});
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            role: "combobox",
            disabled: context.disabled,
            "aria-haspopup": "listbox",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.open ? context.listId : undefined,
            "aria-activedescendant":
                context.open && context.highlighted !== null
                    ? context.itemId(context.highlighted)
                    : undefined,
            "aria-required": context.required ? "true" : undefined,
            "data-select-part": "trigger",
            ...stateAttributes({
                open: context.open,
                disabled: context.disabled,
                placeholder,
            }),
            onclick: () => {
                if (context.open) {
                    context.setOpen(false, "trigger-press");
                } else {
                    context.openOn(
                        initialHighlight(context.items, context.value),
                        "trigger-press",
                    );
                }
            },
            onkeydown,
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
