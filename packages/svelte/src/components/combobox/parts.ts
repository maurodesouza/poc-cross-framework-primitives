import ComboboxEmpty from "./combobox-empty.svelte";
import ComboboxInput from "./combobox-input.svelte";
import ComboboxItem from "./combobox-item.svelte";
import ComboboxList from "./combobox-list.svelte";
import ComboboxPopup from "./combobox-popup.svelte";
import ComboboxPortal from "./combobox-portal.svelte";
import ComboboxPositioner from "./combobox-positioner.svelte";
import ComboboxRoot from "./combobox-root.svelte";
import ComboboxTrigger from "./combobox-trigger.svelte";

/** spec/combobox.md */
export const Combobox = {
    Root: ComboboxRoot,
    Input: ComboboxInput,
    Trigger: ComboboxTrigger,
    Portal: ComboboxPortal,
    Positioner: ComboboxPositioner,
    Popup: ComboboxPopup,
    List: ComboboxList,
    Item: ComboboxItem,
    Empty: ComboboxEmpty,
};
