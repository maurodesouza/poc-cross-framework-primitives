import { Field as Primitive } from "@poc/solid";
import { field } from "@poc/styles";
import type { ComponentProps } from "solid-js";

export const Field = {
    Root: (props: ComponentProps<typeof Primitive.Root>) => (
        <Primitive.Root class={field.root} {...props} />
    ),
    Label: (props: ComponentProps<typeof Primitive.Label>) => (
        <Primitive.Label class={field.label} {...props} />
    ),
    Control: (props: ComponentProps<typeof Primitive.Control>) => (
        <Primitive.Control class={field.control} {...props} />
    ),
    Description: (props: ComponentProps<typeof Primitive.Description>) => (
        <Primitive.Description class={field.description} {...props} />
    ),
    Error: (props: ComponentProps<typeof Primitive.Error>) => (
        <Primitive.Error class={field.error} {...props} />
    ),
};
