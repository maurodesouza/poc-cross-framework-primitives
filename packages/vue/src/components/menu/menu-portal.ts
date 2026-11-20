import { defineComponent, type PropType } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { renderPortal } from "../shared/portal.ts";
import { MenuKey } from "./menu-context.ts";

export const MenuPortal = defineComponent({
    name: "MenuPortal",
    props: {
        container: {
            type: [Object, String] as PropType<Element | string | null>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const context = useRequiredContext(MenuKey, "Menu.Portal");
        return () =>
            renderPortal(context.presence.mounted, props.container, () =>
                slots.default?.(),
            );
    },
});
