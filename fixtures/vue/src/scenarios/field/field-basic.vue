<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Field } from "../../kit/ui/field.ts";

const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <form class="flex flex-col items-start gap-4" @submit="onSubmit">
        <Field.Root name="email">
            <Field.Label>Email</Field.Label>
            <Field.Control type="email" required />
            <Field.Description>We never share it.</Field.Description>
            <Field.Error match="valueMissing">Enter your email.</Field.Error>
            <Field.Error match="typeMismatch">Enter a valid email.</Field.Error>
        </Field.Root>
        <Field.Root name="nickname" disabled>
            <Field.Label>Nickname</Field.Label>
            <Field.Control />
            <Field.Description>Shown on your profile.</Field.Description>
        </Field.Root>
        <button type="submit">Submit</button>
    </form>
    <Output :values="{ form }" />
</template>
