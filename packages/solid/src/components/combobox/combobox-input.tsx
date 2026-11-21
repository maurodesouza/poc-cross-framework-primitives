import { chipArrows, getDirection, stepThroughNone } from "@poc/dom";
import { flush, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxContext,
    chipElements,
    openOnPress,
    orderedItems,
    type PendingHighlight,
} from "./combobox-context.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
export function ComboboxInput(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useContext(ComboboxContext);
    const active = () => {
        // the list's items register one pass after they render
        context.itemCount();
        const highlighted = context.highlighted();
        return orderedItems(context).find((item) => item.id === highlighted);
    };

    const openWith = (highlight: PendingHighlight) => {
        context.pendingHighlight.current = highlight;
        context.setOpen(true, "list-navigation");
    };
    const move = (delta: 1 | -1) => {
        // past an end, the visual focus goes back to the input; from the input, to the near end
        const items = orderedItems(context);
        const highlighted = context.highlighted();
        const index = items.findIndex((item) => item.id === highlighted);
        context.setHighlighted(
            items[stepThroughNone(items.length, index, delta)]?.id ?? null,
        );
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const input = event.currentTarget as HTMLInputElement;
        const open = context.open();
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
            case "Enter": {
                if (open) {
                    event.preventDefault();
                    const item = active();
                    if (item !== undefined && !item.disabled) {
                        context.choose(item.value);
                    }
                }
                return;
            }
            case "Escape":
                // the open list's layer takes Escape first; here the list is closed
                if (
                    !open &&
                    (context.inputValue() !== "" || context.values().length > 0)
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
            case "Backspace": {
                const count = context.values().length;
                if (context.multiple() && input.value === "" && count > 0) {
                    context.removeAt(count - 1, "none");
                }
                return;
            }
            default: {
                const chips = chipElements(context);
                if (
                    context.multiple() &&
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

    const state = () => ({
        open: context.open(),
        disabled: context.disabled(),
    });
    return renderPart(
        "input",
        props,
        state,
        () => {
            const current = state();
            const item = active();
            const { field } = context;
            return {
                type: "text",
                id: context.triggerId,
                role: "combobox",
                autocomplete: "off",
                disabled: current.disabled,
                value: context.inputValue(),
                "aria-autocomplete": "list",
                "aria-expanded": String(current.open),
                "aria-controls": context.listId,
                "aria-activedescendant":
                    current.open && item ? item.id : undefined,
                ...field.aria(),
                "data-combobox-part": "input",
                ...field.attributes(),
                ...stateAttributes(current),
                onInput: (event: InputEvent) => {
                    const input = event.currentTarget as HTMLInputElement;
                    context.setInputValue(input.value, "input-change");
                    context.setHighlighted(null);
                    context.markTyped();
                    if (!context.open()) {
                        context.pendingHighlight.current = null;
                        context.setOpen(true, "input-change");
                    }
                    // a controlled `inputValue` the consumer kept unchanged: the binding does
                    // not re-run, so put the accepted text back (React re-asserts it too)
                    flush();
                    if (input.value !== context.inputValue()) {
                        input.value = context.inputValue();
                    }
                },
                onClick: () => openOnPress(context),
                onKeyDown,
                onFocus: field.onFocus,
                onBlur: field.onBlur,
            };
        },
        { ref: context.setTrigger },
    );
}
