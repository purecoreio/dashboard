import Community from "../Community"
import Member from "../Member"
import Creator from "./Creator"
import type { MediaPlatform } from "./MediaProfile"
import MediaProfile from "./MediaProfile"
import Verification from "./Verification"


export default class Submission {

    public readonly id: string
    public readonly created: Date
    public readonly uploader: Creator
    public readonly title: string
    public readonly profile: MediaProfile
    public readonly eid: string
    public readonly verification: Verification

    constructor(id: string, created: Date, uploader: Creator, title: string, profile: MediaProfile, eid: string, verification: Verification) {
        this.id = id
        this.created = created
        this.uploader = uploader
        this.title = title
        this.profile = profile
        this.eid = eid
        this.verification = verification
    }

    public get url(): string {
        switch (this.profile.platform) {
            case 'tiktok':
                return `https://www.tiktok.com/@${this.profile.username}/video/${this.eid}`
            case 'youtube':
                return `https://www.youtube.com/watch?v=${this.eid}`
            default:
                throw new Error()
        }
    }

    public static fromObject(obj: any) {
        return new Submission(
            obj.id,
            new Date(obj.created),
            Creator.fromObject(obj.uploader),
            obj.title,
            MediaProfile.fromObject(obj.profile),
            obj.eid,
            Verification.fromObject(obj.verification),
        )
    }

}