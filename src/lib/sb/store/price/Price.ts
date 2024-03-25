export default class Price {

    public readonly currency: string
    public readonly amount: number
    public readonly decimal: number

    constructor(currency: string, amount: number, decimal: number) {
        this.currency = currency
        this.amount = amount
        this.decimal = decimal
    }

}