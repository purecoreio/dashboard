import type Community from "../Community"

export default class NewMembers {

    public readonly id: string
    public readonly created: Date
    public readonly unclassified: number
    public readonly returning: number
    public readonly nonReturning: number
    public readonly community: Community

    constructor(id: string, created: Date, unclassified: number, returning: number, nonReturning: number, community: Community) {
        this.id = id
        this.created = created
        this.unclassified = unclassified
        this.returning = returning
        this.nonReturning = nonReturning
        this.community = community
    }

    public static fromObject(obj: any, community: Community): NewMembers {
        return new NewMembers(
            obj.id,
            new Date(obj.created),
            obj.unclassified,
            obj.returning,
            obj.nonReturning,
            community
        )
    }


}