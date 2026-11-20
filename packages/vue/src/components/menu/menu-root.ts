import { type Align, createTypeahead, type Side } from "@poc/dom";
import { defineComponent, inject, provide, ref, watch } from "vue";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import { type MenuContext, MenuKey } from "./menu-context.ts";

const menuProps = {
    ...overlayRootProps,
    /** Arrow keys wrap at the ends (default `true`). */
    loop: { type: Boolean, default: true },
};

function useMenuRoot(
    props: { open?: boolean; defaultOpen?: boolean; loop: boolean },
    emit: Parameters<typeof useOverlayRoot>[1],
    nested: boolean,
) {
    const parent = nested ? inject(MenuKey, null) : null;
    const root = useOverlayRoot(props, emit);
    const context: MenuContext = {
        ...root,
        parent,
        loop: () => props.loop,
        pendingHighlight: { current: null },
        typeahead: createTypeahead(),
        labels: new Map(),
        placed: ref<{ side: Side; align: Align }>(
            nested
                ? { side: "end", align: "start" }
                : { side: "bottom", align: "start" },
        ),
        closeAll(reason) {
            root.setOpen(false, reason);
            parent?.closeAll(reason);
        },
        openSubmenu: { current: null },
        safeArea: { current: null },
    };
    // a parent level knows its open submenu, so a hovered sibling can close it
    if (parent) {
        watch(
            root.open,
            (open) => {
                if (open) {
                    parent.openSubmenu.current = context;
                } else if (parent.openSubmenu.current === context) {
                    parent.openSubmenu.current = null;
                }
            },
            { immediate: true },
        );
    }
    provide(MenuKey, context);
    return context;
}

/** Holds the state of one menu level (`v-model:open`); renders no element (spec/menu.md). */
export const MenuRoot = defineComponent({
    name: "MenuRoot",
    props: menuProps,
    emits: overlayRootEmits,
    setup(props, { emit, slots }) {
        useMenuRoot(props, emit, false);
        return () => slots.default?.();
    },
});

/** A nested menu level; its trigger is a `SubmenuTrigger` item of the parent menu. */
export const MenuSubmenuRoot = defineComponent({
    name: "MenuSubmenuRoot",
    props: menuProps,
    emits: overlayRootEmits,
    setup(props, { emit, slots }) {
        useMenuRoot(props, emit, true);
        return () => slots.default?.();
    },
});
