<script lang="ts">
    export let loading = false;
    import * as Card from "$lib/components/ui/card";
    import { onMount } from "svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { type ChartConfiguration } from "chart.js";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-date-fns";

    export let data: ChartConfiguration;

    function getRandomHeight() {
        return Math.trunc((0.2 + Math.random() * 0.8) * 100);
    }

    onMount(() => {
        draw();
    });

    $: loading, draw();

    let canvas: HTMLCanvasElement;

    function draw() {
        if (loading) return;
        new Chart(canvas, data);
    }
</script>

<Card.Root class="h-96 relative">
    {#if loading}
        <div class="flex flex-row gap-2 h-full p-2">
            {#each Array(20) as _}
                <div class="h-full w-full flex flex-col-reverse">
                    <div
                        style:height={getRandomHeight() + "%"}
                        class="w-full float-end"
                    >
                        <Skeleton class="w-full h-full float-end" />
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <canvas bind:this={canvas} class="w-full h-full"/>
    {/if}
    <div class="absolute top-0 left-0">
        <div
            class="backdrop-blur-md px-5 py-2 ring-1 dark:ring-gray-100 ring-black ring-opacity-10 dark:ring-opacity-5 rounded-full m-5 z-20"
        >
            test
        </div>
    </div>
</Card.Root>
