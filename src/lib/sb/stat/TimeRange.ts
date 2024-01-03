export default class TimeRange {

    public readonly opened: Date
    public readonly closed: Date

    constructor(opened: Date, closed: Date) {
        this.opened = opened
        this.closed = closed
    }

    public static fromObject(obj: any) {
        return new TimeRange(
            new Date(obj.opened),
            new Date(obj.closed)
        )
    }

}