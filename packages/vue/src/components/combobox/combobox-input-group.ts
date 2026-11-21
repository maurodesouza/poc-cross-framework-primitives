import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey, pressToOpen } from "./combobox-context.ts";

/** Holds the Input and its buttons; anchors the list (spec/combobox.md). */
export const ComboboxInputGroup = defineComponent({
    name: "ComboboxInputGroup",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.InputGroup");
        const setInputGroup = elementSetter(context.inputGroup);
        return () => {
            const open = context.open.value;
            const disabled = context.disabled();
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, disabled },
                {
                    role: "group",
                    "data-combobox-part": "input-group",
                    ...stateAttributes({ open, disabled }),
                    onMousedown: (event: MouseEvent) =>
                        pressToOpen(context, event),
                    ref: setInputGroup,
                },
            );
        };
    },
});
