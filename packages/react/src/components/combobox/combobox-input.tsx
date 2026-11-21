import { chipArrows, getDirection, stepThroughNone } from "@poc/dom";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
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
    const context = useRequiredContext(ComboboxContext, "Combobox.Input");
    const { open, disabled, highlighted, field } = context;
    const items = orderedItems(context);
    const active = items.find((item) => item.id === highlighted);

    const openWith = (highlight: PendingHighlight) => {
        context.pendingHighlight.current = highlight;
        context.setOpen(true, "list-navigation");
    };
    const move = (delta: 1 | -1) => {
        // past an end, the visual focus goes back to the input; from the input, to the near end
        const index = items.findIndex((item) => item.id === highlighted);
        context.setHighlighted(
            items[stepThroughNone(items.length, index, delta)]?.id ?? null,
        );
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
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
                const chips = chipElements(context);
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

    const state = { open, disabled };
    return renderElement(
        "input",
        props,
        state,
        {
            type: "text",
            id: context.triggerId,
            role: "combobox",
            autoComplete: "off",
            disabled,
            value: context.inputValue,
            "aria-autocomplete": "list",
            "aria-expanded": open,
            "aria-controls": context.listId,
            "aria-activedescendant": open && active ? active.id : undefined,
            ...field.aria,
            "data-combobox-part": "input",
            ...field.attributes,
            ...stateAttributes({ open, disabled }),
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                context.setInputValue(event.target.value, "input-change");
                context.setHighlighted(null);
                context.markTyped();
                context.pendingHighlight.current = null;
                if (!open) {
                    context.setOpen(true, "input-change");
                }
            },
            onClick: () => openOnPress(context),
            onKeyDown,
            onFocus: field.onFocus,
            onBlur: field.onBlur,
        },
        context.setTrigger,
    );
}
