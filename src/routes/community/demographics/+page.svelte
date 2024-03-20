<script lang="ts">
    import mapbox from "mapbox-gl";
    import * as Card from "$lib/components/ui/card/index.js";
    import "$lib/../../node_modules/mapbox-gl/dist/mapbox-gl.css";
    const { Map } = mapbox;
    import { onDestroy, onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    let map: any;
    let mapContainer: HTMLDivElement;
    import Srvbench from "$lib/sb/Srvbench";
    import Section from "$lib/components/serverbench/section.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import DateTicker from "./DateTicker.svelte";
    import { ArrowRight } from "lucide-svelte";
    import Holiday from "$lib/sb/holiday/Holiday";
    import Chartjs from "$lib/components/serverbench/chart/Chartjs.svelte";

    let data: any;
    let holidays: Holiday[] = [];
    let rendering = true;

    onMount(async () => {
        rendering = true;
        [data, holidays] = await Promise.all([
            Srvbench.getInstance().getCommunity()!.getGeojson(),
            Srvbench.getInstance().getCommunity()!.getHolidays(),
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
            rendering = false;
        });
    });

    onDestroy(() => {
        if (!map) return;
        map.remove();
    });
</script>

<Card.Root class="overflow-hidden">
    <div class="relative aspect-video">
        <div
            class:opacity-0={rendering}
            class="map w-full h-full transition-opacity duration-1000"
            bind:this={mapContainer}
        />
    </div>
</Card.Root>
{#key holidays}
    <Chartjs stat={Holiday.mergeIntoStat(holidays)} tiny />
{/key}
<Section title="holidays">
    {#each holidays as holiday}
        <Card.Root class="p-3 flex flex-row gap-3 items-center">
            <div class="w-7">
                <img
                    class="h-4"
                    alt={holiday.country}
                    src={`https://flagcdn.com/${holiday.country.toLowerCase()}.svg`}
                />
            </div>
            <span class="font-semibold w-6 text-center">
                {holiday.country}
            </span>
            <div class="w-20 text-center">
                <Badge>
                    {Math.trunc(holiday.affected.percentage * 10000) / 100}%
                </Badge>
            </div>
            {holiday.name}
            <div class="ml-auto flex flex-row gap-3 items-center">
                <DateTicker date={holiday.start} />
                <ArrowRight />
                <DateTicker date={holiday.end} />
            </div>
        </Card.Root>
    {/each}
</Section>
