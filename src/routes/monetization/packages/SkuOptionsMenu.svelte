<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { Button } from "$lib/components/ui/button";
    import {
        GitCompare,
        UnfoldHorizontal,
        Eye,
        EyeOff,
        Play,
        Pause,
        Settings2,
        Trash,
        Type,
    } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    export let loading: boolean,
        name: string,
        description: string,
        upgradeable: boolean | null = null,
        visible: boolean,
        disabled: boolean,
        renaming: boolean;

    let deleting = false;

    const dispatch = createEventDispatcher();

    function toggleDisabled() {
        dispatch("disabled", !disabled);
    }

    function remove() {
        dispatch("delete");
        deleting = false;
    }

    function rename() {
        dispatch("rename", {
            name,
            description,
        });
        renaming = false;
    }

    function toggleVisible() {
        dispatch("visible", !visible);
    }

    function toggleUpgradeable() {
        dispatch("upgradeable", !upgradeable);
    }
</script>

<AlertDialog.Root bind:open={deleting}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
                <slot name="delete" />
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action on:click={() => remove()}
                >Continue</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
<Dialog.Root bind:open={renaming}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>{name}</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div>
                <Label for="name">Name</Label>
                <Input id="name" bind:value={name} />
            </div>
            <div>
                <Label for="description">Description</Label>
                <Input id="description" bind:value={description} />
            </div>
        </div>
        <Dialog.Footer>
            <Button on:click={() => rename()} type="submit">Save changes</Button
            >
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <slot name="trigger">
            <Button
                disabled={loading}
                class="flex flex-row gap-1 items-center"
                variant="secondary"
                size="sm"
            >
                <Settings2 class="w-4 h-4" />
            </Button>
        </slot>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>
                {name}
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            {#if upgradeable != null}
                <DropdownMenu.Item
                    on:click={() => toggleUpgradeable()}
                    class="flex flex-row items-center gap-2"
                >
                    {#if upgradeable}
                        <GitCompare class="w-4 h-4" />
                        Set Non-Upgradeable
                    {:else}
                        <UnfoldHorizontal class="w-4 h-4" />
                        Set Upgradeable
                    {/if}
                </DropdownMenu.Item>
            {/if}
            <DropdownMenu.Item
                on:click={() => toggleVisible()}
                class="flex flex-row items-center gap-2"
            >
                {#if visible}
                    <EyeOff class="w-4 h-4" />
                    Set Invisible
                {:else}
                    <Eye class="w-4 h-4" />
                    Set Visible
                {/if}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                on:click={() => toggleDisabled()}
                class="flex flex-row items-center gap-2"
            >
                {#if disabled}
                    <Play class="w-4 h-4" />
                    Set Enabled
                {:else}
                    <Pause class="w-4 h-4" />
                    Set Disabled
                {/if}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                on:click={() => (renaming = true)}
                class="flex flex-row items-center gap-2"
            >
                <Type class="w-4 h-4" />
                Title/Description
            </DropdownMenu.Item>
            <slot />
            <DropdownMenu.Separator />
            <DropdownMenu.Item
                on:click={() => (deleting = true)}
                class="text-destructive flex flex-row items-center gap-2"
            >
                <Trash class="w-4 h-4" /> Delete
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
