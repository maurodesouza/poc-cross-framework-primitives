import { Dialog as Primitive } from "@poc/react";
import { dialog } from "@poc/styles";
import type { ComponentProps } from "react";

// The styled layer: each part gets its recipe (a per-framework Fragiola UI in miniature).
export const Dialog = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger className={dialog.trigger} {...props} />
    ),
    Backdrop: (props: ComponentProps<typeof Primitive.Backdrop>) => (
        <Primitive.Backdrop className={dialog.backdrop} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup className={dialog.popup} {...props} />
    ),
    Title: (props: ComponentProps<typeof Primitive.Title>) => (
        <Primitive.Title className={dialog.title} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description className={dialog.description} {...props} />
    ),
    Close: (props: ComponentProps<typeof Primitive.Close>) => (
        <Primitive.Close className={dialog.close} {...props} />
    ),
};
