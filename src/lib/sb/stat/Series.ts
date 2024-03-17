import type DataPoint from "./DataPoint"
import type { GraphLib } from "./Stat"

export type StatType = 'bar' | 'line' | 'pie'
export default class Series {
    public readonly type: StatType
    public readonly labels: string[]
    public readonly data: DataPoint[]

    constructor(type: StatType, labels: string[], data: DataPoint[]) {
        this.type = type
        this.labels = labels
        this.data = data
    }

    getSeries(lib: GraphLib) {
        switch (lib) {
            case 'chartjs':
                return this.data.map(s => {
                    return {
                        
                    }
                })
                break;

            default:
                break;
        }
    }
}