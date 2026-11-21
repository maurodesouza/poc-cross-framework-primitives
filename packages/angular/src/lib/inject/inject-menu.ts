import type { Signal } from "@angular/core";
import {
    MenuRoot,
    type MenuState,
} from "../directives/menu/menu-root.directive.ts";
import { injectEnclosing } from "./enclosing.ts";

/**
 * The part hook of the enclosing menu level (`[menuRoot]` or `[menuSubmenuRoot]`): its state, and
 * a way to close every level (as an item does).
 */
export function injectMenu(): {
    state: Signal<MenuState>;
    closeAll: () => void;
} {
    const level = injectEnclosing(MenuRoot, "menuRoot", "injectMenu");
    return {
        state: level.state,
        closeAll: () => level.closeAll("item-press"),
    };
}
