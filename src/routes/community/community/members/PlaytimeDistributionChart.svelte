<script lang="ts">
    import type Playtime from "$lib/sb/stat/Playtime";
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    export let height: number = 200,
        playtimes: Playtime[];

    let canvas: HTMLCanvasElement;

    function asDataset(playtime: Playtime) {
        let points: any[] = [];
        for (const minutes in playtime.playtime) {
            if (
                Object.prototype.hasOwnProperty.call(playtime.playtime, minutes)
            ) {
                const amount = playtime.playtime[minutes];
                points.push({
                    x: minutes,
                    y: amount,
                });
            }
        }
        return points;
    }

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
                            data: asDataset(playtimes[playtimes.length - 1]),
                            borderColor: "#f04c24",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Playtime",
                            align: "start",
                        },
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                        },
                    },
                },
            },
        );
    });
</script>

<div style:height={height + "px"}>
    <canvas bind:this={canvas} />
</div>
