import { UUID } from 'crypto'

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Response } from 'express'
import { Repository } from 'typeorm'

import { CarneidaAuthModuleOptions } from '@/carneida.module'
import { CARNEIDA_OPTIONS } from '@/constants/config.constants'
import {
    accessTokenCookieName,
    refreshTokenCookieName,
} from '@/constants/cookie-names.constants'
import { ValidateRefreshTokenDto } from '@/dtos/validate-refresh-token.dto'
import { Session } from '@/entities/session.entity'
import { SessionUser } from '@/entities/user.entity'
import { AuthError } from '@/enums/auth-errors.enum'
import { getCookieOptions } from '@/helpers/get-cookie-options.helper'
import {
    PublicSessionTokens,
    SessionTokenPayload,
    SessionTokens,
} from '@/interfaces/session-tokens.interface'

@Injectable()
export class SessionsService {
    private readonly isProduction: boolean

    constructor(
        @Inject(CARNEIDA_OPTIONS)
        private options: CarneidaAuthModuleOptions,

        @InjectRepository(Session)
        private readonly sessionsRepository: Repository<Session>,

        private readonly jwtService: JwtService,
    ) {
        this.isProduction = this.options.NODE_ENV.startsWith('prod')
    }

    async open({
        user,
        response,
    }: {
        user: SessionUser
        response: Response
    }): Promise<PublicSessionTokens> {
        const tokens = await this.generateTokens(user.id, user.email)

        await this.sessionsRepository.save(
            this.sessionsRepository.create({ user, ...tokens }),
        )

        response.cookie(
            accessTokenCookieName,
            tokens.accessToken,
            getCookieOptions({
                secure: this.isProduction,
                httpOnly: false,
            }),
        )
        response.cookie(
            refreshTokenCookieName,
            tokens.refreshToken,
            getCookieOptions({
                secure: this.isProduction,
            }),
        )

        return { accessToken: tokens.accessToken }
    }

    async refresh({
        refreshToken,
        response,
    }: {
        refreshToken: string
        response: Response
    }): Promise<PublicSessionTokens> {
        const payload = this.jwtService.decode(refreshToken)
        const newAccessToken = this.generateAccessToken({
            payload: {
                sub: payload.sub as UUID,
                email: payload.email,
            },
        })

        await this.sessionsRepository.update(
            { refreshToken },
            { accessToken: newAccessToken },
        )

        response.cookie(
            accessTokenCookieName,
            newAccessToken,
            getCookieOptions({
                secure: this.isProduction,
                httpOnly: false,
            }),
        )

        return { accessToken: newAccessToken }
    }

    async validate({ accessToken }: { accessToken: string }): Promise<Session> {
        try {
            this.jwtService.verify(accessToken, {
                secret: this.options.JWT_SECRET,
            })
        } catch {
            throw new UnauthorizedException(AuthError.INVALID_TOKEN)
        }

        const session = await this.sessionsRepository.findOne({
            where: { accessToken },
            relations: { user: true },
        })

        if (!session) {
            throw new UnauthorizedException(AuthError.SESSION_NOT_VALID)
        }

        return session
    }

    async validateRefreshToken({
        refreshToken,
    }: ValidateRefreshTokenDto): Promise<Session> {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.options.JWT_SECRET,
            })
        } catch {
            throw new UnauthorizedException(AuthError.INVALID_TOKEN)
        }

        const session = await this.sessionsRepository.findOne({
            where: { refreshToken },
        })

        if (!session) {
            throw new UnauthorizedException(AuthError.SESSION_NOT_VALID)
        }

        return session
    }

    private generateTokens(userId: UUID, email: string): SessionTokens {
        const payload: SessionTokenPayload = { sub: userId, email }

        const accessToken = this.generateAccessToken({ payload })
        const refreshToken = this.generateRefreshToken({ payload })

        return { accessToken, refreshToken }
    }

    private generateAccessToken({
        payload,
    }: {
        payload: SessionTokenPayload
    }): string {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.options.JWT_SECRET,
            expiresIn: '15m',
        })

        return accessToken
    }

    private generateRefreshToken({
        payload,
    }: {
        payload: SessionTokenPayload
    }): string {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.options.JWT_SECRET,
            expiresIn: '7d',
        })

        return refreshToken
    }
}
