import Name from "./Name"
import Rank from "./Rank"
import Srvbench from "./Srvbench"

export default class Member {

    public readonly id: string
    public readonly eid: string
    public readonly game: string
    public readonly name: string
    public readonly names: Name[]
    public readonly joined: Date
    public readonly rank: number
    private ranks: Rank[] | null = null

    constructor(id: string, eid: string, game: string, name: string, names: Name[], joined: Date, rank: number) {
        this.id = id
        this.eid = eid
        this.game = game
        this.name = name
        this.names = names
        this.joined = joined
        this.rank = rank
    }

    public static fromObject(obj: any) {
        return new Member(
            obj.id,
            obj.eid,
            obj.game,
            obj.name,
            obj.names.map((n: any) => Name.fromObject(n)),
            new Date(obj.joined),
            obj.rank
        )
    }

    public async getRanks(): Promise<Rank[]> {
        if (!this.ranks) {
            this.ranks = (await Srvbench.getInstance().rest(`community/${Srvbench.getInstance().getCommunity()!.id}/member/${this.id}/rank`)).map((r: any) => Rank.fromObject(r, this))
        }
        return this.ranks!
    }

}