import DataPoint from "./DataPoint";
import Series, { type StatType } from "./Series";
import moment from 'moment';

export type GraphLib = 'unovis' | 'chartjs' | 'svelte-heatmap'
export type Resolution = null | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

const colors: Record<string, string> = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
}

const dailyFormat = 'dd'
const weeklyFormat = 'YY/WW (MMM)'

export function getColor(i: number) {
    const k = Object.keys(colors)
    const c: string = Object.keys(colors)[i - Math.trunc(i / k.length) * k.length]
    return colors[c]
}

export default class Stat {

    public readonly name: string
    public readonly resolution: Resolution
    public readonly stacked: boolean
    public readonly series: Series[]

    constructor(name: string, resolution: Resolution, stacked: boolean, series: Series[]) {
        this.name = name
        this.resolution = resolution
        this.stacked = stacked
        this.series = series
    }

    public static fromObject(obj: any) {
        return new Stat(
            obj.name,
            obj.resolution as Resolution,
            obj.stacked,
            obj.series.map((s: any) => {
                return new Series(
                    s.type as StatType,
                    s.labels,
                    s.data.map((d: any) => {
                        return new DataPoint(
                            obj.resolution ? new Date(d.key) : d.key,
                            d.data
                        )
                    })
                )
            })
        )
    }

    getSettings(lib: GraphLib, log: boolean): any {
        switch (lib) {
            case 'chartjs':
                if (this.getType('chartjs') == 'matrix') {
                    const isoWeekday = 1;
                    const grid = {
                        display: false,
                        drawBorder: false,
                        tickLength: 0,
                    }
                    const ticks = {
                        maxRotation: 0,
                        autoSkip: true,
                        padding: 1
                    }
                    const y = {
                        type: 'time',
                        offset: true,
                        time: {
                            isoWeekday,
                            unit: 'day',
                            round: 'day',
                            parser: dailyFormat,
                            displayFormats: {
                                day: 'dd'
                            }
                        },
                        reverse: false,
                        position: 'right',
                        ticks,
                        grid,
                        min: moment().startOf('isoWeek'),
                        max: moment().endOf('isoWeek')
                    }
                    const x = {
                        type: 'time',
                        offset: true,
                        reverse: true,
                        time: {
                            isoWeekday,
                            unit: 'week',
                            round: 'week',
                            displayFormats: {
                                week: weeklyFormat
                            }
                        },
                        ticks,
                        grid,
                    }
                    return {
                        scales: {
                            x: this.stacked ? y : x,
                            y: this.stacked ? x : y
                        },
                        plugins: {
                            legend: false,
                            tooltip: {
                                displayColors: false,
                                callbacks: {
                                    title() {
                                        return '';
                                    },
                                    label(context: any) {
                                        const v = context.dataset.data[context.dataIndex];
                                        if (!v) return '0%'
                                        return [v.d.toLocaleDateString(), v.v.toFixed(2) + '%'];
                                    }
                                }
                            },
                        },
                    }
                } else {
                    return {
                        responsive: true,
                        scales: {
                            x: {
                                stacked: this.stacked,
                                type: this.resolution != null ? (this.series[0]?.type == 'bar' ? 'timeseries' : 'time') : 'linear',
                                time: this.resolution != null ? {
                                    unit: this.resolution
                                } : undefined,
                                ticks: {
                                    stepSize: 1 // Adjust this value as needed to set the step size between each x-value
                                }
                            },
                            y: {
                                type: log ? 'logarithmic' : undefined,
                                stacked: this.stacked,
                            },
                        },
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        },
                        animation: {
                            duration: 500,
                            easing: 'easeInOutQuart'
                        }
                    }
                }
            default:
                break;
        }
    }

    getType(lib: GraphLib): any {
        return lib == 'chartjs' && this.series.find(s => s.type == 'matrix') != null ? 'matrix' : undefined
    }

    private getISODayString(date: Date) {
        return moment(date).format(dailyFormat)
    }

    getSeries(lib: GraphLib): any | any[] {
        switch (lib) {
            case 'svelte-heatmap':
                const m = this.series.find(s => s.type == 'matrix')
                if (!m) return []
                const l = Object.keys(m.labels)[0]
                if (!l) return []
                return m.data.map(d => {
                    return {
                        date: d.key as Date,
                        value: d.data[l]
                    }
                })
            case 'chartjs':
                let datasets: any[] = []
                for (const s of this.series) {
                    const labels = Object.keys(s.labels)
                    for (let i = 0; i < labels.length; i++) {
                        const l = labels[i];
                        let data: any[] = []
                        if (s.type == 'matrix') {
                            datasets.push({
                                data: s.data.map(d => {
                                    const k = d.key as Date
                                    const day = moment(k).format(dailyFormat)
                                    const date = moment(k)
                                    return {
                                        x: this.stacked ? day : date,
                                        y: this.stacked ? date : day,
                                        d: k,
                                        v: d.data[l]
                                    }
                                }),
                                backgroundColor(c: any) {
                                    const value = c.dataset.data[c.dataIndex]?.v ?? 0;
                                    const alpha = value / 100;
                                    return `rgba(0,0,0,${alpha})`
                                },
                                borderWidth: 1,
                                hoverBackgroundColor: colors.blue,
                                hoverBorderColor: colors.blue,
                                width: ({ chart }) => (chart.chartArea || {}).width / chart.scales.x.ticks.length,
                                height(c: any) {
                                    const a = c.chart.chartArea || {};
                                    return (a.bottom - a.top) / 7 - 1;
                                },
                                label: l,
                                hidden: !s.labels[l],
                            })
                        } else {
                            if (this.resolution == null) {
                                data = s.data.map(d => {
                                    return {
                                        x: d.getKey(lib),
                                        y: d.data[l]
                                    }
                                })
                            } else if (this.resolution) {
                                data = s.data.map(d => d.data[l])
                            }
                            datasets.push({
                                type: s.type == 'area' ? 'bar' : s.type,
                                label: l,
                                hidden: !s.labels[l],
                                borderColor: getColor(i),
                                backgroundColor: getColor(i),
                                fill: s.type == 'area',
                                data,
                            })
                        }
                    }
                }
                return {
                    labels: this.series[0].data.map(d => d.getKey('chartjs')),
                    datasets
                }
            default:
                return []
        }
    }

}