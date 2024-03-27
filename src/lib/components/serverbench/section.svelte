<script lang="ts">
    import * as Popover from "$lib/components/ui/popover";
    import { Loader2, Plus } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { fade } from "svelte/transition";
    export let title: string,
        loading: boolean = false,
        adding = false;
    const SLOTS = $$props.$$slots;
</script>

<div class="mb-4">
    <div class="flex flex-row justify-between items-center">
        <p class="uppercase font-bold text-sm opacity-80">
            {title}
        </p>
        <div class="transition" class:opacity-0={!SLOTS.add && !loading}>
            <Popover.Root bind:open={adding}>
                <Popover.Trigger disabled={!SLOTS.add}>
                    <Button
                        size="icon"
                        variant={SLOTS.add ? "outline" : "ghost"}
                        class="transition rounded-full"
                    >
                        {#if loading || !SLOTS.add}
                            <Loader2 class="w-4 h-4 animate-spin" />
                        {:else}
                            <Plus class="w-4 h-4" />
                        {/if}
                    </Button>
                </Popover.Trigger>
                <Popover.Content>
                    <slot name="add" />
                </Popover.Content>
            </Popover.Root>
        </div>
    </div>
    <hr class="mt-1 mb-2" />
    <div>
        {#if loading}
            <div class="flex flex-col gap-3">
                {#each Array(2) as _, i}
                    <Skeleton class="h-[100px] rounded" />
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-3" transition:fade>
                <slot />
            </div>
        {/if}
    </div>
</div>
