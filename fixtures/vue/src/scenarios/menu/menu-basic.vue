<script setup lang="ts">
import Output from "../../kit/output.vue";
import { Menu } from "../../kit/ui/menu.ts";
import { useMenuOutput } from "./use-menu-output.ts";

const menu = useMenuOutput();
</script>

<template>
    <Menu.Root v-model:open="menu.open.value" @open-change="menu.onOpenChange">
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Portal>
            <Menu.Positioner :side-offset="4">
                <Menu.Popup>
                    <Menu.Item @click="menu.select('Edit')()">Edit</Menu.Item>
                    <Menu.Item @click="menu.select('Duplicate')()">Duplicate</Menu.Item>
                    <Menu.Item disabled @click="menu.select('Archive')()">Archive</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item @click="menu.select('Delete')()">Delete</Menu.Item>
                </Menu.Popup>
            </Menu.Positioner>
        </Menu.Portal>
    </Menu.Root>
    <button type="button" class="ms-2">After menu</button>
    <Output :values="{ open: menu.values.open, reason: menu.values.reason, action: menu.values.action }" />
</template>
