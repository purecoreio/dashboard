import type Community from "./Community";
import Srvbench from "./Srvbench";
import Creator from "./media/Creator";
import MediaProfile from "./media/MediaProfile";
import type { MediaPlatform } from "./media/MediaProfile";
import Submission from "./media/Submission";
import SubmissionResult from "./media/SubmissionResult";

export default class User {


    public async linkMediaSource(platform: MediaPlatform): Promise<void> {
        const link = await Srvbench.getInstance().rest(`media/sources/${platform}`, {})
        return new Promise((resolve, reject) => {
            let opened = window.open(link.url, '_blank')
            if (!opened) reject()
            let interval = setInterval(() => {
                if (opened!.closed) {
                    clearInterval(interval)
                    resolve()
                    return
                }
            }, 100)
        })
    }

    public async listMediaSources(): Promise<MediaProfile[]> {
        return (await Srvbench.getInstance().rest(`media/sources`)).map((p: any) => MediaProfile.fromObject(p))
    }

    public async listMediaProfiles(): Promise<Creator[]> {
        return (await Srvbench.getInstance().rest(`media/profiles`)).map((p: any) => Creator.fromObject(p))
    }

    public async joinAsCreator(id: string): Promise<Creator> {
        return Creator.fromObject((await Srvbench.getInstance().rest(`community/${id}/media/profiles`, {})))
    }

    public async submitContent(community: Community, platform: MediaPlatform, eid: string) {
        return SubmissionResult.fromObject(await Srvbench.getInstance().rest(`community/${community.id}/media/submissions`, {
            platform,
            eid
        }))
    }

    public async getSubmissions(page: number = 0) {
        return (await Srvbench.getInstance().rest('media/submissions', {
            page
        })).map((s: any) => Submission.fromObject(s))
    }

}