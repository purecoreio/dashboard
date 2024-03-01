export default class Token {

    public readonly token: string
    public readonly expiry: Date
    public readonly payload: any

    constructor(token: string, expiry: Date, payload: any) {
        this.token = token
        this.expiry = expiry
        this.payload = payload
    }

    public static fromJWT(jwt: string): Token {
        const base64Url = jwt.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        const expiry = new Date(payload.exp*1000)
        return new Token(jwt, expiry, payload)
    }

}