import Member from "../Member"

export default class MemberRange {

    public from: Date
    public until: Date
    public readonly member: Member

    public constructor(from: Date, until: Date, member: Member) {
        this.from = from
        this.until = until
        this.member = member
    }

    public static fromObject(obj: any) {
        return new MemberRange(
            new Date(obj.from),
            new Date(obj.until),
            Member.fromObject(obj.member)
        )
    }

}