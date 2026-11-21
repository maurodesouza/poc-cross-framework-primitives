<script setup lang="ts">
import type { ChangeDetails } from "@poc/vue";
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { Tooltip } from "../../kit/ui/tooltip.ts";

const open = ref(false);
const reason = ref<string>();
const onOpenChange = (_: boolean, details: ChangeDetails) => {
    reason.value = details.reason;
};
</script>

<template>
    <div class="flex gap-2">
        <button type="button">Before</button>
        <Tooltip.Root v-model:open="open" :delay="500" @open-change="onOpenChange">
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Positioner :side-offset="6">
                    <Tooltip.Popup><Tooltip.Arrow />Save the document</Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    </div>
    <Output :values="{ open, reason }" />
</template>
