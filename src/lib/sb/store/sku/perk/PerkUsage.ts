import Perk from "./Perk"

export default class PerkUsage {

    public readonly id: string
    public readonly perk: Perk
    public readonly amount: number | null

    constructor(id: string, perk: Perk, amount: number | null) {
        this.id = id
        this.perk = perk
        this.amount = amount
    }

    public static fromObject(obj: any) {
        return new PerkUsage(
            obj.id,
            Perk.fromObject(obj.perk),
            obj.amount
        )
    }

}