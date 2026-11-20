import { getDirection, stepIndex } from "@poc/dom";
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
        const rtl = getDirection(list) === "rtl";
        const next =
            orientation === "vertical"
                ? "ArrowDown"
                : rtl
                  ? "ArrowLeft"
                  : "ArrowRight";
        const previous =
            orientation === "vertical"
                ? "ArrowUp"
                : rtl
                  ? "ArrowRight"
                  : "ArrowLeft";
        let index = -1;
        if (event.key === next || event.key === previous) {
            index = stepIndex(
                tabs.length,
                current,
                event.key === next ? 1 : -1,
                { loop: context.loop },
            );
        } else if (event.key === "Home") {
            index = 0;
        } else if (event.key === "End") {
            index = tabs.length - 1;
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const info = context.tabs.get(tabs[current] as HTMLElement);
            if (info && !info.disabled) {
                context.select(info.value, "trigger-press");
            }
            return;
        } else {
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
