import type Product from "../Product"
import Perk from "./Perk"

export default class PerkUsage {

    public readonly id: string
    public readonly perk: Perk
    public readonly amount: number | null
    public readonly product: Product

    constructor(id: string, perk: Perk, amount: number | null, product: Product) {
        this.id = id
        this.perk = perk
        this.amount = amount
        this.product = product
    }

    public static fromObject(obj: any, product: Product) {
        return new PerkUsage(
            obj.id,
            Perk.fromObject(obj.perk, product.category.community),
            obj.amount,
            product
        )
    }

}