import { Component, computed, signal, ViewEncapsulation } from "@angular/core";
import { combobox } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { CITIES } from "./combobox-items.ts";
import { COMBOBOX_PARTS } from "./combobox-parts.ts";
import { FRUITS } from "./fruits.ts";

const FRUIT_LABELS = FRUITS.map((fruit) => fruit.label);

let count = 0;

/** The default filter with a limit, and a list the consumer filters (spec/combobox.md). */
@Component({
    selector: "[scenario-combobox-filtered]",
    encapsulation: ViewEncapsulation.None,
    imports: [COMBOBOX_PARTS, Output],
    template: `
        <div class="flex flex-col gap-4">
            <ng-container comboboxRoot [items]="cities" [limit]="4" [(value)]="city">
                <div class="flex flex-col gap-1">
                    <label [attr.for]="cityId" class="text-sm font-medium">City</label>
                    <div comboboxInputGroup [class]="styles['input-group']">
                        <input comboboxInput [id]="cityId" [class]="styles.input" />
                    </div>
                </div>
                <ng-container *comboboxPortal>
                    <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                        <div comboboxPopup [class]="styles.popup">
                            <div comboboxEmpty [class]="styles.empty">No city found.</div>
                            <div comboboxList #cityList="comboboxList" [class]="styles.list">
                                @for (entry of cityList.entries(); track entry) {
                                    <div comboboxItem [value]="entry" [class]="styles.item">{{ entry }}</div>
                                }
                            </div>
                        </div>
                    </div>
                </ng-container>
            </ng-container>
            <ng-container comboboxRoot [(value)]="fruit" [(inputValue)]="query">
                <div class="flex flex-col gap-1">
                    <label [attr.for]="fruitId" class="text-sm font-medium">Fruit</label>
                    <div comboboxInputGroup [class]="styles['input-group']">
                        <input comboboxInput [id]="fruitId" [class]="styles.input" />
                    </div>
                </div>
                <ng-container *comboboxPortal>
                    <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
                        <div comboboxPopup [class]="styles.popup">
                            <div comboboxEmpty [class]="styles.empty">No fruit found.</div>
                            <div comboboxList [class]="styles.list">
                                @for (entry of filtered(); track entry) {
                                    <div comboboxItem [value]="entry" [class]="styles.item">{{ entry }}</div>
                                }
                            </div>
                        </div>
                    </div>
                </ng-container>
            </ng-container>
        </div>
        <pre fixtureOutput [values]="{ city: city(), fruit: fruit() }"></pre>
    `,
})
export class ComboboxFiltered {
    protected readonly styles = combobox;
    protected readonly cityId = `combobox-city-${++count}`;
    protected readonly fruitId = `combobox-fruit-${count}`;
    protected readonly cities = CITIES;
    protected readonly city = signal<string | null>(null);
    protected readonly fruit = signal<string | null>(null);
    protected readonly query = signal("");
    protected readonly filtered = computed(() => {
        const needle = this.query().trim().toLowerCase();
        return FRUIT_LABELS.filter((label) =>
            label.toLowerCase().startsWith(needle),
        );
    });
}
