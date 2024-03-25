import type Price from "../price/Price"
import Discount from "./Discount"

export default class Sale extends Discount {

    public readonly name: string
    public readonly countries: string[] | null
    public readonly since: Date
    public readonly until: Date

    constructor(id: string, created: Date, price: Price, percentage: number | null, name: string, countries: string[] | null, since: Date, until: Date) {
        super(id, created, price, percentage)
        this.name = name
        this.countries = countries
        this.since = since
        this.until = until
    }

}