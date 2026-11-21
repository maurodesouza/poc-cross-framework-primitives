import { getDirection } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, Show, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext, tabId } from "./tabs-context.ts";

/** Follows the selected tab through CSS variables measured from the list (spec/tabs.md). */
export function TabsIndicator(props: PartProps<{ orientation: string }>) {
    const context = useContext(TabsContext);
    const [box, setBox] = createSignal<JSX.CSSProperties | null>(null);

    createEffect(
        () => ({
            list: context.list(),
            value: context.value(),
            tick: context.version(),
        }),
        ({ list, value }) => {
            if (list === null || value === undefined) {
                setBox(null);
                return undefined;
            }
            const measure = () => {
                const tab = list.ownerDocument.getElementById(
                    tabId(context.baseId, value),
                );
                if (tab === null) {
                    setBox(null);
                    return;
                }
                const listRect = list.getBoundingClientRect();
                const tabRect = tab.getBoundingClientRect();
                const inlineStart =
                    getDirection(list) === "rtl"
                        ? listRect.right - tabRect.right
                        : tabRect.left - listRect.left;
                setBox({
                    "--tabs-indicator-inset-inline-start": `${inlineStart}px`,
                    "--tabs-indicator-inset-block-start": `${tabRect.top - listRect.top}px`,
                    "--tabs-indicator-inline-size": `${tabRect.width}px`,
                    "--tabs-indicator-block-size": `${tabRect.height}px`,
                });
            };
            measure();
            const view = list.ownerDocument.defaultView;
            const observer = view?.ResizeObserver
                ? new view.ResizeObserver(measure)
                : null;
            observer?.observe(list);
            return () => observer?.disconnect();
        },
    );

    const state = () => ({ orientation: context.orientation() });
    return (
        <Show when={box() !== null}>
            {renderPart("span", props, state, () => ({
                "aria-hidden": "true",
                "data-tabs-part": "indicator",
                ...stateAttributes(state()),
                style: box() ?? undefined,
            }))}
        </Show>
    );
}
