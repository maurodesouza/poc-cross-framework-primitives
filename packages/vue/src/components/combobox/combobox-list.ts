import { defineComponent, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxKey, orderedItems } from "./combobox-context.ts";

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
export const ComboboxList = defineComponent({
    name: "ComboboxList",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(ComboboxKey, "Combobox.List");
        const setList = elementSetter(context.list);
        watch(
            () => [context.list.value, context.itemCount.value] as const,
            ([list]) => {
                const pending = context.pendingHighlight.current;
                if (list === null || pending === null) {
                    return;
                }
                context.pendingHighlight.current = null;
                const items = orderedItems(context);
                const selected = items.find(
                    (item) => item.value === context.value.value,
                );
                const target =
                    selected ?? (pending === "first" ? items[0] : items.at(-1));
                context.highlighted.value = target?.value ?? null;
            },
            { flush: "post", immediate: true },
        );
        return () => {
            const empty = context.itemCount.value === 0;
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { empty },
                {
                    role: "listbox",
                    id: context.listId,
                    "data-combobox-part": "list",
                    ...stateAttributes({ empty }),
                    ref: setList,
                },
            );
        };
    },
});
