import {
    containsFilter,
    filterItems,
    type ItemEquality,
    type ItemFilter,
    type ItemGroup,
    includesItem,
    itemFormValue,
    itemLabel,
    queryIsLabel,
    toggleItem,
} from "@poc/dom";
import { untrack } from "svelte";
import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";
import type { FieldControlBinding } from "../../utils/use-field-control.svelte.ts";

/** A rendered Item, as the Root knows it. */
export interface ComboboxItemInfo {
    value: unknown;
    disabled: boolean;
    id: string;
}

/** What the keyboard highlights once the list renders: the first, the last or the selected item. */
export type PendingHighlight = "first" | "last" | "selected" | null;

type OnChange<T> = () =>
    | ((value: T, details: ChangeDetails) => void)
    | undefined;

const NONE: readonly unknown[] = [];

/**
 * The default `isItemEqualToValue`: `Object.is`, or, for plain objects and arrays, the same keys
 * holding equal values. A value the consumer keeps in its own `$state` (`bind:value`) is a deep
 * proxy of the item, never identical to it; a consumer's `isItemEqualToValue` gets both as they
 * are.
 */
function sameItem(item: unknown, value: unknown): boolean {
    if (Object.is(item, value)) {
        return true;
    }
    if (!isPlain(item) || !isPlain(value)) {
        return false;
    }
    if (Array.isArray(item) !== Array.isArray(value)) {
        return false;
    }
    const keys = Object.keys(item);
    return (
        keys.length === Object.keys(value).length &&
        keys.every(
            (key) =>
                Object.hasOwn(value, key) &&
                sameItem(
                    (item as Record<string, unknown>)[key],
                    (value as Record<string, unknown>)[key],
                ),
        )
    );
}

function isPlain(value: unknown): value is object {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === Array.prototype;
}

/** The value: bound through `bind:value`, or kept here, raw (a value is an item, never proxied). */
class ValueState {
    #own: unknown = $state.raw();

    constructor(
        readonly read: () => unknown,
        readonly write: (value: unknown) => void,
        initial: unknown,
    ) {
        this.#own = initial;
    }

    get value(): unknown {
        const controlled = this.read();
        return controlled === undefined ? this.#own : controlled;
    }

    set(next: unknown): boolean {
        if (Object.is(next, this.value)) {
            return false;
        }
        if (this.read() === undefined) {
            this.#own = next;
        } else {
            this.write(next);
        }
        return true;
    }
}

export interface ComboboxOptions {
    items: () => readonly unknown[] | undefined;
    filter: () => ItemFilter<unknown> | null | undefined;
    limit: () => number;
    locale: () => string | undefined;
    multiple: () => boolean;
    isItemEqualToValue: () => ItemEquality<unknown> | undefined;
    itemToStringLabel: () => ((item: unknown) => string) | undefined;
    itemToStringValue: () => ((item: unknown) => string) | undefined;
    disabled: () => boolean;
    /** The enclosing field's binding, for the input (spec/field.md). */
    field: FieldControlBinding;
}

export class ComboboxState extends OverlayRoot {
    /** The highlighted item's id. */
    highlighted = $state<string | null>(null);
    list = $state<HTMLElement | null>(null);
    /** The Trigger button (the overlay root's `trigger` is the input). */
    button = $state<HTMLElement | null>(null);
    inputGroup = $state<HTMLElement | null>(null);
    chips = $state<HTMLElement | null>(null);
    clearButton = $state<HTMLElement | null>(null);
    /** The registered items' count, for `data-empty` without `items`. */
    itemCount = $state(0);
    /** Bumped when an item registers or leaves, so what reads the items follows. */
    itemsVersion = $state(0);
    /** The input's text changed by typing since the list opened. */
    typed = $state(false);
    readonly items = new Map<HTMLElement, ComboboxItemInfo>();
    readonly pendingHighlight: { current: PendingHighlight } = {
        current: null,
    };
    readonly listId: string;
    readonly #value: ValueState;
    readonly #inputValue: Controllable<string>;
    readonly #onValue: OnChange<unknown>;
    readonly #onInput: OnChange<string>;

