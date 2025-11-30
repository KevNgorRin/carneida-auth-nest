import * as bcrypt from 'bcrypt'

export class ValidatePasswordUseCase {
    constructor() {}

    async execute({
        password,
        hash,
    }: {
        password: string
        hash: string
    }): Promise<boolean> {
        const passwordMatches = await bcrypt.compare(password, hash)
        return passwordMatches
    }
}
