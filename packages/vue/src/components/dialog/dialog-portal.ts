import { defineComponent, type PropType } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { renderPortal } from "../shared/portal.ts";
import { DialogKey } from "./dialog-context.ts";

/** Moves the backdrop and the popup to the end of `body` while the dialog is open or closing. */
export const DialogPortal = defineComponent({
    name: "DialogPortal",
    props: {
        container: {
            type: [Object, String] as PropType<Element | string | null>,
            default: undefined,
        },
    },
    setup(props, { slots }) {
        const context = useRequiredContext(DialogKey, "Dialog.Portal");
        return () =>
            renderPortal(context.presence.mounted, props.container, () =>
                slots.default?.(),
            );
    },
});
