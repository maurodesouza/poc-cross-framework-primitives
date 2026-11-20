<script setup lang="ts">
import { ref } from "vue";
import Output from "../../kit/output.vue";
import { TextRuns } from "../../kit/text-runs.ts";
import { Tabs } from "../../kit/ui/tabs.ts";

// The tabs of every tabs scenario (spec/tabs.md).
defineProps<{
    activation: "automatic" | "manual";
    orientation: "horizontal" | "vertical";
}>();
const value = ref("account");
const TABS = [
    { value: "account", label: "Account" },
    { value: "password", label: "Password" },
    { value: "billing", label: "Billing", disabled: true },
    { value: "team", label: "Team" },
];
</script>

<template>
    <Tabs.Root v-model:value="value" :activation="activation" :orientation="orientation">
        <Tabs.List>
            <Tabs.Tab v-for="tab in TABS" :key="tab.value" :value="tab.value" :disabled="tab.disabled">{{ tab.label }}</Tabs.Tab>
            <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel v-for="tab in TABS" :key="tab.value" :value="tab.value">
            <p><TextRuns :runs="[tab.label, ' settings']" /></p>
        </Tabs.Panel>
    </Tabs.Root>
    <button type="button" class="mt-2">After tabs</button>
    <Output :values="{ value }" />
</template>
