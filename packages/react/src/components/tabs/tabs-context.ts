import { createContext } from "react";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface TabInfo {
    value: string;
    disabled: boolean;
}

export interface TabsContextValue {
    value: string | undefined;
    select: (value: string, reason: ChangeReason) => void;
    orientation: "horizontal" | "vertical";
    activation: "automatic" | "manual";
    loop: boolean;
    baseId: string;
    tabs: Map<HTMLElement, TabInfo>;
    list: HTMLElement | null;
    setList: (element: HTMLElement | null) => void;
    /** Bumped when a tab registers, so the roving tabindex and the indicator follow. */
    version: number;
    bump: () => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export const tabId = (baseId: string, value: string) =>
    `${baseId}-tab-${value}`;
export const panelId = (baseId: string, value: string) =>
    `${baseId}-panel-${value}`;
