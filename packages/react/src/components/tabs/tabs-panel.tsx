import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { panelId, TabsContext, tabId } from "./tabs-context.ts";

export interface TabsPanelProps
    extends PartProps<{ selected: boolean; orientation: string }> {
    value: string;
    /** Keep an inactive panel rendered, `hidden` (default `false`). */
    keepMounted?: boolean;
}

export function TabsPanel({
    value,
    keepMounted = false,
    ...props
}: TabsPanelProps) {
    const context = useRequiredContext(TabsContext, "Tabs.Panel");
    const selected = context.value === value;
    if (!selected && !keepMounted) {
        return null;
    }
    return renderElement(
        "div",
        props,
        { selected, orientation: context.orientation },
        {
            role: "tabpanel",
            id: panelId(context.baseId, value),
            "aria-labelledby": tabId(context.baseId, value),
            tabIndex: 0,
            hidden: !selected,
            "data-tabs-part": "panel",
            ...stateAttributes({ selected, orientation: context.orientation }),
        },
    );
}
