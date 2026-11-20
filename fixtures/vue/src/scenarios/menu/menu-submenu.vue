<script setup lang="ts">
import Output from "../../kit/output.vue";
import { Menu } from "../../kit/ui/menu.ts";
import { useMenuOutput } from "./use-menu-output.ts";

const menu = useMenuOutput();
</script>

<template>
    <Menu.Root v-model:open="menu.open.value" @open-change="menu.onOpenChange">
        <Menu.Trigger>File</Menu.Trigger>
        <Menu.Portal>
            <Menu.Positioner :side-offset="4">
                <Menu.Popup>
                    <Menu.Item @click="menu.select('New file')()">New file</Menu.Item>
                    <Menu.SubmenuRoot>
                        <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
                        <Menu.Portal>
                            <Menu.Positioner>
                                <Menu.Popup>
                                    <Menu.Item @click="menu.select('Email')()">Email</Menu.Item>
                                    <Menu.Item @click="menu.select('Link')()">Link</Menu.Item>
                                    <Menu.Item @click="menu.select('Slack')()">Slack</Menu.Item>
                                </Menu.Popup>
                            </Menu.Positioner>
                        </Menu.Portal>
                    </Menu.SubmenuRoot>
                    <Menu.Item @click="menu.select('Print')()">Print</Menu.Item>
                </Menu.Popup>
            </Menu.Positioner>
        </Menu.Portal>
    </Menu.Root>
    <Output :values="{ open: menu.values.open, reason: menu.values.reason, action: menu.values.action }" />
</template>
