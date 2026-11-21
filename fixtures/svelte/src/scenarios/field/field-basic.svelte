<script lang="ts">
import { field } from "@poc/styles";
import { Field } from "@poc/svelte";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.svelte";

let form = $state<string>();
const onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
    form = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<form class="flex flex-col items-start gap-4" {onsubmit}><Field.Root name="email" class={field.root}><Field.Label class={field.label}>Email</Field.Label><Field.Control type="email" required class={field.control} /><Field.Description class={field.description}>We never share it.</Field.Description><Field.Error match="valueMissing" class={field.error}>Enter your email.</Field.Error><Field.Error match="typeMismatch" class={field.error}>Enter a valid email.</Field.Error></Field.Root><Field.Root name="nickname" disabled class={field.root}><Field.Label class={field.label}>Nickname</Field.Label><Field.Control class={field.control} /><Field.Description class={field.description}>Shown on your profile.</Field.Description></Field.Root><button type="submit">Submit</button></form><Output values={{ form }} />
