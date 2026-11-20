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
    <button type="button" @click="open = true">Open dialog</button>
    <Dialog.Root v-model:open="open" @open-change="onOpenChange">
        <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
                <Dialog.Title>Controlled</Dialog.Title>
                <Dialog.Close>Close</Dialog.Close>
            </Dialog.Popup>
        </Dialog.Portal>
    </Dialog.Root>
    <Output :values="{ open, reason }" />
</template>
