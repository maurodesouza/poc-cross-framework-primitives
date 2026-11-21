import { stepIndex } from "./list-navigation.ts";

export interface TabsKeyOptions {
    orientation: "horizontal" | "vertical";
    rtl: boolean;
    loop: boolean;
}

/**
 * The tab a key moves focus to (spec/tabs.md, "Keyboard"): arrows along the orientation (mirrored
 * in RTL), Home and End; `null` when the key does not move it. Disabled tabs are reachable.
 */
export function tabsKeyTarget(
    key: string,
    index: number,
    count: number,
    options: TabsKeyOptions,
): number | null {
    const next =
        options.orientation === "vertical"
            ? "ArrowDown"
            : options.rtl
              ? "ArrowLeft"
              : "ArrowRight";
    const previous =
        options.orientation === "vertical"
            ? "ArrowUp"
            : options.rtl
              ? "ArrowRight"
              : "ArrowLeft";
    if (key === next || key === previous) {
        return stepIndex(count, index, key === next ? 1 : -1, {
            loop: options.loop,
        });
    }
    if (key === "Home") {
        return count > 0 ? 0 : null;
    }
    if (key === "End") {
        return count > 0 ? count - 1 : null;
    }
    return null;
}

/**
 * The item a key moves focus to in a menu (spec/menu.md, "Keyboard"): ArrowDown and ArrowUp (wrapping
 * with `loop`), Home and End; `null` when the key does not move it. Disabled items are reachable.
 */
export function menuKeyTarget(
    key: string,
    index: number,
    count: number,
    options: { loop: boolean },
): number | null {
    if (key === "ArrowDown" || key === "ArrowUp") {
        return stepIndex(count, index, key === "ArrowDown" ? 1 : -1, {
            loop: options.loop,
        });
    }
    if (key === "Home") {
        return count > 0 ? 0 : null;
    }
    if (key === "End") {
        return count > 0 ? count - 1 : null;
    }
    return null;
}

/** The keys that open and close a submenu: the arrows toward and away from it. */
export function submenuKeys(rtl: boolean): { open: string; close: string } {
    return rtl
        ? { open: "ArrowLeft", close: "ArrowRight" }
        : { open: "ArrowRight", close: "ArrowLeft" };
}
