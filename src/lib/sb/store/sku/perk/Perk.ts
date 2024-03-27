import type Community from "$lib/sb/Community"

export default class Perk {

    public readonly id: string
    public readonly name: string
    public readonly description: string
    public readonly community: Community

    constructor(id: string, name: string, description: string, community: Community) {
        this.id = id
        this.name = name
        this.description = description
        this.community = community
    }

    public static fromObject(obj: any, community: Community) {
        return new Perk(
            obj.id,
            obj.name,
            obj.description,
            community
        )
    }

}