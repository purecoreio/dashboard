import MemberRange from "./MemberRange"
import TimeRange from "./TimeRange"

export default class ModerationCoverage {

    public readonly since: Date
    public readonly until: Date
    public readonly coverages: MemberRange[]
    public readonly gaps: TimeRange[]

    constructor(since: Date, until: Date, coverages: MemberRange[], gaps: TimeRange[]) {
        this.since = since
        this.until = until
        this.coverages = coverages
        this.gaps = gaps
    }

    public static fromObj(obj: any) {
        return new ModerationCoverage(
            new Date(obj.since),
            new Date(obj.until),
            obj.coverages.map((c: any) => MemberRange.fromObject(c)),
            obj.gaps.map((g: any) => TimeRange.fromObject(g)),
        )
    }

}