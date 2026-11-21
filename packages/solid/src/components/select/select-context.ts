import { createContext } from "solid-js";
import type { FieldControlBinding } from "../../hooks/create-field-control.ts";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** One item of the Root's `items` (spec/select.md, "API"). */
export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectContextValue extends OverlayRoot {
    /** The enclosing field's binding, for the trigger (spec/field.md). */
    field: FieldControlBinding;
    items: () => readonly SelectItemData[];
    value: () => string | null;
    disabled: () => boolean;
    required: () => boolean;
    highlighted: () => string | null;
    setHighlighted: (value: string | null) => void;
    /** Opens the list with this item highlighted. */
    openOn: (value: string | null, reason: ChangeReason) => void;
    /** Chooses an enabled item and closes. */
    choose: (value: string, reason: ChangeReason) => void;
    listId: string;
    /** The id of item `value`'s option element. */
    itemId: (value: string) => string;
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
}

export const SelectContext = createContext<SelectContextValue>();

export interface SelectItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

export const SelectItemContext = createContext<() => SelectItemState>();

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
