<script setup lang="ts">
import { Dialog } from "../../kit/ui/dialog.ts";
import { Popover } from "../../kit/ui/popover.ts";
</script>

<template>
    <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description>Change your display name.</Dialog.Description>
                <Popover.Root>
                    <Popover.Trigger>More info</Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Positioner :side-offset="4">
                            <Popover.Popup>
                                <Popover.Title>About names</Popover.Title>
                                <Popover.Close>Got it</Popover.Close>
                            </Popover.Popup>
                        </Popover.Positioner>
                    </Popover.Portal>
                </Popover.Root>
                <Dialog.Close>Close</Dialog.Close>
            </Dialog.Popup>
        </Dialog.Portal>
    </Dialog.Root>
</template>
