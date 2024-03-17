import type DataPoint from "./DataPoint"

export type StatType = 'bar' | 'line' | 'pie' | 'area'
export default class Series {
    public readonly type: StatType
    public readonly labels: Record<string, boolean>
    public readonly data: DataPoint[]

    constructor(type: StatType, labels: Record<string, boolean>, data: DataPoint[]) {
        this.type = type
        this.labels = labels
        this.data = data
    }
}