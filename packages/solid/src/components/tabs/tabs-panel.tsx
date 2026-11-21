import { Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { panelId, TabsContext, tabId } from "./tabs-context.ts";

export interface TabsPanelProps
    extends PartProps<{ selected: boolean; orientation: string }> {
    value: string;
    /** Keep an inactive panel rendered, `hidden` (default `false`). */
    keepMounted?: boolean;
}

export function TabsPanel(props: TabsPanelProps) {
    const context = useContext(TabsContext);
    const selected = () => context.value() === props.value;
    const state = () => ({
        selected: selected(),
        orientation: context.orientation(),
    });
    return (
        <Show when={selected() || (props.keepMounted ?? false)}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    role: "tabpanel",
                    id: panelId(context.baseId, props.value),
                    "aria-labelledby": tabId(context.baseId, props.value),
                    tabindex: 0,
                    hidden: !selected(),
                    "data-tabs-part": "panel",
                    ...stateAttributes(state()),
                }),
                { omit: ["value", "keepMounted"] },
            )}
        </Show>
    );
}
