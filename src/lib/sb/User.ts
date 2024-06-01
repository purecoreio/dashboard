import type Community from "./Community";
import Srvbench from "./Srvbench";
import DeveloperProfile from "./developer/DeveloperProfile";
import Machine from "./machine/Machine";
import HostingImage from "./machine/container/HostingImage";
import HostingTemplate from "./machine/container/HostingTemplate";
import Creator from "./media/Creator";
import MediaProfile from "./media/MediaProfile";
import type { MediaPlatform } from "./media/MediaProfile";
import Submission from "./media/Submission";
import SubmissionResult from "./media/SubmissionResult";

export default class User {

    // developer profiles

    public async getDeveloperProfiles(): Promise<DeveloperProfile[]> {
        return (await Srvbench.getInstance().rest('developer')).map((d: any) => DeveloperProfile.fromObj(d, this))
    }

    // machines

    public async getMachines() {
        return (await Srvbench.getInstance().rest('machine')).map((m: any) => Machine.fromObject(m))
    }

    public async createMachine() {
        return Machine.fromObject(await Srvbench.getInstance().rest('machine', {}))
    }

    // hosting templates

    public async getHostingTemplates() {
        return (await Srvbench.getInstance().rest('hosting/template')).map((m: any) => HostingTemplate.fromObject(m))
    }

    public async createHostingTemplate(image: HostingImage, name: string | null) {
        return HostingTemplate.fromObject(await Srvbench.getInstance().rest('hosting/template', {
            image: image.id,
            name
        }))
    }

    // hosting images

    public async getHostingImages() {
        return (await Srvbench.getInstance().rest('hosting/image')).map((m: any) => HostingImage.fromObject(m))
    }

    public async createHostingImage(uri: string) {
        return HostingImage.fromObject(await Srvbench.getInstance().rest('hosting/image', {
            uri
        }))
    }


    // media

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

    public async linkDeveloperProfile(platform: string = 'github'): Promise<void> {
        const { url } = await Srvbench.getInstance().rest('developer', {
            platform
        })
        return new Promise((resolve, reject) => {
            let opened = window.open(url, '_blank')
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

}