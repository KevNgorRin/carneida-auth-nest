import { Body, Controller, Post, Put, Req, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { LogInWithCredentialsDto } from '@/dtos/login-with-credentials.dto'
import { PublicSessionTokens } from '@/dtos/public-session-tokens'
import { LogInWithCredentialsUseCase } from '@/use-cases/login-with-credentials.use-case'
import { RefreshTokenUseCase } from '@/use-cases/refresh-token.use-case'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly logInWithCredentials: LogInWithCredentialsUseCase,
        private readonly refreshToken: RefreshTokenUseCase,
    ) {}

    @ApiOperation({
        summary: 'Log in with credentials (username/email and password)',
    })
    @ApiResponse({
        status: 201,
        description: 'OK',
        type: PublicSessionTokens,
    })
    @Put('login')
    async logIn(
        @Body() data: LogInWithCredentialsDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<PublicSessionTokens> {
        return this.logInWithCredentials.execute({ data, response })
    }

    @ApiOperation({
        summary: 'Refresh access token by refresh token',
    })
    @ApiResponse({
        status: 200,
        description: 'OK',
        type: PublicSessionTokens,
    })
    @Post('refresh')
    async refresh(@Req() request: Request): Promise<PublicSessionTokens> {
        return this.refreshToken.execute({ request })
    }
}
