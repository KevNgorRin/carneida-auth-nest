import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Response } from 'express'
import { Equal, Repository } from 'typeorm'

import { LogInWithCredentialsDto } from '@/dtos/login-with-credentials.dto'
import { SessionUser } from '@/entities/user.entity'
import { AuthError } from '@/enums/auth-errors.enum'
import { PublicSessionTokens } from '@/interfaces/session-tokens.interface'
import { SessionsService } from '@/services/sessions.service'
import { ValidatePasswordUseCase } from '@/use-cases/validate-password.use-case'

@Injectable()
export class LogInWithCredentialsUseCase {
    constructor(
        @InjectRepository(SessionUser)
        private readonly usersRepository: Repository<SessionUser>,

        private readonly validatePassword: ValidatePasswordUseCase,
        private readonly sessionsService: SessionsService,
    ) {}

    async execute({
        data,
        response,
    }: {
        data: LogInWithCredentialsDto
        response: Response
    }): Promise<PublicSessionTokens> {
        const { emailOrUsername, password } = data

        const field = emailOrUsername.includes('@') ? 'email' : 'username'

        const user = await this.usersRepository.findOne({
            where: { [field]: Equal(emailOrUsername) },
            select: {
                id: true,
                email: true,
                passwordHash: true,
            },
        })

        if (!user) {
            throw new UnauthorizedException(AuthError.USER_NOT_FOUND)
        }

        const passwordMatches = await this.validatePassword.execute({
            password,
            hash: user.passwordHash,
        })

        if (!passwordMatches) {
            throw new UnauthorizedException(AuthError.INVALID_CREDENTIALS)
        }

        return this.sessionsService.open({ user, response })
    }
}
