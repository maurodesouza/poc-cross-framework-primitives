import type { Signal } from "@angular/core";
import {
    ComboboxRoot,
    type ComboboxState,
} from "../directives/combobox/combobox-root.directive.ts";
import { injectEnclosing } from "./enclosing.ts";

/** The part hook of the enclosing `[comboboxRoot]`: its state, and `choose` / `clear`. */
export function injectCombobox(): {
    state: Signal<ComboboxState>;
    choose: (value: string) => void;
    clear: () => void;
} {
    const root = injectEnclosing(
        ComboboxRoot,
        "comboboxRoot",
        "injectCombobox",
    );
    return {
        state: root.state,
        choose: (value) => root.choose(value),
        clear: () => root.clear(),
    };
}
