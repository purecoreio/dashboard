import type Price from "../price/Price";
import Discount from "./Discount";

export default class Coupon extends Discount {

    public readonly code: string

    constructor(id: string, created: Date, price: Price, percentage: number | null, code: string) {
        super(id, created, price, percentage)
        this.code = code
    }


}