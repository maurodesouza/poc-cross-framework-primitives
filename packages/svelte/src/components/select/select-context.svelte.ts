import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

/** One item of the Root's `items` (spec/select.md, "API"). */
export interface SelectItemData {
    value: string;
    label: string;
    disabled?: boolean;
}

export class SelectState extends OverlayRoot {
    highlighted = $state<string | null>(null);
    readonly listId: string;
    readonly #value: Controllable<string | null>;
    readonly #onValue: () =>
        | ((value: string | null, details: ChangeDetails) => void)
        | undefined;

    constructor(
        overlay: ConstructorParameters<typeof OverlayRoot>[0],
        value: {
            read: () => string | null | undefined;
            write: (value: string | null) => void;
            initial: string | null;
            onChange: () =>
                | ((value: string | null, details: ChangeDetails) => void)
                | undefined;
        },
        readonly options: {
            items: () => readonly SelectItemData[];
            disabled: () => boolean;
            required: () => boolean;
        },
    ) {
        super({ ...overlay, placed: { side: "bottom", align: "start" } });
        this.#value = new Controllable(value.read, value.write, value.initial);
        this.#onValue = value.onChange;
        this.listId = `${this.popupId}-list`;
    }

    get value(): string | null {
        return this.#value.value;
    }

    get items(): readonly SelectItemData[] {
        return this.options.items();
    }

    get disabled(): boolean {
        return this.options.disabled();
    }

    get required(): boolean {
        return this.options.required();
    }

    setValue(next: string | null, reason: ChangeReason): void {
        if (this.#value.set(next)) {
            this.#onValue()?.(next, { reason });
        }
    }

    /** The id of item `value`'s option element. */
    itemId(entry: string): string {
        return `${this.listId}-item-${this.items.findIndex((item) => item.value === entry)}`;
    }

    /** Opens the list with this item highlighted. */
    openOn(entry: string | null, reason: ChangeReason): void {
        this.highlighted = entry;
        this.setOpen(true, reason);
    }

    /** Chooses an enabled item and closes. */
    choose(entry: string, reason: ChangeReason): void {
        const item = this.items.find((candidate) => candidate.value === entry);
        if (item === undefined || item.disabled) {
            return;
        }
        this.setValue(entry, reason);
        this.setOpen(false, reason);
    }
}

export const SelectContext = createContext<SelectState>("Select");

/** An item's state, for its indicator. */
export interface SelectItemState {
    readonly selected: boolean;
    readonly highlighted: boolean;
    readonly disabled: boolean;
}

export const SelectItemContext = createContext<SelectItemState>("Select.Item");

/** The item to highlight when the list opens: the selected one, else the first enabled one. */
export function initialHighlight(
    items: readonly SelectItemData[],
    value: string | null,
): string | null {
    if (value !== null && items.some((item) => item.value === value)) {
        return value;
    }
    return items.find((item) => !item.disabled)?.value ?? null;
}
