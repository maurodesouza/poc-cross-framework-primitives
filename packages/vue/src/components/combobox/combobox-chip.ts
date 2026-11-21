import { chipKeyTarget, getDirection } from "@poc/dom";
import { defineComponent, nextTick, provide, shallowRef } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipKey,
    ComboboxKey,
    chipElements,
} from "./combobox-context.ts";

/** One value of a `multiple` combobox; the arrows move between chips (spec/combobox.md). */
export const ComboboxChip = defineComponent({
    name: "ComboboxChip",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Chip");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        provide(ComboboxChipKey, () => element.value);

        const onKeydown = (event: KeyboardEvent) => {
            if (
                context.disabled() ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey
            ) {
                return;
            }
            const current = event.currentTarget as HTMLElement;
            const chips = chipElements(context);
            const index = chips.indexOf(current);
            const action = chipKeyTarget(
                event.key,
                index,
                chips.length,
                getDirection(current) === "rtl",
            );
            if (action === null) {
                return;
            }
            // a printable character goes on to the input, focused below
            if (event.key.length !== 1 || event.key === " ") {
                event.preventDefault();
            }
            if (action.open) {
                context.setOpen(true, "list-navigation");
            }
            const focus = () => {
                const target =
                    action.focus === "input"
                        ? context.trigger.value
                        : chipElements(context)[action.focus];
                target?.focus();
            };
            if (!action.remove) {
                focus();
                return;
            }
            context.removeAt(index, "none");
            // the chip's index is in the chips that are left: once they render
            void nextTick().then(focus);
        };

        return () => {
            const disabled = context.disabled();
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { disabled },
                {
                    tabindex: -1,
                    "aria-disabled": disabled ? "true" : undefined,
                    "data-combobox-part": "chip",
                    ...stateAttributes({ disabled }),
                    onKeydown,
                    ref: setElement,
                },
            );
        };
    },
});
