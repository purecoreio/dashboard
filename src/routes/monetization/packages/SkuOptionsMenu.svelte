<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
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
    } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    export let loading: boolean,
        name: string,
        upgradeable: boolean | null = null,
        visible: boolean,
        disabled: boolean;

    const dispatch = createEventDispatcher();

    function toggleDisabled() {
        dispatch("disabled", !disabled);
    }

    function remove() {
        dispatch("delete");
    }

    function toggleVisible() {
        dispatch("visible", !visible);
    }

    function toggleUpgradeable() {
        dispatch("upgradeable", !upgradeable);
    }
</script>

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
            <slot />
            <DropdownMenu.Separator />
            <DropdownMenu.Item
                on:click={() => remove()}
                class="text-destructive flex flex-row items-center gap-2"
            >
                <Trash class="w-4 h-4" /> Delete
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
