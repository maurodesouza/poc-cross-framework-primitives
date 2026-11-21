import { openOverlaySession } from "@poc/dom";
import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import {
    positionerProps,
    usePositioner,
} from "../../composables/use-positioner.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey } from "./combobox-context.ts";

/** Places the list under the input; the open list is a layer (Escape, outside press). */
export const ComboboxPositioner = defineComponent({
    name: "ComboboxPositioner",
    inheritAttrs: false,
    props: { ...asProp, ...positionerProps },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.Positioner");
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
        watch(
            () => [context.open.value, context.positioner.value] as const,
            ([open, positioner], _, onCleanup) => {
                if (!open || positioner === null) {
                    return;
                }
                const session = openOverlaySession(positioner.ownerDocument, {
                    elements: () => [positioner],
                    ignore: () => [context.trigger.value, context.button.value],
                    dismiss: (reason) => context.setOpen(false, reason),
                });
                onCleanup(session.end);
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const open = context.open.value;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open, ...placed.value },
                {
                    role: "presentation",
                    "data-combobox-part": "positioner",
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
