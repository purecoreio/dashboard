import type Community from "$lib/sb/Community"

export default class Perk {

    public readonly id: string
    private _name: string
    private _description: string
    public readonly community: Community

    constructor(id: string, name: string, description: string, community: Community) {
        this.id = id
        this._name = name
        this._description = description
        this.community = community
    }

    public get name(): string {
        return this._name
    }

    public get description(): string {
        return this._description
    }

    public static fromObject(obj: any, community: Community) {
        return new Perk(
            obj.id,
            obj.name,
            obj.description,
            community
        )
    }

    public async delete() {
        await this.community.rest(`store/perks/${this.id}`, undefined, 'DELETE')
    }

    public async update(name: string, description: string) {
        const perk = Perk.fromObject(await this.community.rest(`store/perks/${this.id}`, {
            name,
            description
        }), this.community)
        this._name = name
        this._description = description
        return perk
    }

}