<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Popover } from "../../kit/ui/popover.ts";

const open = ref(false);
const reason = ref<string>();
const onOpenChange = (_: boolean, details: ChangeDetails) => {
    reason.value = details.reason;
};
</script>

<template>
    <Popover.Root v-model:open="open" @open-change="onOpenChange">
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Portal>
            <Popover.Positioner :side-offset="4">
                <Popover.Popup>
                    <Popover.Title>Notifications</Popover.Title>
                    <Popover.Description>You have 3 unread messages.</Popover.Description>
                    <button type="button">Mark all as read</button>
                    <Popover.Close>Close</Popover.Close>
                </Popover.Popup>
            </Popover.Positioner>
        </Popover.Portal>
    </Popover.Root>
    <button type="button" class="ms-2">After trigger</button>
    <Output :values="{ open, reason }" />
</template>
