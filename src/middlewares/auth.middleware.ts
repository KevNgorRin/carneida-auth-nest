import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { AuthError } from '@/enums/auth-errors.enum'
import { SessionsService } from '@/services/sessions.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly sessionsService: SessionsService) {}

    async use(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers['authorization']
        const accessToken = authHeader?.split(' ')[1]

        if (!authHeader || !authHeader.startsWith('Bearer ') || !accessToken) {
            throw new UnauthorizedException(AuthError.NO_TOKEN_PROVIDED)
        }

        try {
            const session = await this.sessionsService.validate({ accessToken })

            if (!session) {
                throw new UnauthorizedException(AuthError.SESSION_NOT_VALID)
            }

            request['currentSession'] = session
            request['currentSessionUser'] = session.user
            next()
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }
}
