import Community from "../Community"
import Member from "../Member"
import MediaProfile from "./MediaProfile"

export default class Creator {

    public readonly id: string
    public readonly code: string
    public readonly community: Community
    public readonly member: Member

    constructor(id: string, code: string, community: Community, member: Member) {
        this.id = id
        this.code = code
        this.community = community
        this.member = member
    }

    public static fromObject(obj: any) {
        return new Creator(
            obj.id,
            obj.code,
            Community.fromObject(obj.community),
            Member.fromObject(obj.member)
        )
    }

}