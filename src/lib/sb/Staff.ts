import Community from "./Community";
import Member from "./Member";
import Role from "./Role";

export default class Staff {

    public readonly community: Community
    public readonly role: Role
    public readonly member: Member

    constructor(community: Community, role: Role, member: Member) {
        this.community = community
        this.role = role
        this.member = member
    }

    public static fromObject(obj: any) {
        return new Staff(
            Community.fromObject(obj.community),
            Role.fromObject(obj.role),
            Member.fromObject(obj.member)
        )
    }

}