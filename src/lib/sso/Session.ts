import Profile from "./Profile"
import Token from "./Token"
import User from "./User"

export default class Session {

    private _refresh: Token
    private _access: Token
    private _user?: User
    private _profile?: Profile
    private _errored: boolean

    constructor(refresh: Token, access: Token, user?: User, profile?: Profile) {
        this._refresh = refresh
        this._access = access
        this._user = user
        this._profile = profile
        this._errored = false
    }

    public get access(): Token {
        return this._access
    }

    public get user(): User {
        return this._user!
    }

    public get profile(): Profile {
        return this._profile!
    }

    public get valid(): boolean {
        return !this._errored
    }

    public static retrieve() {
        const storedSession = localStorage.getItem("session")
        if (!storedSession) throw new Error('not logged in')
        const [refresh, access] = storedSession.split(' ')
        return Session.fromTokenPair(access, refresh)
    }

    public static fromTokenPair(access: string, refresh: string) {
        const refreshToken = Token.fromJWT(refresh)
        const accessToken = Token.fromJWT(access)
        const session = new Session(refreshToken, accessToken)
        const user = new User(refreshToken.payload.sub, refreshToken.payload.nickname, null, session)
        const profile = new Profile(user, refreshToken.payload.act.sub)
        session._profile = profile
        session._user = user
        return session
    }

    public async renewIfDue() {
        try {
            const headroom = 30 * 1000
            if (this._access.expiry.getTime() >= new Date().getTime() - headroom) return
            if (this._refresh.expiry.getTime() < new Date().getTime() - headroom) throw new Error('expired refresh')
            const json = await this.refreshToken()
            this._access = Token.fromJWT(json.access_token)
            this._refresh = Token.fromJWT(json.refresh_token)
            this._errored = false
            this.store()
        } catch (error) {
            this.invalidate()
            throw error
        }
    }

    public static async exchangeCode(code: string, redirect_uri: string) {
        const res = await fetch('https://sso.nominal.es/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                redirect_uri,
                grant_type: 'authorization_code',
                code
            })
        })
        const data = await res.json()
        return Session.fromTokenPair(data.access_token, data.refresh_token)
    }

    private async refreshToken(profileId?: string) {
        const res = await fetch('https://sso.nominal.es/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh_token: this._refresh.token,
                grant_type: 'refresh_token',
                profile: profileId
            })
        })
        return res.json()
    }

    public async changeProfile(profile: Profile) {
        try {
            const json = await this.refreshToken(profile.id)
            this._access = Token.fromJWT(json.access_token)
            this._refresh = Token.fromJWT(json.refresh_token)
            this._profile = profile
            this._errored = false
        } catch (error) {
            this.invalidate()
            throw error
        }
    }

    public store() {
        localStorage.setItem("session", [this._refresh.token, this._access.token].join(' '))
    }

    public invalidate() {
        this._errored = true
        localStorage.removeItem("session")
    }

}