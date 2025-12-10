import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'

import { refreshTokenCookieName } from '@/constants/cookie-names.constants'
import { PublicSessionTokens } from '@/dtos/public-session-tokens'
import { AuthError } from '@/enums/auth-errors.enum'
import { SessionsService } from '@/services/sessions.service'

@Injectable()
export class RefreshTokenUseCase {
    constructor(private readonly sessionsService: SessionsService) {}

    async execute({
        request,
        response,
    }: {
        request: Request
        response: Response
    }): Promise<PublicSessionTokens> {
        const refreshToken = request.headers.cookie
            ?.split('; ')
            .find((cookie) => cookie.startsWith(`${refreshTokenCookieName}=`))
            ?.split('=')[1]
            ?.trim()

        const session = await this.sessionsService.validateRefreshToken({
            refreshToken,
        })

        if (!session) {
            throw new UnauthorizedException(AuthError.SESSION_NOT_VALID)
        }

        return this.sessionsService.refresh({ refreshToken, response })
    }
}
