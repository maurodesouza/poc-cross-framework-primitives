import { Field as Primitive } from "@poc/react";
import { field } from "@poc/styles";
import type { ComponentProps } from "react";

export const Field = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root className={field.root} {...props} />
    ),
    Label: (props: ComponentProps<typeof Primitive.Label>) => (
        <Primitive.Label className={field.label} {...props} />
    ),
    Control: (props: ComponentProps<typeof Primitive.Control>) => (
        <Primitive.Control className={field.control} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description className={field.description} {...props} />
    ),
    Error: (props: ComponentProps<typeof Primitive.Error>) => (
        <Primitive.Error className={field.error} {...props} />
    ),
};
