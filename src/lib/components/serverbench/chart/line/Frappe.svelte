<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import Srvbench from "$lib/sb/Srvbench";
    // @ts-ignore
    import { Bar } from "svelte-chartjs";
    import "chart.js/auto";
    import { onMount } from "svelte";

    function findValue(data: Record<string, any>[], prop: string) {
        return data.map((d) => d[prop]);
    }

    function asDataset(data: Record<string, any>[], prop: string) {
        return {
            label: prop,
            data: findValue(data, prop),
        };
    }

    let data: any;
    onMount(async () => {
        const activity = await Srvbench.getInstance()
            .getCommunity()!
            .getActivity();
        data = {
            labels: activity.map((a) => {
                const d = new Date(a.created);
                return d.toLocaleDateString() + " " + d.toLocaleTimeString();
            }),
            datasets: [
                asDataset(activity, "unclassified"),
                asDataset(activity, "inactive"),
                asDataset(activity, "irregular"),
                asDataset(activity, "regular"),
                asDataset(activity, "active"),
                asDataset(activity, "veryActive"),
            ],
        };
    });
</script>

<Card.Root class="p-2">
    <Bar
        {data}
        height={125}
        options={{
            scales: {
                y: {
                    stacked: true,
                },
                x: {
                    stacked: true,
                },
            },
        }}
    />
</Card.Root>
