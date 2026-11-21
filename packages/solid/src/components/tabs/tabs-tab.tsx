import { createEffect, createSignal, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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

export function TabsTab(props: TabsTabProps) {
    const context = useContext(TabsContext);
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const disabled = () => props.disabled ?? false;
    createEffect(
        () => ({ node: element(), value: props.value, off: disabled() }),
        ({ node, value, off }) => {
            if (node === null) {
                return undefined;
            }
            context.tabs.set(node, { value, disabled: off });
            context.bump();
            return () => {
                context.tabs.delete(node);
            };
        },
    );

    const selected = () => context.value() === props.value;
    // the roving tab stop: the selected tab, else the first tab
    // (found by id, not through `element`: the ref writes it from the element's own spread)
    const holdsTabStop = () => {
        context.version();
        return context.value() === undefined
            ? context.list()?.querySelector('[role="tab"]')?.id ===
                  tabId(context.baseId, props.value)
            : selected();
    };
    const state = () => ({
        selected: selected(),
        disabled: disabled(),
        orientation: context.orientation(),
    });
    return renderPart(
        "button",
        props,
        state,
        () => ({
            type: "button",
            role: "tab",
            id: tabId(context.baseId, props.value),
            "aria-selected": selected() ? "true" : "false",
            "aria-controls": panelId(context.baseId, props.value),
            "aria-disabled": disabled() ? "true" : undefined,
            tabindex: holdsTabStop() ? 0 : -1,
            "data-tabs-part": "tab",
            ...stateAttributes(state()),
            onClick: () => {
                if (!disabled()) {
                    context.select(props.value, "trigger-press");
                }
            },
        }),
        { ref: (node) => setElement(node), omit: ["value", "disabled"] },
    );
}
