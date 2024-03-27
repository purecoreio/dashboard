<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import {
        Eye,
        EyeOff,
        GitCompare,
        Pause,
        Play,
        UnfoldHorizontal,
    } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    export let loading: boolean,
        disabled: boolean,
        visible: boolean,
        upgradeable: boolean | null = null;

    const dispatch = createEventDispatcher();

    function toggleDisabled() {
        dispatch("disabled", !disabled);
    }

    function toggleVisible() {
        dispatch("visible", !visible);
    }

    function toggleUpgradeable() {
        dispatch("upgradeable", !upgradeable);
    }
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button
            disabled={loading}
            builders={[builder]}
            size="sm"
            variant="ghost"
            on:click={() => toggleDisabled()}
        >
            <div class:scale-90={loading} class="transition">
                {#if disabled}
                    <Pause class="w-4 h-4" />
                {:else}
                    <Play class="w-4 h-4" />
                {/if}
            </div>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        {#if disabled}
            Disabled
        {:else}
            Enabled
        {/if}
    </Tooltip.Content>
</Tooltip.Root>
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button
            disabled={loading}
            builders={[builder]}
            size="sm"
            variant="ghost"
            on:click={() => toggleVisible()}
        >
            <div class:scale-90={loading} class="transition">
                {#if visible}
                    <Eye class="w-4 h-4" />
                {:else}
                    <EyeOff class="w-4 h-4" />
                {/if}
            </div>
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        {#if visible}
            Visible
        {:else}
            Invisible
        {/if}
    </Tooltip.Content>
</Tooltip.Root>
{#if upgradeable != null}
    <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
            <Button
                disabled={loading}
                builders={[builder]}
                size="sm"
                variant="ghost"
                on:click={() => toggleUpgradeable()}
            >
                <div class:scale-90={loading} class="transition">
                    {#if upgradeable}
                        <UnfoldHorizontal class="w-4 h-4" />
                    {:else}
                        <GitCompare class="w-4 h-4" />
                    {/if}
                </div>
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
            {#if upgradeable}
                Upgradeable
            {:else}
                Non-Upgradeable
            {/if}
        </Tooltip.Content>
    </Tooltip.Root>
{/if}
