import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { PRODUCE, type Produce } from "./combobox-items.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { printValues } from "./fruits.ts";

let count = 0;

/** Grouped items, filtered across the groups (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-groups]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot [items]="produce" [(value)]="value">
            <div class="flex flex-col gap-1">
                <label [attr.for]="id" class="text-sm font-medium">Produce</label>
                <div comboboxInputGroup [class]="styles['input-group']">
                    <input comboboxInput [id]="id" [class]="styles.input" />
                </div>
            </div>
            <ng-container *comboboxPortal>
                <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div comboboxPopup [class]="styles.popup">
                        <div comboboxEmpty [class]="styles.empty">Nothing found.</div>
                        <div comboboxList #list="comboboxList" [class]="styles.list">
                            @for (group of list.entries(); track group.label; let index = $index) {
                                @if (index > 0) {
                                    <div comboboxSeparator [class]="styles.separator"></div>
                                }
                                <div comboboxGroup [class]="styles.group">
                                    <div comboboxGroupLabel [class]="styles['group-label']">{{ group.label }}</div>
                                    @for (item of group.items; track item.value) {
                                        <div comboboxItem [value]="item" [class]="styles.item">{{ item.label }}</div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ value: print(value()) }"></pre>
    `,
})
export class ComboboxGroups {
    protected readonly styles = combobox;
    protected readonly id = `combobox-groups-${++count}`;
    protected readonly produce = PRODUCE;
    protected readonly print = printValues;
    protected readonly value = signal<Produce | null>(null);
}
