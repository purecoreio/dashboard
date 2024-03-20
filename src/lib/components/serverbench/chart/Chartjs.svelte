<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    // @ts-ignore
    import "chart.js/auto";
    import { onMount } from "svelte";
    import type Stat from "$lib/sb/stat/Stat";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import * as Tabs from "$lib/components/ui/tabs";
    import { Percent, BarChart } from "lucide-svelte";
    import "chartjs-adapter-moment";
    import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

    export let stat: Stat | null,
        log: boolean = false,
        tiny: boolean = false;

    $: stat, updateChart();

    function updateChart() {
        if (stat) {
            new Chart(container, {
                data: stat.getSeries("chartjs"),
                options: stat.getSettings("chartjs", log),
                type: stat.getType("chartjs"),
            });
        }
    }

    let container: HTMLCanvasElement;
    onMount(async () => {
        Chart.register(MatrixController, MatrixElement);
        Chart.defaults.font.family = "Sora";
        updateChart();
    });
</script>

<Card.Root class="px-2 pb-4 flex flex-col gap-2">
    {#if stat}
        <div class="flex flex-row justify-between items-center px-2 mt-2">
            <span class="font-bold capitalize">
                {stat.name}
            </span>
            <Tabs.Root value="standard">
                <Tabs.List>
                    <Tabs.Trigger value="standard">
                        <BarChart class="w-4 h-4" />
                    </Tabs.Trigger>
                    <Tabs.Trigger value="percent">
                        <Percent class="w-4 h-4" />
                    </Tabs.Trigger>
                </Tabs.List>
            </Tabs.Root>
        </div>
    {/if}
    <canvas class="grow" class:max-h-44={tiny} bind:this={container} />
</Card.Root>
