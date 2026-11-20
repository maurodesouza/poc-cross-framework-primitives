import { defineComponent, type PropType } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { renderPortal } from "../shared/portal.ts";
import { PopoverKey } from "./popover-context.ts";

export const PopoverPortal = defineComponent({
    name: "PopoverPortal",
    props: {
        container: {
            type: [Object, String] as PropType<Element | string | null>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const context = useRequiredContext(PopoverKey, "Popover.Portal");
        return () =>
            renderPortal(context.presence.mounted, props.container, () =>
                slots.default?.(),
            );
    },
});
