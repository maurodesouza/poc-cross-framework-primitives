import { type ReactNode, useMemo, useState } from "react";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import { DialogContext } from "./dialog-context.ts";

export interface DialogRootProps extends OverlayRootProps {
    children?: ReactNode;
}

/** Holds the dialog's state; renders no element (spec/dialog.md). */
export function DialogRoot({ children, ...props }: DialogRootProps) {
    const root = useOverlayRoot(props);
    const [backdrop, setBackdrop] = useState<HTMLElement | null>(null);
    const [titleId, setTitleId] = useState<string>();
    const [descriptionId, setDescriptionId] = useState<string>();
    const value = useMemo(
        () => ({
            ...root,
            backdrop,
            setBackdrop,
            titleId,
            setTitleId,
            descriptionId,
            setDescriptionId,
        }),
        [root, backdrop, titleId, descriptionId],
    );
    return (
        <DialogContext.Provider value={value}>
            {children}
        </DialogContext.Provider>
    );
}
