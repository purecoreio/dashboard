<script lang="ts">
    import mapbox from "mapbox-gl";
    import * as Card from "$lib/components/ui/card/index.js";
    import "$lib/../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    const { Map } = mapbox;
    import { onDestroy, onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    let map: any;
    let mapContainer: HTMLDivElement;
    import { VisSingleContainer, VisDonut, VisTooltip } from "@unovis/svelte";
    import { Donut, type GenericDataRecord } from "@unovis/ts";
    import Srvbench from "$lib/sb/Srvbench";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    let data: any;
    let countries: Record<string, number> = {};

    onMount(async () => {
        [countries, data] = await Promise.all([
            Srvbench.getInstance().getCommunity()!.getCountries(),
            Srvbench.getInstance().getCommunity()!.getGeojson(),
        ]);
        map = new Map({
            container: mapContainer,
            accessToken:
                "pk.eyJ1IjoicXVpcXVlbGhhcHB5IiwiYSI6ImNqdjlrcnM4ODBweng0M21qb3RxbnB0bWYifQ.SAxbNKo03QVyYdBZg8wmmw",
            style: `mapbox://styles/mapbox/light-v11`,
            projection: {
                name: "mercator",
            },
            zoom: 0,
            attributionControl: false,
        }).addControl(
            new mapboxgl.AttributionControl({
                compact: true,
            }),
        );
        map.on("load", async () => {
            map.addSource("trees", {
                type: "geojson",
                data,
            });
            map.addLayer(
                {
                    id: "trees-heat",
                    type: "heatmap",
                    source: "trees",
                    maxzoom: 15,
                    paint: {
                        // increase weight as diameter breast height increases
                        "heatmap-weight": {
                            property: "dbh",
                            type: "exponential",
                            stops: [
                                [1, 0],
                                [62, 1],
                            ],
                        },
                        // increase intensity as zoom level increases
                        "heatmap-intensity": {
                            stops: [
                                [11, 1],
                                [15, 3],
                            ],
                        },
                        // assign color values be applied to points depending on their density
                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0,
                            "rgba(236,222,239,0)",
                            0.2,
                            "rgb(208,209,230)",
                            0.4,
                            "rgb(166,189,219)",
                            0.6,
                            "rgb(103,169,207)",
                            0.8,
                            "rgb(28,144,153)",
                        ],
                        // increase radius as zoom increases
                        "heatmap-radius": {
                            stops: [
                                [11, 15],
                                [15, 20],
                            ],
                        },
                        // decrease opacity to transition into the circle layer
                        "heatmap-opacity": {
                            default: 1,
                            stops: [
                                [14, 1],
                                [15, 0],
                            ],
                        },
                    },
                },
                "waterway-label",
            );
        });
    });

    onDestroy(() => {
        if (!map) return;
        map.remove();
    });
    const value = (d: number) => d;
    const sortFunction = (a: number, b: number) => a - b;

    let ns: number[] = [];
    for (let i = 0; i < 5; i++) {
        ns.push(i);
    }
    const triggers = {
        [Donut.selectors.segment]: (d: any) =>
            `<span>${Object.keys(countries)[d.index]}, ${d.value}</span>`,
    };
</script>

<Card.Root class="overflow-hidden">
    <div class="relative aspect-video">
        <div class="map" bind:this={mapContainer} />
    </div>
</Card.Root>
<div class="flex flex-row gap-5">
    <Card.Root
        class="p-5 flex flex-col items-center justify-center"
    >
        <div class="mx-auto">
            <VisSingleContainer
                height={180}
                width={180}
                data={Object.values(countries)}
            >
                <VisDonut {sortFunction} {value} />
                <VisTooltip {triggers} />
            </VisSingleContainer>
        </div>
    </Card.Root>
    <Card.Root class="grow">
        <div class="flex flex-col w-full h-full items-center justify-center">
            <span class="number text-5xl mb-3">
                {Object.values(countries).reduce(
                    (partialSum, a) => partialSum + Number(a),
                    0,
                )}
            </span>
            <Badge>Players</Badge>
        </div>
    </Card.Root>
    <Card.Root class="grow">
        <div class="flex flex-col w-full h-full items-center justify-center">
            <span class="number text-5xl mb-3">
                {Object.keys(countries).length}
            </span>
            <Badge>Countries</Badge>
        </div>
    </Card.Root>
</div>

<style>
    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
