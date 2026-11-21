import SelectItem from "./select-item.svelte";
import SelectItemIndicator from "./select-item-indicator.svelte";
import SelectList from "./select-list.svelte";
import SelectPopup from "./select-popup.svelte";
import SelectPortal from "./select-portal.svelte";
import SelectPositioner from "./select-positioner.svelte";
import SelectRoot from "./select-root.svelte";
import SelectTrigger from "./select-trigger.svelte";
import SelectValue from "./select-value.svelte";

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
