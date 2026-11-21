import {
    SelectItem,
    SelectItemIndicator,
    SelectList,
    SelectPopup,
    SelectPortal,
    SelectPositioner,
    SelectRoot,
    SelectTrigger,
    SelectValue,
} from "@poc/angular";

/** Every Select directive, for a scenario's `imports`. */
export const SELECT_PARTS = [
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectPortal,
    SelectPositioner,
    SelectPopup,
    SelectList,
    SelectItem,
    SelectItemIndicator,
] as const;
