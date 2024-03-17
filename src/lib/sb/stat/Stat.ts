import type Series from "./Series";

export type GraphLib = 'unovis' | 'chartjs'
export type Resolution = null | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

export default class Stat {

    public readonly resolution: Resolution
    public readonly stacked: boolean
    public readonly series: Series[]

    constructor(resolution: Resolution, stacked: boolean, series: Series[]) {
        this.resolution = resolution
        this.stacked = stacked
        this.series = series
    }

    getSettings(lib: GraphLib) {
        switch (lib) {
            case 'chartjs':
                return {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: this.stacked,
                            type: this.resolution != null ? 'time' : undefined,
                            time: this.resolution != null ? {
                                unit: this.resolution
                            } : undefined
                        },
                        y: {
                            stacked: this.stacked,
                        },
                    }
                }
                break;
            default:
                break;
        }
    }

}