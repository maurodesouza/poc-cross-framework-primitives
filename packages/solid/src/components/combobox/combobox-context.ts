import { createContext } from "solid-js";
import type { FieldControlBinding } from "../../hooks/create-field-control.ts";
import type { OverlayRoot } from "../../hooks/create-overlay-root.ts";
import type { Placement } from "../../hooks/create-positioner.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** A rendered Item, as the Root knows it. */
export interface ComboboxItemInfo {
    value: unknown;
    disabled: boolean;
    id: string;
}

/** What the keyboard highlights once the list renders: the first, the last or the selected item. */
export type PendingHighlight = "first" | "last" | "selected" | null;

export interface ComboboxContextValue extends OverlayRoot {
    /** The enclosing field's binding, for the input (spec/field.md). */
    field: FieldControlBinding;
    multiple: () => boolean;
    /** The selected item (or `null`), or the selected items with `multiple`. */
    value: () => unknown;
    /** The selected items, as a list in both modes. */
    values: () => readonly unknown[];
    inputValue: () => string;
    setInputValue: (value: string, reason: ChangeReason) => void;
    disabled: () => boolean;
    /** The highlighted item's id. */
    highlighted: () => string | null;
    setHighlighted: (id: string | null) => void;
    isSelected: (item: unknown) => boolean;
    /** Chooses an item (spec/combobox.md, "Choosing an item"). */
    choose: (item: unknown) => void;
    /** Clears the text and the value. */
    clear: (reason: ChangeReason) => void;
    /** Removes the value at `index` (`multiple`). */
    removeAt: (index: number, reason: ChangeReason) => void;
    /** An item's text (`itemToStringLabel`). */
    label: (item: unknown) => string;
    /** Whether the Root has `items` (it filters them). */
    hasItems: () => boolean;
    /** The matching entries: items, or groups with their matching items. */
    entries: () => readonly unknown[];
    /** The input's text changed by typing since the list opened. */
    markTyped: () => void;
    items: Map<HTMLElement, ComboboxItemInfo>;
    list: () => HTMLElement | null;
    setList: (element: HTMLElement | null) => void;
    /** The Trigger button (the overlay root's `trigger` is the input). */
    button: () => HTMLElement | null;
    setButton: (element: HTMLElement | null) => void;
    inputGroup: () => HTMLElement | null;
    setInputGroup: (element: HTMLElement | null) => void;
    chips: () => HTMLElement | null;
    setChips: (element: HTMLElement | null) => void;
    clearButton: () => HTMLElement | null;
    setClearButton: (element: HTMLElement | null) => void;
    listId: string;
    pendingHighlight: { current: PendingHighlight };
    placed: () => Placement;
    setPlaced: (placed: Placement) => void;
    /** Changed when items register, so `data-empty` and the pending highlight follow. */
    itemCount: () => number;
    setItemCount: (count: number) => void;
}

export const ComboboxContext = createContext<ComboboxContextValue>();

export const ComboboxItemContext = createContext<() => { selected: boolean }>();

export const ComboboxGroupContext = createContext<{ labelId: string }>();

export interface ComboboxChipContextValue {
    /** The chip's element, read when a key or a press removes it. */
    element: () => HTMLElement | null;
}

export const ComboboxChipContext = createContext<ComboboxChipContextValue>();

/** The rendered items of the list, in order. */
export function orderedItems(
    context: ComboboxContextValue,
): ComboboxItemInfo[] {
    const list = context.list();
    if (list === null) {
        return [];
    }
    return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
        .map((element) => context.items.get(element))
        .filter((item): item is ComboboxItemInfo => item !== undefined);
}

/** The rendered chips, in value order. */
export function chipElements(context: ComboboxContextValue): HTMLElement[] {
    const chips = context.chips();
    if (chips === null) {
        return [];
    }
    return [
        ...chips.querySelectorAll<HTMLElement>('[data-combobox-part="chip"]'),
    ];
}

/**
 * A press on the InputGroup or the Chips, outside their buttons, chips and input: focuses the
 * input and opens the list (spec/combobox.md, "Pointer").
 */
export function pressToOpen(
    context: ComboboxContextValue,
    event: MouseEvent,
): void {
    const target = event.target as Element | null;
    if (
        target === null ||
        target === context.trigger() ||
        target.closest('button, [data-combobox-part="chip"]') !== null
    ) {
        return;
    }
    event.preventDefault();
    if (context.disabled()) {
        return;
    }
    context.trigger()?.focus();
    openOnPress(context);
}

/** A press on the input opens the list, on the selected item in single mode. */
export function openOnPress(context: ComboboxContextValue): void {
    if (context.open() || context.disabled()) {
        return;
    }
    context.pendingHighlight.current = context.multiple() ? null : "selected";
    context.setOpen(true, "input-press");
}
