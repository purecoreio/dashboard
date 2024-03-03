import Staff from "../Staff"

export default class Verification {

    public readonly declined: boolean | null
    public readonly on: Date | null
    public readonly by: Staff | null

    constructor(declined: boolean | null, on: Date | null, by: Staff | null) {
        this.declined = declined
        this.on = on
        this.by = by
    }

    public static fromObject(obj: any) {
        return new Verification(
            obj.declined,
            obj.on ? new Date(obj.on) : null,
            null // TODO: obj.by ? Staff.fromObject(obj.by) : null
        )
    }

}