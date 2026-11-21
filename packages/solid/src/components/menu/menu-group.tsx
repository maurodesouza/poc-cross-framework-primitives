import { createContext, createSignal } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";

export const MenuGroupContext = createContext<
    ((id: string | undefined) => void) | null
>(null);

/** Groups items under its GroupLabel. */
export function MenuGroup(props: PartProps<Record<string, never>>) {
    const [labelId, setLabelId] = createSignal<string>();
    const register = (id: string | undefined) => setLabelId(id);
    return (
        <MenuGroupContext value={register}>
            {renderPart(
                "div",
                props,
                () => ({}),
                () => ({
                    role: "group",
                    "aria-labelledby": labelId(),
                    "data-menu-part": "group",
                }),
            )}
        </MenuGroupContext>
    );
}
