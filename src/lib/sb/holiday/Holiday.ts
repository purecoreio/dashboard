import DataPoint from "../stat/DataPoint"
import Series from "../stat/Series"
import Stat from "../stat/Stat"

type AffectedCount = {
    percentage: number,
    absolute: number
}
export default class Holiday {

    public readonly name: string
    public readonly start: Date
    public readonly end: Date
    public readonly affected: AffectedCount
    public readonly country: string

    constructor(name: string, start: Date, end: Date, affected: AffectedCount, country: string) {
        this.name = name
        this.start = start
        this.end = end
        this.affected = affected
        this.country = country
    }

    public static mergeIntoStat(holidays: Holiday[]): Stat {
        let dates: Record<string, number> = {}
        for (const holiday of holidays) {
            let c = holiday.start.getTime()
            while (c <= holiday.end.getTime()) {
                const d = new Date(new Date(c).setHours(0, 0, 0, 0)).toISOString()
                if(dates[d]==null){
                    dates[d] = 0
                }
                dates[d] += holiday.affected.percentage
                c += 3600 * 24 * 1000
            }
        }
        return new Stat(
            '% Active Members Affected By Holidays',
            'hour',
            true,
            [new Series(
                'matrix',
                {
                    '%activePlayerbase': true
                },
                Object.keys(dates).map(d => {
                    return new DataPoint(
                        new Date(d),
                        {
                            '%activePlayerbase': dates[d] * 100
                        }
                    )
                })
            )]
        )
    }

}