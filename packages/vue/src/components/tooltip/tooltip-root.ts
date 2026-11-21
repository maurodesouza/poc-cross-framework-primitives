import {
    type Align,
    createDelayGroup,
    createHoverIntent,
    type Side,
    trackHoverBridge,
} from "@poc/dom";
import {
    defineComponent,
    inject,
    onBeforeUnmount,
    provide,
    ref,
    shallowRef,
    watch,
} from "vue";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";
import { TooltipKey, TooltipProviderKey } from "./tooltip-context.ts";

/** Holds the tooltip's state (`v-model:open`) and its hover intent; renders no element (spec/tooltip.md). */
export const TooltipRoot = defineComponent({
    name: "TooltipRoot",
    props: {
        ...overlayRootProps,
        /** ms before a hovered trigger opens (default: the Provider's, else 600). */
        delay: { type: Number, default: undefined },
        /** ms before it closes once the pointer left (default: the Provider's, else 0). */
        closeDelay: { type: Number, default: undefined },
        disabled: { type: Boolean, default: false },
    },
    emits: overlayRootEmits,
    setup(props, { emit, slots }) {
        const root = useOverlayRoot(props, emit);
        const provider = inject(TooltipProviderKey, null);
        // a Root outside any Provider is alone in its own group
        const group = provider?.group ?? createDelayGroup({ timeout: 0 });
        const delay = () => props.delay ?? provider?.delay() ?? 600;
        const closeDelay = () =>
            props.closeDelay ?? provider?.closeDelay() ?? 0;
        const instant = ref(false);
        let blocked = false;
        let openedByHover = false;

        const show = (reason: ChangeReason, isInstant: boolean) => {
            openedByHover = reason === "trigger-hover";
            instant.value = isInstant;
            root.setOpen(true, reason);
        };
        const hide = (reason: ChangeReason) => root.setOpen(false, reason);
        const intent = createHoverIntent({
            open: () => show("trigger-hover", false),
            close: () => hide("trigger-hover"),
        });
        onBeforeUnmount(intent.cancel);

        // one open tooltip per group: the previous one closes when this one opens
        const member = () => hide("trigger-hover");
        watch(
            () => root.open.value,
            (open, _, onCleanup) => {
                if (!open) {
                    return;
                }
                group.opened(member);
                onCleanup(() => group.closed(member));
            },
            { immediate: true },
        );

        // a hover-opened tooltip closes once the pointer leaves the trigger, the popup and the gap
        watch(
            () =>
                [
                    root.open.value,
                    root.trigger.value,
                    root.popup.value,
                ] as const,
            ([open, trigger, popup], _, onCleanup) => {
                if (!open || !openedByHover || trigger === null) {
                    return;
                }
                onCleanup(
                    trackHoverBridge(trigger, popup, {
                        inside: () => intent.cancel(),
                        outside: () => intent.leave(closeDelay()),
                    }),
                );
            },
            { immediate: true },
        );

        // Escape closes it and stops there
        watch(
            () => [root.open.value, root.trigger.value] as const,
            ([open, trigger], _, onCleanup) => {
                if (!open || trigger === null) {
                    return;
                }
                const doc = trigger.ownerDocument;
                const onKeydown = (event: KeyboardEvent) => {
                    if (event.key === "Escape") {
                        event.stopPropagation();
                        intent.cancel();
                        hide("escape-key");
                    }
                };
                doc.addEventListener("keydown", onKeydown, true);
                onCleanup(() =>
                    doc.removeEventListener("keydown", onKeydown, true),
                );
            },
            { immediate: true },
        );

        provide(TooltipKey, {
            ...root,
            show,
            hide,
            hoverStart() {
                if (props.disabled || blocked) {
                    return;
                }
                if (root.open.value) {
                    intent.cancel();
                } else if (group.isInstant()) {
                    intent.cancel();
                    show("trigger-hover", true);
                } else {
                    intent.enter(delay());
                }
            },
            hoverEnd() {
                blocked = false;
                if (!root.open.value) {
                    intent.cancel();
                }
            },
            press() {
                blocked = true;
                intent.cancel();
                if (root.open.value) {
                    hide("trigger-press");
                }
            },
            instant,
            disabled: () => props.disabled,
            arrow: shallowRef(null),
            placed: ref<{ side: Side; align: Align }>({
                side: "top",
                align: "center",
            }),
        });
        return () => slots.default?.();
    },
});
