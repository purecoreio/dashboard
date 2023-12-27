import Name from "./Name"

export default class Member {

    public readonly id: string
    public readonly eid: string
    public readonly game: string
    public readonly name: string
    public readonly names: Name[]
    public readonly joined: Date

    constructor(id: string, eid: string, game: string, name: string, names: Name[], joined: Date) {
        this.id = id
        this.eid = eid
        this.game = game
        this.name = name
        this.names = names
        this.joined = joined
    }

    public static fromObject(obj: any) {
        return new Member(
            obj.id,
            obj.eid,
            obj.game,
            obj.name,
            obj.names.map((n: any) => Name.fromObject(n)),
            new Date(obj.joined)
        )
    }

}