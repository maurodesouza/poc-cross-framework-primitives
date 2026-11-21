import { createEffect, createSignal, createUniqueId } from "solid-js";
import { createControllable } from "../../hooks/create-controllable.ts";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { type PartProps, renderPart } from "../../utils/part.tsx";
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
export function TabsRoot(props: TabsRootProps) {
    const [value, setValue] = createControllable<
        string | undefined,
        ChangeDetails
    >(
        () => props.value,
        () => props.defaultValue,
        (next, details) => {
            if (next !== undefined) {
                props.onValueChange?.(next, details);
            }
        },
    );
    const tabs = new Map<HTMLElement, TabInfo>();
    const [list, setList] = createSignal<HTMLElement | null>(null);
    const [version, setVersion] = createSignal(0);
    const orientation = () => props.orientation ?? "horizontal";
    const activation = () => props.activation ?? "automatic";

    // no value: the first enabled tab, once the tabs are known
    createEffect(
        () => ({ current: value(), element: list(), tick: version() }),
        ({ current, element }) => {
            if (current !== undefined || element === null) {
                return;
            }
            const first = [
                ...element.querySelectorAll<HTMLElement>('[role="tab"]'),
            ]
                .map((tab) => tabs.get(tab))
                .find((info) => info !== undefined && !info.disabled);
            if (first) {
                setValue(first.value, { reason: "none" });
            }
        },
    );

    const context = {
        value,
        select: (next: string, reason: ChangeReason) =>
            setValue(next, { reason }),
        orientation,
        activation,
        loop: () => props.loop ?? true,
        baseId: createUniqueId(),
        tabs,
        list,
        setList: (element: HTMLElement | null) => setList(element),
        version,
        bump: () => setVersion((current) => current + 1),
    };
    const state = () => ({
        orientation: orientation(),
        activation: activation(),
    });
    return (
        <TabsContext value={context}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    "data-tabs-part": "root",
                    ...stateAttributes(state()),
                }),
                {
                    omit: [
                        "value",
                        "defaultValue",
                        "onValueChange",
                        "orientation",
                        "activation",
                        "loop",
                    ],
                },
            )}
        </TabsContext>
    );
}
