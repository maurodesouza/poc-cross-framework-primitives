import { defineComponent } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogKey } from "./dialog-context.ts";

export const DialogTrigger = defineComponent({
    name: "DialogTrigger",
    inheritAttrs: false,
    props: { ...asProp, disabled: { type: Boolean, default: false } },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(DialogKey, "Dialog.Trigger");
        const setTrigger = elementSetter(context.trigger);
        return () => {
            const open = context.open.value;
            return renderPart(
                "button",
                { attrs, slots },
                props.as,
                { open, disabled: props.disabled },
                {
                    type: "button",
                    id: context.triggerId,
                    disabled: props.disabled,
                    "aria-haspopup": "dialog",
                    "aria-expanded": open ? "true" : "false",
                    "aria-controls": open ? context.popupId : undefined,
                    "data-dialog-part": "trigger",
                    ...stateAttributes({ open, disabled: props.disabled }),
                    onClick: () => context.setOpen(!open, "trigger-press"),
                    ref: setTrigger,
                },
            );
        };
    },
});
