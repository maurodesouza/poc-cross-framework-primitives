import { SelectItem } from "./select-item.tsx";
import { SelectItemIndicator } from "./select-item-indicator.tsx";
import { SelectList } from "./select-list.tsx";
import { SelectPopup } from "./select-popup.tsx";
import { SelectPortal } from "./select-portal.tsx";
import { SelectPositioner } from "./select-positioner.tsx";
import { SelectRoot } from "./select-root.tsx";
import { SelectTrigger } from "./select-trigger.tsx";
import { SelectValue } from "./select-value.tsx";

/** spec/select.md */
export const Select = {
    Root: SelectRoot,
    Trigger: SelectTrigger,
    Value: SelectValue,
    Portal: SelectPortal,
    Positioner: SelectPositioner,
    Popup: SelectPopup,
    List: SelectList,
    Item: SelectItem,
    ItemIndicator: SelectItemIndicator,
};
