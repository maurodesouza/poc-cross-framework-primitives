import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface TabInfo {
    value: string;
    disabled: boolean;
}

export interface TabsContext {
    value: Ref<string | undefined>;
    select: (value: string, reason: ChangeReason) => void;
    orientation: () => "horizontal" | "vertical";
    activation: () => "automatic" | "manual";
    loop: () => boolean;
    baseId: string;
    tabs: Map<HTMLElement, TabInfo>;
    list: ShallowRef<HTMLElement | null>;
    /** Bumped when a tab registers, so the roving tab stop and the indicator follow. */
    version: Ref<number>;
}

export const TabsKey: InjectionKey<TabsContext> = Symbol("Tabs");

export const tabId = (baseId: string, value: string) =>
    `${baseId}-tab-${value}`;
export const panelId = (baseId: string, value: string) =>
    `${baseId}-panel-${value}`;
