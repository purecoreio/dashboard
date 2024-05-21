<script lang="ts">
    import { onMount } from "svelte";
    import TestChart from "./TestChart.svelte";
    import { dummyData } from "./data";
    let loading = false;
    const data = dummyData()
</script>

<TestChart {loading} {data} />
