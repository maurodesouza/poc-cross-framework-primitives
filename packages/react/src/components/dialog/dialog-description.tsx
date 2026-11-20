import { useId, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { DialogContext } from "./dialog-context.ts";

/** Describes the dialog (its id becomes the popup's `aria-describedby`). */
export function DialogDescription(props: PartProps<Record<string, never>>) {
    const context = useRequiredContext(DialogContext, "Dialog.Description");
    const generated = useId();
    const id = (props.id as string | undefined) ?? generated;
    const { setDescriptionId } = context;
    useLayoutEffect(() => {
        setDescriptionId(id);
        return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);
    return renderElement(
        "p",
        props,
        {},
        { id, "data-dialog-part": "description" },
    );
}
