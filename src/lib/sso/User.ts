import Profile from "./Profile"
import SSO from "./SSO"
import type Session from "./Session"

export default class User {

    public readonly id: string
    public readonly username: string
    private profiles: Profile[] | null
    private readonly session: Session | null

    constructor(id: string, username: string, profiles: Profile[] | null, session: Session | null) {
        this.id = id
        this.username = username
        this.profiles = profiles
        this.session = session
    }

    public async getProfiles(): Promise<Profile[]> {
        if (this.profiles == null) {
            const sso = SSO.getInstance()
            const data = await sso.fetch('profiles')
            this.profiles = data.map((p: any) => Profile.fromObject(this, p))
            sso.session!.profile.copy(this.profiles!.find(p => p.id == sso.session!.profile.id)!)
        }
        return this.profiles!
    }

}