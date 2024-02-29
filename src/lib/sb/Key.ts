export default class Key {

    public readonly id: string

    constructor(id: string) {
        this.id = id
    }

    public static fromObject(obj: any) {
        return new Key(obj.id)
    }

}