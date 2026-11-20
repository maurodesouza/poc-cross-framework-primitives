<script setup lang="ts">
import { Popover } from "../../kit/ui/popover.ts";
</script>

<template>
    <Popover.Root>
        <Popover.Trigger>With arrow</Popover.Trigger>
        <Popover.Portal>
            <Popover.Positioner :side-offset="10">
                <Popover.Popup>
                    <Popover.Arrow data-testid="arrow" />
                    <Popover.Title>Arrow</Popover.Title>
                </Popover.Popup>
            </Popover.Positioner>
        </Popover.Portal>
    </Popover.Root>
</template>
