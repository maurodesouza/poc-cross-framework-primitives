// Adapted from Base UI (packages/react/src/combobox/chip/ComboboxChip.tsx, combobox/utils/parts.ts), MIT.

/** What a key on a focused chip does (spec/combobox.md, "Keyboard"). */
export interface ChipKeyAction {
    /** Where focus goes: a chip's index (after a removal: in the chips that are left), or the input. */
    focus: number | "input";
    /** Remove the focused chip's value. */
    remove?: true;
    /** Open the list. */
    open?: true;
}

/** The arrow that goes back (toward the first chip) and forward, for the direction. */
export function chipArrows(rtl: boolean): { previous: string; next: string } {
    return rtl
        ? { previous: "ArrowRight", next: "ArrowLeft" }
        : { previous: "ArrowLeft", next: "ArrowRight" };
}

/**
 * The action of `key` on the chip at `index` of `count` chips, or `null` for a key it leaves
 * alone. A printable character moves focus to the input, which receives it.
 */
export function chipKeyTarget(
    key: string,
    index: number,
    count: number,
    rtl: boolean,
): ChipKeyAction | null {
    const arrows = chipArrows(rtl);
    if (key === arrows.previous) {
        return { focus: index > 0 ? index - 1 : "input" };
    }
    if (key === arrows.next) {
        return { focus: index < count - 1 ? index + 1 : "input" };
    }
    if (key === "Backspace" || key === "Delete") {
        const next = index >= count - 1 ? count - 2 : index;
        return { focus: next >= 0 ? next : "input", remove: true };
    }
    if (key === "Enter" || key === " ") {
        return { focus: "input" };
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
        return { focus: "input", open: true };
    }
    if (key.length === 1) {
        return { focus: "input" };
    }
    return null;
}
