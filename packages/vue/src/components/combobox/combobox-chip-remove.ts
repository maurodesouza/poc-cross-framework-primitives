import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipKey,
    ComboboxKey,
    chipElements,
} from "./combobox-context.ts";

/** Removes its chip's value and returns focus to the input. */
export const ComboboxChipRemove = defineComponent({
    name: "ComboboxChipRemove",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.ChipRemove");
        const chip = useRequiredContext(ComboboxChipKey, "Combobox.ChipRemove");
        return () => {
            const disabled = context.disabled();
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { disabled },
                {
                    type: "button",
                    tabindex: -1,
                    disabled,
                    "data-combobox-part": "chip-remove",
                    ...stateAttributes({ disabled }),
                    onPointerdown: (event: PointerEvent) =>
                        event.preventDefault(),
                    onClick: () => {
                        const element = chip();
                        const index =
                            element === null
                                ? -1
                                : chipElements(context).indexOf(element);
                        if (index >= 0) {
                            context.removeAt(index, "chip-remove-press");
                        }
                        context.trigger.value?.focus();
                    },
                },
            );
        };
    },
});
