import Product from "../Product"
import Perk from "./Perk"

export default class PerkUsage {

    public readonly id: string
    private _perk: Perk
    private _amount: number | null
    public readonly product: Product

    constructor(id: string, perk: Perk, amount: number | null, product: Product) {
        this.id = id
        this._perk = perk
        this._amount = amount
        this.product = product
    }

    public get amount(): number | null {
        return this._amount
    }

    public get perk(): Perk {
        return this._perk
    }

    public static fromObject(obj: any, product: Product) {
        return new PerkUsage(
            obj.id,
            Perk.fromObject(obj.perk, product.category.community),
            obj.amount,
            product
        )
    }

    public updatePerkCache(perk: Perk) {
        this._perk = perk
    }

    public async update(amount: number | null) {
        return this.product.usePerk(this.perk, amount)
    }

    public async delete() {
        return this.product.removePerk(this.perk)
    }

}