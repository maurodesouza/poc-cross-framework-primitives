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
import { SelectKey } from "./select-context.ts";

/**
 * Places the list below the trigger (spec/select.md, "Item alignment"); the open list is a layer
 * (Escape, outside press).
 */
export const SelectPositioner = defineComponent({
    name: "SelectPositioner",
    inheritAttrs: false,
    props: {
        ...asProp,
        ...positionerProps,
        sideOffset: { type: Number, default: 4 },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SelectKey, "Select.Positioner");
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
                    ignore: () => [context.trigger.value],
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
                    "data-select-part": "positioner",
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
