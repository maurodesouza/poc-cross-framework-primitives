import type { Align, Side } from "@poc/dom";
import { createContext, type MutableRefObject } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

export interface ComboboxItemInfo {
    value: string;
    label: string;
    disabled: boolean;
    id: string;
}

export interface ComboboxContextValue extends OverlayRoot {
    value: string | null;
    inputValue: string;
    setInputValue: (value: string, reason: ChangeReason) => void;
    disabled: boolean;
    highlighted: string | null;
    setHighlighted: (value: string | null) => void;
    choose: (value: string) => void;
    clear: () => void;
    items: Map<HTMLElement, ComboboxItemInfo>;
    list: HTMLElement | null;
    setList: (element: HTMLElement | null) => void;
    /** The Trigger button (the overlay root's `trigger` is the input, the list's anchor). */
    button: HTMLElement | null;
    setButton: (element: HTMLElement | null) => void;
    listId: string;
    /** What to highlight once the list renders, after the keyboard opened it. */
    pendingHighlight: MutableRefObject<"first" | "last" | null>;
    placed: { side: Side; align: Align };
    setPlaced: (placed: { side: Side; align: Align }) => void;
    /** Bumped when items register, so `data-empty` follows. */
    itemCount: number;
    setItemCount: (count: number) => void;
}

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

/** The rendered items of the list, in order. */
export function orderedItems(
    context: ComboboxContextValue,
): ComboboxItemInfo[] {
    if (context.list === null) {
        return [];
    }
    return [...context.list.querySelectorAll<HTMLElement>('[role="option"]')]
        .map((element) => context.items.get(element))
        .filter((item): item is ComboboxItemInfo => item !== undefined);
}
