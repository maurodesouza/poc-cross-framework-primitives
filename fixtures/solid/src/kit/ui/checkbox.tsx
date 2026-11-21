import {
    Checkbox as Primitive,
    CheckboxGroup as PrimitiveGroup,
} from "@poc/solid";
import { checkbox, checkboxGroup } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Checkbox = {
    /** The styled checkbox, with its indicator: a check, or a dash while mixed. */
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root class={checkbox.root} {...props}>
            {props.children ?? (
                <Primitive.Indicator
                    class={checkbox.indicator}
                    render={(indicatorProps, state) => (
                        <span {...indicatorProps}>
                            {state.indeterminate ? "–" : "✓"}
                        </span>
                    )}
                />
            )}
        </Primitive.Root>
    ),
};

export const CheckboxGroup = (props: ComponentProps<typeof PrimitiveGroup>) => (
    <PrimitiveGroup class={checkboxGroup.root} {...props} />
);
