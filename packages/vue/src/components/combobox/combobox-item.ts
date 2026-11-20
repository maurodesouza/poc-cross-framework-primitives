import { defineComponent, shallowRef, useId, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey } from "./combobox-context.ts";

export const ComboboxItem = defineComponent({
    name: "ComboboxItem",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, required: true },
        /** Written into the input when chosen (default: the item's text). */
        label: { type: String, default: undefined },
        /** Can be highlighted, never chosen. */
        disabled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Item");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        const id = useId();
        watch(
            () =>
                [
                    element.value,
                    props.value,
                    props.label,
                    props.disabled,
                ] as const,
            ([node, value, label, disabled], _, onCleanup) => {
                if (node === null) {
                    return;
                }
                context.items.set(node, {
                    value,
                    label: label ?? node.textContent ?? "",
                    disabled,
                    id,
                });
                context.itemCount.value = context.items.size;
                onCleanup(() => {
                    context.items.delete(node);
                    context.itemCount.value = context.items.size;
                });
            },
            { flush: "post", immediate: true },
        );
        watch(
            () => context.highlighted.value === props.value,
            (highlighted) => {
                if (highlighted) {
                    element.value?.scrollIntoView?.({ block: "nearest" });
                }
            },
            { flush: "post" },
        );
        return () => {
            const highlighted = context.highlighted.value === props.value;
            const selected = context.value.value === props.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { highlighted, selected, disabled: props.disabled },
                {
                    role: "option",
                    id,
                    "aria-selected": selected ? "true" : undefined,
                    "aria-disabled": props.disabled ? "true" : undefined,
                    "data-combobox-part": "item",
                    ...stateAttributes({
                        highlighted,
                        selected,
                        disabled: props.disabled,
                    }),
                    onPointermove: () => {
                        if (!highlighted) {
                            context.highlighted.value = props.value;
                        }
                    },
                    onPointerdown: (event: PointerEvent) =>
                        event.preventDefault(),
                    onClick: () => {
                        if (!props.disabled) {
                            context.choose(props.value);
                        }
                    },
                    ref: setElement,
                },
            );
        };
    },
});
