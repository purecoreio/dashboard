<script lang="ts">
    import type Rank from "$lib/sb/Rank";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { onMount } from "svelte";
    export let height: number = 200,
        ranks: Rank[];

    let canvas: HTMLCanvasElement;

    onMount(() => {
        new Chart(
            {
                canvas,
            },
            {
                type: "line",
                data: {
                    datasets: [
                        {
                            stepped: true,
                            data: ranks.map((r) => {
                                return {
                                    x: r.created,
                                    y: r.rank,
                                };
                            }),
                            borderColor: "#f04c24",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: "#000",
                    plugins: {
                        title: {
                            display: true,
                            text: "Rank",
                            align: "start",
                        },
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            type: "time",
                        },
                        y: {
                            min: 0,
                            max: 100,
                        },
                    },
                },
            },
        );
    });
</script>

<div style:height={height + "px"} style="width:100%">
    <canvas bind:this={canvas} />
</div>
