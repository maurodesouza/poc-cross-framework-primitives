import {
    afterNextRender,
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
} from "@angular/core";
import { bridgeForm, createId } from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    OpenChangeEvent,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import {
    createHiddenInput,
    setInputAttribute,
} from "../../utils/hidden-input.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";

/** One item of the Root's `items` (spec/select.md, "API"). */
export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectState {
    open: boolean;
    disabled: boolean;
    value: string | null;
}

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

/**
 * Holds the select's state and renders its hidden form input (spec/select.md):
 * `<ng-container selectRoot [items]="items" [(value)]="value" name="fruit">`. The Root takes
 * `items`: the Value's label, the typeahead on the closed trigger and the hidden input need the
 * labels while the list is not rendered.
 */
@Directive({ selector: "[selectRoot]", exportAs: "selectRoot" })
export class SelectRoot {
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();
    readonly value = input<string | null | undefined>(undefined);
    readonly valueChange = output<string | null>();
    readonly defaultValue = input<string | null>(null);
    readonly valueChangeDetails = output<ValueChangeEvent<string | null>>();
    /** Every item: the Root needs their labels while the list is closed. */
    readonly items = input.required<readonly SelectItemData[]>();
    readonly name = input<string | undefined>(undefined);
    readonly required = input(false, { transform: booleanAttribute });
    readonly disabled = input(false, { transform: booleanAttribute });

    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-select",
    );
    private readonly selection = controllable<string | null, ChangeDetails>(
        this.value,
        this.valueChange,
        () => this.defaultValue(),
        (value, details) => this.valueChangeDetails.emit({ value, details }),
    );
    readonly selected = this.selection.value;
    readonly highlighted = signal<string | null>(null);
    readonly listId = `${createId("poc-select")}-list`;
    readonly placed = placementSignal({ side: "bottom", align: "start" });
    readonly state = computed<SelectState>(() => ({
        open: this.overlay.open(),
        disabled: this.disabled(),
        value: this.selected(),
    }));

    constructor() {
        const hidden = createHiddenInput(inject(ElementRef).nativeElement, {
            "data-select-part": "input",
        });
        effect(() => {
            hidden.value = this.selected() ?? "";
            setInputAttribute(hidden, "name", this.name() ?? null);
            hidden.required = this.required();
            hidden.disabled = this.disabled();
        });
        let stop: (() => void) | null = null;
        afterNextRender(() => {
            stop = bridgeForm(hidden, {
                reset: () => {
                    const fallback = this.defaultValue();
                    this.selection.set(fallback, { reason: "none" });
                    // a value that did not change does not re-run the effect
                    hidden.value = fallback ?? "";
                },
                invalid: () => this.overlay.trigger(),
            });
        });
        inject(DestroyRef).onDestroy(() => stop?.());
    }

    /** The id of item `value`'s option element. */
    itemId(value: string): string {
        const index = this.items().findIndex((item) => item.value === value);
        return `${this.listId}-item-${index}`;
    }

    /** Opens the list with this item highlighted. */
    openOn(value: string | null, reason: ChangeReason): void {
        this.highlighted.set(value);
        this.overlay.setOpen(true, reason);
    }

    /** Chooses an enabled item and closes. */
    choose(value: string, reason: ChangeReason): void {
        const item = this.items().find(
            (candidate) => candidate.value === value,
        );
        if (item === undefined || item.disabled) {
            return;
        }
        this.selection.set(value, { reason });
        this.overlay.setOpen(false, reason);
    }
}
