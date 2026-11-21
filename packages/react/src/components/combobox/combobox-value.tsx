import type { ReactNode } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { ComboboxContext } from "./combobox-context.ts";

export interface ComboboxValueProps {
    /** A node, or a render function of the value (an item or `null`, or the list of items). */
    // biome-ignore lint/suspicious/noExplicitAny: the value is the consumer's own item type
    children?: ReactNode | ((value: any) => ReactNode);
}

/** Renders the value: its label (labels joined with ", "), or the consumer's render function. */
export function ComboboxValue({ children }: ComboboxValueProps) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Value");
    if (typeof children === "function") {
        return <>{children(context.value)}</>;
    }
    if (children !== undefined) {
        return <>{children}</>;
    }
    return <>{context.values.map(context.label).join(", ")}</>;
}
