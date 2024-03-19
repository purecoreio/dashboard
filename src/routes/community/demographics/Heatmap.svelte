<script lang="ts">
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
    import { onMount } from "svelte";
    Chart.register(MatrixController, MatrixElement);
    import * as Card from "$lib/components/ui/card/index.js";

    export let holidays: {
        percentage: number;
        start: Date;
        end: Date;
    }[];

    function generateHeatmap() {
        let heatmap: Record<string, number> = {};

        holidays.forEach((holiday: any) => {
            const startDate = new Date(holiday.start);
            const endDate = new Date(holiday.end);

            // Iterate over each day within the holiday's start and end dates
            for (
                let date = new Date(startDate);
                date <= endDate;
                date.setDate(date.getDate() + 1)
            ) {
                const dateString = date.toISOString().slice(0, 10); // Extract YYYY-MM-DD format

                // Accumulate percentage for each date
                heatmap[dateString] =
                    (heatmap[dateString] || 0) + holiday.percentage;
            }
        });

        return heatmap;
    }

    function transformDataIntoDataset() {
        const heatmap = generateHeatmap();
        const dataset: any[] = [];
        Object.keys(heatmap).forEach((date) => {
            const parts = date.split("-");
            dataset.push({
                x: new Date(date),
                y: heatmap[date],
            });
        });
        return dataset;
    }

    let container: HTMLCanvasElement;

    onMount(() => {
        new Chart(container, {
            type: "bar",
            data: {
                datasets: [
                    {
                        label: "% Playerbase In Holidays",
                        data: transformDataIntoDataset(),
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
                animation: {
                    duration: 500,
                    easing: "easeInOutQuart",
                },
            },
        });
    });
</script>

<Card.Root class="p-3">
    <canvas bind:this={container} />
</Card.Root>
