<script lang="ts">
    // @ts-ignore
    import "chart.js/auto";
    import { onMount } from "svelte";
    import type Stat from "$lib/sb/stat/Stat";
    import Chart from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
    import Base from "./Base.svelte";

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

<Base {stat} {tiny}>
    <canvas class="grow" class:max-h-44={tiny} bind:this={container} />
</Base>