    constructor(
        overlay: ConstructorParameters<typeof OverlayRoot>[0],
        value: {
            read: () => unknown;
            write: (value: unknown) => void;
            initial: unknown;
            onChange: OnChange<unknown>;
        },
        inputValue: {
            read: () => string | undefined;
            write: (value: string) => void;
            initial: string;
            onChange: OnChange<string>;
        },
        readonly options: ComboboxOptions,
    ) {
        super({ ...overlay, placed: { side: "bottom", align: "start" } });
        this.#value = new ValueState(value.read, value.write, value.initial);
        this.#inputValue = new Controllable(
            inputValue.read,
            inputValue.write,
            inputValue.initial,
        );
        this.#onValue = value.onChange;
        this.#onInput = inputValue.onChange;
        this.listId = `${this.popupId}-list`;
    }

    get field(): FieldControlBinding {
        return this.options.field;
    }

    get multiple(): boolean {
        return this.options.multiple();
    }

    get disabled(): boolean {
        return this.options.disabled();
    }

    /** Whether the Root has `items` (it filters them). */
    get hasItems(): boolean {
        return this.options.items() !== undefined;
    }

    /** The selected item (or `null`), or the selected items with `multiple`. */
    get value(): unknown {
        return this.#value.value;
    }

    /** The selected items, as a list in both modes. */
    readonly values = $derived.by((): readonly unknown[] => {
        const value = this.value;
        if (this.multiple) {
            return (value as readonly unknown[] | null | undefined) ?? NONE;
        }
        return value === null || value === undefined ? NONE : [value];
    });

    get inputValue(): string {
        return this.#inputValue.value;
    }

    /** The matching entries: items, or groups with their matching items. */
    readonly entries = $derived.by((): readonly unknown[] => {
        const items = this.options.items();
        if (items === undefined) {
            return NONE;
        }
        const query = this.inputValue.trim();
        const locale = this.options.locale();
        const values = this.values;
        // a single combobox that opened on its selected item's label shows every item
        const whole =
            !this.multiple &&
            !this.typed &&
            values.length > 0 &&
            queryIsLabel(this.label(values[0]), query, locale);
        const filter = this.options.filter();
        return filterItems(
            items as readonly (unknown | ItemGroup<unknown>)[],
            whole ? "" : query,
            {
                filter: filter === undefined ? containsFilter(locale) : filter,
                limit: this.options.limit(),
                itemToString: (item) => this.label(item),
            },
        );
    });

    /** Whether the list holds no item. */
    get empty(): boolean {
        return this.hasItems ? this.entries.length === 0 : this.itemCount === 0;
    }

    /** An item's text (`itemToStringLabel`). */
    label(item: unknown): string {
        return itemLabel(item, this.options.itemToStringLabel());
    }

    /** An item's form value (`itemToStringValue`). */
    formValue(item: unknown): string {
        return itemFormValue(item, this.options.itemToStringValue());
    }

    /** `isItemEqualToValue`, else `sameItem`. */
    get isEqual(): ItemEquality<unknown> {
        return this.options.isItemEqualToValue() ?? sameItem;
    }

    isSelected(item: unknown): boolean {
        return includesItem(this.values, item, this.isEqual);
    }

    setValue(next: unknown, reason: ChangeReason): void {
        if (this.#value.set(next)) {
            this.#onValue()?.(next, { reason });
        }
    }

    setInputValue(next: string, reason: ChangeReason): void {
        if (this.#inputValue.set(next)) {
            this.#onInput()?.(next, { reason });
        }
    }

    override setOpen(next: boolean, reason: ChangeReason): void {
        if (!next || reason !== "input-change") {
            this.typed = false;
        }
        if (!next) {
            this.pendingHighlight.current = null;
        }
        super.setOpen(next, reason);
        if (next || reason === "item-press") {
            return;
        }
        // closing without a choice resets the text (spec/combobox.md, "Choosing an item")
        const text = this.multiple ? "" : this.label(this.value);
        if (this.inputValue !== text) {
            this.setInputValue(text, text === "" ? "input-clear" : "none");
        }
    }

    /** Chooses an item (spec/combobox.md, "Choosing an item"). */
    choose(item: unknown): void {
        this.highlighted = null;
        if (!this.multiple) {
            this.setValue(item, "item-press");
            this.setInputValue(this.label(item), "item-press");
            this.setOpen(false, "item-press");
            return;
        }
        const text = this.inputValue;
        this.setValue(
            toggleItem(this.values, item, this.isEqual),
            "item-press",
        );
        if (text.trim() !== "") {
            this.setInputValue("", "input-clear");
            this.setOpen(false, "item-press");
        }
    }

    /** Clears the text and the value. */
    clear(reason: ChangeReason): void {
        this.setInputValue("", reason);
        this.setValue(this.multiple ? [] : null, reason);
        this.highlighted = null;
    }

    /** Removes the value at `index` (`multiple`). */
    removeAt(index: number, reason: ChangeReason): void {
        this.setValue(
            this.values.filter((_, at) => at !== index),
            reason,
        );
    }

    /** Registers a rendered Item; returns its removal. Never tracked by the calling effect. */
    register(element: HTMLElement, info: ComboboxItemInfo): () => void {
        untrack(() => {
            this.items.set(element, info);
            this.itemCount = this.items.size;
            this.itemsVersion += 1;
        });
        return () =>
            untrack(() => {
                this.items.delete(element);
                this.itemCount = this.items.size;
                this.itemsVersion += 1;
            });
    }

    /** The rendered items of the list, in order. */
    orderedItems(): ComboboxItemInfo[] {
        this.itemsVersion;
        const list = this.list;
        if (list === null) {
            return [];
        }
        return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
            .map((element) => this.items.get(element))
            .filter((item): item is ComboboxItemInfo => item !== undefined);
    }

    /** The rendered chips, in value order. */
    chipElements(): HTMLElement[] {
        const chips = this.chips;
        if (chips === null) {
            return [];
        }
        return [
            ...chips.querySelectorAll<HTMLElement>(
                '[data-combobox-part="chip"]',
            ),
        ];
    }

    /** A press on the input opens the list, on the selected item in single mode. */
    openOnPress(): void {
        if (this.open || this.disabled) {
            return;
        }
        this.pendingHighlight.current = this.multiple ? null : "selected";
        this.setOpen(true, "input-press");
    }

    /**
     * A press on the InputGroup or the Chips, outside their buttons, chips and input: focuses the
     * input and opens the list (spec/combobox.md, "Pointer").
     */
    pressToOpen(event: MouseEvent): void {
        const target = event.target as Element | null;
        if (
            target === null ||
            target === this.trigger ||
            target.closest('button, [data-combobox-part="chip"]') !== null
        ) {
            return;
        }
        event.preventDefault();
        if (this.disabled) {
            return;
        }
        this.trigger?.focus();
        this.openOnPress();
    }
}

export const ComboboxContext = createContext<ComboboxState>("Combobox");

export interface ComboboxItemState {
    readonly selected: boolean;
}

export const ComboboxItemContext =
    createContext<ComboboxItemState>("Combobox.Item");

export interface ComboboxGroupState {
    readonly labelId: string;
}

export const ComboboxGroupContext =
    createContext<ComboboxGroupState>("Combobox.Group");

export interface ComboboxChipState {
    /** The chip's element, read when a key or a press removes it. */
    readonly element: () => HTMLElement | null;
}

export const ComboboxChipContext =
    createContext<ComboboxChipState>("Combobox.Chip");
