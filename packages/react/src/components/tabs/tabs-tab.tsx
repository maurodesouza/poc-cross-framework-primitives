import { useLayoutEffect } from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { panelId, TabsContext, tabId } from "./tabs-context.ts";

export interface TabsTabState {
    selected: boolean;
    disabled: boolean;
    orientation: string;
}

export interface TabsTabProps extends PartProps<TabsTabState> {
    value: string;
    /** Stays focusable, is never selected (spec/tabs.md). */
    disabled?: boolean;
}

export function TabsTab({ value, disabled = false, ...props }: TabsTabProps) {
    const context = useRequiredContext(TabsContext, "Tabs.Tab");
    const [element, ref] = useElement<HTMLElement>();
    const { tabs, bump } = context;
    useLayoutEffect(() => {
        if (element === null) {
            return undefined;
        }
        tabs.set(element, { value, disabled });
        bump();
        return () => {
            tabs.delete(element);
        };
    }, [element, value, disabled, tabs, bump]);

    const selected = context.value === value;
    // the roving tab stop: the selected tab, else the first tab
    const firstTab = context.list?.querySelector('[role="tab"]');
    const holdsTabStop =
        context.value === undefined
            ? element !== null && firstTab === element
            : selected;
    const state = { selected, disabled, orientation: context.orientation };
    return renderElement(
        "button",
        props,
        state,
        {
            type: "button",
            role: "tab",
            id: tabId(context.baseId, value),
            "aria-selected": selected ? "true" : "false",
            "aria-controls": panelId(context.baseId, value),
            "aria-disabled": disabled ? "true" : undefined,
            tabIndex: holdsTabStop ? 0 : -1,
            "data-tabs-part": "tab",
            ...stateAttributes({
                selected,
                disabled,
                orientation: context.orientation,
            }),
            onClick: () => {
                if (!disabled) {
                    context.select(value, "trigger-press");
                }
            },
        },
        ref,
    );
}
