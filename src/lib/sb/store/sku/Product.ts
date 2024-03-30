import type Category from "../Category";
import I18nPrice from "../price/I18nPrice";
import Sku from "./Sku";
import type Perk from "./perk/Perk";
import PerkUsage from "./perk/PerkUsage";

export default class Product extends Sku {

    private _perks: PerkUsage[]

    constructor(id: string, created: Date, name: string, description: string, prices: I18nPrice[], category: Category, type: string, disabled: boolean, visible: boolean, perks: PerkUsage[]) {
        super(id, created, name, description, prices, category, type, disabled, visible)
        this._perks = perks
    }

    public get perks() {
        return this._perks
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
        product._perks.push(...
            obj.perks.map((p: any) => PerkUsage.fromObject(p, product)))
        return product
    }

    public updatePerkCache(allExistingPerks: Perk[] | null) {
        if (allExistingPerks == null) return this.perks
        let toBeRemoved: Perk[] = []
        for (const usage of this.perks) {
            const existingPerk = allExistingPerks.find(p => p.id == usage.perk.id)
            if (existingPerk) {
                usage.updatePerkCache(existingPerk)
            } else {
                toBeRemoved.push(usage.perk)
            }
        }
        this._perks = this.perks.filter(p => !toBeRemoved.find(r => r.id == p.perk.id))
        return this._perks
    }

    public async usePerk(perk: Perk, amount: number | null = null) {
        return Product.fromObject(await this.category.community.rest(`store/categories/${this.category.id}/products/${this.id}/perks/${perk.id}`, {
            amount
        }), this.category)
    }

    public async removePerk(perk: Perk) {
        return Product.fromObject(await this.category.community.rest(`store/categories/${this.category.id}/products/${this.id}/perks/${perk.id}`, undefined, 'DELETE'),
            this.category)
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