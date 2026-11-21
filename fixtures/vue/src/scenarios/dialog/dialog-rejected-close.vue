<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Dialog } from "../../kit/ui/dialog.ts";

// The consumer keeps `open` true: Escape, an outside press and Close change nothing.
const open = ref(false);
const reason = ref<string>();
const onOpenChange = (next: boolean, details: ChangeDetails) => {
    reason.value = details.reason;
    if (next) {
        open.value = true;
    }
};
</script>

<template>
    <button type="button" @click="open = true">Open dialog</button>
    <Dialog.Root :open="open" @open-change="onOpenChange">
        <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
                <Dialog.Title>Locked</Dialog.Title>
                <Dialog.Close>Close</Dialog.Close>
            </Dialog.Popup>
        </Dialog.Portal>
    </Dialog.Root>
    <Output :values="{ open, reason }" />
</template>
