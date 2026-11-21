<script setup lang="ts">
import { ref } from "vue";
import { formEntries } from "../../kit/form-entries.ts";
import Output from "../../kit/output.vue";
import { Checkbox } from "../../kit/ui/checkbox.ts";

const terms = ref<boolean>();
const form = ref<string>();
const onSubmit = (event: Event) => {
    event.preventDefault();
    form.value = formEntries(event.currentTarget as HTMLFormElement);
};
const onTerms = (checked: boolean) => {
    terms.value = checked;
};
</script>

<template>
    <form class="flex flex-col items-start gap-2" @submit="onSubmit">
        <label class="flex items-center gap-2 text-sm"><Checkbox.Root name="terms" required @checked-change="onTerms" />Accept terms</label>
        <label class="flex items-center gap-2 text-sm"><Checkbox.Root name="news" value="yes" default-checked />Subscribe</label>
        <label class="flex items-center gap-2 text-sm"><Checkbox.Root disabled />Locked</label>
        <div class="flex gap-2">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </div>
    </form>
    <Output :values="{ terms, form }" />
</template>
