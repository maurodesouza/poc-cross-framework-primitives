import { createDelayGroup } from "@poc/dom";
import { defineComponent, provide } from "vue";
import { TooltipProviderKey } from "./tooltip-context.ts";

/** A delay group: shared delays and the instant hand-off (spec/tooltip.md). */
export const TooltipProvider = defineComponent({
    name: "TooltipProvider",
    props: {
        /** ms before a hovered trigger opens its tooltip. */
        delay: { type: Number, default: 600 },
        /** ms before a tooltip closes once the pointer left. */
        closeDelay: { type: Number, default: 0 },
        /** ms after a close during which another tooltip of the group opens at once. */
        timeout: { type: Number, default: 400 },
    },
    setup(props, { slots }) {
        provide(TooltipProviderKey, {
            delay: () => props.delay,
            closeDelay: () => props.closeDelay,
            group: createDelayGroup({ timeout: props.timeout }),
        });
        return () => slots.default?.();
    },
});
