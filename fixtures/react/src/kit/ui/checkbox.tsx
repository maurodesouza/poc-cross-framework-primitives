import {
    Checkbox as Primitive,
    CheckboxGroup as PrimitiveGroup,
} from "@poc/react";
import { checkbox, checkboxGroup } from "@poc/styles";
import type { ComponentProps } from "react";

export const Checkbox = {
    /** The styled checkbox, with its indicator: a check, or a dash while mixed. */
    Root: ({ children, ...props }: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root className={checkbox.root} {...props}>
            {children ?? (
                <Primitive.Indicator
                    className={checkbox.indicator}
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
    <PrimitiveGroup className={checkboxGroup.root} {...props} />
);
