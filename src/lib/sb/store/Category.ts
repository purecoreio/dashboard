import type Community from "../Community"
import Srvbench from "../Srvbench"
import Bundle from "./sku/Bundle"
import Product from "./sku/Product"
import Sku from "./sku/Sku"

export default class Category {

    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly upgradeable: boolean
    private _skus: Sku[]
    public readonly visible: boolean
    public readonly disabled: boolean
    public readonly community: Community

    constructor(id: string, name: string, description: string, upgradeable: boolean, skus: Sku[], visible: boolean, disabled: boolean, community: Community) {
        this.id = id
        this.name = name
        this.description = description
        this.upgradeable = upgradeable
        this._skus = skus
        this.visible = visible
        this.disabled = disabled
        this.community = community
    }

    public get skus() {
        return this._skus
    }

    public removeSkuFromCache(sku: Sku) {
        this._skus = this._skus.filter(s => s.id != sku.id)
    }

    public static fromObject(obj: any, community: Community) {
        const category = new Category(
            obj.id,
            obj.name,
            obj.description,
            obj.upgradeable,
            [],
            obj.visible,
            obj.disabled,
            community
        )
        category._skus.push(...obj.skus.map((s: any) => {
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

    public async update(name?: string, description?: string, upgradeable?: boolean, visible?: boolean, disabled?: boolean) {
        return Category.fromObject(await this.community.rest(`store/categories/${this.id}`, {
            name,
            description,
            upgradeable,
            visible,
            disabled
        }), this.community)
    }

    public async remove() {
        await this.community.rest(`store/categories/${this.id}`, undefined, 'DELETE')
    }

    public async createProduct(name: string, description: string, amount: number) {
        const product = Product.fromObject(await this.community.rest(`store/categories/${this.id}/products`, {
            name,
            description,
            amount
        }), this)
        this._skus.push(product)
        return product
    }

}