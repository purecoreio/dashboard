import type Product from "../Product"
import Perk from "./Perk"

export default class PerkUsage {

    public readonly id: string
    public readonly perk: Perk
    private _amount: number | null
    public readonly product: Product

    constructor(id: string, perk: Perk, amount: number | null, product: Product) {
        this.id = id
        this.perk = perk
        this._amount = amount
        this.product = product
    }

    public get amount(): number | null {
        return this._amount
    }

    public static fromObject(obj: any, product: Product) {
        return new PerkUsage(
            obj.id,
            Perk.fromObject(obj.perk, product.category.community),
            obj.amount,
            product
        )
    }

    public async update(amount: number | null) {
        const u = this.product.usePerk(this.perk, amount)
        this._amount = amount
        return u
    }

    public async delete() {
        return this.product.removePerk(this.perk)
    }

}