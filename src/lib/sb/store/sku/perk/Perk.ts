export default class Perk {

    public readonly id: string
    public readonly name: string
    public readonly description: string

    constructor(id: string, name: string, description: string) {
        this.id = id
        this.name = name
        this.description = description
    }

    public static fromObject(obj: any) {
        return new Perk(
            obj.id,
            obj.name,
            obj.description
        )
    }

}