<script lang="ts">
    import type Stat from "$lib/sb/stat/Stat";
    import * as Card from "$lib/components/ui/card";

    export let stat: Stat | null, tiny: boolean;
</script>

<Card.Root class="px-2 pb-4 flex flex-col gap-2">
    {#if stat}
        <div class="flex flex-row justify-between items-center px-2 mt-2">
            <span class="font-bold capitalize py-2">
                {stat.name}
            </span>
            <!--
            <Tabs.Root value="standard">
                <Tabs.List>
                    <Tabs.Trigger value="standard">
                        <BarChart class="w-4 h-4" />
                    </Tabs.Trigger>
                    <Tabs.Trigger value="percent">
                        <Percent class="w-4 h-4" />
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>-->
        </div>
    {/if}
    <slot />
</Card.Root>
