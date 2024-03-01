import Session from "./Session";

export default class SSO {

    private static instance: SSO | null
    private _session: Session | null
    public readonly product: string

    private constructor(product: string) {
        this.product = product
        try {
            this._session = Session.retrieve()
        } catch (error) {
            this._session = null
        }
    }

    public static getInstance(product?: string) {
        if (!SSO.instance || SSO.instance.product != product) {
            SSO.instance = new SSO(product!)
        }
        return SSO.instance
    }

    public get logged(): boolean {
        return this._session != null && this._session.valid
    }

    public get session(): Session | null {
        return this._session
    }


    public async login(service: string, state: string = (Math.random() + 1).toString(36).substring(7)): Promise<Session> {
        const redirect_uri = `https://${this.product}`
        return new Promise(async (resolve, reject) => {
            let success: boolean = false
            const handleResponse = async (ev: MessageEvent<any>, tab: Window) => {
                if (ev.data.type !== "authorization_response") return
                const response = ev.data.response.response
                if (response.state != state) reject('invalid state')
                const session = await Session.exchangeCode(response.code, redirect_uri)
                tab.close()
                success = true
                session.store()
                this._session = session
                resolve(session)
            }
            const tab = window.open(`https://sso.nominal.es/authorize?method=${service}&response_type=code&redirect_uri=${redirect_uri}&audience=${this.product}&state=${state}`)
            if (tab == null) {
                reject('error while opening tab')
                return
            }
            tab.addEventListener('message', async (ev) => {
                await handleResponse(ev, tab)
            })
            tab.addEventListener('unload ', () => {
                if (!success) reject('closed')
                return
            })
            const interval = setInterval(() => {
                if (tab.closed) {
                    reject('closed')
                    clearInterval(interval)
                }
            }, 100)
            window.addEventListener('message', async (ev) => {
                await handleResponse(ev, tab)
            })
        })
    }

    public async fetch(endpoint: string, body?: any): Promise<any> {
        await this._session!.renewIfDue()
        const headers = new Headers()
        if (body) headers.set('Content-Type', 'application/json')
        headers.set('Authorization', `Bearer ${this._session!.access.token}`)
        const response = await fetch(`https://sso.nominal.es/${endpoint}`, {
            method: body != null ? 'POST' : 'GET',
            body: body ? JSON.stringify(body) : undefined,
            headers
        })
        const data = await response.json()
        if (data?.message?.includes("expired")) {
            this._session?.clear()
            this._session = null
            throw new Error("expired")
        }
        return data
    }

}