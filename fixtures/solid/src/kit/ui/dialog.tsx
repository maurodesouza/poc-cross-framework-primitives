import { Dialog as Primitive } from "@poc/solid";
import { dialog } from "@poc/styles";
import type { ComponentProps } from "solid-js";

// The styled layer: each part gets its recipe (a per-framework Fragiola UI in miniature).
export const Dialog = {
    Root: Primitive.Root,
    Portal: Primitive.Portal,
    Trigger: (props: ComponentProps<typeof Primitive.Trigger>) => (
        <Primitive.Trigger class={dialog.trigger} {...props} />
    ),
    Backdrop: (props: ComponentProps<typeof Primitive.Backdrop>) => (
        <Primitive.Backdrop class={dialog.backdrop} {...props} />
    ),
    Popup: (props: ComponentProps<typeof Primitive.Popup>) => (
        <Primitive.Popup class={dialog.popup} {...props} />
    ),
    Title: (props: ComponentProps<typeof Primitive.Title>) => (
        <Primitive.Title class={dialog.title} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description class={dialog.description} {...props} />
    ),
    Close: (props: ComponentProps<typeof Primitive.Close>) => (
        <Primitive.Close class={dialog.close} {...props} />
    ),
};
