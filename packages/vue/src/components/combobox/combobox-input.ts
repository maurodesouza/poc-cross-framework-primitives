import { chipArrows, getDirection, stepThroughNone } from "@poc/dom";
import { defineComponent, nextTick } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxKey,
    chipElements,
    highlightedItem,
    openOnPress,
    orderedItems,
    type PendingHighlight,
} from "./combobox-context.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
export const ComboboxInput = defineComponent({
    name: "ComboboxInput",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Input");
        const setInput = elementSetter(context.trigger);
        const openWith = (highlight: PendingHighlight) => {
            context.pendingHighlight.current = highlight;
            context.setOpen(true, "list-navigation");
        };
        const move = (delta: 1 | -1) => {
            // past an end, the visual focus goes back to the input; from the input, to the near end
            const items = orderedItems(context);
            const index = items.findIndex(
                (item) => item.id === context.highlighted.value,
            );
            context.highlighted.value =
                items[stepThroughNone(items.length, index, delta)]?.id ?? null;
        };

        const onKeydown = (event: KeyboardEvent) => {
            const input = event.currentTarget as HTMLInputElement;
            const open = context.open.value;
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
                        const active = highlightedItem(context);
                        if (active !== undefined && !active.disabled) {
                            context.choose(active.value);
                        }
                    }
                    return;
                case "Escape":
                    // the open list's layer takes Escape first; here the list is closed
                    if (
                        !open &&
                        (context.inputValue.value !== "" ||
                            context.values.value.length > 0)
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
                        context.multiple() &&
                        input.value === "" &&
                        context.values.value.length > 0
                    ) {
                        context.removeAt(
                            context.values.value.length - 1,
                            "none",
                        );
                    }
                    return;
                default: {
                    const chips = chipElements(context);
                    if (
                        context.multiple() &&
                        event.key ===
                            chipArrows(getDirection(input) === "rtl")
                                .previous &&
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

        const onInput = (event: Event) => {
            const element = event.target as HTMLInputElement;
            context.setInputValue(element.value, "input-change");
            // a controlled inputValue the consumer kept does not re-render the input:
            // re-assert it once the consumer's update has rendered
            // (spec/README.md, "A controlled value the consumer rejects")
            void nextTick().then(() => {
                if (element.value !== context.inputValue.value) {
                    element.value = context.inputValue.value;
                }
            });
            context.highlighted.value = null;
            context.markTyped();
            context.pendingHighlight.current = null;
            if (!context.open.value) {
                context.setOpen(true, "input-change");
            }
        };

        return () => {
            const open = context.open.value;
            const disabled = context.disabled();
            const highlighted = context.highlighted.value;
            // a rendered option's id only, never a stale one (the item count tracks the options)
            void context.itemCount.value;
            const active =
                highlighted === null
                    ? undefined
                    : orderedItems(context).find(
                          (item) => item.id === highlighted,
                      );
            const { field } = context;
            return renderPart(
                "input",
                { attrs, slots },
                props.as,
                { open, disabled },
                {
                    type: "text",
                    id: context.triggerId,
                    role: "combobox",
                    autocomplete: "off",
                    disabled,
                    value: context.inputValue.value,
                    "aria-autocomplete": "list",
                    "aria-expanded": open ? "true" : "false",
                    "aria-controls": context.listId,
                    "aria-activedescendant":
                        open && active ? active.id : undefined,
                    ...field.aria(),
                    "data-combobox-part": "input",
                    ...field.attributes(),
                    ...stateAttributes({ open, disabled }),
                    onInput,
                    onClick: () => openOnPress(context),
                    onKeydown,
                    onFocus: field.onFocus,
                    onBlur: field.onBlur,
                    ref: setInput,
                },
            );
        };
    },
});
