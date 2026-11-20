import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerKey } from "./date-picker-context.ts";

/** Opens the picker; its content is the consumer's (for example the formatted value). */
export const DatePickerTrigger = defineComponent({
    name: "DatePickerTrigger",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(DatePickerKey, "DatePicker.Trigger");
        const setTrigger = elementSetter(context.trigger);
        return () => {
            const open = context.open.value;
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { open },
                {
                    type: "button",
                    id: context.triggerId,
                    "aria-haspopup": "dialog",
                    "aria-expanded": open ? "true" : "false",
                    "aria-controls": open ? context.popupId : undefined,
                    "data-date-picker-part": "trigger",
                    ...stateAttributes({ open }),
                    onClick: () => context.setOpen(!open, "trigger-press"),
                    ref: setTrigger,
                },
            );
        };
    },
});
