export type MediaPlatform = 'tiktok' | 'youtube' | 'twitch'

export default class MediaProfile {

    public readonly id: string
    public readonly platform: MediaPlatform
    public readonly eid: string
    public readonly username: string

    constructor(id: string, platform: MediaPlatform, eid: string, username: string) {
        this.id = id
        this.platform = platform
        this.eid = eid
        this.username = username
    }

    public static fromObject(obj:any){
        return new MediaProfile(
            obj.id,
            obj.platform,
            obj.eid,
            obj.username
        )
    }

}