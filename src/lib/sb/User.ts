import Srvbench from "./Srvbench";
import Creator from "./media/Creator";
import MediaProfile from "./media/MediaProfile";
import type { MediaPlatform } from "./media/MediaProfile";

export default class User {


    public async linkMediaSource(platform: MediaPlatform) {
        const link = await Srvbench.getInstance().rest(`media/sources/${platform}`, {})
        window.open(link.url, '_blank')
    }

    public async listMediaSources(): Promise<MediaProfile[]> {
        return (await Srvbench.getInstance().rest(`media/sources`)).map((p: any) => MediaProfile.fromObject(p))
    }

    public async listMediaProfiles(): Promise<Creator[]> {
        return (await Srvbench.getInstance().rest(`media/profiles`)).map((p: any) => Creator.fromObject(p))
    }

    public async joinAsCreator(id:string): Promise<Creator> {
        return Creator.fromObject((await Srvbench.getInstance().rest(`community/${id}/media/profiles`, {})))
    }

}