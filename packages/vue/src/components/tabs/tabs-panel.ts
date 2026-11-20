import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { panelId, TabsKey, tabId } from "./tabs-context.ts";

export const TabsPanel = defineComponent({
    name: "TabsPanel",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, required: true },
        /** Keep an inactive panel rendered, `hidden` (default `false`). */
        keepMounted: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TabsKey, "Tabs.Panel");
        return () => {
            const selected = context.value.value === props.value;
            if (!selected && !props.keepMounted) {
                return null;
            }
            const orientation = context.orientation();
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { selected, orientation },
                {
                    role: "tabpanel",
                    id: panelId(context.baseId, props.value),
                    "aria-labelledby": tabId(context.baseId, props.value),
                    tabindex: 0,
                    hidden: !selected,
                    "data-tabs-part": "panel",
                    ...stateAttributes({ selected, orientation }),
                },
            );
        };
    },
});
