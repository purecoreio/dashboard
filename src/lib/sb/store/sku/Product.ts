import type Category from "../Category";
import I18nPrice from "../price/I18nPrice";
import Sku from "./Sku";
import PerkUsage from "./perk/PerkUsage";

export default class Product extends Sku {

    public readonly perks: PerkUsage[]

    constructor(id: string, created: Date, name: string, description: string, prices: I18nPrice[], category: Category, type: string, disabled: boolean, visible: boolean, perks: PerkUsage[]) {
        super(id, created, name, description, prices, category, type, disabled, visible)
        this.perks = perks
    }

    public static fromObject(obj: any, category: Category) {
        const product = new Product(
            obj.id,
            obj.created,
            obj.name,
            obj.description,
            obj.prices.map((p: any) => I18nPrice.fromObject(p)),
            category,
            'product',
            obj.disabled,
            obj.visible,
            []
        )
        product.perks.push(...
            obj.perks.map((p: any) => PerkUsage.fromObject(p, product)))
        return product
    }

    public async update(name?: string, description?: string, disabled?: boolean, visible?: boolean) {
        return Product.fromObject(await this.category.community.rest(`store/categories/${this.category.id}/products/${this.id}`, {
            name,
            description,
            disabled,
            visible
        }), this.category)
    }

    public async remove() {
        await this.category.community.rest(`store/categories/${this.category.id}/products/${this.id}`, undefined, 'DELETE')
        this.category.removeSkuFromCache(this)
    }

}