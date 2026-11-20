import { defineComponent, shallowRef, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { panelId, TabsKey, tabId } from "./tabs-context.ts";

export const TabsTab = defineComponent({
    name: "TabsTab",
    inheritAttrs: false,
    props: {
        ...asProp,
        value: { type: String, required: true },
        /** Stays focusable, is never selected (spec/tabs.md). */
        disabled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(TabsKey, "Tabs.Tab");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        watch(
            () => [element.value, props.value, props.disabled] as const,
            ([node, value, disabled], _, onCleanup) => {
                if (node === null) {
                    return;
                }
                context.tabs.set(node, { value, disabled });
                context.version.value += 1;
                onCleanup(() => context.tabs.delete(node));
            },
            { immediate: true },
        );
        return () => {
            context.version.value;
            const selected = context.value.value === props.value;
            const firstTab = context.list.value?.querySelector('[role="tab"]');
            const holdsTabStop =
                context.value.value === undefined
                    ? element.value !== null && firstTab === element.value
                    : selected;
            const orientation = context.orientation();
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { selected, disabled: props.disabled, orientation },
                {
                    type: "button",
                    role: "tab",
                    id: tabId(context.baseId, props.value),
                    "aria-selected": selected ? "true" : "false",
                    "aria-controls": panelId(context.baseId, props.value),
                    "aria-disabled": props.disabled ? "true" : undefined,
                    tabindex: holdsTabStop ? 0 : -1,
                    "data-tabs-part": "tab",
                    ...stateAttributes({
                        selected,
                        disabled: props.disabled,
                        orientation,
                    }),
                    onClick: () => {
                        if (!props.disabled) {
                            context.select(props.value, "trigger-press");
                        }
                    },
                    ref: setElement,
                },
            );
        };
    },
});
