import {
    afterNextRender,
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
    output,
    signal,
    untracked,
} from "@angular/core";
import { bridgeForm, createId } from "@poc/dom";
import type {
    ChangeDetails,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { fieldControl, writeFieldAria } from "../../utils/field-control.ts";
import {
    createHiddenInput,
    setInputAttribute,
} from "../../utils/hidden-input.ts";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { CheckboxGroup } from "../checkbox-group/checkbox-group.directive.ts";

export interface CheckboxState {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    required: boolean;
}

/** `data-checked` / `data-unchecked` / `data-indeterminate`: exactly one (spec/checkbox.md). */
export function checkedAttributes(state: CheckboxState) {
    return dataValues({
        checked: state.checked && !state.indeterminate,
        unchecked: !state.checked && !state.indeterminate,
        indeterminate: state.indeterminate,
        disabled: state.disabled,
    });
}

/**
 * A `checkbox` with its hidden form input, rendered right after it (spec/checkbox.md):
 * `<button checkboxRoot [(checked)]="terms" name="terms">`.
 */
@Directive({
    selector: "[checkboxRoot]",
    exportAs: "checkboxRoot",
    host: {
        type: "button",
        role: "checkbox",
        "data-checkbox-part": "root",
        "[attr.disabled]": "data().disabled",
        "[attr.aria-checked]": "ariaChecked()",
        "[attr.aria-required]": "state().required ? 'true' : null",
        "[attr.aria-controls]": "controls()",
        "[attr.data-invalid]": "field.data().invalid",
        "[attr.data-valid]": "field.data().valid",
        "[attr.data-dirty]": "field.data().dirty",
        "[attr.data-touched]": "field.data().touched",
        "[attr.data-filled]": "field.data().filled",
        "[attr.data-focused]": "field.data().focused",
        "[attr.data-checked]": "data().checked",
        "[attr.data-unchecked]": "data().unchecked",
        "[attr.data-indeterminate]": "data().indeterminate",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-required]": "state().required ? '' : null",
        "(click)": "toggle()",
        "(focus)": "field.focused()",
        "(blur)": "field.blurred()",
        // APG: Space toggles, Enter does not (a button would click on Enter)
        "(keydown.enter)": "$event.preventDefault()",
    },
})
export class CheckboxRoot {
    readonly checked = input<boolean | undefined>(undefined);
    readonly checkedChange = output<boolean>();
    readonly defaultChecked = input(false, { transform: booleanAttribute });
    readonly checkedChangeDetails = output<ValueChangeEvent<boolean>>();
    readonly indeterminate = input(false, { transform: booleanAttribute });
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly required = input(false, { transform: booleanAttribute });
    readonly name = input<string | undefined>(undefined);
    /** Submitted while checked (`"on"`); inside a CheckboxGroup, its value in the group's array. */
    readonly value = input<string | undefined>(undefined);
    /** The CheckboxGroup's parent checkbox. */
    readonly parent = input(false, { transform: booleanAttribute });

    private readonly group = inject(CheckboxGroup, { optional: true });
    private readonly host = injectHost<HTMLButtonElement>();
    private readonly hidden = createHiddenInput(this.host, {
        type: "checkbox",
        "data-checkbox-part": "input",
    });
    /** The button's id, once it has one (the consumer's, or one made after the first render). */
    private readonly hostId = signal<string | undefined>(undefined);
    private readonly own = controllable<boolean, ChangeDetails>(
        this.checked,
        this.checkedChange,
        () => this.defaultChecked(),
        (value, details) => this.checkedChangeDetails.emit({ value, details }),
    );
    private readonly inGroup = computed(
        () =>
            this.group !== null &&
            (this.parent() || this.value() !== undefined),
    );
    protected readonly field = fieldControl({
        id: this.hostId,
        labelable: true,
        value: computed(() => this.state().checked),
        filled: computed(() => this.state().checked),
        input: () => this.hidden,
    });
    readonly state = computed<CheckboxState>(() => {
        const group = this.group;
        let checked = this.own.value();
        let indeterminate = this.indeterminate();
        if (group !== null && this.inGroup()) {
            const all = group.allValues();
            const values = group.checked();
            const count = all.filter((entry) => values.includes(entry)).length;
            if (this.parent()) {
                checked = all.length > 0 && count === all.length;
                indeterminate = count > 0 && !checked;
            } else {
                checked = values.includes(this.value() as string);
            }
        }
        return {
            checked,
            indeterminate,
            disabled:
                this.disabled() ||
                (group?.disabled() ?? false) ||
                this.field.disabled(),
            required: this.required(),
        };
    });
    protected readonly data = computed(() => checkedAttributes(this.state()));
    protected readonly ariaChecked = computed(() => {
        const state = this.state();
        return state.indeterminate ? "mixed" : String(state.checked);
    });
    protected readonly controls = computed(() => {
        const group = this.group;
        if (group === null || !this.inGroup() || !this.parent()) {
            return null;
        }
        const ids = group.ids();
        return (
            group
                .allValues()
                .map((entry) => ids[entry])
                .filter((entry) => entry !== undefined)
                .join(" ") || null
        );
    });
    /** What the hidden input submits: never the parent's. */
    private readonly inputChecked = computed(
        () => this.state().checked && !(this.parent() && this.inGroup()),
    );

    constructor() {
        const host = this.host;
        const hidden = this.hidden;
        writeFieldAria(this.field, host, {
            "aria-labelledby": this.field.labelledBy,
            "aria-describedby": this.field.describedBy,
            "aria-invalid": this.field.ariaInvalid,
        });
        effect(() => {
            const parent = this.parent();
            setInputAttribute(
                hidden,
                "name",
                parent ? null : (this.field.name() ?? this.name() ?? null),
            );
            hidden.value = this.value() ?? "on";
            hidden.checked = this.inputChecked();
            hidden.required = this.required();
            hidden.disabled = this.state().disabled;
        });

        // the parent's aria-controls lists the children's ids (the consumer's own, or one made here)
        const generated = createId("poc-checkbox");
        let registered: string | null = null;
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            if (host.id === "") {
                host.id = generated;
            }
            this.hostId.set(host.id);
        });
        effect(() => {
            const group = this.group;
            const value = this.value();
            const parent = this.parent();
            untracked(() => {
                if (registered !== null) {
                    group?.registerId(registered, null);
                    registered = null;
                }
                if (group !== null && !parent && value !== undefined) {
                    group.registerId(value, host.id || generated);
                    registered = value;
                }
            });
        });
        destroyRef.onDestroy(() => {
            if (registered !== null) {
                this.group?.registerId(registered, null);
            }
        });

        let stop: (() => void) | null = null;
        afterNextRender(() => {
            stop = bridgeForm(hidden, {
                reset: () => {
                    if (this.inGroup()) {
                        this.group?.reset();
                    } else {
                        this.own.set(this.defaultChecked(), { reason: "none" });
                    }
                    // the browser reset the input after the state: write the state back
                    hidden.checked = untracked(this.inputChecked);
                },
                invalid: () => host,
            });
        });
        destroyRef.onDestroy(() => stop?.());
    }

    protected toggle(): void {
        const state = this.state();
        if (state.disabled) {
            return;
        }
        const next = state.indeterminate ? true : !state.checked;
        const group = this.group;
        if (group === null || !this.inGroup()) {
            this.own.set(next, { reason: "none" });
        } else if (this.parent()) {
            group.setAll(next);
        } else {
            group.toggle(this.value() as string, next);
        }
    }
}
