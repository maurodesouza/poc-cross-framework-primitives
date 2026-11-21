import {
    afterNextRender,
    afterRenderEffect,
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    ElementRef,
    effect,
    inject,
    input,
    output,
    signal,
    untracked,
} from "@angular/core";
import {
    bridgeForm,
    containsFilter,
    createId,
    filterItems,
    type ItemEquality,
    type ItemFilter,
    includesItem,
    itemFormValue,
    itemLabel,
    queryIsLabel,
    toggleItem,
} from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    OpenChangeEvent,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { fieldControl } from "../../utils/field-control.ts";
import { injectFlush } from "../../utils/flush.ts";
import {
    createHiddenInput,
    setInputAttribute,
} from "../../utils/hidden-input.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";

/** An item, a value, or a list of values: the consumer's own type (spec/combobox.md, "API"). */
// biome-ignore lint/suspicious/noExplicitAny: an item is the consumer's own type
export type ComboboxItemValue = any;

/** A rendered Item, as the Root knows it. */
export interface ComboboxItemInfo {
    value: ComboboxItemValue;
    disabled: boolean;
    id: string;
}

/** What the keyboard highlights once the list renders: the first, the last or the selected item. */
export type PendingHighlight = "first" | "last" | "selected" | null;

export interface ComboboxState {
    open: boolean;
    disabled: boolean;
    /** The selected item (or `null`), or the selected items with `multiple`. */
    value: ComboboxItemValue;
    inputValue: string;
}

const NONE: readonly ComboboxItemValue[] = [];

/**
 * Holds the combobox's state and renders its hidden form inputs (spec/combobox.md):
 * `<ng-container comboboxRoot #combobox="comboboxRoot" [items]="fruits" [(value)]="value">`.
 * `value()`, `inputValue()` and `state()` are the current state, bound or its own: the consumer
 * renders the chips with `@for (item of combobox.value(); ...)` (Angular has no Value part). The
 * overlay's `trigger` is the input, the Trigger button is `button`.
 */
@Directive({ selector: "[comboboxRoot]", exportAs: "comboboxRoot" })
export class ComboboxRoot {
    /** The items, or groups of items: the combobox filters them, the List renders the matches. */
    readonly items = input<readonly ComboboxItemValue[] | undefined>(undefined);
    /** Whether an item matches the query; `null` turns filtering off. */
    readonly filter = input<ItemFilter<ComboboxItemValue> | null | undefined>(
        undefined,
    );
    /** The most items the list renders; `-1` for no limit. */
    readonly limit = input(-1);
    readonly locale = input<string | undefined>(undefined);
    readonly multiple = input(false, { transform: booleanAttribute });
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();
    /** The bound value (`[(value)]`); `value()` is the current one. */
    readonly boundValue = input<ComboboxItemValue>(undefined, {
        alias: "value",
    });
    readonly valueChange = output<ComboboxItemValue>();
    readonly defaultValue = input<ComboboxItemValue>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<ComboboxItemValue>>();
    /** The bound text (`[(inputValue)]`); `inputValue()` is the current one. */
    readonly boundInputValue = input<string | undefined>(undefined, {
        alias: "inputValue",
    });
    readonly inputValueChange = output<string>();
    readonly defaultInputValue = input<string | undefined>(undefined);
    readonly inputValueChangeDetails = output<ValueChangeEvent<string>>();
    readonly isItemEqualToValue = input<
        ItemEquality<ComboboxItemValue> | undefined
    >(undefined);
    readonly itemToStringLabel = input<
        ((item: ComboboxItemValue) => string) | undefined
    >(undefined);
    readonly itemToStringValue = input<
        ((item: ComboboxItemValue) => string) | undefined
    >(undefined);
    readonly name = input<string | undefined>(undefined);
    readonly required = input(false, { transform: booleanAttribute });
    readonly disabled = input(false, { transform: booleanAttribute });

