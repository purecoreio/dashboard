import type { GraphLib } from "./Stat"

export default class DataPoint {

    key: Date | number | string
    data: Record<string, number>

    constructor(key: Date | number | string, data: Record<string, number>) {
        this.key = key
        this.data = data
    }

    public getKey(lib:GraphLib){
        switch (lib) {
            case 'chartjs':
                if(this.key instanceof Date){
                    return this.key.getTime()
                } else {
                    return this.key
                }
            default:
                break;
        }
    }

}