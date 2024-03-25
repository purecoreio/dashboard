import type Price from "../price/Price"

export default class Discount {

    public readonly id: string
    public readonly created: Date
    public readonly price: Price
    public readonly percentage: number | null

    constructor(id: string, created: Date, price: Price, percentage: number | null) {
        this.id = id
        this.created = created
        this.price = price
        this.percentage = percentage
    }

}