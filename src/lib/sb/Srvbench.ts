import SSO from "$lib/sso/SSO";
import Community from "./Community";
import Staff from "./Staff";

export default class Srvbench {

    private community: Community | null
    private ownedCommunities: Community[] | null
    private moderatedCommunities: Staff[] | null

    private static instance: Srvbench | null = null

    private constructor() {
        this.community = null
        this.ownedCommunities = null
        this.moderatedCommunities = null
    }

    public static getInstance() {
        if (!Srvbench.instance) {
            SSO.getInstance('serverbench.io')
            Srvbench.instance = new Srvbench()
        }
        return Srvbench.instance
    }

    public getCommunity() {
        return this.community
    }

    public setCommunity(community: Community) {
        this.community = community
        localStorage.setItem('community', this.community.id)
    }

    public async restoreCommunity() {
        if (this.community) return
        const id = localStorage.getItem('community')
        if (!id) throw new Error('unable to restore')
        this.community = await this.fetchCommunity(id)
        return this.community
    }

    public async fetchCommunity(id: string) {
        return Community.fromObject(await this.rest(`community/${id}`))
    }

    public async createCommunity(name: string, slug: string) {
        await this.getCommunities()
        const community = Community.fromObject(await this.rest('community', {
            name,
            slug
        }))
        this.ownedCommunities?.push(community)
        return community
    }

    public async joinCommunity(inviteId: string): Promise<Staff> {
        const staff = Staff.fromObject(await this.rest('community/invite', {
            id: inviteId,
        }))
        this.ownedCommunities?.push(staff.community)
        return staff
    }

    private async getCommunities() {
        if (!this.ownedCommunities || !this.moderatedCommunities) {
            const result = await this.rest('community')
            this.ownedCommunities = result.owned.map((o: any) => Community.fromObject(o))
            this.moderatedCommunities = result.moderated.map((o: any) => Staff.fromObject(o))
        }
    }

    public async getOwnedCommunities() {
        await this.getCommunities()
        return this.ownedCommunities
    }

    public async getModeratedCommunities() {
        await this.getCommunities()
        return this.moderatedCommunities
    }

    public async rest(endpoint: string, body?: any) {
        await SSO.getInstance().session?.renewIfDue()
        const headers = new Headers({
            'Authorization': `Bearer ${SSO.getInstance().session?.access.token}`
        })
        if (body) headers.set('Content-Type', 'application/json')
        const res = await fetch(`https://api.serverbench.io/${endpoint}`, {
            method: body ? 'POST' : 'GET',
            body: body ? JSON.stringify(body) : undefined,
            headers
        })
        return await res.json()
    }

    public async openSocket(endpoint: string, args: Record<string, string>) {
        await SSO.getInstance().session?.renewIfDue()
        args['token'] = SSO.getInstance().session!.access.token
        return new WebSocket(`wss://stream.serverbench.io/${endpoint}?${new URLSearchParams(args).toString()}`)
    }

}