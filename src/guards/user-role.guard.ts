import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

import { AuthError } from '@/enums/auth-errors.enum'

@Injectable()
export abstract class UserRoleGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const sessionUser = request['currentSessionUser']

        if (!sessionUser) {
            throw new UnauthorizedException(AuthError.USER_NOT_AUTHENTICATED)
        }

        return this.extraValidate ? await this.extraValidate({ request }) : true
    }

    abstract extraValidate({
        request,
    }: {
        request: Request
    }): Promise<boolean> | boolean
}
