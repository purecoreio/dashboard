import RecurringPrice, { type Frequency } from "./RecurringPrice"

export default class I18nPrice extends RecurringPrice {

    public readonly id: string
    public readonly country: string

    constructor(currency: string, amount: number, decimal: number, frequency: Frequency | null, offset: number, id: string, country: string) {
        super(currency, amount, decimal, frequency, offset)
        this.id = id
        this.country = country
    }

    public static fromObject(obj: any) {
        return new I18nPrice(
            obj.currency,
            obj.amount,
            obj.decimal,
            obj.frequency,
            obj.offset,
            obj.id,
            obj.country
        )
    }

}