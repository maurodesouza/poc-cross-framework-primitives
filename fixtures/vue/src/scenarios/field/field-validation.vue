<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Field } from "../../kit/ui/field.ts";
import {
    validateCode,
    validatePassword,
    validateUsername,
} from "./validators.ts";

const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
</script>

<template>
    <div class="flex flex-col items-start gap-4">
        <Field.Root validation-mode="onChange" :validate="validateUsername">
            <Field.Label>Username</Field.Label>
            <Field.Control />
            <Field.Error />
        </Field.Root>
        <Field.Root validation-mode="onBlur" :validate="validatePassword">
            <Field.Label>Password</Field.Label>
            <Field.Control />
            <Field.Error />
        </Field.Root>
        <form class="flex flex-col items-start gap-4" @submit="onSubmit">
            <Field.Root name="code" :validate="validateCode">
                <Field.Label>Code</Field.Label>
                <Field.Control pattern="[A-Z]{3}" />
                <Field.Error match="patternMismatch">Use three capital letters.</Field.Error>
                <Field.Error match="customError" />
            </Field.Root>
            <button type="submit">Submit</button>
        </form>
    </div>
    <Output :values="{ form }" />
</template>
