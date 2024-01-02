import Invite from "./Invite"
import Key from "./Key"
import Member from "./Member"
import Role from "./Role"
import Srvbench from "./Srvbench"
import NewMembers from "./stat/NewMembers"

export default class Community {

    public readonly id: string
    public readonly name: string
    public readonly slug: string

    private keys: Key[] | null

    constructor(id: string, name: string, slug: string) {
        this.id = id
        this.name = name
        this.slug = slug
        this.keys = null
    }

    public static fromObject(object: any) {
        return new Community(
            object.id,
            object.name,
            object.slug
        )
    }

    public async spectate() {
        const now = new Date()
        return Srvbench.getInstance().openSocket('community/spectate', {
            community: this.id,
            backlog: 'yes',
            backlog_since: String(now.getTime()),
            backlog_until: String(now.getTime() + 3600 * 1000)
        })
    }

    public async getKeys() {
        if (this.keys == null) {
            this.keys = (await Srvbench.getInstance().rest(`${this.endpoint}/keys`)).map((o: any) => Key.fromObject(o))
        }
        return this.keys!
    }

    private get endpoint() {
        return `community/${this.id}`
    }

    public async getMembers(page: number): Promise<Member[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/members`, {
            page: page
        })).map((m: any) => Member.fromObject(m))
    }

    public async getMembersByRank(page: number, rank: number): Promise<Member[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/members/ranked`, {
            page: page,
            rank: rank
        })).map((m: any) => Member.fromObject(m))
    }

    public async searchMember(name: string) {
        return Member.fromObject(await Srvbench.getInstance().rest(`${this.endpoint}/members/search`, {
            name
        }))
    }

    public async getMember(id: string): Promise<Member> {
        return Member.fromObject(await Srvbench.getInstance().rest(`${this.endpoint}/member/${id}`))!
    }

    public async createRole(name: string, permissions: string[]) {
        return Role.fromObject(await Srvbench.getInstance().rest(`${this.endpoint}/roles`, {
            name,
            permissions
        }))
    }

    public async getNewMembers(): Promise<NewMembers[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/stats/new_players`)).map((n: any) => NewMembers.fromObject(n, this))
    }

    public async getRoles(): Promise<Role[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/roles`)).map((r: any) => Role.fromObject(r))
    }

    public async createInvite(role: Role, member: Member) {
        return Invite.fromObject(await Srvbench.getInstance().rest(`${this.endpoint}/invites`, {
            role: role.id,
            member: member.id
        }))
    }

    public async getInvites(): Promise<Invite[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/invites`)).map((r: any) => Invite.fromObject(r))
    }

}