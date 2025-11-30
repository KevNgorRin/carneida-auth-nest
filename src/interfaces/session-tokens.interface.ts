export interface SessionTokens {
    accessToken: string
    refreshToken: string
}

export type PublicSessionTokens = Pick<SessionTokens, 'accessToken'>

export interface SessionTokenPayload {
    sub: string
    email: string
}
