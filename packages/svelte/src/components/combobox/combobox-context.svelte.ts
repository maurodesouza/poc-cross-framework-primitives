import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

export interface ComboboxItemInfo {
    value: string;
    label: string;
    disabled: boolean;
    id: string;
}

type Bound<T> = {
    read: () => T | undefined;
    write: (value: T) => void;
    initial: T;
    onChange: () => ((value: T, details: ChangeDetails) => void) | undefined;
};

export class ComboboxState extends OverlayRoot {
    highlighted = $state<string | null>(null);
    list = $state<HTMLElement | null>(null);
    /** The Trigger button (the overlay root's `trigger` is the input, the list's anchor). */
    button = $state<HTMLElement | null>(null);
    itemCount = $state(0);
    readonly items = new Map<HTMLElement, ComboboxItemInfo>();
    readonly pendingHighlight: { current: "first" | "last" | null } = {
        current: null,
    };
    readonly listId: string;
    readonly #value: Controllable<string | null>;
    readonly #inputValue: Controllable<string>;
    readonly #onValue: Bound<string | null>["onChange"];
    readonly #onInput: Bound<string>["onChange"];

    constructor(
        overlay: ConstructorParameters<typeof OverlayRoot>[0],
        value: Bound<string | null>,
        inputValue: Bound<string>,
        readonly disabled: () => boolean,
    ) {
        super({ ...overlay, placed: { side: "bottom", align: "start" } });
        this.#value = new Controllable(value.read, value.write, value.initial);
        this.#inputValue = new Controllable(
            inputValue.read,
            inputValue.write,
            inputValue.initial,
        );
        this.#onValue = value.onChange;
        this.#onInput = inputValue.onChange;
        this.listId = `${this.popupId}-list`;
    }

    get value(): string | null {
        return this.#value.value;
    }

    get inputValue(): string {
        return this.#inputValue.value;
    }

    setValue(next: string | null, reason: ChangeReason): void {
        if (this.#value.set(next)) {
            this.#onValue()?.(next, { reason });
        }
    }

    setInputValue(next: string, reason: ChangeReason): void {
        if (this.#inputValue.set(next)) {
            this.#onInput()?.(next, { reason });
        }
    }

    /** The rendered items of the list, in order. */
    orderedItems(): ComboboxItemInfo[] {
        this.itemCount;
        const list = this.list;
        if (list === null) {
            return [];
        }
        return [...list.querySelectorAll<HTMLElement>('[role="option"]')]
            .map((element) => this.items.get(element))
            .filter((item): item is ComboboxItemInfo => item !== undefined);
    }

    choose(next: string): void {
        const item = [...this.items.values()].find(
            (candidate) => candidate.value === next,
        );
        if (item === undefined || item.disabled) {
            return;
        }
        this.setValue(next, "item-press");
        this.setInputValue(item.label, "item-press");
        this.highlighted = null;
        this.setOpen(false, "item-press");
    }

    clear(): void {
        this.setInputValue("", "escape-key");
        this.setValue(null, "escape-key");
    }
}

export const ComboboxContext = createContext<ComboboxState>("Combobox");
