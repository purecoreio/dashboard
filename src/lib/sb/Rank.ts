import type Member from "./Member"

export default class Rank {

    public readonly id: string
    public readonly rank: number
    public readonly member: Member
    public readonly created: Date

    constructor(id: string, rank: number, member: Member, created: Date) {
        this.id = id
        this.rank = rank
        this.member = member
        this.created = created
    }

    public static fromObject(obj: any, member: Member) {
        return new Rank(
            obj.id,
            obj.rank,
            member,
            new Date(obj.created)
        )
    }

}