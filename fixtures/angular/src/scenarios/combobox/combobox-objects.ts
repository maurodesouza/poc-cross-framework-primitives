import { Component, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { COUNTRIES, type Country, matchCountry } from "./combobox-items.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";

let count = 0;

/** Object values, compared, named and serialized by the consumer (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-objects]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <ng-container comboboxRoot [items]="countries" [itemToStringLabel]="name" [itemToStringValue]="code" [isItemEqualToValue]="sameCode" [filter]="filter" [(value)]="value" [(inputValue)]="input">
            <div class="flex flex-col gap-1">
                <label [attr.for]="id" class="text-sm font-medium">Country</label>
                <div comboboxInputGroup [class]="styles['input-group']">
                    <input comboboxInput [id]="id" [class]="styles.input" />
                </div>
            </div>
            <ng-container *comboboxPortal>
                <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div comboboxPopup [class]="styles.popup">
                        <div comboboxEmpty [class]="styles.empty">No country found.</div>
                        <div comboboxList #list="comboboxList" [class]="styles.list">
                            @for (country of list.entries(); track country.code) {
                                <div comboboxItem [value]="country" [class]="styles.item">{{ country.name }}<span *comboboxItemIndicator [class]="styles['item-indicator']">✓</span></div>
                            }
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ value: value()?.code, input: input() }"></pre>
    `,
})
export class ComboboxObjects {
    protected readonly styles = combobox;
    protected readonly id = `combobox-objects-${++count}`;
    protected readonly countries = COUNTRIES;
    protected readonly value = signal<Country | null>({
        code: "BR",
        name: "Brazil",
    });
    protected readonly input = signal("Brazil");
    protected readonly name = (country: Country) => country.name;
    protected readonly code = (country: Country) => country.code;
    protected readonly sameCode = (item: Country, selected: Country) =>
        item.code === selected.code;
    protected readonly filter = (item: Country, query: string) =>
        matchCountry(item, query);
}
