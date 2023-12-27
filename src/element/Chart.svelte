<script lang="ts">
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";
    export let height: number = 100,
        stepped = false,
        size = 20,
        title: string | null = null;
    let canvas: HTMLCanvasElement;
    function getData() {
        const data = [];
        const phase = Math.random() * 5;
        for (let i = 0; i < size; i++) {
            data.push(Math.sin(phase + i / 2.5));
        }
        return data;
    }
    function getLabels() {
        const labels = [];
        for (let i = 0; i < size; i++) {
            labels.push(i);
        }
        return labels;
    }
    onMount(() => {
        new Chart(
            {
                canvas,
            },
            {
                type: "line",
                data: {
                    labels: getLabels(),
                    datasets: [
                        {
                            stepped,
                            data: getData(),
                            borderColor: "#f04c24",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    color: "#000",
                    plugins: {
                        title: title
                            ? {
                                  display: true,
                                  text: title,
                                  align: "start"
                              }
                            : undefined,
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            display: false,
                        },
                        y: {
                            display: false,
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
