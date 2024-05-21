import Invite from "./Invite"
import Key from "./Key"
import Member from "./Member"
import Role from "./Role"
import Srvbench from "./Srvbench"
import Holiday from "./holiday/Holiday"
import Creator from "./media/Creator"
import Submission from "./media/Submission"
import type Instance from "./server/Instance"
import Server from "./server/Server"
import DataPoint from "./stat/DataPoint"
import ModerationCoverage from "./stat/ModerationCoverage"
import NewMembers from "./stat/NewMembers"
import Playtime from "./stat/Playtime"
import Series from "./stat/Series"
import Stat from "./stat/Stat"
import Category from "./store/Category"
import Perk from "./store/sku/perk/Perk"
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

    public async getServers(): Promise<Server[]> {
        return (await this.rest('servers')).map((s: any) => Server.fromObject(s, this))
    }

    public async getServer(id: string) {
        return Server.fromObject(await this.rest(`servers/${id}`), this)
    }

    public async createServer(name: string) {
        return Server.fromObject(await this.rest('servers', {
            name
        }), this)
    }

    public async getCategories() {
        return (await this.rest(`store/categories`)).map((c: any) => Category.fromObject(c, this))
    }

    public async getPerks() {
        return (await this.rest(`store/perks`)).map((c: any) => Perk.fromObject(c, this))
    }

    public async getFallbackCurrency() {
        return (await this.rest(`store/currency`)).currency
    }

    public async rest(endpoint: string, body?: any, method?: 'POST' | 'GET' | 'DELETE' | 'PATCH') {
        return Srvbench.getInstance().rest(`community/${this.id}/${endpoint}`, body, method)
    }

    public async createCategory(name: string, description: string) {
        return Category.fromObject(await this.rest(`store/categories`, {
            name,
            description
        }), this)
    }

    public async createPerk(name: string, description: string) {
        return Perk.fromObject(await this.rest(`store/perks`, {
            name,
            description
        }), this)
    }

    public async requestDiscordLinkIntent() {
        const link = await this.rest(`discord/link`)
        return {
            code: link.code as string,
            url: link.url as string
        }
    }

    public async getDiscord() {
        const guild = await this.rest(`discord`)
        return guild.guild
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
            this.keys = (await this.rest(`keys`)).map((o: any) => Key.fromObject(o))
        }
        return this.keys!
    }

    public async getMembers(page: number): Promise<Member[]> {
        return (await this.rest(`members`, {
            page: page
        })).map((m: any) => Member.fromObject(m))
    }

    public async getGeojson(): Promise<any> {
        return (await this.rest(`demographics/geojson`))
    }

    public async getCountries(): Promise<Record<string, number>> {
        return (await this.rest(`$demographics/country`))
    }

    /**
     * returns the holidays in cronological order (coming earlier first)
     */
    public async getHolidays(): Promise<Holiday[]> {
        const data = await this.rest(`holidays`)
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
        return (await this.rest(`members/ranked`, {
            page: page,
            rank: rank
        })).map((m: any) => Member.fromObject(m))
    }

    public async searchMember(name: string) {
        return Member.fromObject(await this.rest(`members/search`, {
            name
        }))
    }

    public async getMember(id: string): Promise<Member> {
        return Member.fromObject(await this.rest(`member/${id}`))!
    }

    public async createRole(name: string, permissions: string[]) {
        return Role.fromObject(await this.rest(`roles`, {
            name,
            permissions
        }))
    }

    public async getNewMembers(): Promise<NewMembers[]> {
        return (await this.rest(`stats/new_players`)).map((n: any) => NewMembers.fromObject(n, this))
    }

    public async getVotingSettings(): Promise<VotingSettings> {
        return VotingSettings.fromObject(await this.rest(`voting/settings`), this)
    }

    public async getPlaytimes(): Promise<Playtime[]> {
        return (await this.rest(`stats/playtime`)).map((n: any) => Playtime.fromObject(n, this))
    }

    public async getActivity(): Promise<Stat> {
        const d = this.rest(`stats/activity`)
        return Stat.fromObject(d)
    }

    public async getRetentionSpan(): Promise<Stat> {
        const d = this.rest(`stats/retention/span`)
        return Stat.fromObject(d)
    }

    public async getNewReturningMembers(): Promise<Stat> {
        const d = await this.rest(`stats/newreturning`)
        return Stat.fromObject(d)
    }

    public async getRoles(): Promise<Role[]> {
        return (await this.rest(`roles`)).map((r: any) => Role.fromObject(r))
    }

    public async createInvite(role: Role, member: Member) {
        return Invite.fromObject(await this.rest(`invites`, {
            role: role.id,
            member: member.id
        }))
    }

    public async getInvites(): Promise<Invite[]> {
        return (await this.rest(`invites`)).map((r: any) => Invite.fromObject(r))
    }

    public async getModerationCoverage(): Promise<ModerationCoverage> {
        return ModerationCoverage.fromObj(await this.rest(`coverage/moderation`))
    }

    public async getSubmissions(): Promise<Submission[]> {
        return (await this.rest(`media/submissions`)).map((s: any) => Submission.fromObject(s))
    }

    public async getCreators(): Promise<Creator[]> {
        return (await this.rest(`media/profiles`)).map((s: any) => Creator.fromObject(s))
    }

    public async instanceSocket(instances?: Instance[]) {
        if (!instances) {
            const servers = await this.getServers()
            instances = servers.map(s => s.instances).flat()
        }
        return Srvbench.getInstance().openSocket('admin/instance', {
            community: this.id,
            instance: instances.map(i => i.id).join(',')
        })
    }

}