<script setup lang="ts">
import { Tooltip } from "../../kit/ui/tooltip.ts";

const TOOLS = [
    { label: "Bold", hint: "Bold (Ctrl+B)" },
    { label: "Italic", hint: "Italic (Ctrl+I)" },
    { label: "Underline", hint: "Underline (Ctrl+U)" },
];
</script>

<template>
    <Tooltip.Provider :delay="800" :timeout="400">
        <div class="flex gap-2">
            <Tooltip.Root v-for="tool in TOOLS" :key="tool.label">
                <Tooltip.Trigger>{{ tool.label }}</Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Positioner :side-offset="6">
                        <Tooltip.Popup>{{ tool.hint }}</Tooltip.Popup>
                    </Tooltip.Positioner>
                </Tooltip.Portal>
            </Tooltip.Root>
        </div>
        <div class="mt-30">
            <button type="button">Elsewhere</button>
        </div>
    </Tooltip.Provider>
</template>
