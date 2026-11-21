import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogRootProps extends OverlayRootProps {
    children?: JSX.Element;
}

/** Holds the dialog's state; renders no element (spec/dialog.md). */
export function DialogRoot(props: DialogRootProps) {
    const root = createOverlayRoot(props);
    const [backdrop, setBackdrop] = createSignal<HTMLElement | null>(null);
    const [titleId, setTitleId] = createSignal<string>();
    const [descriptionId, setDescriptionId] = createSignal<string>();
    const value = {
        ...root,
        backdrop,
        setBackdrop: (element: HTMLElement | null) => setBackdrop(element),
        titleId,
        setTitleId: (id: string | undefined) => setTitleId(id),
        descriptionId,
        setDescriptionId: (id: string | undefined) => setDescriptionId(id),
    };
    return <DialogContext value={value}>{props.children}</DialogContext>;
}
