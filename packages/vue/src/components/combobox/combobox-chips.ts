import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { ComboboxKey, pressToOpen } from "./combobox-context.ts";

/** `multiple`: holds the chips and the Input; a `toolbar` while it holds a chip. */
export const ComboboxChips = defineComponent({
    name: "ComboboxChips",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Chips");
        const setChips = elementSetter(context.chips);
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                {},
                {
                    role:
                        context.values.value.length > 0 ? "toolbar" : undefined,
                    "data-combobox-part": "chips",
                    onMousedown: (event: MouseEvent) =>
                        pressToOpen(context, event),
                    ref: setChips,
                },
            );
    },
});
