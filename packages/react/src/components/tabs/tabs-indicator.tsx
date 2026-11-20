import { getDirection } from "@poc/dom";
import { type CSSProperties, useLayoutEffect, useState } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { TabsContext, tabId } from "./tabs-context.ts";

/** Follows the selected tab through CSS variables measured from the list (spec/tabs.md). */
export function TabsIndicator(props: PartProps<{ orientation: string }>) {
    const context = useRequiredContext(TabsContext, "Tabs.Indicator");
    const { list, value, baseId, version } = context;
    const [box, setBox] = useState<CSSProperties | null>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: `version` re-measures when tabs register
    useLayoutEffect(() => {
        if (list === null || value === undefined) {
            setBox(null);
            return undefined;
        }
        const measure = () => {
            const tab = list.ownerDocument.getElementById(tabId(baseId, value));
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
            } as CSSProperties);
        };
        measure();
        const view = list.ownerDocument.defaultView;
        const observer = view?.ResizeObserver
            ? new view.ResizeObserver(measure)
            : null;
        observer?.observe(list);
        return () => observer?.disconnect();
    }, [list, value, baseId, version]);

    if (box === null) {
        return null;
    }
    return renderElement(
        "span",
        props,
        { orientation: context.orientation },
        {
            "aria-hidden": "true",
            "data-tabs-part": "indicator",
            ...stateAttributes({ orientation: context.orientation }),
            style: box,
        },
    );
}
