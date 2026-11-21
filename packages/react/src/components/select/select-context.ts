import type { Align, Side } from "@poc/dom";
import { createContext } from "react";
import type { OverlayRoot } from "../../hooks/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** One item of the Root's `items` (spec/select.md, "API"). */
export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectContextValue extends OverlayRoot {
    items: readonly SelectItemData[];
    value: string | null;
    disabled: boolean;
    required: boolean;
    highlighted: string | null;
    setHighlighted: (value: string | null) => void;
    /** Opens the list with this item highlighted. */
    openOn: (value: string | null, reason: ChangeReason) => void;
    /** Chooses an enabled item and closes. */
    choose: (value: string, reason: ChangeReason) => void;
    listId: string;
    /** The id of item `value`'s option element. */
    itemId: (value: string) => string;
    placed: { side: Side; align: Align };
    setPlaced: (placed: { side: Side; align: Align }) => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export interface SelectItemContextValue {
    selected: boolean;
    highlighted: boolean;
    disabled: boolean;
}

export const SelectItemContext = createContext<SelectItemContextValue | null>(
    null,
);

/** The item to highlight when the list opens: the selected one, else the first enabled one. */
export function initialHighlight(
    items: readonly SelectItemData[],
    value: string | null,
): string | null {
    if (value !== null && items.some((item) => item.value === value)) {
        return value;
    }
    return items.find((item) => !item.disabled)?.value ?? null;
}
