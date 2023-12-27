import Member from "./Member"
import Role from "./Role"

export default class Invite {

    public readonly id: string
    public readonly member: Member
    public readonly role: Role

    constructor(id: string, member: Member, role: Role) {
        this.id = id
        this.member = member
        this.role = role
    }

    public static fromObject(obj: any) {
        return new Invite(
            obj.id,
            Member.fromObject(obj.member),
            Role.fromObject(obj.role)
        )
    }

}