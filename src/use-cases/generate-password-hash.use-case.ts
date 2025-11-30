import * as bcrypt from 'bcrypt'

export class GeneratePasswordHashUseCase {
    constructor() {}

    async execute({ password }: { password: string }): Promise<string> {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    }
}
