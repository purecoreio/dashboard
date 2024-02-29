import type User from "./User"

export default class Profile {

    public readonly user: User

    public readonly id: string
    private _eid?: string
    private _service?: string
    private _pfp?: string
    private _username?: string
    private _name?: string
    private _surname?: string
    private _displayName?: string

    constructor(user: User, id: string, eid?: string, service?: string, pfp?: string, username?: string, name?: string, surname?: string, displayName?: string) {
        this.user = user
        this.id = id
        this._eid = eid
        this._service = service
        this._pfp = pfp
        this._username = username
        this._name = name
        this._surname = surname
        this._displayName = displayName
    }

    public get readableName(): string | null {
        return this._username ?? this._name ?? this._displayName ?? this._surname ?? this._eid ?? null
    }

    public get eid(): string | null {
        return this._eid ?? null
    }

    public get pfp(): string | null {
        return this._pfp ?? null
    }

    public get service(): string | null {
        return this._service ?? null
    }

    public static fromObject(user: User, obj: any) {
        return new Profile(
            user,
            obj.id,
            obj.eid,
            obj.service,
            obj.pfp,
            obj.username,
            obj.name,
            obj.surname,
            obj.displayName
        )
    }

    public copy(profile: Profile) {
        console.log('copying')
        this._service = profile._service
        this._pfp = profile._pfp
        this._username = profile._username
        this._name = profile._name
        this._surname = profile._surname
        this._displayName = profile._surname
        return this
    }

}