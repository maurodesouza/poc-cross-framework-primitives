import { createTypeahead, menuKeyTarget } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
    const context = useContext(SelectContext);
    const typeahead = createTypeahead();
    let lastTyped = 0;

    const typeTo = (key: string) => {
        const items = context.items();
        const open = context.open();
        const from = items.findIndex(
            (item) =>
                item.value === (open ? context.highlighted() : context.value()),
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
            context.setHighlighted(target);
        } else {
            context.openOn(target, "list-navigation");
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (context.disabled()) {
            return;
        }
        const items = context.items();
        const value = context.value();
        const highlighted = context.highlighted();
        const typing =
            event.key === " " && Date.now() - lastTyped < TYPEAHEAD_SPACE;
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
        if (!context.open()) {
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

    const state = () => ({
        open: context.open(),
        disabled: context.disabled(),
        placeholder: context.value() === null,
    });
    return renderPart(
        "button",
        props,
        state,
        () => {
            const current = state();
            const highlighted = context.highlighted();
            return {
                type: "button",
                id: context.triggerId,
                role: "combobox",
                disabled: current.disabled,
                "aria-haspopup": "listbox",
                "aria-expanded": current.open ? "true" : "false",
                "aria-controls": current.open ? context.listId : undefined,
                "aria-activedescendant":
                    current.open && highlighted !== null
                        ? context.itemId(highlighted)
                        : undefined,
                "aria-required": context.required() ? "true" : undefined,
                "data-select-part": "trigger",
                ...stateAttributes(current),
                onClick: () => {
                    if (context.open()) {
                        context.setOpen(false, "trigger-press");
                    } else {
                        context.openOn(
                            initialHighlight(context.items(), context.value()),
                            "trigger-press",
                        );
                    }
                },
                onKeyDown,
            };
        },
        { ref: context.setTrigger },
    );
}
