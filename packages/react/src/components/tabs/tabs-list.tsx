import { getDirection, tabsKeyTarget } from "@poc/dom";
import type { KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.ts";

/** The tablist: one tab stop, arrows move between tabs (spec/tabs.md, "Keyboard"). */
export function TabsList(props: PartProps<{ orientation: string }>) {
    const context = useRequiredContext(TabsContext, "Tabs.List");
    const { orientation, list } = context;

    const onKeyDown = (event: KeyboardEvent) => {
        if (list === null) {
            return;
        }
        const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
        const active = list.ownerDocument.activeElement as HTMLElement | null;
        const current = active ? tabs.indexOf(active) : -1;
        if (current === -1) {
            return;
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const info = context.tabs.get(tabs[current] as HTMLElement);
            if (info && !info.disabled) {
                context.select(info.value, "trigger-press");
            }
            return;
        }
        const index = tabsKeyTarget(event.key, current, tabs.length, {
            orientation,
            rtl: getDirection(list) === "rtl",
            loop: context.loop,
        });
        if (index === null) {
            return;
        }
        event.preventDefault();
        const target = tabs[index];
        if (target === undefined) {
            return;
        }
        target.focus();
        const info = context.tabs.get(target);
        if (context.activation === "automatic" && info && !info.disabled) {
            context.select(info.value, "list-navigation");
        }
    };

    return renderElement(
        "div",
        props,
        { orientation },
        {
            role: "tablist",
            "aria-orientation": orientation,
            "data-tabs-part": "list",
            ...stateAttributes({ orientation }),
            onKeyDown,
        },
        context.setList,
    );
}
