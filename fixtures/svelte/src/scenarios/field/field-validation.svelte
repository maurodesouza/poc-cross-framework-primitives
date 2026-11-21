<script lang="ts">
import { field } from "@poc/styles";
import { Field } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";
import {
    validateCode,
    validatePassword,
    validateUsername,
} from "./validators.ts";

let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<div class="flex flex-col items-start gap-4"><Field.Root validationMode="onChange" validate={validateUsername} class={field.root}><Field.Label class={field.label}>Username</Field.Label><Field.Control class={field.control} /><Field.Error class={field.error} /></Field.Root><Field.Root validationMode="onBlur" validate={validatePassword} class={field.root}><Field.Label class={field.label}>Password</Field.Label><Field.Control class={field.control} /><Field.Error class={field.error} /></Field.Root><form class="flex flex-col items-start gap-4" {onsubmit}><Field.Root name="code" validate={validateCode} class={field.root}><Field.Label class={field.label}>Code</Field.Label><Field.Control pattern={"[A-Z]{3}"} class={field.control} /><Field.Error match="patternMismatch" class={field.error}>Use three capital letters.</Field.Error><Field.Error match="customError" class={field.error} /></Field.Root><button type="submit">Submit</button></form></div><Output values={{ form }} />
