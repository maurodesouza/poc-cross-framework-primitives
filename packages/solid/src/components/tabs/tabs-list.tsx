import { getDirection, tabsKeyTarget } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext } from "./tabs-context.ts";

/** The tablist: one tab stop, arrows move between tabs (spec/tabs.md, "Keyboard"). */
export function TabsList(props: PartProps<{ orientation: string }>) {
    const context = useContext(TabsContext);

    const onKeyDown = (event: KeyboardEvent) => {
        const list = context.list();
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
            orientation: context.orientation(),
            rtl: getDirection(list) === "rtl",
            loop: context.loop(),
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
        if (context.activation() === "automatic" && info && !info.disabled) {
            context.select(info.value, "list-navigation");
        }
    };

    const state = () => ({ orientation: context.orientation() });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "tablist",
            "aria-orientation": context.orientation(),
            "data-tabs-part": "list",
            ...stateAttributes(state()),
            onKeyDown,
        }),
        { ref: context.setList },
    );
}
