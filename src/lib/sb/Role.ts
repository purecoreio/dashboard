export default class Role {

    public readonly name: string
    public readonly permissions: string[]
    public readonly id: string

    constructor(name: string, permissions: string[], id: string) {
        this.name = name
        this.permissions = permissions
        this.id = id
    }

    public static fromObject(obj: any) {
        return new Role(
            obj.name,
            obj.permissions,
            obj.id
        )
    }

}