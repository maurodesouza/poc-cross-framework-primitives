import { checkbox, checkboxGroup } from "@poc/styles";
import {
    Checkbox as Primitive,
    CheckboxGroup as PrimitiveGroup,
} from "@poc/vue";
import { defineComponent, h, mergeProps } from "vue";
import { styled } from "../styled.ts";

/** The styled checkbox, with its indicator: a check, or a dash while mixed. */
const Root = defineComponent({
    name: "StyledCheckbox",
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
        return () =>
            h(Primitive.Root, mergeProps({ class: checkbox.root }, attrs), {
                default:
                    slots.default ??
                    (() =>
                        h(
                            Primitive.Indicator,
                            { class: checkbox.indicator },
                            {
                                default: ({
                                    state,
                                }: {
                                    state: { indeterminate: boolean };
                                }) => (state.indeterminate ? "–" : "✓"),
                            },
                        )),
            });
    },
});

export const Checkbox = { Root };

export const CheckboxGroup = styled(PrimitiveGroup, checkboxGroup.root);
