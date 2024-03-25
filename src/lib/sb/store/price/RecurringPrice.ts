import Price from "./Price";

export type Frequency = 'day' | 'week' | 'month' | 'year'

export default class RecurringPrice extends Price {

    public readonly frequency: Frequency | null
    public readonly offset: number

    constructor(currency: string, amount: number, decimal: number, frequency: Frequency | null, offset: number) {
        super(currency, amount, decimal)
        this.frequency = frequency
        this.offset = offset
    }

}