import { isInSafeArea } from "@poc/dom";
import { onBeforeUnmount, ref, type ShallowRef, watch } from "vue";
import type { MenuContext } from "./menu-context.ts";

/**
 * What every item of a menu level shares: highlight follows focus, the pointer highlights, the
 * typeahead label, and the safe area that protects an open submenu while the pointer travels to it.
 */
export function useMenuItem(
    context: MenuContext,
    element: ShallowRef<HTMLElement | null>,
    label: () => string | undefined,
    isSubmenuTrigger: boolean,
) {
    const highlighted = ref(false);
    watch(
        () => [element.value, label()] as const,
        ([node, text], _, onCleanup) => {
            if (node === null || text === undefined) {
                return;
            }
            context.labels.set(node, text);
            onCleanup(() => context.labels.delete(node));
        },
        { immediate: true },
    );
    onBeforeUnmount(() => {
        if (element.value) {
            context.labels.delete(element.value);
        }
    });

    const onPointermove = (event: PointerEvent) => {
        const node = element.value;
        if (node === null) {
            return;
        }
        const submenu = context.openSubmenu.current;
        const area = context.safeArea.current;
        if (!isSubmenuTrigger || submenu?.trigger.value !== node) {
            if (
                submenu &&
                area &&
                isInSafeArea(
                    { x: event.clientX, y: event.clientY },
                    area,
                    area.submenu,
                )
            ) {
                return;
            }
            if (submenu && submenu.trigger.value !== node) {
                submenu.setOpen(false, "none");
            }
        }
        if (node.ownerDocument.activeElement !== node) {
            node.focus({ preventScroll: true });
        }
    };
    const onPointerleave = () => {
        const node = element.value;
        const popup = context.popup.value;
        if (
            node &&
            popup &&
            node.ownerDocument.activeElement === node &&
            !isSubmenuTrigger
        ) {
            popup.focus({ preventScroll: true });
        }
    };
    return {
        highlighted,
        handlers: {
            onFocus: () => (highlighted.value = true),
            onBlur: () => (highlighted.value = false),
            onPointermove,
            onPointerleave,
        },
    };
}
