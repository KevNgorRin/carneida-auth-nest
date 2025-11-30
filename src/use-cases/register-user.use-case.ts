import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { RegisterUserDto } from '@/dtos/register-user.dto'
import { SessionUser } from '@/entities/user.entity'
import { GeneratePasswordHashUseCase } from '@/use-cases/generate-password-hash.use-case'

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @InjectRepository(SessionUser)
        private readonly usersRepository: Repository<SessionUser>,

        private readonly generatePasswordHash: GeneratePasswordHashUseCase,
    ) {}

    async execute({ data }: { data: RegisterUserDto }): Promise<SessionUser> {
        const { referenceId, email, username, password } = data

        const passwordHash = await this.generatePasswordHash.execute({
            password,
        })

        const user = await this.usersRepository.save(
            this.usersRepository.create({
                referenceId,
                email,
                username,
                passwordHash,
            }),
        )

        return user
    }
}
