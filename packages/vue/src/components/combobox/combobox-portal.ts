import { defineComponent, type PropType } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { renderPortal } from "../shared/portal.ts";
import { ComboboxKey } from "./combobox-context.ts";

export const ComboboxPortal = defineComponent({
    name: "ComboboxPortal",
    props: {
        container: {
            type: [Object, String] as PropType<Element | string | null>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Portal");
        return () =>
            renderPortal(context.presence.mounted, props.container, () =>
                slots.default?.(),
            );
    },
});
