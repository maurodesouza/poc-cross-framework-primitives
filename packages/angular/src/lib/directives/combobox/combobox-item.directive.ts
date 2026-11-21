import {
    afterRenderEffect,
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
    untracked,
} from "@angular/core";
import { createId } from "@poc/dom";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import {
    type ComboboxItemValue,
    ComboboxRoot,
} from "./combobox-root.directive.ts";

export interface ComboboxItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

/**
 * An `option`: `<div comboboxItem [value]="fruit">`. When chosen, the input's text becomes
 * `itemToStringLabel(value)`. A disabled item can be highlighted, never chosen.
 */
@Directive({
    selector: "[comboboxItem]",
    exportAs: "comboboxItem",
    host: {
        role: "option",
        "data-combobox-part": "item",
        "[attr.id]": "id",
        "[attr.aria-selected]": "state().selected ? 'true' : null",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.data-highlighted]": "data().highlighted",
        "[attr.data-selected]": "data().selected",
        "[attr.data-disabled]": "data().disabled",
        "(pointermove)": "onPointerMove()",
        "(pointerdown)": "$event.preventDefault()",
        "(click)": "onClick()",
    },
})
export class ComboboxItem {
    private readonly root = inject(ComboboxRoot);
    readonly value = input.required<ComboboxItemValue>();
    readonly disabled = input(false, { transform: booleanAttribute });
    protected readonly id = createId("poc-combobox-item");
    readonly state = computed<ComboboxItemState>(() => ({
        highlighted: this.root.highlighted() === this.id,
        selected: this.root.isSelected(this.value()),
        disabled: this.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const host = injectHost();
        const root = this.root;
        let unregister: (() => void) | null = null;
        effect(() => {
            const value = this.value();
            const disabled = this.disabled();
            untracked(() => {
                unregister?.();
                unregister = root.registerItem(host, {
                    value,
                    disabled,
                    id: this.id,
                });
            });
        });
        inject(DestroyRef).onDestroy(() => unregister?.());
        afterRenderEffect(() => {
            if (this.state().highlighted) {
                host.scrollIntoView?.({ block: "nearest" });
            }
        });
    }

    protected onPointerMove(): void {
        if (!this.state().highlighted) {
            this.root.highlighted.set(this.id);
        }
    }

    protected onClick(): void {
        if (!this.disabled()) {
            this.root.choose(this.value());
        }
    }
}
