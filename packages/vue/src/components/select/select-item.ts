import { computed, defineComponent, provide, shallowRef, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectItemKey, SelectKey } from "./select-context.ts";

/** An `option` (spec/select.md). */
export const SelectItem = defineComponent({
    name: "SelectItem",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, required: true },
        /** Can be highlighted, never chosen (default: the Root item's `disabled`). */
        disabled: { type: Boolean, default: undefined },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SelectKey, "Select.Item");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        const state = computed(() => ({
            highlighted: context.highlighted.value === props.value,
            selected: context.value.value === props.value,
            disabled:
                props.disabled ??
                context.items().find((item) => item.value === props.value)
                    ?.disabled ??
                false,
        }));
        provide(SelectItemKey, state);
        watch(
            () => state.value.highlighted,
            (highlighted) => {
                if (highlighted) {
                    element.value?.scrollIntoView?.({ block: "nearest" });
                }
            },
            { flush: "post" },
        );
        return () => {
            const { highlighted, selected, disabled } = state.value;
            return renderPart("div", { attrs, slots }, props.as, state.value, {
                role: "option",
                id: context.itemId(props.value),
                "aria-selected": selected ? "true" : "false",
                "aria-disabled": disabled ? "true" : undefined,
                "data-select-part": "item",
                ...stateAttributes({ highlighted, selected, disabled }),
                onPointermove: () => {
                    if (!state.value.highlighted) {
                        context.highlighted.value = props.value;
                    }
                },
                // the trigger keeps DOM focus
                onPointerdown: (event: PointerEvent) => event.preventDefault(),
                onClick: () => {
                    if (!state.value.disabled) {
                        context.choose(props.value, "item-press");
                    }
                },
                ref: setElement,
            });
        };
    },
});
