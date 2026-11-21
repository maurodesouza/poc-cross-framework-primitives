import { createContext } from "../../utils/context.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

export class DialogState extends OverlayRoot {
    backdrop = $state<HTMLElement | null>(null);
    titleId = $state<string | undefined>(undefined);
    descriptionId = $state<string | undefined>(undefined);
}

export const DialogContext = createContext<DialogState>("Dialog");
