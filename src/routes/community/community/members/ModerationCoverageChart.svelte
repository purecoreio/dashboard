<script lang="ts">
    import type Member from "$lib/sb/Member";
    import MemberRange from "$lib/sb/stat/MemberRange";
    import type ModerationCoverage from "$lib/sb/stat/ModerationCoverage";
    import type TimeRange from "$lib/sb/stat/TimeRange";
    import Chart from "chart.js/auto";
    import { color } from "chart.js/helpers";
    import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
    Chart.register(MatrixController, MatrixElement);
    import { onMount } from "svelte";
    export let height: number = 500,
        coverage: ModerationCoverage;

    let canvas: HTMLCanvasElement;

    function asDataset() {
        const unmoderatedLabel = "Unmoderated";
        const hourChunks = Math.trunc(
            (coverage.until.getTime() - coverage.since.getTime()) /
                (3600 * 1000),
        );
        const datasets = datasetFromMemberTimeRange(coverage.coverages, coverage.since, coverage.until, "#f84c24", hourChunks)


        datasets.datasets.push({
            label: unmoderatedLabel,
            data: getChunkUnmoderatedPercentage(
                coverage.gaps,
                coverage.since,
                coverage.until,
            ),
            backgroundColor: (context: any) => {
                const value = context.dataset.data[context.dataIndex].v;
                return color("#000")
                    .alpha(value / 2)
                    .rgbString();
            },
            width: (context: any) =>
                (context.chart.chartArea || {}).width / hourChunks,
        });

        return {
            datasets: datasets.datasets,
            labels: [
                ...datasets.labels,
                unmoderatedLabel,
            ],
        };
    }

    function datasetFromMemberTimeRange(
        ranges: MemberRange[],
        since: Date,
        until: Date,
        bgColor:string,
        hourChunks:number
    ) {
        let members: Record<
            string,
            {
                member: Member;
                data: MemberRange[];
            }
        > = {};
        for (const memberCoverage of ranges) {
            if (!(memberCoverage.member.id in members)) {
                members[memberCoverage.member.id] = {
                    member: memberCoverage.member,
                    data: [],
                };
            }
            members[memberCoverage.member.id].data.push(memberCoverage);
        }

        let datasets: any[] = [];
        for (const memberId in members) {
            if (Object.prototype.hasOwnProperty.call(members, memberId)) {
                const element = members[memberId];
                const dataset = {
                    label: element.member.name,
                    data: getChunkPercentage(
                        element.member.name,
                        element.data,
                        since,
                        until,
                    ),
                    backgroundColor: (context: any) => {
                        const value = context.dataset.data[context.dataIndex].v;
                        return color(bgColor).alpha(value).rgbString();
                    },
                    width: (context: any) =>
                        (context.chart.chartArea || {}).width / hourChunks,
                };
                datasets.push(dataset);
            }
        }
        return {
            datasets,
            labels: Object.keys(members).map((k) => members[k].member.name)
        }
    }

    function getChunkPercentage(
        y: string,
        timeRanges: MemberRange[],
        since: Date,
        until: Date,
        chunk: number = 3600 * 1000,
    ) {
        timeRanges = mergeOverlapping(timeRanges);
        const data: {
            y: string;
            v: number;
            x: number;
        }[] = [];
        for (
            let i = 0;
            i < Math.ceil((until.getTime() - since.getTime()) / chunk);
            i++
        ) {
            const rangesAffectingHour: MemberRange[] = [];
            for (const range of timeRanges) {
                const from = range.from.getTime() - since.getTime();
                const until = range.until.getTime() - since.getTime();
                // skip out of scope
                if (until < i * chunk || from > i * chunk + chunk) continue;
                rangesAffectingHour.push(range);
            }

            let secondsCovered = 0;
            for (const range of rangesAffectingHour) {
                const start = range.from.getTime() - since.getTime();
                const end = range.until.getTime() - since.getTime();

                const boundedStart = start < i * chunk ? i * chunk : start;
                const boundedEnd =
                    end > i * chunk + chunk ? i * chunk + chunk : end;
                secondsCovered += boundedEnd - boundedStart;
            }

            data.push({
                v: secondsCovered / chunk,
                y,
                x: since.getTime() + i * chunk,
            });
        }
        return data;
    }

    function getChunkUnmoderatedPercentage(
        timeRanges: TimeRange[],
        since: Date,
        until: Date,
        chunk: number = 3600 * 1000,
    ) {
        const data: {
            y: string;
            v: number;
            x: number;
        }[] = [];
        for (
            let i = 0;
            i < Math.ceil((until.getTime() - since.getTime()) / chunk);
            i++
        ) {
            const rangesAffectingHour: TimeRange[] = [];
            for (const range of timeRanges) {
                const from = range.opened.getTime() - since.getTime();
                const until = range.closed.getTime() - since.getTime();
                // skip out of scope
                if (until < i * chunk || from > i * chunk + chunk) continue;
                rangesAffectingHour.push(range);
            }

            let secondsCovered = 0;
            for (const range of rangesAffectingHour) {
                const start = range.opened.getTime() - since.getTime();
                const end = range.closed.getTime() - since.getTime();

                const boundedStart = start < i * chunk ? i * chunk : start;
                const boundedEnd =
                    end > i * chunk + chunk ? i * chunk + chunk : end;
                secondsCovered += boundedEnd - boundedStart;
            }

            data.push({
                v: secondsCovered / chunk,
                y: "Unmoderated",
                x: since.getTime() + i * chunk,
            });
        }
        return data;
    }

    function mergeOverlapping(ranges: MemberRange[]) {
        ranges = ranges.sort((a, b) => a.from.getTime() - b.from.getTime());

        const mergedRanges: MemberRange[] = [];
        let currentRange = ranges[0];

        for (let i = 1; i < ranges.length; i++) {
            const nextRange = ranges[i];

            if (currentRange.until >= nextRange.from) {
                // Merge overlapping ranges
                currentRange.until = new Date(
                    Math.max(
                        currentRange.until.getTime(),
                        nextRange.until.getTime(),
                    ),
                );
            } else {
                // Add the current merged range and update currentRange
                mergedRanges.push(
                    new MemberRange(
                        currentRange.from,
                        currentRange.until,
                        currentRange.member,
                    ),
                );
                currentRange = nextRange;
            }
        }

        // Add the last merged range
        mergedRanges.push(
            new MemberRange(
                currentRange.from,
                currentRange.until,
                currentRange.member,
            ),
        );

        return mergedRanges;
    }

    onMount(() => {
        const datasets = asDataset();
        new Chart(
            {
                canvas,
            },
            {
                type: "matrix",
                data: {
                    datasets: datasets.datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            displayColors: false,
                            callbacks: {
                                label(context: any) {
                                    return [
                                        Math.trunc(
                                            context.dataset.data[
                                                context.dataIndex
                                            ].v * 10000,
                                        ) /
                                            100 +
                                            "%",
                                    ];
                                },
                            },
                        },
                        title: {
                            display: true,
                            text: "Moderation Coverage",
                            align: "start",
                        },
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            display: true,
                            type: "time",
                            ticks: {
                                display: true,
                            },
                            grid: {
                                display: true,
                            },
                        },
                        y: {
                            type: "category",
                            labels: datasets.labels,
                            offset: true,
                            ticks: {
                                display: true,
                            },
                            grid: {
                                display: true,
                            },
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
