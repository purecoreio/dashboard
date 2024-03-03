import Community from "../Community"
import Member from "../Member"
import Creator from "./Creator"
import type { MediaPlatform } from "./MediaProfile"
import MediaProfile from "./MediaProfile"
import Verification from "./Verification"


export default class Submission {

    public readonly id: string
    public readonly created: Date
    public readonly creator: Creator
    public readonly profile: MediaProfile
    public readonly eid: string
    public readonly verification: Verification
    public readonly member: Member

    constructor(id: string, created: Date, creator: Creator, profile: MediaProfile, eid: string, verification: Verification, member: Member) {
        this.id = id
        this.created = created
        this.creator = creator
        this.profile = profile
        this.eid = eid
        this.verification = verification
        this.member = member
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

}
const youtube =
    new MediaProfile(
        'a',
        'youtube',
        'b',
        'quiquelhappy'
    )

const member =
    new Member(
        'a',
        'b',
        'minecraft',
        'quiquelhappy',
        [],
        new Date(),
        0
    )

export const mock = new Submission(
    'a',
    new Date(),
    new Creator(
        'a',
        'aaa',
        [youtube],
        new Community(
            'a', 'a', 'a'
        ),
        member
    ),
    youtube,
    'b',
    new Verification(
        null,
        null,
        null
    ),
    member
)