import type Category from "../Category";
import I18nPrice from "../price/I18nPrice";
import Product from "./Product";
import Sku from "./Sku";

export default class Bundle extends Sku {

    public readonly products: Product[]

    constructor(id: string, created: Date, name: string, description: string, prices: I18nPrice[], category: Category, type: string, enabled: boolean, visible: boolean, products: Product[]) {
        super(id, created, name, description, prices, category, type, enabled, visible)
        this.products = products
    }

    public static fromObject(obj: any, category: Category) {
        return new Bundle(
            obj.id,
            obj.created,
            obj.name,
            obj.description,
            obj.prices.map((p: any) => I18nPrice.fromObject(p)),
            category,
            'bundle',
            obj.enabled,
            obj.visible,
            obj.products.map((p: any) => Product.fromObject(p, category))
        )
    }
}