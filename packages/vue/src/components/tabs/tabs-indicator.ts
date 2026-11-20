import { getDirection } from "@poc/dom";
import { defineComponent, ref, watch } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsKey, tabId } from "./tabs-context.ts";

/** Follows the selected tab through CSS variables measured from the list (spec/tabs.md). */
export const TabsIndicator = defineComponent({
    name: "TabsIndicator",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TabsKey, "Tabs.Indicator");
        const box = ref<Record<string, string> | null>(null);
        watch(
            () =>
                [
                    context.list.value,
                    context.value.value,
                    context.version.value,
                ] as const,
            ([list, value], _, onCleanup) => {
                if (list === null || value === undefined) {
                    box.value = null;
                    return;
                }
                const measure = () => {
                    const tab = list.ownerDocument.getElementById(
                        tabId(context.baseId, value),
                    );
                    if (tab === null) {
                        box.value = null;
                        return;
                    }
                    const listRect = list.getBoundingClientRect();
                    const tabRect = tab.getBoundingClientRect();
                    const inlineStart =
                        getDirection(list) === "rtl"
                            ? listRect.right - tabRect.right
                            : tabRect.left - listRect.left;
                    box.value = {
                        "--tabs-indicator-inset-inline-start": `${inlineStart}px`,
                        "--tabs-indicator-inset-block-start": `${tabRect.top - listRect.top}px`,
                        "--tabs-indicator-inline-size": `${tabRect.width}px`,
                        "--tabs-indicator-block-size": `${tabRect.height}px`,
                    };
                };
                measure();
                const view = list.ownerDocument.defaultView;
                const observer = view?.ResizeObserver
                    ? new view.ResizeObserver(measure)
                    : null;
                observer?.observe(list);
                onCleanup(() => observer?.disconnect());
            },
            { flush: "post", immediate: true },
        );
        return () => {
            if (box.value === null) {
                return null;
            }
            const orientation = context.orientation();
            return renderPart(
                "span",
                { attrs, slots },
                props.as,
                { orientation },
                {
                    "aria-hidden": "true",
                    "data-tabs-part": "indicator",
                    ...stateAttributes({ orientation }),
                    style: box.value,
                },
            );
        };
    },
});
