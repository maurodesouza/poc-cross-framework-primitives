import { useId, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { DialogContext } from "./dialog-context.ts";

/** Names the dialog (its id becomes the popup's `aria-labelledby`). */
export function DialogTitle(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(DialogContext, "Dialog.Title");
    const generated = useId();
    const id = (props.id as string | undefined) ?? generated;
    const { setTitleId } = context;
    useLayoutEffect(() => {
        setTitleId(id);
        return () => setTitleId(undefined);
    }, [id, setTitleId]);
    return renderElement("h2", props, {}, { id, "data-dialog-part": "title" });
}
