import { defineComponent, type PropType } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { renderPortal } from "../shared/portal.ts";
import { DatePickerKey } from "./date-picker-context.ts";

export const DatePickerPortal = defineComponent({
    name: "DatePickerPortal",
    props: {
        container: {
            type: [Object, String] as PropType<Element | string | null>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const context = useRequiredContext(DatePickerKey, "DatePicker.Portal");
        return () =>
            renderPortal(context.presence.mounted, props.container, () =>
                slots.default?.(),
            );
    },
});
