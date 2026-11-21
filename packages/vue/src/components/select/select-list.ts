import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { SelectKey } from "./select-context.ts";

/** The `listbox`, named by the trigger's labels (spec/select.md). */
export const SelectList = defineComponent({
    name: "SelectList",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SelectKey, "Select.List");
        return () =>
            renderPart(
                "div",
                { attrs, slots },
                props.as,
                { open: context.open.value },
                {
                    role: "listbox",
                    id: context.listId,
                    "aria-labelledby": context.trigger.value?.id,
                    "data-select-part": "list",
                },
            );
    },
});
