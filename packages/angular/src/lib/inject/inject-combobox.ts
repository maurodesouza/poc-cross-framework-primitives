import type { Signal } from "@angular/core";
import {
    type ComboboxItemValue,
    ComboboxRoot,
    type ComboboxState,
} from "../directives/combobox/combobox-root.directive.ts";
import { injectEnclosing } from "./enclosing.ts";

/** The part hook of the enclosing `[comboboxRoot]`: its state, and `choose` / `clear`. */
export function injectCombobox(): {
    state: Signal<ComboboxState>;
    choose: (item: ComboboxItemValue) => void;
    clear: () => void;
} {
    const root = injectEnclosing(
        ComboboxRoot,
        "comboboxRoot",
        "injectCombobox",
    );
    return {
        state: root.state,
        choose: (item) => root.choose(item),
        clear: () => root.clear("none"),
    };
}
