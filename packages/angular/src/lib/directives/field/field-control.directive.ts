import {
    booleanAttribute,
    computed,
    Directive,
    effect,
    input,
    output,
} from "@angular/core";
import { createId, type FieldState } from "@poc/dom";
import { injectField } from "../../inject/inject-field.ts";
import type {
    ChangeDetails,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { fieldControl } from "../../utils/field-control.ts";
import { injectHost } from "../../utils/host-element.ts";
import { ownAttribute } from "../../utils/own-attribute.ts";
import { dataValue } from "../../utils/state-attributes.ts";

const OUTSIDE_STATE: FieldState = {
    valid: null,
    dirty: false,
    touched: false,
    filled: false,
    focused: false,
    disabled: false,
};

/**
 * The field's native input (spec/field.md), on the consumer's own `<input>`, which keeps every
 * native attribute (`type`, `required`, `pattern`, ...): `<input fieldControl type="email"
 * required>`, with `[(value)]` or its own value (`defaultValue`).
 */
@Directive({
    selector: "[fieldControl]",
    exportAs: "fieldControl",
    host: {
        "[attr.id]": "resolvedId()",
        "[attr.name]": "resolvedName()",
        "[attr.disabled]": "resolvedDisabled() ? '' : null",
        "[attr.aria-labelledby]": "ownLabelledBy ?? field.labelledBy()",
        "[attr.aria-describedby]": "ownDescribedBy ?? field.describedBy()",
        "[attr.aria-invalid]": "field.ariaInvalid()",
        "data-field-part": "control",
        "[attr.data-invalid]": "field.data().invalid",
        "[attr.data-valid]": "field.data().valid",
        "[attr.data-dirty]": "field.data().dirty",
        "[attr.data-touched]": "field.data().touched",
        "[attr.data-filled]": "field.data().filled",
        "[attr.data-focused]": "field.data().focused",
        "[attr.data-disabled]": "dataDisabled()",
        "(input)": "onInput()",
        "(focus)": "field.focused()",
        "(blur)": "field.blurred()",
    },
})
export class FieldControl {
    readonly value = input<string | undefined>(undefined);
    readonly valueChange = output<string>();
    readonly defaultValue = input("");
    readonly valueChangeDetails = output<ValueChangeEvent<string>>();
    readonly id = input<string | undefined>(undefined);
    readonly name = input<string | undefined>(undefined);
    readonly disabled = input(false, { transform: booleanAttribute });

    private readonly host = injectHost<HTMLInputElement>();
    private readonly text = controllable<string, ChangeDetails>(
        this.value,
        this.valueChange,
        () => this.defaultValue(),
        (value, details) => this.valueChangeDetails.emit({ value, details }),
    );
    protected readonly current = this.text.value;
    private readonly generated = createId("poc-field-control");
    protected readonly resolvedId = computed(() => this.id() ?? this.generated);
    protected readonly ownLabelledBy = ownAttribute("aria-labelledby");
    protected readonly ownDescribedBy = ownAttribute("aria-describedby");
    protected readonly field = fieldControl({
        id: this.resolvedId,
        labelable: true,
        value: this.current,
        filled: computed(() => this.current() !== ""),
        input: () => this.host,
    });
    protected readonly resolvedName = computed(
        () => this.field.name() ?? this.name() ?? null,
    );
    protected readonly resolvedDisabled = computed(
        () => this.disabled() || this.field.disabled(),
    );
    // outside a field, only its own disabled state
    protected readonly dataDisabled = computed(() =>
        this.field.inField
            ? this.field.data().disabled
            : dataValue(this.resolvedDisabled()),
    );
    private readonly root = injectField();
    /** The field's state (outside a field: only its own disabled state). */
    readonly state = computed<FieldState>(
        () =>
            this.root?.state() ?? {
                ...OUTSIDE_STATE,
                disabled: this.resolvedDisabled(),
            },
    );

    constructor() {
        // the value on the element (a host property binding needs a known element type)
        effect(() => {
            const value = this.current();
            if (this.host.value !== value) {
                this.host.value = value;
            }
        });
    }

    protected onInput(): void {
        this.text.set(this.host.value, { reason: "none" });
    }
}
