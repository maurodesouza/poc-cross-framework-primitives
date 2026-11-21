import type { ChangeDetails } from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";

/** A CheckboxGroup's shared value (spec/checkbox.md, "CheckboxGroup"). */
export class CheckboxGroupState {
    /** The children's element ids, for the parent's `aria-controls`. */
    readonly ids = $state<Record<string, string>>({});
    readonly #value: Controllable<readonly string[]>;
    readonly #onChange: () =>
        | ((value: string[], details: ChangeDetails) => void)
        | undefined;

    constructor(
        value: {
            read: () => readonly string[] | undefined;
            write: (value: string[]) => void;
            initial: readonly string[];
            onChange: () =>
                | ((value: string[], details: ChangeDetails) => void)
                | undefined;
        },
        readonly options: {
            allValues: () => readonly string[];
            defaultValue: () => readonly string[];
            disabled: () => boolean;
        },
    ) {
        this.#value = new Controllable(
            value.read,
            (next) => value.write([...next]),
            value.initial,
        );
        this.#onChange = value.onChange;
    }

    get value(): readonly string[] {
        return this.#value.value;
    }

    get allValues(): readonly string[] {
        return this.options.allValues();
    }

    get disabled(): boolean {
        return this.options.disabled();
    }

    #set(next: readonly string[]): void {
        if (this.#value.set(next)) {
            this.#onChange()?.([...next], { reason: "none" });
        }
    }

    #order(values: readonly string[]): string[] {
        const all = this.allValues;
        return all.length === 0
            ? [...values]
            : [
                  ...all.filter((entry) => values.includes(entry)),
                  ...values.filter((entry) => !all.includes(entry)),
              ];
    }

    /** Checks or clears one child's value. */
    toggle(entry: string, checked: boolean): void {
        const value = this.value;
        this.#set(
            checked
                ? this.#order([
                      ...value.filter((item) => item !== entry),
                      entry,
                  ])
                : value.filter((item) => item !== entry),
        );
    }

    /** The parent checkbox: checks every value of `allValues`, or none. */
    setAll(checked: boolean): void {
        this.#set(checked ? [...this.allValues] : []);
    }

    /** A form reset: back to `defaultValue`. */
    reset(): void {
        this.#set(this.options.defaultValue());
    }

    registerId(entry: string, id: string | null): void {
        if (id === null) {
            delete this.ids[entry];
        } else {
            this.ids[entry] = id;
        }
    }
}

export const CheckboxGroupContext =
    createContext<CheckboxGroupState>("CheckboxGroup");
