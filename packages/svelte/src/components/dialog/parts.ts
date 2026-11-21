import DialogBackdrop from "./dialog-backdrop.svelte";
import DialogClose from "./dialog-close.svelte";
import DialogDescription from "./dialog-description.svelte";
import DialogPopup from "./dialog-popup.svelte";
import DialogPortal from "./dialog-portal.svelte";
import DialogRoot from "./dialog-root.svelte";
import DialogTitle from "./dialog-title.svelte";
import DialogTrigger from "./dialog-trigger.svelte";

/** spec/dialog.md */
export const Dialog = {
    Root: DialogRoot,
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Backdrop: DialogBackdrop,
    Popup: DialogPopup,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
};
