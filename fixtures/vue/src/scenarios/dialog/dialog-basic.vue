<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Dialog } from "../../kit/ui/dialog.ts";

const open = ref(false);
const reason = ref<string>();
const onOpenChange = (_: boolean, details: ChangeDetails) => {
    reason.value = details.reason;
};
</script>

<template>
    <div class="h-[200vh]">
        <Dialog.Root v-model:open="open" @open-change="onOpenChange">
            <Dialog.Trigger>Open dialog</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>Edit profile</Dialog.Title>
                    <Dialog.Description>Change your display name.</Dialog.Description>
                    <label class="flex flex-col gap-1 text-sm">
                        Name
                        <input type="text" class="h-9 rounded-md border border-palette-line px-2" />
                    </label>
                    <div class="flex justify-end gap-2">
                        <Dialog.Close>Save</Dialog.Close>
                        <Dialog.Close>Close</Dialog.Close>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
        <button type="button" class="ms-2">Outside button</button>
        <Output :values="{ open, reason }" />
    </div>
</template>
