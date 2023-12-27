export default class Name {

    public readonly value: string
    public readonly created: Date

    constructor(value: string, created: Date) {
        this.value = value
        this.created = created
    }

    public static fromObject(obj: any) {
        return new Name(
            obj.value,
            new Date(obj.created)
        )
    }

}