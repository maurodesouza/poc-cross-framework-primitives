import { h, type Ref, Teleport, type VNodeChild } from "vue";

/** Moves an overlay's content to the end of `body` (or `container`) while it is mounted. */
export function renderPortal(
    mounted: Ref<boolean>,
    container: Element | string | null | undefined,
    content: () => VNodeChild,
) {
    if (!mounted.value) {
        return null;
    }
    return h(Teleport, { to: container ?? "body" }, [content()]);
}
