import Bundle from "./sku/Bundle"
import Product from "./sku/Product"
import Sku from "./sku/Sku"

export default class Category {

    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly upgradeable: boolean
    public readonly skus: Sku[]

    constructor(id: string, name: string, description: string, upgradeable: boolean, skus: Sku[]) {
        this.id = id
        this.name = name
        this.description = description
        this.upgradeable = upgradeable
        this.skus = skus
    }

    public static fromObject(obj: any) {
        const category = new Category(
            obj.id,
            obj.name,
            obj.description,
            obj.upgradeable,
            []
        )
        category.skus.push(...obj.skus.map((s: any) => {
            switch (s.type) {
                case 'product':
                    return Product.fromObject(s, category)
                case 'bundle':
                    return Bundle.fromObject(s, category)
                default:
                    throw new Error('invalid type')
            }
        }))
        return category
    }

}