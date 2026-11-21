import { createTypeahead, menuKeyTarget } from "@poc/dom";
import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { initialHighlight, SelectKey } from "./select-context.ts";

// Within this time after a typed character, Space continues the typeahead instead of choosing.
const TYPEAHEAD_SPACE = 500;

/**
 * The select-only `combobox`: keeps DOM focus while the list is open; the highlighted item is
 * announced with `aria-activedescendant` (spec/select.md, "Keyboard").
 */
export const SelectTrigger = defineComponent({
    name: "SelectTrigger",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SelectKey, "Select.Trigger");
        const setTrigger = elementSetter(context.trigger);
        const typeahead = createTypeahead();
        let lastTyped = 0;

        const typeTo = (key: string) => {
            const items = context.items();
            const open = context.open.value;
            const from = items.findIndex(
                (item) =>
                    item.value ===
                    (open ? context.highlighted.value : context.value.value),
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
                context.highlighted.value = target;
            } else {
                context.openOn(target, "list-navigation");
            }
        };

        const onKeydown = (event: KeyboardEvent) => {
            if (context.disabled()) {
                return;
            }
            const items = context.items();
            const open = context.open.value;
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
                            initialHighlight(items, context.value.value),
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
            const index = items.findIndex(
                (item) => item.value === context.highlighted.value,
            );
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
                        context.highlighted.value = target.value;
                    }
                    return;
                }
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (context.highlighted.value !== null) {
                        context.choose(context.highlighted.value, "item-press");
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

        return () => {
            const open = context.open.value;
            const disabled = context.disabled();
            const value = context.value.value;
            const highlighted = context.highlighted.value;
            const placeholder = value === null;
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { open, disabled, placeholder },
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
                    "aria-required": context.required() ? "true" : undefined,
                    ...context.field.aria(),
                    "data-select-part": "trigger",
                    ...context.field.attributes(),
                    ...stateAttributes({ open, disabled, placeholder }),
                    onClick: () => {
                        if (context.open.value) {
                            context.setOpen(false, "trigger-press");
                        } else {
                            context.openOn(
                                initialHighlight(
                                    context.items(),
                                    context.value.value,
                                ),
                                "trigger-press",
                            );
                        }
                    },
                    onKeydown,
                    onFocus: context.field.onFocus,
                    onBlur: context.field.onBlur,
                    ref: setTrigger,
                },
            );
        };
    },
});
