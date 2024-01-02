<script lang="ts">
    import NewMembers from "$lib/sb/stat/NewMembers";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { onMount } from "svelte";
    export let height: number = 200,
        earliestNewMembers: NewMembers,
        latestNewMembers: NewMembers;

    function asDataset(members: NewMembers) {
        return {
            backgroundColor: ["#000", "#f04c24", "#707070"],
            data: [
                members.nonReturning,
                members.unclassified,
                members.returning,
            ],
        };
    }

    let canvas: HTMLCanvasElement;

    onMount(() => {
        new Chart(
            {
                canvas,
            },
            {
                type: "pie",
                data: {
                    datasets: [
                        asDataset(earliestNewMembers),
                        asDataset(latestNewMembers),
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "New Players",
                            align: "start",
                        },
                        legend: {
                            display: false,
                        },
                    },
                },
            },
        );
    });
</script>

<div style:height={height + "px"} class="aspect-square">
    <canvas bind:this={canvas} />
</div>
