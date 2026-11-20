import { ComboboxEmpty } from "./combobox-empty.tsx";
import { ComboboxInput } from "./combobox-input.tsx";
import { ComboboxItem } from "./combobox-item.tsx";
import { ComboboxList } from "./combobox-list.tsx";
import { ComboboxPopup } from "./combobox-popup.tsx";
import { ComboboxPortal } from "./combobox-portal.tsx";
import { ComboboxPositioner } from "./combobox-positioner.tsx";
import { ComboboxRoot } from "./combobox-root.tsx";
import { ComboboxTrigger } from "./combobox-trigger.tsx";

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
