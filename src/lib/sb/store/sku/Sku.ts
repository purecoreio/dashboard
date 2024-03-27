import type Category from "../Category"
import type I18nPrice from "../price/I18nPrice"

export default class Sku {

    public readonly id: string
    public readonly created: Date
    public readonly name: string
    public readonly description: string
    public readonly prices: I18nPrice[]
    public readonly category: Category
    public readonly type: string
    public readonly disabled: boolean
    public readonly visible: boolean

    constructor(id: string, created: Date, name: string, description: string, prices: I18nPrice[], category: Category, type: string, disabled: boolean, visible: boolean) {
        this.id = id
        this.created = created
        this.name = name
        this.description = description
        this.prices = prices
        this.category = category
        this.type = type
        this.disabled = disabled
        this.visible = visible
    }

}