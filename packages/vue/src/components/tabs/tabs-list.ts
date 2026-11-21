import { getDirection, tabsKeyTarget } from "@poc/dom";
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
