export default class DataPoint {

    key: Date | number | string
    data: Record<string, number>

    constructor(key: Date | number | string, data: Record<string, number>) {
        this.key = key
        this.data = data
    }

}