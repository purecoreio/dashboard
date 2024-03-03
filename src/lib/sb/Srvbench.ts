import SSO from "$lib/sso/SSO";
import Community from "./Community";
import Staff from "./Staff";
import User from "./User";
import type { HandlerType } from "./voting/HandlerType";
import VotingSite from "./voting/VotingSite";

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

    public async linkMedia(platform: string) {
        const link = await this.rest(`media/link/${platform}`, {})
        window.open(link.url, '_blank')!.focus();
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

    private async getCommunities(force: boolean = false): Promise<[Community[], Staff[]]> {
        if (force || !this.ownedCommunities || !this.moderatedCommunities) {
            const result = await this.rest('community')
            const owned = result.owned.map((o: any) => Community.fromObject(o))
            const moderated = result.moderated.map((o: any) => Staff.fromObject(o))
            this.ownedCommunities = owned
            this.moderatedCommunities = moderated
            return [owned, moderated]
        }
        return [this.ownedCommunities, this.moderatedCommunities]
    }

    public async getOwnedCommunities(force: boolean = false): Promise<Community[]> {
        return (await this.getCommunities(force))[0]!
    }

    public async getModeratedCommunities(force: boolean = false) {
        return (await this.getCommunities(force))[1]!
    }

    public async getVotingSites() {
        const response = await this.rest('votingsites')
        return {
            verified: response.verified.map((s: any) => VotingSite.fromObject(s)),
            owned: response.owned.map((s: any) => VotingSite.fromObject(s)),
        }
    }

    public async createVotingSite(domain: string, handlerIdentifier: string, handlerTypes: HandlerType[], cooldown: number, reset: number | null, regions: string[]) {
        const response = await this.rest('votingsites', {
            domain,
            handlerIdentifier,
            handlerTypes,
            cooldown,
            reset,
            regions
        })
        return VotingSite.fromObject(response)
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

    public getUser() {
        return new User()
    }

}