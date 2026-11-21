/**
 * The template pieces the combobox scenarios share (React's `FruitCombobox`, `FruitPopup` and
 * `FruitChips`), spliced into each scenario's template: a component of its own would add its host
 * element to the DOM, and the Root's hidden input must follow its children as in React. A
 * scenario using them has `styles` (the `combobox` recipe) and `id` (the input's id) members.
 */

/** The fruits' popup: an Empty and the List, each Item with its label. */
export const FRUIT_POPUP = `
    <ng-container *comboboxPortal>
        <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
            <div comboboxPopup [class]="styles.popup">
                <div comboboxEmpty [class]="styles.empty">No fruit found.</div>
                <div comboboxList #list="comboboxList" [class]="styles.list">
                    @for (fruit of list.entries(); track fruit.value) {
                        <div comboboxItem [value]="fruit" [disabled]="fruit.disabled ?? false" [class]="styles.item">{{ fruit.label }}</div>
                    }
                </div>
            </div>
        </div>
    </ng-container>
`;

/** The same, each Item with its ItemIndicator. */
export const FRUIT_POPUP_WITH_INDICATOR = `
    <ng-container *comboboxPortal>
        <div comboboxPositioner [sideOffset]="4" [class]="styles.positioner">
            <div comboboxPopup [class]="styles.popup">
                <div comboboxEmpty [class]="styles.empty">No fruit found.</div>
                <div comboboxList #list="comboboxList" [class]="styles.list">
                    @for (fruit of list.entries(); track fruit.value) {
                        <div comboboxItem [value]="fruit" [disabled]="fruit.disabled ?? false" [class]="styles.item">{{ fruit.label }}<span *comboboxItemIndicator [class]="styles['item-indicator']">✓</span></div>
                    }
                </div>
            </div>
        </div>
    </ng-container>
`;

/** The InputGroup of `/combobox/basic`: the Input, a Clear and a Trigger. */
export const FRUIT_INPUT_GROUP = `
    <div comboboxInputGroup [class]="styles['input-group']">
        <input comboboxInput [id]="id" [class]="styles.input" />
        <button *comboboxClear aria-label="Clear fruit" [class]="styles.clear">×</button>
        <button comboboxTrigger aria-label="Show fruits" [class]="styles.trigger">▾</button>
    </div>
`;

/**
 * The combobox of `/combobox/basic`, inside its Root: the scenario binds the Root's state. A
 * scenario using it has the `fruits` member too.
 */
export const FRUIT_COMBOBOX = `
    <div class="flex flex-col gap-1">
        <label [attr.for]="id" class="text-sm font-medium">Fruit</label>
        ${FRUIT_INPUT_GROUP}
    </div>
    ${FRUIT_POPUP}
`;

/**
 * The Chips of a `multiple` Root (its template reference variable `root`): a Chip per value, with
 * its ChipRemove, then the Input (its id the member `id`), then the given buttons.
 */
export function fruitChips(root: string, id: string, buttons: string): string {
    return `
        <div comboboxChips [class]="styles.chips">
            @for (item of ${root}.value(); track item.value) {
                <div comboboxChip [class]="styles.chip">{{ item.label }}<button comboboxChipRemove [attr.aria-label]="'Remove ' + item.label" [class]="styles['chip-remove']">×</button></div>
            }
            <input comboboxInput [id]="${id}" [class]="styles.input" />
            ${buttons}
        </div>
    `;
}
