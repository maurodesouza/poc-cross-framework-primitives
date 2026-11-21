import { createEffect, createUniqueId } from "solid-js";

/**
 * The id of a part that names or describes its root (Title, Description, GroupLabel): the
 * consumer's `id`, or a generated one, registered while the part is rendered.
 */
export function createLabelId(
    props: { readonly [key: string]: unknown },
    register: ((id: string | undefined) => void) | undefined,
): () => string {
    const generated = createUniqueId();
    const id = () => (props.id as string | undefined) ?? generated;
    createEffect(id, (current) => {
        register?.(current);
        return () => register?.(undefined);
    });
    return id;
}
