import type Community from "../Community"

export default class Playtime {

    public readonly id: string
    public readonly created: Date
    public readonly playtime: Record<number, number>
    public readonly community: Community

    constructor(id: string, created: Date, playtime: Record<number, number>, community: Community) {
        this.id = id
        this.created = created
        this.playtime = playtime
        this.community = community
    }

    public static fromObject(obj: any, community: Community): Playtime {
        let playtimes: Record<number, number> = {}
        for (const playtime of Object.keys(obj.playtime)) {
            playtimes[Number(playtime)] = Number(obj.playtime[playtime])
        }
        return new Playtime(
            obj.id,
            new Date(obj.created),
            playtimes,
            community
        )
    }


}