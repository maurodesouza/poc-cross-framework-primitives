import {
    Component,
    computed,
    input,
    model,
    output,
    ViewEncapsulation,
} from "@angular/core";
import {
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxPopup,
    ComboboxPortal,
    ComboboxPositioner,
    ComboboxRoot,
    ComboboxTrigger,
    type OpenChangeEvent,
} from "@poc/angular";
import { combobox } from "@poc/styles";
import { filterFruits } from "./fruits.ts";

let count = 0;

/**
 * The combobox of the combobox scenarios. The component is the field's `<div class="flex
 * flex-col gap-1">` (an attribute selector); the root and the portal's anchor are comment nodes
 * inside it, and the list moves to `body`, so the elements match React's.
 */
@Component({
    selector: "div[fruitCombobox]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        ComboboxRoot,
        ComboboxInput,
        ComboboxTrigger,
        ComboboxPortal,
        ComboboxPositioner,
        ComboboxPopup,
        ComboboxList,
        ComboboxItem,
        ComboboxEmpty,
    ],
    host: { class: "flex flex-col gap-1" },
    template: `
        <ng-container comboboxRoot [(value)]="value" [inputValue]="inputValue()" (inputValueChange)="inputValueChange.emit($event)" [(open)]="open" (openChangeDetails)="openChangeDetails.emit($event)">
            <label [attr.for]="id" class="text-sm font-medium">Fruit</label>
            <div class="flex items-center gap-1">
                <input comboboxInput [id]="id" [class]="styles.input" />
                <button comboboxTrigger aria-label="Show fruits" [class]="styles.trigger">▾</button>
            </div>
            <ng-container *comboboxPortal>
                <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div comboboxPopup [class]="styles.popup">
                        @if (filtered().length === 0) {
                            <div comboboxEmpty [class]="styles.empty">No fruit found.</div>
                        }
                        <div comboboxList [class]="styles.list">
                            @for (fruit of filtered(); track fruit.value) {
                                <div comboboxItem [value]="fruit.value" [disabled]="fruit.disabled ?? false" [class]="styles.item">{{ fruit.label }}</div>
                            }
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class FruitCombobox {
    protected readonly styles = combobox;
    protected readonly id = `fruit-${++count}`;
    readonly value = model.required<string | null>();
    // an input and its change output, not model(): a consumer may keep the old value
    readonly inputValue = input.required<string>();
    readonly inputValueChange = output<string>();
    readonly open = model.required<boolean>();
    readonly openChangeDetails = output<OpenChangeEvent>();
    protected readonly filtered = computed(() =>
        filterFruits(this.inputValue()),
    );
}
