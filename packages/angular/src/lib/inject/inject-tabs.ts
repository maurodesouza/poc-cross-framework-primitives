import { computed, type Signal } from "@angular/core";
import {
    TabsRoot,
    type TabsRootState,
} from "../directives/tabs/tabs-root.directive.ts";
import { injectEnclosing } from "./enclosing.ts";

/** The part hook of the enclosing `[tabsRoot]`: its state with the selected value, and `select`. */
export function injectTabs(): {
    state: Signal<TabsRootState & { value: string | undefined }>;
    select: (value: string) => void;
} {
    const root = injectEnclosing(TabsRoot, "tabsRoot", "injectTabs");
    return {
        state: computed(() => ({ ...root.state(), value: root.selected() })),
        select: (value) => root.select(value, "none"),
    };
}
