import { useCallback, useId, useLayoutEffect, useMemo, useState } from "react";
import { useControllableState } from "../../hooks/use-controllable-state.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { type TabInfo, TabsContext } from "./tabs-context.ts";

export interface TabsRootState {
    orientation: "horizontal" | "vertical";
    activation: "automatic" | "manual";
}

export interface TabsRootProps extends PartProps<TabsRootState> {
    value?: string;
    /** Default: the first enabled tab. */
    defaultValue?: string;
    onValueChange?: (value: string, details: ChangeDetails) => void;
    orientation?: "horizontal" | "vertical";
    /** `automatic`: moving focus selects; `manual`: Enter or Space selects. */
    activation?: "automatic" | "manual";
    loop?: boolean;
}

/** spec/tabs.md */
export function TabsRoot({
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activation = "automatic",
    loop = true,
    ...props
}: TabsRootProps) {
    const [value, setValue] = useControllableState<
        string | undefined,
        ChangeDetails
    >(
        valueProp,
        defaultValue,
        onValueChange as
            | ((value: string | undefined, details: ChangeDetails) => void)
            | undefined,
    );
    const baseId = useId();
    const tabs = useMemo(() => new Map<HTMLElement, TabInfo>(), []);
    const [list, setList] = useState<HTMLElement | null>(null);
    const [version, setVersion] = useState(0);
    const bump = useCallback(() => setVersion((current) => current + 1), []);
    const select = useCallback(
        (next: string, reason: ChangeReason) => setValue(next, { reason }),
        [setValue],
    );

    // no value: the first enabled tab, once the tabs are known
    // biome-ignore lint/correctness/useExhaustiveDependencies: `version` re-runs it when tabs register
    useLayoutEffect(() => {
        if (value !== undefined || list === null) {
            return;
        }
        const first = [...list.querySelectorAll<HTMLElement>('[role="tab"]')]
            .map((element) => tabs.get(element))
            .find((info) => info !== undefined && !info.disabled);
        if (first) {
            setValue(first.value, { reason: "none" });
        }
    }, [value, list, tabs, setValue, version]);

    const context = useMemo(
        () => ({
            value,
            select,
            orientation,
            activation,
            loop,
            baseId,
            tabs,
            list,
            setList,
            version,
            bump,
        }),
        [
            value,
            select,
            orientation,
            activation,
            loop,
            baseId,
            tabs,
            list,
            version,
            bump,
        ],
    );
    const state = { orientation, activation };
    return (
        <TabsContext.Provider value={context}>
            {renderElement("div", props, state, {
                "data-tabs-part": "root",
                ...stateAttributes({ orientation, activation }),
            })}
        </TabsContext.Provider>
    );
}
