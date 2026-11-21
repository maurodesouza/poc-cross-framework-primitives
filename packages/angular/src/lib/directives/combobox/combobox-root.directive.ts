import {
    booleanAttribute,
    computed,
    Directive,
    input,
    model,
    output,
    signal,
} from "@angular/core";
import { createId } from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    OpenChangeEvent,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";

export interface ComboboxItemInfo {
    value: string;
    /** Read when chosen: the item's `label` input, else its text. */
    label: () => string;
    disabled: boolean;
    id: string;
}

export interface ComboboxState {
    open: boolean;
    disabled: boolean;
    value: string | null;
    inputValue: string;
}

/**
 * Holds the combobox's state (spec/combobox.md): `<ng-container comboboxRoot [(value)]="value"
 * [(inputValue)]="input" [(open)]="open">`. The overlay's `trigger` is the input, the list's
 * anchor; the Trigger button is `button`.
 */
@Directive({ selector: "[comboboxRoot]", exportAs: "comboboxRoot" })
export class ComboboxRoot {
    readonly open = model<boolean | undefined>(undefined);
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();
    readonly value = model<string | null | undefined>(undefined);
    readonly defaultValue = input<string | null>(null);
    readonly valueChangeDetails = output<ValueChangeEvent<string | null>>();
    readonly inputValue = model<string | undefined>(undefined);
    readonly defaultInputValue = input("");
    readonly inputValueChangeDetails = output<ValueChangeEvent<string>>();
    readonly disabled = input(false, { transform: booleanAttribute });

    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-combobox",
    );
    private readonly selection = controllable<string | null, ChangeDetails>(
        this.value,
        () => this.defaultValue(),
        (value, details) => this.valueChangeDetails.emit({ value, details }),
    );
    private readonly text = controllable<string, ChangeDetails>(
        this.inputValue,
        () => this.defaultInputValue(),
        (value, details) =>
            this.inputValueChangeDetails.emit({ value, details }),
    );
    readonly selected = this.selection.value;
    readonly typed = this.text.value;
    readonly highlighted = signal<string | null>(null);
    readonly items = new Map<HTMLElement, ComboboxItemInfo>();
    /** Follows the registered items, so `data-empty` and the pending highlight follow. */
    readonly itemCount = signal(0);
    readonly list = signal<HTMLElement | null>(null);
    readonly button = signal<HTMLElement | null>(null);
    readonly listId = `${createId("poc-combobox")}-list`;
    /** What to highlight once the list renders, after the keyboard opened it. */
    pendingHighlight: "first" | "last" | null = null;
    readonly placed = placementSignal({ side: "bottom", align: "start" });
    readonly state = computed<ComboboxState>(() => ({
        open: this.overlay.open(),
        disabled: this.disabled(),
        value: this.selected(),
        inputValue: this.typed(),
    }));

    setInputValue(next: string, reason: ChangeReason): void {
        this.text.set(next, { reason });
    }

    choose(next: string): void {
        const item = [...this.items.values()].find(
            (candidate) => candidate.value === next,
        );
        if (item === undefined || item.disabled) {
            return;
        }
        this.selection.set(next, { reason: "item-press" });
        this.text.set(item.label(), { reason: "item-press" });
        this.highlighted.set(null);
        this.overlay.setOpen(false, "item-press");
    }

    clear(): void {
        this.text.set("", { reason: "escape-key" });
        this.selection.set(null, { reason: "escape-key" });
    }

    /** The rendered items of the list, in order. */
    orderedItems(): ComboboxItemInfo[] {
        const list = this.list();
        if (list === null) {
            return [];
        }
        return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
            .map((element) => this.items.get(element))
            .filter((item): item is ComboboxItemInfo => item !== undefined);
    }

    registerItem(element: HTMLElement, info: ComboboxItemInfo): () => void {
        this.items.set(element, info);
        this.itemCount.set(this.items.size);
        return () => {
            this.items.delete(element);
            this.itemCount.set(this.items.size);
        };
    }
}
