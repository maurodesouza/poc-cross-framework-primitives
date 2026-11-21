import { createTypeahead, menuKeyTarget } from "@poc/dom";
import { type KeyboardEvent, useRef } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { initialHighlight, SelectContext } from "./select-context.ts";

export interface SelectTriggerState {
    open: boolean;
    disabled: boolean;
    placeholder: boolean;
}

// Within this time after a typed character, Space continues the typeahead instead of choosing.
const TYPEAHEAD_SPACE = 500;

/**
 * The select-only `combobox`: keeps DOM focus while the list is open; the highlighted item is
 * announced with `aria-activedescendant` (spec/select.md, "Keyboard").
 */
export function SelectTrigger(props: PartProps<SelectTriggerState>) {
    const context = useRequiredContext(SelectContext, "Select.Trigger");
    const typeahead = useRef(createTypeahead()).current;
    const lastTyped = useRef(0);
    const { open, items, value, highlighted, disabled } = context;
    const index = items.findIndex((item) => item.value === highlighted);

    const typeTo = (key: string) => {
        const from = items.findIndex(
            (item) => item.value === (open ? highlighted : value),
        );
        const match = typeahead.match(
            key,
            items.map((item) => item.label),
            from,
        );
        lastTyped.current = Date.now();
        const target = items[match]?.value;
        if (target === undefined) {
            return;
        }
        if (open) {
            context.setHighlighted(target);
        } else {
            context.openOn(target, "list-navigation");
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (disabled) {
            return;
        }
        const typing =
            event.key === " " &&
            Date.now() - lastTyped.current < TYPEAHEAD_SPACE;
        if (
            (event.key.length === 1 && event.key !== " ") ||
            (typing && event.key === " ")
        ) {
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
                        (event.key === "Home" ? items[0] : items.at(-1))
                            ?.value ?? null,
                        "list-navigation",
                    );
                    return;
                default:
                    return;
            }
        }
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
                    context.setHighlighted(target.value);
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

    const placeholder = value === null;
    const state = { open, disabled, placeholder };
    return renderElement(
        "button",
        props,
        state,
        {
            type: "button",
            id: context.triggerId,
            role: "combobox",
            disabled,
            "aria-haspopup": "listbox",
            "aria-expanded": open ? "true" : "false",
            "aria-controls": open ? context.listId : undefined,
            "aria-activedescendant":
                open && highlighted !== null
                    ? context.itemId(highlighted)
                    : undefined,
            "aria-required": context.required ? "true" : undefined,
            ...context.field.aria,
            "data-select-part": "trigger",
            ...context.field.attributes,
            ...stateAttributes({ open, disabled, placeholder }),
            onClick: () => {
                if (open) {
                    context.setOpen(false, "trigger-press");
                } else {
                    context.openOn(
                        initialHighlight(items, value),
                        "trigger-press",
                    );
                }
            },
            onKeyDown,
            onFocus: context.field.onFocus,
            onBlur: context.field.onBlur,
        },
        context.setTrigger,
    );
}
