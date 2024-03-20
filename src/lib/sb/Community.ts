import Invite from "./Invite"
import Key from "./Key"
import Member from "./Member"
import Role from "./Role"
import Srvbench from "./Srvbench"
import Holiday from "./holiday/Holiday"
import Creator from "./media/Creator"
import Submission from "./media/Submission"
import DataPoint from "./stat/DataPoint"
import ModerationCoverage from "./stat/ModerationCoverage"
import NewMembers from "./stat/NewMembers"
import Playtime from "./stat/Playtime"
import Series from "./stat/Series"
import Stat from "./stat/Stat"
import VotingSettings from "./votingSettings/VotingSettings"

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

    public get endpoint() {
        return `community/${this.id}`
    }

    public async getMembers(page: number): Promise<Member[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/members`, {
            page: page
        })).map((m: any) => Member.fromObject(m))
    }

    public async getGeojson(): Promise<any> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/demographics/geojson`))
    }

    public async getCountries(): Promise<Record<string, number>> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/demographics/country`))
    }

    /**
     * returns the holidays in cronological order (coming earlier first)
     */
    public async getHolidays(): Promise<Holiday[]> {
        const data = await Srvbench.getInstance().rest(`${this.endpoint}/holidays`)
        const holidays: Holiday[] = []
        for (const country of Object.keys(data)) {
            holidays.push(...data[country].holidays.map((h: any) => new Holiday(
                h.name,
                new Date(h.start),
                new Date(h.end),
                {
                    absolute: data[country].count,
                    percentage: data[country].percentage
                },
                country
            )))
        }
        return holidays.sort(function (a, b) {
            return a.start.getTime() - b.start.getTime();
        });
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

    public async getVotingSettings(): Promise<VotingSettings> {
        return VotingSettings.fromObject(await Srvbench.getInstance().rest(`${this.endpoint}/voting/settings`), this)
    }

    public async getPlaytimes(): Promise<Playtime[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/stats/playtime`)).map((n: any) => Playtime.fromObject(n, this))
    }

    public async getActivity(): Promise<Stat> {
        const d = await Srvbench.getInstance().rest(`${this.endpoint}/stats/activity`)
        return Stat.fromObject(d)
    }

    public async getRetentionSpan(): Promise<Stat> {
        const d = await Srvbench.getInstance().rest(`${this.endpoint}/stats/retention/span`)
        return Stat.fromObject(d)
    }

    public async getNewReturningMembers(): Promise<Stat> {
        const d = await Srvbench.getInstance().rest(`${this.endpoint}/stats/newreturning`)
        return Stat.fromObject(d)
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

    public async getModerationCoverage(): Promise<ModerationCoverage> {
        return ModerationCoverage.fromObj(await Srvbench.getInstance().rest(`${this.endpoint}/coverage/moderation`))
    }

    public async getSubmissions(): Promise<Submission[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/media/submissions`)).map((s: any) => Submission.fromObject(s))
    }

    public async getCreators(): Promise<Creator[]> {
        return (await Srvbench.getInstance().rest(`${this.endpoint}/media/profiles`)).map((s: any) => Creator.fromObject(s))
    }

}