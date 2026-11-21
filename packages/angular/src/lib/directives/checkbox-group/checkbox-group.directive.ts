import {
    booleanAttribute,
    computed,
    Directive,
    input,
    output,
    signal,
} from "@angular/core";
import type {
    ChangeDetails,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { dataValues } from "../../utils/state-attributes.ts";

export interface CheckboxGroupState {
    disabled: boolean;
}

const NONE: readonly string[] = [];

/**
 * Checkboxes sharing one array value, with an optional parent (spec/checkbox.md):
 * `<div checkboxGroup [(value)]="toppings" [allValues]="all">`.
 */
@Directive({
    selector: "[checkboxGroup]",
    exportAs: "checkboxGroup",
    host: {
        role: "group",
        "data-checkbox-group-part": "root",
        "[attr.data-disabled]": "data().disabled",
    },
})
export class CheckboxGroup {
    readonly value = input<readonly string[] | undefined>(undefined);
    readonly valueChange = output<string[]>();
    readonly defaultValue = input<readonly string[]>(NONE);
    readonly valueChangeDetails = output<ValueChangeEvent<string[]>>();
    /** Every child value: what the parent checkbox checks. */
    readonly allValues = input<readonly string[]>(NONE);
    readonly disabled = input(false, { transform: booleanAttribute });

    private readonly selection = controllable<readonly string[], ChangeDetails>(
        this.value,
        { emit: (next) => this.valueChange.emit([...next]) },
        () => this.defaultValue(),
        (value, details) =>
            this.valueChangeDetails.emit({ value: [...value], details }),
    );
    readonly checked = this.selection.value;
    /** The children's element ids, for the parent's `aria-controls`. */
    readonly ids = signal<Readonly<Record<string, string>>>({});
    readonly state = computed<CheckboxGroupState>(() => ({
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    private order(values: readonly string[]): string[] {
        const all = this.allValues();
        return all.length === 0
            ? [...values]
            : [
                  ...all.filter((entry) => values.includes(entry)),
                  ...values.filter((entry) => !all.includes(entry)),
              ];
    }

    /** Checks or clears one child's value. */
    toggle(entry: string, checked: boolean): void {
        const value = this.checked();
        const next = checked
            ? this.order([...value.filter((item) => item !== entry), entry])
            : value.filter((item) => item !== entry);
        this.selection.set(next, { reason: "none" });
    }

    /** The parent checkbox: checks every value of `allValues`, or none. */
    setAll(checked: boolean): void {
        this.selection.set(checked ? [...this.allValues()] : [], {
            reason: "none",
        });
    }

    /** A form reset: back to `defaultValue`. */
    reset(): void {
        this.selection.set(this.defaultValue(), { reason: "none" });
    }

    registerId(entry: string, id: string | null): void {
        this.ids.update((current) => {
            if (id === null) {
                const { [entry]: _, ...rest } = current;
                return rest;
            }
            return current[entry] === id
                ? current
                : { ...current, [entry]: id };
        });
    }
}
