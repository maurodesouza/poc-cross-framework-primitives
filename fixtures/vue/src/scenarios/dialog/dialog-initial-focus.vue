<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "../../kit/ui/dialog.ts";

const cancel = ref(null);
</script>

<template>
    <Dialog.Root>
        <Dialog.Trigger>Delete file</Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup :initial-focus="() => cancel">
                <Dialog.Title>Delete file?</Dialog.Title>
                <div class="flex justify-end gap-2">
                    <button type="button">Delete</button>
                    <Dialog.Close ref="cancel">Cancel</Dialog.Close>
                </div>
            </Dialog.Popup>
        </Dialog.Portal>
    </Dialog.Root>
</template>
