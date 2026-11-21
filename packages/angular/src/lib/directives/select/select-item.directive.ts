import {
    afterRenderEffect,
    booleanAttribute,
    computed,
    Directive,
    inject,
    input,
} from "@angular/core";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { SelectRoot } from "./select-root.directive.ts";

export interface SelectItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

/**
 * An `option` (spec/select.md): `<div selectItem value="apple">`. A disabled item can be
 * highlighted, never chosen.
 */
@Directive({
    selector: "[selectItem]",
    exportAs: "selectItem",
    host: {
        role: "option",
        "data-select-part": "item",
        "[attr.id]": "root.itemId(value())",
        "[attr.aria-selected]": "state().selected ? 'true' : 'false'",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.data-highlighted]": "data().highlighted",
        "[attr.data-selected]": "data().selected",
        "[attr.data-disabled]": "data().disabled",
        "(pointermove)": "onPointerMove()",
        // the trigger keeps DOM focus
        "(pointerdown)": "$event.preventDefault()",
        "(click)": "onClick()",
    },
})
export class SelectItem {
    protected readonly root = inject(SelectRoot);
    readonly value = input.required<string>();
    /** Can be highlighted, never chosen (default: the Root item's `disabled`). */
    readonly disabled = input(undefined, {
        transform: (value: unknown) =>
            value === undefined ? undefined : booleanAttribute(value),
    });
    readonly state = computed<SelectItemState>(() => {
        const value = this.value();
        return {
            highlighted: this.root.highlighted() === value,
            selected: this.root.selected() === value,
            disabled:
                this.disabled() ??
                this.root.items().find((item) => item.value === value)
                    ?.disabled ??
                false,
        };
    });
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const host = injectHost();
        afterRenderEffect(() => {
            if (this.state().highlighted) {
                host.scrollIntoView?.({ block: "nearest" });
            }
        });
    }

    protected onPointerMove(): void {
        if (!this.state().highlighted) {
            this.root.highlighted.set(this.value());
        }
    }

    protected onClick(): void {
        if (!this.state().disabled) {
            this.root.choose(this.value(), "item-press");
        }
    }
}
