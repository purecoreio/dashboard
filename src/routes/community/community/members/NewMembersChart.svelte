<script lang="ts">
    import type NewMembers from "$lib/sb/stat/NewMembers";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { onMount } from "svelte";
    export let height: number = 200,
        newMembers: NewMembers[];

    type datapoint = {
        x: Date;
        y: number;
    };

    function asDataset(newMembers: NewMembers[]) {
        let unclassified: datapoint[] = [];
        let returning: datapoint[] = [];
        let nonReturning: datapoint[] = [];
        for (const newMemberStat of newMembers) {
            unclassified.push({
                x: newMemberStat.created,
                y: newMemberStat.unclassified,
            });
            returning.push({
                x: newMemberStat.created,
                y: newMemberStat.returning,
            });
            nonReturning.push({
                x: newMemberStat.created,
                y: newMemberStat.nonReturning,
            });
        }
        return [
            {
                label: "Non-returning",
                data: nonReturning,
                backgroundColor: "#000000",
                borderColor: "#000000",
            },
            {
                label: "Brand New",
                data: unclassified,
                backgroundColor: "#f04c24",
                borderColor: "#f04c24",
            },
            {
                label: "Returning",
                data: returning,
                backgroundColor: "#707070",
                borderColor: "#707070",
            },
        ];
    }

    let canvas: HTMLCanvasElement;

    onMount(() => {
        new Chart(
            {
                canvas,
            },
            {
                type: "line",
                data: {
                    datasets: asDataset(newMembers),
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
                    scales: {
                        x: {
                            type: "time",
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
