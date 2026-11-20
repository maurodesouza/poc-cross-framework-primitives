import { ComboboxEmpty } from "./combobox-empty.ts";
import { ComboboxInput } from "./combobox-input.ts";
import { ComboboxItem } from "./combobox-item.ts";
import { ComboboxList } from "./combobox-list.ts";
import { ComboboxPopup } from "./combobox-popup.ts";
import { ComboboxPortal } from "./combobox-portal.ts";
import { ComboboxPositioner } from "./combobox-positioner.ts";
import { ComboboxRoot } from "./combobox-root.ts";
import { ComboboxTrigger } from "./combobox-trigger.ts";

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
