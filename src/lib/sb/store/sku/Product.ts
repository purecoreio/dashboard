import type Category from "../Category";
import I18nPrice from "../price/I18nPrice";
import Sku from "./Sku";
import PerkUsage from "./perk/PerkUsage";

export default class Product extends Sku {

    public readonly perks: PerkUsage[]

    constructor(id: string, created: Date, name: string, description: string, prices: I18nPrice[], category: Category, type: string, enabled: boolean, visible: boolean, perks: PerkUsage[]) {
        super(id, created, name, description, prices, category, type, enabled, visible)
        this.perks = perks
    }

    public static fromObject(obj: any, category: Category) {
        return new Product(
            obj.id,
            obj.created,
            obj.name,
            obj.description,
            obj.prices.map((p: any) => I18nPrice.fromObject(p)),
            category,
            'product',
            obj.enabled,
            obj.visible,
            obj.perks.map((p: any) => PerkUsage.fromObject(p))
        )
    }

}