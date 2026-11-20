import { getDirection, stepIndex } from "@poc/dom";
import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsKey } from "./tabs-context.ts";

/** The tablist: one tab stop, arrows move between tabs (spec/tabs.md, "Keyboard"). */
export const TabsList = defineComponent({
    name: "TabsList",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TabsKey, "Tabs.List");
        const setList = elementSetter(context.list);
        const onKeydown = (event: KeyboardEvent) => {
            const list = context.list.value;
            if (list === null) {
                return;
            }
            const tabs = [
                ...list.querySelectorAll<HTMLElement>('[role="tab"]'),
            ];
            const active = list.ownerDocument
                .activeElement as HTMLElement | null;
            const current = active ? tabs.indexOf(active) : -1;
            if (current === -1) {
                return;
            }
            const orientation = context.orientation();
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
                    { loop: context.loop() },
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
            if (
                context.activation() === "automatic" &&
                info &&
                !info.disabled
            ) {
                context.select(info.value, "list-navigation");
            }
        };
        return () => {
            const orientation = context.orientation();
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { orientation },
                {
                    role: "tablist",
                    "aria-orientation": orientation,
                    "data-tabs-part": "list",
                    ...stateAttributes({ orientation }),
                    onKeydown,
                    ref: setList,
                },
            );
        };
    },
});
