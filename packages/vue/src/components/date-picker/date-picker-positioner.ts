import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import {
    positionerProps,
    usePositioner,
} from "../../composables/use-positioner.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DatePickerKey } from "./date-picker-context.ts";

export const DatePickerPositioner = defineComponent({
    name: "DatePickerPositioner",
    inheritAttrs: false,
    props: { ...asProp, ...positionerProps },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(
            DatePickerKey,
            "DatePicker.Positioner",
        );
        const setPositioner = elementSetter(context.positioner);
        const placed = usePositioner(
            props,
            { side: "bottom", align: "start" },
            context.trigger,
            context.positioner,
            null,
        );
        watch(placed, (value) => (context.placed.value = value), {
            immediate: true,
        });
        return () => {
            const open = context.open.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, ...placed.value },
                {
                    role: "presentation",
                    "data-date-picker-part": "positioner",
                    ...stateAttributes({
                        open,
                        side: placed.value.side,
                        align: placed.value.align,
                    }),
                    ref: setPositioner,
                },
            );
        };
    },
});
