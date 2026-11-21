import { createContext } from "../../utils/context.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

export class PopoverState extends OverlayRoot {
    arrow = $state<HTMLElement | null>(null);
    titleId = $state<string | undefined>(undefined);
    descriptionId = $state<string | undefined>(undefined);
}

export const PopoverContext = createContext<PopoverState>("Popover");