    /** The input's id, once it has one: the field's label points at it. */
    readonly inputElementId = signal<string | undefined>(undefined);
    /** The visually hidden input: the single value's form entry, and what the browser validates. */
    private readonly hidden = createHiddenInput(
        inject(ElementRef).nativeElement,
        { "data-combobox-part": "hidden-input" },
    );
    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-combobox",
    );
    private readonly fallbackValue = (): ComboboxItemValue =>
        this.defaultValue() ?? (this.multiple() ? NONE : null);
    private readonly selection = controllable<ComboboxItemValue, ChangeDetails>(
        this.boundValue,
        this.valueChange,
        this.fallbackValue,
        (value, details) => this.valueChangeDetails.emit({ value, details }),
    );
    /** The selected item (or `null`), or the selected items with `multiple`. */
    readonly value = this.selection.value;
    /** The selected items, as a list in both modes. */
    readonly values = computed<readonly ComboboxItemValue[]>(() => {
        const value = this.value();
        if (this.multiple()) {
            return (value as readonly ComboboxItemValue[] | null) ?? NONE;
        }
        return value === null || value === undefined ? NONE : [value];
    });
    private readonly text = controllable<string, ChangeDetails>(
        this.boundInputValue,
        this.inputValueChange,
        () =>
            this.defaultInputValue() ??
            (this.multiple()
                ? ""
                : this.label(this.boundValue() ?? this.fallbackValue())),
        (value, details) =>
            this.inputValueChangeDetails.emit({ value, details }),
    );
    /** The text in the input. */
    readonly inputValue = this.text.value;
    /** The enclosing field's binding, for the input (spec/field.md). */
    readonly field = fieldControl({
        id: this.inputElementId,
        labelable: true,
        value: this.value,
        filled: computed(() => this.values().length > 0),
        input: () => this.hidden,
    });
    /** Its own `disabled`, or the field's. */
    readonly isDisabled = computed(
        () => this.disabled() || this.field.disabled(),
    );
    /** The highlighted item's id. */
    readonly highlighted = signal<string | null>(null);
    private readonly registered = new Map<HTMLElement, ComboboxItemInfo>();
    /** Follows the registered items, so `data-empty` and the pending highlight follow. */
    readonly itemCount = signal(0);
    readonly list = signal<HTMLElement | null>(null);
    readonly button = signal<HTMLElement | null>(null);
    readonly inputGroup = signal<HTMLElement | null>(null);
    readonly chips = signal<HTMLElement | null>(null);
    readonly clearButton = signal<HTMLElement | null>(null);
    readonly listId = `${createId("poc-combobox")}-list`;
    /** What to highlight once the list renders, after the keyboard or a press opened it. */
    readonly pendingHighlight = signal<PendingHighlight>(null);
    readonly placed = placementSignal({ side: "bottom", align: "start" });
    /** The input's text changed by typing since the list opened. */
    private readonly typed = signal(false);
    private readonly flush = injectFlush();

    readonly state = computed<ComboboxState>(() => ({
        open: this.overlay.open(),
        disabled: this.isDisabled(),
        value: this.value(),
        inputValue: this.inputValue(),
    }));

    private readonly resolvedFilter = computed(() => {
        const filter = this.filter();
        return filter === undefined
            ? containsFilter<ComboboxItemValue>(this.locale())
            : filter;
    });
    /** Whether the Root has `items` (it filters them). */
    readonly hasItems = computed(() => this.items() !== undefined);
    /** The matching entries: items, or groups with their matching items. */
    readonly entries = computed<readonly ComboboxItemValue[]>(() => {
        const items = this.items();
        if (items === undefined) {
            return NONE;
        }
        const query = this.inputValue().trim();
        const values = this.values();
        // a single combobox that opened on its selected item's label shows every item
        const whole =
            !this.multiple() &&
            !this.typed() &&
            values.length > 0 &&
            queryIsLabel(this.label(values[0]), query, this.locale());
        return filterItems(items, whole ? "" : query, {
            filter: this.resolvedFilter(),
            limit: this.limit(),
            itemToString: (item) => this.label(item),
        });
    });
    /** Whether the list holds no item: no matching entry, or no rendered Item without `items`. */
    readonly empty = computed(() =>
        this.hasItems() ? this.entries().length === 0 : this.itemCount() === 0,
    );

    constructor() {
        const hidden = this.hidden;
        effect(() => {
            const multiple = this.multiple();
            const values = this.values();
            setInputAttribute(
                hidden,
                "name",
                multiple ? null : (this.fieldName() ?? null),
            );
            hidden.value = multiple ? "" : this.formValue(this.value());
            hidden.required = multiple
                ? this.required() && values.length === 0
                : this.required();
            hidden.disabled = this.isDisabled();
        });
        // `multiple`: one `type="hidden"` input per value, in value order, after the hidden input
        let formEntries: HTMLInputElement[] = [];
        afterRenderEffect(() => {
            const name = this.fieldName();
            const values = this.multiple() ? this.values() : NONE;
            const disabled = this.isDisabled();
            untracked(() => {
                for (const entry of formEntries) {
                    entry.remove();
                }
                formEntries = [];
                if (name === undefined || hidden.parentNode === null) {
                    return;
                }
                let after: Node = hidden;
                for (const item of values) {
                    const entry = document.createElement("input");
                    entry.type = "hidden";
                    entry.name = name;
                    entry.setAttribute("value", this.formValue(item));
                    entry.disabled = disabled;
                    entry.setAttribute("data-combobox-part", "hidden-input");
                    after.parentNode?.insertBefore(entry, after.nextSibling);
                    after = entry;
                    formEntries.push(entry);
                }
            });
        });
        let stop: (() => void) | null = null;
        afterNextRender(() => {
            stop = bridgeForm(hidden, {
                reset: () => this.reset(),
                invalid: () => this.overlay.trigger(),
            });
        });
        inject(DestroyRef).onDestroy(() => {
            stop?.();
            for (const entry of formEntries) {
                entry.remove();
            }
        });
    }

    /** The field's `name`, else its own. */
    private fieldName(): string | undefined {
        return this.field.name() ?? this.name();
    }

    /** An item's text (`itemToStringLabel`). */
    label(item: ComboboxItemValue): string {
        return itemLabel(item, this.itemToStringLabel());
    }

    /** An item's form value (`itemToStringValue`). */
    formValue(item: ComboboxItemValue): string {
        return itemFormValue(item, this.itemToStringValue());
    }

    isSelected(item: ComboboxItemValue): boolean {
        return includesItem(this.values(), item, this.isItemEqualToValue());
    }

    setInputValue(next: string, reason: ChangeReason): void {
        this.text.set(next, { reason });
    }

    /** The input's text changed by typing. */
    markTyped(): void {
        this.typed.set(true);
    }

    /**
     * Opens or closes the list, and renders it at once. Closing without a choice resets the text
     * (spec/combobox.md, "Choosing an item").
     */
    setOpen(next: boolean, reason: ChangeReason): void {
        if (!next || reason !== "input-change") {
            this.typed.set(false);
        }
        if (!next && reason !== "item-press") {
            const text = this.multiple() ? "" : this.label(this.value());
            if (untracked(this.inputValue) !== text) {
                this.text.set(text, {
                    reason: text === "" ? "input-clear" : "none",
                });
            }
        }
        this.overlay.setOpen(next, reason);
    }

    /** Chooses an item (spec/combobox.md, "Choosing an item"). */
    choose(item: ComboboxItemValue): void {
        this.highlighted.set(null);
        if (!this.multiple()) {
            this.selection.set(item, { reason: "item-press" });
            this.text.set(this.label(item), { reason: "item-press" });
            this.setOpen(false, "item-press");
            return;
        }
        this.selection.set(
            toggleItem(this.values(), item, this.isItemEqualToValue()),
            { reason: "item-press" },
        );
        if (this.inputValue().trim() !== "") {
            this.text.set("", { reason: "input-clear" });
            this.setOpen(false, "item-press");
        } else {
            this.flush();
        }
    }

    /** Clears the text and the value. */
    clear(reason: ChangeReason): void {
        this.text.set("", { reason });
        this.selection.set(this.multiple() ? [] : null, { reason });
        this.highlighted.set(null);
        this.flush();
    }

    /** Removes the value at `index` (`multiple`), and renders at once. */
    removeAt(index: number, reason: ChangeReason): void {
        this.selection.set(
            this.values().filter((_, at) => at !== index),
            { reason },
        );
        this.flush();
    }

    /** Moves the highlight, and renders it before the next key. */
    highlight(id: string | null): void {
        this.highlighted.set(id);
        this.flush();
    }

    /** The rendered items of the list, in order. */
    orderedItems(): ComboboxItemInfo[] {
        const list = this.list();
        if (list === null) {
            return [];
        }
        return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
            .map((element) => this.registered.get(element))
            .filter((item): item is ComboboxItemInfo => item !== undefined);
    }

    /** Whether every option rendered in the list has registered. */
    itemsRegistered(): boolean {
        const list = this.list();
        return (
            list === null ||
            [...list.querySelectorAll<HTMLElement>('[role="option"]')].every(
                (element) => this.registered.has(element),
            )
        );
    }

    /** The rendered chips, in value order. */
    chipElements(): HTMLElement[] {
        const chips = this.chips();
        if (chips === null) {
            return [];
        }
        return [
            ...chips.querySelectorAll<HTMLElement>(
                '[data-combobox-part="chip"]',
            ),
        ];
    }

    registerItem(element: HTMLElement, info: ComboboxItemInfo): () => void {
        this.registered.set(element, info);
        this.itemCount.set(this.registered.size);
        return () => {
            this.registered.delete(element);
            this.itemCount.set(this.registered.size);
        };
    }

    /** A press on the input opens the list, on the selected item in single mode. */
    openOnPress(): void {
        if (this.overlay.open() || this.isDisabled()) {
            return;
        }
        this.pendingHighlight.set(this.multiple() ? null : "selected");
        this.setOpen(true, "input-press");
    }

    /**
     * A press on the InputGroup or the Chips, outside their buttons, chips and input: focuses the
     * input and opens the list (spec/combobox.md, "Pointer").
     */
    pressToOpen(event: MouseEvent): void {
        const target = event.target as Element | null;
        const input = this.overlay.trigger();
        if (
            target === null ||
            target === input ||
            target.closest('button, [data-combobox-part="chip"]') !== null
        ) {
            return;
        }
        event.preventDefault();
        if (this.isDisabled()) {
            return;
        }
        input?.focus();
        this.openOnPress();
    }

    /** A form reset: the default value, and its label in the input. */
    private reset(): void {
        const fallback = this.fallbackValue();
        this.selection.set(fallback, { reason: "none" });
        this.text.set(this.multiple() ? "" : this.label(fallback), {
            reason: "none",
        });
        this.flush();
        // the browser reset the elements after the state changed: a state that did not change
        // is not written again
        const input = this.overlay.trigger();
        if (input instanceof HTMLInputElement) {
            input.value = this.inputValue();
        }
        this.hidden.value = this.multiple() ? "" : this.formValue(this.value());
    }
}
