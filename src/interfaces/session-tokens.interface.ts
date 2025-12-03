export interface SessionTokens {
    accessToken: string
    refreshToken: string
}

export interface SessionTokenPayload {
    sub: string
    email: string
}
