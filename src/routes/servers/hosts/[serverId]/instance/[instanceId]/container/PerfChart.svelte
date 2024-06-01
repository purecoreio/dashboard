<script lang="ts">
    import "chart.js/auto";
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    import "chartjs-adapter-date-fns";
    import * as Card from "$lib/components/ui/card/index.js";
    let chartEl: HTMLCanvasElement;

    let chart: Chart<any>;

    export let title:string
    export let data: {
        x: Date;
        y: number;
    }[] = [];

    $: data,
        (() => {
            if (!chart) return;
            chart.update();
        })();

    onMount(() => {
        chart = new Chart(chartEl, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    {
                        data,
                        backgroundColor: "rgba(255,255,255,0.6)",
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        type: "timeseries",
                        display: false,
                    },
                    y: {
                        max: 100,
                        display: false,
                        beginAtZero: true,
                    },
                },
            },
        });
    });
</script>

<Card.Root>
    <div class="h-20 w-full relative">
        <div class="absolute top-0 left-0 h-full">
            <div class="flex h-full flex-col items-center justify-center">
                <div
                    class="ml-5 rounded-full px-5 py-2 border-2 backdrop-blur-md bg-black bg-opacity-50 z-10"
                >
                    {title}
                </div>
            </div>
        </div>
        <canvas class="w-full h-full block" bind:this={chartEl} />
    </div>
</Card.Root>
