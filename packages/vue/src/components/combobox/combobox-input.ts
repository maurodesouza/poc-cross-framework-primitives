import { stepThroughNone } from "@poc/dom";
import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey, orderedItems } from "./combobox-context.ts";

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
        const openWith = (highlight: "first" | "last" | null) => {
            context.pendingHighlight.current = highlight;
            context.setOpen(true, "list-navigation");
        };
        const onKeydown = (event: KeyboardEvent) => {
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
                    const items = orderedItems(context);
                    const index = items.findIndex(
                        (item) => item.value === context.highlighted.value,
                    );
                    const next = stepThroughNone(
                        items.length,
                        index,
                        event.key === "ArrowDown" ? 1 : -1,
                    );
                    context.highlighted.value = items[next]?.value ?? null;
                    return;
                }
                case "Enter":
                    if (open) {
                        event.preventDefault();
                        if (context.highlighted.value !== null) {
                            context.choose(context.highlighted.value);
                        }
                    }
                    return;
                case "Escape":
                    // the open list's layer takes Escape first; here the list is closed
                    if (
                        !open &&
                        (context.inputValue.value !== "" ||
                            context.value.value !== null)
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
        return () => {
            const open = context.open.value;
            const disabled = context.disabled();
            context.itemCount.value;
            const active = orderedItems(context).find(
                (item) => item.value === context.highlighted.value,
            );
            return renderPart(
                "input",
                { attrs, slots },
                props.as,
                { open, disabled },
                {
                    type: "text",
                    role: "combobox",
                    autocomplete: "off",
                    disabled,
                    value: context.inputValue.value,
                    "aria-autocomplete": "list",
                    "aria-expanded": open ? "true" : "false",
                    "aria-controls": context.listId,
                    "aria-activedescendant":
                        open && active ? active.id : undefined,
                    "data-combobox-part": "input",
                    ...stateAttributes({ open, disabled }),
                    onInput: (event: Event) => {
                        context.setInputValue(
                            (event.target as HTMLInputElement).value,
                            "input-change",
                        );
                        context.highlighted.value = null;
                        if (!context.open.value) {
                            context.pendingHighlight.current = null;
                            context.setOpen(true, "input-change");
                        }
                    },
                    onKeydown,
                    ref: setInput,
                },
            );
        };
    },
});
