import type { Align, Side } from "@poc/dom";
import type { ComputedRef, InjectionKey, Ref, ShallowRef } from "vue";
import type { FieldControlBinding } from "../../composables/use-field-control.ts";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";

/** A rendered Item, as the Root knows it. */
export interface ComboboxItemInfo {
    value: unknown;
    disabled: boolean;
    id: string;
}

/** What the keyboard highlights once the list renders: the first, the last or the selected item. */
export type PendingHighlight = "first" | "last" | "selected" | null;

export interface ComboboxContext extends OverlayRoot {
    /** The enclosing field's binding, for the input (spec/field.md). */
    field: FieldControlBinding;
    multiple: () => boolean;
    /** The selected item (or `null`), or the selected items with `multiple`. */
    value: ComputedRef<unknown>;
    /** The selected items, as a list in both modes. */
    values: ComputedRef<readonly unknown[]>;
    inputValue: ComputedRef<string>;
    setInputValue: (value: string, reason: ChangeReason) => void;
    /** Opens or closes; closing without a choice resets the text. */
    setOpen: (open: boolean, reason: ChangeReason) => void;
    disabled: () => boolean;
    /** The highlighted item's id. */
    highlighted: Ref<string | null>;
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
    entries: ComputedRef<readonly unknown[]>;
    /** The input's text changed by typing since the list opened. */
    markTyped: () => void;
    items: Map<HTMLElement, ComboboxItemInfo>;
    list: ShallowRef<HTMLElement | null>;
    /** The Trigger button (the overlay root's `trigger` is the input). */
    button: ShallowRef<HTMLElement | null>;
    inputGroup: ShallowRef<HTMLElement | null>;
    chips: ShallowRef<HTMLElement | null>;
    clearButton: ShallowRef<HTMLElement | null>;
    listId: string;
    pendingHighlight: { current: PendingHighlight };
    placed: Ref<{ side: Side; align: Align }>;
    /** Bumped when items register, so `data-empty` and the pending highlight follow. */
    itemCount: Ref<number>;
}

export const ComboboxKey: InjectionKey<ComboboxContext> = Symbol("Combobox");

export interface ComboboxItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

export const ComboboxItemKey: InjectionKey<ComputedRef<ComboboxItemState>> =
    Symbol("ComboboxItem");

export const ComboboxGroupKey: InjectionKey<{ labelId: string }> =
    Symbol("ComboboxGroup");

/** The chip's element, read when a key or a press removes it. */
export const ComboboxChipKey: InjectionKey<() => HTMLElement | null> =
    Symbol("ComboboxChip");

/** Whether the list holds no item: no matching entry, or no rendered Item. */
export function isEmpty(context: ComboboxContext): boolean {
    return context.hasItems()
        ? context.entries.value.length === 0
        : context.itemCount.value === 0;
}

/** The rendered items of the list, in order. */
export function orderedItems(context: ComboboxContext): ComboboxItemInfo[] {
    const list = context.list.value;
    if (list === null) {
        return [];
    }
    return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
        .map((element) => context.items.get(element))
        .filter((item): item is ComboboxItemInfo => item !== undefined);
}

/** The highlighted item, as registered. */
export function highlightedItem(
    context: ComboboxContext,
): ComboboxItemInfo | undefined {
    const id = context.highlighted.value;
    if (id === null) {
        return undefined;
    }
    for (const item of context.items.values()) {
        if (item.id === id) {
            return item;
        }
    }
    return undefined;
}

/** The rendered chips, in value order. */
export function chipElements(context: ComboboxContext): HTMLElement[] {
    const chips = context.chips.value;
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
export function pressToOpen(context: ComboboxContext, event: MouseEvent): void {
    const target = event.target as Element | null;
    if (
        target === null ||
        target === context.trigger.value ||
        target.closest('button, [data-combobox-part="chip"]') !== null
    ) {
        return;
    }
    event.preventDefault();
    if (context.disabled()) {
        return;
    }
    context.trigger.value?.focus();
    openOnPress(context);
}

/** A press on the input opens the list, on the selected item in single mode. */
export function openOnPress(context: ComboboxContext): void {
    if (context.open.value || context.disabled()) {
        return;
    }
    context.pendingHighlight.current = context.multiple() ? null : "selected";
    context.setOpen(true, "input-press");
}
