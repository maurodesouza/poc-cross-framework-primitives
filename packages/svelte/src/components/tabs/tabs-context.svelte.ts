import type {
    ChangeDetails,
    ChangeReason,
} from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { Controllable } from "../../utils/controllable.svelte.ts";

export interface TabInfo {
    value: string;
    disabled: boolean;
}

let counter = 0;

export class TabsState {
    list = $state<HTMLElement | null>(null);
    /** Bumped when a tab registers, so the roving tab stop and the indicator follow. */
    version = $state(0);
    readonly tabs = new Map<HTMLElement, TabInfo>();
    readonly baseId: string;
    readonly #value: Controllable<string | undefined>;

    constructor(
        options: {
            read: () => string | undefined;
            write: (value: string) => void;
            initial: string | undefined;
            onValueChange: () =>
                | ((value: string, details: ChangeDetails) => void)
                | undefined;
        },
        readonly orientation: () => "horizontal" | "vertical",
        readonly activation: () => "automatic" | "manual",
        readonly loop: () => boolean,
    ) {
        this.#value = new Controllable(
            options.read,
            (value) => {
                if (value !== undefined) {
                    options.write(value);
                }
            },
            options.initial,
        );
        this.#onChange = options.onValueChange;
        counter += 1;
        this.baseId = `poc-tabs-${counter}`;
    }

    readonly #onChange: () =>
        | ((value: string, details: ChangeDetails) => void)
        | undefined;

    get value(): string | undefined {
        return this.#value.value;
    }

    select(value: string, reason: ChangeReason): void {
        if (this.#value.set(value)) {
            this.#onChange()?.(value, { reason });
        }
    }

    tabId(value: string): string {
        return `${this.baseId}-tab-${value}`;
    }

    panelId(value: string): string {
        return `${this.baseId}-panel-${value}`;
    }
}

export const TabsContext = createContext<TabsState>("Tabs");
