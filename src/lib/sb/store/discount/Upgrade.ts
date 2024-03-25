import type Price from "../price/Price";
import type Product from "../sku/Product";
import Discount from "./Discount";

export default class Upgrade extends Discount {

    public readonly from: Product
    public readonly to: Product

    constructor(id: string, created: Date, price: Price, percentage: number | null, from: Product, to: Product) {
        super(id, created, price, percentage)
        this.from = from
        this.to = to
    }

}